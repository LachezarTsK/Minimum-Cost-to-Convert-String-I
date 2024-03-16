
import java.util.Arrays;

public class Solution {

    private static final long NO_PATH_FOUND = -1;
    private static final int ALPHABET_SIZE = 26;
    private final long[][] minCostPath = new long[ALPHABET_SIZE][ALPHABET_SIZE];

    public long minimumCost(String source, String target, char[] original, char[] changed, int[] cost) {
        initializeArrayMinCostPath(original, changed, cost);
        findAllMinCostPathsThroughFloydWarshallAlgorithm();
        return findMinCostToConvertSourceToTarget(source, target);
    }

    private long findMinCostToConvertSourceToTarget(String source, String target) {
        long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.length(); ++i) {
            int from = source.charAt(i) - 'a';
            int to = target.charAt(i) - 'a';

            if (minCostPath[from][to] == Long.MAX_VALUE) {
                return NO_PATH_FOUND;
            }
            minCostToConvertSourceToTarget += minCostPath[from][to];
        }

        return minCostToConvertSourceToTarget;
    }

    private void findAllMinCostPathsThroughFloydWarshallAlgorithm() {

        for (int middle = 0; middle < ALPHABET_SIZE; ++middle) {

            for (int from = 0; from < ALPHABET_SIZE; ++from) {

                if (minCostPath[from][middle] == Long.MAX_VALUE) {
                    continue;
                }

                for (int to = 0; to < ALPHABET_SIZE; ++to) {

                    if (from == to || minCostPath[middle][to] == Long.MAX_VALUE) {
                        continue;
                    }
                    if (minCostPath[from][to] > minCostPath[from][middle] + minCostPath[middle][to]) {
                        minCostPath[from][to] = minCostPath[from][middle] + minCostPath[middle][to];
                    }
                }
            }
        }
    }

    private void initializeArrayMinCostPath(char[] original, char[] changed, int[] cost) {
        for (int i = 0; i < ALPHABET_SIZE; ++i) {
            Arrays.fill(minCostPath[i], Long.MAX_VALUE);
            minCostPath[i][i] = 0;
        }

        for (int i = 0; i < original.length; ++i) {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';
            minCostPath[from][to] = Math.min(minCostPath[from][to], cost[i]);
        }
    }
}
