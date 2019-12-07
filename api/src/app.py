import json
import importlib
import sys
from __core__ import authentication_middleware, json_parsing_middleware
# sys.path.append("./__dependencies__")


def main(event, context):
    # Extract htttp information from the endpoint
    api_resource_path = event["resource"]
    api_http_method = event["httpMethod"].lower()

    # Apply middleware
    authentication_middleware.apply(event)
    json_parsing_middleware.apply(event)

    # Load the correct python module for the api endpoint
    api_resource_path = event["resource"]
    spec = importlib.util.spec_from_file_location("module.name", f'./{api_resource_path}/__init__.py')
    endpoint_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(endpoint_module)

    # Check if the method belongs to the module
    if api_http_method not in dir(endpoint_module):
        return {
            "statusCode": 405,
            "body": json.dumps({
                "message": "Method Not Allowed"
            })
        }

    # Return desired result of api endpoint
    response = getattr(endpoint_module, api_http_method)(event, context)
    response["headers"] = {'Access-Control-Allow-Origin': "*"}
    return response
