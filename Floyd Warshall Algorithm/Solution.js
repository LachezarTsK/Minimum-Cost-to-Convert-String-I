
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
    this.minCostPath = Array.from(new Array(ALPHABET_SIZE), () => new Array(ALPHABET_SIZE).fill(Number.MAX_SAFE_INTEGER));

    initializeArrayMinCostPath(original, changed, cost);
    findAllMinCostPathsThroughFloydWarshallAlgorithm();
    return findMinCostToConvertSourceToTarget(source, target);
};

/**
 * @param {string} source
 * @param {string} target
 * @return {number}
 */
function findMinCostToConvertSourceToTarget(source, target) {
    let minCostToConvertSourceToTarget = 0;

    for (let i = 0; i < source.length; ++i) {
        let from = source.codePointAt(i) - this.ASCII_SMALL_CASE_A;
        let to = target.codePointAt(i) - this.ASCII_SMALL_CASE_A;

        if (this.minCostPath[from][to] === Number.MAX_SAFE_INTEGER) {
            return this.NO_PATH_FOUND;
        }
        minCostToConvertSourceToTarget += minCostPath[from][to];
    }

    return minCostToConvertSourceToTarget;
}

/**
 * @return {void}
 */
function findAllMinCostPathsThroughFloydWarshallAlgorithm() {

    for (let middle = 0; middle < this.ALPHABET_SIZE; ++middle) {

        for (let from = 0; from < this.ALPHABET_SIZE; ++from) {

            if (this.minCostPath[from][middle] === Number.MAX_SAFE_INTEGER) {
                continue;
            }

            for (let to = 0; to < ALPHABET_SIZE; ++to) {

                if (from === to || minCostPath[middle][to] === Number.MAX_SAFE_INTEGER) {
                    continue;
                }
                if (minCostPath[from][to] > minCostPath[from][middle] + minCostPath[middle][to]) {
                    minCostPath[from][to] = minCostPath[from][middle] + minCostPath[middle][to];
                }
            }
        }
    }
}


/**
 * @param {character[]} original
 * @param {character[]} changed
 * @param {number[]} cost
 * @return {void}
 */
function initializeArrayMinCostPath(original, changed, cost) {
    for (let i = 0; i < original.length; ++i) {
        let from = original[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;
        let to = changed[i].codePointAt(0) - this.ASCII_SMALL_CASE_A;

        this.minCostPath[from][to] = Math.min(this.minCostPath[from][to], cost[i]);
        this.minCostPath[from][from] = 0;
        this.minCostPath[to][to] = 0;
    }
}
