const { isEmpty } = require('./is-empty');

exports.validateEducationInput = data => {
  const errors = {};
  const requiredFields = ['school', 'degree', 'fieldofstudy', 'from'];

  requiredFields.forEach(key => {
    if (isEmpty(data[key])) errors[key] = `${key} is required`;
  });

  return { errors, isValid: isEmpty(errors) };
};
