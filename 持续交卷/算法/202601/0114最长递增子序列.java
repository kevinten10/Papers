import java.util.Arrays;

class Solution {

    public int lentghOfLongestIncreasingSubsequence(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int n = nums.length;

        // 状态转移数组
        int[] dp = new int[n];

        // 每个子序列，最短就是自身，就是1
        Arrays.fill(dp, 1);

        // 全局变量
        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            // 向前遍历，如果大于前面的某个子序列的最后一个值，那么就是他的+1
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j]) {
                    // 计算dp[i]
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }

            // 计算全局最大长度
            maxLen = Math.max(maxLen, dp[i]);
        }

        return maxLen;
    }
}
