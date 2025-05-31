const express = require("express");
const router = express.Router();

const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
} = require("../controllers/report.controller.js");

router.get('/', getReports)
router.get('/:id', getReport)
router.post('/',createReport)
router.put('/:id', updateReport)
router.delete('/:id', deleteReport)

module.exports = router
