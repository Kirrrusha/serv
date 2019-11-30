const mongoose = require('mongoose');
const NewsModel = require('../models/news');

module.exports.getNews = (req, res, next) => {
  NewsModel.find({}, (err, news) => {
    if (err) next(err);
    res.json({news});
  })
};

module.exports.newNews = (req, res, next) => {
  const {theme, label, text, author} = req.body;
  NewsModel.find({label, theme, author}, (err, news) => {
      console.log(news);
    if (err) {
      next(err);
    }
    if (!news.length) {
      const newNews = new NewsModel({theme, text, label,author})
        .save()
        .then(createdNews => {
            console.log(createdNews)
          // res.json(createdNews);
        })
        .catch(next);
    } else {
      next(err);
    }
  });
};
module.exports.updateNews = (req, res, next) => {
  NewsModel.updateOne({_id: req.params.id}, {upsert: true}, (err) => {
    if (err) next(err);
    res.json({...req.body});
  });
};
module.exports.deleteNews = (req, res) => {
    NewsModel.remove({_id: req.params.id}, {upsert: true}, (err) => {
        if (err) next(err);
        res.json({...req.body});
    });
};
