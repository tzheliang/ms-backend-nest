FROM postgres:latest
WORKDIR /app

# Copy the seed file to the entrypoint directory
COPY ./seed.sql /docker-entrypoint-initdb.d/
