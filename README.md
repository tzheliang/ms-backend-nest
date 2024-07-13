# NestJS backend test

Repository for the code solution to NestJS backend test.

## Features

- Get product information by providing a product code and location.
- Create a new product information by providing a product code and location.
- Replace a product information by providing the product code, price and location.
- Delete a product information by providing the product code.
- (Testing Only) Get token for member role.
- (Testing Only) Get token for admin role.

## Assumptions made

1. Product code is assumed to be unique, to ensure only the specific record is updated when updated via the `PUT` endpoint.
2. To comply with the requirement of using a single `PRODUCT` table, the table will be designed by denormalizing the product code, location and price columns.
3. All API endpoints that requires authentication will be authenticated with a JWT.
4. JWT will be provided using 2 custom endpoints, namely `/token/admin` and `/token/member`. These endpoints will not be secured for testing purposes.
5. PostgreSQL docker container will be used for the purpose of demonstrating the features/functionalities of the API.
6. Response serialization decorators to be included in the `*.entity.ts` files, rather than a separate `*.dto.ts` file.

## Steps taken for setup

1. Installed Node.JS (v18 current version)
2. Installed the NestJS cli on local machine
3. Initialized a new NestJS app using `nest new ms-backend-nest`
4. Pulled the latest docker image using `docker pull postgres`
5. Started the postgres docker container using `docker run -d --name DEV_POSTGRES -p 5432:5432 -e POSTGRES_PASSWORD=lLfeWOUNasTLRC -e POSTGRES_USER=api_user -e POSTGRES_DB=MOTOR_INSURANCE_WEBSITE postgres`.
6. Install dependencies for integrating with Postgres using TypeORM. `npm install --save @nestjs/typeorm typeorm pg`
7. Install dependencies for input validation using decorators. `npm install --save class-validator class-transformer`
8. Install dependencies for JWT. `npm install --save @nestjs/jwt`
