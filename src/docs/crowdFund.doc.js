exports.crowdFundTag = {
    "name": "CrowdFund",
    "description": "API endpoints for crowd funding"
}

exports.crowdFundPaths = {
    "/crowd_fund/apply": {
        "post": {
            "tags": [ "CrowdFund" ],
            "summary": "Endpoint to apply for crowd funding.",
            "description": "Returns json object of application data",
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
                                "amount_needed": {
                                    "type": "string",
                                },
                                "investment_deadline": {
                                    "type": "string"
                                },
                                "maturity_date": {
                                    "type": "string"
                                },
                                "roi": {
                                    "type": "string"
                                },
                                "description": {
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
                    "description": "Farm not found"
                },
                "500": {
                    "description": "Internal server error."
                }
            }
        }
    },
    "/crowd_fund/farm/{farm_id}": {
        "get": {
            "tags": [ "CrowdFund" ],
            "summary": "List all crowd funds of specified farm.",
            "description": "Returns array of crowd funds",
            "parameters": [
                {
                    "name": "farm_id",
                    "in": "path",
                    "description": "ID of farm",
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

