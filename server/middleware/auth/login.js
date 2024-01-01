// import local files
const { signInUser } = require('../../database/queries');
const {
  setServerSideCookie,
  setClientSideCookie,
} = require('../../utils/cookies');
const { handleError } = require('../../utils/errors');
const validate = require('../../utils/validators');

const login = async (request, response) => {
  try {
    const { username, password } = request.body;

    const isInvalidEmail = validate.email(username);

    const { jwt, user } = await signInUser(username, password, isInvalidEmail);

    setServerSideCookie(response, 'userToken', jwt);
    setClientSideCookie(response, 'user', JSON.stringify(user));

    return response.sendStatus(200);
  } catch (error) {
    console.log(error);
    return handleError(error, response);
  }
};

module.exports = login;
