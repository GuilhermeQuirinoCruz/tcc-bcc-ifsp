FROM postgres:latest
WORKDIR /db
ENV POSTGRES_USER=root
ENV POSTGRES_PASSWORD=senha
COPY ./db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432