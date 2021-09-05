const userTypes = require( "../utils/userTypes.utils.js" );

exports.farmerAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.farmer;
    next();
}

exports.investorAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.investor;
    next();
}


exports.farmModeratorAccountType = ( req, res, next ) => {
    req.body.user_type = userTypes.moderator;
    next();
}