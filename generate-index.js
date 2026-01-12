const fs = require('fs');
const path = require('path');

/**
 * 知识库自动索引生成器
 * 自动扫描markdown文件并生成知识库数据结构
 */

// 配置项
const config = {
    // 扫描的目录
    scanDirs: [
        '博客文章',
        'article',
        'Concurrent',
        'Database',
        'Distrubute',
        'Reactive',
        'WebFlux',
        '人脉',
        '持续交卷',
        '函数式编程'
    ],

    // 忽略的文件和目录
    ignorePatterns: [
        'node_modules',
        '.git',
        '.github',
        'assets',
        'images',
        'static'
    ],

    // 文件类型映射
    fileTypes: {
        '.md': 'markdown',
        '.pdf': 'pdf',
        '.docx': 'word',
        '.doc': 'word'
    },

    // 目录图标映射
    categoryIcons: {
        '博客文章': '📝',
        'Java技术': '☕',
        '并发编程': '🔄',
        '数据库技术': '💾',
        '架构设计': '🏗️',
        '响应式编程': '⚡',
        '人工智能': '🤖',
        '大数据': '📊',
        '云计算': '☁️',
        'JDK新特性': '🆕',
        '分布式系统': '🌐',
        '微服务': '🔧',
        'DevOps': '🚀',
        '容器化': '🐳',
        '人脉': '🤝',
        '持续交卷': '📚',
        '函数式编程': 'λ',
        '算法': '🧮',
        '英语资讯': '🌍',
        '阅读笔记': '📖',
        '技术写作': '✍️',
        'AI原理': '🧠'
    }
};

/**
 * 检查是否应该忽略该路径
 */
function shouldIgnore(filePath) {
    return config.ignorePatterns.some(pattern => filePath.includes(pattern));
}

/**
 * 获取文件类型
 */
function getFileType(filePath) {
    const ext = path.extname(filePath);
    return config.fileTypes[ext] || 'unknown';
}

/**
 * 提取markdown文件的标题和描述
 */
function extractMarkdownInfo(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());

        // 提取标题（第一个#开头的行）
        const titleLine = lines.find(line => line.startsWith('# '));
        const title = titleLine ? titleLine.replace('# ', '').trim() : path.basename(filePath, '.md');

        // 提取描述（第一个非空段落）
        const description = lines.find(line => !line.startsWith('#') && line.trim().length > 10) || '';

        // 估算阅读时间（假设每分钟阅读200字）
        const wordCount = content.length / 2; // 中文字符数
        const readTime = Math.max(1, Math.round(wordCount / 200));

        // 提取标签（从内容中查找#标签）
        const tags = [];
        const tagRegex = /#([^\s#]+)/g;
        let match;
        while ((match = tagRegex.exec(content)) !== null) {
            tags.push(match[1]);
        }

        // 如果没有标签，根据文件名和路径生成默认标签
        if (tags.length === 0) {
            const dirName = path.dirname(filePath).split('/').pop();
            const fileName = path.basename(filePath, '.md');
            tags.push(dirName);

            // 根据文件名关键词添加标签
            if (fileName.includes('JDK') || fileName.includes('Java')) tags.push('Java');
            if (fileName.includes('并发') || fileName.includes('线程')) tags.push('并发');
            if (fileName.includes('数据库') || fileName.includes('MySQL')) tags.push('数据库');
            if (fileName.includes('分布式')) tags.push('分布式');
            if (fileName.includes('算法')) tags.push('算法');
            if (fileName.includes('AI') || fileName.includes('机器学习')) tags.push('AI');
        }

        return {
            title,
            description: description.substring(0, 150) + (description.length > 150 ? '...' : ''),
            readTime,
            tags: [...new Set(tags)] // 去重
        };
    } catch (error) {
        console.warn(`无法读取文件 ${filePath}:`, error.message);
        return {
            title: path.basename(filePath, path.extname(filePath)),
            description: '文件描述不可用',
            readTime: 5,
            tags: ['其他']
        };
    }
}

/**
 * 递归扫描目录
 */
function scanDirectory(dirPath, basePath = '') {
    const result = {};
    const fullDirPath = path.join(basePath, dirPath);

    if (!fs.existsSync(fullDirPath) || shouldIgnore(fullDirPath)) {
        return result;
    }

    try {
        const items = fs.readdirSync(fullDirPath);

        for (const item of items) {
            const itemPath = path.join(fullDirPath, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                // 递归扫描子目录
                const subResult = scanDirectory(item, fullDirPath);
                if (Object.keys(subResult).length > 0) {
                    result[item] = subResult;
                }
            } else if (stat.isFile()) {
                const fileType = getFileType(itemPath);
                if (fileType !== 'unknown') {
                    const fileName = path.basename(itemPath);
                    const relativePath = path.relative('.', itemPath).replace(/\\/g, '/');

                    if (fileType === 'markdown') {
                        const info = extractMarkdownInfo(itemPath);
                        result[fileName] = {
                            ...info,
                            path: relativePath,
                            type: fileType
                        };
                    } else {
                        // PDF或其他文件
                        result[fileName] = {
                            title: path.basename(fileName, path.extname(fileName)),
                            path: relativePath,
                            type: fileType,
                            description: `${fileType.toUpperCase()} 文档`,
                            readTime: 10,
                            tags: [fileType.toUpperCase()]
                        };
                    }
                }
            }
        }
    } catch (error) {
        console.warn(`扫描目录失败 ${fullDirPath}:`, error.message);
    }

    return result;
}

/**
 * 生成知识库数据结构
 */
function generateKnowledgeBase() {
    console.log('🔍 开始扫描知识库文件...');

    const knowledgeBase = {
        categories: {},
        lastUpdated: new Date().toISOString()
    };

    // 扫描配置的目录
    for (const dir of config.scanDirs) {
        console.log(`📁 扫描目录: ${dir}`);
        const categoryData = scanDirectory(dir);

        if (Object.keys(categoryData).length > 0) {
            const categoryName = getCategoryDisplayName(dir);
            knowledgeBase.categories[categoryName] = {
                icon: config.categoryIcons[categoryName] || '📄',
                children: categoryData
            };
        }
    }

    console.log('✅ 知识库索引生成完成');
    return knowledgeBase;
}

/**
 * 获取分类显示名称
 */
function getCategoryDisplayName(dirName) {
    const nameMap = {
        '博客文章': '博客文章',
        'article': 'Java技术',
        'Concurrent': '并发编程',
        'Database': '数据库技术',
        'Distrubute': '分布式系统',
        'Reactive': '响应式编程',
        'WebFlux': 'Spring WebFlux',
        '人脉': '人脉管理',
        '持续交卷': '持续学习',
        '函数式编程': '函数式编程'
    };

    return nameMap[dirName] || dirName;
}

/**
 * 生成JavaScript代码
 */
function generateJavaScript(knowledgeBase) {
    const jsContent = `// 知识库数据结构 - 自动生成于 ${knowledgeBase.lastUpdated}
// 使用 generate-index.js 生成，请勿手动修改

const knowledgeBase = ${JSON.stringify(knowledgeBase.categories, null, 4)};

// 初始化知识库
document.addEventListener('DOMContentLoaded', function() {
    initializeKnowledgeBase();
    setupEventListeners();
});
`;

    return jsContent;
}

/**
 * 生成HTML片段用于嵌入
 */
function generateHtmlSnippet(knowledgeBase) {
    const htmlContent = `<script>
// 知识库数据结构 - 自动生成于 ${knowledgeBase.lastUpdated}
const knowledgeBase = ${JSON.stringify(knowledgeBase.categories, null, 4)};
</script>`;

    return htmlContent;
}

/**
 * 主函数
 */
function main() {
    try {
        const knowledgeBase = generateKnowledgeBase();

        // 生成独立的JavaScript文件
        const jsContent = generateJavaScript(knowledgeBase);
        fs.writeFileSync('knowledge-base-data.js', jsContent, 'utf-8');
        console.log('📝 生成文件: knowledge-base-data.js');

        // 生成HTML片段
        const htmlSnippet = generateHtmlSnippet(knowledgeBase);
        fs.writeFileSync('knowledge-base-snippet.html', htmlSnippet, 'utf-8');
        console.log('📄 生成文件: knowledge-base-snippet.html');

        // 生成统计信息
        let totalFiles = 0;
        let totalCategories = Object.keys(knowledgeBase.categories).length;

        function countFiles(obj) {
            if (Array.isArray(obj)) {
                totalFiles += obj.length;
            } else if (typeof obj === 'object') {
                for (const key in obj) {
                    countFiles(obj[key]);
                }
            }
        }

        countFiles(knowledgeBase.categories);

        console.log('\\n📊 统计信息:');
        console.log(`   分类数量: ${totalCategories}`);
        console.log(`   文件总数: ${totalFiles}`);
        console.log(`   生成时间: ${knowledgeBase.lastUpdated}`);

    } catch (error) {
        console.error('❌ 生成失败:', error);
        process.exit(1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main();
}

module.exports = {
    generateKnowledgeBase,
    generateJavaScript,
    generateHtmlSnippet,
    config
};