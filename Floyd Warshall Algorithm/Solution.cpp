
#include <span>
#include <array>
#include <vector>
#include <string>
#include <algorithm>
#include <string_view>
using namespace std;

class Solution {

    static const int NO_PATH_FOUND = -1;
    static const int ALPHABET_SIZE = 26;
    array<array<long long, ALPHABET_SIZE>, ALPHABET_SIZE> minCostPath{};

public:
    long long minimumCost
        (const string& source, const string& target, const vector<char>& original, 
         const vector<char>& changed, const vector<int>& cost) {

        initializeArrayMinCostPath(original, changed, cost);
        findAllMinCostPathsThroughFloydWarshallAlgorithm();
        return findMinCostToConvertSourceToTarget(source, target);
    }

private:
    long long findMinCostToConvertSourceToTarget(string_view source, string_view target) {
        long long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.length(); ++i) {
            int from = source[i] - 'a';
            int to = target[i] - 'a';

            if (minCostPath[from][to] == LLONG_MAX) {
                return NO_PATH_FOUND;
            }
            minCostToConvertSourceToTarget += minCostPath[from][to];
        }

        return minCostToConvertSourceToTarget;
    }

    void findAllMinCostPathsThroughFloydWarshallAlgorithm() {

        for (int middle = 0; middle < ALPHABET_SIZE; ++middle) {

            for (int from = 0; from < ALPHABET_SIZE; ++from) {

                if (minCostPath[from][middle] == LLONG_MAX) {
                    continue;
                }

                for (int to = 0; to < ALPHABET_SIZE; ++to) {

                    if (from == to || minCostPath[middle][to] == LLONG_MAX) {
                        continue;
                    }
                    if (minCostPath[from][to] > minCostPath[from][middle] + minCostPath[middle][to]) {
                        minCostPath[from][to] = minCostPath[from][middle] + minCostPath[middle][to];
                    }
                }
            }
        }
    }

    void initializeArrayMinCostPath(span<const char> original, span<const char> changed, span<const int> cost) {
        for (int i = 0; i < ALPHABET_SIZE; ++i) {
            minCostPath[i].fill(LLONG_MAX);
            minCostPath[i][i] = 0;
        }

        for (int i = 0; i < original.size(); ++i) {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';
            minCostPath[from][to] = min(minCostPath[from][to], static_cast<long long>(cost[i]));
        }
    }
};
