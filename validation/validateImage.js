const {isEmpty} = require("./is-empty");

exports.validateImage = data => {
  const errors = {};

  if (!["image/jpeg", "image/png"].includes(data.mimetype))
    errors.format = "Bad format";
  if (data.size > 500000)
    errors.size = "Big Image";

  return {errors, isValid: isEmpty(errors)};
};
