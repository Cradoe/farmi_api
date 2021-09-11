exports.investorTag = {
    "name": "Investors",
    "description": "API endpoints for investors"
}

exports.investorPaths = {
    "/investor/investments": {
        "get": {
            "tags": [ "Investors" ],
            "summary": "List all investments",
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

    "/investor/withdrawal/request": {
        "post": {
            "tags": [ "Investors" ],
            "summary": "Endpoint to request for investment withdrawal.",
            "description": "Returns json object",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "crowd_fund_id": {
                                    "type": "string"
                                },
                                "bank_account_id": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "201": {
                    "description": "Created"
                },
                "400": {
                    "description": "Bad Request"
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        }

    },
    "/investor/withdrawal/confirm": {
        "post": {
            "tags": [ "Investors" ],
            "summary": "Endpoint to confirm for withdrawal.",
            "description": "Returns json object",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "txref": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Ok"
                },
                "400": {
                    "description": "Bad Request"
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        }
    },
}

