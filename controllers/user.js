const fs = require('fs');
const bCrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');


module.exports.saveNewUser = ({body}, res, next) => {
  const {username: login, password, email, surname, name, patronymic} = body;
  User.findOne({login, email}).then(user => {
    if (user) {
      res
        .json({message: 'User with this login already exists.'});
      next();
    } else {
      const newUser = new User({
        login,
        email,
        surname,
        password,
        name,
        patronymic
      });
      bCrypt.genSalt(10, (error, salt) => {
        bCrypt.hash(password, salt, (error, hash) => {
          if (error) return res.status(404).json({...error});
          newUser.password = hash;
          newUser.save()
            .then(user => res.json({message: `User ${login} created`}))
            .catch(({message}) => res.status(404).json({message}))
        })
      })
    }
  }).catch(({message}) => res.status(404).json({message}));
};

module.exports.login = ({body}, res) => {
  const {login, email} = body;
  User.findOne({login, email}).then((user) => {
    if (!user) {
      return res.json({message: 'Specify the correct username and password'});
    }
    const payload = {id: user.id, name: user.name}

    jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>
      res.json({
        id: user._id,
        username: user.login,
        password: user.password,
        surname: user.surname,
        name: user.name,
        patronymic: user.patronymic,
        token
      })
    )
  })
    .catch(({message}) => res.status(404).json({message}));
};

module.exports.updateUser = (req, res) => {
  User.updateOne(
    {_id: req.params.id},
    {...req.body})
    .then(() => res.json({...req.body}))
    .catch(({message}) => res.status(404).json({message}));
};

module.exports.deleteUser = (req, res) => {
  User.remove({_id: req.params.id})
    .then(() => res.json({message: 'ok'}))
    .catch(({message}) => res.status(404).json({message}));
};

module.exports.saveUserImage = (req, res) => {
  User.findOne({_id: req.params.id})
    .then(user => {
      if (user.img === './images/default.png') {
        updateImage(req, user);
      } else {
        fs.unlink(`${user.img}`, ({message}) =>
          res.status(404).json({message}));
      }
    })
    .catch(({message}) => res.status(404).json({message}));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.json(users))
    .catch(({message}) => res.status(404).json({message}))
};

module.exports.updateUserPermission = (req, res) => {
};

module.exports.authFromToken = ({body}, res, next) => {
  const {username: login, password} = body;
  User.findOne({login}).then((user, err) => {
    if (err) {
      // return next(err);
      return res.json({message: err.message})
    }
    if (!user) {
      return res.json({status: 'Укажите правильный логин и пароль!'});
    }
    bCrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {id: user.id, name: user.name}

        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
          res.json({success: 'true', token: token})
        })

      } else {
        return res.status(400).json({password: 'Password incorrect'})
      }
    });
  });
};
// module.exports.logOut = (req, res) => {
//   req.logout();
//   res.json({message: 'out'});
// };

const createHash = (password) => bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

const createToken = (payload) => jwt.encode(payload, config.secret);

const updateImage = (req, user) => {
  user.img = `./images/${req.files.userImage.name}`;
  let image = req.files.userImage;
  image.mv('./images/' + image.name);
  user.save()
    .then(newUser => {
      return res
        .json({path: `${newUser.img}`});
    });
};

