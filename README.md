# Mahalanobis

[![Build Status](https://travis-ci.org/veltman/mahalanobis.svg?branch=master)](https://travis-ci.org/veltman/mahalanobis)

Calculate the [Mahalanobis distances](https://en.wikipedia.org/wiki/Mahalanobis_distance) from an array of multivariate data. Useful for calculating "outlierness" of data points across dimensions in certain situations.

### Installation

```
npm install mahalanobis
```

### Usage

`mahalanobis(points)` returns an object with two methods: `.distance(point)` to get the Mahalanobis distance of one point vs. the distribution, and `.all()` to return an array of Mahalanobis distances for all the input points.

The input array should be an array of rows, like:

```
[
  [1,2,3],
  [1,5,6],
  [7,9,10],
  [9,0,-5]
]
```

```js
var mahalanobis = require("mahalanobis");

var data = [
  [1, 2, 3],
  [1, 5, 6],
  [7, 3, 4],
  [2, 3, 0],
  [9, 0, -5]
];

var m = mahalanobis(data);

data.forEach(function(point, i) {
  console.log("The distance for row " + i + " is " + m.distance(point));
});

/*
The distance for row 0 is 1.78834390789133
The distance for row 1 is 1.3487167047236224
The distance for row 2 is 1.5829207125424334
The distance for row 3 is 1.367039530625441
The distance for row 4 is 1.6150400171571428
*/
```

You can also use the `.all()` method to directly return an array of distances for all the points in the input array.

```js
var mahalanobis = require("mahalanobis");

var data = [
  [1, 2, 3],
  [1, 5, 6],
  [7, 3, 4],
  [2, 3, 0],
  [9, 0, -5]
];

var distances = mahalanobis(data).all();

distances.forEach(function(distance, i) {
  console.log("The distance for row " + i + " is " + distance);
});

/*
The distance for row 0 is 1.78834390789133
The distance for row 1 is 1.3487167047236224
The distance for row 2 is 1.5829207125424334
The distance for row 3 is 1.367039530625441
The distance for row 4 is 1.6150400171571428
*/
```
