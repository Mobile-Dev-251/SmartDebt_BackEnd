import sql from "../config/db.js";

export const getAllCategoriesService = async () => {
    const result = await sql`SELECT * FROM categories`;
    return result;
};

export const getCategoryByIdService = async (id) => {
    const result = await sql`SELECT * FROM categories WHERE id = ${id}`;
    return result[0];
};

export const createCategoryService = async (data) => {
    try {
        const { name } = data;
        const result = await sql`
      INSERT INTO categories (name)
      VALUES (${name})
      RETURNING id;
    `;
        return result[0].id;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

export const updateCategoryService = async (id, data) => {
    try {
        const { name } = data;
        const result = await sql`
      UPDATE categories
      SET name = ${name}
      WHERE id = ${id}
      RETURNING *;
    `;
        return result[0];
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const deleteCategoryService = async (id) => {
    try {
        await sql`DELETE FROM categories WHERE id = ${id}`;
        return true;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};