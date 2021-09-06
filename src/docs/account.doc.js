exports.accountTag = {
    "name": "Account",
    "description": "API endpoints for user accounts in the system"
}

const loginSchema = {
    "post": {
        "tags": [ "Account" ],
        "summary": "Login Endpoint.",
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
}

const userAccountRegistrationResponses = {
    "201": {
        "description": "Created"
    },
    "400": {
        "description": "Bad request"
    },
    "401": {
        "description": "Unauthorized request"
    },
    "500": {
        "description": "Internal server error."
    }
}

exports.accountPaths = {
    "/account/farmer/login": { ...loginSchema },
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
                                    "type": "string"
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
                ...userAccountRegistrationResponses
            }
        }
    },
    "/account/farm_moderator/login": { ...loginSchema },
    "/account/farm_moderator/register": {
        "post": {
            "tags": [ "Account" ],
            "summary": "Farmer moderator registration Endpoint.",
            "description": "Returns json object of user data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "farm_id": {
                                    "type": "string"
                                },
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
                                    "type": "string"
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
                ...userAccountRegistrationResponses
            }
        }
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

}

