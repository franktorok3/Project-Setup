import fs from "node:fs";

const path = "frank-stack.yml";

if (!fs.existsSync(path)) {
  console.error("Missing frank-stack.yml");
  process.exit(1);
}

const text = fs.readFileSync(path, "utf8");
for (const field of [
  "standard_version:",
  "level:",
  "ci:",
  "telemetry:",
  "health_check:",
]) {
  if (!text.includes(field)) {
    console.error(`Manifest missing ${field}`);
    process.exit(1);
  }
}

console.log("Project standard manifest present");
