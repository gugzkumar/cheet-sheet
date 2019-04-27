FROM docker:dind
RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base \
  && pip install virtualenv \
  && rm -rf /var/cache/apk/*
RUN pip install --user aws-sam-cli
ENV PATH=$PATH:/root/.local/bin
RUN mkdir /app
WORKDIR /app
