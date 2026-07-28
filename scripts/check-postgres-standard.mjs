import fs from "node:fs";

const workflow = fs.readFileSync(".github/workflows/next-ci.yml", "utf8");
const caller = fs.readFileSync(
  "templates/prisma-postgres/ci-caller.yml",
  "utf8",
);
const manifest = fs.readFileSync(
  "templates/prisma-postgres/frank-stack.yml",
  "utf8",
);
const stackStandard = fs.readFileSync("STACK_STANDARD.md", "utf8");
const proofHelper = fs.readFileSync(
  "templates/prisma-postgres/integration-proof.mjs",
  "utf8",
);

const workflowRequirements = [
  "require-postgres-integration:",
  "postgres-integration:",
  "image: postgres:16",
  "DATABASE_URL:",
  "DIRECT_URL:",
  'db execute --url "$DIRECT_URL" --stdin',
  "prisma migrate deploy",
  "prisma generate",
  "postgres-integration-test-script",
  'DATABASE_INTEGRATION_TESTS: "1"',
  "POSTGRES_INTEGRATION_PROOF_PATH:",
  "PostgreSQL integration proof was not produced",
  "proof.tests.length < 1",
  "proof.testsExecuted !== proof.tests.length",
  '^[A-Za-z0-9:_-]+$',
];

for (const requirement of workflowRequirements) {
  if (!workflow.includes(requirement)) {
    throw new Error(`PostgreSQL standard missing workflow contract: ${requirement}`);
  }
}

if (workflow.includes("db push")) {
  throw new Error("PostgreSQL standard must not use prisma db push");
}

if (!caller.includes("require-postgres-integration: true")) {
  throw new Error("Prisma/PostgreSQL caller does not enable the integration job");
}

for (const requirement of [
  "database_engine: postgres",
  "orm: prisma",
  "postgres_integration: required",
]) {
  if (!manifest.includes(requirement)) {
    throw new Error(`Prisma/PostgreSQL manifest missing: ${requirement}`);
  }
}

for (const requirement of [
  "fail-closed",
  "DATABASE_INTEGRATION_TESTS=1",
  "prisma migrate deploy",
  "--url \"$DIRECT_URL\"",
  "PostgreSQL 16",
]) {
  if (!stackStandard.includes(requirement)) {
    throw new Error(`STACK_STANDARD.md missing PostgreSQL contract: ${requirement}`);
  }
}

// Bind the default check to the PostgreSQL input rather than accepting another
// unrelated input that also defaults to false.
const postgresInputDefault =
  /require-postgres-integration:\s*\n\s+type:\s+boolean\s*\n\s+default:\s+false(?:\s*\n|$)/;
if (!postgresInputDefault.test(workflow)) {
  throw new Error("require-postgres-integration must default to false");
}
const unsafeDefaultWorkflow = workflow.replace(
  /(require-postgres-integration:\s*\n\s+type:\s+boolean\s*\n\s+default:\s*)false/,
  "$1true",
);
if (postgresInputDefault.test(unsafeDefaultWorkflow)) {
  throw new Error("PostgreSQL default-off validator is not input-specific");
}

for (const requirement of [
  "POSTGRES_INTEGRATION_PROOF_PATH",
  "testsExecuted",
  'database: "postgresql"',
  "schemaVersion: 1",
  'flag: "wx"',
]) {
  if (!proofHelper.includes(requirement)) {
    throw new Error(`Integration proof helper missing: ${requirement}`);
  }
}

console.log("Conditional Prisma/PostgreSQL standard present");
