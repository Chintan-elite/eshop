const router = require("express").Router()
const auth = require("../middleware/auth")
const Category = require("../model/categories")

router.get("/",async(req,resp)=>{
    const data = await Category.find()
    resp.render("index",{catdata:data})
})

router.get("/shop",(req,resp)=>{
    resp.render("shop")
})

router.get("/cart",auth,(req,resp)=>{
    const user = req.user
    resp.render("cart",{currentuser:user.uname})
})

router.get("/contact",(req,resp)=>{
    resp.render("contact")
})

router.get("/registration",(req,resp)=>{
    resp.render("registration")
})

router.get("/login",(req,resp)=>{
    resp.render("login")
})

//*************************user registration****************** */
const User = require("../model/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
router.post("/do_register",async(req,resp)=>{
    try {
        const user = new User(req.body)
        await user.save();
        resp.render("registration",{msg:"Registration successfully done !!!"})
    } catch (error) {
        console.log(error);
    }
})

router.post("/do_login",async(req,resp)=>{
    try {
        
        const user = await User.findOne({email:req.body.email})
        console.log(user);
        const isMatch = await bcrypt.compare(req.body.pass,user.pass)
       
        if(isMatch)
        {
            const token = await jwt.sign({_id:user._id},process.env.S_KEY)
            resp.cookie("jwt",token)
            resp.render("index",{currentuser:user.uname})
        }
        else 
        {
            resp.render("login",{err:"Invalid credentials !!!"})
        }


    } catch (error) {
        resp.render("login",{err:"Invalid credentials !!!"})
    }
})



module.exports=router