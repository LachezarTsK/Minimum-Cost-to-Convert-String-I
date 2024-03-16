
function minimumCost(source: string, target: string, original: string[], changed: string[], cost: number[]): number {
    this.NO_PATH_FOUND = -1;
    this.ALPHABET_SIZE = 26;
    this.ASCII_SMALL_CASE_A = 97;
    this.graph = Array.from(new Array(this.ALPHABET_SIZE), () => new Array(this.ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER));
    this.minCostPath = Array.from(new Array(this.ALPHABET_SIZE), () => new Array(this.ALPHABET_SIZE).fill(0));

    createGraph(original, changed, cost);
    return findMinCostToConvertSourceToTarget(source, target);
};


function NodeLetter(letter: string, costFromStart: number) {
    this.letter = letter;
    this.costFromStart = costFromStart;
}


function findMinCostToConvertSourceToTarget(source: string, target: string): number {
    let minCostToConvertSourceToTarget = 0;

    for (let i = 0; i < source.length; ++i) {
        let sourceLetter = source.charAt(i);
        let targetLetter = target.charAt(i);

        let indexSourceLetter = source.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        let indexTargetLetter = target.codePointAt(i) - this.ASCII_SMALL_CASE_A;

        if (this.minCostPath[indexSourceLetter][indexTargetLetter] > 0) {
            minCostToConvertSourceToTarget += this.minCostPath[indexSourceLetter][indexTargetLetter];
            continue;
        }

        let currentCost = dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter);
        if (currentCost === this.NO_PATH_FOUND) {
            return this.NO_PATH_FOUND;
        }

        this.minCostPath[indexSourceLetter][indexTargetLetter] = currentCost;
        minCostToConvertSourceToTarget += currentCost;
    }

    return minCostToConvertSourceToTarget;
}

function dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter: string, targetLetter: string): number {
    if (sourceLetter === targetLetter) {
        return 0;
    }
    // MinPriorityQueue<Node>
    // import { MinPriorityQueue } from "@datastructures-js/priority-queue";
    const minHeapCostFromStart = new MinPriorityQueue({ compare: (x, y) => x.costFromStart - y.costFromStart });
    minHeapCostFromStart.enqueue(new NodeLetter(sourceLetter, 0));

    const minCostCurrentPath = new Array(this.ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER);
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
            if (current.costFromStart + this.graph[from][to] < minCostCurrentPath[to]) {
                minCostCurrentPath[to] = current.costFromStart + this.graph[from][to];
                let nextLetter = String.fromCodePoint(to + this.ASCII_SMALL_CASE_A);
                minHeapCostFromStart.enqueue(new NodeLetter(nextLetter, minCostCurrentPath[to]));
            }
        }
    }
    return this.NO_PATH_FOUND;
}

function createGraph(original: string[], changed: string[], cost: number[]): void {
    for (let i = 0; i < original.length; ++i) {
        let from = original[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        let to = changed[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        this.graph[from][to] = Math.min(this.graph[from][to], cost[i]);
    }
}
