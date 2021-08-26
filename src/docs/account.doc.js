export const accountTags = {
    "name": "Account",
    "description": "API endpoints for user accounts in the system"
}

export const accountPath = {
    "/account/login": {
        "post": {
            "tags": [ "Account" ],
            "summary": "User Login Endpoint. Returns ",
            "description": "Returns json object of user data",
            "requestBody": {
                "description": "Require **email** and **password** as json object",
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {}
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "OK"
                },
                "401": {
                    "description": "error"
                }
            }
        },

    },
    // "/users/id/{id}": {
    //     "get": {
    //         "tags": [ "Users" ],
    //         "summary": "Get all users in system",
    //         "parameters": [
    //             {
    //                 "name": "id",
    //                 "in": "path",
    //                 "description": "ID of pet to use",
    //                 "required": true
    //             }
    //         ],
    //         "responses": {
    //             "200": {
    //                 "description": "OK"
    //             },
    //             "401": {
    //                 "description": "error"
    //             }
    //         }
    //     },

    // }
}

