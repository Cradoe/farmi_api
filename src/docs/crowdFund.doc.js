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


    },
    "/crowd_fund": {
        "get": {
            "tags": [ "CrowdFund" ],
            "summary": "List of crowd funds.",
            "description": "Returns array of crowd funds",
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
    "/crowd_fund/details/{crowd_fund_id}": {
        "get": {
            "tags": [ "CrowdFund" ],
            "summary": "Get details of specific crowd funding.",
            "description": "Returns json data object",
            "parameters": [
                {
                    "name": "crowd_fund_id",
                    "in": "path",
                    "description": "ID of the crowd fund",
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


    }, "/crowd_fund/invest": {
        "post": {
            "tags": [ "CrowdFund" ],
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
    }
}

