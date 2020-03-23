(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.mahalanobis = factory());
}(this, (function () { 'use strict';

  function mean(arr) {
    return sum(arr) / arr.length;
  }

  function sum(arr) {
    return arr.reduce(function(a, b) {
      return a + b;
    });
  }

  function isNumeric(n) {
    return typeof n === "number" && !isNaN(n);
  }

  function dot(a, b) {
    if (a.length !== b.length) {
      throw new TypeError("Vectors are of different sizes");
    }

    return sum(
      a.map(function(x, i) {
        return x * b[i];
      })
    );
  }

  function multiply(a, b) {
    var aSize = a.every(isNumeric) ? 1 : a.length,
      bSize = b.every(isNumeric) ? 1 : b.length;

    if (aSize === 1) {
      if (bSize === 1) {
        return dot(a, b);
      }
      return b.map(function(row) {
        return dot(a, row);
      });
    }

    if (bSize === 1) {
      return a.map(function(row) {
        return dot(row, b);
      });
    }

    return a.map(function(x) {
      return transpose(b).map(function(y) {
        return dot(x, y);
      });
    });
  }

  function transpose(matrix) {
    return matrix[0].map(function(d, i) {
      return matrix.map(function(row) {
        return row[i];
      });
    });
  }

  function cov(columns, means) {
    return columns.map(function(c1, i) {
      return columns.map(function(c2, j) {
        var terms = c1.map(function(x, k) {
          return (x - means[i]) * (c2[k] - means[j]);
        });

        return sum(terms) / (c1.length - 1);
      });
    });
  }

  function invert(matrix) {
    var size = matrix.length,
      base,
      swap,
      augmented;

    // Augment w/ identity matrix
    augmented = matrix.map(function(row, i) {
      return row.slice(0).concat(
        row.slice(0).map(function(d, j) {
          return j === i ? 1 : 0;
        })
      );
    });

    // Process each row
    for (var r = 0; r < size; r++) {
      base = augmented[r][r];

      // Zero on diagonal, swap with a lower row
      if (!base) {
        for (var rr = r + 1; rr < size; rr++) {
          if (augmented[rr][r]) {
            // swap
            swap = augmented[rr];
            augmented[rr] = augmented[r];
            augmented[r] = swap;
            base = augmented[r][r];
            break;
          }
        }

        if (!base) {
          throw new RangeError("Matrix not invertable.");
        }
      }

      // 1 on the diagonal
      for (var c = 0; c < size * 2; c++) {
        augmented[r][c] = augmented[r][c] / base;
      }

      // Zeroes elsewhere
      for (var q = 0; q < size; q++) {
        if (q !== r) {
          base = augmented[q][r];

          for (var p = 0; p < size * 2; p++) {
            augmented[q][p] -= base * augmented[r][p];
          }
        }
      }
    }

    return augmented.map(function(row) {
      return row.slice(size);
    });
  }

  function mahalanobis(data) {
    if (!Array.isArray(data) || !data.length) {
      throw new TypeError("Argument must be a non-empty array.");
    }

    data.forEach(function(d) {
      if (
        !Array.isArray(d) ||
        d.length !== data[0].length ||
        !d.every(isNumeric)
      ) {
        throw new TypeError(
          "Argument be an array of arrays of numbers, all the same length."
        );
      }
    });

    if (data.length <= data[0].length) {
      throw new RangeError(
        "Data must have more observations (rows) than features (columns) to compute covariance. Currently has " +
          data.length +
          " observations, " +
          data[0].length +
          " features."
      );
    }

    var columns = transpose(data),
      means = columns.map(mean),
      invertedCovariance = invert(cov(columns, means));

    var distance = function(row) {
      var deltas = row.map(function(d, i) {
        return d - means[i];
      });

      return Math.sqrt(multiply(multiply(deltas, invertedCovariance), deltas));
    };

    return {
      all: function() {
        return data.map(distance);
      },
      distance: distance
    };
  }

  return mahalanobis;

})));
