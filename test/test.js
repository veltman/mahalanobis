var assert = require("assert"),
  mahalanobis = require("../build/mahalanobis.js");

var test2D = [
    [4, 3],
    [4, 7],
    [5, 5],
    [2, 7],
    [3, 9],
    [6, 5],
    [9, 6],
    [7, 2],
    [4, 2],
    [5, 7]
  ],
  test3D = [
    [7, 6, 0],
    [5, 0, 3],
    [3, 3, 0],
    [5, 2, 3],
    [1, 9, 6],
    [7, 1, 1],
    [5, 4, 7],
    [2, 8, 0],
    [2, 6, 8],
    [3, 1, 6]
  ];

var m2D = mahalanobis(test2D),
  m3D = mahalanobis(test3D);

var expected2D = [
    1.2402,
    0.7602,
    0.1278,
    1.4657,
    1.6452,
    0.5444,
    2.231,
    1.5437,
    1.662,
    0.771
  ],
  expected3D = [
    2.2104,
    1.3133,
    1.7528,
    0.6579,
    1.7931,
    1.4634,
    1.6439,
    1.9685,
    1.5632,
    1.5831
  ];

[
  // Bad inputs
  1,
  {},
  [],
  "string",
  [1, 2, 3],
  [
    [1, 2],
    [1, 2, 3]
  ],
  // Uncomputable inputs
  test2D.slice(0, 1),
  test2D.slice(0, 2),
  test3D.slice(0, 2),
  test3D.slice(0, 3),
  [
    [13, 19, 10, 2, 2],
    [3, 13, 7, 10, 17],
    [12, 7, 6, 9, 7],
    [12, 2, 19, 18, 19],
    [13, 9, 0, 5, 12]
  ],
  [[1]]
].forEach(function(badInput) {
  assert.throws(function() {
    mahalanobis(badInput);
  });
});

assert.deepEqual(round(m2D.all()), expected2D);
assert.deepEqual(round(m3D.all()), expected3D);

assert.deepEqual(round(test2D.map(m2D.distance)), expected2D);
assert.deepEqual(round(test3D.map(m3D.distance)), expected3D);

function round(arr) {
  return arr.map(function(d) {
    return Math.round(d * 10000) / 10000;
  });
}
