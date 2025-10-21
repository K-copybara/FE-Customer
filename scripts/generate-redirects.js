import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';

const backend = process.env.VITE_WEBSOCKET_URL;
if (!backend) {
  throw new Error('WEBSOCKET_URL env is required');
}
const backendNoSlash = backend.replace(/\/$/, '');

const lines = [
  `/chatbot/*  ${backendNoSlash}/chatbot/:splat  200`,
  `/*  /index.html  200`,
].join('\n') + '\n';

const publicDir = path.join(process.cwd(), 'public');
await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, '_redirects'), lines, 'utf8');

console.log('_redirects generated:\n' + lines);
