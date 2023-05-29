const router = require("express").Router()
const auth = require("../middleware/auth")
const Category = require("../model/categories")
const Product = require("../model/products")

router.get("/",async(req,resp)=>{
    const data = await Category.find()
    const Prod = await Product.find()
    resp.render("index",{catdata:data,proddata:Prod})
})

router.get("/shop",(req,resp)=>{
    resp.render("shop")
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

router.get("/details",async (req,resp)=>{

    const id = req.query.pid;
    try {
        const prod = await Product.findOne({_id:id})
        resp.render("detail",{product:prod})
    } catch (error) {
        console.log(error);
    }
   
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
    
        const isMatch = await bcrypt.compare(req.body.pass,user.pass)
       
        if(isMatch)
        {
            const token = await jwt.sign({_id:user._id},process.env.S_KEY)
            resp.cookie("jwt",token)
            resp.redirect("/")
        }
        else 
        {
            resp.render("login",{err:"Invalid credentials !!!"})
        }


    } catch (error) {
        resp.render("login",{err:"Invalid credentials !!!"})
    }
})

//*************************cart *********/

router.get("/cart",auth,async(req,resp)=>{
    const user = req.user
    try {
        const cartdata = await Cart.aggregate([{$match:{uid:user._id}},{$lookup:{from:"products",localField:"pid",foreignField:"_id",as:"product"}}])
       
        resp.render("cart",{currentuser:user.uname,cartdata :cartdata})
    } catch (error) {
        console.log(error);
    }
    
   
})

const Cart = require("../model/carts")
router.get("/add_cart",auth,async(req,resp)=>{

    const pid = req.query.pid
    const uid = req.user._id
    
    try {
        
        const pdata = await Product.findOne({_id:pid})
        const cart = new Cart({
            uid : uid,
            pid : pid,
            qty : 1,
            price : pdata.price,
            total : pdata.price
        })
        await cart.save()
        resp.redirect("/")
    } catch (error) {
        console.log(error);
    }
})

module.exports=router