// Import node_modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// import local files
const validate = require('./utils/validators');
const { signInUser, registerUser } = require('./database/queries');
const SQLite = require('./database/sqlite/setup');
const Logger = require('./utils/logger');
const { handleError, UnprocessableError } = require('./utils/errors');
const { setServerSideCookie } = require('./utils/cookies');

const app = express();

async function init() {
  // connect to database and setup database tables
  await SQLite.connect();
  await SQLite.setup();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .disable('x-powered-by')
    .set('trust proxy', 1)
    .use(
      cors({
        origin: [process.env.APP_URL],
        credentials: true,
      })
    );

  app.post('/login', async (request, response) => {
    try {
      const { username, password } = request.body;

      const isInvalidEmail = validate.email(username);

      const userToken = await signInUser(username, password, isInvalidEmail);

      setServerSideCookie(response, 'userToken', userToken);

      return response.sendStatus(200);
    } catch (error) {
      return handleError(error, response);
    }
  });

  app.post('/register', async (request, response) => {
    try {
      const { email, username, password } = request.body;

      const isInvalidEmail = validate.email(email);
      const isInvalidUsername = validate.username(username);
      const isInvalidPassword = validate.password(password);

      if (isInvalidEmail || isInvalidUsername || isInvalidPassword) {
        throw new UnprocessableError(
          isInvalidEmail || isInvalidUsername || isInvalidPassword
        );
      }

      const userToken = await registerUser(email, username, password);

      setServerSideCookie(response, 'userToken', userToken);

      return response.sendStatus(200);
    } catch (error) {
      console.log(error);
      return handleError(error, response);
    }
  });

  app.get('/', (request, response) => {
    response.send('Hello World!');
  });

  // Start the server
  const server_port = process.env.PORT || 5050;
  app.listen(server_port, () => {
    Logger.info('Express', `Server is running on port ${server_port}`);
  });
}

init();
