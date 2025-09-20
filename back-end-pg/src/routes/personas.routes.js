import { Router }   from "express";

import {
    getPersonas,
    getPersonaById,
    postPersona,
    putPersona,
    deletePersona
} from "../controllers/persona.controllers.js";

const router = Router();

router.get("/", getPersonas);
router.get("/:id", getPersonaById);
router.post("/", postPersona);
router.put("/:id", putPersona);
router.delete("/:id", deletePersona);

export default router;