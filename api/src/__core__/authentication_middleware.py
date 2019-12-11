# from __dependencies__ import jwt
import jwt
from __core__.settings import COGNITO_CLIENT_SECRET, COGNITO_CLIENT_ID, COGNITO_ACCESS_JWK, COGNITO_ID_JWK
from jwt.algorithms import RSAAlgorithm

def apply(event):
    """
    """
    headers = event['headers']
    if ('Authorization' in headers) and (headers['Authorization']):
        try:
            jwt_token = headers['Authorization'].replace('Bearer ', '')
            public_key = RSAAlgorithm.from_jwk(COGNITO_ACCESS_JWK)
            decoded_token = jwt.decode(jwt_token, public_key, algorithms='RS256', verify=True)
            event['username'] = decoded_token['username']
        except():
            event['username'] = None
    else:
        event['username'] = None
