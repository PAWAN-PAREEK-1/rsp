import { validationResult } from "express-validator";
import Category from "../models/categories.models.js";
import { isValidObjectId } from "mongoose";

// Add category
export const addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }

  const { name, popular } = req.body;

  try {
    let existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      if (existingCategory.isDeleted) {
        existingCategory.isDeleted = false;
        existingCategory.popular = popular || false;
        await existingCategory.save();
        return res.status(200).json({
          success: true,
          message: "Category already exists and has been restored",
          category: existingCategory,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Category already exists" });
      }
    }

    const newCategory = new Category({ name, popular });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    let { search, sortBy, sortOrder, filterByPopular } = req.query;
    const query = { isDeleted: { $ne: true } };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder === "desc" ? -1 : 1;
    console.log(sortBy, sortOrder);

    if (filterByPopular === "true") {
      query.popular = true;
    }

    const categories = await Category.find(query).sort({ [sortBy]: sortOrder });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// update category
export const updateCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }

  const { categoryId } = req.params;
  const { name, popular } = req.body;
  if (!isValidObjectId(categoryId)) {
    return res.status(401).json({ success: false, message: "Invalid id" });
  }

  try {
    let category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (category.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Check if the updated category name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    category.name = name;
    category.popular = popular || category.popular;
    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  if (!isValidObjectId(categoryId)) {
    return res.status(401).json({ success: false, message: "Invalid id" });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (category.isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Already deleted" });
    }

    category.isDeleted = true;
    await category.save();

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
