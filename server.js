var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var moment = require('moment');
var kue = require('kue');
var url = require('url');
var redis  = require('kue/node_modules/redis');
var bodyParser = require('body-parser');

var redis_url = parse(process.env.REDIS_URL);
// config
var queue = kue.createQueue({
  redis: {
    port: redis_url.port,
    host: redis_url.host,
    auth: 'p7ptn4ckh9k5c8daco8nmps58hn'
  }
});
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
mongoose.connect(process.env.MONGOLAB_URI);
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

// set up redis


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
      //res.json(reservations);
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
  var now = new Date();
  var midnight = new Date();
  midnight.setHours(24,0,0,0);
  var difference = midnight.getTime() - now.getTime();
  reserv.save(function(err) {
    if(!err) {
      console.log('created');
      queue.create('erase', {
        id: reserv.id
      }).delay(difference).save();
    }
  });
  res.json(reserv);
});
app.get('/search', function(req,res) {
  ReservationModel.count({}, function(err, count) {
    if(!err) {
      res.write('before it was' + count);
    } else {
      console.log('error');
    }

  });
  ReservationModel.count({}, function(err, count) {
    if(!err) {
      res.end('now it is' + count);
    }
  });
});
app.listen(3000, function() {
  console.log('App loaded and running');
});
