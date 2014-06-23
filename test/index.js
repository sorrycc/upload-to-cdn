var utc = require('../');
var join = require('path').join;

describe('utc', function() {

  it('tps', function(done) {
    var file = join(__dirname, './fixtures/a.png');
    utc([file], {
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.endWith('-300-90.png');
        done();
      }
    });
  });

  var urlCache = null;

  it('cdn', function(done) {
    var file = join(__dirname, './fixtures/b.png');
    utc([file], {
      type: 'cdn',
      callback: function(e, urls) {
        urls.length.should.be.eql(1);
        urls[0].should.be.startWith('https://i.alipayobjects.com/i/localhost/png/');
        urlCache = urls[0];
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
        urls[0].should.be.eql(urlCache);
        done();
      }
    });
  });

});
