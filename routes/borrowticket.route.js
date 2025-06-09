const express = require("express");
const router = express.Router();
const { checkTokenAuthen } = require('../middleware/auth');

const {
  getBorrowTickets,
  getBorrowTicket,
  createBorrowTicket,
  updateBorrowTicket,
  deleteBorrowTicket,
  getListBookOfTicket,
  getBorrowTicketByCardNumber
} = require("../controllers/borrowticket.controller.js");

// Public routes (no auth needed)
router.get("/", checkTokenAuthen, getBorrowTickets);
router.get("/:id", checkTokenAuthen, getBorrowTicket);
router.get('/:id/listbook', checkTokenAuthen, getListBookOfTicket);
router.get('/cardnumber/:cardNumber', checkTokenAuthen, getBorrowTicketByCardNumber);

// Protected routes (auth required)
router.post("/", checkTokenAuthen, createBorrowTicket);
router.put('/:id', checkTokenAuthen, updateBorrowTicket);
router.delete('/:id', checkTokenAuthen, deleteBorrowTicket);

module.exports = router
