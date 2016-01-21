var assert = require('assert');
var pipe = require('../');

describe('pipe', function() {
  it('should fail for invalid pipes argument', function(done) {
    try {
      pipe(null);
    } catch (e) {
      if (e instanceof TypeError) return done();
      throw e;
    }
    throw new Error('Not thrown');
  });
  it('should fail for invalid pipes array elements', function(done) {
    try {
      pipe([ null, '' ]);
    } catch (e) {
      if (e instanceof TypeError) return done();
      throw e;
    }
    throw new Error('Not thrown');
  });
  it('should fail for invalid pipefds', function(done) {
    try {
      pipe([ -1, -1 ]);
    } catch (e) {
      if (e instanceof TypeError) return done();
      throw e;
    }
    throw new Error('Not thrown');
  });
  it('should fail for TTY pipefds', function(done) {
    try {
      pipe([ 0, 1 ]);
    } catch (e) {
      if (e instanceof TypeError) return done();
      throw e;
    }
    throw new Error('Not thrown');
  });
  it('should fail for not UNKNOWN pipefds', function(done) {
    try {
      pipe([ 65534, 65535 ]);
    } catch (e) {
      if (e instanceof TypeError) return done();
      throw e;
    }
    throw new Error('Not thrown');
  });
  it('should not fail for valid pipefds', function(done) {
    var fds = pipe.pipe();
    var p = pipe(fds);
    p[0].destroy();
    p[1].destroy();
    delete p;
    done();
  });
  it('should not fail for undefined fds (auto-generate)', function(done) {
    var p = pipe();
    p[0].destroy();
    p[1].destroy();
    delete p;
    done();
  });
});

describe('pipe channel', function() {
  it('should pass data', function(done) {
    var data = new Buffer('TESTtestTEST123');
    var p = pipe();
    p[0].on('data', function (d) {
      p[0].destroy();
      p[1].destroy();
      delete p;
      if (data.equals(d)) return done();
      throw new Error('Buffers not equal');
    });
    p[1].write(data);
  });
});