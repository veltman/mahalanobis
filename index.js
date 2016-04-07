var cov = require("compute-covariance"),
    math = require("mathjs");

function mahalanobis(data) {

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

  var columns = transpose(data);

  var covariance = cov(columns);

  console.log(covariance);
  var invertedCovariance = invert(covariance);
  console.log(invertedCovariance);
  console.log("");

  var means = columns.map(function(column){
    return mean(column);
  });

  var deltas = data.map(function(row){
    return row.map(function(d,i){
      return d - means[i];
    });
  });

  return deltas.map(function(row,i){

    return Math.sqrt(
      math.multiply(
        math.multiply(
          row,
          invertedCovariance
        ),
        row
      )
    );

  });

}

function invert(matrix) {

  return math.inv(matrix);

}

function transpose(matrix) {

  return matrix[0].map(function(d,i){

    return matrix.map(function(row){
      return row[i];
    });

  });

}

function mean(arr) {
  return arr.reduce(function(a,b){
    return a + b;
  }) / arr.length;
}

function isNumeric(n) {
  return typeof n === "number" && !isNaN(n);
}

module.exports = mahalanobis;
