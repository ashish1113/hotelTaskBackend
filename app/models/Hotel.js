const mongoose = require('mongoose')
const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const Hotels = new Schema({
   hotelId:{
    type: String,
    
    
    unique: true
   },
   hotelName:{
    type: String,
   
    
    unique: true
   },
   hotelEmail:{
    type: String,
   
    
    unique: true
   },
   hotelPhoneno:{
    type: String,
    
    
    unique: true
   },
   city:{
    type: String,
    default: 'Bangalore',
    

   },
   state:{
    type: String,
    default: 'Bangalore',
   },
   totalNoOfRooms:{
    type: Number,
    default: 10,
   }
})

module.exports = mongoose.model('Hotels', Hotels)