import { userTypes } from "../utils/userTypes.utils.js"

export const farmerAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.farmer;
    next();
}

export const investorAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.investor;
    next();
}


export const farmModeratorAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.moderator;
    next();
}