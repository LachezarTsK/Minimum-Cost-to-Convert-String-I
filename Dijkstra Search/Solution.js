
/**
 * @param {string} source
 * @param {string} target
 * @param {character[]} original
 * @param {character[]} changed
 * @param {number[]} cost
 * @return {number}
 */
var minimumCost = function (source, target, original, changed, cost) {
    this.NO_PATH_FOUND = -1;
    this.ALPHABET_SIZE = 26;
    this.ASCII_SMALL_CASE_A = 97;
    this.graph = Array.from(new Array(ALPHABET_SIZE), () => new Array(ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER));
    this.minCostPath = Array.from(new Array(ALPHABET_SIZE), () => new Array(ALPHABET_SIZE).fill(0));

    createGraph(original, changed, cost);
    return findMinCostToConvertSourceToTarget(source, target);
};

/**
 * @param {string} letter
 * @param {number} costFromStart
 */
function  NodeLetter(letter, costFromStart) {
    this.letter = letter;
    this.costFromStart = costFromStart;
}

/**
 * @param {string} source
 * @param {string} target
 * @return {number}
 */
function findMinCostToConvertSourceToTarget(source, target) {
    let minCostToConvertSourceToTarget = 0;

    for (let i = 0; i < source.length; ++i) {
        let sourceLetter = source.charAt(i);
        let targetLetter = target.charAt(i);

        let indexSourceLetter = source.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        let indexTargetLetter = target.codePointAt(i) - this.ASCII_SMALL_CASE_A;

        if (this.minCostPath[indexSourceLetter][indexTargetLetter] > 0) {
            minCostToConvertSourceToTarget += minCostPath[indexSourceLetter][indexTargetLetter];
            continue;
        }

        let currentCost = dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter);
        if (currentCost === this.NO_PATH_FOUND) {
            return this.NO_PATH_FOUND;
        }

        minCostPath[indexSourceLetter][indexTargetLetter] = currentCost;
        minCostToConvertSourceToTarget += currentCost;
    }

    return minCostToConvertSourceToTarget;
}

/**
 * @param {string} sourceLetter
 * @param {string} targetLetter
 * @return {number}
 */
function  dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter) {
    if (sourceLetter === targetLetter) {
        return 0;
    }
    // MinPriorityQueue<Node>
    // import { MinPriorityQueue } from "@datastructures-js/priority-queue";
    const minHeapCostFromStart = new MinPriorityQueue(
            {compare: (x, y) => x.costFromStart - y.costFromStart});
    minHeapCostFromStart.enqueue(new NodeLetter(sourceLetter, 0));

    const minCostCurrentPath = new Array(ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER);
    minCostCurrentPath[sourceLetter.codePointAt(0) - this.ASCII_SMALL_CASE_A] = 0;

    while (!minHeapCostFromStart.isEmpty()) {
        const current = minHeapCostFromStart.dequeue();
        if (current.letter === targetLetter) {
            return minCostCurrentPath[current.letter.codePointAt(0) - this.ASCII_SMALL_CASE_A];
        }

        let from = current.letter.codePointAt(0) - this.ASCII_SMALL_CASE_A;
        for (let to = 0; to < this.ALPHABET_SIZE; ++to) {

            if (this.graph[from][to] === Number.MAX_SAFE_INTEGER) {
                continue;
            }
            if (current.costFromStart + graph[from][to] < minCostCurrentPath[to]) {
                minCostCurrentPath[to] = current.costFromStart + graph[from][to];
                let nextLetter = String.fromCodePoint(to + this.ASCII_SMALL_CASE_A);
                minHeapCostFromStart.enqueue(new NodeLetter(nextLetter, minCostCurrentPath[to]));
            }
        }
    }
    return this.NO_PATH_FOUND;
}

/**
 * @param {character[]} original
 * @param {character[]} changed
 * @param {number[]} cost
 * @return {void}
 */
function createGraph(original, changed, cost) {
    for (let i = 0; i < original.length; ++i) {
        let from = original[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        let to = changed[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        this.graph[from][to] = Math.min(graph[from][to], cost[i]);
    }
}
