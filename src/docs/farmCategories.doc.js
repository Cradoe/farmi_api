exports.farmCategoryTag = {
    "name": "Farm Category",
    "description": "API endpoints for farm categories"
}

exports.farmCategoryPaths = {
    "/farm_category/create": {
        "post": {
            "tags": [ "Farm Category" ],
            "summary": "Endpoint to create category.",
            "description": "Returns json object of application data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "category": {
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
    "/farm_category": {
        "get": {
            "tags": [ "Farm Category" ],
            "summary": "List all farm categories.",
            "description": "Returns array of objects",
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

