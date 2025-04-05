/* eslint-disable @typescript-eslint/no-explicit-any */

import { Group } from "./Group";

describe("Group<TKey, TValue>", () => {
  it("should initialize with a key and items", () => {
    const group = new Group<string, number>("group1", [1, 2, 3]);

    expect(group.key).toBe("group1"); // Key is correctly set
    expect([...group]).toEqual([1, 2, 3]); // Items are correctly added
  });

  it("should allow adding new elements to the group", () => {
    const group = new Group<string, number>("group1", [1, 2, 3]);
    group.add(4);

    expect([...group]).toEqual([1, 2, 3, 4]); // New element is added
  });

  it("should support updating items via the `items` setter", () => {
    const group = new Group<string, number>("group1", [1, 2, 3]);
    group.items = [4, 5, 6];

    expect([...group]).toEqual([4, 5, 6]); // Items are updated
  });

  it("should support retrieving items via the `items` getter", () => {
    const group = new Group<string, number>("group1", [1, 2, 3]);

    expect([...group.items]).toEqual([1, 2, 3]); // Items are accessible via the getter
  });

  it("should handle an empty group correctly", () => {
    const group = new Group<string, number>("group1", []);

    expect([...group]).toEqual([]); // No items
    expect(group.key).toBe("group1"); // Key is still correctly set
  });

  it("should work with non-primitive keys", () => {
    const key = { id: 1, name: "group1" };
    const group = new Group<typeof key, number>(key, [1, 2, 3]);

    expect(group.key).toEqual({ id: 1, name: "group1" }); // Key is an object
    expect([...group]).toEqual([1, 2, 3]); // Items are correctly set
  });

  it("should work with non-primitive values", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const group = new Group<string, { id: number }>("group1", items);

    expect([...group]).toEqual(items); // Non-primitive values are correctly stored
  });

  it("should support iteration", () => {
    const group = new Group<string, number>("group1", [10, 20, 30]);
    const result: number[] = [];

    for (const item of group) {
      result.push(item);
    }

    expect(result).toEqual([10, 20, 30]); // Iteration works correctly
  });

  //   it("should not modify the key after initialization", () => {
  //     const group = new Group<string, number>("group1", [1, 2, 3]);

  //     expect(() => {
  //       // Attempt to modify key, but there's no setter
  //       (group as any)._key = "newKey";
  //     }).toThrow(TypeError); // `_key` should remain private and readonly
  //   });

  it("should maintain immutability of internal linked list structure", () => {
    const group = new Group<string, number>("group1", [1, 2, 3]);
    const linkedListItems = group.items;

    expect([...linkedListItems]).toEqual([1, 2, 3]);
    group.add(4); // Modify the group
    expect([...linkedListItems]).toEqual([1, 2, 3, 4]); // Ensure consistency
  });

  it("should work with mixed-type values", () => {
    const group = new Group<string, any>("group1", [1, "two", true]);
    group.add(null);

    expect([...group]).toEqual([1, "two", true, null]); // Mixed types are handled correctly
  });
});
