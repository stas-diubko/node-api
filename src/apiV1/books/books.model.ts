import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const BooksSchema = Schema(
    {
        bookTitle: {
            type: String,
            required: true
        },
        bookAuthor: {
            type: String,
            required: true
        },
        bookDescript: {
            type: String,
            required: true
        },
        bookPrice: {
            type: String,
            required: true
        },
        bookImg: {
            type: String,
            required: true
        }
    }
)

export default mongoose.model("Book", BooksSchema);
