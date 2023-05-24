

const jwt = require("jsonwebtoken")
const User = require("../model/users")

const auth = async(req,resp,next)=>{

    try {
        

        const mytoken = req.cookies.jwt
      
        const verifyToken = await jwt.verify(mytoken,process.env.S_KEY)

        if(verifyToken)
        {
            const userdata = await User.findOne({_id:verifyToken._id})
            req.user = userdata
            req.token = mytoken
            next()
        }


    } catch (error) {
        
        resp.render("login",{err:"Please login first !!!!"})
    }


}

module.exports=auth