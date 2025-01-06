"use strict";
/**
 * References: \
 * [LevoratoJoao](https://github.com/LevoratoJoao/Data-Structures/blob/main/Python/Sort/sortAlgorithm.py) - Heap Sort implemented by myself
 * [@mohamedhedi.aissi](https://medium.com/@mohamedhedi.aissi/priority-queue-in-typescript-implementation-updating-priority-of-heap-elements-removing-c35a276f9b1a) \
 * [RonPenton](https://github.com/RonPenton/ts-priority-queue/tree/master/src)
 *
 */
class PriorityQueue {
    /**
     * Implements a Heap
     *
     * Min heap: a < b \
     * Max heap: a > b
     *
     * This implementation of PriorityQueue is exclusive for this problem where we use a Cell type as data \
     * If you want to use a generic type use the interface above (PriorityQueueValue<T>) instead of Cell
     */
    constructor() {
        this._heap = [];
        this._comparator = (a, b) => a.cost < b.cost;
    }
    /**
     * size - returns the size of the heap
     * @returns number
     */
    size() {
        return this._heap.length;
    }
    /**
     * isEmpty - returns if the heap is empty
     * @returns boolean
     */
    isEmpty() {
        return this.size() == 0;
    }
    /**
     * peek - returns the root of the heap
     * @returns PriorityQueueValue<T>
     */
    peek() {
        if (this.isEmpty())
            throw new Error("Heap is empty");
        return this._heap[0];
    }
    /**
     * push - add element to the heap
     */
    push(value) {
        this._heap.push(value);
        this._bubbleUp(this._heap.length - 1);
    }
    pop() {
        if (this.isEmpty())
            throw new Error("Heap is empty");
        const removed = this._heap[0];
        const last = this._heap.pop();
        if (this.size() > 0 && last !== undefined) {
            this._heap[0] = last;
            this._bubbleDown(0);
        }
        return removed;
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]]; // Swap
    }
    heapfy() {
        if (this.size() > 0) {
            for (let i = 0; i < this._heap.length; i++) {
                this._bubbleUp(i);
            }
        }
    }
    /**
     * _bubbleUp - moves node up the tree
     */
    _bubbleUp(pos) {
        const parent = Math.floor((pos - 1) / 2);
        while (pos > 0 && this._comparator(this._heap[pos], this._heap[parent])) {
            // const x = this._heap[parent];
            // this._heap[parent] = this._heap[pos];
            // this._heap[pos] = x;
            this._swap(pos, parent); // Swap
            pos = parent;
        }
    }
    /**
     * _bubbleDown - moves node down on the tree
     */
    _bubbleDown(pos) {
        const size = this.size();
        while (true) {
            const left = 2 * pos + 1;
            const right = left + 1;
            let minIndex = pos;
            if (left < size && this._comparator(this._heap[left], this._heap[pos])) {
                minIndex = left;
            }
            if (right < size && this._comparator(this._heap[right], this._heap[minIndex])) {
                minIndex = right;
            }
            if (pos != minIndex) {
                this._swap(pos, minIndex);
                pos = minIndex;
            }
            else {
                break;
            }
        }
    }
}
//# sourceMappingURL=priorityQueue.js.map