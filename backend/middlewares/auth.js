import jwt from "jsonwebtoken";

const authMiddelware = async(req, res, next) => {

    const { token } = req.headers;
    if(!token) {
        return res.json({success: false, message: "Not authorized, login again"});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error});
        
    }

}

export default authMiddelware;