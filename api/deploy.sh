set -e

codeStackName="CheetSheetCodeStack-$ENVIRONMENT"
apiSiteName="$SITE_SUB_DOMAIN.api.$SITE_DOMAIN"
apiFunctionName="CheetSheetApiFunction-$ENVIRONMENT"

echo "Packaging $codeStackName via SAM"
sam package --s3-bucket $API_DEPLOYMENT_S3_BUCKET --debug
echo ""
echo "Deploying $codeStackName via SAM"
sam deploy --stack-name $codeStackName \
  --s3-prefix deploy --s3-bucket $API_DEPLOYMENT_S3_BUCKET --debug \
  --region $AWS_DEFAULT_REGION --capabilities CAPABILITY_IAM \
  --parameter-overrides LayerArn=$LAMBDA_LAYER RoleArn=$LAMBDA_IAM_ROLE SheetDataBucket=$SHEET_DATA_S3_BUCKET \
    CognitoClientId=$COGNITO_CLIENT_ID CognitoJWKSBase64=$COGNITO_JWKS_BASE64 \
    ApiResourceName=$apiSiteName ApiFunctionResourceName=$apiFunctionName
