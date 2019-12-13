sam package --s3-bucket scratch-cheetsheet-deployment --debug
sam deploy --stack-name sam-app \
  --parameter-overrides LayerArn=$LAMBDA_LAYER \
  --s3-prefix deploy --s3-bucket scratch-cheetsheet-deployment --debug \
  --region $AWS_DEFAULT_REGION --capabilities CAPABILITY_IAM
