function dot(a, b) {
  if (a.length !== b.length) {
    throw new TypeError("Vectors are of different sizes");
  }

  return sum(a.map(function(x, i){
    return x * b[i];
  }));
}

function multiply(a, b) {

  var aSize = a.every(isNumeric) ? 1 : a.length,
      bSize = b.every(isNumeric) ? 1 : b.length;

  if (aSize === 1) {
    if (bSize === 1) {
      return dot(a, b);
    }
    return b.map(function(row){
      return dot(a, row);
    });
  }

  if (bSize === 1) {
    return a.map(function(row){
      return dot(row, b);
    });
  }

  return a.map(function(x){
    return transpose(b).map(function(y){
      return dot(x, y);
    });
  });

}

function invert(matrix) {

  var size = matrix.length,
      base,
      swap,
      augmented;

  // Augment w/ identity matrix
  augmented = matrix.map(function(row,i){
    return row.slice(0).concat(row.slice(0).map(function(d,j){
      return j === i ? 1 : 0;
    }));
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

  return augmented.map(function(row){
    return row.slice(size);
  });

}

function transpose(matrix) {

  return matrix[0].map(function(d, i){

    return matrix.map(function(row){
      return row[i];
    });

  });

}


function cov(columns, means) {

  return columns.map(function(c1, i){
    return columns.map(function(c2, j){

      var terms = c1.map(function(x, k){
        return (x - means[i]) * (c2[k] - means[j]);
      });

      return sum(terms) / (c1.length - 1);
    });
  });

}


export function mean(arr) {
  return sum(arr) / arr.length;
}

export function sum(arr) {
  return arr.reduce(function(a, b){
    return a + b;
  });
}

export function isNumeric(n) {
  return typeof n === "number" && !isNaN(n);
}
