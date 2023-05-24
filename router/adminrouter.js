const router = require("express").Router()

router.get("/dashboard",(req,resp)=>{
    resp.render("dashboard")
})

router.get("/admin",(req,resp)=>{
    resp.render("admin_login")
})

module.exports=router