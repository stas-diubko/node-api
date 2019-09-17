import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jwt-then';
import config from '../../config/config';
import Book from './books.model'

export default class BooksController {
    public addBook = async (req: Request, res: Response): Promise<any> => {
   
        const { bookTitle, bookAuthor, bookDescript, bookPrice, bookImg} = req.body;
        // console.log(req.body);
        
        try {
          
          const book = new Book({
            bookTitle,
            bookAuthor,
            bookDescript,
            bookPrice,
            bookImg
          });
    
          const newBook = await book.save();
    
          res.status(201).send({
            success: true,
            message: 'Book Successfully created',
            data: newBook
          });

        } 
        
        catch (err) {
          res.status(500).send({
            success: false,
            message: err.toString()
          });
        }
      };

      public findAllBooks = async (req: Request, res: Response): Promise<any> => {
        try {
          const books = await Book.find();
          if (!books) {
            return res.status(404).send({
              success: false,
              message: 'Books not found',
              data: null
            });
          }
    
          res.status(200).send({
            success: true,
            data: books
          });
        } catch (err) {
          res.status(500).send({
            success: false,
            message: err.toString(),
            data: null
          });
        }
      };

      public updateBook = async (req: Request, res: Response): Promise<any> => {
        const { bookTitle, bookAuthor, bookDescript, bookPrice, bookImg} = req.body;
        // console.log(name);
        
        try {
          const bookUpdated = await Book.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                bookTitle, 
                bookAuthor, 
                bookDescript, 
                bookPrice, 
                bookImg
              }
            },
            { new: true }
          );
    
          if (!bookUpdated) {
            return res.status(404).send({
              success: false,
              message: 'Book not found',
              data: null
            });
          }
          res.status(200).send({
            success: true,
            data: bookUpdated
          });
    
          
        } catch (err) {
          res.status(500).send({
            success: false,
            message: err.toString(),
            data: null
          });
        }
      };

      public removeBook = async (req: Request, res: Response): Promise<any> => {
        try {
          const book = await Book.findByIdAndRemove(req.params.id);
    
          if (!book) {
            return res.status(404).send({
              success: false,
              message: 'User not found',
              data: null
            });
          }
          res.status(204).send();
        } catch (err) {
          res.status(500).send({
            success: false,
            message: err.toString(),
            data: null
          });
        }
      };


}