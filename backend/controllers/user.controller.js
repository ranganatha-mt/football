import {User} from "../models/user.model.js";
import { Op } from 'sequelize';

export const users = async(req,res)=>
{
    try {
        const { page = 1, limit = 10, search = '',user_type } = req.query;
        const offset = (page - 1) * limit;
    
        const users_list = await User.findAndCountAll({
            attributes: { exclude: ['password'] },  // Exclude the password field
          where: {
            user_type: user_type,
            full_name: {
              [Op.like]: `%${search}%`,
            },
          },
          limit: parseInt(limit),
          offset: parseInt(offset),
        });
    
        const totalPages = Math.ceil(users_list.count / limit);
    
        res.status(200).json({
          sucess:true,
          users: users_list.rows,
          totalPages,
          currentPage: parseInt(page),
          totalUsers: users_list.count,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ sucess:false,message: "Internal Server Error" });
      }
}

export const usersCount = async(req,res)=>
{
    try {
      const {role} = req.query;
      //console.log(role)
      const playerCount = await User.count({
        where: { user_type: role }
      });
      res.json({ count: playerCount });
    
    } catch (error) {
      console.error("Error fetching player count:", error);
      res.status(500).json({sucess:false, message: 'Error fetching player count' });
    }
}