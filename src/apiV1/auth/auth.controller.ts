import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import * as jwt from 'jwt-then';
import config from '../../config/config';
import User from '../users/user.model';
import Roles from '../roles/roles.model';

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
    

      if (!matchPasswords) {
        return res.status(401).send({
          success: false,
          message: 'Not authorized'
        });
      }
      
      let isAdmin:any; 
      
       Roles.findById('5d7f6f73c9fdeb2d84355d1e', async (err, roles) => {
      // console.log(roles.admins.length);
      
        for(let i = 0; i < roles.admins.length; i++){
          if (roles.admins[i] === email) {
            isAdmin = true;
            break
          } else {
            isAdmin = false
          }
          
        }
        const userData = {id: user._id, name: user.name, email: user.email, isAdmin: isAdmin}
        const token = await jwt.sign( {userData}, config.JWT_ENCRYPTION, {
          expiresIn: config.JWT_EXPIRATION
        });
        res.status(200).send({
          success: true,
          message: 'Token generated Successfully',
          data: token,
        });
      })
            
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public register = async (req: Request, res: Response): Promise<any> => {
   
    const { name, email, pass, imgChange } = req.body;
   
    try {
      const hash = await bcrypt.hash(pass, config.SALT_ROUNDS);
      
      
      const user = new User({
        name,
        email,
        pass: hash,
        imgChange,
      });

      const newUser = await user.save();

      Roles.findById('5d7f6f73c9fdeb2d84355d1e', (err, roles) => {
        roles.users.push(email)
        roles.save()
      })

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
