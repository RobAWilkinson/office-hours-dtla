var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var moment = require('moment');
var bodyParser = require('body-parser');
// config
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
// allow the use of the moment datetime library in jade templates
app.locals.moment = require('moment');

// connect to the db
//
mongoose.connect('mongodb://localhost:27017/reservations');
// set up our models
// j
var reservationSchema = new mongoose.Schema({
  student: String,
  times: {
    startTime: Date,
    stopTime: Date
  }
});
var ReservationModel = mongoose.model('Reservation', reservationSchema);

app.get('/', function(req, res) {
  var timeslots = [
    { 
      value: moment({hour: 6}),
      display: moment({hour: 6}).format('hh:mm')
    },
    {
      value: moment({hour: 6, minute: 15}),
      display: moment({hour: 6, minute: 15}).format('hh:mm')
    },
    {
      value: moment({hour: 6, minute: 30}),
      display: moment({hour: 6, minute: 30}).format('hh:mm')
    },
    {
      value: moment({hour: 6, minute: 45}),
      display: moment({hour: 6, minute: 45}).format('hh:mm')
    },
    {
      value: moment({hour: 7, minute: 0}),
      display: moment({hour: 7, minute: 0}).format('hh:mm')
    },
    {
      value: moment({hour: 7, minute: 15}),
      display: moment({hour: 7, minute: 15}).format('hh:mm')
    },
    {
      value: moment({hour: 7, minute: 30}),
      display: moment({hour: 7, minute: 30}).format('hh:mm')
    },
    {
      value: moment({hour: 7, minute: 45}),
      display: moment({hour: 7, minute: 45}).format('hh:mm')
    },
    {
      value: moment({hour: 8, minute: 0}),
      display: moment({hour: 8, minute: 0}).format('hh:mm')
    },
    {
    value: moment({hour: 8, minute: 15}),
    display: moment({hour: 8, minute: 15}).format('hh:mm')
    }
  ];
  return ReservationModel.find(function(err, reservations) {
    if(!err) {
      res.render('index', { reservations: reservations, timeslots: timeslots});
    } else {
      console.log(reservations);
    }
  });
});
app.post('/',function(req,res){
  var reserv = new ReservationModel({ 
    student: req.body.name, 
    times: { 
      startTime: req.body.startTime, 
      stopTime:  moment(req.body.startTime).add(15, 'minutes')
    } 
  });
  reserv.save(function(err) {
    if(!err) {
      console.log('created');
    }
  });
  res.json(reserv);
});
app.listen(3000, function() {
  console.log('App loaded and running');
});
