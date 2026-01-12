class Solution {

    /**
     * 反转句子中的英语单词
     * 
     * @param s
     * @return
     */
    String reverseWords(String s) {
        StringBuilder builder = new StringBuilder();

        int tail = s.length() - 1;

        while (tail >= 0) {
            // 跳过空格
            while (tail >= 0 && s.charAt(tail) == ' ') {
                tail--;
            }

            if (tail < 0) {
                break;
            }

            int end = tail;
            while (tail >= 0 && s.charAt(tail) != ' ') {
                tail--;
            }

            if (builder.length() > 0) {
                builder.append(" ");
            }

            builder.append(s.substring(tail, end));
        }

        return builder.toString();
    }
}