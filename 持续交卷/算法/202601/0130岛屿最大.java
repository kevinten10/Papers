import java.util.*;

/**
 * 岛屿问题 - 找到最大岛屿并返回其坐标
 * 
 * 问题描述：
 * 给定一个二维网格 grid，其中 '1' 表示陆地，'0' 表示水域。
 * 岛屿是指由陆地组成的连通区域（4个方向：上、下、左、右）。
 * 需要找到面积最大的岛屿，并返回该岛屿的所有坐标。
 * 
 * 解题思路：
 * 1. 使用深度优先搜索(DFS)或广度优先搜索(BFS)遍历网格
 * 2. 对于每个未访问的陆地，进行搜索以确定岛屿面积
 * 3. 记录最大岛屿的坐标和面积
 * 4. 返回最大岛屿的坐标列表
 */
class 岛屿最大 {
    
    /**
     * 找到网格中最大岛屿的所有坐标
     * @param grid 二维字符网格，'1'表示陆地，'0'表示水域
     * @return 最大岛屿的坐标列表，每个坐标为 [row, col] 的数组
     */
    public static List<int[]> findLargestIsland(char[][] grid) {
        // 如果网格为空或为空数组，直接返回空列表
        if (grid == null || grid.length == 0 || grid[0].length == 0) {
            return new ArrayList<>();
        }
        
        int rows = grid.length;      // 网格行数
        int cols = grid[0].length;   // 网格列数
        
        // 访问标记数组，防止重复计算
        boolean[][] visited = new boolean[rows][cols];
        
        // 记录最大岛屿的坐标
        List<int[]> maxIslandCoords = new ArrayList<>();
        int maxArea = 0;
        
        // 方向数组：上、下、左、右（4个方向）
        // 用于在DFS中探索相邻的单元格
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        // 遍历整个网格
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                // 如果当前单元格是陆地且未被访问过
                if (grid[i][j] == '1' && !visited[i][j]) {
                    // 使用DFS搜索当前岛屿的所有坐标
                    List<int[]> currentIslandCoords = new ArrayList<>();
                    dfs(grid, visited, i, j, currentIslandCoords, directions);
                    
                    // 获取当前岛屿的面积（坐标数量）
                    int currentArea = currentIslandCoords.size();
                    
                    // 如果当前岛屿面积大于最大面积，更新最大岛屿信息
                    if (currentArea > maxArea) {
                        maxArea = currentArea;
                        maxIslandCoords = currentIslandCoords;
                    }
                }
            }
        }
        
        return maxIslandCoords;
    }
    
    /**
     * 深度优先搜索（DFS）辅助函数
     * 
     * @param grid 字符网格
     * @param visited 访问标记数组
     * @param row 当前单元格行坐标
     * @param col 当前单元格列坐标
     * @param coords 用于存储当前岛屿坐标的列表
     * @param directions 方向数组
     */
    private static void dfs(char[][] grid, boolean[][] visited, 
                           int row, int col, List<int[]> coords,
                           int[][] directions) {
        int rows = grid.length;
        int cols = grid[0].length;
        
        // 边界检查：如果超出网格范围，直接返回
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            return;
        }
        
        // 如果当前单元格不是陆地或已被访问，直接返回
        if (grid[row][col] != '1' || visited[row][col]) {
            return;
        }
        
        // 标记当前单元格为已访问
        visited[row][col] = true;
        
        // 将当前坐标加入列表
        coords.add(new int[]{row, col});
        
        // 递归探索4个方向的相邻单元格
        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];
            dfs(grid, visited, newRow, newCol, coords, directions);
        }
    }
    
    /**
     * 打印坐标列表，用于测试和验证
     * @param coords 坐标列表
     */
    public static void printCoordinates(List<int[]> coords) {
        System.out.println("最大岛屿包含 " + coords.size() + " 个单元格：");
        for (int[] coord : coords) {
            System.out.printf("  坐标: (%d, %d)%n", coord[0], coord[1]);
        }
    }
    
    /**
     * 主函数 - 测试用例
     */
    public static void main(String[] args) {
        // 测试用例1：简单的2x2网格
        char[][] grid1 = {
            {'1', '1', '0', '0'},
            {'0', '1', '0', '0'},
            {'0', '0', '1', '1'},
            {'0', '0', '1', '1'}
        };
        
        System.out.println("=== 测试用例1 ===");
        System.out.println("网格：");
        printGrid(grid1);
        List<int[]> result1 = findLargestIsland(grid1);
        printCoordinates(result1);
        System.out.println();
        
        // 测试用例2：所有陆地相连
        char[][] grid2 = {
            {'1', '1', '1'},
            {'1', '1', '1'},
            {'1', '1', '1'}
        };
        
        System.out.println("=== 测试用例2 ===");
        System.out.println("网格：");
        printGrid(grid2);
        List<int[]> result2 = findLargestIsland(grid2);
        printCoordinates(result2);
        System.out.println();
        
        // 测试用例3：有多个岛屿，面积不同
        char[][] grid3 = {
            {'1', '0', '1', '1', '0'},
            {'1', '0', '1', '1', '0'},
            {'0', '0', '0', '0', '0'},
            {'1', '1', '0', '1', '1'},
            {'1', '1', '0', '1', '1'}
        };
        
        System.out.println("=== 测试用例3 ===");
        System.out.println("网格：");
        printGrid(grid3);
        List<int[]> result3 = findLargestIsland(grid3);
        printCoordinates(result3);
    }
    
    /**
     * 打印网格（辅助函数，用于测试）
     * @param grid 要打印的网格
     */
    private static void printGrid(char[][] grid) {
        for (char[] row : grid) {
            for (char cell : row) {
                System.out.print(cell + " ");
            }
            System.out.println();
        }
    }
}

/**
 * 算法复杂度分析：
 * 
 * 时间复杂度：O(m*n)，其中 m 是网格的行数，n 是网格的列数
 * - 每个单元格最多被访问一次
 * - 对于每个陆地单元格，我们进行常数时间的操作
 * 
 * 空间复杂度：O(m*n)，用于存储访问标记数组
 * - 最坏情况下（整个网格都是陆地），递归调用栈深度为 m*n
 * - 可以使用迭代BFS优化空间复杂度
 * 
 * 优化建议：
 * 1. 使用BFS（队列实现）可以避免递归栈溢出问题
 * 2. 可以使用并查集（Union-Find）来解决多轮查询问题
 * 3. 如果需要返回所有最大岛屿，可以维护一个列表存储所有最大岛屿
 */
