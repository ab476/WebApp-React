import { DoublyLinkedList, DoublyLinkedListNode } from "./DoublyLinkedList";

describe("DoublyLinkedList<T>", () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = new DoublyLinkedList<number>();
  });
  describe('DoublyLinkedList getNodes method', () => {
  
    test('should return an empty iterable for an empty list', () => {
      const nodes = [...list.getNodes()];
      expect(nodes).toHaveLength(0);
    });
  
    test('should return a single node for a list with one item', () => {
      list.append(42);
  
      const nodes = [...list.getNodes()];
      expect(nodes).toHaveLength(1);
  
      expect(nodes[0]).toBeInstanceOf(DoublyLinkedListNode);
      expect(nodes[0].value).toBe(42);
      expect(nodes[0].next).toBeUndefined();
      expect(nodes[0].prev).toBeUndefined();
    });
  
    test('should return all nodes in the correct order for a list with multiple items', () => {
      list.append(10);
      list.append(20);
      list.append(30);
  
      const nodes = [...list.getNodes()];
  
      expect(nodes).toHaveLength(3);
      expect(nodes[0].value).toBe(10);
      expect(nodes[1].value).toBe(20);
      expect(nodes[2].value).toBe(30);
  
      // Validate node links
      expect(nodes[0].next).toBe(nodes[1]);
      expect(nodes[1].prev).toBe(nodes[0]);
      expect(nodes[1].next).toBe(nodes[2]);
      expect(nodes[2].prev).toBe(nodes[1]);
      expect(nodes[2].next).toBeUndefined();
      
    });
  
    test('should allow iteration over the list using for...of', () => {
      list.append(5);
      list.append(15);
      list.append(25);
  
      const values = [];
      for (const node of list.getNodes()) {
        values.push(node.value);
      }
  
      expect(values).toEqual([5, 15, 25]);
    });
  
    test('should handle a list where nodes are manually removed', () => {
      list.append(100);
      list.append(200);
      list.append(300);
  
      // Simulate removing the second node (manually adjusting pointers)
      const head = [...list.getNodes()][0];
      const second = head.next;
      const third = second?.next;
  
      if (second) {
        head.next = third;
      }
      if (third) {
        third.prev = head;
      }
  
      const nodes = [...list.getNodes()];
      expect(nodes).toHaveLength(2);
      expect(nodes[0].value).toBe(100);
      expect(nodes[1].value).toBe(300);
    });
  });
  describe("isEmpty", () => {
    it("should return true for an empty list", () => {
      expect(list.isEmpty()).toBe(true);
    });

    it("should return false after adding elements", () => {
      list.append(1);
      expect(list.isEmpty()).toBe(false);
    });

    it("should return true after clearing the list", () => {
      list.append(1);
      list.clear();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe("get", () => {
    it("should return the value at the specified index", () => {
      list.append(10);
      list.append(20);
      list.append(30);
      expect(list.get(1)).toBe(20);
    });

    it("should return null for out-of-bounds indices", () => {
      list.append(10);
      expect(list.get(-1)).toBeNull();
      expect(list.get(5)).toBeNull();
    });
  });

  describe("DoublyLinkedList.getNodeAt", () => {
    it("should return null for an index less than 0", () => {
      list.append(1);
      list.append(2);
  
      const node = list.getNodeAt(-1);
      expect(node).toBeNull(); // Index out of bounds
    });
  
    it("should return null for an index greater than or equal to the length", () => {
      list.append(1);
      list.append(2);
  
      const node = list.getNodeAt(2); // Length is 2, so index 2 is out of bounds
      expect(node).toBeNull();
    });
  
    it("should return the head node for index 0", () => {
      list.append(1);
      list.append(2);
  
      const node = list.getNodeAt(0);
      expect(node?.value).toBe(1); // Head node
      expect(node?.prev).toBeUndefined();
      expect(node?.next?.value).toBe(2);
    });
  
    it("should return the correct node for a valid middle index", () => {
      list.append(1);
      list.append(2);
      list.append(3);
  
      const node = list.getNodeAt(1); // Middle node
      expect(node?.value).toBe(2);
      expect(node?.prev?.value).toBe(1);
      expect(node?.next?.value).toBe(3);
    });
  
    it("should return the tail node for the last index", () => {
      list.append(1);
      list.append(2);
      list.append(3);
  
      const node = list.getNodeAt(2); // Tail node
      expect(node?.value).toBe(3);
      expect(node?.prev?.value).toBe(2);
      expect(node?.next).toBeUndefined();
    });
  
    it("should return null for an empty list", () => {
      const node = list.getNodeAt(0); // No nodes in the list
      expect(node).toBeNull();
    });
  
    it("should handle lists with one element", () => {
      list.append(1);
  
      const node = list.getNodeAt(0);
      expect(node?.value).toBe(1);
      expect(node?.prev).toBeUndefined();
      expect(node?.next).toBeUndefined();
    });
  
    it("should traverse correctly for larger lists", () => {
      for (let i = 1; i <= 10; i++) {
        list.append(i);
      }
  
      const node = list.getNodeAt(7); // 8th element (index 7)
      expect(node?.value).toBe(8);
      expect(node?.prev?.value).toBe(7);
      expect(node?.next?.value).toBe(9);
    });
  });
  
  describe("prepend", () => {
    it("should add elements to the head of the list", () => {
      list.prepend(1);
      list.prepend(2);
      expect(list.toArray()).toEqual([2, 1]);
    });
  });

  describe("pop", () => {
    it("should remove and return the head element", () => {
      list.prepend(1);
      list.prepend(2);
      expect(list.pop()).toBe(2);
      expect(list.toArray()).toEqual([1]);
    });

    it("should throw an error if the list is empty", () => {
      expect(() => list.pop()).toThrow("Index out of bounds");
    });
  });

  describe("append", () => {
    it("should add elements to the tail of the list", () => {
      list.append(1);
      list.append(2);
      expect(list.toArray()).toEqual([1, 2]);
    });
  });

  describe("removeTail", () => {
    it("should remove and return the tail element", () => {
      list.append(1);
      list.append(2);
      expect(list.removeTail()).toBe(2);
      expect(list.toArray()).toEqual([1]);
    });

    it("should throw an error if the list is empty", () => {
      expect(() => list.removeTail()).toThrow("Index out of bounds");
    });
  });

  describe("insertAt", () => {
    it("should insert an element at the specified index", () => {
      list.append(1);
      list.append(3);
      list.insertAt(1, 2);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it("should throw an error for invalid indices", () => {
      expect(() => list.insertAt(-1, 1)).toThrow("Index out of bounds");
    });
  });

  describe("removeAt", () => {
    it("should remove and return the element at the specified index", () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.removeAt(1)).toBe(2);
      expect(list.toArray()).toEqual([1, 3]);
    });

    it("should throw an error for invalid indices", () => {
      expect(() => list.removeAt(5)).toThrow("Index out of bounds");
    });
  });
  describe("Remove", () => {
    it("should remove a node from the middle of the list", () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const middleNode = list.getNodeAt(1); // Get the node with value 2
      list.remove(middleNode!);

      expect(list.toArray()).toEqual([1, 3]);
      expect(list.getLength()).toBe(2);
    });

    it("should remove the head node", () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const headNode = list.getNodeAt(0); // Get the head node with value 1
      list.remove(headNode!);

      expect(list.toArray()).toEqual([2, 3]);
      expect(list.getLength()).toBe(2);
    });

    it("should remove the tail node", () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const tailNode = list.getNodeAt(2); // Get the tail node with value 3
      list.remove(tailNode!);

      expect(list.toArray()).toEqual([1, 2]);
      expect(list.getLength()).toBe(2);
    });

    it("should handle a single-node list", () => {
      list.append(1);

      const singleNode = list.getNodeAt(0)!; // Get the only node in the list
      list.remove(singleNode);

      expect(list.toArray()).toEqual([]);
      expect(list.getLength()).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it("should not throw an error for a detached node", () => {
      const detachedNode = new DoublyLinkedListNode<number>(99);
      list.append(1);
      list.append(2);

      expect(() => list.remove(detachedNode)).not.toThrow();
      expect(list.toArray()).toEqual([1, 2]); // List remains unchanged
      expect(list.getLength()).toBe(2);
    });
  });
  describe("reverse", () => {
    it("should reverse the list", () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();
      expect(list.toArray()).toEqual([3, 2, 1]);
    });

    it("should return null if the list is empty", () => {
      expect(list.reverse()).toBeNull();
    });
  });

  describe("clear", () => {
    it("should clear all elements from the list", () => {
      list.append(1);
      list.append(2);
      list.clear();
      expect(list.isEmpty()).toBe(true);
      expect(list.toArray()).toEqual([]);
    });
  });

  describe("toArray", () => {
    it("should convert the list to an array", () => {
      list.append(1);
      list.append(2);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it("should return an empty array for an empty list", () => {
      expect(list.toArray()).toEqual([]);
    });
  });

  describe("getLength", () => {
    it("should return the correct length of the list", () => {
      list.append(1);
      list.append(2);
      expect(list.getLength()).toBe(2);
    });

    it("should return 0 for an empty list", () => {
      expect(list.getLength()).toBe(0);
    });
  });
});
