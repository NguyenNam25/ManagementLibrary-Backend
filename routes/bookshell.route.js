const express = require('express')
const router = express.Router()
const {
    getBookShell,
    getBookShells,
    getlistBookOnShell,
    addBookToShell
} = require('../controllers/bookshell.controller.js')

router.get('/', getBookShells)
router.get('/:name', getBookShell)
router.get('/:name/listbook', getlistBookOnShell)
router.post('/add-book', addBookToShell)

module.exports = router