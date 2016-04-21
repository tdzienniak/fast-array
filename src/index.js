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
  insertAtIndex(index, value) {
    if (index > this.maxLength - 1) {
      this.extend(index - this.maxLength + 1);
    }

    this.arr[index] = value;

    if (index > this.length) {
      this.length = index + 1;
    }
  },
  removeAtIndex(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('index is out of array bounds');
    }

    const removedValue = this.arr[index];

    let i = index;
    while (i < this.length) {
      this.arr[i] = this.arr[++i];
    }

    this.length--;

    return removedValue;
  },
  unsetAtIndex(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('index is out of array bounds');
    }

    const unsetValue = this.arr[index];

    this.arr[index] = this.fillValue;

    this.sparse = true;

    return unsetValue;
  },
  find(fn) {
    for (let i = 0; i < this.length; i++) {
      if (fn(this.arr[i])) {
        return this.arr[i];
      }
    }

    return void 0;
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
    for (let i = 0; i < this.length; i++) {
      if (this.arr[i] === value) {
        return i;
      }
    }

    return -1;
  },
  clear() {
    for (let i = 0; i < this.length; i++) {
      this.arr[i] = this.fillValue;
    }

    return this;
  },
  push(value) {
    if (value === this.fillValue) {
      throw new Error('cannot push value equal to `fillValue`');
    }

    if (this.length === this.maxLength) {
      this.extend(Math.round(this.maxLength * this.extensionFactor));
    }

    this.arr[this.length++] = value;

    return this;
  },
  shift() {
    return this.removeAtIndex(0);
  },
  pop() {
    if (this.length === 0) {
      return undefined;
    }

    const popped = this.arr[--this.length];

    this.arr[this.length] = this.fillValue;

    return popped;
  },
  compact() {
    if (this.sparse) {
      let gapLength = 0;

      for (let i = 0; i < this.length; i++) {
        if (this.arr[i] === this.fillValue) {
          gapLength++;
        } else if (gapLength > 0) {
          this.arr[i - gapLength] = this.arr[i];

          this.arr[i] = this.fillValue;
        }
      }

      this.length -= gapLength;
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
  fa.length = 0;
  fa.maxLength = initialSize;

  return fa;
};

export default FastArray;
