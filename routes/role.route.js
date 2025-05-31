const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');

const { getRoles, getRole, createRole, updateRole } = require('../controllers/role.controller.js')

router.get("/", checkTokenAuthen, getRoles)

router.get("/:id", checkTokenAuthen, getRole)

router.post("/", checkTokenAuthen, createRole)

router.put("/:id", checkTokenAuthen, updateRole)

module.exports = router;