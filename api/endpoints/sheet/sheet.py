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

new_sheet = {
    "defaultFileType": None,
    "dateCreated": datetime.datetime.now().timestamp(),
    "dateUpdated": datetime.datetime.now().timestamp(),
    "leftIndexCards": [
    ],
    "rightIndexCards": [
    ]
}

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

    if event['body']['defaultFileType'] not in available_file_types:
        # Error if Default File type is not supported
        return get_error_response(f'Default file type {event["body"]["defaultFileType"]} is not supported')

    # Create Empty sheet in S3 bucket
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

def main(event, context):
    if event["httpMethod"] == "GET":
        return get(event, context)
    elif event["httpMethod"] == "POST":
        return post(event, context)
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
