import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jwt-then';
import config from '../../config/config';
import User from '../users/user.model';

export default class UserController {
  public authenticate = async (req: Request, res: Response): Promise<any> => {
    const { email, pass } = req.body;
    
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found'
        });
      }
      // const hashPass = await bcrypt.hash(pass, config.SALT_ROUNDS);

      const matchPasswords = await bcrypt.compare(pass, user.pass);
      
      console.log(matchPasswords);

      if (!matchPasswords) {
        return res.status(401).send({
          success: false,
          message: 'Not authorized'
        });
      }

      const token = await jwt.sign({ email }, config.JWT_ENCRYPTION, {
        expiresIn: config.JWT_EXPIRATION
      });

      res.status(200).send({
        success: true,
        message: 'Token generated Successfully',
        data: token
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public register = async (req: Request, res: Response): Promise<any> => {
    // const { name, lastName, email, password } = req.body;
    const { name, email, pass, isAdmin, imgChange } = req.body;
    // console.log(req.body);
    
    try {
      const hash = await bcrypt.hash(pass, config.SALT_ROUNDS);
      
      
      const user = new User({
        name,
        email,
        pass: hash,
        isAdmin,
        imgChange,
      });

      const newUser = await user.save();

      // console.log(newUser);

      res.status(201).send({
        success: true,
        message: 'User Successfully created',
        data: newUser
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };
}
