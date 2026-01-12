import java.util.HashMap;
import java.util.Map;

/**
 * 最近最少使用LRU缓存
 * 
 * get操作在关键字存在时返回值，并更新为最近使用
 * put操作在插入新值或更新旧值时，若容量溢出，需逐出最久未使用的关键字
 */
class LRUCache {

    /**
     * 通过哈希表和双向链表实现
     * 
     * 哈希表负责快速定位k-v
     * 双向链表负责维护访问顺序，头部为最近访问，尾部为最久未访问
     */

    static class Node {
        int key;
        int value;
        Node prev;
        Node next;
    }

    Map<Integer, Node> cache = new HashMap<>();

    int size;
    int capacity;

    Node head;
    Node tail;

    LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;

        head = new Node();
        tail = new Node();
        head.next = tail;
        tail.prev = head;
    }

    int get(int key) {
        Node node = cache.get(key);

        if (node == null) {
            return -1;
        }

        moveToHead(node);

        return node.value;
    }

    void put(int key, int value) {
        LRUCache.Node node = cache.get(key);
        if (node != null) {
            node.value = value;
            moveToHead(node);
            return;
        }

        LRUCache.Node newNode = new Node();
        newNode.key = key;
        newNode.value = value;
        cache.put(key, newNode);
        addToHead(newNode);

        size++;
        if (size > capacity) {
            LRUCache.Node removeTail = removeTail();
            cache.remove(removeTail.key);
            size--;
        }
    }

    void moveToHead(Node node) {
        removeNode(node);

    }

    void addToHead(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    Node removeTail() {
        Node res = tail.prev;
        removeNode(res);
        return res;
    }
}