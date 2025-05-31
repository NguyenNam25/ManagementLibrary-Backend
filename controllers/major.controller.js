const Major = require("../models/major.model.js");



const getTypes = async (req, res) => {
  try {
    const types = await Major.find({ kind: 'type' }).select('');
    // const typeNames = types.map(t => t.name);
    res.status(200).json(types );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Major.find({ kind: 'category' }).select('');
    // const categoryNames = categories.map(c => c.name);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getType = async (req, res) => {
  try {
    const { id } = req.params;
    const major = await Major.findById(id);
    if (!major) return res.status(404).json({ message: 'Type not found' });
    res.status(200).json(major);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const major = await Major.findById(id);
    if (!major) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(major);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addType = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const existing = await Major.findOne({ name: name, kind: 'type' });
    if (existing) return res.status(400).json({ message: "Type already exists" });

    await Major.create({ name: name, kind: 'type' });

    const types = await Major.find({ kind: 'type' }).select('name -_id');
    res.status(201).json(types.map(t => t.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const existing = await Major.findOne({ name: name, kind: 'category' });
    if (existing) return res.status(400).json({ message: "Category already exists" });

    await Major.create({ name: name, kind: 'category' });

    const categories = await Major.find({ kind: 'category' }).select('name -_id');
    res.status(201).json(categories.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    await Major.findByIdAndDelete(id);
    res.status(200).json({ message: 'Type deleted successfully' }); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  };  

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Major.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

const getPopularCategories = async (req, res) => {
  try {
    const categories = await Major.find({ kind: 'category' }).sort({ borrowCount: -1 }).limit(5);
    res.status(200).json(categories);
  } catch (error) { 
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTypes,
  getCategories,
  getType,
  getCategory,
  addType,
  addCategory,
  deleteType,
  deleteCategory,
  getPopularCategories,
};
