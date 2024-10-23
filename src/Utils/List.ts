import { map } from 'd3';
import { composeComparers, isObj, equal, keyComparer } from './helpers'

type PredicateType<T> = (value: T, index?: number) => boolean
export function list<T>(elements: Iterable<T>): List<T> {
    return new List(elements);
}
function _TrueFn(): true {
    return true;
}
export interface IComparer<T> {
    getHashCode(item: T): string | number;
    equals(a: T, b: T): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _comparer: IComparer<any> = {
    getHashCode: (item) => String(item),
    equals: (a, b) => a === b,
}
export function _mapper<T, TResult = T>(value: T) {
    return value as unknown as TResult;
}
class List<T> implements Iterable<T> {
  protected _elements: Iterable<T> = [];
  /**
   * Make the List iterable and Spreadable
   */
  *[Symbol.iterator]() {
    yield * this.items;
  }
  protected get items(): Iterable<T>{
    return this._elements;
  }
  protected set items(elements: Iterable<T>) {
    this._elements = elements;
  }
  /**
   * property represents the Object name
   */
  get [Symbol.toStringTag]() {
    return 'List' // Expected output: "[object List]"
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
    return list((function*(source) {
        yield * source;
        yield element;
    })(this))
  }

  /**
   * Add an object to the start of the List<T>.
   */
  public Prepend(element: T): List<T> {
    return list((function*(source) {
        yield element;
        yield * source;
    })(this))
  }

  /**
   * Adds the elements of the specified collection to the end of the List<T>.
   */
  public AddRange(elements: Iterable<T>): List<T> {
    return list((function*(source) {
        yield * source;
        yield * elements;
    })(this))
  }

  /**
   * Applies an accumulator function over a sequence.
   */
  public Aggregate<U>(
    accumulator: (accum: U, value: T, index: number) => U,
    initialValue: U
  ): U {
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
  public Any(predicate: PredicateType<T> = _TrueFn): boolean {
    let i = 0;
    for (const element of this) {
        if (predicate(element, i++)) {
            return true;
        }
    }
    return false;
  }

//   /**
//    * Computes the average of a sequence of number values that are obtained by invoking
//    * a transform function on each element of the input sequence.
//    */
//   public Average(
//     transform?: (value?: T, index?: number) => any
//   ): number {
//     return this.Sum(transform) / this.Count(transform)
//   }

  /**
   * Casts the elements of a sequence to the specified type.
   */
  public Cast<U>(): List<U> {
    return list(<Iterable<U>>this);
  }

  /**
   * Removes all elements from the List<T>.
   */
  public Clear(): void {
    this.items = [];
  }

  /**
   * Concatenates two sequences.
   */
  public Concat(list: Iterable<T>): List<T> {
    return this.AddRange(list)
  }

  /**
   * Determines whether an element is in the List<T>.
   */
  public Contains(element: T): boolean {
    return this.Any(x => x === element)
  }

  /**
   * Returns the number of elements in a sequence.
   */
  public Count(predicate: PredicateType<T> = _TrueFn): number {
    if(Array.isArray(this.items)) {
        return (<T[]>this.items).length;
    }
    let count = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  public DefaultIfEmpty(defaultValue?: T): List<T> {
    return this.Any() ? this : new List<T>([defaultValue as T])
  }

  /**
   * Returns distinct elements from a sequence by using the default equality comparer to compare values.
   */
  public Distinct(): List<T> {
    const items = this.Aggregate((accm, value) => {
        accm.add(value);
        return accm;
    }, new Set<T>());
    return list(items);
  }

  /**
   * Returns distinct elements from a sequence according to specified key selector.
   */
  public DistinctBy<TKey>(keySelector: (key: T) => TKey, comparer: IComparer<TKey> = _comparer): List<T> {
    return this.GroupBy(keySelector, _mapper, comparer).Select(grp => grp.First());
  }

  /**
   * Returns the element at a specified index in a sequence.
   */
  public ElementAt(index: number): T {
    const item = this.ElementAtOrDefault(index)
    if (item) {
        return item;
    }
    throw new Error(
      'ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.'
    )
  }

  /**
   * Returns the element at a specified index in a sequence or a default value if the index is out of range.
   */
  public ElementAtOrDefault(index: number): T | null {
    let i = 0;
    for (const element of this) {
        if(i++ === index) {
            return element;
        }
    }
    return null;
  }

  /**
   * Produces the set difference of two sequences by using the default equality comparer to compare values.
   */
  public Except(source: Iterable<T>, comparer: IComparer<T> = _comparer): List<T> {
    const map = list(source).Aggregate((ac, value) => {
        ac.set(comparer.getHashCode(value), value)
        return ac;
    }, new Map<string | number, T>());
    return this.Where(x => !map.has(comparer.getHashCode(x)));
  }

  /**
   * Returns the first element of a sequence.
   */
  public First(predicate: PredicateType<T> = _TrueFn): T {
    const item = this.FirstOrDefault(predicate);
    if (item) {
        return item;
    }
    throw new Error('InvalidOperationException: The source sequence is empty.')
  }

  /**
   * Returns the first element of a sequence, or a default value if the sequence contains no elements.
   */
  public FirstOrDefault(predicate: PredicateType<T> = _TrueFn): T | undefined {
    for (const element of this) {
        if (predicate(element)) {
          return element;
        }
    }
  }

  /**
   * Performs the specified action on each element of the List<T>.
   */
  public ForEach(action: (value?: T, index?: number) => void): void {
    let i = 0;
    for (const element of this) {
        action(element, i++);
    }
  }

  /**
   * Groups the elements of a sequence according to a specified key selector function.
   */
  public GroupBy<TKey, TResult = T>(
    keySelector: (key: T) => TKey,
    mapper: (element: T) => TResult = _mapper,
    comparer: IComparer<TKey> = _comparer
  ): List<Group<TKey, TResult>> {
    const initialValue = new Map<string | number, Group<TKey, TResult>>();
    return list(this.Aggregate((ac, v) => {
      const key = keySelector(v)
      const hashKey = comparer.getHashCode(key);
      const mappedValue = mapper(v)
      const existingGroup = ac.get(hashKey);
      if (existingGroup) {
        existingGroup.add(mappedValue)
      } else {
        ac.set(hashKey, new Group<TKey, TResult>(key, [mappedValue]))
      }
      return ac
    }, initialValue).values())
  }

  /**
   * Correlates the elements of two sequences based on equality of keys and groups the results.
   * The default equality comparer is used to compare keys.
   */
  public GroupJoin<U, R, TKey = T>(
    secondList: Iterable<U>,
    key1: (k: T) => TKey,
    key2: (k: U) => TKey,
    result: (first: T, second: List<U>) => R
  ): List<R> {
    return this.Select(x =>
      result(
        x,
        secondList.Where(z => key1(x) === key2(z))
      )
    )
  }

  /**
   * Returns the index of the first occurence of an element in the List.
   */
  public IndexOf(element: T): number {
    let i = 0;
    for (const item of this) {
        if(element === item){
            return i;
        }
        i++;
    }
    return -1;
  }

  /**
   * Inserts an element into the List<T> at the specified index.
   */
  public Insert(element: T, index?: number): void | Error {
    this.items = (function*(items){
        let i = 0;
        for (const item of items) {
            if(i++ === index) {
                yield element;
            }
            yield item;
        }
    })(this);
    
  }

  /**
   * Produces the set intersection of two sequences by using the default equality comparer to compare values.
   */
  public Intersect(source: List<T>): List<T> {
    return this.Where(x => source.Contains(x))
  }

  /**
   * Correlates the elements of two sequences based on matching keys. The default equality comparer is used to compare keys.
   */
  public Join<U, R>(
    list: List<U>,
    key1: (key: T) => any,
    key2: (key: U) => any,
    result: (first: T, second: U) => R
  ): List<R> {
    return this.SelectMany(x =>
      list.Where(y => key2(y) === key1(x)).Select(z => result(x, z))
    )
  }

  /**
   * Returns the last element of a sequence.
   */
  public Last(predicate?: PredicateType<T>): T {
    if (this.Count()) {
      return predicate
        ? this.Where(predicate).Last()
        : this._elements[this.Count() - 1]
    }
    throw Error('InvalidOperationException: The source sequence is empty.')
  }

  /**
   * Returns the last element of a sequence, or a default value if the sequence contains no elements.
   */
  public LastOrDefault(defaultValue: T): T {
    return this.Count() ? this.Last() : defaultValue
  }

  /**
   * Returns the maximum value in a generic sequence.
   */
  public Max(selector?: (element: T, index: number) => number): number {
    const identity = (x: T): number => x as number
    return Math.max(...this.Select(selector || identity).ToList())
  }

  /**
   * Returns the minimum value in a generic sequence.
   */
  public Min(selector?: (element: T, index: number) => number): number {
    const identity = (x: T): number => x as number
    return Math.min(...this.Select(selector || identity).ToList())
  }

  /**
   * Filters the elements of a sequence based on a specified type.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public OfType<U>(type: any): List<U> {
    let typeName: string | null
    switch (type) {
      case Number:
        typeName = typeof 0
        break
      case String:
        typeName = typeof ''
        break
      case Boolean:
        typeName = typeof true
        break
      case Function:
        typeName = typeof function() {} // tslint:disable-line no-empty
        break
      default:
        typeName = null
        break
    }
    return typeName === null
      ? this.Where(x => x instanceof type).Cast<U>()
      : this.Where(x => typeof x === typeName).Cast<U>()
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   */
  public OrderBy(
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, false)
  ): List<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(this._elements, comparer)
  }

  /**
   * Sorts the elements of a sequence in descending order according to a key.
   */
  public OrderByDescending(
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, true)
  ): List<T> {
    // tslint:disable-next-line: no-use-before-declare
    return new OrderedList<T>(this._elements, comparer)
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   */
  public ThenBy(keySelector: (key: T) => any): List<T> {
    return this.OrderBy(keySelector)
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   */
  public ThenByDescending(keySelector: (key: T) => any): List<T> {
    return this.OrderByDescending(keySelector)
  }

  /**
   * Removes the first occurrence of a specific object from the List<T>.
   */
  public Remove(element: T): boolean {
    return this.IndexOf(element) !== -1
      ? (this.RemoveAt(this.IndexOf(element)), true)
      : false
  }

  /**
   * Removes all the elements that match the conditions defined by the specified predicate.
   */
  public RemoveAll(predicate: PredicateType<T>): List<T> {
    return this.Where((value, index, list) => !predicate(value, index, list))
  }

  /**
   * Removes the element at the specified index of the List<T>.
   */
  public RemoveAt(index: number): void {
    this._elements.splice(index, 1)
  }

  /**
   * Reverses the order of the elements in the entire List<T>.
   */
  public Reverse(): List<T> {
    return new List<T>(this._elements.reverse())
  }

  /**
   * Projects each element of a sequence into a new form.
   */
  public Select<TOut>(
    selector: (element: T, index: number) => TOut
  ): List<TOut> {
    return new List<TOut>(this._elements.map(selector))
  }

  /**
   * Projects each element of a sequence to a List<any> and flattens the resulting sequences into one sequence.
   */
  public SelectMany<TOut extends List<any>>(
    selector: (element: T, index: number) => TOut
  ): TOut {
    return this.Aggregate(
      (ac, _, i) => (
        ac.AddRange(
          this.Select(selector)
            .ElementAt(i)
            .ToArray()
        ),
        ac
      ),
      new List<TOut>()
    )
  }

  /**
   * Determines whether two sequences are equal by comparing the elements by using the default equality comparer for their type.
   */
  public SequenceEqual(list: List<T>): boolean {
    return this.All(e => list.Contains(e))
  }

  /**
   * Returns the only element of a sequence, and throws an exception if there is not exactly one element in the sequence.
   */
  public Single(predicate?: PredicateType<T>): T {
    if (this.Count(predicate) !== 1) {
      throw new Error('The collection does not contain exactly one element.')
    }
    return this.First(predicate)
  }

  /**
   * Returns the only element of a sequence, or a default value if the sequence is empty;
   * this method throws an exception if there is more than one element in the sequence.
   */
  public SingleOrDefault(defaultValue: T): T {
    return this.Count() ? this.Single() : defaultValue
  }
  /**
   * Bypasses a specified number of elements in a sequence and then returns the remaining elements.
   */
  public Skip(amount: number): List<T> {
    return new List<T>(this._elements.slice(Math.max(0, amount)))
  }

  /**
   * Omit the last specified number of elements in a sequence and then returns the remaining elements.
   */
  public SkipLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, -Math.max(0, amount)))
  }

  /**
   * Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.
   */
  public SkipWhile(predicate: PredicateType<T>): List<T> {
    return this.Skip(
      this.Aggregate(ac => (predicate(this.ElementAt(ac)) ? ++ac : ac), 0)
    )
  }

  /**
   * Computes the sum of the sequence of number values that are obtained by invoking
   * a transform function on each element of the input sequence.
   */
  public Sum(
    transform?: (value?: T, index?: number) => number
  ): number {
    return transform
      ? this.Select(transform).Sum()
      : this.Aggregate((ac, v) => (ac += +v), 0)
  }

  /**
   * Returns a specified number of contiguous elements from the start of a sequence.
   */
  public Take(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, Math.max(0, amount)))
  }

  /**
   * Returns a specified number of contiguous elements from the end of a sequence.
   */
  public TakeLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(-Math.max(0, amount)))
  }

  /**
   * Returns elements from a sequence as long as a specified condition is true.
   */
  public TakeWhile(predicate: PredicateType<T>): List<T> {
    return this.Take(
      this.Aggregate(ac => (predicate(this.ElementAt(ac)) ? ++ac : ac), 0)
    )
  }

  /**
   * Copies the elements of the List<T> to a new array.
   */
  public ToArray(): T[] {
    return this._elements
  }

  /**
   * Creates a Dictionary<TKey, TValue> from a List<T> according to a specified key selector function.
   */
  public ToDictionary<TKey, TValue>(
    key: (key: T) => TKey,
    value?: (value: T) => TValue
  ): List<{ Key: TKey; Value: T | TValue }> {
    return this.Aggregate((dicc, v, i) => {
      // const dictionaryKey = String(this.Select(key).ElementAt(i))
      // ;((dicc as unknown) as Record<string, T | TValue>)[dictionaryKey] = value
      //   ? this.Select(value).ElementAt(i)
      //   : v
      dicc.Add({
        Key: this.Select(key).ElementAt(i),
        Value: !!value ? this.Select(value).ElementAt(i) : v
      })
      return dicc
    }, new List<{ Key: TKey; Value: T | TValue }>())
  }

  /**
   * Creates a List<T> from an Enumerable.List<T>.
   */
  public ToList(): List<T> {
    return this
  }

  /**
   * Creates a Lookup<TKey, TElement> from an IEnumerable<T> according to specified key selector and element selector functions.
   */
  public ToLookup<TResult>(
    keySelector: (key: T) => string | number,
    elementSelector: (element: T) => TResult
  ): { [key: string]: TResult[] } {
    return this.GroupBy(keySelector, elementSelector)
  }

  /**
   * Produces the set union of two sequences by using the default equality comparer.
   */
  public Union(list: List<T>): List<T> {
    return this.Concat(list).Distinct()
  }

  /**
   * Filters a sequence of values based on a predicate.
   */
  public Where(predicate: PredicateType<T>): List<T> {
    return new List<T>(this._elements.filter(predicate))
  }

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   */
  public Zip<U, TOut>(
    list: List<U>,
    result: (first: T, second: U) => TOut
  ): List<TOut> {
    return list.Count() < this.Count()
      ? list.Select((x, y) => result(this.ElementAt(y), x))
      : this.Select((x, y) => result(x, list.ElementAt(y)))
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
    super(elements)
    this._elements.sort(this._comparer)
  }

  /**
   * Allows you to get the parent List out of the OrderedList
   * @override
   * @returns and ordered list turned into a regular List<T>
   */
  public ToList(): List<T> {
    return new List<T>(this)
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
   * @override
   */
  public ThenBy(keySelector: (key: T) => any): List<T> {
    return new OrderedList(
      this._elements,
      composeComparers(this._comparer, keyComparer(keySelector, false))
    )
  }

  /**
   * Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.
   * @override
   */
  public ThenByDescending(keySelector: (key: T) => any): List<T> {
    return new OrderedList(
      this._elements,
      composeComparers(this._comparer, keyComparer(keySelector, true))
    )
  }
}

export default List

/**
 * An interface for linked lists, which shares the common methods.
 */
export interface ILinkedList<T> {
    isEmpty(): boolean
    get(index: number): T | null | undefined
    push(data: T): void
    pop(): T | undefined
    append(data: T): void
    removeTail(): T | undefined
    insertAt(index: number, data: T): void
    removeAt(index: number): T | undefined
    clear(): void
    toArray(): (T | undefined)[]
    getLength(): number
  }

/**
 * This is an implementation of a Doubly Linked List.
 * A Doubly Linked List is a data structure that contains a head, tail and length property.
 * Linked Lists consist of nodes, and each node has a value and a pointer to the next and previous node (can be null).
 *
 * @see https://www.geeksforgeeks.org/doubly-linked-list/
 *
 * @template T The type of the value of the nodes.
 * @property head The head of the list.
 * @property tail The tail of the list.
 * @property length The length of the list.
 */
export class DoublyLinkedList<T> extends List<T> implements ILinkedList<T>, Iterable<T> {
  private head?: DoublyLinkedListNode<T> = undefined
  private tail?: DoublyLinkedListNode<T> = undefined
  private length: number = 0
    constructor(private comparer: IComparer<T> = _comparer){
        super();
    }
  /**
   * Checks if the list is empty.
   *
   * @returns {boolean} Whether the list is empty or not.
   */
  isEmpty(): boolean {
    return !this.head
  }

  /**
   * Gets a value of a node at a specific index.
   * Time complexity: O(n)
   *
   * @param index The index of the node.
   * @returns The value of a node at the specified index.
   */
  get(index: number): T | null {
    if (index < 0 || index >= this.length) {
      return null
    }

    let currentNode: DoublyLinkedListNode<T> | undefined = this.head
    for (let i: number = 0; i < index; i++) {
      currentNode = currentNode?.next
    }

    return currentNode?.value ?? null
  }

  /**
   * Inserts a node at the head of the list.
   * Time complexity: O(1)
   *
   * @param value The value of the node being inserted.
   */
  push(value: T): void {
    const newNode = new DoublyLinkedListNode(value)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.head.prev = newNode
      newNode.next = this.head
      this.head = newNode
    }

    this.length++
  }

  /**
   * Removes a node from the head of the list.
   * Time complexity: O(1)
   *
   * @returns The value of the node that was removed.
   * @throws Index out of bounds if the list is empty.
   */
  pop(): T {
    if (!this.head) {
      throw new Error('Index out of bounds')
    }

    const removedNode = this.head

    if (this.head === this.tail) {
      this.tail = undefined
    } else {
      this.head.next!.prev = undefined
    }

    this.head = this.head.next
    this.length--

    return removedNode.value
  }

  /**
   * Inserts a node at the tail of the list.
   * Time complexity: O(1)
   *
   * @param value The value of the node being inserted.
   */
  append(value: T): void {
    const newNode = new DoublyLinkedListNode(value)

    if (!this.head) {
      this.head = newNode
    } else {
      this.tail!.next = newNode
      newNode.prev = this.tail
    }

    this.tail = newNode
    this.length++
  }

  /**
   * Removes a node from the tail of the list.
   * Time complexity: O(1)
   *
   * @returns The value of the node that was removed.
   * @throws Index out of bounds if the list is empty.
   */
  removeTail(): T {
    if (!this.head) {
      throw new Error('Index out of bounds')
    }

    const removedNode = this.tail

    if (this.head === this.tail) {
      this.head = undefined
    } else {
      this.tail!.prev!.next = undefined
    }

    this.tail = this.tail!.prev
    this.length--

    return removedNode!.value
  }
  /**
   * Inserts a node at a specific index.
   * Time complexity: O(n)
   *
   * @param index The index where the node will be inserted.
   * @param value The value of the node being inserted.
   * @throws Index out of bounds if the index is not valid.
   */
  insertAt(index: number, value: T): void {
    if (index < 0 || index > this.length) {
      throw new Error('Index out of bounds')
    }

    if (index === 0) {
      this.push(value)
      return
    }

    if (index === this.length) {
      this.append(value)
      return
    }

    const newNode = new DoublyLinkedListNode(value)
    let prevNode: DoublyLinkedListNode<T> | undefined = this.head
    for (let i: number = 0; i < index - 1; i++) {
      prevNode = prevNode?.next
    }
    const nextNode = prevNode?.next

    prevNode!.next = newNode
    newNode.prev = prevNode
    newNode.next = nextNode
    nextNode!.prev = newNode

    this.length++
  }

  /**
   * Removes a node at a specific index.
   * Time complexity: O(n)
   *
   * @param index The index of the node to be removed.
   * @returns The value of the node that was removed.
   * @throws Index out of bounds if the index is not valid.
   */
  removeAt(index: number): T {
    if (index < 0 || index >= this.length) {
      throw new Error('Index out of bounds')
    }

    if (index === 0) {
      return this.pop()
    }

    if (index === this.length - 1) {
      return this.removeTail()
    }

    let removedNode: DoublyLinkedListNode<T> | undefined = this.head
    for (let i: number = 0; i < index; i++) {
      removedNode = removedNode?.next
    }
    removedNode!.prev!.next = removedNode!.next
    removedNode!.next!.prev = removedNode!.prev

    this.length--

    return removedNode!.value
  }
  public Remove(element: T): boolean {
      const prev = 
  }
  /**
   * Reverses the list.
   * Time complexity: O(n)
   *
   * @returns The reversed list or null if the list is empty.
   */
  reverse(): DoublyLinkedList<T> | null {
    if (!this.head) {
      return null
    }

    let currentNode: DoublyLinkedListNode<T> | undefined = this.head
    let nextNode: DoublyLinkedListNode<T> | undefined = undefined
    let prevNode: DoublyLinkedListNode<T> | undefined = undefined

    while (currentNode) {
      nextNode = currentNode.next
      prevNode = currentNode.prev

      currentNode.next = prevNode
      currentNode.prev = nextNode

      prevNode = currentNode
      currentNode = nextNode
    }

    this.tail = this.head
    this.head = prevNode

    return this
  }

  /**
   * Clears the list.
   */
  clear(): void {
    this.head = undefined
    this.tail = undefined
    this.length = 0
  }
  protected get items(): Iterable<T> {
    return (function*(head){
    let currentNode: DoublyLinkedListNode<T> | undefined = head;
    while (currentNode) {
        yield currentNode.value
        currentNode = currentNode.next
    }
    })(this.head)
  }
  /**
   * Converts the list to an array.
   *
   * @returns The array representation of the list.
   */
  toArray(): T[] {
    return Array.from(this.items)
  }

  /**
   * Gets the length of the list.
   *
   * @returns The length of the list.
   */
  getLength(): number {
    return this.length
  }
}

/**
 * Represents a node in a doubly linked list.
 *
 * @template T The type of the value stored in the node.
 * @property value The value stored in the node.
 * @property next The next node after this node.
 * @property prev The previous node before this node.
 */
class DoublyLinkedListNode<T> {
  constructor(
    public value: T,
    public next?: DoublyLinkedListNode<T>,
    public prev?: DoublyLinkedListNode<T>
  ) {}
}

class Group<TKey, TValue> extends List<TValue> implements Iterable<TValue> {
    private linkedList: DoublyLinkedList<TValue> = new DoublyLinkedList<TValue>();
    constructor(private _key: TKey, items: Iterable<TValue>) {
        super();
        for (const element of items) {
            this.linkedList.push(element);
        }
    }
    public add(value: TValue): void {
        this.linkedList.push(value);
    }
    protected get items(): Iterable<TValue> {
        return this.linkedList;
    }
    public get key(): TKey { return this._key; }
}

/**
 * This interface is a representation of the Map data structure.
 */
export interface Map<K, V> {
    getSize(): number
    set(key: K, value: V): void
    get(key: K): V | null
    delete(key: K): void
    has(key: K): boolean
    clear(): void
    keys(): K[]
    values(): V[]
    entries(): Iterable<MapEntry<K, V>>
  }

/**
 * Represents a hash map.
 * Time complexity:
 * - Set, Get, Delete, Has: O(1) on average, O(n) in the worst case.
 * - Clear: O(m) where m is the number of buckets.
 * - Keys, Values, Entires: O(n + m).
 *
 * @template K The key type.
 * @template V The value type.
 * @param size The size of the hash map.
 * @param buckets The buckets in which to store the key-value pairs.
 * @param loadFactor The load factor to determine when to resize the hash map.
 */
export class HashMap<K, V> extends List<MapEntry<K, V>> implements Map<K, V> {
  private size!: number
  private buckets: Map<string | number, DoublyLinkedList<MapEntry<K, V>>> = new Map()
  constructor(private comparer: IComparer<K> = _comparer) {
    super()
    this.clear()
  }
  protected get items(): Iterable<MapEntry<K, V>> {
    return (function*(buckets){
    for (const bucket of buckets.values()) {
        yield * bucket;
    }
    })(this.buckets)
  }
  /**
   * Gets the size.
   *
   * @returns The size.
   */
  getSize(): number {
    return this.size
  }

  /**
   * Sets a key-value pair.
   *
   * @param key The key.
   * @param value The value.
   */
  set(key: K, value: V): void {
    const hashKey = this.comparer.getHashCode(key)
    let bucket = this.buckets.get(hashKey);
    if (!bucket) {
        bucket = new DoublyLinkedList();
        this.buckets.set(hashKey, bucket)
    }
    if (!bucket.Any(x => this.comparer.equals(x.key, key))){
        bucket.push(new MapEntry(key, value))
        this.size++
        return
    }
  }

  /**
   * Gets a value.
   *
   * @param key The key to get the value for.
   * @returns The value or null if the key does not exist.
   */
  get(key: K): V | null {
    const hashKey = this.comparer.getHashCode(key)
    const bucket = this.buckets.get(hashKey);
    if (bucket) {
        for (const entry of bucket) {
            if (this.comparer.equals(entry.key, key)) {
              return entry.value
            }
        }
    }
    return null;
  }

  /**
   * Deletes a key-value pair.
   *
   * @param key The key whose key-value pair to delete.
   */
  delete(key: K): void {
    const index = this.hash(key)
    const bucket = this.buckets[index]

    for (const entry of bucket) {
      if (entry.key === key) {
        bucket.splice(bucket.indexOf(entry), 1)
        this.size--
        return
      }
    }
  }

  /**
   * Checks if a key exists.
   *
   * @param key The key.
   * @returns Whether the key exists.
   */
  has(key: K): boolean {
    const index = this.hash(key)
    const bucket = this.buckets[index]

    for (const entry of bucket) {
      if (entry.key === key) {
        return true
      }
    }

    return false
  }

  /**
   * Clears the hash map.
   */
  clear(): void {
    this.size = 0
    this.initializeBuckets(16)
  }

  /**
   * Gets all keys.
   *
   * @returns The keys.
   */
  keys(): K[] {
    const keys: K[] = []
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        keys.push(entry.key)
      }
    }

    return keys
  }

  /**
   * Gets all values.
   *
   * @returns The values.
   */
  values(): V[] {
    const values: V[] = []
    for (const bucket of this.buckets) {
      for (const entry of bucket) {
        values.push(entry.value)
      }
    }

    return values
  }

  /**
   * Gets all entries.
   *
   * @returns The entries.
   */
  entries(): Iterable<MapEntry<K, V>> {
    return this
  }
}

/**
 * Represents a key-value pair.
 *
 * @template K The type of the key.
 * @template V The type of the value.
 * @param key The key.
 * @param value The value.
 */
export class MapEntry<K, V> {
  key: K
  value: V

  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }
}