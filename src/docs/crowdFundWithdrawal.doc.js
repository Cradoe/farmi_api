exports.crowdFundWithdrawalTag = {
    "name": "CrowdFund Withdrawal",
    "description": "API endpoints for withdrawing crowd funds"
}

exports.crowdFundWithdrawalPaths = {
    "/crowd_fund/withdrawal/request": {
        "post": {
            "tags": [ "CrowdFund Withdrawal" ],
            "summary": "Endpoint to request for withdrawal.",
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
    "/crowd_fund/withdrawal/confirm": {
        "post": {
            "tags": [ "CrowdFund Withdrawal" ],
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
    "/crowd_fund/withdrawals/{farm_id}": {
        "get": {
            "tags": [ "CrowdFund Withdrawal" ],
            "summary": "Endpoint to get all farm crowdfund withdrawals.",
            "description": "Returns array of json objects",
            "parameters": [
                {
                    "name": "farm_id",
                    "in": "path",
                    "description": "ID of farm",
                    "required": true
                }
            ],
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
}

