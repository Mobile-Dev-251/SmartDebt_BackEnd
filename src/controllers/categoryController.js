import {
    getAllCategoriesService,
    getCategoryByIdService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from "../services/categoryService.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await getAllCategoriesService();
        return res.send(categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await getCategoryByIdService(id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.send(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createCategory = async (req, res) => {
    try {
        const data = req.body;
        const result = await createCategoryService(data);
        return res.status(201).json({
            category_id: result,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await updateCategoryService(id, data);
        if (!result) {
            return res.status(404).json({ error: "Category not found" });
        }
        return res.send(result);
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteCategoryService(id);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};