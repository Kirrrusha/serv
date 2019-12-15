const validator = require('validator');
const { isEmpty } = require('./is-empty');

exports.validateProfileInput = data => {
  const errors = {};
  const requiredFields = [
    'surname',
    'name',
    'middleName',
  ];

  requiredFields.forEach(
    key => (data[key] = !isEmpty(data[key]) ? data[key] : '')
  );
  const { surname, name, middleName } = data;

  // const urlGroup = ['website', 'instagram', 'twitter', 'facebook', 'linkedin'];

  if (
    !validator.isLength(name, {
      min: 6,
      max: 40
    })
  ) errors.name = 'Name must be between 6 and 40 characters';

  if (
    !validator.isLength(surname, {
      min: 6,
      max: 40
    })
  ) errors.surname = 'Surname must be between 6 and 40 characters';
  
  if (
    !validator.isLength(middleName, {
      min: 6,
      max: 40
    })
  ) errors.middleName = 'MiddleName must be between 6 and 40 characters';
  // check for correct urls
  // urlGroup.forEach(key => {
  //   const url = data[key];
  //   if (!isEmpty(url)) {
  //     if (!validator.isURL(url)) errors[key] = `${key} is not a valid url`;
  //   } else if (requiredFields.indexOf(key) !== -1)
  //     errors[key] = `${key} is required`;
  // });

  return { errors, isValid: isEmpty(errors) };
};
