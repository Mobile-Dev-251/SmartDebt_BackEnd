import express from "express";
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContactById);
router.post("/contacts", createContact);
router.put("/contacts/:id", updateContact);
router.delete("/contacts/:id", deleteContact);

export default router;
