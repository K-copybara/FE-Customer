const fs = require('fs');
const path = require('path');

const backend = process.env.VITE_WEBSOCKET_URL;
if (!backend) {
  throw new Error('BACKEND_BASE env is required');
}

const backendNoSlash = backend.replace(/\/$/, '');

// 필요한 프록시 규칙(순서 중요: 프록시 → SPA fallback)
const lines = [
  `/chatbot/*  ${backendNoSlash}/chatbot/:splat  200`,
  `/*  /index.html  200`
].join('\n') + '\n';

const publicDir = path.join(process.cwd(), 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, '_redirects'), lines, 'utf8');

console.log('_redirects generated:\n' + lines);
