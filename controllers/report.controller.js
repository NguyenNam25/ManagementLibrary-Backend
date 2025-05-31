const Report = require("../models/report.model.js");

const getReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.status(200).json({ reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReport = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById({ id });
    res.status(200).json({ report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReport = async (req, res) => {
  try {
    const {id} = req.params
    const report = await Report.findByIdAndUpdate(id, req.body)

    if(!report){
        res.status(404).json({message: "Report not found"})
    }

    const updatedReport = await Report.findById({id})

    res.status(200).json({updatedReport})
  } catch (error) {
    res.status(500).json({message: error.message})
  }
};

const deleteReport = async(req, res) => {
    try {
        const {id} = req.params
        const deleteReport = await Report.findByIdAndDelete(id, req.body)

        if(!deleteReport) {
            res.status(404).json({message: "Report not found"})
        }

        res.status(200).json({message: "Report deleted successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    getReports,
    getReport,
    createReport,
    updateReport,
    deleteReport
}
