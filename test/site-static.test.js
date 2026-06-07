const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');
const primaryDomain = 'https://paper.rxcloud.group';
const oldDomain = 'https://kevinten10.github.io/Papers';
const corePages = [
    'index.html',
    'navigation.html',
    'knowledge-base.html',
    'articles.html',
    'viewer.html'
];

function read(filePath) {
    return fs.readFileSync(path.join(rootDir, filePath), 'utf8');
}

test('core pages use the primary domain for SEO metadata', () => {
    for (const page of corePages) {
        const html = read(page);
        assert.doesNotMatch(html, new RegExp(oldDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
        assert.match(html, /<meta name="description" content="[^"]+"/);
        assert.match(html, new RegExp(`<link rel="canonical" href="${primaryDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    }
});

test('sitemap and robots point at the primary domain', () => {
    const sitemap = read('sitemap.xml');
    const robots = read('robots.txt');

    assert.match(sitemap, new RegExp(`<loc>${primaryDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?</loc>`));
    assert.doesNotMatch(sitemap, /kevinten10\.github\.io/);
    assert.match(robots, new RegExp(`Sitemap: ${primaryDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/sitemap.xml`));
});

test('interactive pages expose keyboard and accessibility hooks', () => {
    for (const page of corePages) {
        const html = read(page);
        assert.match(html, /class="kb-skip-link"/);
        assert.match(html, /id="main"/);
    }

    assert.match(read('knowledge-base.html'), /aria-label="Search documents"/);
    assert.match(read('articles.html'), /aria-label="Search Markdown articles"/);
});

test('home page exposes a working search entry point', () => {
    const html = read('index.html');

    assert.match(html, /<form class="kb-home-search"[^>]*action="knowledge-base\.html"[^>]*role="search"/);
    assert.match(html, /id="kbHomeSearchInput"[^>]*name="q"[^>]*type="search"/);
    assert.match(read('assets/js/kb-modern.js'), /function setupHomeSearch\(\)/);
});

test('core pages use the current shared asset version', () => {
    const expectedVersion = '3.4.0';

    for (const page of corePages) {
        const html = read(page);
        assert.match(html, new RegExp(`assets/css/kb-modern\\.css\\?v=${expectedVersion}`));
        assert.match(html, new RegExp(`assets/js/kb-modern\\.js\\?v=${expectedVersion}`));
    }
});
