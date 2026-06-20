require('dotenv').config();
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const selfsigned = require('selfsigned');
const { initializeDatabase, db } = require('./src/config/database');
const authRoutes = require('./src/routes/auth');
const exerciseRoutes = require('./src/routes/exercises');

const app = express();

app.use(compression());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(globalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/exercises', exerciseRoutes);

const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const certsDir = path.join(__dirname, 'certs');
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir);

let httpsOptions;
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  const pems = selfsigned.generate(
    [{ name: 'commonName', value: 'localhost' }],
    { days: 365, keySize: 2048 }
  );
  fs.writeFileSync(keyPath, pems.private);
  fs.writeFileSync(certPath, pems.cert);
  console.log('Certificado SSL gerado em backend/certs/');
  httpsOptions = { key: pems.private, cert: pems.cert };
} else {
  httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

async function seed() {
  const row = await db('users').count('id as c').first();
  if (Number(row.c) > 0) return;

  const [hash1, hash2] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('user123', 10),
  ]);
  await db('users').insert([
    { email: 'admin@brutalfit.com', password: hash1 },
    { email: 'user@brutalfit.com', password: hash2 },
  ]);
  console.log('Usuários iniciais criados:');
  console.log('  admin@brutalfit.com / admin123');
  console.log('  user@brutalfit.com  / user123');
}

const PORT = process.env.PORT || 3001;

(async () => {
  await initializeDatabase();
  await seed();
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Servidor rodando em https://localhost:${PORT}`);
  });
})();
