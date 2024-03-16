
function minimumCost(source: string, target: string, original: string[], changed: string[], cost: number[]): number {
    this.NO_PATH_FOUND = -1;
    this.ALPHABET_SIZE = 26;
    this.ASCII_SMALL_CASE_A = 97;
    this.minCostPath = Array.from(new Array<Array<number>>(this.ALPHABET_SIZE),
        () => new Array<number>(this.ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER));

    initializeArrayMinCostPath(original, changed, cost);
    findAllMinCostPathsThroughFloydWarshallAlgorithm();
    return findMinCostToConvertSourceToTarget(source, target);
};

function findMinCostToConvertSourceToTarget(source: string, target: string): number {
    let minCostToConvertSourceToTarget = 0;

    for (let i = 0; i < source.length; ++i) {
        let from = source.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        let to = target.codePointAt(i) - this.ASCII_SMALL_CASE_A;

        if (this.minCostPath[from][to] === Number.MAX_SAFE_INTEGER) {
            return this.NO_PATH_FOUND;
        }
        minCostToConvertSourceToTarget += this.minCostPath[from][to];
    }

    return minCostToConvertSourceToTarget;
}

function findAllMinCostPathsThroughFloydWarshallAlgorithm(): void {

    for (let middle = 0; middle < this.ALPHABET_SIZE; ++middle) {

        for (let from = 0; from < this.ALPHABET_SIZE; ++from) {

            if (this.minCostPath[from][middle] === Number.MAX_SAFE_INTEGER) {
                continue;
            }

            for (let to = 0; to < this.ALPHABET_SIZE; ++to) {

                if (from === to || this.minCostPath[middle][to] === Number.MAX_SAFE_INTEGER) {
                    continue;
                }
                if (this.minCostPath[from][to] > this.minCostPath[from][middle] + this.minCostPath[middle][to]) {
                    this.minCostPath[from][to] = this.minCostPath[from][middle] + this.minCostPath[middle][to];
                }
            }
        }
    }
}

function initializeArrayMinCostPath(original: string[], changed: string[], cost: number[]): void {
    for (let i = 0; i < original.length; ++i) {
        let from = original[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        let to = changed[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;

        this.minCostPath[from][to] = Math.min(this.minCostPath[from][to], cost[i]);
        this.minCostPath[from][from] = 0;
        this.minCostPath[to][to] = 0;
    }
}
