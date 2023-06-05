const router = require("express").Router()
const Admin = require("../model/admins")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/adminauth")
const multer = require("multer")

const storage = multer.diskStorage({    
    destination: function (req, file, cb)
    {

       cb(null, "./public/productimg")
   },
   filename: function (req, file, cb) {
     cb(null, file.fieldname + "-" + Date.now()+".jpg")
   }
 })


var upload = multer({
   storage: storage 
})





router.get("/dashboard",aauth,(req,resp)=>{
    resp.render("dashboard")
})

router.get("/admin",(req,resp)=>{
    resp.render("admin_login")
})

router.post("/do_adminlogin", async(req,resp)=>{
    try {
        
            const admin = await Admin.findOne({uname:req.body.uname})

            if(admin.pass===req.body.pass)
            {
                const token = await jwt.sign({_id:admin._id},process.env.A_KEY)
                resp.cookie("ajwt",token)
                resp.redirect("dashboard")
            }
            else{
             
                resp.render("admin_login",{err:"Invalid credentials"})
            }
    } catch (error) {
        console.log(error);
        resp.render("admin_login",{err:"Invalid credentials"})
    }
})


router.get("/admin_logout",aauth,async(req,resp)=>{
    try {
        
        resp.clearCookie("ajwt")
        resp.render("admin_login")

    } catch (error) {
        console.log(error);
    }
})




//**********************category*********************** */
const Category = require("../model/categories")

router.get("/category",aauth,async(req,resp)=>{
    try {

        const data = await Category.find()
        resp.render("category",{catdata:data})
    } catch (error) {
        
    }
})

router.post("/add_category",aauth,async(req,resp)=>{
    try {
        const cat = new Category(req.body)
        await cat.save();
        resp.redirect("category")
    } catch (error) {
        console.log(error);
    }
})

//************************products***************** */
const Product = require("../model/products")
router.get("/products",aauth,async(req,resp)=>{
    try {
        const data = await Category.find()
        const prod = await Product.aggregate([{$lookup:{from:"categories",localField:"catid", foreignField:"_id", as:"category"}}])
        resp.render("products",{catdata:data,proddata:prod})
    } catch (error) {
        console.log(error);
    }
})

router.post("/add_product",upload.single("file"),async(req,resp)=>{
    try {
        const prod = new Product({
            catid : req.body.catid,
            pname : req.body.pname,
            price: req.body.price,
            qty : req.body.qty,
            img : req.file.filename
        })
        await prod.save();
        resp.redirect("products")
    } catch (error) {
        console.log(error);
    }
})

//************************usuers */
const User = require("../model/users")
router.get("/viewusers",async(req,resp)=>{
    try {
        const users = await User.find()
        resp.render("users",{userdata : users})
    } catch (error) {
        console.log(error);
    }
})

//*******************************orders***** */
const Order = require("../model/orders")
router.get("/vieworders",async(req,resp)=>{
   try {
    const oderdata = await Order.find();
    resp.render("orders",{orderdata:oderdata})

   } catch (error) {
    console.log(error);
   }
})




module.exports=router