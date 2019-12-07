"""
API methods for /sheet/{sheetName}
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
    Get JSON data of a sheet
    """

    if 'sheetName' not in event['pathParameters'] or event['pathParameters']['sheetName'] is None:
        # Error if no sheet name was provided
        return get_error_response('No sheet name was provided')
    if event["pathParameters"]["sheetName"] not in all_current_sheet_names:
        # Error sheet name does not exist
        return get_error_response(f'No sheet with name {event["pathParameters"]["sheetName"]} exists')

    s3_get_sheet_response = s3_client.get_object(
        Bucket=SHEET_DATA_S3_BUCKET,
        Key=f'{user}/{event["pathParameters"]["sheetName"]}/sheet.json'
    )
    sheet_data = json.loads(s3_get_sheet_response["Body"].read().decode())

    return {
        "statusCode": 200,
        "body": json.dumps({
            'result': {
                'sheetName': event["pathParameters"]["sheetName"],
                'sheetData': sheet_data
            }
        })
    }

def delete(event, context):
    """
    Delete a sheet
    """

    if 'sheetName' not in event['pathParameters'] or event['pathParameters']['sheetName'] is None:
        # Error if no sheet name was provided
        return get_error_response('No name for sheet was provided')
    if event["pathParameters"]["sheetName"] not in all_current_sheet_names:
        # Error sheet name does not exist
        return get_error_response(f'No sheet with name {event["pathParameters"]["sheetName"]} exists')

    # Delete sheet in S3 bucket
    s3_delete_sheet_response = s3_client.delete_object(
        Bucket = SHEET_DATA_S3_BUCKET,
        Key=f'{user}/{event["pathParameters"]["sheetName"]}/sheet.json'
    )

    if s3_delete_sheet_response['ResponseMetadata']['HTTPStatusCode'] not in [200, 204]:
        # Error if sheet was not properly deleted
        return get_error_response(f'Sheet {event["pathParameters"]["sheetName"]} failed to be deleted')

    return {
        "statusCode": 200,
        "body": json.dumps({
        })
    }

def put(event, context):
    """
    Update an existing sheet
    """
    print(type(event['body']))
    if 'sheetName' not in event['pathParameters'] or event['pathParameters']['sheetName'] is None:
        # Error if no sheet name was provided
        return get_error_response('No name for sheet was provided')
    if event["pathParameters"]["sheetName"] not in all_current_sheet_names:
        # Error sheet name does not exist
        return get_error_response(f'No sheet with name {event["pathParameters"]["sheetName"]} exists')
    if 'sheetData' not in event['body'] or event['body']['sheetData'] is None:
        # Error if no sheet data was provided
        return get_error_response('No sheet data was provided')

    new_sheet_data = event['body']['sheetData']

    if new_sheet_data['defaultFileType'] not in AVAILABLE_FILE_TYPES:
        # Error if Default File type is not supported
        return get_error_response(
            f'Default file type {event["body"]["sheetData"]["defaultFileType"]} is not supported'
        )
    if set(['defaultFileType', 'leftIndexCards', 'rightIndexCards']) != set(new_sheet_data.keys()):
        # Error if SheetData has unexpected keys
        return get_error_response(
            f'Sheet data not formatted properly'
        )

    # Get current data for sheet
    s3_get_sheet_response = s3_client.get_object(
        Bucket=SHEET_DATA_S3_BUCKET,
        Key=f'{user}/{event["pathParameters"]["sheetName"]}/sheet.json'
    )
    sheet_data = json.loads(s3_get_sheet_response["Body"].read().decode())
    new_sheet_data["dateCreated"] = sheet_data["dateCreated"]
    new_sheet_data["dateUpdated"] = datetime.datetime.now().timestamp()
    s3_client.put_object(
        ACL='private',
        Body = (bytes(json.dumps(new_sheet_data).encode('UTF-8'))),
        Bucket = SHEET_DATA_S3_BUCKET,
        Key=f'{user}/{event["pathParameters"]["sheetName"]}/sheet.json'
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            'result': {
                'sheetName': event["pathParameters"]["sheetName"],
                'sheetData': new_sheet_data
            }
        })
    }
