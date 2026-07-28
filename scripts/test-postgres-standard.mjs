import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { writePostgresIntegrationProof } from "../templates/prisma-postgres/integration-proof.mjs";

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "postgres-proof-"));
const proofPath = path.join(directory, "proof.json");
process.env.POSTGRES_INTEGRATION_PROOF_PATH = proofPath;

assert.throws(
  () => writePostgresIntegrationProof([]),
  /At least one PostgreSQL integration test name is required/,
);
assert.equal(fs.existsSync(proofPath), false);

writePostgresIntegrationProof(["approval replay", "concurrent approval"]);
const proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
assert.deepEqual(proof, {
  schemaVersion: 1,
  database: "postgresql",
  testsExecuted: 2,
  tests: ["approval replay", "concurrent approval"],
});

assert.throws(
  () => writePostgresIntegrationProof(["replacement"]),
  /EEXIST/,
);

console.log("PostgreSQL integration proof contract passes");
