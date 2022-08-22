const mongoose = require('mongoose')

const reviews = new mongoose.Schema({

   taskProvider:{
       type : String,
       required:true
   },
   taskWorker:{
    type : String,
    required:true
   },
   rating:{
    type : Number,
    required:true
   },
   reviewContent :{
    type : String,
    required:true
   }
});

module.exports = mongoose.model('reviews',reviews);