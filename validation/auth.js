const validator = require('validator');
const { isEmpty } = require('./is-empty');

exports.validateAuthInput = data => {
  const errors = [];
  const requiredFields = ['password', 'username'];

  requiredFields.forEach(
    key => (data[key] = !isEmpty(data[key]) ? data[key] : '')
  );
  const { password, username } = data;

  if (!validator.isLength(username, { min: 2, max: 30 }))
      errors.push( `username must be between 2 and 30 characters`);

    if (!validator.isAlphanumeric(username)) errors.push(`username is bad`);

  if (
    !validator.isLength(password, {
      min: 5,
      max: 12
    })
  )
    errors.push('password must be between 6 and 12 characters');

  return { errors, isValid: isEmpty(errors) };
};
