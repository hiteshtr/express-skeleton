Var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      userSchema = new Schema( {
          username: String,
          password: String
      }),
User = mongoose.model('user', userSchema);

module.exports = User;