(function () {
  const state = {
    docs: [],
    category: 'all',
    type: 'all',
    query: ''
  };

  function getKnowledgeBase() {
    return window.knowledgeBase || (typeof knowledgeBase !== 'undefined' ? knowledgeBase : { categories: {} });
  }

  function getCategories() {
    const source = getKnowledgeBase();
    return source.categories || source || {};
  }

  function isDocumentNode(node) {
    return node && typeof node === 'object' && node.path && node.type;
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function fileNameFromPath(filePath) {
    const raw = String(filePath || '').split('/').pop() || 'Untitled';
    return raw.replace(/\.(md|pdf|docx?|txt)$/i, '');
  }

  function collectFromNode(node, category, trail) {
    const docs = [];
    if (!node || typeof node !== 'object') return docs;

    if (isDocumentNode(node)) {
      docs.push(normalizeDoc(node, category, trail));
      return docs;
    }

    if (Array.isArray(node.articles)) {
      node.articles.forEach((item) => docs.push(normalizeDoc(item, category, trail)));
    }

    const children = node.children || node;
    Object.entries(children).forEach(([name, child]) => {
      if (name === 'articles' || name === 'icon') return;
      docs.push(...collectFromNode(child, category, trail.concat(name)));
    });

    return docs;
  }

  function normalizeDoc(doc, category, trail) {
    const path = doc.path || '';
    const type = doc.type || 'document';
    const title = doc.title || fileNameFromPath(path);
    const tags = normalizeArray(doc.tags).filter(Boolean);
    return {
      title,
      description: doc.description || typeLabel(type) + ' document',
      readTime: Number(doc.readTime || 0),
      tags,
      path,
      type,
      category,
      trail: trail.filter(Boolean)
    };
  }

  function collectDocs() {
    return Object.entries(getCategories()).flatMap(([category, node]) => collectFromNode(node, category, []));
  }

  function typeLabel(type) {
    const map = {
      markdown: 'Markdown',
      pdf: 'PDF',
      word: 'Word',
      folder: 'Folder'
    };
    return map[type] || String(type || 'Document').toUpperCase();
  }

  function docHref(doc) {
    if (doc.type === 'markdown') {
      return 'viewer.html?file=' + encodeURIComponent(doc.path);
    }
    return encodeURI(doc.path);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function textIndex(doc) {
    return [
      doc.title,
      doc.description,
      doc.category,
      doc.trail.join(' '),
      doc.tags.join(' '),
      doc.path,
      doc.type
    ].join(' ').toLowerCase();
  }

  function summarizeStats(docs) {
    const categories = Object.keys(getCategories()).length;
    const tags = new Set();
    const types = {};
    let minutes = 0;
    docs.forEach((doc) => {
      normalizeArray(doc.tags).forEach((tag) => tags.add(tag));
      types[doc.type] = (types[doc.type] || 0) + 1;
      minutes += doc.readTime || 0;
    });
    return {
      docs: docs.length,
      categories,
      tags: tags.size,
      hours: Math.max(1, Math.round(minutes / 60)),
      types
    };
  }

  function categoryStats(docs) {
    const counts = {};
    docs.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function renderStats(docs) {
    const stats = summarizeStats(docs);
    setText('kbStatDocs', stats.docs);
    setText('kbStatCategories', stats.categories);
    setText('kbStatTags', stats.tags);
    setText('kbStatHours', stats.hours);

    const typeContainer = document.getElementById('kbTypeBreakdown');
    if (typeContainer) {
      typeContainer.innerHTML = Object.entries(stats.types)
        .sort((a, b) => b[1] - a[1])
        .map(([type, count]) => `<div class="kb-type-item"><span>${escapeHtml(typeLabel(type))}</span><strong>${count}</strong></div>`)
        .join('');
    }
  }

  function renderCategoryFilters(docs) {
    const container = document.getElementById('kbCategoryFilters');
    if (!container) return;
    const counts = categoryStats(docs);
    const rows = [
      `<button class="kb-filter is-active" data-category="all"><span>All documents</span><small>${docs.length}</small></button>`
    ];
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
      .forEach(([name, count]) => {
        rows.push(`<button class="kb-filter" data-category="${escapeHtml(name)}"><span>${escapeHtml(name)}</span><small>${count}</small></button>`);
      });
    container.innerHTML = rows.join('');
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      state.category = button.dataset.category || 'all';
      container.querySelectorAll('.kb-filter').forEach((item) => item.classList.toggle('is-active', item === button));
      applyFilters();
    });
  }

  function renderTypeFilters(docs) {
    const container = document.getElementById('kbTypeFilters');
    if (!container) return;
    const stats = summarizeStats(docs);
    const types = ['all'].concat(Object.keys(stats.types).sort());
    container.innerHTML = types.map((type) => {
      const label = type === 'all' ? 'All' : typeLabel(type);
      return `<button class="kb-chip${type === 'all' ? ' is-active' : ''}" data-type="${escapeHtml(type)}">${escapeHtml(label)}</button>`;
    }).join('');
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-type]');
      if (!button) return;
      state.type = button.dataset.type || 'all';
      container.querySelectorAll('.kb-chip').forEach((item) => item.classList.toggle('is-active', item === button));
      applyFilters();
    });
  }

  function docCard(doc) {
    const tags = normalizeArray(doc.tags).slice(0, 4).map((tag) => `<span class="kb-tag">${escapeHtml(tag)}</span>`).join('');
    const trail = [doc.category].concat(doc.trail).filter(Boolean).join(' / ');
    const badgeClass = 'kb-badge--' + String(doc.type || '').toLowerCase();
    const action = doc.type === 'markdown' ? 'Read' : 'Open';
    return `
      <article class="kb-doc-card">
        <div>
          <div class="kb-doc-card__meta">
            <span class="kb-badge ${badgeClass}">${escapeHtml(typeLabel(doc.type))}</span>
            <span class="kb-badge">${escapeHtml(trail || 'Uncategorized')}</span>
            ${doc.readTime ? `<span class="kb-badge">${doc.readTime} min</span>` : ''}
          </div>
          <h3>${escapeHtml(doc.title)}</h3>
          <p>${escapeHtml(doc.description)}</p>
          <div class="kb-doc-card__tags">${tags}</div>
        </div>
        <div class="kb-doc-card__action">
          <a class="kb-button" href="${docHref(doc)}">${action}</a>
        </div>
      </article>
    `;
  }

  function filteredDocs() {
    const query = state.query.trim().toLowerCase();
    return state.docs.filter((doc) => {
      const matchCategory = state.category === 'all' || doc.category === state.category;
      const matchType = state.type === 'all' || doc.type === state.type;
      const matchQuery = !query || textIndex(doc).includes(query);
      return matchCategory && matchType && matchQuery;
    });
  }

  function applyFilters() {
    const docs = filteredDocs();
    const list = document.getElementById('kbDocList');
    const empty = document.getElementById('kbEmpty');
    const count = document.getElementById('kbResultCount');
    if (count) count.textContent = `${docs.length} results`;
    if (list) list.innerHTML = docs.map(docCard).join('');
    if (empty) empty.hidden = docs.length !== 0;
    if (list) list.hidden = docs.length === 0;
  }

  function renderRecent(docs) {
    const container = document.getElementById('kbRecentDocs');
    if (!container) return;
    container.innerHTML = docs.slice(0, 7).map((doc) => `
      <li>
        <a href="${docHref(doc)}">
          <strong>${escapeHtml(doc.title)}</strong>
          <span>${escapeHtml(doc.category)} · ${escapeHtml(typeLabel(doc.type))}</span>
        </a>
      </li>
    `).join('');
  }

  function setupSearch() {
    const input = document.getElementById('kbSearchInput');
    if (!input) return;
    input.addEventListener('input', () => {
      state.query = input.value || '';
      applyFilters();
    });
  }

  function setupKnowledgeBase() {
    state.docs = collectDocs();
    renderStats(state.docs);
    renderCategoryFilters(state.docs);
    renderTypeFilters(state.docs);
    renderRecent(state.docs);
    setupSearch();
    applyFilters();
  }

  function setupHomeStats() {
    const docs = collectDocs();
    renderStats(docs);
    renderRecent(docs);
  }

  function setupArticles() {
    state.docs = collectDocs().filter((doc) => doc.type === 'markdown');
    if (!state.docs.length) state.docs = collectDocs();
    renderStats(state.docs);
    renderCategoryFilters(state.docs);
    renderTypeFilters(state.docs);
    setupSearch();
    applyFilters();
  }

  function setupViewer() {
    const params = new URLSearchParams(window.location.search);
    const file = params.get('file');
    const titleEl = document.getElementById('viewerTitle');
    const pathEl = document.getElementById('viewerPath');
    const status = document.getElementById('viewerStatus');
    const content = document.getElementById('viewerContent');

    if (!file) {
      showViewerError('No Markdown file was specified.');
      return;
    }

    const decodedPath = decodeURIComponent(file);
    document.title = fileNameFromPath(decodedPath) + ' - Kevin KB';
    if (titleEl) titleEl.textContent = fileNameFromPath(decodedPath);
    if (pathEl) pathEl.textContent = decodedPath;

    if (window.marked) {
      window.marked.setOptions({
        breaks: true,
        gfm: true
      });
    }

    fetch(decodedPath)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((markdown) => {
        if (status) status.hidden = true;
        if (!content) return;
        content.hidden = false;
        content.innerHTML = renderMarkdown(markdown);
        if (window.hljs) {
          content.querySelectorAll('pre code').forEach((block) => window.hljs.highlightElement(block));
        }
      })
      .catch((error) => {
        showViewerError('The article could not be loaded: ' + error.message);
      });
  }

  function renderMarkdown(markdown) {
    if (window.marked) return window.marked.parse(markdown);
    return `<pre><code>${escapeHtml(markdown)}</code></pre>`;
  }

  function showViewerError(message) {
    const status = document.getElementById('viewerStatus');
    const content = document.getElementById('viewerContent');
    if (content) content.hidden = true;
    if (status) {
      status.hidden = false;
      status.classList.add('kb-status--error');
      status.textContent = message;
    }
  }

  window.KBModern = {
    collectDocs,
    setupKnowledgeBase,
    setupHomeStats,
    setupArticles,
    setupViewer
  };
})();
