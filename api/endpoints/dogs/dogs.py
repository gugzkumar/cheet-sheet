import json
import numpy as np


def get(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            'message': 'GET test',
            'event': event
        })
    }

def post(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            'message': 'POST test',
            'event': event
        })
    }

def main(event, context):
    if event["httpMethod"] == "GET":
        return get(event, context)
    elif event["httpMethod"] == "POST":
        return post(event, context)
    elif event["httpMethod"] == "DELETE":
        return delete(event, context)
    elif event["httpMethod"] == "PUT":
        return post(event, context)
    else:
        return {
        "statusCode": 405,
        "body": json.dumps(
            {
                "message": "Method Not Allowed"
            }
        )
    }
