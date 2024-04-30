import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = (req,res)=>{
    dotenv.config
    const userLogin = process.env.LOGIN
    const userPassword = process.env.PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);
    
        //Check password
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          hash
        );
        if(userLogin!=req.body.username)
        return res.status(400).json("Wrong username or password!");
        if (!isPasswordCorrect)
          return res.status(400).json("Wrong username or password!");
    
        const token = jwt.sign({ id: 1 }, "jwtkey");
        const { password, ...other } = userPassword;
    
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(other);
      }