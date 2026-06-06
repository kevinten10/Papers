const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const generator = require('../generate-index');

function makeTempWorkspace() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'papers-index-'));
}

test('discovers top-level content directories beyond the preferred defaults', () => {
    const rootDir = makeTempWorkspace();
    fs.mkdirSync(path.join(rootDir, 'Cache'), { recursive: true });
    fs.writeFileSync(path.join(rootDir, 'Cache', '缓存策略.md'), '# 缓存策略\n\n正文内容', 'utf8');
    fs.mkdirSync(path.join(rootDir, 'assets'), { recursive: true });
    fs.writeFileSync(path.join(rootDir, 'assets', 'ignored.md'), '# ignored', 'utf8');

    const dirs = generator.discoverScanDirs(rootDir);

    assert.deepEqual(dirs, ['Cache']);
});

test('extracts markdown metadata without CR characters or parent path leakage', () => {
    const rootDir = makeTempWorkspace();
    const articleDir = path.join(rootDir, '博客文章', 'BigData');
    fs.mkdirSync(articleDir, { recursive: true });
    const filePath = path.join(articleDir, 'Google.md');
    fs.writeFileSync(filePath, '# Google 三驾马车\r\n\r\n第一段描述内容用于摘要。\r\n', 'utf8');

    const info = generator.extractMarkdownInfo(filePath);

    assert.equal(info.title, 'Google 三驾马车');
    assert.equal(info.description, '第一段描述内容用于摘要。');
    assert.deepEqual(info.tags, ['BigData']);
});

test('counts only indexed document entries', () => {
    const categories = {
        技术: {
            children: {
                子目录: {
                    '文档.md': {
                        title: '文档',
                        path: '技术/文档.md',
                        type: 'markdown',
                        tags: ['技术']
                    }
                }
            }
        }
    };

    assert.equal(generator.countKnowledgeFiles(categories), 1);
});

test('generated browser data exposes categories and lastUpdated in one object', () => {
    const js = generator.generateJavaScript({
        categories: {
            技术: {
                icon: '📄',
                children: {}
            }
        },
        lastUpdated: '2026-01-01T00:00:00.000Z'
    });

    assert.match(js, /var knowledgeBase = /);
    assert.match(js, /"categories"/);
    assert.match(js, /"lastUpdated"/);
});
