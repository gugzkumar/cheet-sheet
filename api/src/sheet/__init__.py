"""
API methods for /sheet
"""
import boto3
import json
import datetime
from boto3 import client
s3_client = client('s3')
from __core__.settings import AVAILABLE_FILE_TYPES, SHEET_DATA_S3_BUCKET, ADMIN_USER
from __core__.utilities import get_a_blank_new_sheet, get_error_response

user = ADMIN_USER
s3_get_sheet_names_response = s3_client.list_objects(
    Bucket = SHEET_DATA_S3_BUCKET,
    Prefix = f'{user}/',
    Delimiter = '/'
)['CommonPrefixes']
all_current_sheet_names = [obj['Prefix'][(len(user)+1):-1] for obj in s3_get_sheet_names_response]

def get(event, context):
    """
    Get All Sheets
    """
    return {
        "statusCode": 200,
        "body": json.dumps({
            'result': {
                'sheetNames': all_current_sheet_names
            }
        })
    }

def post(event, context):
    """
    Create A New Sheet
    """

    if 'sheetName' not in event['body'] or event['body']['sheetName'] is None:
        # Error if no sheet name was provided
        return get_error_response('No name for sheet was provided')

    if event['body']['sheetName'] in all_current_sheet_names:
        # Error if sheet name exists
        return get_error_response(f'Sheet with name {event["body"]["sheetName"]} already exists')

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
        Bucket = cheetsheet_bucket_name,
        Key=f'{user}/{event["body"]["sheetName"]}/sheet.json'

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
