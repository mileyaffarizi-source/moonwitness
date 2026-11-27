import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ADDON_CAPABILITIES = Object.freeze([
  "api.route", "api.usecase", "api.model", "api.model-extension",
  "agent.tool", "agent.workflow", "web.navigation", "web.component",
  "event.publisher", "event.subscriber", "job.worker", "oss.contribution", "bss.contribution",
]);

export const ADDON_PERMISSIONS = Object.freeze({
  "records.read": { risk: "read_only", approval: "none" },
  "records.write": { risk: "write_reversible", approval: "per_operation" },
  "events.publish": { risk: "write_reversible", approval: "per_operation" },
  "events.subscribe": { risk: "read_only", approval: "none" },
  "jobs.schedule": { risk: "write_reversible", approval: "per_operation" },
  "agent.invoke-api": { risk: "write_reversible", approval: "per_operation" },
  "web.navigation": { risk: "read_only", approval: "none" },
  "storage.addon-owned": { risk: "write_reversible", approval: "per_operation" },
  "external.side-effect": { risk: "external_side_effect", approval: "human_required" },
});

const MANIFEST_FIELDS = new Set([
  "manifestVersion", "id", "name", "version", "description", "owner", "license",
  "compatibility", "dependencies", "capabilities", "permissions", "contributions",
  "models", "extensions", "storage", "configuration", "provenance", "health",
]);
const CONTRIBUTION_TYPES = new Set([
  "api.route", "api.usecase", "agent.tool", "agent.workflow", "web.navigation",
  "web.component", "event.publisher", "event.subscriber", "job.worker",
  "oss.contribution", "bss.contribution",
]);
const PERMISSION_IDS = new Set(Object.keys(ADDON_PERMISSIONS));
const SEMVER_RE = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const RANGE_RE = /^>=(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*) <(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
const FORBIDDEN_DEPENDENCIES = [
  /^@mikro-orm\//, /^mikro-orm$/, /^@prisma\//, /^prisma$/,
  /^pg$/, /^pg-native$/, /^mysql$/, /^mysql2$/, /^sqlite3$/, /^better-sqlite3$/,
  /^mongodb$/, /^mongoose$/, /^typeorm$/, /^sequelize$/, /^drizzle-orm$/, /^knex$/,
  /^fastify$/, /^@fastify\//, /^express$/, /^koa$/,
];
const FORBIDDEN_IMPORTS = [
  ...FORBIDDEN_DEPENDENCIES,
  /^(?:node:)?child_process$/,
  /^(?:node:)?vm$/,
  /^(?:node:)?worker_threads$/,
  /^(?:node:)?cluster$/,
  /^(?:node:)?http$/,
  /^(?:node:)?https$/,
  /^(?:node:)?net$/,
  /^(?:node:)?tls$/,
  /^(?:node:)?dns$/,
  /^@moonwitness\/(?:api|orm-internal|persistence-internal)(?:\/|$)/,
  /^(?:node:)?fs(?:\/.*)?$/,
  /^(?:node:)?process$/,
  /^(?:node:)?module$/,
  /^(?:node:)?os$/,
  /^(?:node:)?inspector$/,
  /^(?:node:)?repl$/,
  /^(?:node:)?dgram$/,
  /^apps\/(?:api|id|agent)(?:\/|$)/,
];

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function addError(errors, code, path, message) {
  errors.push({ code, path, message });
}

function resolveSchemaReference(rootSchema, reference) {
  if (typeof reference !== "string" || !reference.startsWith("#/")) return null;
  const segments = reference.slice(2).split("/").map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"));
  let current = rootSchema;
  for (const segment of segments) {
    if (!isRecord(current) || !(segment in current)) return null;
    current = current[segment];
  }
  return current;
}

function jsonValuesEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function validateJsonSchema(schema, value, rootSchema = schema, path = "$") {
  const errors = [];
  if (!isRecord(schema)) {
    addError(errors, "INVALID_SCHEMA", path, "schema node must be an object");
    return errors;
  }

  if (schema.$ref !== undefined) {
    const referenced = resolveSchemaReference(rootSchema, schema.$ref);
    if (!referenced) {
      addError(errors, "UNRESOLVED_SCHEMA_REF", path, "cannot resolve schema reference " + String(schema.$ref));
      return errors;
    }
    return validateJsonSchema(referenced, value, rootSchema, path);
  }

  if (schema.oneOf !== undefined) {
    if (!Array.isArray(schema.oneOf)) {
      addError(errors, "INVALID_SCHEMA_ONE_OF", path, "oneOf must be an array");
      return errors;
    }
    const matches = schema.oneOf.filter((candidate) =>
      validateJsonSchema(candidate, value, rootSchema, path).length === 0,
    ).length;
    if (matches !== 1) {
      addError(errors, "SCHEMA_ONE_OF", path, "value must match exactly one schema branch");
      return errors;
    }
    return errors;
  }

  if (schema.const !== undefined && !jsonValuesEqual(value, schema.const)) {
    addError(errors, "SCHEMA_CONST", path, "value must equal " + JSON.stringify(schema.const));
    return errors;
  }
  if (Array.isArray(schema.enum) && !schema.enum.some((item) => jsonValuesEqual(item, value))) {
    addError(errors, "SCHEMA_ENUM", path, "value is not in the allowed enum");
    return errors;
  }

  const typeMatches = {
    object: isRecord(value),
    array: Array.isArray(value),
    string: typeof value === "string",
    number: typeof value === "number" && Number.isFinite(value),
    integer: Number.isInteger(value),
    boolean: typeof value === "boolean",
    null: value === null,
  };
  if (schema.type !== undefined) {
    const allowedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowedTypes.some((type) => typeMatches[type] === true)) {
      addError(errors, "SCHEMA_TYPE", path, "expected " + allowedTypes.join(" or "));
      return errors;
    }
  }

  if (typeof value === "string") {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      addError(errors, "SCHEMA_MIN_LENGTH", path, "string is shorter than minLength " + schema.minLength);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      addError(errors, "SCHEMA_MAX_LENGTH", path, "string exceeds maxLength " + schema.maxLength);
    }
    if (schema.pattern !== undefined) {
      let patternMatches = false;
      try { patternMatches = new RegExp(schema.pattern).test(value); } catch {}
      if (!patternMatches) addError(errors, "SCHEMA_PATTERN", path, "string does not match required pattern");
    }
  }

  if (isRecord(value)) {
    for (const required of schema.required ?? []) {
      if (!Object.prototype.hasOwnProperty.call(value, required)) {
        addError(errors, "SCHEMA_REQUIRED", path + "." + required, "required property is missing");
      }
    }
    const properties = isRecord(schema.properties) ? schema.properties : {};
    if (schema.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!(key in properties)) addError(errors, "SCHEMA_ADDITIONAL_PROPERTY", path + "." + key, "unknown property is not allowed");
      }
    }
    for (const [key, propertySchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(...validateJsonSchema(propertySchema, value[key], rootSchema, path + "." + key));
      }
    }
  }

  if (Array.isArray(value)) {
    if (schema.uniqueItems === true) {
      const seen = new Set();
      value.forEach((item, index) => {
        const key = JSON.stringify(item);
        if (seen.has(key)) addError(errors, "SCHEMA_UNIQUE_ITEMS", path + "[" + index + "]", "array items must be unique");
        seen.add(key);
      });
    }
    if (schema.items !== undefined) {
      value.forEach((item, index) => {
        errors.push(...validateJsonSchema(schema.items, item, rootSchema, path + "[" + index + "]"));
      });
    }
  }

  return errors;
}
function parseSemver(value) {
  if (typeof value !== "string" || !SEMVER_RE.test(value)) return null;
  const core = value.split(/[+-]/, 1)[0];
  const parts = core.split(".").map(Number);
  return parts.length === 3 ? parts : null;
}
function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] < right[index] ? -1 : 1;
  }
  return 0;
}
export function isSupportedVersionRange(value) {
  const match = typeof value === "string" ? value.match(RANGE_RE) : null;
  if (!match) return false;
  return compareVersions(match.slice(1, 4).map(Number), match.slice(4, 7).map(Number)) < 0;
}
export function satisfiesSupportedRange(version, range) {
  const installed = parseSemver(version);
  const match = typeof range === "string" ? range.match(RANGE_RE) : null;
  if (!installed || !match) return false;
  const minimum = match.slice(1, 4).map(Number);
  const maximum = match.slice(4, 7).map(Number);
  return compareVersions(installed, minimum) >= 0 && compareVersions(installed, maximum) < 0;
}
function isSafeRelativePath(value) {
  if (typeof value !== "string" || !value.startsWith("./")) return false;
  if (value.includes("\\") || value.includes("\0") || value.includes("://")) return false;
  const segments = value.slice(2).split("/");
  return segments.length > 0 &&
    segments.every((segment) => segment.length > 0 && segment !== "." && segment !== "..") &&
    !segments.includes("node_modules");
}
function riskRank(value) {
  return ({ read_only: 0, write_reversible: 1, external_side_effect: 2 })[value] ?? -1;
}
function approvalRank(value) {
  return ({ none: 0, per_operation: 1, human_required: 2 })[value] ?? -1;
}
function validateFieldList(fields, path, errors) {
  if (!Array.isArray(fields)) {
    addError(errors, "INVALID_FIELDS", path, "must be an array");
    return;
  }
  const ids = new Set();
  fields.forEach((field, index) => {
    const itemPath = path + "[" + index + "]";
    if (!isRecord(field) || typeof field.id !== "string" || !/^[a-z][a-z0-9_]*$/.test(field.id)) {
      addError(errors, "INVALID_FIELD_ID", itemPath, "field must have a valid stable id");
      return;
    }
    if (ids.has(field.id)) addError(errors, "DUPLICATE_FIELD", itemPath, "duplicate field id: " + field.id);
    ids.add(field.id);
    if (!["string", "text", "integer", "decimal", "boolean", "date", "datetime", "json", "reference"].includes(field.type)) {
      addError(errors, "INVALID_FIELD_TYPE", itemPath + ".type", "unsupported type: " + String(field.type));
    }
  });
}

export function validateAddonManifest(manifest, expectedSlug = null) {
  const errors = [];
  if (!isRecord(manifest)) {
    addError(errors, "INVALID_MANIFEST", "$", "manifest root must be an object");
    return errors;
  }
  for (const key of Object.keys(manifest)) {
    if (!MANIFEST_FIELDS.has(key)) addError(errors, "UNKNOWN_MANIFEST_FIELD", key, "unknown fields are not allowed in manifest v1");
  }
  for (const key of ["manifestVersion", "id", "name", "version", "description", "license"]) {
    if (typeof manifest[key] !== "string" || manifest[key].trim().length === 0) {
      addError(errors, "REQUIRED_FIELD", key, "must be a non-empty string");
    }
  }
  if (manifest.manifestVersion !== "1.0.0") addError(errors, "UNSUPPORTED_MANIFEST_VERSION", "manifestVersion", "only 1.0.0 is supported");
  const slug = typeof manifest.id === "string" && manifest.id.startsWith("moonwitness.addon.")
    ? manifest.id.slice("moonwitness.addon.".length) : null;
  if (!slug || !/^[a-z][a-z0-9-]*$/.test(slug)) {
    addError(errors, "INVALID_ADDON_ID", "id", "must be moonwitness.addon.<lowercase-slug>");
  } else if (expectedSlug && slug !== expectedSlug) {
    addError(errors, "ADDON_ID_PATH_MISMATCH", "id", "slug " + slug + " does not match package directory " + expectedSlug);
  }
  if (!parseSemver(manifest.version)) addError(errors, "INVALID_VERSION", "version", "must be valid SemVer");
  if (typeof manifest.name === "string" && (manifest.name.length < 3 || manifest.name.length > 100)) {
    addError(errors, "INVALID_NAME", "name", "must contain 3 to 100 characters");
  }
  if (typeof manifest.description === "string" && (manifest.description.length < 20 || manifest.description.length > 500)) {
    addError(errors, "INVALID_DESCRIPTION", "description", "must contain 20 to 500 characters");
  }

  if (!isRecord(manifest.owner) || typeof manifest.owner.team !== "string" || !/^[a-z][a-z0-9-]{1,39}$/.test(manifest.owner.team)) {
    addError(errors, "INVALID_OWNER", "owner", "must declare one owning team slug");
  } else if (Object.keys(manifest.owner).some((key) => !["team", "contact"].includes(key))) {
    addError(errors, "UNKNOWN_OWNER_FIELD", "owner", "only team and contact are supported");
  }

  if (!isRecord(manifest.compatibility)) {
    addError(errors, "INVALID_COMPATIBILITY", "compatibility", "must declare platformApi, addonSdk and node");
  } else {
    for (const key of ["platformApi", "addonSdk"]) {
      if (!isSupportedVersionRange(manifest.compatibility[key])) {
        addError(errors, "INVALID_COMPATIBILITY_RANGE", "compatibility." + key, "use explicit bounded range >=x.y.z <a.b.c");
      }
    }
    if (manifest.compatibility.node !== ">=26.13.0 <27.0.0") {
      addError(errors, "UNSUPPORTED_NODE_RANGE", "compatibility.node", "must match the repository Node 26 baseline");
    }
    if (Object.keys(manifest.compatibility).some((key) => !["platformApi", "addonSdk", "node"].includes(key))) {
      addError(errors, "UNKNOWN_COMPATIBILITY_FIELD", "compatibility", "unknown compatibility keys are not allowed");
    }
  }

  const dependencyGroups = ["required", "optional"];
  const seenDependencies = new Set();
  if (!isRecord(manifest.dependencies)) {
    addError(errors, "INVALID_DEPENDENCIES", "dependencies", "must declare required and optional arrays");
  } else {
    for (const group of dependencyGroups) {
      const values = manifest.dependencies[group];
      if (!Array.isArray(values)) {
        addError(errors, "INVALID_DEPENDENCY_GROUP", "dependencies." + group, "must be an array");
        continue;
      }
      values.forEach((dependency, index) => {
        const path = "dependencies." + group + "[" + index + "]";
        if (!isRecord(dependency) || typeof dependency.id !== "string" || !/^moonwitness\.addon\.[a-z][a-z0-9-]*$/.test(dependency.id)) {
          addError(errors, "INVALID_DEPENDENCY", path, "must contain a valid add-on ID and bounded version range");
          return;
        }
        if (dependency.id === manifest.id) addError(errors, "SELF_DEPENDENCY", path + ".id", "an add-on cannot depend on itself");
        if (seenDependencies.has(dependency.id)) addError(errors, "DUPLICATE_DEPENDENCY", path + ".id", "duplicate dependency: " + dependency.id);
        seenDependencies.add(dependency.id);
        if (!isSupportedVersionRange(dependency.version)) addError(errors, "INVALID_DEPENDENCY_RANGE", path + ".version", "use an explicit bounded SemVer range");
        if (Object.keys(dependency).some((key) => !["id", "version"].includes(key))) {
          addError(errors, "UNKNOWN_DEPENDENCY_FIELD", path, "only id and version are supported");
        }
      });
    }
    if (Object.keys(manifest.dependencies).some((key) => !dependencyGroups.includes(key))) {
      addError(errors, "UNKNOWN_DEPENDENCY_GROUP", "dependencies", "only required and optional groups are supported");
    }
  }

  const declaredCapabilities = new Set();
  if (!Array.isArray(manifest.capabilities)) {
    addError(errors, "INVALID_CAPABILITIES", "capabilities", "must be an array");
  } else {
    manifest.capabilities.forEach((capability, index) => {
      if (typeof capability !== "string" || !ADDON_CAPABILITIES.includes(capability)) {
        addError(errors, "UNKNOWN_CAPABILITY", "capabilities[" + index + "]", "capability is not registered: " + String(capability));
      } else if (declaredCapabilities.has(capability)) {
        addError(errors, "DUPLICATE_CAPABILITY", "capabilities[" + index + "]", "duplicate capability: " + capability);
      } else declaredCapabilities.add(capability);
    });
  }

  const declaredPermissions = new Map();
  if (!Array.isArray(manifest.permissions)) {
    addError(errors, "INVALID_PERMISSIONS", "permissions", "must be an array");
  } else {
    manifest.permissions.forEach((permission, index) => {
      const path = "permissions[" + index + "]";
      if (!isRecord(permission) || typeof permission.id !== "string" || !PERMISSION_IDS.has(permission.id)) {
        addError(errors, "UNKNOWN_PERMISSION", path, "permission is not registered: " + String(permission?.id));
        return;
      }
      if (declaredPermissions.has(permission.id)) addError(errors, "DUPLICATE_PERMISSION", path, "duplicate permission: " + permission.id);
      const minimum = ADDON_PERMISSIONS[permission.id];
      if (riskRank(permission.risk) < riskRank(minimum.risk)) addError(errors, "PERMISSION_RISK_UNDERSTATED", path + ".risk", permission.id + " requires at least " + minimum.risk);
      if (approvalRank(permission.approval) < approvalRank(minimum.approval)) addError(errors, "PERMISSION_APPROVAL_WEAK", path + ".approval", permission.id + " requires at least " + minimum.approval);
      if (typeof permission.scope !== "string" || permission.scope.trim().length < 3 || permission.scope.includes("*")) {
        addError(errors, "INVALID_PERMISSION_SCOPE", path + ".scope", "must be a narrow non-wildcard resource scope");
      }
      if (typeof permission.rationale !== "string" || permission.rationale.trim().length < 12) {
        addError(errors, "MISSING_PERMISSION_RATIONALE", path + ".rationale", "explain why the permission is needed");
      }
      if (Object.keys(permission).some((key) => !["id", "scope", "risk", "approval", "rationale"].includes(key))) {
        addError(errors, "UNKNOWN_PERMISSION_FIELD", path, "unknown permission fields are not allowed");
      }
      declaredPermissions.set(permission.id, permission);
    });
  }

  const contributionIds = new Set();
  if (!Array.isArray(manifest.contributions)) {
    addError(errors, "INVALID_CONTRIBUTIONS", "contributions", "must be an array");
  } else {
    manifest.contributions.forEach((contribution, index) => {
      const path = "contributions[" + index + "]";
      if (!isRecord(contribution)) {
        addError(errors, "INVALID_CONTRIBUTION", path, "must be an object");
        return;
      }
      const prefix = (slug ?? "invalid") + ".";
      if (typeof contribution.id !== "string" || !contribution.id.startsWith(prefix) || !/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/.test(contribution.id)) {
        addError(errors, "INVALID_CONTRIBUTION_ID", path + ".id", "must be namespaced with the add-on slug");
      }
      if (contributionIds.has(contribution.id)) addError(errors, "DUPLICATE_CONTRIBUTION", path + ".id", "duplicate contribution ID: " + contribution.id);
      contributionIds.add(contribution.id);
      if (!CONTRIBUTION_TYPES.has(contribution.type) || !declaredCapabilities.has(contribution.type)) {
        addError(errors, "UNDECLARED_CONTRIBUTION_CAPABILITY", path + ".type", "contribution type must be registered in capabilities");
      }
      if (!isSafeRelativePath(contribution.entrypoint)) addError(errors, "UNSAFE_ENTRYPOINT", path + ".entrypoint", "must be a safe relative path inside the package");
      if (!Array.isArray(contribution.capabilities) || contribution.capabilities.some((item) => !declaredCapabilities.has(item))) {
        addError(errors, "UNDECLARED_CONTRIBUTION_CAPABILITY", path + ".capabilities", "every contribution capability must be declared by the add-on");
      }
      if (!Array.isArray(contribution.permissions) || contribution.permissions.some((item) => !declaredPermissions.has(item))) {
        addError(errors, "UNDECLARED_CONTRIBUTION_PERMISSION", path + ".permissions", "every contribution permission must be declared by the add-on");
      }
      if (Object.keys(contribution).some((key) => !["id", "type", "entrypoint", "capabilities", "permissions"].includes(key))) {
        addError(errors, "UNKNOWN_CONTRIBUTION_FIELD", path, "unknown contribution fields are not allowed");
      }
    });
  }

  const modelIds = new Set();
  if (!Array.isArray(manifest.models)) {
    addError(errors, "INVALID_MODELS", "models", "must be an array");
  } else {
    manifest.models.forEach((model, index) => {
      const path = "models[" + index + "]";
      const prefix = (slug ?? "invalid") + ".";
      if (!isRecord(model)) {
        addError(errors, "INVALID_MODEL", path, "model declaration must be an object");
        return;
      }
      const validModelId = typeof model.id === "string" &&
        model.id.startsWith(prefix) &&
        /^[a-z][a-z0-9-]*\.[a-z][a-z0-9_]*$/.test(model.id);
      if (!validModelId) {
        addError(errors, "INVALID_MODEL_ID", path + ".id", "model IDs must be namespaced by the add-on slug");
      } else {
        if (modelIds.has(model.id)) addError(errors, "DUPLICATE_MODEL", path + ".id", "duplicate model: " + model.id);
        modelIds.add(model.id);
      }
      if (model.ownership !== "addon-owned") addError(errors, "INVALID_MODEL_OWNERSHIP", path + ".ownership", "new models must be owned by this add-on");
      validateFieldList(model.fields, path + ".fields", errors);
    });
  }

  if (!Array.isArray(manifest.extensions)) {
    addError(errors, "INVALID_EXTENSIONS", "extensions", "must be an array");
  } else {
    const extensionIds = new Set();
    manifest.extensions.forEach((extension, index) => {
      const path = "extensions[" + index + "]";
      const prefix = (slug ?? "invalid") + ".";
      if (!isRecord(extension) || typeof extension.id !== "string" || !extension.id.startsWith(prefix) || !/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/.test(extension.id)) {
        addError(errors, "INVALID_EXTENSION_ID", path + ".id", "extension IDs must be namespaced by the add-on slug");
        return;
      }
      if (extensionIds.has(extension.id)) addError(errors, "DUPLICATE_EXTENSION", path + ".id", "duplicate extension: " + extension.id);
      extensionIds.add(extension.id);
      if (extension.mode !== "additive") addError(errors, "NON_ADDITIVE_EXTENSION", path + ".mode", "manifest v1 supports additive extensions only");
      if (typeof extension.targetModel !== "string" || !/^[a-z][a-z0-9-]*\.[a-z][a-z0-9_]*$/.test(extension.targetModel)) {
        addError(errors, "INVALID_EXTENSION_TARGET", path + ".targetModel", "must identify a platform or domain model");
      } else if (!extension.targetModel.startsWith("moonwitness.") && !extension.targetModel.startsWith(slug + ".")) {
        const ownerSlug = extension.targetModel.split(".")[0];
        const requiredIds = new Set(manifest.dependencies?.required?.map((item) => item.id) ?? []);
        if (!requiredIds.has("moonwitness.addon." + ownerSlug)) {
          addError(errors, "EXTENSION_OWNER_DEPENDENCY_MISSING", path + ".targetModel", "cross-add-on model extensions require a required dependency on the owner add-on");
        }
      }
      validateFieldList(extension.fields, path + ".fields", errors);
      if (!Array.isArray(extension.dependsOn)) addError(errors, "INVALID_EXTENSION_DEPENDENCIES", path + ".dependsOn", "must be an array");
    });
  }

  if (!isRecord(manifest.storage)) {
    addError(errors, "INVALID_STORAGE", "storage", "must declare storage ownership and migration references");
  } else {
    const storage = manifest.storage;
    if (!["addon-owned", "domain-owned", "external"].includes(storage.ownership)) addError(errors, "INVALID_STORAGE_OWNERSHIP", "storage.ownership", "unsupported storage owner");
    if (!Array.isArray(storage.modelIds)) addError(errors, "INVALID_STORAGE_MODELS", "storage.modelIds", "must be an array");
    else for (const modelId of storage.modelIds) {
      if (!modelIds.has(modelId)) addError(errors, "UNOWNED_STORAGE_MODEL", "storage.modelIds", modelId + " is not declared as an add-on-owned model");
    }
    if (!Array.isArray(storage.migrations) || storage.migrations.some((path) => !isSafeRelativePath(path))) {
      addError(errors, "UNSAFE_MIGRATION_PATH", "storage.migrations", "migration paths must be safe package-relative paths");
    }
    if (storage.ownership === "addon-owned") {
      if (storage.domainOwner !== undefined || storage.approvalRef !== undefined) addError(errors, "OWNERSHIP_METADATA_CONFLICT", "storage", "add-on-owned storage must not declare a foreign domain owner/approval");
    } else if (typeof storage.domainOwner !== "string" || typeof storage.approvalRef !== "string") {
      addError(errors, "FOREIGN_STORAGE_APPROVAL_REQUIRED", "storage", "domain-owned/external storage requires domainOwner and approvalRef");
    }
  }

  if (!isRecord(manifest.configuration) || !("schema" in manifest.configuration) ||
      (manifest.configuration.schema !== null && !isSafeRelativePath(manifest.configuration.schema))) {
    addError(errors, "INVALID_CONFIGURATION_SCHEMA", "configuration.schema", "must be null or a safe relative schema path");
  }
  if (!isRecord(manifest.provenance) ||
      typeof manifest.provenance.repository !== "string" || !/^https:\/\//.test(manifest.provenance.repository) ||
      typeof manifest.provenance.sourceCommit !== "string" || !/^[a-f0-9]{40}$/.test(manifest.provenance.sourceCommit) ||
      typeof manifest.provenance.license !== "string" || manifest.provenance.license.trim().length < 2) {
    addError(errors, "INVALID_PROVENANCE", "provenance", "must record HTTPS source repository, 40-character commit and license");
  } else if (manifest.provenance.integrity !== undefined && !/^sha256:[a-f0-9]{64}$/.test(manifest.provenance.integrity)) {
    addError(errors, "INVALID_INTEGRITY", "provenance.integrity", "must be sha256 followed by 64 lowercase hex characters");
  }
  if (manifest.health !== undefined) {
    if (!isRecord(manifest.health) || !["process", "api-check", "none"].includes(manifest.health.mode)) {
      addError(errors, "INVALID_HEALTH", "health", "must declare a supported health mode");
    } else if (manifest.health.entrypoint !== undefined && !isSafeRelativePath(manifest.health.entrypoint)) {
      addError(errors, "UNSAFE_HEALTH_ENTRYPOINT", "health.entrypoint", "must be a safe relative path");
    }
  }
  return errors;
}

function collectExportTargets(value, output = []) {
  if (typeof value === "string") output.push(value);
  else if (isRecord(value)) {
    for (const nested of Object.values(value)) collectExportTargets(nested, output);
  }
  return output;
}

export function validateAddonPackage(packageJson, slug, manifestVersion, manifest = null) {
  const errors = [];
  if (!isRecord(packageJson)) return [{ code: "INVALID_PACKAGE_JSON", path: "package.json", message: "must be an object" }];
  if (packageJson.name !== "@moonwitness/addon-" + slug) addError(errors, "PACKAGE_NAME_MISMATCH", "package.json.name", "must be @moonwitness/addon-" + slug);
  if (packageJson.version !== manifestVersion) addError(errors, "PACKAGE_VERSION_MISMATCH", "package.json.version", "must exactly match the add-on manifest version");
  if (packageJson.private !== true) addError(errors, "PACKAGE_MUST_BE_PRIVATE", "package.json.private", "add-on packages are private workspace packages in v1");
  if (packageJson.type !== "module") addError(errors, "PACKAGE_MUST_BE_ESM", "package.json.type", "must be module");
  if (packageJson.engines?.node !== ">=26.13.0 <27") addError(errors, "PACKAGE_NODE_RANGE", "package.json.engines.node", "must match the repository Node 26 baseline");
  if (!isRecord(packageJson.exports) || Object.keys(packageJson.exports).length === 0) addError(errors, "PACKAGE_EXPORTS_REQUIRED", "package.json.exports", "must declare explicit public exports");
  for (const script of ["build", "lint", "typecheck", "test"]) {
    if (typeof packageJson.scripts?.[script] !== "string" || packageJson.scripts[script].trim().length === 0) {
      addError(errors, "PACKAGE_SCRIPT_REQUIRED", "package.json.scripts." + script, "required package script is missing");
    }
  }
  for (const script of ["preinstall", "install", "postinstall", "prepare", "prepublish", "prepublishOnly"]) {
    if (packageJson.scripts && script in packageJson.scripts) {
      addError(errors, "PACKAGE_LIFECYCLE_SCRIPT_FORBIDDEN", "package.json.scripts." + script, "automatic package lifecycle scripts are forbidden");
    }
  }
  for (const section of ["dependencies", "optionalDependencies", "peerDependencies", "devDependencies"]) {
    const dependencies = packageJson[section] ?? {};
    if (!isRecord(dependencies)) {
      addError(errors, "INVALID_PACKAGE_DEPENDENCIES", "package.json." + section, "must be an object");
      continue;
    }
    for (const name of Object.keys(dependencies)) {
      if (FORBIDDEN_DEPENDENCIES.some((pattern) => pattern.test(name))) {
        addError(errors, "FORBIDDEN_PACKAGE_DEPENDENCY", "package.json." + section + "." + name, "add-ons may not own persistence or HTTP server runtimes");
      }
      const requested = dependencies[name];
      if (typeof requested !== "string") {
        addError(errors, "INVALID_PACKAGE_VERSION", "package.json." + section + "." + name, "dependency version must be a string");
      } else if (requested === "*" || requested.toLowerCase() === "latest") {
        addError(errors, "UNPINNED_PACKAGE_DEPENDENCY", "package.json." + section + "." + name, "wildcard/latest dependencies are forbidden");
      } else if (requested.startsWith("workspace:")) {
        if (!/^workspace:(?:\\*|\\^|~|(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*))$/.test(requested)) {
          addError(errors, "UNSUPPORTED_WORKSPACE_RANGE", "package.json." + section + "." + name, "use workspace:*, workspace:^, workspace:~ or an exact workspace SemVer");
        }
      } else if (/^(?:file:|link:|portal:|git:|git\\+|github:|https?:|ssh:)/i.test(requested)) {
        addError(errors, "UNTRUSTED_PACKAGE_SOURCE", "package.json." + section + "." + name, "local paths, Git branches and direct URLs are not allowed as package sources");
      } else if (!parseSemver(requested)) {
        addError(errors, "NON_EXACT_PACKAGE_DEPENDENCY", "package.json." + section + "." + name, "external dependencies must be pinned to an exact SemVer version");
      }
    }
  }
  if (manifest && Array.isArray(manifest.contributions)) {
    const exportedTargets = new Set(collectExportTargets(packageJson.exports));
    manifest.contributions.forEach((contribution, index) => {
      if (typeof contribution?.entrypoint === "string" && !exportedTargets.has(contribution.entrypoint)) {
        addError(errors, "CONTRIBUTION_NOT_EXPORTED", "addon.manifest.json.contributions[" + index + "].entrypoint", "every contribution entrypoint must be exposed through package.json exports");
      }
    });
  }
  return errors;
}

export function inspectAddonSource(sourceFiles) {
  const errors = [];
  const importPattern = /\b(?:from\s*|import\s*(?:\(\s*)?|require\s*\()\s*["']([^"']+)["']/g;
  for (const file of sourceFiles) {
    let match;
    while ((match = importPattern.exec(file.content)) !== null) {
      const moduleName = match[1];
      if (FORBIDDEN_IMPORTS.some((pattern) => pattern.test(moduleName))) {
        addError(errors, "FORBIDDEN_SOURCE_IMPORT", file.path, "forbidden import: " + moduleName);
      }
      if (/^(?:\.\.\/)+apps\//.test(moduleName) || moduleName.includes("/src/internal/")) {
        addError(errors, "PRIVATE_SOURCE_IMPORT", file.path, "private cross-package import: " + moduleName);
      }
    }
    if (/\bprocess\.env\b/.test(file.content)) addError(errors, "AMBIENT_SECRET_ACCESS", file.path, "read configuration through injected SDK context, not process.env");
    if (/\b(?:eval)\s*\(|\bnew\s+Function\b/.test(file.content)) addError(errors, "DYNAMIC_CODE_EXECUTION", file.path, "eval and Function constructor are forbidden");
    if (/\bfetch\s*\(/.test(file.content)) addError(errors, "DIRECT_NETWORK_ACCESS", file.path, "use a reviewed API/integration capability instead of direct fetch");
  }
  return errors;
}

export function validateAddonSet(addons) {
  const errors = [];
  const byId = new Map();
  for (const addon of addons) {
    const id = addon.manifest?.id;
    if (typeof id !== "string") continue;
    if (byId.has(id)) addError(errors, "DUPLICATE_ADDON_ID", id, "more than one package declares this ID");
    else byId.set(id, addon);
  }
  const requiredGraph = new Map();
  for (const addon of addons) {
    const id = addon.manifest?.id;
    if (typeof id !== "string") continue;
    const required = addon.manifest.dependencies?.required ?? [];
    requiredGraph.set(id, []);
    for (const dependency of required) {
      const target = byId.get(dependency.id);
      if (!target) {
        addError(errors, "MISSING_REQUIRED_ADDON", id + ".dependencies.required", "required add-on is missing: " + dependency.id);
        continue;
      }
      if (!satisfiesSupportedRange(target.manifest.version, dependency.version)) {
        addError(errors, "INCOMPATIBLE_REQUIRED_ADDON", id + ".dependencies.required", dependency.id + "@" + target.manifest.version + " is outside " + dependency.version);
      }
      requiredGraph.get(id).push(dependency.id);
    }
    for (const dependency of addon.manifest.dependencies?.optional ?? []) {
      const target = byId.get(dependency.id);
      if (target && !satisfiesSupportedRange(target.manifest.version, dependency.version)) {
        addError(errors, "INCOMPATIBLE_OPTIONAL_ADDON", id + ".dependencies.optional", dependency.id + "@" + target.manifest.version + " is outside " + dependency.version);
      }
    }
  }
  const state = new Map();
  const stack = [];
  const seenCycles = new Set();
  function visit(id) {
    const current = state.get(id) ?? 0;
    if (current === 2) return;
    if (current === 1) {
      const start = stack.indexOf(id);
      const cycle = [...stack.slice(start), id].join(" -> ");
      if (!seenCycles.has(cycle)) {
        seenCycles.add(cycle);
        addError(errors, "DEPENDENCY_CYCLE", "dependencies", cycle);
      }
      return;
    }
    state.set(id, 1);
    stack.push(id);
    for (const target of requiredGraph.get(id) ?? []) visit(target);
    stack.pop();
    state.set(id, 2);
  }
  for (const id of requiredGraph.keys()) visit(id);
  return errors;
}

async function collectSources(directory) {
  const files = [];
  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (["node_modules", "dist", "build", "coverage"].includes(entry.name)) continue;
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile() && [".js", ".mjs", ".cjs", ".ts", ".tsx"].includes(extname(entry.name).toLowerCase())) {
        files.push({ path: relative(directory, absolute).replaceAll("\\", "/"), content: await readFile(absolute, "utf8") });
      }
    }
  }
  if (existsSync(directory)) await walk(directory);
  return files;
}

export async function lintAddons(repositoryRoot = process.cwd()) {
  const root = resolve(repositoryRoot);
  const schemaPath = resolve(root, "docs/architecture/addons/addon.manifest.schema.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const errors = [];
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema" || schema.additionalProperties !== false) {
    addError(errors, "SCHEMA_CONTRACT_INVALID", schemaPath, "manifest schema must be JSON Schema 2020-12 and reject unknown top-level fields");
  }
  const addonsRoot = resolve(root, "packages/addons");
  if (!existsSync(addonsRoot)) {
    return { valid: errors.length === 0, addonCount: 0, errors, message: "No add-on packages found; manifest schema and lint gate are active." };
  }
  const entries = await readdir(addonsRoot, { withFileTypes: true });
  const addons = [];
  for (const entry of entries.filter((item) => item.isDirectory()).sort((left, right) => left.name.localeCompare(right.name))) {
    const slug = entry.name;
    const addonPath = join(addonsRoot, slug);
    const manifestPath = join(addonPath, "addon.manifest.json");
    const packagePath = join(addonPath, "package.json");
    const readmePath = join(addonPath, "README.md");
    if (!existsSync(manifestPath)) {
      addError(errors, "MANIFEST_MISSING", manifestPath, "every add-on package must contain addon.manifest.json");
      continue;
    }
    if (!existsSync(packagePath)) {
      addError(errors, "PACKAGE_MANIFEST_MISSING", packagePath, "every add-on package must contain package.json");
      continue;
    }
    if (!existsSync(readmePath)) addError(errors, "README_MISSING", readmePath, "every add-on package must document owner, purpose and capability boundaries");
    let manifest;
    let packageJson;
    try { manifest = JSON.parse(await readFile(manifestPath, "utf8")); }
    catch (error) { addError(errors, "MANIFEST_PARSE_ERROR", manifestPath, error.message); continue; }
    try { packageJson = JSON.parse(await readFile(packagePath, "utf8")); }
    catch (error) { addError(errors, "PACKAGE_PARSE_ERROR", packagePath, error.message); continue; }
    for (const error of validateJsonSchema(schema, manifest)) {
      errors.push({ code: "MANIFEST_" + error.code, path: slug + "/" + error.path, message: error.message });
    }
    for (const error of validateAddonManifest(manifest, slug)) errors.push({ ...error, path: slug + "/" + error.path });
    for (const error of validateAddonPackage(packageJson, slug, manifest.version, manifest)) errors.push({ ...error, path: slug + "/" + error.path });
    const sourceFiles = await collectSources(join(addonPath, "src"));
    for (const error of inspectAddonSource(sourceFiles)) errors.push({ ...error, path: slug + "/" + error.path });
    addons.push({ slug, manifest, packageJson, sourceFiles });
  }
  errors.push(...validateAddonSet(addons));
  return {
    valid: errors.length === 0,
    addonCount: addons.length,
    errors,
    message: errors.length === 0
      ? "Add-on gate passed: " + addons.length + " package(s) inspected."
      : "Add-on gate failed: " + errors.length + " issue(s) across " + addons.length + " package(s).",
  };
}

async function main() {
  try {
    const result = await lintAddons();
    if (result.errors.length) {
      for (const error of result.errors) process.stderr.write(error.code + " " + error.path + ": " + error.message + "\n");
      process.stderr.write(result.message + "\n");
      process.exitCode = 1;
      return;
    }
    process.stdout.write(result.message + "\n");
  } catch (error) {
    process.stderr.write("Add-on lint could not run: " + error.message + "\n");
    process.exitCode = 2;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
