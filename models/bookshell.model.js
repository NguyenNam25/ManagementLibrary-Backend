const mongoose = require('mongoose')

const BookShellSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }]
    }
)

const BookShell = mongoose.model('BookShell', BookShellSchema)

module.exports = BookShell