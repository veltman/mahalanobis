var assert = require("assert"),
    mahalanobis = require("../build/mahalanobis.js");

var wrapper = function(d) {
  return function() {
    mahalanobis(d);
  };
};

var test2D = [[4,3],[4,7],[5,5],[2,7],[3,9],[6,5],[9,6],[7,2],[4,2],[5,7]],
    test3D = [[7,6,0],[5,0,3],[3,3,0],[5,2,3],[1,9,6],[7,1,1],[5,4,7],[2,8,0],[2,6,8],[3,1,6]];

// Bad inputs
assert.throws(wrapper(1));
assert.throws(wrapper({}));
assert.throws(wrapper("string"));
assert.throws(wrapper([1,2,3]));
assert.throws(wrapper([[1,2],[1,2,3]]));

// Uncomputable
assert.throws(wrapper(test2D.slice(0, 1)));
assert.throws(wrapper(test2D.slice(0, 2)));
assert.throws(wrapper(test3D.slice(0, 2)));
assert.throws(wrapper(test3D.slice(0, 3)));
assert.throws(wrapper([[13,19,10,2,2],[3,13,7,10,17],[12,7,6,9,7],[12,2,19,18,19],[13,9,0,5,12]]));
assert.throws(wrapper([[1]]));

// Empty data
assert.deepEqual(mahalanobis([]),[]);

// Test
assert.deepEqual(roundTo(mahalanobis(test2D),4),[1.2402,0.7602,0.1278,1.4657,1.6452,0.5444,2.231,1.5437,1.662,0.771]);
assert.deepEqual(roundTo(mahalanobis(test3D),4),[2.2104,1.3133,1.7528,0.6579,1.7931,1.4634,1.6439,1.9685,1.5632,1.5831]);

function roundTo(arr,places) {

  var pow = Math.pow(10,places);

  return arr.map(function(d){
    return Math.round(d * pow) / pow;
  });

}
