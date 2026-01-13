import 持续交卷.算法.ListNode;

class Solution {

    /**
     * 思路是一个一个进行反转
     * 
     * 需要一个prev作为头结点，一开始是null，后面逐渐后移
     * 
     * 需要一个current代表当前节点，逐渐往后移动
     * 
     * 注意反转后链接会断开，所以需要一个temp保存next节点
     * 
     * 双指针，一前一后往后移动，直到后面那个指针为null
     * 
     * @param head
     * @return
     */
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;

        ListNode current = head;

        while (current != null) {
            // 1. 临时保存当前节点的下一个节点。因为反转后链接断开了
            ListNode nextTemp = current.next;
            // 2. 反转指向，将当前节点指向前一个节点
            current.next = prev;
            // 3. 指针后移，prev移动到当前节点，curr移动到下一个
            prev = current;
            current = nextTemp;
        }

        return prev;
    }
}