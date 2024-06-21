import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = (req,res)=>{
  // get data from env
    dotenv.config
    const userLogin = process.env.LOGIN
    const userPassword = process.env.PASSWORD
    // generate hash for password check
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(userPassword, salt);
        //Check password
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          hash
        );
        if(userLogin!=req.body.username) //check login
        return res.status(400).json("Wrong username or password!");
        if (!isPasswordCorrect)
          return res.status(400).json("Wrong username or password!");
        // create token
        const token = jwt.sign({ id: 1 }, "jwtkey");
        const { password, ...other } = userPassword;
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(other);
      }