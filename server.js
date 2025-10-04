import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import profesoresRoutes from './src/routes/profesores.routes.js';
import evaluacionesRoutes from './src/routes/evaluaciones.routes.js';
import statsRoutes from './src/routes/stats.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 60_000, max: 300 });
app.use(limiter);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.send(`
    <style>
      body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:24px;line-height:1.5}
      a{color:#0b74de;text-decoration:none} a:hover{text-decoration:underline}
      code{background:#f3f4f6;padding:2px 6px;border-radius:6px}
    </style>
    <h1>API Evaluación de Catedráticos (Local)</h1>
    <ul>
      <li><a href="/api">/api</a></li>
      <li><a href="/api/profesores">/api/profesores</a></li>
      <li><a href="/api/stats">/api/stats</a></li>
    </ul>
    <p>Frontend (si existe): <a href="/index.html">/index.html</a> y <a href="/stats.html">/stats.html</a></p>
  `);
});

app.get('/api', (_req, res) => res.json({ ok: true, message: 'API Local OK' }));
app.use('/api/profesores', profesoresRoutes);
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
});

app.use((_req, res) => {
  res.status(404).send('404 — Recurso no encontrado. Revisa la ruta o agrega tu frontend en /public');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API local en http://localhost:${PORT}`);
});
