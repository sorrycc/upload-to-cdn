var utc = require('../');
var join = require('path').join;

describe('utc', function() {

  var tpsCache = null;

  it('tps', function(done) {
    var file = join(__dirname, './fixtures/a.png');
    utc([file], {
      type: 'tps',
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.endWith('-300-90.png');
        tpsCache = urls[0];
        done();
      }
    });
  });

  it('tps with cache', function(done) {
    var file = join(__dirname, './fixtures/a.png');
    utc([file], {
      type: 'tps',
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.eql(tpsCache);
        done();
      }
    });
  });

  var cdnCache = null;

  it('cdn', function(done) {
    var file = join(__dirname, './fixtures/b.png');
    utc([file], {
      type: 'cdn',
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.startWith('https://t.alipayobjects.com/images/');
        cdnCache = urls[0];
        done();
      }
    });
  });

  it('cdn with cache', function(done) {
    var file = join(__dirname, './fixtures/b.png');
    utc([file], {
      type: 'cdn',
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.eql(cdnCache);
        done();
      }
    });
  });

});
