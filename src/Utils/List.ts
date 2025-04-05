// import { composeComparers, keyComparer } from './helpers'

import { DoublyLinkedList } from "./DoublyLinkedList";
import { Group } from "./Group";
import { HashMap } from "./HashMap";

export type PredicateType<T> = (value: T, index?: number) => boolean;
export function list<T>(elements: Iterable<T>): List<T> {
  return new List(elements);
}
function trueFn(): true {
  return true;
}
export interface IComparer<T> {
  getHashCode(item: T): string | number;
  equals(a: T, b: T): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPARER: IComparer<any> = {
  getHashCode: (item) => String(item),
  equals: (a, b) => a === b,
};
export function MapperFn<T, TResult = T>(value: T) {
  return value as unknown as TResult;
}
class List<T> implements Iterable<T> {
  protected _elements: Iterable<T> = [];
  /**
   * Make the List iterable and Spreadable
   */
  *[Symbol.iterator]() {
    yield* this.items;
  }
  protected get items(): Iterable<T> {
    return this._elements;
  }
  protected set items(elements: Iterable<T>) {
    this._elements = elements;
  }
  /**
   * property represents the Object name
   */
  get [Symbol.toStringTag]() {
    return "List"; // Expected output: "[object List]"
  }

  /**
   * Defaults the elements of the list
   */
  constructor(elements: Iterable<T> = []) {
    this.items = elements;
  }

  /**
   * Appends an object to the end of the List<T>.
   */
  public Append(element: T): List<T> {
    return list(
      (function* (source) {
        yield* source;
        yield element;
      })(this)
    );
  }

  /**
   * Add an object to the start of the List<T>.
   */
  public Prepend(element: T): List<T> {
    return list(
      (function* (source) {
        yield element;
        yield* source;
      })(this)
    );
  }

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   */
  public AddRange(elements: Iterable<T>): List<T> {
    return list(
      (function* (source) {
        yield* source;
        yield* elements;
      })(this)
    );
  }

  /**
   * Applies an accumulator function over a sequence.
   */
  public Aggregate<U>(accumulator: (accum: U, value: T, index: number) => U, initialValue: U): U {
    let accum = initialValue;
    let i = 0;
    for (const element of this) {
      accum = accumulator(accum, element, i++);
    }
    return accum;
  }

  /**
   * Determines whether all elements of a sequence satisfy a condition.
   */
  public All(predicate: PredicateType<T>): boolean {
    let i = 0;
    for (const element of this) {
      if (!predicate(element, i++)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Determines whether a sequence contains any elements.
   */
  public Any(predicate: PredicateType<T> = trueFn): boolean {
    let i = 0;
    for (const element of this) {
      if (predicate(element, i++)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Computes the average of a sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public Average(transform?: (value: T, index?: number) => number): number {
    if (!this.Any()) {
      throw new Error("Sequence contains no elements");
    }
    return this.Sum(transform) / this.count();
  }

  /**
   * Removes all elements from the List<T>.
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Concatenates two sequences.
   */
  public concat(list: Iterable<T>): List<T> {
    return this.AddRange(list);
  }

  /**
   * Determines whether an element is in the List<T>.
   */
  public contains(element: T): boolean {
    return this.Any((x) => x === element);
  }

  /**
   * Returns the number of elements in a sequence.
   */
  public count(predicate: PredicateType<T> = trueFn): number {
    if (predicate === trueFn && Array.isArray(this.items)) {
      return (<T[]>this.items).length;
    }
    let count = 0;
    for (const item of this) {
      if (predicate(item)) {
        count++;
      }
    }
    return count;
  }

  /**
   * Returns the elements of the specified sequence or the type parameter's default value
   * in a singleton collection if the sequence is empty.
   */
  public defaultIfEmpty(defaultValue?: T): List<T> {
    return this.Any() ? this : new List<T>([defaultValue as T]);
  }

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values.
   */
  public distinct(): List<T> {
    const items = this.Aggregate((accm, value) => {
      accm.add(value);
      return accm;
    }, new Set<T>());
    return list(items);
  }

  /**
   * Returns distinct elements from a sequence according to specified key selector.
   */
  public distinctBy<TKey>(keySelector: (key: T) => TKey, comparer: IComparer<TKey> = COMPARER): List<T> {
    return this.groupBy(keySelector, MapperFn, comparer).Select((grp) => grp.toList().first());
  }

  /**
   * Returns the element at a specified index in a sequence.
   */
  public elementAt(index: number): T {
    if (index >= 0) {
      let i = 0;
      for (const element of this) {
        if (i++ === index) {
          return element;
        }
      }
    }
    throw new Error("ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.");
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   */
  public elementAtOrDefault(index: number): T | null {
    if (index >= 0) {
      let i = 0;
      for (const element of this) {
        if (i++ === index) {
          return element;
        }
      }
    }
    return null;
  }

  /**
   * Produces the set difference of two sequences by using the default equality comparer to compare values.
   */
  public except(source: Iterable<T>, comparer: IComparer<T> = COMPARER): List<T> {
    const map = list(source).Aggregate((ac, value) => {
      ac.set(comparer.getHashCode(value), value);
      return ac;
    }, new Map<string | number, T>());
    return this.Where((x) => !map.has(comparer.getHashCode(x)));
  }

  /**
   * Returns the first element of a sequence.
   */
  public first(predicate: PredicateType<T> = trueFn): T {
    const item = this.firstOrDefault(predicate);
    if (item) {
      return item;
    }
    throw new Error("InvalidOperationException: The source sequence is empty.");
  }

  /**
   * Returns the first element of a sequence, or a default value if the sequence contains no elements.
   */
  public firstOrDefault(predicate: PredicateType<T> = trueFn): T | undefined {
    for (const element of this) {
      if (predicate(element)) {
        return element;
      }
    }
  }

  /**
   * Performs the specified action on each element of the List<T>.
   */
  public forEach(action: (value: T, index?: number) => void): void {
    let i = 0;
    for (const element of this) {
      action(element, i++);
    }
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  public groupBy<TKey, TResult = T>(keySelector: (key: T) => TKey, mapper: (element: T) => TResult = MapperFn, comparer: IComparer<TKey> = COMPARER): List<Group<TKey, TResult>> {
    const initialValue = new Map<string | number, Group<TKey, TResult>>();
    return list(
      this.Aggregate((ac, v) => {
        const key = keySelector(v);
        const hashKey = comparer.getHashCode(key);
        const mappedValue = mapper(v);
        const existingGroup = ac.get(hashKey);
        if (existingGroup) {
          existingGroup.add(mappedValue);
        } else {
          ac.set(hashKey, new Group<TKey, TResult>(key, [mappedValue]));
        }
        return ac;
      }, initialValue).values()
    );
  }

  /**
   * Correlates the elements of two sequences based on equality of keys and groups the results.
   * The default equality comparer is used to compare keys.
   */
  public groupJoin<U, R, TKey = T>(secondList: Iterable<U>, key1: (k: T) => TKey, key2: (k: U) => TKey, result: (first: T, second: Iterable<U>) => R): List<R> {
    const secondGrp = list(secondList)
      .groupBy(key2)
      .ToDictionary(
        (x) => x.key,
        (x) => x.toArray()
      );
    return this.Select((x) => result(x, secondGrp.get(key1(x)) ?? []));
  }

  /**
   * Returns the index of the first occurence of an element in the List.
   */
  public IndexOf(element: T): number {
    let i = 0;
    for (const item of this) {
      if (element === item) {
        return i;
      }
      i++;
    }
    return -1;
  }

  // /**
  //  * Inserts an element into the List<T> at the specified index.
  //  */
  // public insert(element: T, index?: number): void | Error {
  //   this.items = (function* (items) {
  //     let i = 0;
  //     for (const item of items) {
  //       if (i++ === index) {
  //         yield element;
  //       }
  //       yield item;
  //     }
  //   })(this);
  // }

  // /**
  //  * Produces the set intersection of two sequences by using the default equality comparer to compare values.
  //  */
  // public Intersect(source: List<T>): List<T> {
  //   return this.Where((x) => source.contains(x));
  // }

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   */
  public Join<U, R>(list: List<U>, key1: (key: T) => any, key2: (key: U) => any, result: (first: T, second: U) => R): List<R> {
    return this.SelectMany((x) => list.Where((y) => key2(y) === key1(x)).Select((z) => result(x, z)));
  }

  /**
   * Returns the last element of a sequence.
   */
  public Last(predicate?: PredicateType<T>): T {
    if (this.count()) {
      return predicate ? this.Where(predicate).Last() : this._elements[this.count() - 1];
    }
    throw Error("InvalidOperationException: The source sequence is empty.");
  }

  /**
   * Returns the last element of a sequence, or a default value if the sequence contains no elements.
   */
  public LastOrDefault(defaultValue: T): T {
    return this.count() ? this.Last() : defaultValue;
  }

  /**
   * Returns the maximum value in a generic sequence.
   */
  public Max(selector?: (element: T, index: number) => number): number {
    const identity = (x: T): number => x as number;
    return Math.max(...this.Select(selector || identity).ToList());
  }

  /**
   * Returns the minimum value in a generic sequence.
   */
  public Min(selector?: (element: T, index: number) => number): number {
    const identity = (x: T): number => x as number;
    return Math.min(...this.Select(selector || identity).ToList());
  }

  /**
   * Filters the elements of a sequence based on a specified type.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public OfType<U>(type: any): List<U> {
    let typeName: string | null;
    switch (type) {
      case Number:
        typeName = typeof 0;
        break;
      case String:
        typeName = typeof "";
        break;
      case Boolean:
        typeName = typeof true;
        break;
      case Function:
        typeName = typeof function () {}; // tslint:disable-line no-empty
        break;
      default:
        typeName = null;
        break;
    }
    return typeName === null ? this.Where((x) => x instanceof type).cast<U>() : this.Where((x) => typeof x === typeName).cast<U>();
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   */
  // public OrderBy(
  //   keySelector: (key: T) => any,
  //   comparer = keyComparer(keySelector, false)
  // ): List<T> {
  //   // tslint:disable-next-line: no-use-before-declare
  //   return new OrderedList<T>(this._elements, comparer)
  // }

  /**
   * Sorts the elements of a sequence in descending order according to a key.
   */
  // public OrderByDescending(
  //   keySelector: (key: T) => any,
  //   comparer = keyComparer(keySelector, true)
  // ): List<T> {
  //   // tslint:disable-next-line: no-use-before-declare
  //   return new OrderedList<T>(this._elements, comparer)
  // }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   */
  public ThenBy(keySelector: (key: T) => any): List<T> {
    return this.OrderBy(keySelector);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   */
  public ThenByDescending(keySelector: (key: T) => any): List<T> {
    return this.OrderByDescending(keySelector);
  }

  /**
   * Removes the first occurrence of a specific object from the List<T>.
   */
  public Remove(element: T): boolean {
    return this.IndexOf(element) !== -1 ? (this.RemoveAt(this.IndexOf(element)), true) : false;
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   */
  public RemoveAll(predicate: PredicateType<T>): List<T> {
    return this.Where((value, index, list) => !predicate(value, index, list));
  }

  /**
   * Removes the element at the specified index of the List<T>.
   */
  public RemoveAt(index: number): void {
    this._elements.splice(index, 1);
  }

  /**
   * Reverses the order of the elements in the entire List<T>.
   */
  public Reverse(): List<T> {
    return list(this.toArray().reverse());
  }

  /**
   * Projects each element of a sequence into a new form.
   */
  public Select<TOut>(selector: (element: T, index: number) => TOut): List<TOut> {
    return list(
      (function* (elements: Iterable<T>) {
        let index = 0;
        for (const element of elements) {
          yield selector(element, index++);
        }
      })(this)
    );
  }

  /**
   * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
   */
  public SelectMany<TOut extends List<any>>(selector: (element: T, index: number) => TOut): TOut {
    return this.Aggregate((ac, _, i) => (ac.AddRange(this.Select(selector).elementAt(i).toArray()), ac), new List<TOut>());
  }

  /**
   * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
   */
  public SequenceEqual(list: List<T>): boolean {
    return this.All((e) => list.contains(e));
  }

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  public Single(predicate?: PredicateType<T>): T {
    if (this.count(predicate) !== 1) {
      throw new Error("The collection does not contain exactly one element.");
    }
    return this.first(predicate);
  }

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty;
   * this method throws an exception if there is more than one element in the sequence.
   */
  public SingleOrDefault(defaultValue: T): T {
    return this.count() ? this.Single() : defaultValue;
  }
  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   */
  public Skip(amount: number): List<T> {
    return new List<T>(this._elements.slice(Math.max(0, amount)));
  }

  /**
   * Omit the last specified number of elements in a sequence and then returns the remaining elements.
   */
  public SkipLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, -Math.max(0, amount)));
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   */
  public SkipWhile(predicate: PredicateType<T>): List<T> {
    return this.Skip(this.Aggregate((ac) => (predicate(this.elementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Computes the sum of the sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public Sum(transform?: (value: T, index?: number) => number): number {
    return transform ? this.Select(transform).Sum() : this.Aggregate((ac, v) => (ac += +v), 0);
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   */
  public Take(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, Math.max(0, amount)));
  }

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   */
  public TakeLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(-Math.max(0, amount)));
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   */
  public TakeWhile(predicate: PredicateType<T>): List<T> {
    return this.Take(this.Aggregate((ac) => (predicate(this.elementAt(ac)) ? ++ac : ac), 0));
  }

  /**
   * Copies the elements of the List<T> to a new array.
   */
  public toArray(): T[] {
    return Array.from(this._elements);
  }

  /**
   * Creates a Dictionary<TKey, TValue> from a List<T> according to a specified key selector function.
   */
  public ToDictionary<TKey, TValue>(key: (key: T) => TKey, value: (value: T) => TValue): HashMap<TKey, TValue> {
    return this.Aggregate((dicc, v) => {
      dicc.set(key(v), value(v));
      return dicc;
    }, new HashMap<TKey, TValue>());
  }

  /**
   * Creates a List<T> from an Enumerable.List<T>.
   */
  public ToList(): List<T> {
    return this;
  }

  /**
   * Creates a Lookup<TKey, TElement> from an IEnumerable<T> according to specified key selector and element selector functions.
   */
  public ToLookup<TResult>(keySelector: (key: T) => string | number, elementSelector: (element: T) => TResult): { [key: string]: TResult[] } {
    return this.groupBy(keySelector, elementSelector);
  }

  /**
   * Produces the set union of two sequences by using the default equality comparer.
   */
  public Union(list: List<T>): List<T> {
    return this.concat(list).distinct();
  }

  /**
   * Filters a sequence of values based on a predicate.
   */
  public Where(predicate: PredicateType<T>): List<T> {
    return new List<T>(this._elements.filter(predicate));
  }

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   */
  public Zip<U, TOut>(list: List<U>, result: (first: T, second: U) => TOut): List<TOut> {
    return list.count() < this.count() ? list.Select((x, y) => result(this.elementAt(y), x)) : this.Select((x, y) => result(x, list.elementAt(y)));
  }
}

/**
 * Represents a sorted sequence. The methods of this class are implemented by using deferred execution.
 * The immediate return value is an object that stores all the information that is required to perform the action.
 * The query represented by this method is not executed until the object is enumerated either by
 * calling its ToDictionary, ToLookup, ToList or ToArray methods
 */
class OrderedList<T> extends List<T> {
  constructor(elements: T[], private _comparer: (a: T, b: T) => number) {
    super(elements);
    this._elements.sort(this._comparer);
  }

  /**
   * Allows you to get the parent List out of the OrderedList
   * @override
   * @returns and ordered list turned into a regular List<T>
   */
  public ToList(): List<T> {
    return new List<T>(this);
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   * @override
   */
  // public ThenBy(keySelector: (key: T) => any): List<T> {
  //   return new OrderedList(
  //     this._elements,
  //     composeComparers(this._comparer, keyComparer(keySelector, false))
  //   )
  // }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   * @override
   */
  // public ThenByDescending(keySelector: (key: T) => any): List<T> {
  //   return new OrderedList(
  //     this._elements,
  //     composeComparers(this._comparer, keyComparer(keySelector, true))
  //   )
  // }
}

export default List;
