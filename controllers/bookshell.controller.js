const BookShell = require('../models/bookshell.model.js')

const getBookShells = async (req, res) => {
    try {
        const bookshells = await BookShell.find({})
        res.status(200).json({bookshells})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getBookShell = async (req, res) => {
    try {
        const {name} = req.params
        const bookshell = await BookShell.findOne({name})

        if (!bookshell) {
            return res.status(404).json({ message: 'Không tìm thấy kệ sách' })
        }

        res.status(200).json({bookshell})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const getlistBookOnShell = async (req, res) => {
    try {
        const {name} = req.params
        const listbook = await BookShell.findOne({name}).populate('books')

        if(!listbook){
            return res.status(404).json({ message: 'Không tìm thấy kệ sách' })
        }

        res.status(200).json({bookshell})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const addBookToShell = async (req, res) => {
    try {
        const { name, bookId } = req.body

        const bookshell = await BookShell.findOne({name})
        if (!bookshell) {
            return res.status(404).json({ message: 'Không tìm thấy kệ sách' })
        }

        // Kiểm tra nếu sách đã có trong kệ thì không thêm lại
        if (bookshell.books.includes(bookId)) {
            return res.status(400).json({ message: 'Sách đã có trong kệ' })
        }

        bookshell.books.push(bookId)
        await bookshell.save()

        res.status(200).json({ message: 'Đã thêm sách vào kệ', bookshell })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteBookFromShell = async (req, res) => {
    try {
        const { name , bookId } = req.body

        const bookshell = await BookShell.findOne({name})

        if (!bookshell) {
            return res.status(404).json({ message: 'Không tìm thấy kệ sách' })
        }

        const index = bookshell.books.indexOf(bookId)
        if (index === -1) {
            return res.status(404).json({ message: 'Sách không tồn tại trong kệ' })
        }

        bookshell.books.splice(index, 1)
        await bookshell.save()

        res.status(200).json({ message: 'Đã xoá sách khỏi kệ', bookshell })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getBookShell,
    getBookShells,
    getlistBookOnShell,
    addBookToShell,
    deleteBookFromShell,
}