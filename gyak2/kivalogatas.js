"use strict";

//var, let, const

const szamok = [10, 14, 32, 11, -10, -1, 50, 30];

function kivalogatas(arr, tulFn) {
    const result = [];

    for (let i = 0; i < arr.length; i++) {
        if (tulFn(arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}

function negativE(p) {
    return p < 0;
}

function pozitivE(p) {
    return p > 0;
}

console.log(kivalogatas(szamok, negativE));
console.log(kivalogatas(szamok, function negativE(p) {
    return p < 0;
}));

console.log(szamok.filter(negativE));

console.log(szamok.filter(function (p) {
    return p < 0;
}) );


console.log(szamok.filter(p => p < 0));


