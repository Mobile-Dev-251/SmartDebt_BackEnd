import {
  getAllContactsService,
  deleteContactService,
} from "../services/contactService.js";

export const getAllContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await getAllContactsService(userId);
    return res.status(200).send(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// export const createContact = async (req, res) => {
//     try {
//         const data = req.body;
//         const result = await createContactService(data);
//         return res.status(201).json({
//             contact_id: result,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(400).json({
//             error: error.message,
//         });
//     }
// };

export const deleteContact = async (req, res) => {
  try {
    const { deleteId } = req.params;
    const userId = req.user.id;
    await deleteContactService(userId, deleteId);
    return res.status(204).send("Xóa thành công");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
