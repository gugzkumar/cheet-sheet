"""
API methods for /sheet
"""
import boto3, json, datetime, re
from boto3 import client
s3_client = client('s3')
from __core__.settings import AVAILABLE_FILE_TYPES, SHEET_DATA_S3_BUCKET
from __core__.utilities import get_a_blank_new_sheet, get_error_response
from __core__.utilities import authenticated_users_only, get_all_sheets_names_for_a_folder

def get(event, context):
    """
    Get All Sheets
    """
    sheets_folder = event['sheets_folder']
    all_current_sheet_names = get_all_sheets_names_for_a_folder(s3_client, sheets_folder, SHEET_DATA_S3_BUCKET)
    return {
        "statusCode": 200,
        "body": json.dumps({
            'result': {
                'sheetNames': all_current_sheet_names
            }
        })
    }

@authenticated_users_only
def post(event, context):
    """
    Create A New Sheet
    """
    sheets_folder = event['sheets_folder']
    all_current_sheet_names = get_all_sheets_names_for_a_folder(s3_client, sheets_folder, SHEET_DATA_S3_BUCKET)

    if 'sheetName' not in event['body'] or event['body']['sheetName'] is None:
        # Error if no sheet name was provided
        return get_error_response('No name for sheet was provided')

    if event['body']['sheetName'] in all_current_sheet_names:
        # Error if sheet name exists
        return get_error_response(f'Sheet with name {event["body"]["sheetName"]} already exists')

    valid_name_pattern = re.compile("[a-zA-Z0-9!\-_*]+")
    if valid_name_pattern.fullmatch(event['body']['sheetName']) is None:
        # Error if sheet name has invalid characters
        return get_error_response(f'Sheet name must be alphanumeric and may contain the following characters: -, !, _, *')

    if 'defaultFileType' not in event['body'] or event['body']['sheetName'] is None:
        # Error if Default File type was not provided
        return get_error_response('No Default File Type was provided')

    if event['body']['defaultFileType'] not in AVAILABLE_FILE_TYPES:
        # Error if Default File type is not supported
        return get_error_response(f'Default file type {event["body"]["defaultFileType"]} is not supported')

    # Create Empty sheet in S3 bucket
    new_sheet = get_a_blank_new_sheet()
    new_sheet['defaultFileType'] = event['body']['defaultFileType']
    s3_client.put_object(
        ACL='private',
        Body = (bytes(json.dumps(new_sheet).encode('UTF-8'))),
        Bucket = SHEET_DATA_S3_BUCKET,
        Key=f'{sheets_folder}/{event["body"]["sheetName"]}/sheet.json'

    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            'results': {
                'sheetName': event["body"]["sheetName"],
                'sheetData': new_sheet
            }
        })
    }
