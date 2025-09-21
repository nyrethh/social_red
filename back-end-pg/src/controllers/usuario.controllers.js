/* 
Tabla: seguridad.usuario
cod_usu
ali_usu
ema_usu
cla_usu
est_usu */

import { Pool } from "../db.js";

export const getUsuarios = async (req, res) => {
    const { rows } = await Pool.query("SELECT * FROM seguridad.usuario");
    res.json(rows);
};

export const getUsuarioById = async (req, res) => {
    const { id } = req.params;
    const { rows } = await Pool.query("SELECT * FROM seguridad.usuario WHERE cod_usu = $1", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    } 
    res.json(rows[0]);
};

export const postUsuario = async (req, res) => {
    const { ali_usu, ema_usu, cla_usu, est_usu } = req.body;
    const { rows } = await Pool.query(
        "INSERT INTO seguridad.usuario (ali_usu, ema_usu, cla_usu, est_usu) VALUES ($1, $2, $3, $4) RETURNING *",
        [ali_usu, ema_usu, cla_usu, est_usu]
    );
    res.status(201).json(rows[0]);
};

/* export const putUsuario = async (req, res) => {
    const { id } = req.params;
    const { ali_usu, ema_usu, cla_usu, est_usu } = req.body;
    const { rows } = await Pool.query(
        "UPDATE seguridad.usuario SET ali_usu = $1, ema_usu = $2, cla_usu = $3, est_usu = $4 WHERE cod_usu = $5 RETURNING *",
        [ali_usu, ema_usu, cla_usu, est_usu, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
};
 */

/* editar usuario pero consevando la contrañsea */
export const putUsuario = async (req, res) => {
    const { id } = req.params;
    const { ali_usu, ema_usu, cla_usu, est_usu } = req.body;

    let query;
    let params;

    // Verificacion si la clave (cla_usu) viene en la solicitud
    if (cla_usu) {
        // Ssi hay contraseña nueva, entonces se atuliza
        query = 'UPDATE seguridad.usuario SET ali_usu = $1, ema_usu = $2, est_usu = $3, cla_usu = $4 WHERE cod_usu = $5 RETURNING *';
        params = [ali_usu, ema_usu, est_usu, cla_usu, id];
    } else {
        // aqui es si no hay contraseña nueva, entonces no la actualizamos
        query = 'UPDATE seguridad.usuario SET ali_usu = $1, ema_usu = $2, est_usu = $3 WHERE cod_usu = $4 RETURNING *';
        params = [ali_usu, ema_usu, est_usu, id];
    }

    const { rows } = await Pool.query(query, params);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
};

/* export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await Pool.query("DELETE FROM seguridad.usuario WHERE cod_usu = $1", [id]);
    if (rowCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.sendStatus(204);
};



 */


export const deleteUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await Pool.query(
            "DELETE FROM seguridad.usuario WHERE cod_usu = $1", [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        return res.sendStatus(204);

    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({
                message: "No se puede eliminar este usuario porque tiene otros registros asociados (como un rol de fan)."
            });
        }

        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};


/* Lógica de inicio de sesión */
/* export const login = async (req, res) => {
    const { ali_usu, cla_usu } = req.body;
    try {
        const { rows } = await Pool.query(
            "SELECT * FROM seguridad.usuario WHERE ali_usu = $1 AND cla_usu = $2 AND est_usu = 'A'",
            [ali_usu, cla_usu]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas o usuario inactivo." });
        }
        res.json({ message: "Inicio de sesión exitoso", user: rows[0] });
    } catch (error) {
        console.error("Error en la autenticación:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}; */

// TOKEN
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;


export const login = async (req, res) => {
    const { ali_usu, cla_usu } = req.body;
    try {
        const { rows } = await Pool.query(
            "SELECT u.*, r.nom_rol FROM seguridad.usuario u JOIN seguridad.rol r ON u.fky_rol = r.cod_rol WHERE u.ali_usu = $1 AND u.cla_usu = $2 AND u.est_usu = 'A'",
            [ali_usu, cla_usu]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: "Credenciales incorrectas o usuario inactivo." });
        }
        
        const user = rows[0];
        // Crea el token con la información del usuario
        const token = jwt.sign({ 
            cod_usu: user.cod_usu,
            ali_usu: user.ali_usu,
            nom_rol: user.nom_rol // Se incluye el nombre del rol en el token
        }, JWT_SECRET, { expiresIn: '1h' }); // El token expira en 1 hora

        res.json({ message: "Inicio de sesión exitoso", token, user: { ali_usu: user.ali_usu, nom_rol: user.nom_rol } });
    } catch (error) {
        console.error("Error en la autenticación:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};