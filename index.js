var mkdirp = require('mkdirp');
var join = require('path').join;
var crypto = require('crypto');
var util = require('util');
var debug = require('debug')('utc');
var fs = require('fs');
var exists = fs.existsSync;
var read = fs.readFileSync;

var engines = {
  tps: require('tps'),
  cdn: cdn
};

var home = process.env.HOME || process.env.USERPROFILE;
var cachePath = join(home, '.cdncache');
mkdirp.sync(cachePath);

module.exports = function(files, opts) {
  if (typeof files === 'string') {
    files = [files];
  }

  var result = {};

  // Flow:
  // 1. read cache
  // 2. filter and upload uncached files
  // 3. concat cache and uncache results
  // 4. write cache
  // 5. callback

  // 1
  var md5hashs = md5(files);
  debug('1: %s', md5hashs);
  // 2
  var uncacheFiles = files.filter(function(f, i) {
    var md5hash = md5hashs[i];
    var cacheFile = join(cachePath, md5hash);
    if (exists(cacheFile)) {
      var url = read(cacheFile, 'utf-8');
      if (url) result[f] = url;
      return false;
    } else {
      return true;
    }
  });
  debug('2: uncacheFiles: %s', uncacheFiles);

  function cb() {
    opts.callback && opts.callback(null, files.map(function(f) {
      return result[f];
    }));
  }

  if (!uncacheFiles.length) {
    return cb();
  }

  var engine = engines[opts.type || 'tps'];
  engine(uncacheFiles, function(e, urls) {
    if (e) throw Error(e);
    debug('2: urls: %s', urls);
    // 3
    uncacheFiles.forEach(function(f, i) {
      result[f] = urls[i];
    });
    debug('3: result: %s', result);

    // 4
    writeCache(result);

    // 5
    cb();
  });
};

function md5(files) {
  if (!util.isArray(files)) {
    files = [files];
  }
  return files.map(function md5Handler(str) {
    var md5sum = crypto.createHash('md5');
    return md5sum.update(str).digest('hex');
  });
}

function writeCache(o) {
  var files = Object.keys(o);
  var md5hashs = md5(files);
  files.map(function(f, i) {
    var md5hash = md5hashs[i];
    var url = o[f];
    var cacheFile = join(cachePath, md5hash);
    fs.writeFileSync(cacheFile, url);
  });
}

function cdn(files, cb) {
  require('cdn')(files, function(e, urls) {
    if (typeof urls === 'string') {
      urls = [urls];
    }
    cb(e, urls);
  });
}
