const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/user');
const passport = require('passport');

let auth = passport.authenticate('jwt', {
  session: false
});

router.post('/authFromToken', ctrlUser.authFromToken);

router.post('/login', ctrlUser.login);

router.post('/registration', ctrlUser.registration);

// router.post('/logOut', auth, ctrlUser.logOut);

router.put('/updateUser/:id', auth, ctrlUser.updateUser);

router.delete('/deleteUser/:id', auth, ctrlUser.grantAccess('deleteOwn', 'profile'), ctrlUser.deleteUser);

router.post('/saveUserImage/:id', auth, ctrlUser.saveUserImage);

router.get('/getUsers', auth, ctrlUser.grantAccess('readAny', 'profile'), ctrlUser.getUsers);

module.exports = router;
