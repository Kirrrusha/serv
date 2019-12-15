const validator = require('validator');
const { isEmpty } = require('./is-empty');

exports.validateRegisterInput = data => {
  const errors = {};
  const requiredFields = [
    'username',
    'email',
    'password',
    'replacePassword',
    'surname',
    'name',
    'middleName',
    'img',
    'role'
  ];

  requiredFields.forEach(
    key => (data[key] = !isEmpty(data[key]) ? data[key] : '')
  );
  const {
    username,
    email,
    surname,
    name,
    middleName,
    password,
    replacePassword
  } = data;

  [
    [username, 'username'],
    [surname, 'surname'],
    [name, 'name'],
    [middleName, 'middleName']
  ].forEach(item => {
    if (!validator.isLength(item[0], { min: 2, max: 30 }))
      errors[item[1]] = `${item[1]} must be between 2 and 30 characters`;

    if (!validator.isAlpha(item[0]))
      errors[item[1]] = `${item[1]} is bad`;
  });

  if (!validator.isEmail(email)) errors.email = 'Email is invalid';
  
  if (
    !validator.isLength(password, {
      min: 5,
      max: 12
    })
  )
    errors.password = 'password must be between 5 and 12 characters';

  if (
    !validator.isLength(replacePassword, {
      min: 5,
      max: 12
    })
  )
    errors.password2 = 'Confirm password must be between 6 and 12 characters';

  if (!validator.equals(password, replacePassword))
    errors.replacePassword = 'passwords must match';

  return { errors, isValid: isEmpty(errors) };
};
