FROM jupyter/minimal-notebook:65761486d5d3

USER root
WORKDIR /app
RUN chown jovyan /app
RUN apt update
RUN apt install nodejs npm -y
RUN npm install -g nodemon@1.18.10

# Install dependencies
USER jovyan
RUN mkdir cached-dependencies
RUN pip install boto3 --user
RUN pip install flask-restful==0.3.7 --user
RUN pip install flask-cors==3.0.7
COPY ./requirements.txt /app/
RUN pip install -r requirements.txt --target=./cached-dependencies

# Copy api files from directory
COPY ./ /app

CMD ["start.sh", "jupyter", "notebook", "--NotebookApp.token=''"]
