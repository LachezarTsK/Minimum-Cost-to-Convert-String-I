
#include <array>
#include <queue>
#include <vector>
#include <string>
#include <algorithm>
#include <string_view>
using namespace std;

class Solution {

    struct NodeLetter {
        char letter{};
        long long costFromStart{};
        NodeLetter(char letter, long long costFromStart) :
            letter{ letter }, costFromStart{ costFromStart } {}
    };

    struct comparator {
        auto operator()(const NodeLetter& first, const NodeLetter& second) const {
            return first.costFromStart > second.costFromStart;
        }
    };

    static const int NO_PATH_FOUND = -1;
    static const int ALPHABET_SIZE = 26;

    array<array<long long, ALPHABET_SIZE>, ALPHABET_SIZE> graph {};
    array<array<long long, ALPHABET_SIZE>, ALPHABET_SIZE>  minCostPath {};

public:
    long long minimumCost
        (const string& source, const string& target, const vector<char>& original, 
         const vector<char>& changed, const vector<int>& cost) {

        createGraph(original, changed, cost);
        return findMinCostToConvertSourceToTarget(source, target);
    }

private:
    long long findMinCostToConvertSourceToTarget(string_view source, string_view target) {
        long minCostToConvertSourceToTarget = 0;

        for (int i = 0; i < source.length(); ++i) {
            char sourceLetter = source[i];
            char targetLetter = target[i];

            if (minCostPath[sourceLetter - 'a'][targetLetter - 'a'] > 0) {
                minCostToConvertSourceToTarget += minCostPath[sourceLetter - 'a'][targetLetter - 'a'];
                continue;
            }

            long long currentCost = dijkstraSearchForMinCostPathFromSourceToTarget(sourceLetter, targetLetter);
            if (currentCost == NO_PATH_FOUND) {
                return NO_PATH_FOUND;
            }

            minCostPath[sourceLetter - 'a'][targetLetter - 'a'] = currentCost;
            minCostToConvertSourceToTarget += currentCost;
        }

        return minCostToConvertSourceToTarget;
    }

    long long dijkstraSearchForMinCostPathFromSourceToTarget(char sourceLetter, char targetLetter) {
        if (sourceLetter == targetLetter) {
            return 0;
        }

        priority_queue<NodeLetter, vector<NodeLetter>, comparator> minHeapCostFromStart;
        minHeapCostFromStart.emplace(sourceLetter, 0);

        array<long long, ALPHABET_SIZE> minCostCurrentPath{};
        minCostCurrentPath.fill(LLONG_MAX);
        minCostCurrentPath[sourceLetter - 'a'] = 0;

        while (!minHeapCostFromStart.empty()) {

            NodeLetter current = minHeapCostFromStart.top();
            minHeapCostFromStart.pop();
            if (current.letter == targetLetter) {
                return minCostCurrentPath[current.letter - 'a'];
            }

            int from = current.letter - 'a';
            for (int to = 0; to < ALPHABET_SIZE; ++to) {

                if (graph[from][to] == LLONG_MAX) {
                    continue;
                }
                if (current.costFromStart + graph[from][to] < minCostCurrentPath[to]) {
                    minCostCurrentPath[to] = current.costFromStart + graph[from][to];
                    char nextLetter = static_cast<char>(to + 'a');
                    minHeapCostFromStart.emplace(nextLetter, minCostCurrentPath[to]);
                }

            }
        }
        return NO_PATH_FOUND;
    }

    void createGraph(const vector<char>& original, const vector<char>& changed, const vector<int>& cost) {
        for (int i = 0; i < ALPHABET_SIZE; ++i) {
            graph[i].fill(LLONG_MAX);
        }

        for (int i = 0; i < original.size(); ++i) {
            int from = original[i] - 'a';
            int to = changed[i] - 'a';
            graph[from][to] = min(graph[from][to], static_cast<long long>(cost[i]));
        }
    }
};
