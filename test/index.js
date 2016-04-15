import test from 'tape';
import { FastArray } from '../src';

test('alloc', t => {
  const fa = FastArray();

  t.equal(fa.length, 0, 'length of fresh array should be 0');
  t.equal(fa.maxLength, 1000, 'maxLength should default to 1000');
  t.equal(fa.arr.length, 1000, 'actual array length should equal maxLength');

  t.end();
});

test('push', t => {
  const fa = FastArray({
    initialSize: 5,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);

  t.deepEqual(fa.arr, [1, 2, 3, 0, 0], 'pushed values should be inserted one after another');
  t.equal(fa.length, 3, 'length should be equal to number of pushed values');

  t.end();
});

test('pop', t => {
  const fa = FastArray({
    initialSize: 5,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);

  const popped = fa.pop();

  t.equal(popped, 3, 'popped value should be equal to last pushed value');
  t.deepEqual(fa.arr, [1, 2, 0, 0, 0], 'popped element should be removed from array');
  t.equal(fa.length, 2, 'length should be changed accordingly');

  t.end();
});

test('removeAtIndex', t => {
  const fa = FastArray({
    initialSize: 5,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);

  const removed = fa.removeAtIndex(1);

  t.equal(removed, 2, 'method should return removed value');
  t.deepEqual(fa.arr, [1, 3, 0, 0, 0], 'values should be shifted to close the gap');
  t.equal(fa.length, 2, 'length should be changed accordingly');

  t.end();
});

test('unsetAtIndex', t => {
  const fa = FastArray({
    initialSize: 5,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);

  const wasSparseBeforeUnset = fa.sparse;
  const unset = fa.unsetAtIndex(1);

  t.equal(unset, 2, 'method should return unset value');
  t.equal(fa.arr[1], fa.fillValue, 'unset index should be filled with `fillValue`');
  t.deepEqual(fa.arr, [1, 0, 3, 0, 0], 'positions of other elements should not change');
  t.equal(fa.length, 3, 'length should not change');
  t.ok(fa.sparse && !wasSparseBeforeUnset, 'array should be marked as sparse');

  t.end();
});

test('compact', t => {
  const fa = FastArray({
    initialSize: 10,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);
  fa.push(4);
  fa.push(5);
  fa.push(6);
  fa.push(7);
  fa.push(8);
  fa.push(9);

  fa.unsetAtIndex(0);
  fa.unsetAtIndex(2);
  fa.unsetAtIndex(4);
  fa.unsetAtIndex(5);
  fa.unsetAtIndex(8);

  const wasSparseBeforeCompact = fa.sparse;

  fa.compact();

  t.deepEqual(fa.arr, [2, 4, 7, 8, 0, 0, 0, 0, 0, 0], 'array should be compacted and filled');
  t.ok(!fa.sparse && wasSparseBeforeCompact, 'array should be dense again');
  t.equal(fa.length, 4, 'length should be changed accordingly');

  t.end();
});

test('indexOf', t => {
  const fa = FastArray({
    initialSize: 10,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);
  fa.push(3);

  t.equal(fa.indexOf(4), -1, 'should not find value');
  t.equal(fa.indexOf(2), 1, 'should find value');
  t.equal(fa.indexOf(3), 2, 'should find first occurance of value');

  t.end();
});

test('find', t => {
  const fa = FastArray({
    initialSize: 10,
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);
  fa.push(4);

  const found = fa.find(el => el === 2);
  const notFound = fa.find(el => el === 5);

  t.equal(found, 2, 'should find value');
  t.equal(notFound, undefined, 'should not find value');

  t.end();
});
