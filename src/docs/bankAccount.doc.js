exports.bankAccountTag = {
    "name": "Bank Accounts",
    "description": "API endpoints for bank accounts"
}



const accountRegistrationResponses = {
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

exports.bankAccountPaths = {
    "/account/bank": {
        "post": {
            "tags": [ "Bank Accounts" ],
            "summary": "Bank Account registration endpoint.",
            "description": "Returns json object of bank details",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "account_number": {
                                    "type": "string"
                                },
                                "account_name": {
                                    "type": "string"
                                },
                                "bank_code": {
                                    "type": "string"
                                },
                                "bvn": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                ...accountRegistrationResponses
            }
        }
    },
    "/account/bank/list": {
        "get": {
            "tags": [ "Bank Accounts" ],
            "summary": "List all user bank accounts.",
            "description": "Returns array of data",
            "responses": {
                "200": {
                    "description": "oK"
                },
                "404": {
                    "description": "No record found."
                }
            }
        }
    },
    "/account/bank/delete/{id}": {
        "delete": {
            "tags": [ "Bank Accounts" ],
            "summary": "Endpoint to delete bank account",
            "description": "Returns message",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID of bank account to delete",
                    "required": true
                }
            ],
            "responses": {
                "200": {
                    "description": "oK"
                },
                "401": {
                    "description": "Unauthorized permission denied."
                },
                "404": {
                    "description": "No record found"
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        }

    }

}

