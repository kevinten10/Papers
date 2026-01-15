class Solution {

    int mySqrt(int n) {
        if (n < 1) {
            return n;
        }

        int left = 1;
        int right = n;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // 使用除法防止 mid*mid 溢出
            int sqrt = n / mid;

            if (sqrt == mid) {
                return mid;
            }
            // mid大于平方根，需要向左搜索
            if (mid > sqrt) {
                right = mid - 1;
            }
            // mid小于平方根，需要向右搜索
            else {
                left = mid + 1;
            }
        }

        // 循环结束时，right就是最大的满足平凡根的整数
        return right;
    }
}
