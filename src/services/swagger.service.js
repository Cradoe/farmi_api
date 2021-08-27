import dotenv from "dotenv";
import { accountPaths, accountTag } from "../docs/account.doc.js";
import { farmPaths, farmTag } from "../docs/farm.doc.js";
import { farmerPaths, farmerTag } from "../docs/farmer.doc.js";

dotenv.config();

const swaggerConfig = {
    "openapi": '3.0.0',
    "info": {
        "version": "1.0.0",
        "title": "Farmi API",
        "description": "Farmi API documentation",

    },
    "servers": [
        {
            url: 'http://127.0.0.1:' + process.env.PORT || 3331,
            description: 'Development server',
        },
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "responses": {
        "NotFound": {
            "description": "Entity not found."
        },
        "IllegalInput": {
            "description": "Illegal input for operation."
        },
        "GeneralError": {
            "description": "General Error"
        }
    },
    "tags": [
        accountTag,
        farmTag,
        farmerTag
    ],
    "paths": {
        ...accountPaths,
        ...farmPaths,
        ...farmerPaths
    },
}

export default swaggerConfig;