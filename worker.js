var kue = require('kue');
var url = require('url');
var redis  = require('kue/node_modules/redis');
var mongoose = require('mongoose');
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
kue.redis.createClient = function() {
    var redisUrl = url.parse(process.env.REDIS_URL)
      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) {
        client.auth(redisUrl.auth.split(":")[1]);
    }
    return client;
};
queue.process('erase', function(job, done) {
  console.log('queue process running');
  function eraser(job) {
    ReservationModel.findByIdAndRemove(job.data.id).exec();
  }
  eraser(job);
  done();
});
