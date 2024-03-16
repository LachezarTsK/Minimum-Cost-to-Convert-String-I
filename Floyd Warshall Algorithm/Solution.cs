
using System;

public class Solution
{
    private static readonly long NO_PATH_FOUND = -1;
    private static readonly int ALPHABET_SIZE = 26;
    private readonly long[,] minCostPath = new long[ALPHABET_SIZE, ALPHABET_SIZE];

    public long MinimumCost(string source, string target, char[] original, char[] changed, int[] cost)
    {
        InitializeArrayMinCostPath(original, changed, cost);
        FindAllMinCostPathsThroughFloydWarshallAlgorithm();
        return FindMinCostToConvertSourceToTarget(source, target);
    }

    private long FindMinCostToConvertSourceToTarget(String source, String target)
    {
        long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.Length; ++i)
        {
            int from = source[i] - 'a';
            int to = target[i] - 'a';

            if (minCostPath[from, to] == long.MaxValue)
            {
                return NO_PATH_FOUND;
            }
            minCostToConvertSourceToTarget += minCostPath[from, to];
        }

        return minCostToConvertSourceToTarget;
    }

    private void FindAllMinCostPathsThroughFloydWarshallAlgorithm()
    {
        for (int middle = 0; middle < ALPHABET_SIZE; ++middle)
        {
            for (int from = 0; from < ALPHABET_SIZE; ++from)
            {
                if (minCostPath[from, middle] == long.MaxValue)
                {
                    continue;
                }

                for (int to = 0; to < ALPHABET_SIZE; ++to)
                {
                    if (from == to || minCostPath[middle, to] == long.MaxValue)
                    {
                        continue;
                    }
                    if (minCostPath[from, to] > minCostPath[from, middle] + minCostPath[middle, to])
                    {
                        minCostPath[from, to] = minCostPath[from, middle] + minCostPath[middle, to];
                    }
                }
            }
        }
    }

    private void InitializeArrayMinCostPath(char[] original, char[] changed, int[] cost)
    {
        for (int r = 0; r < ALPHABET_SIZE; ++r)
        {
            for (int c = 0; c < ALPHABET_SIZE; ++c)
            {
                minCostPath[r, c] = long.MaxValue;
            }
        }

        for (int i = 0; i < original.Length; ++i)
        {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';

            minCostPath[from, to] = Math.Min(minCostPath[from, to], cost[i]);
            minCostPath[from, from] = 0;
            minCostPath[to, to] = 0;
        }
    }
}
