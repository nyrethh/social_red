
import { Pool } from "../db.js";


export const getPersonas = async (req, res) => {
    const { rows } = await Pool.query("SELECT p.*, u.ali_usu FROM perfil_personal.persona p JOIN seguridad.usuario u ON p.fky_usu = u.cod_usu");
    res.json(rows);
};

export const getPersonaById = async (req, res) => {
    const { id } = req.params;
    const { rows } = await Pool.query("SELECT * FROM perfil_personal.persona WHERE cod_per = $1", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json(rows[0]);
};

export const postPersona = async (req, res) => {
    const { nm1_per, nm2_per, ap1_per, ap2_per, sex_per, per_per, por_per, fky_usu, est_per } = req.body;
    const { rows } = await Pool.query(
        "INSERT INTO perfil_personal.persona (nm1_per, nm2_per, ap1_per, ap2_per, sex_per, per_per, por_per, fky_usu, est_per) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [nm1_per, nm2_per, ap1_per, ap2_per, sex_per, per_per, por_per, fky_usu, est_per]
    );
    res.status(201).json(rows[0]);
};

export const putPersona = async (req, res) => {
    const { id } = req.params;
    const { nm1_per, nm2_per, ap1_per, ap2_per, sex_per, per_per, por_per, fky_usu, est_per } = req.body;
    const { rows } = await Pool.query(
        "UPDATE perfil_personal.persona SET nm1_per = $1, nm2_per = $2, ap1_per = $3, ap2_per = $4, sex_per = $5, per_per = $6, por_per = $7, fky_usu = $8, est_per = $9 WHERE cod_per = $10 RETURNING *",
        [nm1_per, nm2_per, ap1_per, ap2_per, sex_per, per_per, por_per, fky_usu, est_per, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json(rows[0]);
};

/* export const deletePersona = async (req, res) => {
    const { id } = req.params;

    const { rowCount } = await Pool.query("DELETE FROM perfil_personal.persona WHERE cod_per = $1", [id]);
    if (rowCount === 0) {
        return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.sendStatus(204);
};
 */


export const deletePersona = async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await Pool.query(
            "DELETE FROM perfil_personal.persona WHERE cod_per = $1", [id]
        );
        
        if (rowCount === 0) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }
        
        return res.sendStatus(204);

    } catch (error) {
        if (error.code === '23503') {
            return res.status(409).json({ 
                message: "No se puede eliminar este perfil porque tiene otros registros asociados (como un rol de fan)." 
            });
        }
        
        console.error("Error al eliminar persona:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};