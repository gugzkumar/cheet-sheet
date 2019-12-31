"""
This middleware does one simple thing. It parses the body of the given HTTP request as
a json value so it is easier to process.
"""

import json

def apply(event):
    if ('body' in event) and (event['body']):
        event['body'] = json.loads(event['body'])
