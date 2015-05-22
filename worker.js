var kue = require('kue');
var url = require('url');
var parse = require('url-parse');
var redis  = require('kue/node_modules/redis');
var mongoose = require('mongoose');
var queue = kue.createQueue();
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
var redisUrl = parse(process.env.REDIS_URL, true);
var queue = kue.createQueue({
  redis: {
    port: redisUrl.port,
    host: redisUrl.host,
    auth: 'p7ptn4ckh9k5c8daco8nmps58hn'
  }
});
queue.process('erase', function(job, done) {
  console.log('queue process running');
  function eraser(job) {
    ReservationModel.findByIdAndRemove(job.data.id).exec();
  }
  eraser(job);
  done();
});
