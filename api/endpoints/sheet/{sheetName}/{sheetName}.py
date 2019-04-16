import boto3
import json
import datetime
from boto3 import client
s3_client = client('s3')

available_file_types = [
    'abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'asciidoc', 'asl',
    'assembly_x86', 'autohotkey', 'batchfile', 'bro', 'c9search', 'c_cpp', 'cirru', 'clojure', 'cobol',
    'coffee', 'coldfusion', 'csharp', 'csound_document', 'csound_orchestra', 'csound_score', 'csp', 'css',
    'curly', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact', 'eiffel', 'ejs',
    'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsharp', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore',
    'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell',
    'haskell_cabal', 'haxe', 'hjson', 'html', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java',
    'javascript', 'json', 'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid',
    'lisp', 'livescript', 'logiql', 'logtalk', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown',
    'mask', 'matlab', 'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nix', 'nsis', 'objectivec', 'ocaml',
    'pascal', 'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell',
    'praat', 'prolog', 'properties', 'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift',
    'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala', 'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty',
    'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver', 'stylus', 'svg', 'swift', 'tcl',
    'terraform', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'vala', 'vbscript',
    'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml'
]

user='default'
cheetsheet_bucket_name='scratch-cheetsheet-storage'

s3_get_sheet_names_response = s3_client.list_objects(
    Bucket = cheetsheet_bucket_name,
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
        return get_error_response(f'Sheet name {event["pathParameters"]["sheetName"]} does not exist')

    s3_get_sheet_response = s3_client.get_object(
        Bucket=cheetsheet_bucket_name,
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
        return get_error_response('No sheet name was provided')
    if event["pathParameters"]["sheetName"] not in all_current_sheet_names:
        # Error sheet name does not exist
        return get_error_response(f'Sheet name {event["pathParameters"]["sheetName"]} does not exist')

    # Delete sheet in S3 bucket
    s3_delete_sheet_response = s3_client.delete_object(
        Bucket = cheetsheet_bucket_name,
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

def main(event, context):
    if event["httpMethod"] == "GET":
        return get(event, context)
    elif event["httpMethod"] == "PUT":
        return put(event, context)
    elif event["httpMethod"] == "DELETE":
        return delete(event, context)
    else:
        return {
            "statusCode": 405,
            "body": json.dumps({
                "message": "Method Not Allowed"
            })
        }

# Helper Methods
def get_error_response(message, statusCode=400):
    return {
        'statusCode': statusCode,
        'body': json.dumps({
            'message': message
        })
    }
