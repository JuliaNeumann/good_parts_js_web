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
//console.log(addf(3)(4));

var liftf = function(binaryFunction) {
    return function(x) {
        return function(y) {
            return binaryFunction(x,y);
        }
    }
};
//console.log(lift(add(3)(4));

var curry = function(binaryFunction, firstArgument) {
    return function(secondArgument) {
        return binaryFunction(firstArgument, secondArgument);
    }
};
//console.log(curry(add,3)(4));

var inc = addf(1);
var inc = liftf(add)(1);
var inc = curry(add, 1);
// console.log(inc(5));
// console.log(inc(inc(5)));

var twice = function(binaryFunction) {
    return function(doubleArgument) {
        return binaryFunction(doubleArgument, doubleArgument);
    }
};
var doubl = twice(add);
var square = twice(mul);
// console.log(doubl(11));
// console.log(square(11));

var reverse = function(binaryFunction) {
    return function(firstArgument, secondArgument) {
        return binaryFunction(secondArgument, firstArgument);
    }
};
// console.log(reverse(sub)(3,2));

var composeu = function(unaryFunc1, unaryFunc2) {
    return function(argument) {
        return unaryFunc2(unaryFunc1(argument));
    }
};
// console.log(composeu(doubl, square)(5));

var composeb = function(binaryFunc1, binaryFunc2) {
    return function(arg1, arg2, arg3) {
        return binaryFunc2(binaryFunc1(arg1, arg2), arg3);
    }
};
// console.log(composeb(add, mul)(2,3,7));

var limit = function(binaryFunc, limit) {
    var countCalled = 0;
    return function(arg1, arg2) {
        if (countCalled < limit) {
            countCalled++;
            return binaryFunc(arg1, arg2);
        }
        return undefined;
    }
};

var addLimited = limit(add, 1);
// console.log(addLimited(3,4));
// console.log(addLimited(3,5));

var from = function(start) {
    return function() {
        return start++;
    }
};
var index = from(0);
// console.log(index());
// console.log(index());
// console.log(index());

var to = function(generator, limit) {
    return function() {
        var result = generator();
        if (result < limit) {
            return result;
        }
        return undefined;
    }
};
var index = to(from(1), 3);
// console.log(index());
// console.log(index());
// console.log(index());

var fromTo = function(start, end) {
    return to(from(start), end);
};
var index = fromTo(1,3);
// console.log(index());
// console.log(index());
// console.log(index());

var element = function(arr, generator) {
    return function() {
        var index = generator();
        if (index !== undefined) {
            return arr[index];
        }
        return undefined;
    }
};
var ele = element(['a', 'b', 'c', 'd'], fromTo(1,3));
// console.log(ele());
// console.log(ele());
// console.log(ele());

var element = function(arr, generator) {
    var fallbackIndex = 0;
    return function() {
        var index = (generator === undefined) ? fallbackIndex++ : generator();
        if (index !== undefined && index < arr.length) {
            return arr[index];
        }
        return undefined;
    }
};
var ele = element(['a', 'b', 'c', 'd']);
// console.log(ele());
// console.log(ele());
// console.log(ele());
// console.log(ele());
// console.log(ele());

var collect = function(generator, array) {
    return function() {
        var generated = generator();
        if (generated !== undefined) {
            array.push(generated);
        }
        return generated;
    }
};
var array = [];
var col = collect(fromTo(0, 2), array);
// console.log(col());
// console.log(col());
// console.log(col());
// console.log(array);

var filter = function(generator, predicate) {
    return function() {
        var generated = generator();
        while (!predicate(generated)) {
            if (generated === undefined) {
                break;
            }
            generated = generator();
        }
        return generated;
    }
};
var fil = filter(fromTo(0, 5), function third(value){
    return (value % 3) === 0;
});
// console.log(fil());
// console.log(fil());
// console.log(fil());

var concat = function(generator1, generator2) {
    return function() {
        var value1 = generator1();
        return (value1 === undefined) ? generator2() : value1;
    }
};
var con = concat(fromTo(0,3), fromTo(0,2));
// console.log(con());
// console.log(con());
// console.log(con());
// console.log(con());
// console.log(con());
// console.log(con());
// console.log(con());

var gensymf = function(prefix) {
    var counter = 1;
    return function() {
        return prefix + counter++;
    }
};
var geng = gensymf('G');
var genh = gensymf('H');
// console.log(geng());
// console.log(genh());
// console.log(geng());
// console.log(genh());

var fibonaccif = function(first, second) {
    var counter = 1;
    return function() {
        if (counter === 1) {
            counter++;
            return first;
        }
        if (counter === 2) {
            counter++;
            return second;
        }
        var newFirst = second;
        var newSecond = first + second;
        first = newFirst;
        second = newSecond;
        return second;
    }
}
var fib = fibonaccif(0, 1);
// console.log(fib());
// console.log(fib());
// console.log(fib());
// console.log(fib());
// console.log(fib());
// console.log(fib());
// console.log(fib());

var counter = function(initial) {
    return {
        up: function() {
            return ++initial;
        },
        down: function() {
            return --initial;
        }
    }
}
var object = counter(10);
var up = object.up;
var down = object.down;
// console.log(up());
// console.log(down());
// console.log(down());
// console.log(up());

var revocable = function(binaryFunc) {
    var allowed = true;
    return {
        invoke: function(firstArg, secondArg){
            if (allowed) {
                return binaryFunc(firstArg, secondArg);
            }
        },
        revoke: function() {
            allowed = false;
        }
    }
}
var rev = revocable(add);
var add_rev = rev.invoke;
console.log(add_rev(3, 4));
rev.revoke();
console.log(add_rev(5, 7));