import java.util.HashSet;
import java.util.Set;

class Solution {

    /**
     * 
     ** 核心思路**：使用滑动窗口算法维护一个无重复字符的窗口，通过左右指针动态调整窗口范围。
     ** 
     * 关键步骤**：
     * 1. 右指针向右移动，扩大窗口范围
     * 2. 当遇到重复字符时，左指针向右移动，缩小窗口直到去除重复字符
     * 3. 记录每次窗口的最大长度
     ** 
     * 优化点**：使用哈希表记录字符最后出现位置，可以直接跳转到重复字符后一个位置，避免逐个移动左指针。
     * 
     * @param s
     * @return
     */
    public int lengthOfLongestSubString(String s) {
        int length = s.length();
        int left = 0;
        int right = 0;
        int maxLength = 0;

        Set<Character> charSet = new HashSet<>();

        while (right < length) {  // 修复：right < length 避免数组越界
            char currentChar = s.charAt(right);

            if (charSet.contains(currentChar)) {
                while (left < right) {
                    char duplicateChar = s.charAt(left);
                    left++;
                    charSet.remove(duplicateChar);  // 修复：移除左指针指向的字符
                    if (duplicateChar == currentChar) {
                        break;
                    }
                }
                // 修复：重复字符处理后，需要将当前字符加入集合
                charSet.add(currentChar);
                right++;
            } else {
                charSet.add(currentChar);
                right++;

                maxLength = Math.max(maxLength, right - left);
            }
        }

        return maxLength;
    }
}