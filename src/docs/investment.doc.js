exports.investmentTag = {
    "name": "Investment",
    "description": "API endpoints for crowd funding investments"
}

exports.investmentPaths = {
    "/crowd_fund/invest": {
        "post": {
            "tags": [ "Investment" ],
            "summary": "Endpoint to invest in crowd funding.",
            "description": "Return json object of investment data",
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
                                "amount": {
                                    "type": "string"
                                },
                                "txref": {
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
                "404": {
                    "description": "Crowd funding found"
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        }
    },
    "/crowd_fund/investments/{crowd_fund_id}": {
        "get": {
            "tags": [ "Investment" ],
            "summary": "List all investments of specified crowd funds.",
            "description": "Returns array of investments",
            "parameters": [
                {
                    "name": "crowd_fund_id",
                    "in": "path",
                    "description": "ID of crowd fund",
                    "required": true
                }
            ],
            "responses": {
                "200": {
                    "description": "oK"
                },
                "404": {
                    "description": "No record found."
                }
            }
        }


    }
}

