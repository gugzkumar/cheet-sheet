import json
import datetime

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
