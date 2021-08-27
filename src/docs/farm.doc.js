export const farmTag = {
    "name": "Farms",
    "description": "API endpoints for farms"
}

export const farmPaths = {
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
    "/farm/edit": {
        "put": {
            "tags": [ "Farms" ],
            "summary": "Endpoint to update farm details",
            "description": "Returns json object of farm data",
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

    }
}

