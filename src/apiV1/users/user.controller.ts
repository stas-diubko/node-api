import { Request, Response } from 'express';
import * as jwt from 'jwt-then';
import config from '../../config/config';
import User from './user.model';
import Roles from '../roles/roles.model'

export default class UserController {
  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: users
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
          
      const user = await User.findById(req.params.id, { password: 0 });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
 
      res.status(200).send({
        success: true,
        data: user
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const { name, imgChange} = req.body;
        
    try {
      const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name,
            imgChange
          }
        },
        { new: true }
      );

      let isAdmin:any; 
      
      Roles.findById('5d7f6f73c9fdeb2d84355d1e', async (err, roles) => {
     
       for(let i = 0; i < roles.admins.length; i++){
         if (roles.admins[i] == userUpdated.email) {
           isAdmin = true;
           break
         } else {
           isAdmin = false
         }
       }
       const userData = {id: userUpdated._id, name: userUpdated.name, email: userUpdated.email, isAdmin: isAdmin}
       const token = await jwt.sign( {userData}, config.JWT_ENCRYPTION, {
         expiresIn: config.JWT_EXPIRATION
       });
       if (!userUpdated) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      res.status(200).send({
        success: true,
        data: token
      });

     })
      
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
     
      Roles.findById('5d7f6f73c9fdeb2d84355d1e', (err, roles) => {
        let index = roles.users.findIndex((i:any) => i.email == user.email);
        roles.users.splice(index, 1)
        roles.save()
      })
      if (!user) {
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
