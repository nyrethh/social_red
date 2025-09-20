
import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';

import continentesRoutes from './routes/continente.routes.js';
import paisesRoutes from'./routes/pais.routes.js';
import rolRoutes from'./routes/rol.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import zonahorariaRoutes from'./routes/zonahoraria.routes.js';
import estadoRoutes from'./routes/estado.routes.js';
import ciudadRoutes from'./routes/ciudad.routes.js';
import personasRoutes from './routes/personas.routes.js';
import privacidadRoutes from './routes/privacidad.routes.js';



const app = express();





// Middleware
app.use(express.json()); // Para poder entender los JSON que llegan en las peticiones
app.use(cors()); // Habilita CORS para permitir que tu front-end se conecte

// Rutas
/* app.use('/api/seguridad', seguridadRoutes); */
app.use('/api/continentes', continentesRoutes);
app.use('/api/paises', paisesRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/zonas-horarias', zonahorariaRoutes);
app.use('/api/estados', estadoRoutes);
app.use('/api/ciudades', ciudadRoutes);
app.use('/api/personas', personasRoutes);
app.use('/api/privacidad', privacidadRoutes);

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://127.0.0.1:${PORT}`);
});