/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrueFn } from "./Linq/Enumerable-Interfaces";
import List, { COMPARER, IComparer, list, PredicateType } from "./List";

describe("list function", () => {
  it("should create a List instance from an array", () => {
    const input = [1, 2, 3];
    const result = list(input);

    // Validate the result
    expect(result).toBeInstanceOf(List);
    expect(result.count()).toBe(3);
    expect(result.toArray()).toEqual(input);
  });

  it("should handle an empty iterable", () => {
    const input: number[] = [];
    const result = list(input);

    expect(result).toBeInstanceOf(List);
    expect(result.count()).toBe(0);
    expect(result.toArray()).toEqual(input);
  });

  it("should work with other iterables like Sets", () => {
    const input = new Set([1, 2, 3]);
    const result = list(input);

    expect(result).toBeInstanceOf(List);
    expect(result.count()).toBe(3);
    expect(result.toArray()).toEqual([1, 2, 3]); // Convert Set to array for comparison
  });

  it("should handle strings as iterables", () => {
    const input = "abc";
    const result = list(input);

    expect(result).toBeInstanceOf(List);
    expect(result.count()).toBe(3);
    expect(result.toArray()).toEqual(["a", "b", "c"]);
  });
});

describe("TrueFn", () => {
  it("should return true", () => {
    const result = TrueFn();
    expect(result).toBe(true); // Verify the result is true
  });
});

describe("_comparer", () => {
  describe("getHashCode", () => {
    it("should return a string representation of the item", () => {
      expect(COMPARER.getHashCode(42)).toBe("42"); // For a number
      expect(COMPARER.getHashCode("hello")).toBe("hello"); // For a string
      expect(COMPARER.getHashCode(true)).toBe("true"); // For a boolean
      expect(COMPARER.getHashCode(null)).toBe("null"); // For null
      expect(COMPARER.getHashCode(undefined)).toBe("undefined"); // For undefined
      expect(COMPARER.getHashCode({ key: "value" })).toBe("[object Object]"); // For an object
    });
  });

  describe("equals", () => {
    it("should return true for strictly equal items", () => {
      expect(COMPARER.equals(42, 42)).toBe(true);
      expect(COMPARER.equals("hello", "hello")).toBe(true);
      expect(COMPARER.equals(true, true)).toBe(true);
      expect(COMPARER.equals(null, null)).toBe(true);
      expect(COMPARER.equals(undefined, undefined)).toBe(true);
    });

    it("should return false for items that are not strictly equal", () => {
      expect(COMPARER.equals(42, "42")).toBe(false); // Different types
      expect(COMPARER.equals(true, false)).toBe(false);
      expect(COMPARER.equals(null, undefined)).toBe(false);
      expect(COMPARER.equals({ key: "value" }, { key: "value" })).toBe(false); // Different object references
    });
  });
});

describe("List<T>", () => {
  describe("constructor", () => {
    it("should initialize an empty List when no elements are provided", () => {
      const list = new List();
      expect([...list]).toEqual([]);
    });

    it("should initialize the List with provided elements", () => {
      const elements = [1, 2, 3];
      const list = new List(elements);
      expect([...list]).toEqual(elements);
    });
  });

  describe("iterable functionality", () => {
    it("should allow iteration over the elements", () => {
      const elements = [1, 2, 3];
      const list = new List(elements);
      const iteratedElements = [...list];
      expect(iteratedElements).toEqual(elements);
    });

    it("should work with spread operator", () => {
      const elements = [1, 2, 3];
      const list = new List(elements);
      const spreadElements = [...list];
      expect(spreadElements).toEqual(elements);
    });
  });

  describe("Symbol.toStringTag", () => {
    it('should return "List" when used with Object.prototype.toString', () => {
      const list = new List();
      expect(Object.prototype.toString.call(list)).toBe("[object List]");
    });
  });

  describe("items property", () => {
    it("should allow reading elements through the `items` property", () => {
      const elements = [1, 2, 3];
      const list = new List(elements);
      expect([...list["items"]]).toEqual(elements);
    });

    it("should allow updating elements through the `items` property", () => {
      const list = new List<number>();
      list["items"] = [4, 5, 6];
      expect([...list]).toEqual([4, 5, 6]);
    });
  });

  describe("edge cases", () => {
    it("should handle non-array iterables", () => {
      const elements = new Set([1, 2, 3]);
      const list = new List(elements);
      expect([...list]).toEqual([1, 2, 3]);
    });

    it("should handle an empty iterable", () => {
      const elements: number[] = [];
      const list = new List(elements);
      expect([...list]).toEqual([]);
    });

    it("should handle strings as iterables", () => {
      const elements = "abc";
      const list = new List(elements);
      expect([...list]).toEqual(["a", "b", "c"]);
    });
  });

  describe("Append", () => {
    it("should append an element to an empty list", () => {
      const myList = new List<number>();
      const updatedList = myList.Append(1);
      expect([...updatedList]).toEqual([1]);
    });

    it("should append an element to a non-empty list", () => {
      const myList = new List([1, 2, 3]);
      const updatedList = myList.Append(4);
      expect([...updatedList]).toEqual([1, 2, 3, 4]);
    });

    it("should not modify the original list", () => {
      const myList = new List([1, 2, 3]);
      const updatedList = myList.Append(4);
      expect([...myList]).toEqual([1, 2, 3]); // Original list remains unchanged
      expect([...updatedList]).toEqual([1, 2, 3, 4]); // New list contains the appended element
    });
  });

  describe("Prepend", () => {
    it("should prepend an element to an empty list", () => {
      const myList = new List<number>();
      const updatedList = myList.Prepend(1);
      expect([...updatedList]).toEqual([1]);
    });

    it("should prepend an element to a non-empty list", () => {
      const myList = new List([2, 3, 4]);
      const updatedList = myList.Prepend(1);
      expect([...updatedList]).toEqual([1, 2, 3, 4]);
    });

    it("should not modify the original list", () => {
      const myList = new List([2, 3, 4]);
      const updatedList = myList.Prepend(1);
      expect([...myList]).toEqual([2, 3, 4]); // Original list remains unchanged
      expect([...updatedList]).toEqual([1, 2, 3, 4]); // New list contains the prepended element
    });
  });

  describe("AddRange", () => {
    it("should add a range of elements to an empty list", () => {
      const myList = new List<number>();
      const updatedList = myList.AddRange([1, 2, 3]);
      expect([...updatedList]).toEqual([1, 2, 3]);
    });

    it("should add a range of elements to a non-empty list", () => {
      const myList = new List([1, 2, 3]);
      const updatedList = myList.AddRange([4, 5, 6]);
      expect([...updatedList]).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should handle empty ranges", () => {
      const myList = new List([1, 2, 3]);
      const updatedList = myList.AddRange([]);
      expect([...updatedList]).toEqual([1, 2, 3]);
    });

    it("should not modify the original list", () => {
      const myList = new List([1, 2, 3]);
      const updatedList = myList.AddRange([4, 5, 6]);
      expect([...myList]).toEqual([1, 2, 3]); // Original list remains unchanged
      expect([...updatedList]).toEqual([1, 2, 3, 4, 5, 6]); // New list contains the added range
    });
  });
  describe("List<T>.Aggregate", () => {
    it("should aggregate a list of numbers by summing them", () => {
      const myList = new List([1, 2, 3, 4, 5]);
      const result = myList.Aggregate((accum, value) => accum + value, 0);
      expect(result).toBe(15); // 1 + 2 + 3 + 4 + 5
    });

    it("should aggregate a list of strings by concatenating them", () => {
      const myList = new List(["a", "b", "c"]);
      const result = myList.Aggregate((accum, value) => accum + value, "");
      expect(result).toBe("abc"); // "a" + "b" + "c"
    });

    it("should apply the accumulator function with an initial value", () => {
      const myList = new List([2, 3, 4]);
      const result = myList.Aggregate((accum, value) => accum * value, 1);
      expect(result).toBe(24); // 1 * 2 * 3 * 4
    });

    it("should pass the correct index to the accumulator function", () => {
      const myList = new List(["a", "b", "c"]);
      const indices: number[] = [];
      myList.Aggregate((accum, value, index) => {
        indices.push(index);
        return accum + value;
      }, "");
      expect(indices).toEqual([0, 1, 2]); // Indices passed to the function
    });

    it("should return the initial value if the list is empty", () => {
      const myList = new List<number>();
      const result = myList.Aggregate((accum, value) => accum + value, 10);
      expect(result).toBe(10); // Initial value remains unchanged
    });

    it("should handle complex object aggregation", () => {
      const myList = new List([{ value: 1 }, { value: 2 }, { value: 3 }]);
      const result = myList.Aggregate((accum, obj) => accum + obj.value, 0);
      expect(result).toBe(6); // 1 + 2 + 3
    });

    it("should work with non-number initial values", () => {
      const myList = new List(["x", "y", "z"]);
      const result = myList.Aggregate((accum, value) => [...accum, value], <string[]>[]);
      expect(result).toEqual(["x", "y", "z"]); // Aggregates into an array
    });
  });
  describe("List<T>.All", () => {
    it("should return true if all elements satisfy the condition", () => {
      const myList = new List([2, 4, 6]);
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.All(isEven);
      expect(result).toBe(true); // All elements are even
    });

    it("should return false if any element does not satisfy the condition", () => {
      const myList = new List([2, 3, 6]);
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.All(isEven);
      expect(result).toBe(false); // 3 is not even
    });

    it("should return true for an empty list (vacuous truth)", () => {
      const myList = new List<number>();
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.All(isEven);
      expect(result).toBe(true); // No elements fail the condition
    });

    it("should pass the correct index to the predicate", () => {
      const myList = new List([10, 20, 30]);
      const indices: number[] = [];
      const predicate: PredicateType<number> = (_, index) => {
        indices.push(index!);
        return true;
      };
      myList.All(predicate);
      expect(indices).toEqual([0, 1, 2]); // Predicate receives correct indices
    });
  });

  describe("List<T>.Any", () => {
    it("should return true if at least one element satisfies the condition", () => {
      const myList = new List([1, 3, 5, 6]);
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.Any(isEven);
      expect(result).toBe(true); // 6 is even
    });

    it("should return false if no elements satisfy the condition", () => {
      const myList = new List([1, 3, 5]);
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.Any(isEven);
      expect(result).toBe(false); // No elements are even
    });

    it("should return false for an empty list", () => {
      const myList = new List<number>();
      const isEven: PredicateType<number> = (value) => value % 2 === 0;
      const result = myList.Any(isEven);
      expect(result).toBe(false); // No elements to satisfy the condition
    });

    it("should return true if no predicate is provided and the list has elements", () => {
      const myList = new List([1, 2, 3]);
      const result = myList.Any();
      expect(result).toBe(true); // Default predicate always returns true
    });

    it("should pass the correct index to the predicate", () => {
      const myList = new List([10, 20, 30]);
      const indices: number[] = [];
      const predicate: PredicateType<number> = (_, index) => {
        indices.push(index!);
        return false;
      };
      myList.Any(predicate);
      expect(indices).toEqual([0, 1, 2]); // Predicate receives correct indices
    });
  });
  describe("List<T>.Average", () => {
    it("should compute the average of a list of numbers", () => {
      const myList = new List([1, 2, 3, 4, 5]);
      const result = myList.Average();
      expect(result).toBe(3); // Average of [1, 2, 3, 4, 5]
    });

    it("should compute the average with a transform function", () => {
      const myList = new List([{ value: 1 }, { value: 2 }, { value: 3 }]);
      const result = myList.Average((item) => item.value);
      expect(result).toBe(2); // Average of [1, 2, 3]
    });

    it("should throw an error if the list is empty", () => {
      const myList = new List<number>();
      expect(() => myList.Average()).toThrow("Sequence contains no elements");
    });

    // it("should throw an error if elements are non-numeric and no transform is provided", () => {
    //   const myList = new List(["a", "b", "c"]);
    //   expect(() => myList.Average()).toEqual(NaN);
    // });
  });

  describe("List<T>.clear", () => {
    it("should remove all elements from the list", () => {
      const myList = new List([1, 2, 3]);
      myList.clear();
      expect([...myList]).toEqual([]); // List should be empty
    });

    it("should not throw an error when clearing an empty list", () => {
      const myList = new List<number>();
      myList.clear();
      expect([...myList]).toEqual([]); // List remains empty
    });

    it("should clear the list but retain the same instance", () => {
      const myList = new List([1, 2, 3]);
      const originalInstance = myList;
      myList.clear();
      expect(myList).toBe(originalInstance); // Same instance
      expect([...myList]).toEqual([]); // Now empty
    });
  });
  describe("List<T>.concat", () => {
    it("should concatenate two sequences", () => {
      const list1 = new List<number>([1, 2, 3]);
      const list2 = new List<number>([4, 5, 6]);

      const result = list1.concat(list2);

      // Validate the concatenated list
      expect([...result]).toEqual([1, 2, 3, 4, 5, 6]);

      // Validate that the original lists are unchanged
      expect([...list1]).toEqual([1, 2, 3]);
      expect([...list2]).toEqual([4, 5, 6]);
    });

    it("should handle concatenation with an empty list", () => {
      const list1 = new List<number>([1, 2, 3]);
      const emptyList = new List<number>([]);

      const result = list1.concat(emptyList);

      // Validate the result remains the same as the original list
      expect([...result]).toEqual([1, 2, 3]);

      // Validate the original lists are unchanged
      expect([...list1]).toEqual([1, 2, 3]);
      expect([...emptyList]).toEqual([]);
    });

    it("should handle concatenation when the first list is empty", () => {
      const emptyList = new List<number>([]);
      const list2 = new List<number>([4, 5, 6]);

      const result = emptyList.concat(list2);

      // Validate the result matches the second list
      expect([...result]).toEqual([4, 5, 6]);

      // Validate the original lists are unchanged
      expect([...emptyList]).toEqual([]);
      expect([...list2]).toEqual([4, 5, 6]);
    });

    it("should concatenate lists with different types when generic type is compatible", () => {
      const list1 = new List<number | string>([1, 2, "a"]);
      const list2 = new List<number | string>([4, "b", 6]);

      const result = list1.concat(list2);

      // Validate the concatenated list
      expect([...result]).toEqual([1, 2, "a", 4, "b", 6]);

      // Validate the original lists are unchanged
      expect([...list1]).toEqual([1, 2, "a"]);
      expect([...list2]).toEqual([4, "b", 6]);
    });
  });
  describe("List<T>.contains", () => {
    it("should return true if the element is in the list", () => {
      const list = new List<number>([1, 2, 3, 4, 5]);
      expect(list.contains(3)).toBe(true); // Element 3 exists in the list
    });

    it("should return false if the element is not in the list", () => {
      const list = new List<number>([1, 2, 3, 4, 5]);
      expect(list.contains(6)).toBe(false); // Element 6 does not exist in the list
    });

    it("should work with an empty list", () => {
      const list = new List<number>([]);
      expect(list.contains(1)).toBe(false); // No elements in the list
    });

    it("should handle lists with different types", () => {
      const list = new List<string>(["a", "b", "c"]);
      expect(list.contains("b")).toBe(true); // Element "b" exists in the list
      expect(list.contains("d")).toBe(false); // Element "d" does not exist in the list
    });

    it("should return true for mixed-type lists if the element exists", () => {
      const list = new List<any>([1, "a", true]);
      expect(list.contains(1)).toBe(true); // Element 1 exists
      expect(list.contains("a")).toBe(true); // Element "a" exists
      expect(list.contains(false)).toBe(false); // Element false does not exist
    });

    it("should perform strict equality checks", () => {
      const list = new List<number>([1, 2, 3]);
      expect(list.contains(3)).toBe(true); // Exact match
      expect(list.contains("3" as any)).toBe(false); // Type mismatch, strict equality fails
    });

    it("should return true if there are duplicate elements and the element exists", () => {
      const list = new List<number>([1, 2, 3, 3, 4]);
      expect(list.contains(3)).toBe(true); // Element 3 exists multiple times
    });

    it("should return false for an element in a case-sensitive list", () => {
      const list = new List<string>(["a", "B", "c"]);
      expect(list.contains("b")).toBe(false); // Case-sensitive, "b" does not exist
    });
  });
  describe("List<T>.count", () => {
    it("should return the total number of elements in the list", () => {
      const list = new List<number>([1, 2, 3, 4, 5]);
      expect(list.count()).toBe(5); // Total elements in the list
    });

    it("should return 0 for an empty list", () => {
      const list = new List<number>([]);
      expect(list.count()).toBe(0); // No elements in the list
    });

    it("should return the number of elements that satisfy the predicate", () => {
      const list = new List<number>([1, 2, 3, 4, 5, 6]);
      expect(list.count((x) => x % 2 === 0)).toBe(3); // Even numbers: 2, 4, 6
    });

    it("should handle a predicate that matches all elements", () => {
      const list = new List<string>(["a", "b", "c"]);
      expect(list.count(() => true)).toBe(3); // All elements match
    });

    it("should handle a predicate that matches no elements", () => {
      const list = new List<number>([1, 2, 3, 4]);
      expect(list.count(() => false)).toBe(0); // No elements match
    });

    it("should work with lists containing mixed types", () => {
      const list = new List<any>([1, "a", true, null]);
      expect(list.count((x) => typeof x === "number")).toBe(1); // Only 1 number (1)
      expect(list.count((x) => x == null)).toBe(1); // Only 1 null value
    });

    it("should handle lists with duplicate elements", () => {
      const list = new List<number>([1, 2, 2, 3, 3, 3]);
      expect(list.count((x) => x === 2)).toBe(2); // Two occurrences of 2
      expect(list.count((x) => x === 3)).toBe(3); // Three occurrences of 3
    });

    it("should handle string-based predicates", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      expect(list.count((x) => x.startsWith("a"))).toBe(1); // "apple" starts with "a"
    });
  });

  describe("List<T>.defaultIfEmpty", () => {
    it("should return the same list if it is not empty", () => {
      const list = new List<number>([1, 2, 3]);
      const result = list.defaultIfEmpty(0);

      expect([...result]).toEqual([1, 2, 3]); // Original list is returned
      expect(result).toBe(list); // The same instance is returned if not empty
    });

    it("should return a new list with the default value if the original list is empty", () => {
      const list = new List<number>([]);
      const result = list.defaultIfEmpty(0);

      expect([...result]).toEqual([0]); // Default value in a singleton list
    });

    it("should work without a default value, returning a list with `undefined` if empty", () => {
      const list = new List<string>([]);
      const result = list.defaultIfEmpty();

      expect([...result]).toEqual([undefined]); // Default value is `undefined`
    });

    it("should handle lists with non-primitive default values", () => {
      const defaultValue = { id: 1, name: "default" };
      const list = new List<{ id: number; name: string }>([]);
      const result = list.defaultIfEmpty(defaultValue);

      expect([...result]).toEqual([{ id: 1, name: "default" }]); // Default object is added
    });

    it("should not modify the original empty list", () => {
      const list = new List<number>([]);
      list.defaultIfEmpty(42);

      expect([...list]).toEqual([]); // Original list remains unchanged
    });

    it("should not modify the original non-empty list", () => {
      const list = new List<number>([5, 10, 15]);
      list.defaultIfEmpty(0);

      expect([...list]).toEqual([5, 10, 15]); // Original list remains unchanged
    });

    it("should handle mixed-type lists with a default value", () => {
      const list = new List<any>([]);
      const result = list.defaultIfEmpty("default");

      expect([...result]).toEqual(["default"]); // Default value is added
    });

    it("should return the original list instance if it is not empty", () => {
      const list = new List<string>(["a", "b"]);
      const result = list.defaultIfEmpty("default");

      expect(result).toBe(list); // Same instance returned
    });
  });

  describe("List<T>.distinct", () => {
    it("should return a list with distinct elements", () => {
      const list = new List<number>([1, 2, 2, 3, 3, 3, 4]);
      const result = list.distinct();

      expect([...result]).toEqual([1, 2, 3, 4]); // Distinct elements only
    });

    it("should return the same list if all elements are already distinct", () => {
      const list = new List<number>([1, 2, 3, 4]);
      const result = list.distinct();

      expect([...result]).toEqual([1, 2, 3, 4]); // No duplicates to remove
      expect(result).not.toBe(list); // Returns a new instance
    });

    it("should return an empty list if the original list is empty", () => {
      const list = new List<number>([]);
      const result = list.distinct();

      expect([...result]).toEqual([]); // No elements
    });

    it("should work with a list of strings", () => {
      const list = new List<string>(["a", "b", "a", "c", "b"]);
      const result = list.distinct();

      expect([...result]).toEqual(["a", "b", "c"]); // Distinct strings
    });

    it("should handle mixed-type lists", () => {
      const list = new List<any>([1, "1", 2, "2", 2, 1]);
      const result = list.distinct();

      expect([...result]).toEqual([1, "1", 2, "2"]); // Distinct elements by strict equality
    });

    it("should work with non-primitive types using reference equality", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 1 };
      const list = new List<object>([obj1, obj2, obj1]);
      const result = list.distinct();

      expect([...result]).toEqual([obj1, obj2]); // `obj1` and `obj2` are distinct references
    });

    it("should preserve the order of the first occurrences of elements", () => {
      const list = new List<number>([3, 1, 4, 1, 5, 9, 2, 6, 5]);
      const result = list.distinct();

      expect([...result]).toEqual([3, 1, 4, 5, 9, 2, 6]); // First occurrences are preserved
    });

    it("should not modify the original list", () => {
      const list = new List<number>([1, 2, 2, 3]);
      list.distinct();

      expect([...list]).toEqual([1, 2, 2, 3]); // Original list remains unchanged
    });
  });
  describe("List<T>.distinctBy", () => {
    it("should return distinct elements based on a key selector", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alice" },
        { id: 3, name: "Charlie" },
      ]);
      const result = list.distinctBy((x) => x.id);

      expect([...result]).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]); // Distinct by `id`
    });

    it("should return the same list if all elements are already distinct by the key", () => {
      const list = new List<number>([1, 2, 3, 4]);
      const result = list.distinctBy((x) => x);

      expect([...result]).toEqual([1, 2, 3, 4]); // All elements distinct
      expect(result).not.toBe(list); // New instance returned
    });

    it("should return an empty list if the original list is empty", () => {
      const list = new List<{ id: number; name: string }>([]);
      const result = list.distinctBy((x) => x.id);

      expect([...result]).toEqual([]); // Empty list remains empty
    });

    it("should handle primitive key selectors", () => {
      const list = new List<string>(["apple", "banana", "apricot", "blueberry", "apple"]);
      const result = list.distinctBy((x) => x[0]); // Select by the first character

      expect([...result]).toEqual(["apple", "banana"]); // Distinct by the first character
    });

    it("should handle non-primitive keys with custom comparers", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alex" },
      ]);

      const comparer: IComparer<number> = {
        equals: (a: number, b: number) => a === b, // Simple equality comparer,
        getHashCode: (a: number) => String(a),
      };
      const result = list.distinctBy((x) => x.id, comparer);

      expect([...result]).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]); // Distinct by `id` with custom comparer
    });

    it("should work with mixed types using a key selector", () => {
      const list = new List<any>([1, "1", 2, "2", 2, 1]);
      const result = list.distinctBy((x) => typeof x);

      expect([...result]).toEqual([1, "1"]); // Distinct by type
    });

    it("should preserve the order of first occurrences of elements", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 1, name: "Alex" },
        { id: 3, name: "Charlie" },
      ]);
      const result = list.distinctBy((x) => x.id);

      expect([...result]).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]); // First occurrences are preserved
    });

    it("should not modify the original list", () => {
      const list = new List<number>([1, 2, 2, 3]);
      list.distinctBy((x) => x);

      expect([...list]).toEqual([1, 2, 2, 3]); // Original list remains unchanged
    });
  });
  describe("List<T>.elementAt", () => {
    it("should return the element at the specified index", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.elementAt(0)).toBe(10); // First element
      expect(list.elementAt(2)).toBe(30); // Middle element
      expect(list.elementAt(4)).toBe(50); // Last element
    });

    it("should throw an error if the index is negative", () => {
      const list = new List<number>([10, 20, 30]);
      expect(() => list.elementAt(-1)).toThrow("ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source."); // Negative index
    });

    it("should throw an error if the index is greater than or equal to the list's length", () => {
      const list = new List<number>([10, 20, 30]);
      expect(() => list.elementAt(3)).toThrow("ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source."); // Index out of range
    });

    it("should work with an empty list and throw an error for any index", () => {
      const list = new List<number>([]);
      expect(() => list.elementAt(0)).toThrow("ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source."); // Empty list
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      expect(list.elementAt(1)).toBe("banana"); // Access by index
    });

    it("should work with lists of objects", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      expect(list.elementAt(0)).toEqual({ id: 1, name: "Alice" }); // Access object by index
    });

    it("should handle lists with mixed types", () => {
      const list = new List<any>([1, "string", true, null]);
      expect(list.elementAt(1)).toBe("string"); // Access mixed types by index
      expect(list.elementAt(3)).toBe(null); // Access null
    });

    it("should throw an error if ElementAtOrDefault returns undefined for out-of-range indices", () => {
      const list = new List<number>([10, 20, 30]);
      expect(() => list.elementAt(5)).toThrow("ArgumentOutOfRangeException: index is less than 0 or greater than or equal to the number of elements in source.");
      // Ensure error handling via `ElementAtOrDefault`
    });
  });
  describe("List<T>.elementAtOrDefault", () => {
    it("should return the element at the specified index", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.elementAtOrDefault(0)).toBe(10); // First element
      expect(list.elementAtOrDefault(2)).toBe(30); // Middle element
      expect(list.elementAtOrDefault(4)).toBe(50); // Last element
    });

    it("should return null if the index is negative", () => {
      const list = new List<number>([10, 20, 30]);
      expect(list.elementAtOrDefault(-1)).toBe(null); // Negative index
    });

    it("should return null if the index is greater than or equal to the list's length", () => {
      const list = new List<number>([10, 20, 30]);
      expect(list.elementAtOrDefault(3)).toBe(null); // Index out of range
      expect(list.elementAtOrDefault(10)).toBe(null); // Far out of range
    });

    it("should return null for an empty list regardless of the index", () => {
      const list = new List<number>([]);
      expect(list.elementAtOrDefault(0)).toBe(null); // No elements
      expect(list.elementAtOrDefault(-1)).toBe(null); // Negative index
      expect(list.elementAtOrDefault(10)).toBe(null); // Out of range
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      expect(list.elementAtOrDefault(1)).toBe("banana"); // Access by index
      expect(list.elementAtOrDefault(3)).toBe(null); // Out of range
    });

    it("should work with lists of objects", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      expect(list.elementAtOrDefault(0)).toEqual({ id: 1, name: "Alice" }); // Access object by index
      expect(list.elementAtOrDefault(2)).toBe(null); // Out of range
    });

    it("should handle lists with mixed types", () => {
      const list = new List<any>([1, "string", true, null]);
      expect(list.elementAtOrDefault(1)).toBe("string"); // Access mixed types by index
      expect(list.elementAtOrDefault(3)).toBe(null); // Last element
      expect(list.elementAtOrDefault(4)).toBe(null); // Out of range
    });

    it("should handle large indices efficiently without unnecessary iteration", () => {
      const list = new List<number>([1, 2, 3]);
      expect(list.elementAtOrDefault(1000)).toBe(null); // Out of range
    });

    it("should preserve immutability of the original list", () => {
      const list = new List<number>([1, 2, 3]);
      list.elementAtOrDefault(1); // Access an element
      expect([...list]).toEqual([1, 2, 3]); // Original list remains unchanged
    });
  });
  describe("List<T>.except", () => {
    it("should return elements from the original list that are not in the source", () => {
      const list = new List<number>([1, 2, 3, 4, 5]);
      const source = [3, 4];
      const result = list.except(source);

      expect([...result]).toEqual([1, 2, 5]); // Elements 3 and 4 are excluded
    });

    it("should return the original list if the source is empty", () => {
      const list = new List<number>([1, 2, 3]);
      const source: number[] = [];
      const result = list.except(source);

      expect([...result]).toEqual([1, 2, 3]); // No elements to exclude
    });

    it("should return an empty list if the original list is empty", () => {
      const list = new List<number>([]);
      const source = [1, 2, 3];
      const result = list.except(source);

      expect([...result]).toEqual([]); // No elements to compare
    });

    it("should return an empty list if all elements in the original list are in the source", () => {
      const list = new List<number>([1, 2, 3]);
      const source = [1, 2, 3];
      const result = list.except(source);

      expect([...result]).toEqual([]); // All elements are excluded
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      const source = ["banana"];
      const result = list.except(source);

      expect([...result]).toEqual(["apple", "cherry"]); // "banana" is excluded
    });

    it("should work with lists of objects using a custom comparer", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);
      const source = [{ id: 2, name: "Bob" }];
      const comparer: IComparer<(typeof source)[number]> = {
        getHashCode: (obj: { id: number }) => obj.id,
        equals: (a, b) => a.id === b.id && a.name === b.name,
      };
      const result = list.except(source, comparer);

      expect([...result]).toEqual([
        { id: 1, name: "Alice" },
        { id: 3, name: "Charlie" },
      ]); // Exclude matching object by `id`
    });

    it("should handle mixed types correctly", () => {
      const list = new List<any>([1, "string", true, null]);
      const source = [true, 1];
      const result = list.except(source);

      expect([...result]).toEqual(["string", null]); // Exclude `true` and `1`
    });

    it("should return elements in the original order of the list", () => {
      const list = new List<number>([5, 3, 8, 2]);
      const source = [3, 8];
      const result = list.except(source);

      expect([...result]).toEqual([5, 2]); // Order of remaining elements is preserved
    });

    it("should handle duplicate elements in the original list correctly", () => {
      const list = new List<number>([1, 2, 2, 3, 3, 3, 4]);
      const source = [3];
      const result = list.except(source);

      expect([...result]).toEqual([1, 2, 2, 4]); // All `3` instances are excluded
    });

    it("should handle duplicate elements in the source correctly", () => {
      const list = new List<number>([1, 2, 3, 4]);
      const source = [3, 3, 3];
      const result = list.except(source);

      expect([...result]).toEqual([1, 2, 4]); // Exclude `3` only once
    });
  });
  describe("List<T>.first", () => {
    it("should return the first element of a non-empty list", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.first()).toBe(10); // First element
    });

    it("should return the first element that satisfies a predicate", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.first((x) => x > 25)).toBe(30); // First element greater than 25
    });

    it("should throw an error if the list is empty", () => {
      const list = new List<number>([]);
      expect(() => list.first()).toThrow("InvalidOperationException: The source sequence is empty.");
    });

    it("should throw an error if no elements satisfy the predicate", () => {
      const list = new List<number>([10, 20, 30]);
      expect(() => list.first((x) => x > 50)).toThrow("InvalidOperationException: The source sequence is empty.");
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      expect(list.first()).toBe("apple"); // First element
      expect(list.first((x) => x.startsWith("b"))).toBe("banana"); // First starting with "b"
    });

    it("should work with lists of objects", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);
      expect(list.first()).toEqual({ id: 1, name: "Alice" }); // First object
      expect(list.first((x) => x.id === 2)).toEqual({ id: 2, name: "Bob" }); // First with id === 2
    });

    it("should handle lists with mixed types", () => {
      const list = new List<any>([1, "string", true, null]);
      expect(list.first()).toBe(1); // First element
      expect(list.first((x) => typeof x === "string")).toBe("string"); // First string element
    });

    it("should preserve immutability of the original list", () => {
      const list = new List<number>([10, 20, 30]);
      list.first();
      expect([...list]).toEqual([10, 20, 30]); // Original list remains unchanged
    });

    it("should throw an error if the predicate is provided and the list is empty", () => {
      const list = new List<number>([]);
      expect(() => list.first((x) => x > 0)).toThrow("InvalidOperationException: The source sequence is empty.");
    });
  });
  describe("List<T>.firstOrDefault", () => {
    it("should return the first element of a non-empty list", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.firstOrDefault()).toBe(10); // First element
    });

    it("should return the first element that satisfies a predicate", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);
      expect(list.firstOrDefault((x) => x > 25)).toBe(30); // First element greater than 25
    });

    it("should return undefined if the list is empty", () => {
      const list = new List<number>([]);
      expect(list.firstOrDefault()).toBeUndefined(); // No elements
    });

    it("should return undefined if no elements satisfy the predicate", () => {
      const list = new List<number>([10, 20, 30]);
      expect(list.firstOrDefault((x) => x > 50)).toBeUndefined(); // No matches
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      expect(list.firstOrDefault()).toBe("apple"); // First element
      expect(list.firstOrDefault((x) => x.startsWith("b"))).toBe("banana"); // First starting with "b"
      expect(list.firstOrDefault((x) => x.startsWith("z"))).toBeUndefined(); // No match
    });

    it("should work with lists of objects", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);
      expect(list.firstOrDefault()).toEqual({ id: 1, name: "Alice" }); // First object
      expect(list.firstOrDefault((x) => x.id === 2)).toEqual({ id: 2, name: "Bob" }); // Match by predicate
      expect(list.firstOrDefault((x) => x.id === 4)).toBeUndefined(); // No match
    });

    it("should handle lists with mixed types", () => {
      const list = new List<any>([1, "string", true, null]);
      expect(list.firstOrDefault()).toBe(1); // First element
      expect(list.firstOrDefault((x) => typeof x === "string")).toBe("string"); // First string element
      expect(list.firstOrDefault((x) => x === false)).toBeUndefined(); // No match
    });

    it("should preserve immutability of the original list", () => {
      const list = new List<number>([10, 20, 30]);
      list.firstOrDefault();
      expect([...list]).toEqual([10, 20, 30]); // Original list remains unchanged
    });

    it("should return undefined if the predicate is provided and the list is empty", () => {
      const list = new List<number>([]);
      expect(list.firstOrDefault((x) => x > 0)).toBeUndefined(); // Empty list
    });
  });
  describe("List<T>.forEach", () => {
    it("should execute the action on each element of the list", () => {
      const list = new List<number>([1, 2, 3, 4, 5]);
      const result: number[] = [];
      list.forEach((x) => result.push(x));

      expect(result).toEqual([1, 2, 3, 4, 5]); // Action applied to each element
    });

    it("should provide the element and index to the action", () => {
      const list = new List<number>([10, 20, 30]);
      const indices: number[] = [];
      const values: number[] = [];
      list.forEach((value, index) => {
        indices.push(index!);
        values.push(value!);
      });

      expect(indices).toEqual([0, 1, 2]); // Correct indices
      expect(values).toEqual([10, 20, 30]); // Corresponding values
    });

    it("should not execute the action if the list is empty", () => {
      const list = new List<number>([]);
      const result: number[] = [];
      list.forEach((x) => result.push(x));

      expect(result).toEqual([]); // No action applied
    });

    it("should work with lists of strings", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);
      const result: string[] = [];
      list.forEach((x) => result.push(x));

      expect(result).toEqual(["apple", "banana", "cherry"]); // Action applied to strings
    });

    it("should work with lists of objects", () => {
      const list = new List<{ id: number; name: string }>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);
      const result: { id: number; name: string }[] = [];
      list.forEach((x) => result.push(x!));

      expect(result).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]); // Action applied to objects
    });

    it("should handle lists with mixed types", () => {
      const list = new List<any>([1, "string", true, null]);
      const result: any[] = [];
      list.forEach((x) => result.push(x));

      expect(result).toEqual([1, "string", true, null]); // Action applied to mixed types
    });

    it("should handle actions that modify external state", () => {
      const list = new List<number>([1, 2, 3]);
      let sum = 0;
      list.forEach((x) => (sum += x));

      expect(sum).toBe(6); // Sum of elements
    });

    it("should handle actions with side effects on the list elements", () => {
      const list = new List<number>([10, 20, 30]);
      const result: number[] = [];
      list.forEach((x, i) => result.push(x * i!));

      expect(result).toEqual([0, 20, 60]); // Elements multiplied by their index
    });

    it("should not modify the original list", () => {
      const list = new List<number>([10, 20, 30]);
      list.forEach(() => {}); // Perform no-op
      expect([...list]).toEqual([10, 20, 30]); // Original list remains unchanged
    });
  });
  describe("List<T>.groupBy", () => {
    it("should group elements by a simple key selector", () => {
      const list = new List<number>([1, 2, 3, 4, 5, 6]);
      const result = list.groupBy((x) => (x % 2 === 0 ? "even" : "odd"));

      const groups = [...result];
      expect(groups.length).toBe(2); // Two groups: "even" and "odd"
      expect(groups[0].key).toBe("odd");
      expect([...groups[0]]).toEqual([1, 3, 5]);
      expect(groups[1].key).toBe("even");
      expect(groups[1].toArray()).toEqual([2, 4, 6]);
    });

    it("should group elements by a custom object key", () => {
      const list = new List<{ id: number; category: string }>([
        { id: 1, category: "A" },
        { id: 2, category: "B" },
        { id: 3, category: "A" },
        { id: 4, category: "B" },
      ]);
      const result = list.groupBy((x) => x.category);

      const groups = [...result];
      expect(groups.length).toBe(2); // Two categories: "A" and "B"
      expect(groups[0].key).toBe("A");
      expect(groups[0].toArray()).toEqual([
        { id: 1, category: "A" },
        { id: 3, category: "A" },
      ]);
      expect(groups[1].key).toBe("B");
      expect(groups[1].toArray()).toEqual([
        { id: 2, category: "B" },
        { id: 4, category: "B" },
      ]);
    });

    it("should allow mapping elements using a mapper function", () => {
      const list = new List<number>([1, 2, 3, 4, 5, 6]);
      const result = list.groupBy(
        (x) => (x % 2 === 0 ? "even" : "odd"),
        (x) => x * 2
      );

      const groups = [...result];
      expect(groups.length).toBe(2); // Two groups: "even" and "odd"
      expect(groups[0].key).toBe("odd");
      expect(groups[0].toArray()).toEqual([2, 6, 10]);
      expect(groups[1].key).toBe("even");
      expect(groups[1].toArray()).toEqual([4, 8, 12]);
    });

    it("should handle empty lists", () => {
      const list = new List<number>([]);
      const result = list.groupBy((x) => (x % 2 === 0 ? "even" : "odd"));

      expect([...result]).toEqual([]); // No groups
    });

    it("should handle custom comparers for grouping", () => {
      const list = new List<string>(["apple", "banana", "apricot", "blueberry"]);
      const comparer: IComparer<string> = {
        getHashCode: (key: string) => key[0],
        equals: (a, b) => a === b,
      };
      const result = list.groupBy(
        (x) => x[0],
        (x) => x,
        comparer
      );

      const groups = [...result];
      expect(groups.length).toBe(2); // Two groups: "a" and "b"
      expect(groups[0].key).toBe("a");
      expect(groups[0].toArray()).toEqual(["apple", "apricot"]);
      expect(groups[1].key).toBe("b");
      expect(groups[1].toArray()).toEqual(["banana", "blueberry"]);
    });

    it("should group elements with mixed types using a key selector", () => {
      const list = new List<any>([1, "1", true, false]);
      const result = list.groupBy((x) => typeof x);

      const groups = [...result];
      expect(groups.length).toBe(3); // Three groups: "number", "string", and "boolean"
      expect(groups[0].key).toBe("number");
      expect(groups[0].toArray()).toEqual([1]);
      expect(groups[1].key).toBe("string");
      expect(groups[1].toArray()).toEqual(["1"]);
      expect(groups[2].key).toBe("boolean");
      expect(groups[2].toArray()).toEqual([true, false]);
    });

    it("should preserve order within each group and the order of groups", () => {
      const list = new List<number>([5, 3, 8, 1, 2, 8]);
      const result = list.groupBy((x) => (x % 2 === 0 ? "even" : "odd"));

      const groups = [...result];
      expect(groups.length).toBe(2); // Two groups: "even" and "odd"
      expect(groups[0].key).toBe("odd");
      expect(groups[0].toArray()).toEqual([5, 3, 1]); // Odd elements in order
      expect(groups[1].key).toBe("even");
      expect(groups[1].toArray()).toEqual([8, 2, 8]); // Even elements in order
    });

    it("should not modify the original list", () => {
      const list = new List<number>([1, 2, 3, 4]);
      list.groupBy((x) => (x % 2 === 0 ? "even" : "odd"));

      expect([...list]).toEqual([1, 2, 3, 4]); // Original list remains unchanged
    });
  });

  describe("List<T>.groupJoin", () => {
    interface Person {
      id: number;
      name: string;
    }

    interface Order {
      personId: number;
      product: string;
    }

    beforeEach(() => {});

    test("should correctly group items based on keys", () => {
      const people = new List<Person>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);

      const orders = [
        { personId: 1, product: "Apples" },
        { personId: 1, product: "Oranges" },
        { personId: 2, product: "Bananas" },
      ];

      const result = people.groupJoin(
        orders,
        (p) => p.id,
        (o) => o.personId,
        (person, orderGroup) => ({
          person: person.name,
          orders: Array.from(orderGroup).map((order) => order.product),
        })
      );

      const resultArray = result.toArray();

      expect(resultArray).toHaveLength(2);

      expect(resultArray).toEqual([
        { person: "Alice", orders: ["Apples", "Oranges"] },
        { person: "Bob", orders: ["Bananas"] },
      ]);
    });

    test("should return an empty list when the second sequence is empty", () => {
      const people = new List<Person>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);

      const orders: Order[] = [];

      const result = people.groupJoin(
        orders,
        (p) => p.id,
        (o) => o.personId,
        (person, orderGroup) => ({
          person: person.name,
          orders: Array.from(orderGroup).map((order) => order.product),
        })
      );

      const resultArray = result.toArray();

      expect(resultArray).toHaveLength(2);

      expect(resultArray).toEqual([
        { person: "Alice", orders: [] },
        { person: "Bob", orders: [] },
      ]);
    });

    test("should handle unmatched keys gracefully", () => {
      const people = new List<Person>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ]);

      const orders = [
        { personId: 1, product: "Apples" },
        { personId: 1, product: "Oranges" },
        { personId: 2, product: "Bananas" },
      ];

      const result = people.groupJoin(
        orders,
        (p) => p.id,
        (o) => o.personId,
        (person, orderGroup) => ({
          person: person.name,
          orders: Array.from(orderGroup).map((order) => order.product),
        })
      );

      const resultArray = result.toArray();

      expect(resultArray).toHaveLength(3);

      expect(resultArray).toEqual([
        { person: "Alice", orders: ["Apples", "Oranges"] },
        { person: "Bob", orders: ["Bananas"] },
        { person: "Charlie", orders: [] },
      ]);
    });

    test("should work with custom key selectors and complex objects", () => {
      const people = new List<Person>([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ]);

      const orders = [
        { personId: 10, product: "Apples" },
        { personId: 20, product: "Oranges" },
        { personId: 10, product: "Bananas" },
      ];

      const result = people.groupJoin(
        orders,
        (p) => p.id * 10, // Custom key selector
        (o) => o.personId,
        (person, orderGroup) => ({
          person: person.name,
          orders: Array.from(orderGroup).map((order) => order.product),
        })
      );

      const resultArray = result.toArray();

      expect(resultArray).toHaveLength(2);

      expect(resultArray).toEqual([
        { person: "Alice", orders: ["Apples", "Bananas"] },
        { person: "Bob", orders: ["Oranges"] },
      ]);
    });
  });

  describe("List<T>.IndexOf", () => {
    test("List<T>.IndexOf: should return the index of the first occurrence of the element", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);

      const index = list.IndexOf(30);

      expect(index).toBe(2);
    });

    test("List<T>.IndexOf: should return -1 if the element is not in the list", () => {
      const list = new List<number>([10, 20, 30, 40, 50]);

      const index = list.IndexOf(60);

      expect(index).toBe(-1);
    });

    test("List<T>.IndexOf: should return the index of the first occurrence for duplicate elements", () => {
      const list = new List<number>([10, 20, 30, 20, 40]);

      const index = list.IndexOf(20);

      expect(index).toBe(1); // The first occurrence of 20 is at index 1
    });

    test("List<T>.IndexOf: should handle an empty list and return -1", () => {
      const list = new List<number>([]);

      const index = list.IndexOf(10);

      expect(index).toBe(-1);
    });

    test("List<T>.IndexOf: should work with string elements", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);

      const index = list.IndexOf("banana");

      expect(index).toBe(1);
    });

    test("List<T>.IndexOf: should return -1 for non-existent string elements", () => {
      const list = new List<string>(["apple", "banana", "cherry"]);

      const index = list.IndexOf("pear");

      expect(index).toBe(-1);
    });

    test("List<T>.IndexOf: should correctly compare object references", () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 3 };

      const list = new List<object>([obj1, obj2, obj3]);

      const index1 = list.IndexOf(obj2);
      const index2 = list.IndexOf({ id: 2 }); // Different object reference

      expect(index1).toBe(1);
      expect(index2).toBe(-1); // Since { id: 2 } is not the same reference as obj2
    });

    test("List<T>.IndexOf: should handle custom class instances", () => {
      class Person {
        constructor(public id: number, public name: string) {}
      }

      const person1 = new Person(1, "Alice");
      const person2 = new Person(2, "Bob");
      const person3 = new Person(3, "Charlie");

      const list = new List<Person>([person1, person2, person3]);

      const index = list.IndexOf(person2);

      expect(index).toBe(1);
    });
  });
  // describe("List<T>.insert", () => {
  //   test("List<T>.insert: should insert an element at the specified index", () => {
  //     const list = new List<number>([10, 20, 30, 40]);

  //     list.insert(25, 2);

  //     expect(list.toArray()).toEqual([10, 20, 25, 30, 40]);
  //   });

  //   test("List<T>.insert: should insert an element at the beginning if index is 0", () => {
  //     const list = new List<number>([10, 20, 30]);

  //     list.insert(5, 0);

  //     expect(list.toArray()).toEqual([5, 10, 20, 30]);
  //   });

  //   test("List<T>.insert: should insert an element at the end if index equals the list length", () => {
  //     const list = new List<number>([10, 20, 30]);

  //     list.insert(40, 3);

  //     expect(list.toArray()).toEqual([10, 20, 30, 40]);
  //   });

  //   test("List<T>.insert: should throw an error if index is negative", () => {
  //     const list = new List<number>([10, 20, 30]);

  //     expect(() => list.insert(5, -1)).toThrow(Error);
  //   });

  //   test("List<T>.insert: should throw an error if index is greater than the list length", () => {
  //     const list = new List<number>([10, 20, 30]);

  //     expect(() => list.insert(40, 5)).toThrow(Error);
  //   });

  //   test("List<T>.insert: should insert an element without specifying an index (append to end)", () => {
  //     const list = new List<number>([10, 20, 30]);

  //     list.insert(40);

  //     expect(list.toArray()).toEqual([10, 20, 30, 40]);
  //   });

  //   test("List<T>.insert: should handle inserting into an empty list", () => {
  //     const list = new List<number>([]);

  //     list.insert(10, 0);

  //     expect(list.toArray()).toEqual([10]);
  //   });

  //   test("List<T>.insert: should handle inserting strings", () => {
  //     const list = new List<string>(["apple", "banana", "cherry"]);

  //     list.insert("date", 2);

  //     expect(list.toArray()).toEqual(["apple", "banana", "date", "cherry"]);
  //   });

  //   test("List<T>.insert: should handle inserting custom objects", () => {
  //     class Person {
  //       constructor(public name: string) {}
  //     }

  //     const person1 = new Person("Alice");
  //     const person2 = new Person("Bob");
  //     const person3 = new Person("Charlie");

  //     const list = new List<Person>([person1, person2]);

  //     list.insert(person3, 1);

  //     expect(list.toArray()).toEqual([person1, person3, person2]);
  //   });
  // });
});
