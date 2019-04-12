# Add /cached-dependencies/ to importable path
import sys
import os
import importlib
import json

sys.path.append('./cached-dependencies')

from flask import Flask, request
from flask_restful import Api, Resource, reqparse
class Test(Resource):
    def get(self):
        print(self)
        return 'SS', 200
app = Flask(__name__)
api = Api(app)


# Template JSON/Dicts that represent a AWS lambda events for every HTTP method
get_lambda_event_template = {
    'httpMethod': 'GET',
    'queryStringParameters': {},
    'pathParameters': None,
    'requestContext': {
           'identity': {
                'accessKey': None,
                'accountId': None,
                'caller': None,
                'cognitoAuthenticationProvider': None,
                'cognitoAuthenticationType': None,
                'cognitoIdentityId': None,
                'cognitoIdentityPoolId': None
           }
    }
}
post_lambda_event_template = {
    'httpMethod': 'POST',
    'body': {},
    'queryStringParameters': {},
    'pathParameters': None,
    'requestContext': {
       'identity': {
            'accessKey': None,
            'accountId': None,
            'caller': None,
            'cognitoAuthenticationProvider': None,
            'cognitoAuthenticationType': None,
            'cognitoIdentityId': None,
            'cognitoIdentityPoolId': None
       }
    }
}
put_lambda_event_template = {
    'httpMethod': 'POST',
    'body': {},
    'queryStringParameters': {},
    'requestContext': {
       'identity': {
            'accessKey': None,
            'accountId': None,
            'caller': None,
            'cognitoAuthenticationProvider': None,
            'cognitoAuthenticationType': None,
            'cognitoIdentityId': None,
            'cognitoIdentityPoolId': None
        }
    }
}
delete_lambda_event_template = {
    'httpMethod': 'POST',
    'body': {},
    'queryStringParameters': {},
    'requestContext': {
        'identity': {
            'accessKey': None,
            'accountId': None,
            'caller': None,
            'cognitoAuthenticationProvider': None,
            'cognitoAuthenticationType': None,
            'cognitoIdentityId': None,
            'cognitoIdentityPoolId': None
        }
    }
}

endpoint_dir = './endpoints'


# Construct Flask API endpoints based on folder structure of endpoint folder
i=0
for path, dirs, files in os.walk(endpoint_dir):
    i+=1
    full_path = os.path.abspath(path)
    current_folder_name = full_path.split(os.sep)[-1]
    # If a python file for lambda function exists for the resource do the following:
    if f'{current_folder_name}.py' in files:
        api_resource_path = path.replace(endpoint_dir, '').replace('{', '<').replace('}', '>')
        full_path_of_py_file = os.path.abspath(path) + f'/{current_folder_name}.py'
        
        spec = importlib.util.spec_from_file_location("module.name", full_path_of_py_file)
        current_lambda_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(current_lambda_module)


        # Creating an Anonomys Class
        class LambdaApiResource(Resource):
            resource = api_resource_path
            lambda_module = current_lambda_module
            get_lambda_event = get_lambda_event_template.copy()
            post_lambda_event = post_lambda_event_template.copy()
            put_lambda_event = put_lambda_event_template.copy()
            delete_lambda_event = delete_lambda_event_template.copy()
            
            def get(self, **kwargs):
                print(request.args)
                get_lambda_event = self.get_lambda_event.copy()
                get_lambda_event['pathParameters'] = kwargs
                get_lambda_event['queryStringParameters'] = {key:val for key, val in request.args.items()}
                lambda_result = self.lambda_module.main(
                    get_lambda_event,
                    None
                )
                return json.loads(lambda_result['body']), lambda_result['statusCode']
            def post(self, **kwargs):
                post_lambda_event = self.post_lambda_event.copy()
                post_lambda_event['pathParameters'] = kwargs
                post_lambda_event['queryStringParameters'] = {key:val for key, val in request.args.items()}
                lambda_result = self.lambda_module.main(
                    post_lambda_event,
                    None
                )
                return json.loads(lambda_result['body']), lambda_result['statusCode']
            def put(self, **kwargs):
                put_lambda_event = self.put_lambda_event.copy()
                put_lambda_event['pathParameters'] = kwargs
                put_lambda_event['queryStringParameters'] = {key:val for key, val in request.args.items()}
                lambda_result = self.lambda_module.main(
                    put_lambda_event,
                    None
                )
                return json.loads(lambda_result['body']), lambda_result['statusCode']
            def delete(self, **kwargs):
                delete_lambda_event = self.delete_lambda_event.copy()
                delete_lambda_event['pathParameters'] = kwargs
                delete_lambda_event['queryStringParameters'] = {key:val for key, val in request.args.items()}
                lambda_result = self.lambda_module.main(
                    post_lambda_event,
                    None
                )
                return json.loads(lambda_result['body']), lambda_result['statusCode']

        LambdaApiResource.__name__ = f'Lambda{i}'
        api.add_resource(LambdaApiResource, api_resource_path)

app.run(host='0.0.0.0', port=10000, debug=True)