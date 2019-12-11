# Starts the API with SAM LOCAL
# sam build --use-container
# sam local start-api --host 0.0.0.0 -p 3000 -v $SAM_LOCAL_ABSOLUTE_PATH
# pip install -r ./requirements.txt -t src/__dependencies__
sam local start-api --skip-pull-image --host 0.0.0.0 -p 3000 -v $SAM_LOCAL_ABSOLUTE_PATH \
    --parameter-overrides LayerArn=$LAMBDA_LAYER
