const validator = require('validator');
const { isEmpty } = require('./is-empty');

exports.validateProfileInput = data => {
  const errors = {};
  const requiredFields = ['handle', 'status', 'skills'];

  requiredFields.forEach(
    key => (data[key] = !isEmpty(data[key]) ? data[key] : '')
  );
  const { handle, status, skills } = data;

  const urlGroup = ['website', 'instagram', 'twitter', 'facebook', 'linkedin'];

  if (
    !validator.isLength(handle, {
      min: 6,
      max: 40
    })
  )
    errors.handle = 'Handle must be between 2 and 40 characters';
  if (validator.isEmpty(status)) errors.status = 'status required';
  if (validator.isEmpty(skills)) errors.skills = 'skills required';
  // check for correct urls
  urlGroup.forEach(key => {
    const url = data[key];
    if (!isEmpty(url)) {
      if (!validator.isURL(url)) errors[key] = `${key} is not a valid url`;
    } else if (requiredFields.indexOf(key) !== -1)
      errors[key] = `${key} is required`;
  });

  return { errors, isValid: isEmpty(errors) };
};
