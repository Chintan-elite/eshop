const router = require("express").Router()
const Admin = require("../model/admins")
const jwt = require("jsonwebtoken")
const aauth = require("../middleware/adminauth")


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
router.get("/products",aauth,async(req,resp)=>{
    try {
        const data = await Category.find()
        resp.render("products",{catdata:data})
    } catch (error) {
        
    }
})



module.exports=router