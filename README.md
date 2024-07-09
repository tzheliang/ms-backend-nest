# NestJS backend test

Repository for the code solution to NestJS backend test.



## Features
- Get product information by providing a product code and location code.
- Create a new product information by providing a product code and location code.
- Replace a product information by providing the product code, price and location code.
- Delete a product information by providing the product code.
- (Specific for testing) Get token for member role.
- (Specific for testing) Get token for admin role.

## Assumptions made
1. A simple auto-incremeting id will be used as the `PRIMARY KEY` in the database.
2. To comply with the requirement of using a single `PRODUCT` table, the table will be designed by denormalizing the product code and product description.
3. All API endpoints that requires authentication will be authenticated with a JWT, which will be provided using 2 custom endpoints on this API, namely `/token/admin` and `/token/member`. These endpoints shall return a JWT with the user role encoded in it for admin authorization.
4. Basic data uniqueness validation will be performed, using all the columns as a unique index.

## Steps taken for setup
1. Installed Node.JS (v18 current version)
2. Installed the NestJS cli on local machine
3. Initialized a new NestJS app using `nest new ms-backend-nest`
