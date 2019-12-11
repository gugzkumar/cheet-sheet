# from __dependencies__ import jwt
import jwt
from __core__.settings import COGNITO_ACCESS_JWK, COGNITO_ID_JWK
from __core__.settings import ADMIN_USER, PUBLIC_SHEETS_FOLDER
from jwt.algorithms import RSAAlgorithm

def apply(event):
    """
    """
    headers = event['headers']
    event['sheets_folder'] = PUBLIC_SHEETS_FOLDER
    if ('Authorization' in headers) and (headers['Authorization']):
        try:
            jwt_token = headers['Authorization'].replace('Bearer ', '')
            public_key = RSAAlgorithm.from_jwk(COGNITO_ACCESS_JWK)
            decoded_token = jwt.decode(jwt_token, public_key, algorithms='RS256', verify=True)
            event['username'] = decoded_token['username']
            if (event['username'] != ADMIN_USER):
                event['sheets_folder'] = event['username']
        except:
            event['username'] = None
    else:
        event['username'] = None
