import { Router } from "express";
import { 
    getUsuarios,
    getUsuarioById,
    postUsuario,
    putUsuario,
    deleteUsuario,
    login
} from "../controllers/usuario.controllers.js";
import { verifyToken, isAdmin } from '../middleware/auth.js';

    const router = Router();

// Ruta de login (no necesita protección)
router.post("/login", login);

// Rutas protegidas
router.get("/", verifyToken, isAdmin, getUsuarios); // Solo admin puede ver todos
router.get("/:id", verifyToken, isAdmin, getUsuarioById); // Solo admin puede ver por ID
router.post("/", verifyToken, isAdmin, postUsuario); // Solo admin puede crear
router.put("/:id", verifyToken, isAdmin, putUsuario); // Solo admin puede actualizar
router.delete("/:id", verifyToken, isAdmin, deleteUsuario); // Solo admin puede eliminar

    export default router;