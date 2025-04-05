import List, { list } from "./List";

/**
 * An interface for linked lists, which shares the common methods.
 */
export interface ILinkedList<T> {
  isEmpty(): boolean;
  get(index: number): T | null | undefined;
  prepend(data: T): void;
  pop(): T | undefined;
  append(data: T): void;
  removeTail(): T | undefined;
  insertAt(index: number, data: T): void;
  removeAt(index: number): T | undefined;
  clear(): void;
  toArray(): (T | undefined)[];
  getLength(): number;
}

export class DoublyLinkedList<T> implements ILinkedList<T>, Iterable<T> {
  private head?: DoublyLinkedListNode<T> = undefined;
  private tail?: DoublyLinkedListNode<T> = undefined;
  private length: number = 0;
  constructor(private equals: (a: T, b: T) => boolean = (a, b) => a === b) {}
  *[Symbol.iterator]() {
    yield* this.items;
  }
  public getNodes (): Iterable<DoublyLinkedListNode<T>>{
    return (function * (node){
      while (node) {
        yield node;
        node = node.next;
      }
    })(this.head);
  }
  /**
   * Checks if the list is empty.
   *
   * @returns {boolean} Whether the list is empty or not.
   */
  isEmpty(): boolean {
    return !this.head;
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
      return null;
    }

    let currentNode: DoublyLinkedListNode<T> | undefined = this.head;
    for (let i: number = 0; i < index; i++) {
      currentNode = currentNode?.next;
    }

    return currentNode?.value ?? null;
  }
  getNodeAt(index: number): DoublyLinkedListNode<T> | null {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let currentNode: DoublyLinkedListNode<T> | undefined = this.head;
    for (let i: number = 0; i < index; i++) {
      currentNode = currentNode?.next;
    }

    return currentNode ?? null;
  }

  /**
   * Inserts a node at the head of the list.
   * Time complexity: O(1)
   *
   * @param value The value of the node being inserted.
   */
  prepend(value: T): void {
    const newNode = new DoublyLinkedListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.head.prev = newNode;
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
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
      throw new Error("Index out of bounds");
    }

    const removedNode = this.head;

    if (this.head === this.tail) {
      this.tail = undefined;
    } else {
      this.head.next!.prev = undefined;
    }

    this.head = this.head.next;
    this.length--;

    return removedNode.value;
  }

  /**
   * Inserts a node at the tail of the list.
   * Time complexity: O(1)
   *
   * @param value The value of the node being inserted.
   */
  append(value: T): void {
    const newNode = new DoublyLinkedListNode(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
    }

    this.tail = newNode;
    this.length++;
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
      throw new Error("Index out of bounds");
    }

    const removedNode = this.tail;

    if (this.head === this.tail) {
      this.head = undefined;
    } else {
      this.tail!.prev!.next = undefined;
    }

    this.tail = this.tail!.prev;
    this.length--;

    return removedNode!.value;
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
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      this.prepend(value);
      return;
    }

    if (index === this.length) {
      this.append(value);
      return;
    }

    const newNode = new DoublyLinkedListNode(value);
    let prevNode: DoublyLinkedListNode<T> | undefined = this.head;
    for (let i: number = 0; i < index - 1; i++) {
      prevNode = prevNode?.next;
    }
    const nextNode = prevNode?.next;

    prevNode!.next = newNode;
    newNode.prev = prevNode;
    newNode.next = nextNode;
    nextNode!.prev = newNode;

    this.length++;
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
      throw new Error("Index out of bounds");
    }

    if (index === 0) {
      return this.pop();
    }

    if (index === this.length - 1) {
      return this.removeTail();
    }

    let removedNode: DoublyLinkedListNode<T> | undefined = this.head;
    for (let i: number = 0; i < index; i++) {
      removedNode = removedNode?.next;
    }
    removedNode!.prev!.next = removedNode!.next;
    removedNode!.next!.prev = removedNode!.prev;

    this.length--;

    return removedNode!.value;
  }
  public remove(node: DoublyLinkedListNode<T>) {
    let flag = 2;
    if (node.prev) {
      node.prev!.next = node.next;
    } else if (this.head === node) {
      this.head = node.next;
    } else {
      flag--;
    }
    if (node.next) {
      node.next!.prev = node.prev;
    } else if (this.tail === node) {
      this.tail = node.prev;
    } else {
      flag--;
    }
    if (flag > 0) this.length--;
  }
  /**
   * Reverses the list.
   * Time complexity: O(n)
   *
   * @returns The reversed list or null if the list is empty.
   */
  reverse(): DoublyLinkedList<T> | null {
    if (!this.head) {
      return null;
    }

    let currentNode: DoublyLinkedListNode<T> | undefined = this.head;
    let nextNode: DoublyLinkedListNode<T> | undefined = undefined;
    let prevNode: DoublyLinkedListNode<T> | undefined = undefined;

    while (currentNode) {
      nextNode = currentNode.next;
      prevNode = currentNode.prev;

      currentNode.next = prevNode;
      currentNode.prev = nextNode;

      prevNode = currentNode;
      currentNode = nextNode;
    }

    this.tail = this.head;
    this.head = prevNode;

    return this;
  }

  /**
   * Clears the list.
   */
  clear(): void {
    this.head = undefined;
    this.tail = undefined;
    this.length = 0;
  }
  protected get items(): Iterable<T> {
    return (function* (head) {
      let currentNode: DoublyLinkedListNode<T> | undefined = head;
      while (currentNode) {
        yield currentNode.value;
        currentNode = currentNode.next;
      }
    })(this.head);
  }
  protected set items(values: Iterable<T>) {
    this.head = this.tail = undefined;
    for (const element of values) {
      this.append(element);
    }
  }
  /**
   * Converts the list to an array.
   *
   * @returns The array representation of the list.
   */
  toArray(): T[] {
    return Array.from(this.items);
  }

  /**
   * Gets the length of the list.
   *
   * @returns The length of the list.
   */
  getLength(): number {
    return this.length;
  }

  toList(): List<T> {
    return list(this);
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
export class DoublyLinkedListNode<T> {
  constructor(public value: T, public next?: DoublyLinkedListNode<T>, public prev?: DoublyLinkedListNode<T>) {}
}
