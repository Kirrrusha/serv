const { isEmpty } = require('./is-empty');

exports.validateExperienceInput = (data) => {
  const errors         = {}
  const requiredFields = ['title', 'from', 'company']

  requiredFields.forEach(key => {
    if (isEmpty(data[key])) errors[key] = `${key} is required`
  })

  return { errors, isValid: isEmpty(errors) }
}