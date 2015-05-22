var kue = require('kue');
var redis  = require('kue/node_modules/redis');
var mongoose = require('mongoose');
var url = require('url');
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
var redisUrl = url.parse(process.env.REDIS_URL);
var queueOptions = {
  redis: {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port),
    auth: redisUrl.auth.split(':')[1]
  }
};
console.log(queueOptions);
var queue = kue.createQueue(queueOptions);
queue.process('erase', function(job, done) {
  console.log('queue process running');
  function eraser(job) {
    ReservationModel.findByIdAndRemove(job.data.id).exec();
  }
  eraser(job);
  done();
});
