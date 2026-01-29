import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Solution {

    /**
     * 求字符串的全排列
     * @param s 输入字符串
     * @return 所有不重复的全排列结果列表
     */
    public List<String> permute(String s) {
        List<String> result = new ArrayList<>();
        // 空字符串或null直接返回空列表
        if (s == null || s.isEmpty()) {
            return result;
        }
        // 将字符串转换为字符数组，使用回溯法生成全排列
        backtrack(s.toCharArray(), 0, result);
        return result;
    }

    /**
     * 回溯法生成全排列
     * @param chars 字符数组，直接在原数组上交换以节省空间
     * @param index 当前处理的位置
     * @param result 结果列表
     * 
     * 算法核心思路：
     * 1. 如果index到达数组末尾，说明已经生成一个完整排列，添加到结果中
     * 2. 否则，从index位置开始，尝试将每个字符放到当前位置
     * 3. 使用Set记录已经处理过的字符，避免重复排列
     * 4. 递归处理下一个位置
     * 5. 回溯：交换回来，恢复原状
     */
    private void backtrack(char[] chars, int index, List<String> result) {
        // 递归终止条件：所有位置都已确定
        if (index == chars.length) {
            result.add(new String(chars));
            return;
        }

        // 使用Set去重：记录当前层已经处理过的字符
        Set<Character> seen = new HashSet<>();
        
        // 遍历从index开始的所有字符，尝试将其放到index位置
        for (int i = index; i < chars.length; i++) {
            // 如果当前字符已经在本层处理过，跳过（避免重复排列）
            if (seen.contains(chars[i])) {
                continue;
            }
            seen.add(chars[i]);
            
            // 交换：将chars[i]放到index位置
            swap(chars, index, i);
            
            // 递归处理下一个位置
            backtrack(chars, index + 1, result);
            
            // 回溯：交换回来，恢复原数组状态
            swap(chars, index, i);
        }
    }

    /**
     * 交换字符数组中两个位置的字符
     */
    private void swap(char[] chars, int i, int j) {
        char temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
    }

    public static void main(String[] args) {
        Solution solution = new Solution();

        // 测试用例1：不含重复字符的字符串
        String test1 = "abc";
        List<String> result1 = solution.permute(test1);
        System.out.println("字符串 \"" + test1 + "\" 的全排列：");
        for (String perm : result1) {
            System.out.println(perm);
        }
        System.out.println("总数: " + result1.size());

        System.out.println();

        // 测试用例2：包含重复字符的字符串
        String test2 = "aab";
        List<String> result2 = solution.permute(test2);
        System.out.println("字符串 \"" + test2 + "\" 的全排列：");
        for (String perm : result2) {
            System.out.println(perm);
        }
        System.out.println("总数: " + result2.size());
    }
}
