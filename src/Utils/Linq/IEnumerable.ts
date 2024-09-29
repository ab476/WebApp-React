import { ICompareSelector, IDictionary } from "./Collections";
import { IOrderedEnumerable, IGrouping, ILookup } from "./Enumerable";
import {  EnumeratorLike } from "./Enumerable-Interfaces";

export interface IEnumerable<T> extends Iterable<T> {
   getIterable: () => Iterable<T>
  [Symbol.iterator](): Iterator<T>;
  get iterable(): Iterable<T>;
  // Extension Methods
  select<TResult>(selector: (element: T, index: number) => TResult): IEnumerable<TResult>;
  /**
   * Projects each element of a sequence to a new form by incorporating the elements of a collection,
   * and applies a result selector function to each pair of elements.
   *
   * @param collectionSelector A function to transform each element of the input sequence into a collection.
   * @param resultSelector A function to create a result element from two input elements.
   * @returns An `IEnumerable<TRes>` whose elements are the result of invoking the result selector on each pair of elements.
   *
   * @example
   */
  selectMany<TOther>(collectionSelector: (element: T, index: number) => IEnumerable<TOther>): IEnumerable<TOther>;
  selectMany<TList, TRes>(
    collectionSelector: (element: T, index: number) => EnumeratorLike<TList>, 
    resultSelector: (outer: T, inner: TList) => TRes
  ): IEnumerable<TRes>;
  where<TOther extends T>(predicate: (element: T, index: number) => element is TOther): IEnumerable<TOther>;
  where(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
  join<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, compareSelector?: ICompareSelector<TKey>): IEnumerable<TResult>;
  leftJoin<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner | null) => TResult, compareSelector?: ICompareSelector<TKey>): IEnumerable<TResult>;
  groupJoin<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, compareSelector?: ICompareSelector<TKey>): IEnumerable<TResult>;
  all(predicate: (element: T) => boolean): boolean;
  any(predicate?: (element: T) => boolean): boolean;
  isEmpty(): boolean;
  concat(...sequences: EnumeratorLike<T>[]): IEnumerable<T>;
  insert(index: number, ...second: EnumeratorLike<T>[]): IEnumerable<T>;
  contains(value: T, comparer?: (a: T, b: T) => boolean): boolean;
  defaultIfEmpty(defaultValue?: T): IEnumerable<T>;
  distinct(compareSelector?: ICompareSelector<T>): IEnumerable<T>;
  except(second: EnumeratorLike<T>, compareSelector?: ICompareSelector<T>): IEnumerable<T>;
  intersect(second: EnumeratorLike<T>, compareSelector?: ICompareSelector<T>): IEnumerable<T>;
  union(second: EnumeratorLike<T>, compareSelector?: ICompareSelector<T>): IEnumerable<T>;
  sequenceEqual(second: EnumeratorLike<T>, compareSelector: ICompareSelector<T>): boolean;
  orderBy<TKey>(keySelector: (element: T) => TKey, comparer?: (first: TKey, second: TKey) => number): IOrderedEnumerable<T>;
  orderByDescending<TKey>(keySelector: (element: T) => TKey, comparer?: (first: TKey, second: TKey) => number): IOrderedEnumerable<T>;
  reverse(): IEnumerable<T>;
  groupBy<TKey, TElement = T, TResult = IGrouping<TKey, TElement>>(
    keySelector: (element: T) => TKey, elementSelector?: (element: T) => TElement, 
    resultSelector?: (key: TKey, element: IEnumerable<TElement>) => TResult, compareSelector?: ICompareSelector<TKey>
  ): IEnumerable<TResult>;
  aggregate<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T, index: number) => TAccumulate): TAccumulate;
  average(selector?: (element: T) => number): number;
  count(predicate?: (element: T, index: number) => boolean): number;
  max(selector?: (element: T) => number): number;
  min(selector?: (element: T) => number): number;
  maxBy<TKey>(keySelector: (element: T) => TKey): T;
  minBy<TKey>(keySelector: (element: T) => TKey): T;
  sum(selector?: (element: T) => number): number;
  first<TOther extends T>(predicate: (element: T, index: number) => element is TOther): TOther;
  first(predicate?: (element: T, index: number) => boolean): T;
  firstOrDefault(predicate: (element: T, index: number) => boolean): T | undefined;
  firstOrDefault(): T | undefined;
  last<TOther extends T>(predicate: (element: T, index: number) => element is TOther): TOther;
  last(predicate?: (element: T, index: number) => boolean): T;
  lastOrDefault(predicate: (element: T, index: number) => boolean): T | undefined;
  lastOrDefault(): T | undefined;
  skip(count: number): IEnumerable<T>;
  skipWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
  take(count: number): IEnumerable<T>;
  takeWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T>;
  asEnumerable(): IEnumerable<T>;
  toArray(): T[];
  toLookup<TKey, TElement>(keySelector: (element: T) => TKey, elementSelector?: (element: T) => TElement, compareSelector?: ICompareSelector<TKey>): ILookup<TKey, TElement>;
  toObject<TKey extends PropertyKey = number, TElement = T>(keySelector?: (element: T, index: number) => TKey, elementSelector?: (element: T) => TElement): Record<TKey, TElement>;
  toDictionary<TKey, TValue = T>(
    keySelector: (element: T) => TKey, elementSelector?: (element: T) => TValue, compareSelector?: ICompareSelector<TKey>
  ): IDictionary<TKey, TValue>;
  forEach(action: (element: T, index: number) => void): IEnumerable<T>;
}
