let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const NewsSchema = new Schema({
    topic: {
      type: String,
      required: [
        true, 'Enter new\'s topic'
      ],
    },
    label: {
      type: String,
      required: [
        true, 'Enter new\'s label'
      ],
    },
    text: {
      type: String,
      required: [
        true, 'Enter new\'s text'
      ],
    },
    author: String
  },
  {
    timestamps: {
      createdAt: 'createdAt'
    }
  });


const news = mongoose.model('news', NewsSchema);

module.exports  = news;
