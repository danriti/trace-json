
/**
 * Module dependencies.
 */

var Cycle = require('..')
  , traces = require('..');

var id = 0;
var n = 500;

// simulate N fake http
// requests to upload an image,
// resize, and transfer to s3.

// use $ TRACE=request

next();

function next() {
  if (!--n) return done();
  var trace = new Cycle('request', id++);

  // faux http upload
  var now = Date.now();
  trace.start('request', now);

  // image resizing
  trace.start('resize', now += Math.random() * 100 | 0);

  // update db in parallel
  trace.start('save', now);
  trace.end('save', now + 50);

  // transfer to s3
  trace.start('s3', now);
  trace.end('s3', now += Math.random() * 100 | 0);

  // resize complete
  trace.end('resize', now += Math.random() * 50 | 0);

  // response flushed
  trace.end('request', now + 50);

  process.nextTick(next);
}

function done() {
  console.log('done!');
}
