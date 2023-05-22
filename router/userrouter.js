const router = require("express").Router()



router.get("/",(req,resp)=>{
    resp.render("index")
})

router.get("/shop",(req,resp)=>{
    resp.render("shop")
})

router.get("/cart",(req,resp)=>{
    resp.render("cart")
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




module.exports=router