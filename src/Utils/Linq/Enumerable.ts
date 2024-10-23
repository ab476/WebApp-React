
import { ICompareSelector, defaultCompareSelector, IDictionary, ILinkListNode, KeyValue, HashEntry, IDictionaryArgs } from "./Collections";
import { PredicateFn, TrueFn, getIterable, EnumeratorLike, TypePredicateFn, from } from "./Enumerable-Interfaces";
import { IEnumerable } from "./IEnumerable";
export function toNumber<T>(value: T): number {
  return typeof value === "number" ? value : +`${value}`;
}
export function defaultComparer<T>(a: T, b: T): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
export function defaultSelector<T, TElement = T>(x: T): TElement {
  return x as unknown as TElement;
}
export type SelectorFn<T, TResult> = (element: T, index: number) => TResult;
export class Enumerable<T> implements IEnumerable<T>, Iterable<T> {
  getIterable: () => Iterable<T>;
  constructor(Iterable: Iterable<T>) {
    this.getIterable = () => Iterable;
  }
  get iterable(): Iterable<T> {
    return this.getIterable();
  }
  protected set iterable(source: Iterable<T>) {
    this.getIterable = () => source;
  }
  *[Symbol.iterator](): Iterator<T> {
    yield* this.iterable;
  }
  select<TResult>(selector: SelectorFn<T, TResult>): IEnumerable<TResult> {
    return new Enumerable(
      (function* (source: Iterable<T>, index: number) {
        for (const element of source) {
          yield selector(element, index++);
        }
      })(this, 0)
    );
  }
  
  selectMany<TList, TRes>(
    collectionSelector: (element: T, index: number) => EnumeratorLike<TList>, 
    resultSelector: (outer: T, inner: TList) => TRes = (_o, i) => i as unknown as TRes): IEnumerable<TRes> 
  {
    return new Enumerable(
      (function* (source: Iterable<T>, index: number) {
        for (const list of source) {
          for (const element of getIterable(collectionSelector(list, index++))) {
            yield resultSelector(list, element);
          }
        }
      })(this, 0)
    );
  }
  
  where<TOther extends T = T>(predicate: PredicateFn<T> | TypePredicateFn<T, TOther>): IEnumerable<T> | IEnumerable<TOther> {
    return new Enumerable(
      (function* (source: Iterable<T>, index: number) {
        for (const element of source) {
          if (predicate(element, index++)) {
            yield element;
          }
        }
      })(this, 0)
    );
  }
  join<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, 
    outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, resultSelector: (outer: T, inner: TInner) => TResult, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector): IEnumerable<TResult> 
  {
    const innerLookUP = from(inner).toLookup(innerKeySelector, defaultSelector, compareSelector);
    return new Enumerable(
      (function* (outer: Iterable<T>) {
        for (const outerElement of outer) {
          const outerKey = outerKeySelector(outerElement);
          if (innerLookUP.containsKey(outerKey)) {
            yield* innerLookUP.get(outerKey).select((innerElement) => resultSelector(outerElement, innerElement));
          }
        }
      })(this)
    );
  }
  leftJoin<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, 
    outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, 
    resultSelector: (outer: T, inner: TInner | null) => TResult, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector): IEnumerable<TResult> 
  {
    // ----------------------------------------------------------------
    const innerLookUP = from(inner).toLookup(innerKeySelector, defaultSelector, compareSelector);
    return new Enumerable(
      (function* (outer: Iterable<T>) {
        for (const outerElement of outer) {
          const outerKey = outerKeySelector(outerElement);
          if (innerLookUP.containsKey(outerKey)) {
            yield* innerLookUP.get(outerKey).select((innerElement) => resultSelector(outerElement, innerElement));
          } else {
            yield resultSelector(outerElement, null);
          }
        }
      })(this)
    );
  }
  groupJoin<TInner, TKey, TResult>(
    inner: EnumeratorLike<TInner>, 
    outerKeySelector: (outer: T) => TKey, 
    innerKeySelector: (inner: TInner) => TKey, 
    resultSelector: (outer: T, inner: IEnumerable<TInner>) => TResult, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector): IEnumerable<TResult> {
      // ----------------------------------------------------------------
    const innerLookUP = from(inner).toLookup(innerKeySelector, defaultSelector, compareSelector);
    return new Enumerable(
      (function* (outer: Iterable<T>) {
        for (const outerElement of outer) {
          const outerKey = outerKeySelector(outerElement);
          if (innerLookUP.containsKey(outerKey)) {
            yield resultSelector(outerElement, innerLookUP.get(outerKey));
          }
        }
      })(this)
    );
  }
  all(predicate: PredicateFn<T> = TrueFn): boolean {
    let index = 0;
    for (const element of this) {
      if (!predicate(element, index++)) {
        return false;
      }
    }
    return true;
  }
  any(predicate: PredicateFn<T> = TrueFn): boolean {
    let index = 0;
    for (const element of this) {
      if (predicate(element, index++)) {
        return true;
      }
    }
    return false;
  }
  isEmpty(): boolean {
    for (const _element of this) {
      return false;
    }
    return true;
  }
  concat(...sequences: EnumeratorLike<T>[]): IEnumerable<T> {
    return new Enumerable(
      (function* (source: Iterable<T>) {
        yield* source;
        for (const element of sequences) yield* getIterable(element);
      })(this)
    );
  }
  insert(index: number, ...second: EnumeratorLike<T>[]): IEnumerable<T> {
    return new Enumerable(
      (function* (source: Iterable<T>) {
        let no = 0;
        for (const element of source) {
          if (no === index) {
            for (const element of second) yield* getIterable(element);
          }
          yield element;
          no++;
        }
      })(this)
    );
  }
  contains(value: T, comparer: (a: T, b: T) => boolean = (a, b) => a === b): boolean {
    for (const element of this) {
      if (comparer(element, value)) return true;
    }
    return false;
  }
  defaultIfEmpty(defaultValue?: T | undefined): IEnumerable<T> {
    return new Enumerable(
      (function* (source: IEnumerable<T>) {
        if (source.isEmpty()) yield defaultValue as T;
        else yield* source;
      })(this)
    );
  }
  distinct(compareSelector: ICompareSelector<T> = defaultCompareSelector): IEnumerable<T> {
    return new Enumerable((function* (source: Iterable<T>, set: HashSet<T>) {
      for (const element of source) {
        if(set.add(element)) {
          yield element;
        }
      }
    })(this, new HashSet<T>(compareSelector)));
  }
  except(second: EnumeratorLike<T>, compareSelector: ICompareSelector<T> = defaultCompareSelector): IEnumerable<T> {
    return new Enumerable((function* (source: Iterable<T>, set: HashSet<T>) {
      for (const element of source) {
        if(!set.containsKey(element)) {
          yield element;
        }
      }
    })(this, new HashSet<T>(compareSelector, second)));
  }
  intersect(second: EnumeratorLike<T>, compareSelector: ICompareSelector<T> = defaultCompareSelector): IEnumerable<T> {
    return new Enumerable((function* (source: Iterable<T>, set: HashSet<T>) {
      for (const element of source) {
        if(set.containsKey(element)) {
          yield element;
        }
      }
    })(this, new HashSet<T>(compareSelector, second)));
  }
  union(second: EnumeratorLike<T>, compareSelector: ICompareSelector<T> = defaultCompareSelector): IEnumerable<T> {
    return this.concat(second).distinct(compareSelector);
  }
  sequenceEqual(second: EnumeratorLike<T>, compareSelector: ICompareSelector<T> = defaultCompareSelector): boolean {
    const firstList = getIterable(this)[Symbol.iterator]();
    const secondList = getIterable(second)[Symbol.iterator]();
    let first = firstList.next();
    while (first.done) {
      const second = secondList.next();
      if(!second.done || !compareSelector.equals(first.value, second.value)) {
        return false;
      }
      first = firstList.next();
    }
    if(secondList.next().done) {
      return false;
    }
    return true;
  }
  orderBy<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number = defaultComparer): IOrderedEnumerable<T> {
    return new OrderedEnumerable(this, keySelector, comparer, false);
  }
  orderByDescending<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number = defaultComparer): IOrderedEnumerable<T>{
    return new OrderedEnumerable(this, keySelector, comparer, true);
  }
  reverse(): IEnumerable<T> {
    return new Enumerable(this.toArray().reverse());
  }
  groupBy<TKey, TElement, TResult>(
    keySelector: (element: T) => TKey, 
    elementSelector: (element: T) => TElement = (element) => element as unknown as TElement, 
    resultSelector: (key: TKey, element: IEnumerable<TElement>) => TResult = (key, elements) => new Grouping(key, elements) as unknown as TResult, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector
  ): IEnumerable<TResult> {
    const groups = this.aggregate(new Dictionary<TKey, TElement[]>(compareSelector), (dict, element) => {
      const key = keySelector(element);
      const grp = dict.tryGet(key) ?? [];
      grp.push(elementSelector(element));
      dict.set(key, grp);
      return dict;
    });
    return groups.select(({key, value}) => resultSelector(key, from(value)));
  }
  aggregate<TAccumulate>(seed: TAccumulate, func: (prev: TAccumulate, current: T, index: number) => TAccumulate): TAccumulate {
    let index = 0;
    for (const element of this) {
      seed = func(seed, element, index++);
    }
    return seed;
  }
  average(selector: ((element: T) => number) = toNumber): number {
    const [sum, count] = this.aggregate([0, 0], ([sum, count], curr) => {
      const num = +selector(curr);
      if(isNaN(num)) {
        throw new Error("Sequence contains non-numeric elements");
      }
      return [sum + num, count++];
    })
    return sum / count;
  }
  count(predicate: (element: T, index: number) => boolean = TrueFn): number {
    return this.aggregate(0, (count, curr, index) => count + (predicate(curr, index) ? 1 : 0));
  }
  max(selector: ((element: T) => number) = toNumber): number {
    return this.aggregate(Number.MIN_VALUE, (prev, curr) => {
      const num = +selector(curr);
      if(isNaN(num)) {
        throw new Error("Sequence contains non-numeric elements");
      }
      return Math.max(num, prev);
    })
  }
  min(selector: ((element: T) => number) = toNumber): number {
    return this.aggregate(Number.MAX_VALUE, (prev, curr) => {
      const num = +selector(curr);
      if(isNaN(num)) {
        throw new Error("Sequence contains non-numeric elements");
      }
      return Math.min(num, prev);
    })
  }
  maxBy<TKey>(keySelector: (element: T) => TKey): T {
    return this.aggregate<T>(null as T,(prev, curr) => prev === null ? curr : keySelector(prev) >= keySelector(curr) ? prev : curr);
  }
  minBy<TKey>(keySelector: (element: T) => TKey): T {
    return this.aggregate<T>(null as T,(prev, curr) => prev === null ? curr : keySelector(prev) <= keySelector(curr) ? prev : curr);
  }
  sum(selector: ((element: T) => number) = toNumber): number {
    return this.aggregate(0, (prev, curr) => {
      const num = +selector(curr);
      if(isNaN(num)) {
        throw new Error("Sequence contains non-numeric elements");
      }
      return prev + num;
    })
  }
  first(predicate: ((element: T, index: number) => boolean) = TrueFn): T {
    const element = this.firstOrDefault(predicate);
    if(element === undefined) {
      throw new Error("Sequence contains no elements");
    }
    return element;
}
firstOrDefault(predicate: (element: T, index: number) => boolean = TrueFn): T | undefined {
  let index = 0;
  for (const element of this) {
    if(predicate(element, index++)) {
      return element;
    }
  }
  return undefined;
}
  last(predicate: ((element: T, index: number) => boolean) = TrueFn): T {
      const element = this.lastOrDefault(predicate);
      if(element === undefined) {
        throw new Error("Sequence contains no elements");
      }
      return element;
  }
  lastOrDefault(predicate: (element: T, index: number) => boolean = TrueFn): T | undefined {
    const arr = this.toArray();
    for (let index = arr.length - 1; index >= 0; index--) {
      const element = arr[index];
      if(predicate(element, index)) {
        return element;
      }
    }
    return undefined;
  }
  skip(count: number): IEnumerable<T> {
    return this.skipWhile((_e, i) => i < count);
  }
  skipWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T> {
    return new Enumerable((function*(source: Iterable<T>, index, flag){
      for (const element of source) {
        if(flag){
          yield element;
        } else if (predicate(element, index++)) {
          continue;
        } else {
          flag = true;
        }
      }
    })(this, 0, false))
  }
  take(count: number): IEnumerable<T> {
    return this.takeWhile((_e, i) => i < count);
  }
  takeWhile(predicate: (element: T, index: number) => boolean): IEnumerable<T> {
    return new Enumerable((function*(source: Iterable<T>, index: number){
      for (const element of source) {
        if(predicate(element, index++)){
          yield element;
        } else {
          return;
        }
      }
    })(this, 0))
  }
  asEnumerable(): IEnumerable<T> {
    return this;
  }
  toArray(): T[] {
    return Array.from(this);
  }
  toLookup<TKey, TElement>(
    keySelector: (element: T) => TKey, 
    elementSelector: (element: T) => TElement = defaultSelector, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector): ILookup<TKey, TElement> {
    const dict = this.aggregate(
      new Dictionary<TKey, TElement[]>(compareSelector), 
      (prev, curr) => {
        const key = keySelector(curr);
        const arr = prev.get(key) ?? [];
        arr.push(elementSelector(curr));
        prev.set(key, arr);
        return prev;
      }
    )
    return new Lookup(dict);
  }
  toObject<TKey extends PropertyKey, TElement>(
    keySelector: (element: T, index: number) => TKey = (_element: T, index: number) => index as TKey, 
    elementSelector: ((element: T) => TElement) = defaultSelector
  ): Record<TKey, TElement> {
    console.log(this, "isDictionary", this instanceof Dictionary)
    return this.aggregate(({} as Record<TKey, TElement>), (prev, curr, index) => {
      prev[keySelector(curr, index)] = elementSelector(curr);
      return prev;
    })
  }
  toDictionary<TKey, TValue = T>(
    keySelector: (element: T) => TKey, 
    elementSelector: (element: T) => TValue = defaultSelector, 
    compareSelector: ICompareSelector<TKey> = defaultCompareSelector
  ): IDictionary<TKey, TValue> {
    return new Dictionary<TKey, TValue>(compareSelector)
      .addRange({source: this, keySelector, elementSelector});
  }
  forEach(action: (element: T, index: number) => void): IEnumerable<T> {
    let index = 0;
    for (const element of this) {
      action(element, index++);
    }
    return this;
  }
}
export class EntryList<T extends ILinkListNode<T>> extends Enumerable<T> implements IEnumerable<T>, Iterable<T> {
  public firstEntry: T | null = null;
  public lastEntry: T | null = null;
  constructor(source?: EnumeratorLike<T>) {
    super([]);
    if(source)
      this.addRange(source);
    this.getIterable = () => (function* (start: T | null) {
      while (start) {
        yield start;
        start = start.next;
      }
    })(this.firstEntry);
  }
  asEnumerable(): IEnumerable<T> {
      return this;
  }
  // get iterable(): Iterable<T> {
  //   return (super._Iterable = (function* (start: T | null) {
  //     while (start) {
  //       yield start;
  //       start = start.next;
  //     }
  //   })(this.firstEntry));
  // }
  // *[Symbol.iterator](): Iterator<T> {
  //   yield * this.iterable
  // }
  addRange(source: EnumeratorLike<T>): EntryList<T> {
    for (const element of getIterable(source)) {
      this.addLast(element);
    }
    return this;
  }
  addLast(entry: T): void {
    if (this.lastEntry != null) {
      this.lastEntry.next = entry;
      entry.prev = this.lastEntry;
      this.lastEntry = entry;
    } else this.firstEntry = this.lastEntry = entry;
  }
  replace(entry: T, newEntry: T) {
    if (entry.prev != null) {
      entry.prev.next = newEntry;
      newEntry.prev = entry.prev;
    } else this.firstEntry = newEntry;

    if (entry.next != null) {
      entry.next.prev = newEntry;
      newEntry.next = entry.next;
    } else this.lastEntry = newEntry;
  }
  remove(entry: T) {
    if (entry.prev != null) entry.prev.next = entry.next;
    else this.firstEntry = entry.next;

    if (entry.next != null) entry.next.prev = entry.prev;
    else this.lastEntry = entry.prev;
  }
}
export class Dictionary<TKey, TValue> extends Enumerable<KeyValue<TKey, TValue>> implements IDictionary<TKey, TValue>, IEnumerable<KeyValue<TKey, TValue>>, Iterable<KeyValue<TKey, TValue>> {
  //
  protected countField = 0;
  protected buckets = new Map<string | number, EntryList<HashEntry<TKey, TValue>>>();
  constructor(protected compareSelector: ICompareSelector<TKey> = defaultCompareSelector) {
    super([]);
    // this.getIterable = () => (function* (source: Map<string | number, EntryList<HashEntry<TKey, TValue>>>) {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   for (const [_key, list] of source) {
    //     yield* list.select((x) => new KeyValue<TKey, TValue>(x.key, x.value));
    //   }
    // })(this.buckets);
  }
  get iterable(): Iterable<KeyValue<TKey, TValue>> {
    return (function* (source: Map<string | number, EntryList<HashEntry<TKey, TValue>>>) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_key, list] of source) {
        yield* list.select((x) => new KeyValue<TKey, TValue>(x.key, x.value));
      }
    })(this.buckets);
  }
  // *[Symbol.iterator](): Iterator<KeyValue<TKey, TValue>> {
  //   yield * this.iterable
  // }
  containsKey(key: TKey): boolean {
    const hash = this.compareSelector.getHashCode(key);
    return this.buckets.get(hash)?.any((x) => this.compareSelector.equals(x.key, key)) ?? false;
  }
  add(key: TKey, value: TValue): boolean {
    const hash = this.compareSelector.getHashCode(key);
    const entry = new HashEntry(key, value);
    const list = this.buckets.get(hash) ?? new EntryList();
    const oldEntry = list.firstOrDefault((x) => this.compareSelector.equals(x.key, key));
    if (!oldEntry) {
      list.addLast(entry);
      this.countField++;
      this.buckets.set(hash, list);
      return true;
    }
    return false;
  }
  addRange<T>(dictionaryArgs: IDictionaryArgs<T, TKey, TValue>): IDictionary<TKey, TValue> {
    const { source, keySelector, elementSelector } = dictionaryArgs;
    for (const element of getIterable(source)) {
      this.add(keySelector(element), elementSelector(element));
    }
    return this;
  }
  get(key: TKey) {
    const val = this.tryGet(key);
    if (val === undefined) {
      throw new Error(`Key '${key}' not found in the dictionary.`);
    }
    return val;
  }
  tryGet(key: TKey): TValue | undefined {
    const hash = this.compareSelector.getHashCode(key);
    const list = this.buckets.get(hash);
    return list && list.firstOrDefault((x) => this.compareSelector.equals(x.key, key))?.value;
  }
  set(key: TKey, value: TValue): void {
    const hash = this.compareSelector.getHashCode(key);
    const entry = new HashEntry(key, value);
    const list = this.buckets.get(hash) ?? new EntryList();
    const oldEntry = list.firstOrDefault((x) => this.compareSelector.equals(x.key, key));
    if (oldEntry) {
      list.replace(oldEntry, entry);
    } else {
      list.addLast(entry);
    }
    this.buckets.set(hash, list);
    this.countField++;
  }
  clear(): void {
    this.countField = 0;
    this.buckets = new Map();
  }
  remove(key: TKey): boolean {
    const hash = this.compareSelector.getHashCode(key);
    const list = this.buckets.get(hash);
    const entry = list?.firstOrDefault((x) => this.compareSelector.equals(x.key, key));
    if (list && entry) {
      list.remove(entry);
      this.countField--;
      return true;
    }
    return false;
  }
  count(): number {
    return this.countField;
  }
  toEnumerable(): IEnumerable<KeyValue<TKey, TValue>> {
    return this;
  }
}
export interface IHashSet<T> extends IEnumerable<T> {
  add(key: T): boolean;
  containsKey(key: T): boolean;
  clear(): void;
  remove(key: T): boolean;
  count(): number;
  toEnumerable(): IEnumerable<T>;
}
export class HashSet<T> extends Enumerable<T> implements IHashSet<T>, IEnumerable<T>, Iterable<T> {
  //
  protected countField = 0;
  protected buckets = new Map<PropertyKey, T>();
  constructor(protected compareSelector: ICompareSelector<T> = defaultCompareSelector, ...list: EnumeratorLike<T>[]) {
    super([]);
    for (const element of list) {
      for (const item of getIterable(element)) {
        this.add(item);
      }
    }
    this.getIterable = () => (function* (source: Map<PropertyKey, T>) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_key, item] of source) {
        yield item;
      }
    })(this.buckets);
  }
  // get iterable(): Iterable<T> {
  //   return (super._Iterable = (function* (source: Map<PropertyKey, T>) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     for (const [_key, item] of source) {
  //       yield item;
  //     }
  //   })(this.buckets));
  // }
  // *[Symbol.iterator](): Iterator<T> {
  //   yield * this.iterable
  // }
  containsKey(key: T): boolean {
    const hash = this.compareSelector.getHashCode(key);
    return this.buckets.has(hash);
  }
  add(key: T): boolean {
    const hash = this.compareSelector.getHashCode(key);
    if (this.buckets.has(hash)) {
      return false;
    } else {
      this.buckets.set(hash, key);
      this.countField++;
      return true;
    }
  }
  clear(): void {
    this.countField = 0;
    this.buckets = new Map();
  }
  remove(key: T): boolean {
    const hash = this.compareSelector.getHashCode(key);
    if (this.buckets.has(hash)) {
      this.buckets.delete(hash);
      this.countField--;
      return true;
    }
    return false;
  }
  count(): number {
    return this.countField;
  }
  toEnumerable(): IEnumerable<T> {
    return this;
  }
}
export class ArrayEnumerable<T> extends Enumerable<T> implements IEnumerable<T>, Iterable<T> {
  protected arraySource: T[] = [];
  constructor(source: EnumeratorLike<T>) {
    super([]);
    this.arraySource = from(source).toArray();
    this.getIterable = () => this.arraySource;
  }
  // get iterable(): Iterable<T> {
  //   return this.arraySource;
  // }
  // set iterable(source: Iterable<T>) {
  //   this.arraySource = Array.from(source);
  // }
  // *[Symbol.iterator](): Iterator<T> {
  //   yield * this.iterable
  // }
  count(predicate?: (element: T, index: number) => boolean): number {
    return !predicate ? this.arraySource.length : super.count(predicate);
  }
  last(predicate: (element: T, index: number) => boolean = TrueFn): T {
    const result = this.lastOrDefault(predicate);
    if (result === undefined) {
      throw new Error("No matching element found.");
    }
    return result;
  }
  lastOrDefault(predicate: (element: T, index: number) => boolean = TrueFn): T | undefined {
    for (let index = this.arraySource.length - 1; index >= 0; index--) {
      const element = this.arraySource[index];
      if (predicate(element, index)) {
        return element;
      }
    }
    return undefined;
  }
  skip(count: number): IEnumerable<T> {
    return new Enumerable(
      (function* (array: T[]) {
        for (let index = count; index < array.length; index++) {
          yield array[index];
        }
      })(this.arraySource)
    );
  }
  reverse(): IEnumerable<T> {
    return new Enumerable(
      (function* (source: T[]) {
        for (let index = source.length - 1; index >= 0; index--) {
          yield source[index];
        }
      })(this.arraySource)
    );
  }
  toArray(): T[] {
    return this.arraySource;
  }
}
export interface ILookup<TKey, TElement> {
  count(): number;
  get(key: TKey): IEnumerable<TElement>;
  containsKey(key: TKey): boolean;
  toEnumerable(): IEnumerable<IGrouping<TKey, TElement>>;
}
export class Lookup<TKey, TElement> 
    extends Enumerable<IGrouping<TKey, TElement>> 
    implements ILookup<TKey, TElement>, IEnumerable<IGrouping<TKey, TElement>>, Iterable<IGrouping<TKey, TElement>> {
    constructor(protected dictionary: IDictionary<TKey, TElement[]>) {
        super([]);
      this.getIterable = () => (function*(source: IDictionary<TKey, TElement[]>){
        for (const {key, value} of source) {
            yield new Grouping(key, value);
        }
    })(this.dictionary)
    }
    // get iterable(): Iterable<IGrouping<TKey, TElement>> {
    //     return (function*(source: IDictionary<TKey, TElement[]>){
    //         for (const {key, value} of source) {
    //             yield new Grouping(key, value);
    //         }
    //     })(this.dictionary)
    // }
    // *[Symbol.iterator](): Iterator<IGrouping<TKey, TElement>> {
    //   yield * this.iterable
    // }
    // set iterable(source: Iterable<IGrouping<TKey, TElement>>) {
    //     this.dictionary.addRange({
    //         source,
    //         keySelector: defaultSelector.key,
    //         elementSelector: defaultSelector.getSource(),
    //     })
    // }
    count(): number {
        return this.dictionary.count();
    }
    get(key: TKey) {
        return from(this.dictionary.get(key));
    }
    containsKey(key: TKey): boolean {
        return this.dictionary.containsKey(key);
    }
    toEnumerable(): IEnumerable<IGrouping<TKey, TElement>> {
        return this;
    }
}
export interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
  get key(): TKey;
  getSource(): TElement[];
}
export class Grouping<TKey, TElement> extends ArrayEnumerable<TElement> implements IGrouping<TKey, TElement> {
  constructor(protected groupKey: TKey, elements: EnumeratorLike<TElement>) {
    super(elements);
  }
  get key(): TKey {
    return this.groupKey;
  }
  getSource(): TElement[] {
    return  this.arraySource;
  }
  toString() {
    return `Grouping(${this.groupKey}, ${this.arraySource.join(", ")})`;
  }
}
export interface IOrderedEnumerable<T> extends IEnumerable<T> {
  thenBy<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
  thenBy<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number): IOrderedEnumerable<T>;
  thenByDescending<TKey>(keySelector: (element: T) => TKey): IOrderedEnumerable<T>;
  thenByDescending<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number): IOrderedEnumerable<T>;
}
// keySelector: (element: T) => TKey, comparer?: (first: TKey, second: TKey) => number
export class OrderedEnumerable<T, TKey = T> extends Enumerable<T> implements IOrderedEnumerable<T>, IEnumerable<T>, Iterable<T> {
  protected source: IEnumerable<T>[];
  constructor(
    source: EnumeratorLike<T>, protected keySelector: (element: T) => TKey = defaultSelector, 
    protected comparer: (first: TKey, second: TKey) => number = defaultComparer, protected descending: boolean
  ) {
    super([]);
    if(descending)
      comparer = (first: TKey, second: TKey) => -1 * defaultComparer(first, second);
    if(source instanceof OrderedEnumerable){
      const grps: IEnumerable<T>[] = source.source;
      this.source = from(grps)
        .select(grp => 
          grp.groupBy(
            keySelector, defaultSelector, 
            (_key, list) => list
          ).toArray()
            .sort((a,b) => 
              comparer(keySelector(a.first()), keySelector(b.first()))
            )
        ).selectMany(defaultSelector, (_outer, inner) => inner).toArray();
    } else {
      this.source = from(source).groupBy(keySelector, defaultSelector, (_key, list) => list)
      .toArray()
      .sort((a,b) => comparer(keySelector(a.first()), keySelector(b.first())));
    }
  }
  get iterable(): Iterable<T> {
    return (function*(source:IEnumerable<T>[]){
      for (const grp of source) {
        yield * grp;
      }
    })(this.source)
  }
  thenBy<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number = defaultComparer): IOrderedEnumerable<T> {
      return new OrderedEnumerable(this, keySelector, comparer, false);
  }
  thenByDescending<TKey>(keySelector: (element: T) => TKey, comparer: (first: TKey, second: TKey) => number = defaultComparer): IOrderedEnumerable<T> {
    return new OrderedEnumerable(this, keySelector, comparer, true);
  }
}