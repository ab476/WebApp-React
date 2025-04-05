import { DoublyLinkedList } from "./DoublyLinkedList";
import List, { list } from "./List";

export class Group<TKey, TValue> implements Iterable<TValue> {
  private linkedList: DoublyLinkedList<TValue> = new DoublyLinkedList<TValue>();
  constructor(private readonly _key: TKey, items: Iterable<TValue>) {
    for (const element of items) {
      this.linkedList.append(element);
    }
  }
  *[Symbol.iterator]() {
    yield * this.linkedList;
  }
  public add(value: TValue): void {
    this.linkedList.append(value);
  }
  public get items(): Iterable<TValue> {
    return this.linkedList;
  }
  public set items(values: Iterable<TValue>) {
    this.linkedList = new DoublyLinkedList();
    for (const element of values) {
      this.linkedList.append(element);
    }
  }
  public get key(): TKey {
    return this._key;
  }
  public toArray(): TValue[] {
    return this.linkedList.toArray();
  }
  public toList(): List<TValue> {
    return list(this);
  }
}