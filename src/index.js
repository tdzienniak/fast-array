const alloc = (size, fillValue) => {
  const arr = new Array(size);

  for (let i = 0; i < size; i++) {
    arr[i] = fillValue;
  }

  return arr;
};

const fastArrayPrototype = {
  extend(extensionSize) {
    const oldLength = this.maxLength;

    this.arr.length = oldLength + extensionSize;

    for (let i = oldLength, newLength = this.maxLength = this.arr.length; i < newLength; i++) {
      this.arr[i] = this.fillValue;
    }

    return this;
  },
  removeAtIndex(index) {
    if (index < 0 || index >= this.currentLength) {
      throw new Error('index is out of array bounds');
    }

    const removedValue = this.arr[index];

    let i = index;
    while (i < this.currentLength) {
      this.arr[i] = this.arr[++i];
    }

    this.currentLength--;

    return removedValue;
  },
  unsetAtIndex(index) {
    if (index < 0 || index >= this.currentLength) {
      throw new Error('index is out of array bounds');
    }

    const unsetValue = this.arr[index];

    this.arr[index] = this.fillValue;

    this.sparse = true;

    return unsetValue;
  },
  findAndRemove(value) {
    const index = this.indexOf(value);

    if (index !== -1) {
      this.removeAtIndex(index);
    }

    return index;
  },
  findAndUnset(value) {
    const index = this.indexOf(value);

    if (index !== -1) {
      this.unsetAtIndex(index);
    }

    return index;
  },
  indexOf(value) {
    for (let i = 0; i < this.currentLength; i++) {
      if (this.arr[i] === value) {
        return i;
      }
    }

    return -1;
  },
  clear() {
    for (let i = 0; i < this.currentLength; i++) {
      this.arr[i] = this.fillValue;
    }

    return this;
  },
  push(value) {
    if (value === this.fillValue) {
      throw new Error('cannot push value equal to `fillValue`');
    }

    if (this.currentLength === this.maxLength) {
      this.extend(Math.round(this.maxLength * this.extensionFactor));
    }

    this.arr[this.currentLength++] = value;

    return this;
  },
  shift() {
    return this.removeAtIndex(0);
  },
  pop() {
    if (this.currentLength === 0) {
      return undefined;
    }

    const popped = this.arr[--this.currentLength];

    this.arr[this.currentLength] = this.fillValue;

    return popped;
  },
  compact() {
    if (this.sparse) {
      let gapLength = 0;

      for (let i = 0; i < this.currentLength; i++) {
        if (this.arr[i] === this.fillValue) {
          gapLength++;
        } else if (gapLength > 0) {
          this.arr[i - gapLength] = this.arr[i];

          this.arr[i] = this.fillValue;
        }
      }

      this.currentLength -= gapLength;
      this.sparse = false;
    }

    return this;
  },
};

export const FastArray = ({
  fillValue = 0,
  initialSize = 1000,
  refillRemoved = true,
  extensionFactor = 1.5,
} = {}) => {
  const fa = Object.create(fastArrayPrototype);

  fa.fillValue = fillValue;
  fa.initialSize = initialSize;
  fa.refillRemoved = refillRemoved;
  fa.extensionFactor = extensionFactor;
  fa.sparse = false;
  fa.arr = alloc(initialSize, fillValue);
  fa.currentLength = 0;
  fa.maxLength = initialSize;

  return fa;
};
