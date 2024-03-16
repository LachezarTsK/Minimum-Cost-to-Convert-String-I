
import java.util.Arrays;
import java.util.PriorityQueue;

public class Solution {

    private record NodeLetter(char letter, long costFromStart) {}

    private static final long NO_PATH_FOUND = -1;
    private static final int ALPHABET_SIZE = 26;
    
    private final long[][] graph = new long[ALPHABET_SIZE][ALPHABET_SIZE];
    private final long[][] minCostPath = new long[ALPHABET_SIZE][ALPHABET_SIZE];

    public long minimumCost(String source, String target, char[] original, char[] changed, int[] cost) {
        createGraph(original, changed, cost);
        return findMinCostToConvertSourceToTarget(source, target);
    }

    private long findMinCostToConvertSourceToTarget(String source, String target) {
        long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.length(); ++i) {
            char sourceLetter = source.charAt(i);
            char targetLetter = target.charAt(i);

            if (minCostPath[sourceLetter - 'a'][targetLetter - 'a'] > 0) {
                minCostToConvertSourceToTarget += minCostPath[sourceLetter - 'a'][targetLetter - 'a'];
                continue;
            }

            long currentCost = dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter);
            if (currentCost == NO_PATH_FOUND) {
                return NO_PATH_FOUND;
            }

            minCostPath[sourceLetter - 'a'][targetLetter - 'a'] = currentCost;
            minCostToConvertSourceToTarget += currentCost;
        }

        return minCostToConvertSourceToTarget;
    }

    private long dijkstraSearchForMinCostPathFromSourceToTarget(char sourceLetter, char targetLetter) {
        if (sourceLetter == targetLetter) {
            return 0;
        }

        PriorityQueue<NodeLetter> minHeapCostFromStart = new PriorityQueue<>(
                (x, y) -> Long.compare(x.costFromStart, y.costFromStart));
        minHeapCostFromStart.add(new NodeLetter(sourceLetter, 0));

        long[] minCostCurrentPath = new long[ALPHABET_SIZE];
        Arrays.fill(minCostCurrentPath, Long.MAX_VALUE);
        minCostCurrentPath[sourceLetter - 'a'] = 0;

        while (!minHeapCostFromStart.isEmpty()) {
            NodeLetter current = minHeapCostFromStart.poll();
            if (current.letter == targetLetter) {
                return minCostCurrentPath[current.letter - 'a'];
            }

            int from = current.letter - 'a';
            for (int to = 0; to < ALPHABET_SIZE; ++to) {

                if (graph[from][to] == Long.MAX_VALUE) {
                    continue;
                }
                if (current.costFromStart + graph[from][to] < minCostCurrentPath[to]) {
                    minCostCurrentPath[to] = current.costFromStart + graph[from][to];
                    char nextLetter = (char) (to + 'a');
                    minHeapCostFromStart.add(new NodeLetter(nextLetter, minCostCurrentPath[to]));
                }
            }
        }
        return NO_PATH_FOUND;
    }

    private void createGraph(char[] original, char[] changed, int[] cost) {
        for (int i = 0; i < ALPHABET_SIZE; ++i) {
            Arrays.fill(graph[i], Long.MAX_VALUE);
        }

        for (int i = 0; i < original.length; ++i) {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';
            graph[from][to] = Math.min(graph[from][to], cost[i]);
        }
    }
}
