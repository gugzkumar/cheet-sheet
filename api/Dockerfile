FROM python:3.7-alpine
RUN apk update && \
    apk upgrade && \
    apk add bash && \
    apk add --no-cache --virtual build-deps build-base gcc && \
    pip install aws-sam-cli==0.34.0 && \
    apk del build-deps
RUN mkdir /app
WORKDIR /app
CMD ["tail", "-f", "/dev/null"]
