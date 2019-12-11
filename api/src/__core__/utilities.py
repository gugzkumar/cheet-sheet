import json, base64, datetime

def get_a_blank_new_sheet():
    return {
        "defaultFileType": None,
        "dateCreated": datetime.datetime.now().timestamp(),
        "dateUpdated": datetime.datetime.now().timestamp(),
        "leftIndexCards": [
        ],
        "rightIndexCards": [
        ]
    }

def get_error_response(message, statusCode=400):
    return {
        'statusCode': statusCode,
        'body': json.dumps({
            'message': message
        }),
        'headers': {'Access-Control-Allow-Origin': "*"}
    }

def encode_json_to_base64(json_obj):
    return base64.b64encode(json.dumps(json_obj).encode('ascii'))

def decode_base64_to_json(encoded_bytes):
    return base64.b64decode(encoded_bytes)


def authenticated_users_only(func):
    def function_wrapper(event, context):
        if (event['username'] is None):
            return get_error_response(message='Invalid Authentication', statusCode=401)
        else:
            return func(event, context)
    return function_wrapper
