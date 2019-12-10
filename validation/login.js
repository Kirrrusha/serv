const validator = require('validator');
const { isEmpty } = require('./is-empty');

exports.validateLoginInput = data => {
  const errors = {};
  const requiredFields = ['email', 'password'];

  requiredFields.forEach(
    key => (data[key] = !isEmpty(data[key]) ? data[key] : '')
  );
  const { email, password } = data;

  if (!validator.isEmail(email)) errors.email = 'Email is invalid';
  if (
    !validator.isLength(password, {
      min: 6,
      max: 12
    })
  )
    errors.password = 'password must be between 6 and 12 characters';

  return { errors, isValid: isEmpty(errors) };
};
