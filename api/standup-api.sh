# Starts the API with SAM LOCAL
sam local start-api --skip-pull-image --host 0.0.0.0 -p 3000 -v $SAM_LOCAL_ABSOLUTE_PATH \
    --parameter-overrides LayerArn=$LAMBDA_LAYER RoleArn=$LAMBDA_IAM_ROLE SheetDataBucket=$SHEET_DATA_S3_BUCKET \
    CognitoClientId=$COGNITO_CLIENT_ID CognitoJWKSBase64=$COGNITO_JWKS_BASE64
