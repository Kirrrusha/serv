const fs = require("fs");
const bCrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const {roles} = require("./roles");
const {validateRegisterInput} = require("../validation/register");
const {validateProfileInput} = require("../validation/profile");
const {validateAuthInput} = require("../validation/auth");
const {validateImage} = require("../validation/validateImage");

exports.registration = ({body: request}, res) => {
  const {errors, isValid} = validateRegisterInput(request);
  if (!isValid) return res.status(400).json(errors);
  const {
    username,
    password,
    email,
    surname,
    name,
    middleName,
    role
  } = request;
  User.findOne({username, email})
    .then(user => {
      if (user) {
        return res
          .status(400)
          .json({message: "User with this username already exists."});
      } else {
        const newUser = new User({
          username,
          email,
          surname,
          password,
          name,
          middleName,
          role
        });
        bCrypt.genSalt(10, (error, salt) => {
          bCrypt.hash(password, salt, (error, hash) => {
            if (error) return res.status(404).json({...error});
            newUser.password = hash;
            newUser
              .save()
              .then(() => res.json({message: `User ${username} created`}))
              .catch(({message}) => res.status(404).json({message}));
          });
        });
      }
    })
    .catch(({message}) => res.status(404).json({message}));
};

exports.login = ({body: request}, res) => {
  const {errors, isValid} = validateRegisterInput(request);
  if (!isValid) return res.status(400).json(errors);
  const {username, email} = request;
  User.findOne({username, email})
    .then(user => {
      if (!user) {
        return res.json({
          message: "Specify the correct username and password"
        });
      }
      const payload = {id: user.id, name: user.name};

      jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>
        res.json({
          id: user._id,
          username: user.username,
          password: user.password,
          surname: user.surname,
          name: user.name,
          middleName: user.middleName,
          token
        })
      );
    })
    .catch(({message}) => res.status(404).json({message}));
};

exports.updateUser = ({body: request, params}, res) => {
  const {errors, isValid} = validateProfileInput(request);
  if (!isValid) return res.status(400).json(errors);
  const {surname, name, middleName} = request;
  User.updateOne({_id: params.id}, {surname, name, middleName})
    .then(() => res.json({surname, name, middleName}))
    .catch(({message}) => res.status(404).json({message}));
};

exports.deleteUser = ({params}, res) => {
  User.deleteOne({_id: params.id})
    .then(() => res.json({message: "ok"}))
    .catch(({message}) => res.status(404).json({message}));
};

exports.saveUserImage = ({params, files}, res) => {
  User.findOne({_id: params.id})
    .then(user => {
      const oldImg = `${user.img}`;
      const {errors, isValid} = validateImage(files.userImage);
      if (!isValid) return res.status(400).json(errors);

      user.img = `./images/${files.userImage.name}`;
      if (oldImg !== user.img) {
        let image = files.userImage;
        image.mv("./images/" + image.name);
        user.save().then(newUser => {
          if (oldImg !== "./images/default.png") {
            fs.unlink(`${oldImg}`.slice(2), (err) => {
              if (err)
                return res.status(404).json(err);
            });
          }
          return res.json({path: newUser.img});
        });
      } else {
        return res.json({message: "Same image"});
      }
    })
    .catch(({message}) => res.status(404).json({message}));
};

exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.json(users))
    .catch(({message}) => res.status(404).json({message}));
};

// exports.updateUserPermission = (req, res) => {};

exports.authFromToken = ({body: request}, res) => {
  const {errors, isValid} = validateAuthInput(request);
  if (!isValid) return res.status(400).json({message: errors});
  const {username, password} = request;
  User.findOne({username}).then((user, err) => {
    if (err) {
      return res.json({message: err.message});
    }
    if (!user) {
      return res.json({status: "Укажите правильный логин и пароль!"});
    }
    bCrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {id: user.id, name: user.name};

        jwt.sign(
          payload,
          keys.secretOrKey,
          {expiresIn: 3600},
          (err, token) => {
            res.json({success: "true", token: token});
          }
        );
      } else {
        return res.status(400).json({password: "Password incorrect"});
      }
    });
  });
};

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const permission = roles.can(req.user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
      next();
    } catch (error) {
      res.status(400).json({message: error.message});
      next(error);
    }
  };
};
// module.exports.logOut = (req, res) => {
//   req.logout();
//   res.json({message: 'out'});
// };
