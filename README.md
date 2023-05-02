# Air Quality Index

This repository integrates with [IQAir](https://www.iqair.com/) to read the air quality index of any area using a GPS coordinate as well as specifically providing a continuous sampling of the air quality in Paris and saving that information into a database.

The repository is using the following main technologies / packages / Tools: 
- Nodejs
- Nestjs
- Typescript
- MySQL
- TypeORM
- Jest
- Supertest

## Prerequisites

Before installation and running the app, you need to follow the next points to install or configure some prerequisites first.

### 1. [IQAir](https://www.iqair.com/) Account and API Key

First, you will need to get an API Key from [IQAir](https://www.iqair.com/).

1. Go to https://www.iqair.com/dashboard/api and create a new account
2. Click on "New Key" button
3. Save the **API Key** somewhere safe as it will be needed for the next steps.

### 2. Database

The project is using MySQL database, so you need to make sure you installed the database engine on your machine.

1. Go to https://dev.mysql.com/downloads/mysql/ and download the community edition.
2. Install the package and make sure you save the root user/pass as it will be needed for later step.
3. [OPTIONAL] you can install [MySQL Workbench](https://www.mysql.com/products/workbench/) if you want to use a GUI for your database engine.
4. Create a database (ex: `air_quality_db`) or any name and keep it along with the root username and password for the next step.

### 3. `.env` File

All of the secrets or configurations needed by the application to function properly, are saved in a `.env` file under the project root directory (after you clone the repo).

This is a `.env` file sample:

```
# App Params

PORT = 4000
ENV = DEV

#IQAir

IQAIR_API_KEY=<ADD_YOUR_API_KEY_FROM_STEP_1>

# Database

DB_HOST=localhost
DB_PORT=3306
DB_USER=<ADD_YOUR_ROOT_USER_FROM_STEP_2>
DB_PASS=<ADD_YOUR_ROOT_PASSWORD_FROM_STEP_2>
DB_NAME=<ADD_YOUR_DB_NAME_FROM_STEP_2>

```

Save this file under the project root.

### 4. Install `node v18.x`

The project is using node v18.x

1. Go to https://nodejs.org/en
2. Install node v18.x

### 5. Install `yarn`

The project is using `yarn` instead of `npm`.

1. Open your terminal
2. Install `yarn` by running the following command:

    ```
    $ npm install -g yarn
    ```

### 6. [OPTIONAL] Install `Nestjs`

The project is based on Nestjs framework. So, it is optional to install Nestjs globally if you want to use its CLI ...etc.

1. Go to https://docs.nestjs.com/first-steps
2. Follow the article to install it locally
## Installation

Now you are ready to install the project dependencies.

1. Clone the repository locally.
2. Run the following command while you are under the project root:

    ```bash
    $ yarn
    ```

## Running the app

Once dependencies installation is done, you are ready to run the app. Use the following commands:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

In order to run unit tests / integration (e2e) tests / test coverage you can use the following commands:

```bash
# unit tests
$ yarn test

# integration (e2e) tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Support

The project is based on Nest. Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
