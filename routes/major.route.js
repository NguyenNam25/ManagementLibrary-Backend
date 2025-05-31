const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');

const {
  getCategories,
  getType,
  getTypes,
  getCategory,
  addCategory,
  addType,
  deleteType,
  deleteCategory,
  getPopularCategories,
} = require("../controllers/major.controller.js");

// Public routes (no auth needed)
router.get("/popular-categories", getPopularCategories);
router.get("/categories", getCategories);
router.get("/types", getTypes);
router.get("/category/:id", getCategory);
router.get("/type/:id", getType);

// Protected routes (auth required)
router.post("/type/", checkTokenAuthen, addType);
router.post("/category/", checkTokenAuthen, addCategory);
router.delete("/type/:id", checkTokenAuthen, deleteType);
router.delete("/category/:id", checkTokenAuthen, deleteCategory);

module.exports = router;
