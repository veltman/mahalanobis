import {mean, isNumeric} from "./src/misc.js";
import {invert, cov, transpose, multiply} from "./src/matrix.js";

export default function mahalanobis(data) {

  if (!Array.isArray(data)) {
    throw new TypeError("Argument must be an array.");
  }

  data.forEach(function(d){
    if (!Array.isArray(d) || d.length !== data[0].length || !d.every(isNumeric)) {
      throw new TypeError("Argument be an array of arrays of numbers, all the same length.");
    }
  });

  if (!data.length) {
    return [];
  }

  if (data.length <= data[0].length) {
    throw new RangeError("Data must have more observations (rows) than features (columns) to compute covariance. Currently has " + data.length + " observations, " + data[0].length + " features.");
  }

  var columns = transpose(data),
      means = columns.map(mean),
      invertedCovariance = invert(cov(columns, means));

  function distance(row) {
    var deltas = row.map(function(d, i){
      return d - means[i];
    });

    return Math.sqrt(
      multiply(
        multiply(
          deltas,
          invertedCovariance
        ),
        deltas
      )
    );
  }

  return {
    distance: distance,
    all: function() {
      return data.map(distance);
    }
  };

}
