import { userTypes } from "../utils/userTypes.utils.js"

export const farmerAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.farmer;
    next();
}