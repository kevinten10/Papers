import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import 持续交卷.算法.TreeNode;

class BFS {

    /**
     * 给定一个二叉树根节点，输出其层序遍历的结果
     * 
     * @param root
     * @return
     */
    List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> layers = new ArrayList<>();

        if (root == null) {
            return layers;
        }

        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            int size = queue.size();

            List<Integer> layer = new ArrayList<>(size);

            for (int i = 0; i < size; i++) {
                TreeNode currentNode = queue.poll();

                layer.add(currentNode.val);

                if (currentNode.left != null) {
                    queue.add(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.add(currentNode.right);
                }
            }

            layers.add(layer);
        }

        return layers;
    }
}