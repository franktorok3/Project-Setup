import fs from 'node:fs/promises';

const registry = await fs.readFile('projects.yml', 'utf8');
const repositories = [...registry.matchAll(/^\s*- repository:\s*(\S+)\s*$/gm)].map((m) => m[1]);
const token = process.env.PORTFOLIO_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

if (!repositories.length) throw new Error('No repositories found in projects.yml');

const checks = [
  ['Manifest', 'frank-stack.yml'],
  ['Shared CI', '.github/workflows/ci.yml'],
  ['Dependabot', '.github/dependabot.yml'],
  ['Environment example', '.env.example'],
  ['Pull request template', '.github/PULL_REQUEST_TEMPLATE.md'],
  ['Security policy', 'SECURITY.md'],
];

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'project-setup-compliance-auditor',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  return response;
}

async function exists(repo, path) {
  const response = await github(`/repos/${repo}/contents/${encodeURI(path)}`);
  if (response.status === 404) return false;
  if (response.status === 403) return null;
  if (!response.ok) throw new Error(`${repo}: ${path} returned ${response.status}`);
  return true;
}

const results = [];
for (const repository of repositories) {
  const repoResponse = await github(`/repos/${repository}`);
  if (repoResponse.status === 404 || repoResponse.status === 403) {
    results.push({ repository, accessible: false, score: null, checks: [] });
    continue;
  }
  if (!repoResponse.ok) throw new Error(`${repository} returned ${repoResponse.status}`);

  const repoChecks = [];
  for (const [name, path] of checks) {
    repoChecks.push({ name, path, present: await exists(repository, path) });
  }
  const known = repoChecks.filter((check) => check.present !== null);
  const score = Math.round((known.filter((check) => check.present).length / known.length) * 100);
  results.push({ repository, accessible: true, score, checks: repoChecks });
}

const generatedAt = new Date().toISOString();
const lines = [
  '# Portfolio Compliance Report',
  '',
  `Generated: ${generatedAt}`,
  '',
  '| Repository | Score | Missing requirements |',
  '|---|---:|---|',
];

for (const result of results) {
  if (!result.accessible) {
    lines.push(`| ${result.repository} | unavailable | Add PORTFOLIO_GITHUB_TOKEN for private repository access |`);
    continue;
  }
  const missing = result.checks.filter((check) => check.present === false).map((check) => check.name);
  lines.push(`| ${result.repository} | ${result.score}% | ${missing.join(', ') || 'None'} |`);
}

lines.push('', '## Detailed checks', '');
for (const result of results) {
  lines.push(`### ${result.repository}`, '');
  if (!result.accessible) {
    lines.push('- Repository was not accessible to this workflow.', '');
    continue;
  }
  for (const check of result.checks) {
    const mark = check.present === true ? '✅' : check.present === false ? '❌' : '⚠️';
    lines.push(`- ${mark} ${check.name}: \`${check.path}\``);
  }
  lines.push('');
}

const report = `${lines.join('\n')}\n`;
await fs.mkdir('artifacts', { recursive: true });
await fs.writeFile('artifacts/portfolio-compliance.md', report);
if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, report);
console.log(report);
