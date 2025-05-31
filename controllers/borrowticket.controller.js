const BorrowTicket = require('../models/borrowticket.model.js')

const getBorrowTickets = async (req, res) => {
    try {
        const borrowtickets = await BorrowTicket.find({});
        res.status(200).json(borrowtickets);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getBorrowTicket = async (req, res) => {
    try {
        const { id } = req.params
        const borrowTicket = await BorrowTicket.findById({id})
        res.status(200).json(borrowTicket);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getBorrowTicketByCardNumber = async (req, res) => {
    try {
        const { cardNumber } = req.params;
        const borrowTicket = await BorrowTicket.find({ cardNumber });
        res.status(200).json(borrowTicket); 
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getListBookOfTicket = async (req, res) => {
    try {
        const {id} = req.params
        const listBook = await BorrowTicket.findById(id).populate('books')
        res.status(200).json(listBook)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const createBorrowTicket = async (req, res) => {
    try {
        const ticket = await BorrowTicket.create(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateBorrowTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await BorrowTicket.findByIdAndUpdate(id, req.body);
        if (!ticket) {
          return res.status(404).json({ message: "Borrow ticket not found" });
        }
        const updatedTicket = await BorrowTicket.findById(id);
        res.status(200).json(updatedTicket);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

const deleteBorrowTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await BorrowTicket.findByIdAndDelete(id, req.body);
    if (!ticket) {
      return res.status(404).json({ message: "Borrow ticket not found" });
    }
    res.status(200).json({ messafe: "Borrow ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
    getBorrowTickets,
    getBorrowTicket,
    createBorrowTicket,
    updateBorrowTicket,
    deleteBorrowTicket,
    getListBookOfTicket,
    getBorrowTicketByCardNumber
}