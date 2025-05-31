const Role = require("../models/role.model.js");

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role with this name already exists" });
    }
    
    const role = await Role.create({
      name,
      permissions: permissions || []
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    // Check if role exists
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // If name is being updated, check for duplicates
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: "Role with this name already exists" });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      {
        name: name || role.name,
        permissions: permissions || role.permissions
      },
      { new: true }
    );

    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRoles, getRole, createRole, updateRole };
