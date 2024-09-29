///////////////
// Collections
import { EnumeratorLike, hashString } from "./Enumerable-Interfaces";
import { IEnumerable } from "./IEnumerable";

// LinkedList for Dictionary
export interface ILinkListNode<T extends ILinkListNode<T>> {
  prev: T | null;
  next: T | null;
}
export class HashEntry<TKey, TValue> implements ILinkListNode<HashEntry<TKey, TValue>> {
  public prev: HashEntry<TKey, TValue> | null = null;
  public next: HashEntry<TKey, TValue> | null = null;
  constructor(public key: TKey, public value: TValue) {}
}
export class Entry<T> implements ILinkListNode<Entry<T>> {
  prev: Entry<T> | null = null;
  next: Entry<T> | null = null;
  constructor(public value: T){

  }
}
export enum EDualEntryType {
  Master,
  Child,
}
export class KeyValue<TKey, TValue> {
  constructor(public readonly key: TKey, public readonly value: TValue) {}
}
export function keyValue<TKey, TValue>(key: TKey, value: TValue): KeyValue<TKey, TValue> {
  return new KeyValue<TKey, TValue>(key, value);
}

export interface IDictionaryArgs<T, TKey, TValue> {
  source: EnumeratorLike<T>;
  keySelector: (value: T) => TKey;
  elementSelector: (value: T) => TValue;
}
export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValue<TKey, TValue>>, Iterable<KeyValue<TKey, TValue>> {
  add(key: TKey, value: TValue): void;
  addRange<T>(dictionaryArgs: IDictionaryArgs<T, TKey, TValue>): IDictionary<TKey, TValue>;
  get(key: TKey): TValue;
  tryGet(key: TKey): TValue | undefined
  set(key: TKey, value: TValue): void;
  containsKey(key: TKey): boolean;
  clear(): void;
  remove(key: TKey): boolean;
  count(): number;
  toEnumerable(): IEnumerable<{ key: TKey; value: TValue }>;
}
export interface ICompareSelector<T> {
  getHashCode(item: T): number | string;
  equals(a: T, b: T): boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultCompareSelector: ICompareSelector<any> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHashCode: function (item: any): number | string {
    return hashString(item);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals: function (a: any, b: any): boolean {
    return a === b;
  },
};

// tryGetNext yielder
// export class Yielder<T> {
//   _current: T = null!;
//   current(): T {
//     return this._current;
//   }
//   yieldReturn(value: T): true {
//     this._current = value;
//     return true;
//   }
//   yieldBreak(): false {
//     return false;
//   }
// }
// export interface IEnumerator<T> {
//   current(): T;
//   moveNext(): boolean;
//   dispose(): void;
// }
// export enum YielderState {
//   Before = 0,
//   Running = 1,
//   After = 2,
// }
// export class Enumerator<T> extends Enumerable<T> implements IEnumerator<T>, Iterable<T> {
//   constructor(private initialize: () => void, private tryGetNext: (yilder: Yielder<T>) => boolean, private _dispose: () => void) {
//     super([]);
//   }
//   get iterable(): Iterable<T> {
//     return (this._Iterable = (function* (enumerator: Enumerator<T>) {
//       enumerator.initialize();
//       while (enumerator.moveNext()) {
//         yield enumerator.current();
//       }
//       enumerator.dispose();
//     })(this));
//   }
//   set iterable(source: Iterable<T>) {
//     this._Iterable = source;
//   }
//   yielder = new Yielder<T>();
//   state = YielderState.Before;
//   //this.current = yielder.current;
//   current(): T {
//     return this.yielder.current();
//   }
//   moveNext(): boolean {
//     try {
//       switch (this.state) {
//         case YielderState.Before:
//           this.state = YielderState.Running;
//           this.initialize();
//         // fall through

//         case YielderState.Running:
//           if (this.tryGetNext(this.yielder)) {
//             return true;
//           } else {
//             this.dispose();
//             return false;
//           }
//         // fall through

//         case YielderState.After:
//           return false;
//       }
//     } catch (e) {
//       this.dispose();
//       throw e;
//     }
//   }

//   dispose(): void {
//     if (this.state != YielderState.Running) return;

//     try {
//       this._dispose();
//     } finally {
//       this.state = YielderState.After;
//     }
//   }
// }
