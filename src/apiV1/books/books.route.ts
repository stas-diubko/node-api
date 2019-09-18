import { Router } from 'express';
import Controller from './books.controller';

const book: Router = Router();
const controller = new Controller();

book.post('/', controller.addBook)
book.get('/', controller.findAllBooks);
book.put('/:id', controller.updateBook);
book.delete('/:id', controller.removeBook);
book.get('/:id', controller.findOneBook);


export default book;