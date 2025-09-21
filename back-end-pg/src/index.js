import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import usuarioRoutes from './routes/usuario.routes.js';
import rolRoutes from './routes/rol.routes.js';
import privacidadRoutes from './routes/privacidad.routes.js';
import personaRoutes from './routes/personas.routes.js';
import zonahorariaRoutes from './routes/zonahoraria.routes.js';
import paisRoutes from './routes/pais.routes.js';
import estadoRoutes from './routes/estado.routes.js';
import ciudadRoutes from './routes/ciudad.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '..', '..', 'front-end-pg');

// Middleware para servir los archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(frontendPath));

// Ruta principal para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// RUTAS de la API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/privacidad', privacidadRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/zonas-horarias', zonahorariaRoutes);
app.use('/api/paises', paisRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api/ciudades', ciudadRoutes);

app.listen(PORT);
console.log('Server running on port', PORT);