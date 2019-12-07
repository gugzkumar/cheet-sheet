import json

def apply(event):
    if ('body' in event) and (event['body']):
        event['body'] = json.loads(event['body'])
