import test from 'tape';
import { FastArray } from '../src';

test('alloc', t => {
  const fa = FastArray();

  t.equal(fa.currentLength, 0, 'currentLength of fresh array should be 0');
  t.equal(fa.maxLength, 1000, 'maxLength should default to 1000');
  t.equal(fa.arr.length, 1000, 'actual array length should equal maxLength');

  t.end();
});

test('push', t => {
  const fa = FastArray({
    initialSize: 5
  });

  fa.push(1);
  fa.push(2);
  fa.push(3);

  t.deepEqual(fa.arr, [1, 2, 3, 0, 0], 'pushed values should be inserted one after another');
  t.equal(fa.currentLength, 3, 'currentLength should be equal to number of pushed values');

  t.end();
});
