var add = function(a,b) {
  return a + b;
};

var sub = function(a,b) {
    return a - b;
};

var mul = function(a,b) {
    return a * b;
};

var identityf = function(x) {
    return function() {
        return x;
    }
};

var addf = function(x) {
    return function(y) {
        return x + y;
    }
};

var liftf = function(binaryFunction) {
    return function(x) {
        return function(y) {
            return binaryFunction(x,y);
        }
    }
};