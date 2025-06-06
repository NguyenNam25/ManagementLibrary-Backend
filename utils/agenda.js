require("dotenv").config();
const Agenda = require("agenda");

const mongoConnectionString = process.env.MONGODB_URI;

const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "agendaJobs" },
  processEvery: "30 seconds",
});

module.exports = agenda;