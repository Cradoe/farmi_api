exports.farmTag = {
    "name": "Farms",
    "description": "API endpoints for farms"
}

exports.farmPaths = {
    "/farm/create": {
        "post": {
            "tags": [ "Farms" ],
            "summary": "Endpoint to register new farm.",
            "description": "Returns json object of farm data",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "farm_category_id": {
                                    "type": "string"
                                },
                                "farm_name": {
                                    "type": "string"
                                },
                                "latitude": {
                                    "type": "string"
                                },
                                "longitude": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "date_founded": {
                                    "type": "string"
                                },
                                "land_size": {
                                    "type": "string"
                                },
                                "logo": {
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
    "/farm/details/{id}": {
        "get": {
            "tags": [ "Farms" ],
            "summary": "Single farm details",
            "description": "Returns data object of farm",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID of farm to view",
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
    "/farm/edit/{id}": {
        "patch": {
            "tags": [ "Farms" ],
            "summary": "Endpoint to update farm details",
            "description": "Returns json object of farm data",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID of farm to edit",
                    "required": true
                }
            ],
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "farm_name": {
                                    "type": "string"
                                },
                                "latitude": {
                                    "type": "string"
                                },
                                "longitude": {
                                    "type": "string"
                                },
                                "description": {
                                    "type": "string"
                                },
                                "land_size": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            },
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

    },
    "/farm/delete/{id}": {
        "delete": {
            "tags": [ "Farms" ],
            "summary": "Endpoint to delete farm record",
            "description": "Returns message",
            "parameters": [
                {
                    "name": "id",
                    "in": "path",
                    "description": "ID of farm to delete",
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

    },
    "/farm/{farm_id}/moderator/delete/{user_id}": {
        "delete": {
            "tags": [ "Farms" ],
            "summary": "Endpoint to delete farm moderator",
            "description": "Returns message",
            "parameters": [
                {
                    "name": "farm_id",
                    "in": "path",
                    "description": "ID of farm",
                    "required": true
                }, {
                    "name": "user_id",
                    "in": "path",
                    "description": "The user ID",
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

