import { validationResult } from "express-validator";
import Menu from "../models/menu.models.js";
import fs from "fs";
import path from "path";
import { __dirname } from "../../server.js";

// Add item
export const addItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }

  try {
    const {
      name,
      description,
      mainPrice,
      discountedPrice,
      offer,
      category,
      ingredients,
      availability,
      customizable,
      options,
      allergens,
      popular,
      veg,
      images,
    } = req.body;

    const newMenuItem = new Menu({
      name,
      description,
      mainPrice,
      discountedPrice,
      offer,
      category,
      ingredients,
      availability,
      customizable,
      options,
      allergens,
      popular,
      veg,
      images,
    });

    await newMenuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem: newMenuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update item
export const updateItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }

  try {
    const {
      name,
      description,
      mainPrice,
      discountedPrice,
      offer,
      category,
      ingredients,
      customizable,
      options,
      allergens,
      popular,
      veg,
      existingImages,
      images,
    } = req.body;

    const existingItem = await Menu.findById(req.params.itemId);
    if (!existingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    const newImages = req.files?.map((file) => "menu/" + file.filename) || [];
    existingItem?.images?.map((item) => {
      if (!existingImagesArray?.includes(item)) {
        const imagePath = path.join(__dirname, "uploads", item);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    });

    const updatedItem = await Menu.findByIdAndUpdate(
      req.params.itemId,
      {
        name,
        description,
        mainPrice,
        discountedPrice,
        offer: offerObject,
        category,
        ingredients,
        availability,
        customizable,
        options,
        allergens,
        popular,
        veg,
        images,
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem: updatedItem,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update availability of a menu item
export const updateAvailability = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0]?.msg });
  }

  try {
    const { itemId } = req.params;
    const { availability } = req.body;

    const updatedItem = await Menu.findByIdAndUpdate(
      itemId,
      { availability },
      { new: true }
    );

    if (!updatedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({
      success: true,
      message: "Availability updated successfully",
      menuItem: updatedItem,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// delete item
export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const deletedItem = await Menu.findByIdAndUpdate(
      itemId,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get Menu Items
export const getMenuItems = async (req, res) => {
  try {
    // Parse query parameters
    const {
      category,
      veg,
      search,
      page = 1, // Default to page 1 if not provided
      limit = 10,
      sortBy,
      sortOrder,
      available,
      popular,
    } = req.query;

    // Validate page parameter
    const pageNumber = Math.max(parseInt(page), 1); // Ensure page number is at least 1

    const filter = {};

    // Apply filters
    if (category) filter.category = category;
    if (veg) filter.veg = true;
    if (available) filter.availability = true;
    if (popular) filter.popular = true;
    filter.isDeleted = { $ne: true };

    // Apply search
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Create sort object
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Count total documents matching the filter
    const totalItems = await Menu.countDocuments(filter);

    // Fetch paginated menu items
    const items = await Menu.find(filter)
      .sort(sort)
      .skip((pageNumber - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      totalItems,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalItems / limit),
      items,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

