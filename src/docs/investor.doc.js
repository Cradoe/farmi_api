exports.investorTag = {
    "name": "Investors",
    "description": "API endpoints for investors"
}

exports.investorPaths = {
    "/investor/investments": {
        "get": {
            "tags": [ "Investors" ],
            "summary": "List all investments",
            "description": "Returns array of data",
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

