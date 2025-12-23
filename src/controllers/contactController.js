import {
    getAllContactsService,
    getContactByIdService,
    createContactService,
    updateContactService,
    deleteContactService,
} from "../services/contactService.js";

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await getAllContactsService();
        return res.send(contacts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getContactById = async (req, res) => {
    try {
        const id = req.user.id;
        const contact = await getContactByIdService(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        return res.send(contact);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createContact = async (req, res) => {
    try {
        const data = req.body;
        const result = await createContactService(data);
        return res.status(201).json({
            contact_id: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await updateContactService(id, data);
        if (!result) {
            return res.status(404).json({ error: "Contact not found" });
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteContactService(id);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
