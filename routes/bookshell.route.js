const express = require('express')
const router = express.Router()
const {
    getBookShell,
    getBookShells,
    getlistBookOnShell,
    addBookToShell
} = require('../controllers/bookshell.controller.js')

router.get('/', getBookShells)
router.get('/shell/:name', getBookShell)
router.get('/shell/:name/listbook', getlistBookOnShell)
router.post('/add-book', addBookToShell)

module.exports = router