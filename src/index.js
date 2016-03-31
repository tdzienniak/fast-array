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
        var oldLength = this.maxLength

        this.arr.length = oldLength + extensionSize

        for (var i = oldLength, newLength = this.maxLength = this.arr.length; i < newLength; i++) {
            this.arr[i] = this.fillValue
        }

        return this
    },
    removeAtIndex: function (index) {
        if (this.currentLength === 0) {
            return
        }

        var removedValue = this.arr[index]

        this.currentLength--

        while (index < this.currentLength) {
            this.arr[index] = this.arr[++index]
        }

        if (this.refillRemoved) {
            this.arr[this.currentLength - 1] = this.fillValue
        }

        return removedValue
    },
    unsetAtIndex: function (index) {
        var unsetValue = this.arr[index]

        this.arr[index] = this.fillValue

        this.sparse = true;

        return unsetValue
    },
    findAndRemove: function (value) {
        var index = this.indexOf(value)

        if (index !== -1) {
            this.removeAtIndex(index)
        }

        return index
    },
    findAndUnset: function (value) {
        var index = this.indexOf(value)

        if (index !== -1) {
            this.unsetAtIndex(index)
        }

        return index
    },
    indexOf: function (value) {
        for (var i = 0; i < this.currentLength; i++) {
            if (this.arr[i] === value) {
                return i
            }
        }

        return -1;
    },
    clear: function () {
        for (var i = 0; i < this.currentLength; i++) {
            this.arr[i] = this.fillValue
        }

        return this
    },
    push: function (value) {
        if (this.currentLength === this.maxLength) {
            this.extend(Math.round(this.maxLength * this.extensionFactor))
        }

        this.arr[this.currentLength++] = value

        return this
    },
    pop: function () {
        return this.arr[--this.currentLength]
    },
    compact: function () {
        if (!this.sparse) {
            return this
        }

        var gapLength = 0

        for (var i = 0; i < this.currentLength; i++) {
            if (this.arr[i] === this.fillValue) {
                gapLength++
            } else if (gapLength > 0) {
                this.arr[i - gapLength] = this[i]
            }
        }

        this.sparse = false
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

    fa.sparse = false;
    fa.arr = alloc(fa.initialSize)
    fa.currentLength = 0;
    fa.maxLength = fa.initialSize;

    return fa;
}

module.exports = FastArray;
