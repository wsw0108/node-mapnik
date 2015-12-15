"use strict";

var mapnik = require('../');
var assert = require('assert');
var path = require('path');

mapnik.register_datasource(path.join(mapnik.settings.paths.input_plugins, 'maptalks.input'));

describe("maptalks datasource", function() {
    it("should render a clip of layer", function(done) {
        var map = new mapnik.Map(256, 256);
        map.load('./test/data/maptalks.xml', {}, function(err, map) {
            if (err) throw err;
            var image = new mapnik.Image(map.width, map.height);
            var image2 = new mapnik.Image.open('./test/data/maptalks/kor.png');
            // { x: 27, y: 12, z: 5}
            var bbox = [ 13775786.985667605,
                         3757032.814272983,
                         15028131.256867604,
                         5009377.085472983 ];
            map.bufferSize = 64;
            map.extent = bbox;
            var options = {
                scale: 1,
                variables: { zoom: 5 }
            };
            map.render(image, options, function(err, image) {
                assert.equal(0, image.compare(image2));
                done();
            });
        });
    });

    it("should render whole layer", function(done) {
        var map = new mapnik.Map(256, 256);
        map.load('./test/data/maptalks.xml', {}, function(err, map) {
            if (err) throw err;
            map.zoomAll();
            map.bufferSize = 64;
            var image = new mapnik.Image(map.width, map.height);
            var image2 = new mapnik.Image.open('./test/data/maptalks/chn.png');
            var options = {
                scale: 1
            };
            map.render(image, options, function(err, image) {
                assert.equal(0, image.compare(image2));
                done();
            });
        });
    });
});
