# Gained Learnings
This is a list of things I've learned, primarily about Serverless, that happened while building this App. Originally coming from a container orchestration background, it's interesting to compare the advantages and disadvantages approaches.

https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.py
Doesn't break whole API
Scales without me having to do something
https://github.com/mthenw/awesome-layers


DO NOT TRY REPLICATING SERVICES
- Leverage tools by the cloud provider
- Leverage tools respected
- Good for personal project, or small prototypes

- https://aws.amazon.com/premiumsupport/knowledge-center/decode-verify-cognito-json-token/
- https://github.com/jpadilla/pyjwt/issues/359

## Run Infrastructure Deploy Environment
```
docker-compose -f docker-compose.deploy.infrastructure.yml down -v && docker-compose -f docker-compose.deploy.infrastructure.yml up --build -d
```

## Run Code Deploy Environment
```
docker-compose -f docker-compose.deploy.code.yml down -v && docker-compose -f docker-compose.deploy.code.yml up --build -d
```



# Infrastructure Costs
AWS Certificate Manager - Free
AWS Route 53 - Per Transaction, and Annual fee for Domains
AWS S3 - Per Transaction and Storage
AWS Lambda - Per Transaction
API Gateway - Per Transaction
AWS Cognito - Per User

https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/
https://lucasfsantos.com/posts/deploy-react-angular-cloudfront/
