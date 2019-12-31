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

def get_all_sheets_names_for_a_folder(s3_client, sheets_folder, SHEET_DATA_S3_BUCKET):
    s3_get_sheet_names_response = s3_client.list_objects(
        Bucket = SHEET_DATA_S3_BUCKET,
        Prefix = f'{sheets_folder}/',
        Delimiter = '/'
    )
    if ('CommonPrefixes' in s3_get_sheet_names_response):
        return [obj['Prefix'][(len(sheets_folder)+1):-1] for obj in s3_get_sheet_names_response['CommonPrefixes']]
    else:
        return []

def encode_json_to_base64(json_obj):
    return base64.b64encode(json.dumps(json_obj).encode('ascii'))

def decode_base64_to_json(encoded_bytes):
    return json.loads(base64.b64decode(encoded_bytes).decode('ascii'))


def authenticated_users_only(func):
    def function_wrapper(event, context):
        if (event['username'] is None):
            return get_error_response(message='Invalid Authentication', statusCode=401)
        else:
            return func(event, context)
    return function_wrapper
