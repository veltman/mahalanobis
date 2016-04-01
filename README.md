# Mahalanobis

Calculate the [Mahalanobis distances](https://en.wikipedia.org/wiki/Mahalanobis_distance) from an array of multivariate data. Useful for calculating "outlierness" of data points across dimensions in certain situations.

### Installation

```
npm install mahalanobis
```

### Usage

Returns an array of the same length as the input array with the Mahalanobis distance for each element.  The input array should be an array of rows, like:

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
  [1,2,3],
  [1,5,6],
  [7,3,4],
  [2,3,0],
  [9,0,-5]
];

var distances = mahalanobis(data);

distances.forEach(function(distance,i){
  console.log("The distance for row " + i + " is " + distance);
});
```

```
The distance for row 0 is 1.78834390789133
The distance for row 1 is 1.3487167047236224
The distance for row 2 is 1.5829207125424334
The distance for row 3 is 1.367039530625441
The distance for row 4 is 1.6150400171571428
```
