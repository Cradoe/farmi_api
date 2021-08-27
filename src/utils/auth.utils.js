
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = ( accountId ) => {
    const secretKey = process.env.SECRET_JWT || "";
    const token = jwt.sign( { account_id: accountId }, secretKey, {
        expiresIn: '24h'
    } );

    return token;
}