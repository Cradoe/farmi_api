exports.farmerTag = {
    "name": "Farmers",
    "description": "API endpoints for farmers"
}

exports.farmerPaths = {
    "/farmer/farms": {
        "get": {
            "tags": [ "Farmers" ],
            "summary": "List all farms for a particular farmer.",
            "description": "Returns array of farms",
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

