export {};

const ENV_PATH = '.env';
const ENV_EXAMPLE_PATH = '.env.example';

function generateSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);

  return Array.from(bytes)
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

function parseEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }

    result[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }

  return result;
}

const exampleFile = Bun.file(ENV_EXAMPLE_PATH);
if (!(await exampleFile.exists())) {
  console.error(`Missing ${ENV_EXAMPLE_PATH}`);
  process.exit(1);
}

const example = await exampleFile.text();
const envFile = Bun.file(ENV_PATH);

if (!(await envFile.exists())) {
  const filled = example.replace(
    /^JWT_SECRET=.*$/m,
    `JWT_SECRET=${generateSecret()}`
  );
  await Bun.write(ENV_PATH, filled);
  console.log(`Created ${ENV_PATH} with a generated JWT_SECRET.`);
  console.log('Fill in DATABASE_URL and FRONTEND_URL before starting the app.');
} else {
  const content = await envFile.text();
  const existing = parseEnv(content);
  if (!existing['JWT_SECRET']) {
    const secret = generateSecret();
    const updated = content.match(/^JWT_SECRET=.*$/m)
      ? content.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`)
      : content + `\nJWT_SECRET=${secret}\n`;
    await Bun.write(ENV_PATH, updated);
    console.log('Generated and added JWT_SECRET to existing .env.');
  } else {
    console.log('.env already has JWT_SECRET — nothing to do.');
  }
}
