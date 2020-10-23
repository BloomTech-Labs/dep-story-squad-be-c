# Story Squad API


Welcome to your `Basic Node API Repository`. Use this to start your own Greenfield Project using nodejs, express and common industry standards.


This repository assumes a handful of industry practices and standards. We strive to keep you on the bleeding edge of the industry and as a result, we have made some opinions for you so that you don't have to; you're welcome.

Read more at <https://docs.labs.lambdaschool.com/labs-api-strarter/>

## Quick Guide Video:

https://drive.google.com/file/d/1g6YoAzRyRmPL2EdwqNuUfp_BlxlPC7jS/view?usp=sharing

## API Here:

https://story-squad-c-api.herokuapp.com/

## Contributors

|                                                      Michael Barnes                                                       |                                                              John Daly                                                              |                                                           Scott Fuston                                                            |                                                            Dawson Hamm                                                             |                                                            Jesse Marek                                                             |                                                           Johan Mazorra                                                            |                                                             Jack Ross                                                              |                                                            Jacob Tharp                                                             |
| :-----------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------: |
|                  <img src="https://avatars3.githubusercontent.com/u/49892996?s=460&v=4" width = "200" />                  |                       <img src="https://avatars1.githubusercontent.com/u/60858846?s=460&v=4" width = "200" />                       | <img src="https://avatars0.githubusercontent.com/u/8632549?s=460&u=fd1f74b5199d6a3fcf00167950845db186cb2da4&v=4" width = "200" /> | <img src="https://avatars3.githubusercontent.com/u/60896383?s=460&u=4687cc4d317e168391f59c13c8bbaf0a2ae8e0a1&v=4" width = "200" /> | <img src="https://avatars1.githubusercontent.com/u/61661005?s=460&u=31a2cd7a4b7b5d0d39190ae1091e62e98e0c50d7&v=4" width = "200" /> | <img src="https://avatars3.githubusercontent.com/u/60892622?s=460&u=3e09487cd4d9845a697693a90a59c6637e0d6bc3&v=4" width = "200" /> | <img src="https://avatars3.githubusercontent.com/u/43938405?s=460&u=594d25571eeb134a7bba80b5c3a5f0494e754d1e&v=4" width = "200" /> | <img src="https://avatars1.githubusercontent.com/u/18707646?s=460&u=e66878ccb3f1c48597d711fce5e8d29444de0f7e&v=4" width = "200" /> |
|                                                            Web                                                            |                                                                 Web                                                                 |                                                                Web                                                                |                                                                Web                                                                 |                                                                Web                                                                 |                                                                 DS                                                                 |                                                                 DS                                                                 |                                                                TPL                                                                 |
|              [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/michaelbarnes7282)               |                        [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/jcdaly97)                        |                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/fuston05)                       |                     [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/dawsonhammdev)                     |                      [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/jessemarek)                       |                       [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/jsmazorra)                       |                   [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/JackRossProjects)                    |                     [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/jengopockets)                      |
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/mbarnes01) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jack-daly-a2a3031b6) |   [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/scott-fuston)    |    [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/dawson-hamm)     |   [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jesse-a-marek)    |      [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jmazorra)      |    [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/jackcalvinross)     |    [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/jacob-tharp)     |

## Requirements

Labs teams must follow all [Labs Engineering Standards](https://labs.lambdaschool.com/topics/node-js/).

## API documentation

All routes can be viewed in the [/api/README.md](./api/README.md) file

## Getting Started

### Enviornment Variables

- `PORT` - API port (optional, but helpful with FE running as well)
  - The following ports are whitelisted for use with okta
    - 3000
    - 8000
    - 8080
- `DS_API_URL` - URL to a data science api. (eg. <https://ds-bw-test.herokuapp.com/>)
- `DATABASE_URL` - connection string for postgres database
- `TEST_DATABASE_URL` - the URL of the postgres database to run tests on
- `OKTA_URL_ISSUER` - The complete issuer URL for verifying okta access tokens. `https://example.okta.com/oauth2/default`
- `OKTA_CLIENT_ID` - the okta client ID.
- `CC_TEST_REPORTER_ID` - id for code climate testing
- `JWTSECRET` - secret for jwt
- `ACCESSKEY` - access key for AWS S3 bucket
- `SECRETKEY` - secret Key for AWS s3 bucket

See .env.sample for example values

### Setup postgres

There are 3 options to get postgresql installed locally [Choose one]:

1. Use docker. [Install](https://docs.docker.com/get-docker/) for your platform
    - run: `docker-compose up -d` to start up the postgresql database and pgadmin.
    - Open a browser to [pgadmin](http://localhost:5050/) and you should see the Dev server already defined.
    - If you need to start over you will need to delete the folder `$ rm -rf ./data/pg` as this is where all of the server data is stored.
      - if the database `api-dev` was not created then start over.
    > When using Docker, you will need to manually create your test database, called `api-test`
2. Download and install postgresql directly from the [main site](https://www.postgresql.org/download/)
    - make note of the port, username and password you use to setup the database.
    - Connect your client to the server manually using the values previously mentioned
    - You will need to create a database manually using a client.
    - Make sure to update the DATABASE_URL connection string with the values for username/password, databasename and server port (if not 5432).
    > Make sure you create `api-dev` to run any queries in Postman or through the swagger documentation, as well as a database called `api-test` to run the Jest tests
3. Setup a free account at [ElephantSQL](https://www.elephantsql.com/plans.html)
    - Sign up for a free `Tiney Turtle` plan
    - copy the URL to the DATABASE_URL .env variable
    - make sure to add `?ssl=true` to the end of this url
    > you'll need separate databases for Jest testing (`api-test`) and Postman/Swagger endpoint testing (`api-dev`)

### Setup the application

- create your project repo by forking or using this as a template.
- run: `npm install` to download all dependencies.
- run: `cp .env.sample .env` and update the enviornment variables to match your local setup.
- run: `npm run knex migrate:latest` to create the starting schema.
- run: `npm run knex seed:run` to populate your db with some data.
- run: `npm run tests` to confirm all is setup and tests pass.
- run: `npm run watch:dev` to start nodemon in local dev enviornment.

> Make sure to update the details of the app name, description and version in
> the `package.json` and `config/jsdoc.js` files.

## Contributing

See the [contributing doc](https://github.com/Lambda-School-Labs/labs-api-starter/blob/main/CONTRIBUTING.md)
for more info.
