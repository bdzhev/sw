import { networkInterfaces } from 'node:os';

import qrcode from 'qrcode';

/**
 * Prints the LAN URL players scan to join, as a QR.
 *
 * It runs on the host rather than inside the app: under `make dev` and
 * `make prod` the server sits in a container, where the only address it can see
 * is the docker bridge (172.x) — unreachable from a phone. `networkInterfaces`
 * here reports the real wifi address the published ports are reachable on.
 */
const DEFAULT_PORT = 8080;

/** 10/8, 192.168/16 and 172.16/12 — minus docker's own bridge, see below. */
const PRIVATE_IPV4 = /^(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/;

/**
 * Docker's default bridge pool starts at 172.17 and a VPN often owns 198.18.
 * Neither is the address a phone on the wifi can reach, so both lose to a
 * 192.168/10-net address when one exists.
 */
const isLikelyWifi = (address: string): boolean => {
  return address.startsWith('192.168.') || address.startsWith('10.');
};

const lanAddresses = (): string[] => {
  const candidates: string[] = [];

  for (const addresses of Object.values(networkInterfaces())) {
    for (const entry of addresses ?? []) {
      if (entry.family === 'IPv4' && !entry.internal && PRIVATE_IPV4.test(entry.address)) {
        candidates.push(entry.address);
      }
    }
  }

  return [...candidates].sort((first, second) => {
    return Number(isLikelyWifi(second)) - Number(isLikelyWifi(first));
  });
};

const port = Number(process.argv[2] ?? process.env.JOIN_PORT ?? DEFAULT_PORT);
const [address, ...alternatives] = lanAddresses();

if (!address) {
  console.error('No private network address found — is this machine on a wifi/LAN?');
  process.exit(1);
}

const url = `http://${address}:${port}`;

console.log(`\n  Scan to join — ${url}\n`);
console.log(await qrcode.toString(url, { type: 'terminal', small: true }));

if (alternatives.length) {
  const others = alternatives
    .map((entry) => {
      return `http://${entry}:${port}`;
    })
    .join(', ');

  console.log(`  Other addresses on this machine: ${others}\n`);
}
