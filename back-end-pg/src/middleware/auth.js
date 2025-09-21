import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;// Debe ser la misma clave del controlador de login

export const verifyToken = (req, res, next) => {
    // Obtiene el token del encabezado de la solicitud
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // El token viene como "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.user = user; // Guarda la información del usuario en la solicitud
        next(); // Continúa con la siguiente función
    });
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.nom_rol === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};