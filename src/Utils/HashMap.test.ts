/* eslint-disable @typescript-eslint/no-explicit-any */
import { HashMap, mapEntry, MapEntry } from "./HashMap";
import { IComparer } from "./List";

describe("mapEntry function", () => {
  test("should create a MapEntry instance with correct key and value", () => {
    const key = "testKey";
    const value = "testValue";

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });

  test("should work with number keys and values", () => {
    const key = 42;
    const value = 100;

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });

  test("should work with objects as keys and values", () => {
    const key = { id: 1 };
    const value = { name: "Test Object" };

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toEqual(key);
    expect(entry.value).toEqual(value);
  });

  test("should work with arrays as keys and values", () => {
    const key = [1, 2, 3];
    const value = ["a", "b", "c"];

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toEqual(key);
    expect(entry.value).toEqual(value);
  });

  test("should work with mixed data types for key and value", () => {
    const key = "key";
    const value = { id: 1, name: "value" };

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBe(key);
    expect(entry.value).toEqual(value);
  });

  test("should handle undefined key and value", () => {
    const key = undefined;
    const value = undefined;

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBeUndefined();
    expect(entry.value).toBeUndefined();
  });

  test("should handle null key and value", () => {
    const key = null;
    const value = null;

    const entry = mapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBeNull();
    expect(entry.value).toBeNull();
  });
});

describe("MapEntry class", () => {
  test("should create an instance with the correct key and value", () => {
    const key = "testKey";
    const value = "testValue";

    const entry = new MapEntry(key, value);

    expect(entry).toBeInstanceOf(MapEntry);
    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });

  test("should work with number keys and values", () => {
    const key = 42;
    const value = 100;

    const entry = new MapEntry(key, value);

    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });

  test("should work with object keys and values", () => {
    const key = { id: 1 };
    const value = { name: "Test Object" };

    const entry = new MapEntry(key, value);

    expect(entry.key).toEqual(key);
    expect(entry.value).toEqual(value);
  });

  test("should work with arrays as keys and values", () => {
    const key = [1, 2, 3];
    const value = ["a", "b", "c"];

    const entry = new MapEntry(key, value);

    expect(entry.key).toEqual(key);
    expect(entry.value).toEqual(value);
  });

  test("should work with mixed data types for key and value", () => {
    const key = "key";
    const value = { id: 1, name: "value" };

    const entry = new MapEntry(key, value);

    expect(entry.key).toBe(key);
    expect(entry.value).toEqual(value);
  });

  test("should handle undefined key and value", () => {
    const key = undefined;
    const value = undefined;

    const entry = new MapEntry(key, value);

    expect(entry.key).toBeUndefined();
    expect(entry.value).toBeUndefined();
  });

  test("should handle null key and value", () => {
    const key = null;
    const value = null;

    const entry = new MapEntry(key, value);

    expect(entry.key).toBeNull();
    expect(entry.value).toBeNull();
  });

  test("should work with functions as keys and values", () => {
    const key = () => "keyFunction";
    const value = () => "valueFunction";

    const entry = new MapEntry(key, value);

    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });

  test("should allow key and value to be of different data types", () => {
    const key = "stringKey";
    const value = 12345;

    const entry = new MapEntry(key, value);

    expect(entry.key).toBe(key);
    expect(entry.value).toBe(value);
  });
});

describe("HashMap", () => {
  let comparer: IComparer<string>;

  beforeEach(() => {
    comparer = {
      getHashCode: (key: string) => key.length, // Simplified hash function based on key length
      equals: (a: string, b: string) => a === b,
    };
  });
  describe("basix operations", () => {
    test("should initialize with size 0", () => {
      const hashMap = new HashMap<string, string>(comparer);
      expect(hashMap.getSize()).toBe(0);
    });

    test("should set and get a key-value pair", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");

      expect(hashMap.getSize()).toBe(1);
      expect(hashMap.get("key1")).toBe("value1");
    });

    test("should return null for a non-existent key", () => {
      const hashMap = new HashMap<string, string>(comparer);
      expect(hashMap.get("nonExistentKey")).toBeNull();
    });

    test("should handle hash collisions by storing multiple entries in a bucket", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1"); // Hash: 4 (length of "key1")
      hashMap.set("key2", "value2"); // Hash: 4 (length of "key2")

      expect(hashMap.getSize()).toBe(2);
      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.get("key2")).toBe("value2");
    });

    test("should delete a key-value pair", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.delete("key1");

      expect(hashMap.getSize()).toBe(0);
      expect(hashMap.get("key1")).toBeNull();
    });

    test("should return true if a key exists", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");

      expect(hashMap.has("key1")).toBe(true);
    });

    test("should return false if a key does not exist", () => {
      const hashMap = new HashMap<string, string>(comparer);
      expect(hashMap.has("nonExistentKey")).toBe(false);
    });

    test("should clear all key-value pairs", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      hashMap.clear();

      expect(hashMap.getSize()).toBe(0);
      expect(hashMap.get("key1")).toBeNull();
      expect(hashMap.get("key2")).toBeNull();
    });

    test("should return all keys", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      const keys = hashMap.keys();
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys.length).toBe(2);
    });

    test("should return all values", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      const values = hashMap.values();
      expect(values).toContain("value1");
      expect(values).toContain("value2");
      expect(values.length).toBe(2);
    });

    test("should iterate over all key-value pairs", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      const entries = [...hashMap];
      expect(entries).toEqual(expect.arrayContaining([expect.objectContaining({ key: "key1", value: "value1" }), expect.objectContaining({ key: "key2", value: "value2" })]));
    });

    test("should update an existing key without increasing size", () => {
      const hashMap = new HashMap<string, string>(comparer);
      hashMap.set("key1", "value1");
      hashMap.set("key1", "updatedValue");

      expect(hashMap.getSize()).toBe(1);
      expect(hashMap.get("key1")).toBe("updatedValue");
    });
  });

  describe("HashMap Iterator", () => {
    test("should iterate over all MapEntry<K, V> items in the hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("longKey", "longValue"); // To test multiple buckets

      const expectedEntries = [new MapEntry("key1", "value1"), new MapEntry("key2", "value2"), new MapEntry("longKey", "longValue")];

      const iteratorEntries = [...hashMap];

      expect(iteratorEntries).toHaveLength(3);
      expect(iteratorEntries).toEqual(expect.arrayContaining(expectedEntries));
    });

    test("should handle empty hash map correctly", () => {
      const hashMap = new HashMap<string, string>(comparer);

      const iteratorEntries = [...hashMap];

      expect(iteratorEntries).toHaveLength(0);
      expect(iteratorEntries).toEqual([]);
    });

    test("should iterate over items even in case of hash collisions", () => {
      const hashMap = new HashMap<string, string>(comparer);

      // These keys will hash to the same bucket (length = 4)
      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      const expectedEntries = [new MapEntry("key1", "value1"), new MapEntry("key2", "value2")];

      const iteratorEntries = [...hashMap];

      expect(iteratorEntries).toHaveLength(2);
      expect(iteratorEntries).toEqual(expect.arrayContaining(expectedEntries));
    });

    test("should maintain insertion order within buckets", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      const iteratorEntries = [...hashMap];

      expect(iteratorEntries[0]).toEqual(new MapEntry("key1", "value1"));
      expect(iteratorEntries[1]).toEqual(new MapEntry("key2", "value2"));
      expect(iteratorEntries[2]).toEqual(new MapEntry("key3", "value3"));
    });

    test("should handle deletion of items while iterating", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      const iterator = hashMap[Symbol.iterator]();
      const firstItem = iterator.next();

      expect(firstItem.value).toEqual(new MapEntry("key1", "value1"));
      expect(firstItem.done).toBe(false);

      hashMap.delete("key2"); // Deleting an item during iteration

      const remainingItems = [...iterator];
      expect(remainingItems).toEqual([new MapEntry("key3", "value3")]);
    });
  });
  describe("HashMap set method with key replacement", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should add a new key-value pair when the key does not exist", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");

      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.getSize()).toBe(1);
    });

    test("should replace the value when the key already exists", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key1", "newValue1"); // Replace value for the same key

      expect(hashMap.get("key1")).toBe("newValue1");
      expect(hashMap.getSize()).toBe(1); // Size should not change
    });

    test("should handle hash collisions and replace the correct key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key2", "value2"); // hashKey = 4, causes collision
      hashMap.set("key1", "newValue1"); // Replace value for 'key1'

      expect(hashMap.get("key1")).toBe("newValue1");
      expect(hashMap.get("key2")).toBe("value2");
      expect(hashMap.getSize()).toBe(2);
    });

    test("should increase size when adding a new key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      expect(hashMap.getSize()).toBe(2);
    });

    test("should not increase size when replacing an existing key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      const initialSize = hashMap.getSize();

      hashMap.set("key1", "newValue1");

      expect(hashMap.getSize()).toBe(initialSize); // Size should remain unchanged
    });

    test("should correctly append new entries when no replacement occurs", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.get("key2")).toBe("value2");
      expect(hashMap.getSize()).toBe(2);
    });

    test("should iterate through the correct nodes in a bucket after replacement", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2"); // Same hashKey as 'key1'
      hashMap.set("key1", "newValue1"); // Replace value for 'key1'

      const bucketNodes = [...hashMap["buckets"].get(4)!.getNodes()!].map((node) => node.value);

      expect(bucketNodes[0].key).toBe("key1");
      expect(bucketNodes[0].value).toBe("newValue1");
      expect(bucketNodes[1].key).toBe("key2");
      expect(bucketNodes[1].value).toBe("value2");
    });
  });

  describe("HashMap<K, V>.get", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should return the correct value for an existing key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      const result = hashMap.get("key1");

      expect(result).toBe("value1");
    });

    test("should return null for a key that does not exist", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      const result = hashMap.get("key2"); // Non-existent key

      expect(result).toBeNull();
    });

    test("should handle hash collisions and return the correct value", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key2", "value2"); // hashKey = 4, causes collision

      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.get("key2")).toBe("value2");
    });

    test("should return null for a key in an empty hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      expect(hashMap.get("key1")).toBeNull();
    });

    test("should return null if the bucket exists but does not contain the key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key3", "value3"); // hashKey = 4, causes collision

      expect(hashMap.get("key2")).toBeNull(); // key2 does not exist in the bucket
    });

    test("should correctly retrieve the value for a key after multiple insertions", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      expect(hashMap.get("key2")).toBe("value2");
    });

    test("should retrieve the updated value after a key is replaced", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key1", "updatedValue1"); // Replace the value for the same key

      expect(hashMap.get("key1")).toBe("updatedValue1");
    });

    test("should return null for a key after it has been deleted", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.delete("key1");

      expect(hashMap.get("key1")).toBeNull();
    });
  });
  describe("HashMap<K, V>.delete", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should delete an existing key-value pair", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.delete("key1");

      expect(hashMap.get("key1")).toBeNull();
      expect(hashMap.getSize()).toBe(0);
    });

    test("should not throw an error when deleting a non-existent key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      expect(() => hashMap.delete("key1")).not.toThrow();
      expect(hashMap.getSize()).toBe(0);
    });

    test("should handle hash collisions correctly when deleting a key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key2", "value2"); // hashKey = 4, causes collision

      hashMap.delete("key1"); // Remove key1

      expect(hashMap.get("key1")).toBeNull();
      expect(hashMap.get("key2")).toBe("value2");
      expect(hashMap.getSize()).toBe(1);
    });

    test("should not affect other keys when deleting a key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      hashMap.delete("key2");

      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.get("key3")).toBe("value3");
      expect(hashMap.get("key2")).toBeNull();
      expect(hashMap.getSize()).toBe(2);
    });

    test("should not reduce size when deleting a non-existent key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");

      hashMap.delete("key2"); // Non-existent key
      expect(hashMap.getSize()).toBe(1);
    });

    test("should delete the only key in a hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.delete("key1");

      expect(hashMap.get("key1")).toBeNull();
      expect(hashMap.getSize()).toBe(0);
    });

    test("should correctly delete keys in a bucket with multiple items", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key3", "value3"); // hashKey = 4, same bucket
      hashMap.set("key2", "value2"); // hashKey = 4, same bucket

      hashMap.delete("key3"); // Delete middle key in bucket

      expect(hashMap.get("key1")).toBe("value1");
      expect(hashMap.get("key2")).toBe("value2");
      expect(hashMap.get("key3")).toBeNull();
      expect(hashMap.getSize()).toBe(2);
    });

    test("should not throw an error when deleting from an empty hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      expect(() => hashMap.delete("key1")).not.toThrow();
      expect(hashMap.getSize()).toBe(0);
    });

    test("should handle deleting keys after multiple insertions and deletions", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.delete("key1");
      hashMap.set("key3", "value3");
      hashMap.delete("key2");

      expect(hashMap.get("key1")).toBeNull();
      expect(hashMap.get("key2")).toBeNull();
      expect(hashMap.get("key3")).toBe("value3");
      expect(hashMap.getSize()).toBe(1);
    });
  });
  describe("HashMap<K, V>.has", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should return true for an existing key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");

      expect(hashMap.has("key1")).toBe(true);
    });

    test("should return false for a non-existent key", () => {
      const hashMap = new HashMap<string, string>(comparer);

      expect(hashMap.has("key1")).toBe(false);
    });

    test("should return true for a key in a bucket with collisions", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key2", "value2"); // hashKey = 4, causes collision

      expect(hashMap.has("key1")).toBe(true);
      expect(hashMap.has("key2")).toBe(true);
    });

    test("should return false after a key is deleted", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.delete("key1");

      expect(hashMap.has("key1")).toBe(false);
    });

    test("should return false for an empty hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      expect(hashMap.has("key1")).toBe(false);
    });

    test("should return true for multiple keys added to the hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      expect(hashMap.has("key1")).toBe(true);
      expect(hashMap.has("key2")).toBe(true);
      expect(hashMap.has("key3")).toBe(true);
    });

    test("should return false for a key in a bucket after another key in the same bucket is deleted", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1"); // hashKey = 4
      hashMap.set("key2", "value2"); // hashKey = 4, same bucket

      hashMap.delete("key1"); // Delete one key from the bucket

      expect(hashMap.has("key1")).toBe(false);
      expect(hashMap.has("key2")).toBe(true);
    });

    test("should correctly handle checking for keys after multiple insertions and deletions", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.delete("key1");
      hashMap.set("key3", "value3");
      hashMap.delete("key2");

      expect(hashMap.has("key1")).toBe(false);
      expect(hashMap.has("key2")).toBe(false);
      expect(hashMap.has("key3")).toBe(true);
    });
  });

  describe("HashMap clear method", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should clear all elements in the hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");

      hashMap.clear();

      expect(hashMap.getSize()).toBe(0);
      expect(hashMap.has("key1")).toBe(false);
      expect(hashMap.has("key2")).toBe(false);
    });

    test("should leave the hash map empty when clear is called on an empty hash map", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.clear();

      expect(hashMap.getSize()).toBe(0);
      expect(hashMap.has("key1")).toBe(false);
    });

    test("should reset buckets after calling clear", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.clear();

      // Internal state check for buckets being reset
      expect((hashMap as any).buckets.size).toBe(0);
    });

    test("should allow adding new elements after clear", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.clear();
      hashMap.set("key2", "value2");

      expect(hashMap.getSize()).toBe(1);
      expect(hashMap.has("key2")).toBe(true);
      expect(hashMap.get("key2")).toBe("value2");
    });

    test("should set size to zero after clear", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.clear();

      expect(hashMap.getSize()).toBe(0);
    });
  });

  describe("HashMap keys method", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should return all keys when the hash map has elements", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      const keys = hashMap.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain("key1");
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
    });

    test("should return an empty array when the hash map is empty", () => {
      const hashMap = new HashMap<string, string>(comparer);

      const keys = hashMap.keys();

      expect(keys).toEqual([]);
    });

    test("should handle hash collisions and return unique keys", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("a", "value1"); // Hash: 1 (length)
      hashMap.set("b", "value2"); // Hash: 1 (length)
      hashMap.set("key3", "value3"); // Hash: 4 (length)

      const keys = hashMap.keys();

      expect(keys).toHaveLength(3);
      expect(keys).toContain("a");
      expect(keys).toContain("b");
      expect(keys).toContain("key3");
    });

    test("should reflect updated keys after adding and deleting elements", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.delete("key1");
      hashMap.set("key3", "value3");

      const keys = hashMap.keys();

      expect(keys).toHaveLength(2);
      expect(keys).toContain("key2");
      expect(keys).toContain("key3");
      expect(keys).not.toContain("key1");
    });

    test("should handle duplicate keys gracefully", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key1", "value2"); // Replace existing key

      const keys = hashMap.keys();

      expect(keys).toHaveLength(1);
      expect(keys).toContain("key1");
    });
  });

  describe("HashMap values method", () => {
    let comparer: IComparer<string>;

    beforeEach(() => {
      comparer = {
        getHashCode: (key: string) => key.length, // Simplified hash function
        equals: (a: string, b: string) => a === b,
      };
    });

    test("should return all values when the hash map has elements", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.set("key3", "value3");

      const values = hashMap.values();

      expect(values).toHaveLength(3);
      expect(values).toContain("value1");
      expect(values).toContain("value2");
      expect(values).toContain("value3");
    });

    test("should return an empty array when the hash map is empty", () => {
      const hashMap = new HashMap<string, string>(comparer);

      const values = hashMap.values();

      expect(values).toEqual([]);
    });

    test("should handle hash collisions and return correct values", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("a", "value1"); // Hash: 1 (length)
      hashMap.set("b", "value2"); // Hash: 1 (length)
      hashMap.set("key3", "value3"); // Hash: 4 (length)

      const values = hashMap.values();

      expect(values).toHaveLength(3);
      expect(values).toContain("value1");
      expect(values).toContain("value2");
      expect(values).toContain("value3");
    });

    test("should reflect updated values after adding and deleting elements", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key2", "value2");
      hashMap.delete("key1");
      hashMap.set("key3", "value3");

      const values = hashMap.values();

      expect(values).toHaveLength(2);
      expect(values).toContain("value2");
      expect(values).toContain("value3");
      expect(values).not.toContain("value1");
    });

    test("should handle duplicate keys and return the latest value", () => {
      const hashMap = new HashMap<string, string>(comparer);

      hashMap.set("key1", "value1");
      hashMap.set("key1", "value2"); // Replace value for the same key

      const values = hashMap.values();

      expect(values).toHaveLength(1);
      expect(values).toContain("value2");
    });
  });
});
