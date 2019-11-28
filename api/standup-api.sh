# Starts the API with SAM LOCAL
sam local start-api --skip-pull-image --host 0.0.0.0 -p 3000 -v $SAM_LOCAL_ABSOLUTE_PATH
