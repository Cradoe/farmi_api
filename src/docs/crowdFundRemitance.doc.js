exports.crowdFundRemitanceTag = {
    "name": "CrowdFund Remitance",
    "description": "API endpoints for remiting debt of crowd funds"
}

exports.crowdFundRemitancePaths = {
    "/crowd_fund/withdrawal/refund": {
        "post": {
            "tags": [ "CrowdFund Remitance" ],
            "summary": "Endpoint to remit money.",
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
                "500": {
                    "description": "Internal server error."
                }
            }
        }

    }
}

