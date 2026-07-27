import fs from 'node:fs/promises';

const registry = await fs.readFile('projects.yml', 'utf8');
const repositories = [...registry.matchAll(/^\s*- repository:\s*(\S+)\s*$/gm)].map((match) => match[1]);
const token = process.env.PORTFOLIO_GITHUB_TOKEN || process.env.GITHUB_TOKEN;

if (!repositories.length) throw new Error('No repositories found in projects.yml');

const checks = [
  { name: 'Manifest', paths: ['frank-stack.yml'] },
  { name: 'Agent contract', paths: ['AGENTS.md'] },
  {
    name: 'Shared CI',
    paths: [
      '.github/workflows/project-standard.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/standards-ci.yml',
    ],
  },
  { name: 'Dependabot', paths: ['.github/dependabot.yml'] },
  {
    name: 'Environment example',
    paths: ['.env.example'],
    applies: ({ runtime, deployment }) => runtime !== 'none' && deployment !== 'none',
  },
  { name: 'Pull request template', paths: ['.github/PULL_REQUEST_TEMPLATE.md'] },
  { name: 'Security policy', paths: ['SECURITY.md'] },
  {
    name: 'Local hooks',
    paths: ['lefthook.yml'],
    applies: ({ runtime }) => runtime === 'node',
  },
];

async function github(path) {
  return fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'project-setup-compliance-auditor',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}

async function content(repo, path) {
  const response = await github(`/repos/${repo}/contents/${encodeURI(path)}`);
  if (response.status === 404) return { state: 'missing', text: null };
  if (response.status === 403) return { state: 'unknown', text: null };
  if (!response.ok) throw new Error(`${repo}: ${path} returned ${response.status}`);
  const body = await response.json();
  const text = body.encoding === 'base64'
    ? Buffer.from(body.content.replace(/\n/g, ''), 'base64').toString('utf8')
    : null;
  return { state: 'present', text };
}

async function anyContent(repo, paths) {
  const values = [];
  for (const path of paths) values.push(await content(repo, path));
  const present = values.find((value) => value.state === 'present');
  if (present) return present;
  if (values.some((value) => value.state === 'unknown')) return { state: 'unknown', text: null };
  return { state: 'missing', text: null };
}

function valueOf(manifest, field, fallback = 'unknown') {
  return manifest.match(new RegExp(`^\\s*${field}:\\s*([^#\\n]+)`, 'm'))?.[1]?.trim() ?? fallback;
}

const results = [];
for (const repository of repositories) {
  const repoResponse = await github(`/repos/${repository}`);
  if (repoResponse.status === 404 || repoResponse.status === 403) {
    results.push({ repository, accessible: false, score: null, checks: [] });
    continue;
  }
  if (!repoResponse.ok) throw new Error(`${repository} returned ${repoResponse.status}`);

  const manifestResult = await content(repository, 'frank-stack.yml');
  const manifest = manifestResult.text ?? '';
  const context = {
    runtime: valueOf(manifest, 'runtime'),
    deployment: valueOf(manifest, 'deployment'),
  };

  const repoChecks = [];
  for (const check of checks) {
    const applicable = check.applies ? check.applies(context) : true;
    if (!applicable) {
      repoChecks.push({ ...check, applicable: false, state: 'not-applicable' });
      continue;
    }
    const observed = check.name === 'Manifest'
      ? manifestResult
      : await anyContent(repository, check.paths);
    repoChecks.push({ ...check, applicable: true, state: observed.state });
  }

  const applicable = repoChecks.filter((check) => check.applicable);
  const passed = applicable.filter((check) => check.state === 'present');
  const score = Math.round((passed.length / applicable.length) * 100);
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
    lines.push(`| ${result.repository} | unavailable | Token cannot read repository metadata |`);
    continue;
  }
  const missing = result.checks
    .filter((check) => check.applicable && check.state !== 'present')
    .map((check) => check.name);
  lines.push(`| ${result.repository} | ${result.score}% | ${missing.join(', ') || 'None'} |`);
}

lines.push('', '## Detailed checks', '');
for (const result of results) {
  lines.push(`### ${result.repository}`, '');
  if (!result.accessible) {
    lines.push('- ❓ Repository was not accessible to this workflow.', '');
    continue;
  }
  for (const check of result.checks) {
    const mark = check.state === 'present'
      ? '✅'
      : check.state === 'not-applicable'
        ? '➖'
        : check.state === 'unknown'
          ? '❓'
          : '❌';
    const suffix = check.state === 'not-applicable' ? ' — not applicable' : '';
    lines.push(`- ${mark} ${check.name}: ${check.paths.map((path) => `\`${path}\``).join(' or ')}${suffix}`);
  }
  lines.push('');
}

const report = `${lines.join('\n')}\n`;
await fs.mkdir('artifacts', { recursive: true });
await fs.writeFile('artifacts/portfolio-compliance.md', report);
if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, report);
console.log(report);

const incomplete = results.some((result) =>
  !result.accessible
  || result.checks.some((check) => check.applicable && check.state !== 'present')
);
if (incomplete) process.exitCode = 1;
