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
router.get("/", getBorrowTickets);
router.get("/:id", getBorrowTicket);
router.get('/:id/listbook', getListBookOfTicket);
router.get('/cardnumber/:cardNumber', getBorrowTicketByCardNumber);

// Protected routes (auth required)
router.post("/", createBorrowTicket);
router.put('/:id', checkTokenAuthen, updateBorrowTicket);
router.delete('/:id', deleteBorrowTicket);

module.exports = router
