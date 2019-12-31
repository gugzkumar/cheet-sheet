"""
This middleware does three things:
1) If the user provides no Authentication headers simply set their workspace to the public sheets folder
2) If the user provides valid Authentication for a specified workspace, set their workspace to the selected one
3) If the user provides invalid Authentication for a specified workspace, return an error
"""

import jwt, json
from __core__.settings import COGNITO_JWKS_BASE64, COGNITO_CLIENT_ID
from __core__.settings import ADMIN_USER_GROUP, PUBLIC_SHEETS_FOLDER
from __core__.utilities import decode_base64_to_json, get_error_response
from jwt.algorithms import RSAAlgorithm

def apply(event):
    """
    """
    headers = event['headers']

    if ('Authorization' in headers) and (headers['Authorization']):
        try:
            # Parse Web Keys and Headers of Access and Id JWT tokens
            web_keys = { token['kid']: token for token in decode_base64_to_json(COGNITO_JWKS_BASE64)['keys'] }
            access_token = headers['Authorization'].replace('Bearer ', '')
            access_token_header = jwt.get_unverified_header(access_token)

            # Verify Access and Id Token
            public_access_key = RSAAlgorithm.from_jwk(json.dumps(web_keys[access_token_header['kid']]))
            decoded_access_token = jwt.decode(access_token, public_access_key, algorithms='RS256', verify=True)

            # Set the Username and Sheets Folder that the user requested
            event['username'] = decoded_access_token['username']
            workspace = event['queryStringParameters']['workspace']

            if workspace == 'Personal':
                event['sheets_folder'] = 'personal_' + event['username']
            elif workspace == 'Public':
                if (('cognito:groups' in decoded_access_token) and (ADMIN_USER_GROUP in decoded_access_token['cognito:groups'])):
                    event['sheets_folder'] = PUBLIC_SHEETS_FOLDER
                else:
                    raise Exception('User not Authenticated for Public Sheets Folder')
            else:
                if (('cognito:groups' in decoded_access_token) and (workspace in decoded_access_token['cognito:groups'])):
                    event['sheets_folder'] = 'team_' + workspace
                else:
                    raise Exception(f'User not Authenticated for Team {workspace} Sheets Folder')

        except:
            event['username'] = None
            return get_error_response('Authentication Failed', statusCode=401)
    else:
        event['username'] = None
        event['sheets_folder'] = PUBLIC_SHEETS_FOLDER
