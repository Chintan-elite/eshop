

const jwt = require("jsonwebtoken")
const Admin = require("../model/admins")

const auth = async(req,resp,next)=>{

    try {
        

        const mytoken = req.cookies.ajwt
      
        const verifyToken = await jwt.verify(mytoken,process.env.A_KEY)

        if(verifyToken)
        {
            const admindata = await Admin.findOne({_id:verifyToken._id})
            req.admin = admindata
            req.token = mytoken
            next()
        }


    } catch (error) {
        
        resp.render("admin_login",{err:"Please login first !!!!"})
    }


}

module.exports=auth