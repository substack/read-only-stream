var Readable = require('readable-stream/readable');

module.exports = function (stream) {
    var ro = new Readable;
    var waiting = false;
    
    stream.on('readable', function () {
        if (waiting) {
            waiting = false;
            ro._read();
        }
    });
    
    ro._read = function () {
        var buf, reads = 0;
        while ((buf = stream.read()) !== null) {
            ro.push(buf);
            reads ++;
        }
        if (reads === 0) waiting = true;
    };
    stream.once('end', function () { ro.push(null) });
    return ro;
};
