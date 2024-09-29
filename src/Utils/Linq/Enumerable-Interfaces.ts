import { IEnumerable } from "./IEnumerable";
import { Enumerable } from "./Enumerable";

export interface IDisposableEnumerable<T> extends IEnumerable<T> {
  dispose(): void;
}

export type PredicateFn<T> = (element: T, index: number) => boolean;
export type TypePredicateFn<T, TOther extends T> = (element: T, index: number) => element is TOther;
export const TrueFn = () => true;

/**
 * Checks if the provided object is an iterable.
 * An iterable is an object that implements the `Symbol.iterator` method,
 * which returns an iterator object that conforms to the iterator protocol.
 *
 * @template T - The type of elements in the iterable.
 * @param obj - The object to be checked.
 * @returns `true` if the object is iterable, `false` otherwise.
 *
 * @example
 * const array = [1, 2, 3];
 * console.log(isIterable(array)); // Output: true
 *
 * const obj = { a: 1, b: 2 };
 * console.log(isIterable(obj)); // Output: false
 *
 * const string = "Hello";
 * console.log(isIterable(string)); // Output: true
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIterable<T>(obj: any): obj is Iterable<T> {
  return !!obj && typeof obj[Symbol.iterator] === "function";
}
/**
 * Checks if the provided object is an iterator.
 * An iterator is an object that implements the `next` method,
 * which returns an object with a `value` property and a `done` property.
 * The `value` property represents the current value in the iteration,
 * and the `done` property is a boolean indicating whether the iteration has completed.
 *
 * @template T - The type of elements in the iterator.
 * @param obj - The object to be checked.
 * @returns `true` if the object is an iterator, `false` otherwise.
 *
 * @example
 * const array = [1, 2, 3];
 * const iterator = array[Symbol.iterator]();
 * console.log(isIterator(iterator)); // Output: true
 *
 * const obj = { a: 1, b: 2 };
 * console.log(isIterator(obj)); // Output: false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIterator<T>(obj: any): obj is Iterator<T> {
  return !!obj && typeof obj.next === "function";
}
/**
 * Checks if the provided object is array-like.
 * An array-like object is an object that has a numeric `length` property and can be indexed using array-style syntax.
 *
 * @template T - The type of elements in the array-like object.
 * @param obj - The object to be checked.
 * @returns `true` if the object is array-like, `false` otherwise.
 *
 * @example
 * const array = [1, 2, 3];
 * console.log(isArrayLike(array)); // Output: true
 *
 * const obj = { a: 1, b: 2 };
 * console.log(isArrayLike(obj)); // Output: false
 *
 * const string = "Hello";
 * console.log(isArrayLike(string)); // Output: false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArrayLike<T>(obj: any): obj is ArrayLike<T> {
  return !!obj && typeof obj.length === "number" && Number.isInteger(obj.length);
}
export function getIterable<T>(sourceObj: EnumeratorLike<T>): Iterable<T> {
  return isIterable(sourceObj)
    ? sourceObj
    : isArrayLike(sourceObj)
    ? (function* () {
        for (let i = 0; i < sourceObj.length; i++) {
          yield sourceObj[i];
        }
      })()
    : (function* () {
        let obj: IteratorResult<T>;
        while ((obj = sourceObj.next())) {
          if (obj.done) yield obj.value;
          else break;
        }
      })();
}
export type EnumeratorLike<T> = IEnumerable<T> | Iterable<T> | T[] | Iterator<T> | ArrayLike<T>;
export function from<T>(obj: IEnumerable<T>): IEnumerable<T>;
export function from<T>(obj: T[]): IEnumerable<T>;
/**
 * Creates an Enumerable from an iterator.
 *
 * This function takes an iterator object and returns an Enumerable that can be used for further processing or iteration.
 *
 * @template T - The type of elements in the Enumerable.
 * @param obj - The iterator object to create an Enumerable from.
 * @returns An Enumerable that generates elements from the input iterator object.
 *
 * @example
 * const iterator = {
 *   [Symbol.iterator]() {
 *     let i = 0;
 *     return {
 *       next() {
 *         return i < 3 ? { value: i++, done: false } : { done: true };
 *       },
 *     };
 *   },
 * };
 * const enumerable = from(iterator);
 * for (const number of enumerable) {
 *   console.log(number); // Output: 0, 1, 2
 * }
 */
export function from<T>(obj: Iterator<T>): IEnumerable<T>;
/**
 * Creates an Enumerable from an iterable object.
 *
 * This function takes an iterable object and returns an Enumerable that can be used for further processing or iteration.
 *
 * @template T - The type of elements in the Enumerable.
 * @param obj - The iterable object to create an Enumerable from.
 * @returns An Enumerable that generates elements from the input iterable object.
 *
 * @example
 * const array = [1, 2, 3];
 * const enumerable = from(array);
 * for (const number of enumerable) {
 *   console.log(number); // Output: 1, 2, 3
 * }
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * const enumerable = from(Object.values(obj));
 * for (const value of enumerable) {
 *   console.log(value); // Output: 1, 2
 * }
 */
export function from<T>(obj: Iterable<T>): IEnumerable<T>;
/**
 * Creates an Enumerable from an array-like object.
 *
 * This function takes an object that has a numeric `length` property and can be indexed using array-style syntax,
 * and returns an Enumerable that can be used for further processing or iteration.
 *
 * @template T - The type of elements in the Enumerable.
 * @param obj - The array-like object to create an Enumerable from.
 *   It should have a numeric `length` property and support indexing with array-style syntax.
 * @returns An Enumerable that generates elements from the input array-like object.
 *
 * @example
 * // Create an Enumerable from an array-like object
 * const arrayLike = { length: 3, 0: 'a', 1: 'b', 2: 'c' };
 * const enumerable = from(arrayLike);
 * for (const letter of enumerable) {
 *   console.log(letter); // Output: a, b, c
 * }
 */
export function from<T>(obj: { length: number; [x: number]: T }): IEnumerable<T>;
/**
 * Creates an Enumerable from an input object, such as an array, iterable, iterator, or array-like object.
 * The function handles different types of input objects and returns an Enumerable that can be used for
 * further processing or iteration.
 *
 * @template T - The type of elements in the Enumerable.
 * @param obj - The input object to create an Enumerable from.
 *   It can be an array, iterable, iterator, or array-like object.
 * @returns An Enumerable that generates elements from the input object.
 *
 * @example
 * // Create an Enumerable from an array
 * const array = [1, 2, 3];
 * const enumerable = from(array);
 * for (const number of enumerable) {
 *   console.log(number); // Output: 1, 2, 3
 * }
 *
 * @example
 * // Create an Enumerable from an iterable object
 * const iterable = {
 *   [Symbol.iterator]() {
 *     let i = 0;
 *     return {
 *       next() {
 *         return i < 3 ? { value: i++, done: false } : { done: true };
 *       },
 *     };
 *   },
 * };
 * const enumerable = from(iterable);
 * for (const number of enumerable) {
 *   console.log(number); // Output: 0, 1, 2
 * }
 *
 * @example
 * // Create an Enumerable from an iterator object
 * const iterator = {
 *   next() {
 *     return { value: Math.random(), done: false };
 *   },
 * };
 * const enumerable = from(iterator);
 * for (const number of enumerable) {
 *   console.log(number); // Output: Random numbers
 * }
 *
 * @example
 * // Create an Enumerable from an array-like object
 * const arrayLike = { length: 3, 0: 'a', 1: 'b', 2: 'c' };
 * const enumerable = from(arrayLike);
 * for (const letter of enumerable) {
 *   console.log(letter); // Output: a, b, c
 * }
 */
export function from<T>(obj: EnumeratorLike<T>): IEnumerable<T>;
export function from<T>(obj: EnumeratorLike<T>): IEnumerable<T> {
  return new Enumerable(getIterable(obj));
}
/**
 * Creates an Enumerable that generates a sequence of numbers within a specified range.
 *
 * @param start - The starting value of the range. The generated sequence will include this value.
 * @param count - The number of elements to generate in the sequence.
 * @param step - The increment between each element in the sequence. Default value is 1.
 * @returns An Enumerable that generates a sequence of numbers within the specified range.
 *
 * @example
 * // Generate a sequence of numbers from 0 to 9 with a step of 1
 * const numbers = range(0, 10);
 * for (const number of numbers) {
 *   console.log(number); // Output: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
 * }
 *
 * @example
 * // Generate a sequence of numbers from 5 to 15 with a step of 2
 * const evenNumbers = range(5, 6, 2);
 * for (const number of evenNumbers) {
 *   console.log(number); // Output: 5, 7, 9, 11, 13, 15
 * }
 */
export function range(start: number, count: number, step: number = 1): IEnumerable<number> {
  return new Enumerable(
    (function* (start, count, step) {
      for (let i = 0; i < count; i++) {
        yield (start += step);
      }
    })(start, count, step ?? 1)
  );
}
/**
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hashCode(obj: string | any): number {
  const s = typeof obj === "string" ? obj : hashString(obj);
  let h = 0,
    i = 0;
  const l = s.length;
  if (l > 0) while (i < l) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasToString(obj: any): obj is { toString(): string } {
  return !!obj && typeof obj.toString === "function";
}
/**
 * Converts an object to a string representation for hashing purposes.
 * If the object has a `toString` method, it will be used.
 * If the object is `null` or `undefined`, their respective string representations will be returned.
 * For all other objects, the JSON.stringify method will be used.
 *
 * @param obj - The object to be converted to a string.
 * @returns A string representation of the object.
 *
 * @example
 **/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hashString(obj: any): string {
  return obj === null ? "null" : obj === undefined ? "undefined" : hasToString(obj) ? obj.toString() : JSON.stringify(obj);
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

/**
 * Returns an empty Enumerable of the specified type.
 *
 * This function is useful when you need to create an empty Enumerable for chaining purposes,
 * or when you want to represent an absence of data.
 *
 * @template T - The type of elements in the Enumerable.
 * @returns An empty Enumerable of type T.
 *
 * @example
 */
export function empty<T>(): IEnumerable<T> {
  return new Enumerable<T>([]);
}
/**
 * Creates an Enumerable that produces a specified number of repetitions of a single element.
 *
 * @template T - The type of elements in the Enumerable.
 * @param element - The element to repeat.
 * @param count - The number of times to repeat the element. If not provided, the Enumerable will repeat indefinitely.
 * @returns An Enumerable that produces the specified number of repetitions of the given element.
 *
 * @example
 **/
export function repeat<T>(element: T, count?: number): IEnumerable<T> {
  return new Enumerable(
    (function* (element, count) {
      for (let i = 0; i < (count ?? Infinity); i++) {
        yield element;
      }
    })(element, count)
  );
}
/**
 * Creates an Enumerable that generates a sequence of elements by invoking a specified generator function.
 *
 * @template T - The type of elements in the Enumerable.
 * @param func - A generator function that produces elements one at a time.
 * @param count - The maximum number of elements to generate. If not provided, the Enumerable will generate elements indefinitely.
 * @returns An Enumerable that generates elements by invoking the specified generator function.
 *
 * @example
 * // Generate a sequence of random numbers
 * const randomNumbers = generate(() => Math.random(), 10);
 * for (const number of randomNumbers) {
 *   console.log(number);
 * }
 *
 * @example
 * // Generate a sequence of strings by repeating a given string
 * const repeatingStrings = generate(() => "Hello", 5);
 * for (const str of repeatingStrings) {
 *   console.log(str);
 * }
 */
export function generate<T>(func: () => T, count?: number): IEnumerable<T> {
  return new Enumerable(
    (function* (func, count) {
      for (let i = 0; i < (count ?? Infinity); i++) {
        yield func();
      }
    })(func, count)
  );
}
/**
 * Creates an Enumerable that generates a sequence of elements by applying a function to an initial seed value.
 * The function is applied repeatedly to produce subsequent elements, and the process stops when the function returns `undefined`.
 *
 * @template T - The type of elements in the Enumerable.
 * @param seed - The initial value to start the generation process.
 * @param func - A function that takes the current seed value and returns the next seed value.
 *   The function should return `undefined` to stop the generation process.
 * @returns An Enumerable that generates elements by applying the specified function to the seed value.
 *
 * @example
 * // Generate a sequence of numbers by repeatedly incrementing a seed value
 * const numbers = unfold(0, (value) => value < 10 ? value + 1 : undefined);
 * for (const number of numbers) {
 *   console.log(number); // Output: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
 * }
 *
 * @example
 * // Generate a sequence of strings by repeatedly appending a character to a seed value
 * const strings = unfold("a", (value) => value.length < 5 ? value + "b" : undefined);
 * for (const str of strings) {
 *   console.log(str); // Output: a, ab, abb, abbb, abbbb
 * }
 */
export function unfold<T>(seed: T, func: (value: T) => T | undefined): IEnumerable<T> {
  return new Enumerable(
    (function* (seed, func) {
      yield seed;
      while (true) {
        const next = func(seed);
        if (next === undefined) break;
        yield next;
        seed = next;
      }
    })(seed, func)
  );
}

// export function choice<T>(...params: T[]): IEnumerable<T>;
// export function cycle<T>(...params: T[]): IEnumerable<T>;
// export function make<T>(element: T): IEnumerable<T>;
// export function matches<T>(input: string, pattern: RegExp): IEnumerable<T>;
// export function matches<T>(input: string, pattern: string, flags?: string): IEnumerable<T>;
// export function range(start: number, count: number, step?: number): IEnumerable<number>;
// export function rangeDown(start: number, count: number, step?: number): IEnumerable<number>;
// export function rangeTo(start: number, to: number, step?: number): IEnumerable<number>;
// export function repeatWithFinalize<T>(initializer: () => T, finalizer: (element: T) => void): IEnumerable<T>;
// export function toInfinity(start?: number, step?: number): IEnumerable<number>;
// export function toNegativeInfinity(start?: number, step?: number): IEnumerable<number>;
// export function defer<T>(enumerableFactory: () => IEnumerable<T>): IEnumerable<T>;
