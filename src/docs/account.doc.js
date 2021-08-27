export const accountTag = {
    "name": "Account",
    "description": "API endpoints for user accounts in the system"
}

export const accountPaths = {
    "/account/login": {
        "post": {
            "tags": [ "Account" ],
            "summary": "User Login Endpoint.",
            "description": "Returns json object of user data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string"
                                },
                                "password": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "OK"
                },
                "400": {
                    "description": "Validation error"
                },
                "401": {
                    "description": "Invalid login"
                },
                "403": {
                    "description": "Account has not been activated."
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        },

    },
    "/account/verify": {
        "post": {
            "tags": [ "Account" ],
            "summary": "Endpoint will be used to activate user account. ",
            "description": "Returns json object of user data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "type": "string"
                                },
                                "activation_code": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "OK"
                },
                "400": {
                    "description": "Validation error"
                },
                "401": {
                    "description": "Bad Request"
                },
                "500": {
                    "description": "Internal server error"
                }
            }
        },

    },
    "/account/farmer/register": {
        "post": {
            "tags": [ "Account" ],
            "summary": "Farmer registration Endpoint.",
            "description": "Returns json object of user data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "firstname": {
                                    "type": "string"
                                },
                                "lastname": {
                                    "type": "string"
                                },
                                "phone": {
                                    "type": "string"
                                },
                                "email": {
                                    "type": "string"
                                },
                                "gender": {
                                    "type": "char"
                                },
                                "password": {
                                    "type": "string"
                                },
                                "confirm_password": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "OK"
                },
                "400": {
                    "description": "Bad request"
                },
                "401": {
                    "description": "Invalid login"
                },
                "403": {
                    "description": "Account has not been activated."
                },
                "500": {
                    "description": "Internal server error."
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

