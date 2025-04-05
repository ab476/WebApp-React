import { DoublyLinkedList } from "./DoublyLinkedList";
import { IComparer, COMPARER, list } from "./List";

/**
 * This interface is a representation of the Map data structure.
 */
export interface IHashMap<K, V> extends Iterable<MapEntry<K, V>> {
  getSize(): number;
  set(key: K, value: V): void;
  get(key: K): V | null;
  delete(key: K): void;
  has(key: K): boolean;
  clear(): void;
  keys(): K[];
  values(): V[];
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
export class HashMap<K, V> implements IHashMap<K, V> {
  private size: number = 0;
  private buckets: Map<string | number, DoublyLinkedList<MapEntry<K, V>>> = new Map();
  constructor(private comparer: IComparer<K> = COMPARER) {}
  *[Symbol.iterator]() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, list] of this.buckets) {
      yield* list;
    }
  }
  protected get items(): Iterable<MapEntry<K, V>> {
    return (function* (buckets) {
      for (const bucket of buckets.values()) {
        yield* bucket;
      }
    })(this.buckets);
  }
  /**
   * Gets the size.
   *
   * @returns The size.
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Sets a key-value pair.
   *
   * @param key The key.
   * @param value The value.
   */
  set(key: K, value: V): void {
    const hashKey = this.comparer.getHashCode(key);
    let bucket = this.buckets.get(hashKey);
    if (!bucket) {
      bucket = new DoublyLinkedList();
      this.buckets.set(hashKey, bucket);
    }
    for(const node of bucket.getNodes()) {
      if(this.comparer.equals(node.value.key, key)){
        node.value = new MapEntry(key, value);
        return;
      }
    }
    this.size++;
    bucket.append(new MapEntry(key, value));
  }

  /**
   * Gets a value.
   *
   * @param key The key to get the value for.
   * @returns The value or null if the key does not exist.
   */
  get(key: K): V | null {
    const hashKey = this.comparer.getHashCode(key);
    const bucket = this.buckets.get(hashKey);
    if (bucket) {
      for (const entry of bucket) {
        if (this.comparer.equals(entry.key, key)) {
          return entry.value;
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
    const hashKey = this.comparer.getHashCode(key);
    const bucket = this.buckets.get(hashKey);
    if (bucket) {
      let i = 0;
      for (const entry of bucket) {
        if (this.comparer.equals(entry.key, key)) {
          bucket.removeAt(i);
          this.size--;
          return;
        }
        i++;
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
    const hashKey = this.comparer.getHashCode(key);
    const bucket = this.buckets.get(hashKey);
    if (bucket) {
      for (const entry of bucket) {
        if (this.comparer.equals(entry.key, key)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Clears the hash map.
   */
  clear(): void {
    this.size = 0;
    this.buckets = new Map();
  }

  /**
   * Gets all keys.
   *
   * @returns The keys.
   */
  keys(): K[] {
    return [...(function * (buckets){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, bucket] of buckets) {
        for (const item of bucket) {
          yield item.key;
        }
      }
    })(this.buckets)];
  }

  /**
   * Gets all values.
   *
   * @returns The values.
   */
  values(): V[] {
    return [...(function * (buckets){
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, bucket] of buckets) {
        for (const item of bucket) {
          yield item.value;
        }
      }
    })(this.buckets)];
  }
  toList(){
    return list(this);
  }
}
export function mapEntry<K, V>(key: K, value: V) {
  return new MapEntry(key, value);
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
  constructor(public key: K, public value: V) {
  }
}
