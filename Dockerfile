FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
RUN python3 manage.py makemigrations octotramp
RUN python3 manage.py migrate
EXPOSE 8000/tcp
CMD python3 manage.py runserver 0.0.0.0:8000