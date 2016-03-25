var defaults = require('lodash.defaults')

function alloc(size, fillValue) {
    fillValue = fillValue !== void 0 ? fillValue : 0

    var arr = new Array(size)

    for (var i = 0; i < size; i++) {
        arr[i] = 0
    }

    return arr
}

var fastArrayPrototype = {
    extend: function (extensionSize) {
        var arr = this.arr
        var oldLength = this.maxLength
        var fillValue = this.fillValue

        arr.length = oldLength + extensionSize

        for (var i = oldLength, newLength = this.maxLength = arr.length; i < newLength; i++) {
            arr[i] = fillValue
        }

        return this;
    },
    removeAtIndex: function (index) {
        var arr = this.arr
        var currentLength = this.currentLength

        if (currentLength === 0) {
            return
        }

        while (index < currentLength - 1) {
            arr[index] = arr[++index]
        }

        this.currentLength = --currentLength

        if (this.refillRemoved) {
            arr[currentLength - 1] = this.fillValue
        }

        return this;
    },
    indexOf: function (value) {
        var arr = this.arr
        var currentLength = this.currentLength

        for (var i = 0; i < currentLength; i++) {
            if (arr[i] === value) {
                return i
            }
        }

        return -1;
    },
    clear: function () {
        var arr = this.arr
        var currentLength = this.currentLength
        var fillValue = this.fillValue

        for (var i = 0; i < currentLength; i++) {
            arr[i] = fillValue
        }

        return this;
    },
    push: function (value) {
        if (this.currentLength === this.maxLength) {
            this.extend(Math.round(this.maxLength * this.extensionFactor))
        }

        this.arr[this.currentLength++] = value

        return this;
    }
};

function FastArray(opts) {
    var fa = Object.create(fastArrayPrototype)

    defaults(fa, opts, {
        fillValue: 0,
        initialSize: 1000,
        refillRemoved: true,
        extensionFactor: 1.5
    });

    fa.arr = alloc(fa.initialSize)
    fa.currentLength = 0;
    fa.maxLength = fa.initialSize;

    return fa;
}

module.exports = FastArray;
