const express = require('express');
const router = express.Router();
const ctrlNews = require('../controllers/news');
const passport = require('passport');

let auth = passport.authenticate('jwt', {
  session: false
});

router.get('/getNews', auth, ctrlNews.getNews);

router.post('/newNews', auth, ctrlNews.newNews);

router.put('/updateNews/:id', auth, ctrlNews.updateNews);

router.delete('/deleteNews/:id', auth, ctrlNews.deleteNews);

module.exports = router;
