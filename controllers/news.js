const News = require('../models/news');

module.exports.getNews = (req, res) => {
  News.find({})
    .then(news => res.json(news))
    .catch(({message}) => res.status(404).json(message));
};

module.exports.newNews = ({body}, res) => {
  const {topic, label, text, author} = body;
  News.find({label, topic, author})
    .then(news => {
      if (!news.length) {
        const newNews = new News({topic, text, label, author});
        newNews.save()
          .then(createdNews => res.json(createdNews))
          .catch(({message}) => res.status(404).json({message}));
      } else {
        throw new Error('This news was created');
      }
    })
    .catch(({message}) => res.status(404).json({message}));
};
module.exports.updateNews = ({params, body}, res,) => {
  const {text, label, topic} = body;
  const result = {
    text, label, topic
  };
  News.updateOne(
    {_id: params.id},
    {...result})
    .then(() => res.json({...body}))
    .catch(({message}) => res.status(404).json({message}));
};

module.exports.deleteNews = ({params}, res) => {
  News.deleteOne({_id: params.id})
    .then(() => res.json({message: 'ok'}))
    .catch(({message}) => res.status(404).json({message}));
};
