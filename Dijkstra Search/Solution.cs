
using System;
using System.Collections.Generic;

public class Solution
{
    private readonly record struct NodeLetter(char letter, long costFromStart);

    private static readonly long NO_PATH_FOUND = -1;
    private static readonly int ALPHABET_SIZE = 26;

    private readonly long[,] graph = new long[ALPHABET_SIZE, ALPHABET_SIZE];
    private readonly long[,] minCostPath = new long[ALPHABET_SIZE, ALPHABET_SIZE];

    public long MinimumCost(string source, string target, char[] original, char[] changed, int[] cost)
    {
        CreateGraph(original, changed, cost);
        return FindMinCostToConvertSourceToTarget(source, target);
    }

    private long FindMinCostToConvertSourceToTarget(String source, String target)
    {
        long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.Length; ++i)
        {
            char sourceLetter = source[i];
            char targetLetter = target[i];

            if (minCostPath[sourceLetter - 'a', targetLetter - 'a'] > 0)
            {
                minCostToConvertSourceToTarget += minCostPath[sourceLetter - 'a', targetLetter - 'a'];
                continue;
            }

            long currentCost = DijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter);
            if (currentCost == NO_PATH_FOUND)
            {
                return NO_PATH_FOUND;
            }

            minCostPath[sourceLetter - 'a', targetLetter - 'a'] = currentCost;
            minCostToConvertSourceToTarget += currentCost;
        }

        return minCostToConvertSourceToTarget;
    }

    private long DijkstraSearchForMinCostPathFromSourceToTarget(char sourceLetter, char targetLetter)
    {
        if (sourceLetter == targetLetter)
        {
            return 0;
        }

        Comparer<long> comparator = Comparer<long>.Create((x, y) => x.CompareTo(y));
        PriorityQueue<NodeLetter, long> minHeapCostFromStart =
            new PriorityQueue<NodeLetter, long>(comparator);
        minHeapCostFromStart.Enqueue(new NodeLetter(sourceLetter, 0), 0);

        long[] minCostCurrentPath = new long[ALPHABET_SIZE];
        Array.Fill(minCostCurrentPath, long.MaxValue);
        minCostCurrentPath[sourceLetter - 'a'] = 0;

        while (minHeapCostFromStart.Count > 0)
        {
            NodeLetter current = minHeapCostFromStart.Dequeue();
            if (current.letter == targetLetter)
            {
                return minCostCurrentPath[current.letter - 'a'];
            }

            int from = current.letter - 'a';
            for (int to = 0; to < ALPHABET_SIZE; ++to)
            {

                if (graph[from, to] == long.MaxValue)
                {
                    continue;
                }
                if (current.costFromStart + graph[from, to] < minCostCurrentPath[to])
                {
                    minCostCurrentPath[to] = current.costFromStart + graph[from, to];
                    char nextLetter = (char)(to + 'a');
                    minHeapCostFromStart.Enqueue(new NodeLetter(nextLetter, minCostCurrentPath[to]), minCostCurrentPath[to]);
                }
            }
        }
        return NO_PATH_FOUND;
    }

    private void CreateGraph(char[] original, char[] changed, int[] cost)
    {
        for (int r = 0; r < ALPHABET_SIZE; ++r)
        {
            for (int c = 0; c < ALPHABET_SIZE; ++c)
            {
                graph[r, c] = long.MaxValue;
            }
        }

        for (int i = 0; i < original.Length; ++i)
        {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';
            graph[from, to] = Math.Min(graph[from, to], cost[i]);
        }
    }
}
