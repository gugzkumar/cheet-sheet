import json

def get(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            'message': 'GET language',
            'event': event
        })
    }

def post(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            'message': 'POST language',
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
