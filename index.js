
var engines = {
  tps: require('tps'),
  cdn: require('cdn')
};

module.exports = function(files, opts) {
  if (typeof files === 'string') {
    files = [files];
  }
  opts.engineType = opts.engineType || 'tps';
  upload(files, engineType, cb || noop);
};

function upload(files, engineType, cb) {
  var engine = engines[engineType];
  engine(files, cb);
}

function noop() {}
