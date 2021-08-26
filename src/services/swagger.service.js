import dotenv from "dotenv";
import { userPath, userTags } from "../docs/user.doc.js";

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
        userTags
    ],
    "paths": {
        ...userPath
    },
}

export default swaggerConfig;