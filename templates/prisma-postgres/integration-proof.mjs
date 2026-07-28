import fs from "node:fs";
import path from "node:path";

export function writePostgresIntegrationProof(testNames) {
  const proofPath = process.env.POSTGRES_INTEGRATION_PROOF_PATH;
  if (!proofPath) {
    throw new Error("POSTGRES_INTEGRATION_PROOF_PATH is required");
  }
  if (
    !Array.isArray(testNames) ||
    testNames.length < 1 ||
    testNames.some((name) => typeof name !== "string" || !name.trim())
  ) {
    throw new Error("At least one PostgreSQL integration test name is required");
  }

  const tests = testNames.map((name) => name.trim());
  const proof = {
    schemaVersion: 1,
    database: "postgresql",
    testsExecuted: tests.length,
    tests,
  };

  fs.mkdirSync(path.dirname(proofPath), { recursive: true });
  fs.writeFileSync(proofPath, `${JSON.stringify(proof, null, 2)}\n`, {
    encoding: "utf8",
    flag: "wx",
  });
}
