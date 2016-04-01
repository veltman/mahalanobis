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

  var columns = math.transpose(data);

  var invertedCovariance = math.inv(cov(columns));

  var means = columns.map(function(column){
    return math.mean(column);
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

function isNumeric(n) {
  return typeof n === "number" && !isNaN(n);
}

module.exports = mahalanobis;
