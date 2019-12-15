const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Enter login']
  },
  email: {
    type: String,
    required: [true, 'Enter email']
  },
  password: {
    type: String,
    required: [true, 'Enter password']
  },
  surname: String,
  name: String,
  middleName: String,
  img: {
    type: String,
    default: './images/default.png'
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'supervisor', 'admin']
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

const user = mongoose.model('users', UserSchema);

module.exports = user;
