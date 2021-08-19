const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxLength : [40, 'A tour name must have less or equal then 40 charaters'],
    minLength : [10, 'A tour name must have more or equal then 10 charaters'],
    validate : [validator.isAlpha, 'Tour name must only contain letters']
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have diffculty'],
    enum : {
      values : ['easy', 'medium', 'difficult'],
      message : 'Difficulty is either : easy, medium , difficult'

    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min : [1, 'Rating must be above 1.0'],
    max : [5, 'Rating must be less then 5.0']
  },
  ratingsQunatity: {
    type: Number,
    default: 0, 
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type : Number,
    validate: {
      validator: function(val){
        // it only works when creating new doc , not while updating new doc
        return val < this.price
      },

      message : "Discount ({VALUE}) must be equal or less then price"
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  slug : String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
   secretTour:{
    type : Boolean,
    default : false
   },
    startDates: [Date],
  
}, {
  toJSON:{virtuals :  true},
  toObject :{virtuals : true}
});

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
})

//middleware
// runs before save and create
// not in insertmany
// this indicate the current document being processed
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true})
  next();
});

// Query middle ware
tourSchema.pre(/^find/, function(next){
  this.find({secretTour :  {$ne : true}});
  this.start = Date.now()
  next() 
})

tourSchema.post(/^find/, function(next) {
  console.log(`Query took ${Date.now() - this.start()} milliseconds`)
  next(); 
});

// Aggregation Middleware
tourSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match : {secretTour :  {$ne : true}}});
  next();
}) 



const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
