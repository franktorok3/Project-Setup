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
];

for (const requirement of workflowRequirements) {
  if (!workflow.includes(requirement)) {
    throw new Error(`PostgreSQL standard missing workflow contract: ${requirement}`);
  }
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

console.log("Conditional Prisma/PostgreSQL standard present");
