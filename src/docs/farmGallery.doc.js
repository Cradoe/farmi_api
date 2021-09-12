exports.farmGalleryTag = {
    "name": "Farm Gallery",
    "description": "API endpoints for farm gallery"
}

exports.farmGalleryPaths = {
    "/farm/gallery/upload": {
        "post": {
            "tags": [ "Farm Gallery" ],
            "summary": "Endpoint to upload new galleries (multiple images).",
            "description": "Returns json object of uploaded files",
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
                                "images": {
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
    "/farm/gallery/{farm_id}": {
        "get": {
            "tags": [ "Farm Gallery" ],
            "summary": "Endpoint to get farm galleries",
            "description": "Returns json object of gallery files",
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
                "401": {
                    "description": "Unathorized permission denied."
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

