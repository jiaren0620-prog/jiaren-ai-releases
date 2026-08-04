(() => {
  'use strict';

  const HTTPS_API = 'https://api.jiaren.xyz/v1';
  const API_STORAGE_KEY = 'jiaren-community-api';
  if (localStorage.getItem(API_STORAGE_KEY) !== HTTPS_API) {
    localStorage.removeItem(API_STORAGE_KEY);
  }
  const state = {
    open: false,
    section: 'media',
    type: '',
    category: '全部',
    query: '',
    cursor: null,
    loading: false,
    exhausted: false,
    works: [],
    codexKind: '',
    codexCursor: null,
    codexExhausted: false,
    codexLoading: false,
    codexRequestId: 0,
    codexPosts: [],
    session: readJson('jiaren-community-session'),
    activeWork: null,
    activeCodexPost: null,
    pendingShare: null,
    pendingRegistration: null,
    embedded: new URLSearchParams(location.search).get('embedded') === '1',
    demo: new URLSearchParams(location.search).get('demo') === '1',
    creatorTab: 'overview',
    creatorCommentScope: 'received',
    creatorData: { dashboard: null, works: [], received: [], mine: [] },
    apiBase: HTTPS_API,
  };
  let sessionRefreshPromise = null;

  const icons = {
    community: '<path d="M7 3.5a4 4 0 0 1 4 4c0 2.3-1.9 4.1-4.2 4.1A4.1 4.1 0 0 1 2.7 7.5 4 4 0 0 1 7 3.5Z"/><path d="M17 5.5a3 3 0 1 1-.2 6A3 3 0 0 1 17 5.5Z"/><path d="M3.3 20c.7-3.4 3-5.2 6.3-5.2s5.5 1.8 6.1 5.2"/><path d="M15 15c3.2-.5 5.3 1.1 6 4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    upload: '<path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="m21 15-5-5L5 20"/>',
    video: '<rect x="3" y="5" width="15" height="14" rx="2"/><path d="m18 10 4-2v8l-4-2"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
    message: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    code: '<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',
    external: '<path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    terminal: '<path d="m4 17 6-5-6-5M12 19h8"/>',
    share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="m16 6-4-4-4 4M12 2v13"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/>',
    reply: '<path d="m9 17-5-5 5-5"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  };

  const standaloneCommunity = document.body?.dataset.communityStandalone === 'true';
  const showcaseAsset = (name) => `${standaloneCommunity || location.pathname.includes('/community/') ? './showcase/' : './community/showcase/'}${name}`;
  const logoAsset = `${standaloneCommunity
    ? (location.pathname.includes('/community/') ? '../assets/jiaren-community-logo.png' : './community-logo.png')
    : './assets/jiaren-community-logo.png'}?v=20260730-jia2`;
  const showcaseWorks = [
    ['极夜香氛广告片', '@stella_adlab', '广告片', 'cover-01.png', 'avatar-01.png', 720, 930],
    ['霓虹街角剧情短片', '@lens_noir', '剧情短片', 'cover-02.png', 'avatar-02.png', 720, 810],
    ['蓝调舞台 MV 概念', '@muse_frame', 'MV', 'cover-03.png', 'avatar-03.png', 720, 1040],
    ['产品教程分镜拆解', '@cutflow', '教程', 'cover-04.png', 'avatar-04.png', 720, 760],
    ['雨夜短剧情绪版', '@scriptbox', '短剧', 'cover-05.png', 'avatar-05.png', 720, 980],
    ['开场标题组件包', '@motiondock', '视频组件', 'cover-06.png', 'avatar-06.png', 720, 840],
    ['智能汽车发布片', '@roadshow_ai', '广告片', 'cover-07.png', 'avatar-07.png', 720, 1080],
    ['料理教程快剪', '@taste_cut', '教程', 'cover-08.png', 'avatar-08.png', 720, 790],
    ['服装大片预告', '@whiteframe', '广告片', 'cover-09.png', 'avatar-01.png', 720, 940],
    ['海岸旅拍品牌片', '@longtake', '品牌故事', 'cover-10.png', 'avatar-02.png', 720, 870],
    ['科幻短片先导', '@future_gate', '剧情短片', 'cover-11.png', 'avatar-03.png', 720, 1010],
    ['美妆产品短片', '@softlight', '产品短片', 'cover-12.png', 'avatar-04.png', 720, 735],
    ['人物访谈纪录片', '@docu_room', '剧情短片', 'cover-13.png', 'avatar-05.png', 720, 910],
    ['运动品牌竖转横', '@motion_run', '广告片', 'cover-14.png', 'avatar-06.png', 720, 820],
    ['虚拟摄影棚测试', '@led_stage', '虚拟拍摄', 'cover-15.png', 'avatar-07.png', 720, 1060],
    ['品牌故事片片头', '@brandroom', '品牌故事', 'cover-16.png', 'avatar-08.png', 720, 880],
  ].map(([title, displayName, category, cover, avatar, width, height], index) => ({
    id: `showcase-${index + 1}`,
    showcase: true,
    type: 'image',
    title,
    coverUrl: showcaseAsset(cover),
    width,
    height,
    likeCount: 0,
    commentCount: 3 + (index % 9),
    description: `使用 JiarenAI 完成的${category}创作，保留了画布中的构图、模型与提示词信息。`,
    prompt: `主体与场景关系清晰，保持角色和产品细节一致，${category}视觉语言，电影级光影，构图完整。`,
    model: index % 3 === 0 ? 'Seedance 2.0' : index % 3 === 1 ? 'GPT Image 2' : 'Nano Banana 2',
    tags: [category],
    author: { displayName, avatarUrl: showcaseAsset(avatar) },
  }));

  const codexKindLabels = {
    skill: 'Skill 广场',
    workflow: '工作流',
    discussion: '开发讨论',
    tutorial: '教程',
    help: '求助',
  };
  const mediaCategories = [
    '广告片',
    '剧情短片',
    '教程',
    '短剧',
    '视频组件',
    'MV',
    '产品短片',
    '品牌故事',
    '虚拟拍摄',
    '口播混剪',
    '分镜预览',
    '特效包装',
  ];
  const showcaseCodexPosts = [
    { id: 'codex-demo-1', showcase: true, kind: 'skill', title: '角色一致性提示词工具', summary: '为多镜头角色生成统一的身份锚点与负面提示词。', skillName: 'character-continuity', repositoryUrl: 'https://github.com/example/character-continuity', installCommand: 'npx skills add https://github.com/example/character-continuity', version: '1.2.0', license: 'MIT', verificationStatus: 'verified', tags: ['视频', '角色一致性'], likeCount: 28, commentCount: 6, author: { displayName: '@frame-lab' } },
    { id: 'codex-demo-2', showcase: true, kind: 'workflow', title: '从剧本到分镜的 Skill 组合', summary: '拆解场景、角色、镜头和 Seedance 提示词的协作顺序。', verificationStatus: 'pending', tags: ['工作流', '分镜'], likeCount: 19, commentCount: 8, author: { displayName: '@story-pipeline' } },
    { id: 'codex-demo-3', showcase: true, kind: 'discussion', title: '怎样设计可复用的 SKILL.md？', summary: '讨论输入约束、失败回退和验证标准如何写得更清楚。', verificationStatus: 'not_required', tags: ['开发', '规范'], likeCount: 13, commentCount: 12, author: { displayName: '@toolsmith' } },
    { id: 'codex-demo-4', showcase: true, kind: 'tutorial', title: '用最小权限接入本地媒体工具', summary: '从安装、配置到结果校验的一套安全接入流程。', verificationStatus: 'not_required', tags: ['教程', '安全'], likeCount: 31, commentCount: 4, author: { displayName: '@local-first' } },
  ];

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }

  function compactCount(value) {
    const count = Math.max(0, Number(value) || 0);
    if (count >= 10000) return `${(count / 10000).toFixed(count >= 100000 ? 0 : 1).replace(/\.0$/, '')}万`;
    if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1).replace(/\.0$/, '')}千`;
    return String(count);
  }

  function currentUser() {
    return state.session?.user || {
      id: 'local-creator',
      displayName: 'JiarenAI 创作者',
      avatarUrl: showcaseAsset('avatar-01.png'),
      bio: '用画布记录创意与生成过程。',
    };
  }

  function icon(name, label = '') {
    return `<span class="jc-icon"${label ? ` aria-label="${label}"` : ' aria-hidden="true"'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.community}</svg></span>`;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function JiarenFormatBytes(value) {
    const bytes = Number(value) || 0;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
    return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
  }

  function button(text, options = {}) {
    const node = element('button', 'jc-button');
    node.type = 'button';
    if (options.variant) node.dataset.variant = options.variant;
    if (options.iconOnly) node.dataset.iconOnly = 'true';
    if (options.icon) node.insertAdjacentHTML('beforeend', icon(options.icon));
    if (text) node.append(element('span', 'jc-button-label', text));
    if (options.label) node.setAttribute('aria-label', options.label);
    if (options.onClick) node.addEventListener('click', options.onClick);
    return node;
  }

  async function request(path, options = {}) {
    const authRequest = options.auth !== false;
    const method = options.method || 'GET';
    const tryBases = [HTTPS_API];
    const timeoutMs = Number(options.timeoutMs) || (state.embedded ? 4500 : 8000);
    let lastError;
    for (const base of tryBases) {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
      try {
        const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}) };
        if (authRequest && state.session?.accessToken) headers.Authorization = `Bearer ${state.session.accessToken}`;
        const response = await fetch(`${base}${path}`, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        });
        const payload = response.status === 204 ? null : await response.json().catch(() => null);
        if (response.status === 401 && authRequest && !options.sessionRetried && state.session?.refreshToken) {
          const refreshed = await refreshSession();
          if (refreshed) return request(path, { ...options, sessionRetried: true });
        }
        if (!response.ok) {
          const error = new Error(payload?.error?.message || `请求失败 (${response.status})`);
          error.code = payload?.error?.code;
          error.status = response.status;
          throw error;
        }
        state.apiBase = base;
        localStorage.setItem(API_STORAGE_KEY, base);
        return payload;
      } catch (error) {
        lastError = error?.name === 'AbortError' ? new Error('社区服务响应超时，已切换到本地内容') : error;
        if (error.status) break;
      } finally {
        window.clearTimeout(timeout);
      }
    }
    throw lastError || new Error('社区服务暂不可用');
  }

  async function refreshSession() {
    if (!state.session?.refreshToken) return false;
    if (sessionRefreshPromise) return sessionRefreshPromise;
    const refreshToken = state.session.refreshToken;
    const user = state.session.user;
    sessionRefreshPromise = (async () => {
      try {
        const response = await fetch(`${HTTPS_API}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok || !payload?.session?.accessToken) return false;
        state.session = { ...payload.session, user };
        localStorage.setItem('jiaren-community-session', JSON.stringify(state.session));
        return true;
      } catch {
        return false;
      } finally {
        sessionRefreshPromise = null;
      }
    })();
    return sessionRefreshPromise;
  }

  function toast(message) {
    const node = document.querySelector('.jc-toast');
    node.textContent = message;
    node.dataset.open = 'true';
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { node.dataset.open = 'false'; }, 2600);
  }

  function buildShell() {
    if (document.querySelector('.jc-shell')) return;
    const shell = element('section', 'jc-shell');
    shell.setAttribute('aria-label', 'Jiaren AI 创作者社区');
    shell.dataset.open = 'false';
    shell.dataset.section = 'media';
    shell.dataset.embedded = String(state.embedded);
    shell.innerHTML = `
      <header class="jc-header">
        <div class="jc-brand"><span class="jc-brand-mark"><img src="${logoAsset}" alt="" aria-hidden="true"></span><span class="jc-brand-copy"><strong class="jc-brand-title">Jiaren AI</strong></span></div>
        <nav class="jc-global-nav" aria-label="创作社区导航"><button type="button" data-community-nav="canvas">画布</button><button type="button" data-community-nav="discover">发现</button><button type="button" data-community-nav="image">图片</button><button type="button" data-community-nav="video">视频</button><button type="button" data-community-nav="short">短片</button><button type="button" data-community-nav="assets">版权素材</button><button type="button" data-community-nav="audio">配音</button><button type="button" data-community-nav="codex">Codex</button><button type="button" data-community-nav="community" aria-current="page">社区</button></nav>
        <div class="jc-header-actions"></div>
      </header>
      <div class="jc-filter-bar">
        <div class="jc-tabs" role="tablist"></div>
        <span class="jc-feed-status">正在连接社区...</span>
        <label class="jc-search">${icon('search')}<input type="search" aria-label="搜索作品、作者或提示词" placeholder="搜索作品名称" /></label>
      </div>
      <main class="jc-main">
        <div class="jc-content">
          <div class="jc-masonry" aria-live="polite"></div>
          <div class="jc-empty" hidden></div>
          <div class="jc-sentinel" aria-hidden="true"></div>
        </div>
      </main>
      <button class="jc-upload-fab" type="button" aria-label="上传作品">${icon('upload')}<span>上传作品</span></button>`;
    document.body.append(shell);

    const scrim = element('div', 'jc-scrim');
    scrim.dataset.open = 'false';
    document.body.append(scrim);
    document.body.append(buildDetail());
    document.body.append(buildAuth());
    document.body.append(buildProfile());
    document.body.append(buildCreatorCenter());
    document.body.append(buildShare());
    document.body.append(buildCodexDetail());
    document.body.append(buildCodexComposer());
    document.body.append(element('div', 'jc-toast'));

    renderFilterTabs();
    shell.querySelector('.jc-search input').addEventListener('input', debounce((event) => {
      state.query = event.target.value.trim().toLowerCase();
      if (state.section === 'codex' && !state.demo) {
        state.codexRequestId += 1;
        state.codexLoading = false;
        state.codexCursor = null;
        state.codexExhausted = false;
        state.codexPosts = [];
        renderFeed();
        loadCodexFeed();
        return;
      }
      renderFeed();
    }, 160));
    shell.querySelectorAll('[data-community-nav]').forEach((item) => item.addEventListener('click', () => {
      const target = item.dataset.communityNav;
      if (target === 'canvas') close();
      else if (target === 'codex') setSection('codex');
      else if (target === 'discover' || target === 'community') { setSection('media', false); setType(''); }
      else if (target === 'image' || target === 'video') { setSection('media', false); setType(target); }
      else toast('该频道将在后续版本接入');
    }));
    shell.querySelector('.jc-upload-fab').addEventListener('click', () => {
      if (state.section === 'codex') openCodexComposer();
      else openUploadPicker();
    });
    scrim.addEventListener('click', closeDialogs);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') state.activeWork || isDialogOpen() ? closeDialogs() : close();
    });
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && state.open) loadFeed();
    }, { root: shell.querySelector('.jc-main'), rootMargin: '800px' });
    observer.observe(shell.querySelector('.jc-sentinel'));
    renderHeader();
  }

  function buildDetail() {
    const node = element('article', 'jc-dialog jc-detail');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-detail-media"></div><section class="jc-detail-panel"><div class="jc-detail-head"><div class="jc-author"></div></div><div class="jc-detail-scroll"></div><div class="jc-detail-actions"></div></section>`;
    node.querySelector('.jc-detail-head').append(button('', { icon: 'close', iconOnly: true, label: '关闭详情', onClick: closeDialogs }));
    return node;
  }

  function buildAuth() {
    const node = element('section', 'jc-dialog jc-auth');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-dialog-header"><h2 class="jc-dialog-title">社区账号</h2></div><div class="jc-auth-body"><div class="jc-auth-tabs" role="tablist"><button type="button" class="jc-auth-tab" data-mode="login" aria-selected="true">登录</button><button type="button" class="jc-auth-tab" data-mode="register" aria-selected="false">注册</button><button type="button" class="jc-auth-tab" data-mode="verify" aria-selected="false">验证邮箱</button><button type="button" class="jc-auth-tab" data-mode="reset" aria-selected="false">找回密码</button></div><form class="jc-form"></form></div>`;
    node.querySelector('.jc-dialog-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭', onClick: closeDialogs }));
    node.querySelectorAll('.jc-auth-tab').forEach((tab) => tab.addEventListener('click', () => renderAuthForm(tab.dataset.mode)));
    return node;
  }

  function buildShare() {
    const node = element('section', 'jc-dialog jc-share');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-dialog-header"><h2 class="jc-dialog-title">分享到社区</h2></div><div class="jc-share-body"></div>`;
    node.querySelector('.jc-dialog-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭', onClick: closeDialogs }));
    return node;
  }

  function buildProfile() {
    const node = element('section', 'jc-dialog jc-profile');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-dialog-header"><div><h2 class="jc-dialog-title">个人资料</h2><p class="jc-dialog-description">头像与昵称会显示在你发布的作品上</p></div></div><div class="jc-profile-body"></div>`;
    node.querySelector('.jc-dialog-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭', onClick: closeDialogs }));
    return node;
  }

  function buildCreatorCenter() {
    const node = element('section', 'jc-dialog jc-creator-center');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<aside class="jc-creator-nav"></aside><section class="jc-creator-main"><header class="jc-creator-header"><div><h2>创作者中心</h2><p>作品、评论与数据统一管理</p></div></header><div class="jc-creator-body"></div></section>`;
    node.querySelector('.jc-creator-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭创作者中心', onClick: closeDialogs }));
    return node;
  }

  function buildCodexDetail() {
    const node = element('article', 'jc-dialog jc-codex-detail');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-dialog-header"><div><h2 class="jc-dialog-title">Codex</h2><p class="jc-dialog-description">Skill 与工作流详情</p></div></div><div class="jc-codex-detail-body"></div>`;
    node.querySelector('.jc-dialog-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭', onClick: closeDialogs }));
    return node;
  }

  function buildCodexComposer() {
    const node = element('section', 'jc-dialog jc-codex-composer');
    node.dataset.open = 'false';
    node.setAttribute('role', 'dialog');
    node.setAttribute('aria-modal', 'true');
    node.innerHTML = `<div class="jc-dialog-header"><div><h2 class="jc-dialog-title">发布到 Codex</h2><p class="jc-dialog-description">分享 Skill、工作流和开发经验</p></div></div><div class="jc-codex-composer-body"></div>`;
    node.querySelector('.jc-dialog-header').append(button('', { icon: 'close', iconOnly: true, label: '关闭', onClick: closeDialogs }));
    return node;
  }

  function renderHeader() {
    const actions = document.querySelector('.jc-header-actions');
    if (!actions) return;
    actions.replaceChildren();
    if (state.session?.user) {
      const profile = button('会员中心', { icon: 'user', onClick: () => openCreatorCenter() });
      profile.classList.add('jc-profile-trigger');
      if (state.session.user.avatarUrl) {
        const avatar = document.createElement('img');
        avatar.className = 'jc-profile-trigger-avatar';
        avatar.src = state.session.user.avatarUrl;
        avatar.alt = '';
        profile.querySelector('.jc-icon')?.replaceWith(avatar);
      }
      actions.append(profile);
      if (!state.embedded) actions.append(button('', { icon: 'close', iconOnly: true, label: '关闭社区', onClick: close }));
    } else {
      actions.append(button('登录 / 注册', { icon: 'user', variant: 'primary', onClick: () => openAuth('login') }));
      if (!state.embedded) actions.append(button('', { icon: 'close', iconOnly: true, label: '关闭社区', onClick: close }));
    }
  }

  function setSection(section, load = true) {
    state.section = section === 'codex' ? 'codex' : 'media';
    state.query = '';
    const shell = document.querySelector('.jc-shell');
    if (shell) shell.dataset.section = state.section;
    const search = document.querySelector('.jc-search input');
    if (search) {
      search.value = '';
      search.placeholder = state.section === 'codex' ? '搜索 Skill、仓库或讨论' : '搜索作品名称';
    }
    document.querySelectorAll('[data-community-nav]').forEach((item) => {
      const active = state.section === 'codex' ? item.dataset.communityNav === 'codex' : item.dataset.communityNav === 'community';
      if (active) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    const upload = document.querySelector('.jc-upload-fab span');
    if (upload) upload.textContent = state.section === 'codex' ? '发布内容' : '上传作品';
    if (state.section === 'codex') {
      state.codexRequestId += 1;
      state.codexLoading = false;
      state.codexKind = '';
      state.codexCursor = null;
      state.codexExhausted = false;
      state.codexPosts = [];
    }
    renderFilterTabs();
    renderFeed();
    if (load) loadFeed();
  }

  function renderFilterTabs() {
    const tabs = document.querySelector('.jc-tabs');
    if (!tabs) return;
    const values = state.section === 'codex'
      ? [['', '全部'], ['skill', 'Skill 广场'], ['workflow', '工作流'], ['discussion', '开发讨论'], ['tutorial', '教程'], ['help', '求助']]
      : ['全部', ...mediaCategories].map((value) => [value, value]);
    tabs.replaceChildren();
    values.forEach(([value, label]) => {
      const tab = element('button', 'jc-tab', label);
      tab.type = 'button';
      tab.dataset.category = value;
      const selected = state.section === 'codex' ? state.codexKind === value : state.category === value;
      tab.setAttribute('aria-selected', String(selected));
      tab.addEventListener('click', () => setCategory(value));
      tabs.append(tab);
    });
  }

  function setType(type) {
    state.section = 'media';
    state.type = type;
    state.category = '全部';
    state.cursor = null;
    state.exhausted = false;
    state.works = [];
    document.querySelectorAll('[data-community-nav]').forEach((item) => {
      const target = type || 'community';
      if (item.dataset.communityNav === target) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    renderFilterTabs();
    renderFeed();
    loadFeed();
  }

  function setCategory(category) {
    if (state.section === 'codex') {
      state.codexRequestId += 1;
      state.codexLoading = false;
      state.codexKind = category || '';
      state.codexCursor = null;
      state.codexExhausted = false;
      state.codexPosts = [];
      renderFilterTabs();
      renderFeed();
      loadFeed();
      return;
    }
    state.category = category || '全部';
    renderFilterTabs();
    renderFeed();
  }

  async function loadFeed() {
    if (state.section === 'codex') return loadCodexFeed();
    if (state.loading || state.exhausted) return;
    state.loading = true;
    updateStatus('加载作品中...');
    try {
      const params = new URLSearchParams({ limit: '30' });
      if (state.type) params.set('type', state.type);
      if (state.cursor) params.set('cursor', state.cursor);
      const result = await request(`/works?${params}`, { auth: false });
      const known = new Set(state.works.map((work) => work.id));
      state.works.push(...result.items.filter((work) => !known.has(work.id)));
      state.cursor = result.nextCursor;
      state.exhausted = !result.nextCursor;
      renderFeed();
      updateStatus(state.works.length ? `${state.works.length} 个作品` : state.demo ? '演示模式 · 精选示例' : '社区已连接 · 等待第一份作品');
    } catch (error) {
      updateStatus(state.demo ? 'JiarenAI 精选 · 本地浏览' : '社区服务暂时不可用 · 已显示本地作品');
      renderFeed();
    } finally {
      state.loading = false;
    }
  }

  async function loadCodexFeed() {
    if (state.codexLoading || state.codexExhausted) return;
    const requestId = state.codexRequestId;
    state.codexLoading = true;
    updateStatus('加载 Codex 内容中...');
    try {
      const params = new URLSearchParams({ limit: '30' });
      if (state.codexKind) params.set('kind', state.codexKind);
      if (state.query) params.set('query', state.query);
      if (state.codexCursor) params.set('cursor', state.codexCursor);
      const result = await request(`/codex/posts?${params}`, { auth: false });
      if (requestId !== state.codexRequestId) return;
      const known = new Set(state.codexPosts.map((post) => post.id));
      state.codexPosts.push(...result.items.filter((post) => !known.has(post.id)));
      state.codexCursor = result.nextCursor;
      state.codexExhausted = !result.nextCursor;
      renderFeed();
      updateStatus(state.codexPosts.length ? `${state.codexPosts.length} 条 Codex 内容` : state.demo ? '演示模式 · Codex 示例' : 'Codex 板块已连接');
    } catch (error) {
      if (requestId !== state.codexRequestId) return;
      updateStatus('Codex 服务暂时不可用');
      renderEmpty('暂时无法加载 Codex', '请稍后重试，媒体社区不受影响。', 'refresh');
    } finally {
      if (requestId === state.codexRequestId) state.codexLoading = false;
    }
  }

  function updateStatus(text) {
    const node = document.querySelector('.jc-feed-status');
    if (node) node.textContent = text;
  }

  function renderEmpty(title, description, iconName = 'image', action) {
    const node = document.querySelector('.jc-empty');
    const masonry = document.querySelector('.jc-masonry');
    if (!node || !masonry) return;
    masonry.hidden = true;
    node.hidden = false;
    node.replaceChildren();
    const visual = element('div', 'jc-empty-visual');
    visual.innerHTML = icon(iconName);
    node.append(visual, element('h2', '', title), element('p', '', description));
    if (action) node.append(button(action.label, { icon: action.icon, variant: 'primary', onClick: action.onClick }));
  }

  function renderFeed() {
    if (state.section === 'codex') return renderCodexFeed();
    const masonry = document.querySelector('.jc-masonry');
    const empty = document.querySelector('.jc-empty');
    if (!masonry || !empty) return;
    const fallbackWorks = state.type === 'video'
      ? showcaseWorks.slice(0, 8).map((work, index) => ({ ...work, id: `showcase-video-${index + 1}`, type: 'video', videoPreview: true, title: work.title.replace(/片|概念|拆解|预览/g, '视频') }))
      : showcaseWorks;
    const sourceWorks = [...state.works, ...(state.demo ? fallbackWorks : [])]
      .filter((work, index, items) => items.findIndex((candidate) => candidate.id === work.id) === index);
    const filtered = sourceWorks.filter((work) => {
      const content = [work.title, work.description, work.prompt, work.author?.displayName, ...(work.tags || [])].filter(Boolean).join(' ').toLowerCase();
      const matchesQuery = !state.query || content.includes(state.query);
      const matchesCategory = state.category === '全部' || (work.tags || []).includes(state.category);
      return matchesQuery && matchesCategory;
    });
    masonry.replaceChildren();
    if (!filtered.length) {
      const filteredEmpty = state.query || state.category !== '全部';
      renderEmpty(
        filteredEmpty ? '没有找到相关作品' : '还没有作品',
        filteredEmpty ? '换一个关键词或分类试试。' : '发布第一件作品，开始建立你的创作主页。',
        filteredEmpty ? 'search' : 'image',
        filteredEmpty ? null : state.session
          ? { label: '去画布分享作品', icon: 'upload', onClick: close }
          : { label: '登录后开始分享', icon: 'user', onClick: () => openAuth('login') },
      );
      return;
    }
    masonry.classList.toggle('is-showcase', state.demo);
    masonry.classList.remove('jc-codex-grid');
    masonry.hidden = false;
    empty.hidden = true;
    filtered.forEach((work) => masonry.append(renderCard(work)));
  }

  function renderCodexFeed() {
    const container = document.querySelector('.jc-masonry');
    const empty = document.querySelector('.jc-empty');
    if (!container || !empty) return;
    const source = state.codexPosts.length ? state.codexPosts : state.demo ? showcaseCodexPosts : [];
    const filtered = source.filter((post) => {
      const content = [post.title, post.summary, post.skillName, post.repositoryUrl, post.author?.displayName, ...(post.tags || [])]
        .filter(Boolean).join(' ').toLowerCase();
      const matchesQuery = !state.query || content.includes(state.query);
      const matchesKind = !state.codexKind || post.kind === state.codexKind;
      return matchesQuery && matchesKind;
    });
    container.replaceChildren();
    container.classList.add('jc-codex-grid');
    container.classList.toggle('is-showcase', source === showcaseCodexPosts);
    if (!filtered.length) {
      const filteredEmpty = state.query || state.codexKind;
      renderEmpty(
        filteredEmpty ? '没有找到相关内容' : 'Codex 创作从一次分享开始',
        filteredEmpty ? '换一个关键词或分类试试。' : '分享经过验证的 Skill、工作流、教程和开发经验。',
        filteredEmpty ? 'search' : 'code',
        filteredEmpty ? null : state.session
          ? { label: '发布 Codex 内容', icon: 'plus', onClick: openCodexComposer }
          : { label: '登录后发布', icon: 'user', onClick: () => openAuth('login') },
      );
      return;
    }
    container.hidden = false;
    empty.hidden = true;
    filtered.forEach((post) => container.append(renderCodexCard(post)));
  }

  function renderCodexCard(post) {
    const card = element('article', 'jc-codex-card');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `查看 Codex 内容：${post.title}`);
    const head = element('div', 'jc-codex-card-head');
    const kind = element('span', 'jc-codex-kind');
    kind.innerHTML = `${icon(post.kind === 'skill' ? 'code' : 'terminal')}<span>${codexKindLabels[post.kind] || 'Codex'}</span>`;
    head.append(kind);
    if (post.verificationStatus === 'verified') {
      const verified = element('span', 'jc-codex-verified');
      verified.innerHTML = `${icon('shield')}<span>已验证</span>`;
      head.append(verified);
    } else if (['skill', 'workflow'].includes(post.kind)) {
      head.append(element('span', 'jc-codex-pending', '待验证'));
    }
    card.append(head, element('h3', 'jc-codex-card-title', post.title));
    if (post.summary) card.append(element('p', 'jc-codex-card-summary', post.summary));
    if (post.skillName || post.version || post.license) {
      const facts = element('div', 'jc-codex-facts');
      if (post.skillName) facts.append(element('code', '', post.skillName));
      if (post.version) facts.append(element('span', '', `v${post.version}`));
      if (post.license) facts.append(element('span', '', post.license));
      card.append(facts);
    }
    if (post.tags?.length) {
      const tags = element('div', 'jc-codex-card-tags');
      post.tags.slice(0, 4).forEach((tag) => tags.append(element('span', '', tag)));
      card.append(tags);
    }
    const footer = element('div', 'jc-codex-card-footer');
    footer.append(renderAuthor(post.author));
    const stats = element('span', 'jc-codex-card-stats');
    stats.innerHTML = `${icon('heart')}<span>${post.likeCount || 0}</span>${icon('message')}<span>${post.commentCount || 0}</span>`;
    footer.append(stats);
    card.append(footer);
    const openPost = () => openCodexDetail(post.showcase ? post : post.id);
    card.addEventListener('click', openPost);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPost(); }
    });
    return card;
  }

  function renderCard(work) {
    const card = element('article', 'jc-card');
    if (work.showcase) card.classList.add('is-showcase');
    card.tabIndex = 0;
    card.setAttribute('aria-label', `查看作品：${work.title}`);
    const media = element('div', 'jc-card-media');
    const asset = document.createElement(work.type === 'video' && !work.videoPreview ? 'video' : 'img');
    asset.src = work.coverUrl;
    asset.loading = 'lazy';
    if (asset.tagName === 'IMG') asset.alt = work.title;
    else { asset.muted = true; asset.preload = 'metadata'; asset.setAttribute('aria-label', work.title); }
    if (work.width && work.height) media.style.aspectRatio = `${work.width}/${work.height}`;
    media.append(asset);
    const badge = element('span', 'jc-card-type');
    badge.innerHTML = `${icon(work.type)}<span>${work.type === 'video' ? '视频' : '图片'}</span>`;
    media.append(badge);
    const body = element('div', 'jc-card-body');
    body.append(element('h3', 'jc-card-title', work.title));
    if (work.description) body.append(element('p', 'jc-card-description', work.description));
    const meta = element('div', 'jc-card-meta');
    meta.append(renderAuthor(work.author));
    const count = element('span', 'jc-count');
    count.innerHTML = `${icon('heart')}<span>${compactCount(work.likeCount)}</span>`;
    meta.append(count);
    body.append(meta);
    card.append(media, body);
    const openWork = () => openDetail(work);
    card.addEventListener('click', openWork);
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openWork(); } });
    return card;
  }

  function renderAuthor(author) {
    const node = element('span', 'jc-author');
    const avatar = element('span', 'jc-avatar');
    if (author?.avatarUrl) { const image = document.createElement('img'); image.src = author.avatarUrl; image.alt = ''; avatar.append(image); }
    else avatar.textContent = (author?.displayName || '创').slice(0, 1);
    node.append(avatar, element('span', 'jc-author-name', author?.displayName || '社区创作者'));
    return node;
  }

  async function openDetail(value) {
    try {
      let result;
      if (typeof value === 'object') {
        const work = value;
        if (work.showcase) result = { work, canvasPackage: { type: work.type, url: work.assets?.[0]?.url || work.coverUrl, prompt: work.prompt, model: work.model } };
        else {
          try { result = await request(`/works/${work.id}`, { auth: false }); }
          catch { result = { work, canvasPackage: { type: work.type, url: work.assets?.[0]?.url || work.coverUrl, prompt: work.prompt, model: work.model } }; }
        }
      } else result = await request(`/works/${value}`, { auth: false });
      state.activeWork = result;
      const dialog = document.querySelector('.jc-detail');
      const work = result.work;
      const media = dialog.querySelector('.jc-detail-media');
      media.replaceChildren();
      const assetUrl = work.assets?.[0]?.url || work.coverUrl;
      const asset = document.createElement(work.type === 'video' ? 'video' : 'img');
      if (work.type === 'video') {
        asset.controls = true;
        asset.preload = 'metadata';
        if (work.videoPreview) asset.poster = assetUrl;
        else asset.src = assetUrl;
      } else {
        asset.src = assetUrl;
        asset.alt = work.title;
      }
      media.append(asset);
      const authorSlot = dialog.querySelector('.jc-detail-head .jc-author');
      authorSlot.replaceWith(renderAuthor(work.author));
      dialog.querySelector('.jc-detail-follow')?.remove();
      if (work.author?.id && work.author.id !== currentUser().id) {
        const follow = button(work.author.following ? '已关注' : '关注', { variant: 'primary', onClick: async (event) => {
          if (!state.session) return openAuth('login');
          if (work.showcase) return toast('演示内容不支持关注');
          event.currentTarget.disabled = true;
          try {
            const result = await request(`/users/${work.author.id}/follow`, { method: 'POST' });
            event.currentTarget.textContent = result.following ? '已关注' : '关注';
          } catch (error) { handleAuthError(error); }
          finally { event.currentTarget.disabled = false; }
        } });
        follow.classList.add('jc-detail-follow');
        dialog.querySelector('.jc-detail-head .jc-button[data-icon-only="true"]')?.before(follow);
      }
      const scroll = dialog.querySelector('.jc-detail-scroll');
      scroll.replaceChildren(element('h2', '', work.title));
      if (work.description) scroll.append(element('p', 'jc-detail-description', work.description));
      const facts = element('dl', 'jc-work-facts');
      [
        ['模型', work.model],
        ['尺寸', work.width && work.height ? `${work.width} × ${work.height}` : ''],
        ['类型', work.type === 'video' ? '视频' : '图片'],
        ['来源', work.sourceMetadata?.nodeType ? 'JiarenAI 画布发布' : '创作者社区'],
      ].forEach(([label, content]) => {
        if (!content) return;
        const item = element('div', '');
        item.append(element('dt', '', label), element('dd', '', String(content)));
        facts.append(item);
      });
      if (facts.childElementCount) scroll.append(facts);
      if (work.prompt) scroll.append(renderPrompt('提示词', work.prompt));
      if (work.negativePrompt) scroll.append(renderPrompt('负面提示词', work.negativePrompt));
      if (work.tags?.length) {
        const tags = element('div', 'jc-tags');
        work.tags.forEach((tag) => tags.append(element('span', 'jc-tag', `# ${tag}`)));
        scroll.append(tags);
      }
      scroll.append(renderWorkComments(work));
      const actions = dialog.querySelector('.jc-detail-actions');
      actions.replaceChildren(
        button(String(work.likeCount || 0), { icon: 'heart', onClick: () => toggleWork('like') }),
        button('收藏', { icon: 'bookmark', onClick: () => toggleWork('bookmark') }),
        button('分享', { icon: 'share', onClick: async () => {
          await navigator.clipboard?.writeText(`${work.title}\n${work.prompt || ''}`);
          toast('作品信息已复制');
        } }),
        button('添加到画布', { icon: 'plus', variant: 'primary', onClick: addToCanvas }),
      );
      showDialog(dialog);
    } catch (error) { toast(error.message); }
  }

  function renderWorkComments(work) {
    const section = element('section', 'jc-work-comments');
    const title = element('h3', '', `评论 ${Number(work.commentCount) || 0}`);
    const list = element('div', 'jc-work-comment-list');
    list.append(element('p', 'jc-comment-status', '正在加载评论…'));
    section.append(title, list);
    const form = element('form', 'jc-work-comment-form');
    const input = element('textarea', 'jc-textarea');
    input.name = 'content';
    input.required = true;
    input.maxLength = 1200;
    input.placeholder = state.session ? '写下你的评论' : '登录后发表评论';
    input.disabled = !state.session;
    const submit = state.session
      ? button('发送', { icon: 'send', variant: 'primary' })
      : button('登录', { icon: 'user', onClick: () => openAuth('login') });
    if (state.session) submit.type = 'submit';
    form.append(input, submit);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = input.value.trim();
      if (!content) return;
      if (work.showcase) return toast('演示内容不支持评论');
      submit.disabled = true;
      try {
        await request(`/works/${work.id}/comments`, { method: 'POST', body: { content } });
        input.value = '';
        await loadWorkComments(work, section);
        toast('评论已发布');
      } catch (error) { handleAuthError(error); }
      finally { submit.disabled = false; }
    });
    section.append(form);
    loadWorkComments(work, section);
    return section;
  }

  async function loadWorkComments(work, section) {
    const title = section.querySelector('h3');
    const list = section.querySelector('.jc-work-comment-list');
    try {
      const items = work.showcase ? [
        { id: `${work.id}-sample-1`, author_name: '光影实验室', content: '构图和光线关系很完整，参考信息也很清楚。' },
        { id: `${work.id}-sample-2`, author_name: '画布创作者', content: '提示词可以直接加入画布继续迭代。' },
      ] : (await request(`/works/${work.id}/comments`, { auth: false })).items;
      title.textContent = `评论 ${items.length}`;
      list.replaceChildren();
      if (!items.length) {
        list.append(element('p', 'jc-comment-status', '还没有评论，来发表第一条评论。'));
        return;
      }
      const byParent = new Map();
      items.forEach((comment) => {
        const key = comment.parent_id || '';
        if (!byParent.has(key)) byParent.set(key, []);
        byParent.get(key).push(comment);
      });
      const appendBranch = (comment, depth = 0) => {
        list.append(renderWorkCommentRow(work, comment, section, depth));
        (byParent.get(comment.id) || []).forEach((reply) => appendBranch(reply, Math.min(depth + 1, 2)));
      };
      (byParent.get('') || []).forEach((comment) => appendBranch(comment));
      items.filter((comment) => comment.parent_id && !items.some((entry) => entry.id === comment.parent_id))
        .forEach((comment) => appendBranch(comment, 1));
    } catch (error) {
      list.replaceChildren(element('p', 'jc-comment-status', '评论加载失败，请稍后重试。'));
    }
  }

  function renderWorkCommentRow(work, comment, section, depth) {
    const item = element('article', 'jc-work-comment');
    item.style.setProperty('--comment-depth', String(depth));
    const copy = element('div', 'jc-work-comment-copy');
    const name = comment.author_name || comment.author?.displayName || '社区用户';
    copy.append(element('strong', '', name), element('p', '', comment.content));
    const meta = element('div', 'jc-comment-meta');
    if (comment.created_at) meta.append(element('time', '', formatCommunityDate(comment.created_at)));
    if (state.session && !work.showcase) {
      meta.append(button('回复', { icon: 'reply', onClick: () => openReplyComposer(work, comment, item, section) }));
    }
    copy.append(meta);
    item.append(renderAuthor({ displayName: name, avatarUrl: comment.author_avatar }), copy);
    const canDelete = state.session && (currentUser().id === comment.author_id || currentUser().id === work.author?.id);
    if (canDelete && !work.showcase) {
      item.append(button('', { icon: 'trash', iconOnly: true, label: '删除评论', onClick: (event) => confirmDestructive(event.currentTarget, async () => {
        await request(`/comments/${comment.id}`, { method: 'DELETE' });
        await loadWorkComments(work, section);
        toast('评论已删除');
      }) }));
    }
    return item;
  }

  function openReplyComposer(work, comment, item, section) {
    item.querySelector('.jc-inline-reply')?.remove();
    const form = element('form', 'jc-inline-reply');
    const input = element('textarea', 'jc-textarea');
    input.name = 'content';
    input.maxLength = 1000;
    input.required = true;
    input.placeholder = `回复 ${comment.author_name || '社区用户'}`;
    const cancel = button('取消', { onClick: () => form.remove() });
    const submit = button('发送回复', { icon: 'send', variant: 'primary' });
    submit.type = 'submit';
    const actions = element('div', 'jc-inline-reply-actions');
    actions.append(cancel, submit);
    form.append(input, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = input.value.trim();
      if (!content) return;
      submit.disabled = true;
      try {
        await request(`/works/${work.id}/comments`, { method: 'POST', body: { content, parentId: comment.id } });
        await loadWorkComments(work, section);
        toast('回复已发布');
      } catch (error) { handleAuthError(error); }
      finally { submit.disabled = false; }
    });
    item.append(form);
    input.focus();
  }

  function formatCommunityDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
  }

  async function confirmDestructive(node, action) {
    if (node.dataset.confirmDelete !== 'true') {
      node.dataset.confirmDelete = 'true';
      node.dataset.danger = 'true';
      node.setAttribute('aria-label', '再次点击确认删除');
      toast('再次点击删除按钮以确认');
      window.setTimeout(() => {
        node.dataset.confirmDelete = 'false';
        node.dataset.danger = 'false';
        node.setAttribute('aria-label', '删除');
      }, 3200);
      return;
    }
    node.disabled = true;
    try { await action(); }
    catch (error) { handleAuthError(error, false); toast(error.message || '删除失败'); }
    finally { node.disabled = false; }
  }

  function renderPrompt(label, content) {
    const box = element('section', 'jc-prompt');
    const head = element('div', 'jc-prompt-label');
    head.append(element('span', '', label), button('', { icon: 'copy', iconOnly: true, label: `复制${label}`, onClick: async () => { await navigator.clipboard.writeText(content); toast('已复制'); } }));
    box.append(head, element('p', '', content));
    return box;
  }

  async function toggleWork(kind) {
    if (!state.session) return openAuth('login');
    if (state.activeWork?.work?.showcase) {
      if (kind === 'like') state.activeWork.work.likeCount = Number(state.activeWork.work.likeCount || 0) + 1;
      toast(kind === 'like' ? '已点赞' : '已收藏');
      return openDetail(state.activeWork.work);
    }
    try {
      const result = await request(`/works/${state.activeWork.work.id}/${kind}`, { method: 'POST' });
      if (kind === 'like') state.activeWork.work.likeCount = result.count;
      toast(result.active ? (kind === 'like' ? '已点赞' : '已收藏') : (kind === 'like' ? '已取消点赞' : '已取消收藏'));
      openDetail(state.activeWork.work.id);
    } catch (error) { handleAuthError(error); }
  }

  async function openCodexDetail(value) {
    try {
      const result = typeof value === 'object' ? { post: value } : await request(`/codex/posts/${value}`, { auth: false });
      const post = result.post;
      state.activeCodexPost = result;
      const dialog = document.querySelector('.jc-codex-detail');
      const body = dialog.querySelector('.jc-codex-detail-body');
      body.replaceChildren();

      const article = element('article', 'jc-codex-article');
      const eyebrow = element('div', 'jc-codex-detail-eyebrow');
      eyebrow.append(element('span', 'jc-codex-kind', codexKindLabels[post.kind] || 'Codex'));
      if (post.verificationStatus === 'verified') {
        const verified = element('span', 'jc-codex-verified');
        verified.innerHTML = `${icon('shield')}<span>已验证</span>`;
        eyebrow.append(verified);
      } else if (['skill', 'workflow'].includes(post.kind)) eyebrow.append(element('span', 'jc-codex-pending', '待验证'));
      article.append(eyebrow, element('h2', 'jc-codex-detail-title', post.title));
      if (post.summary) article.append(element('p', 'jc-codex-detail-summary', post.summary));
      const author = element('div', 'jc-codex-detail-author');
      author.append(renderAuthor(post.author));
      article.append(author);

      if (post.skillName || post.version || post.license) {
        const facts = element('dl', 'jc-codex-detail-facts');
        [[post.skillName, 'Skill'], [post.version, '版本'], [post.license, '许可证']].forEach(([content, label]) => {
          if (!content) return;
          const item = element('div', '');
          item.append(element('dt', '', label), element('dd', '', content));
          facts.append(item);
        });
        article.append(facts);
      }

      const content = element('section', 'jc-codex-content');
      content.append(element('p', '', post.content || post.summary || ''));
      article.append(content);
      if (post.repositoryUrl) {
        const repository = document.createElement('a');
        repository.className = 'jc-codex-repository';
        repository.href = post.repositoryUrl;
        repository.target = '_blank';
        repository.rel = 'noopener noreferrer';
        repository.innerHTML = `${icon('external')}<span>${post.repositoryUrl}</span>`;
        article.append(repository);
      }
      if (post.installCommand) article.append(renderPrompt('安装命令（仅复制）', post.installCommand));
      if (post.skillMarkdown) {
        const markdown = element('details', 'jc-codex-markdown');
        markdown.append(element('summary', '', '查看 SKILL.md'), element('pre', '', post.skillMarkdown));
        article.append(markdown);
      }
      if (post.tags?.length) {
        const tags = element('div', 'jc-tags');
        post.tags.forEach((tag) => tags.append(element('span', 'jc-tag', `# ${tag}`)));
        article.append(tags);
      }

      const actions = element('div', 'jc-codex-detail-actions');
      if (post.packageUrl) {
        actions.append(button('下载 ZIP', { icon: 'external', onClick: () => {
          const link = document.createElement('a');
          link.href = post.packageUrl;
          link.download = post.packageFileName || `${post.skillName || 'jiaren-skill'}.zip`;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.click();
        } }));
      }
      actions.append(
        button(String(post.likeCount || 0), { icon: 'heart', onClick: () => toggleCodex('like') }),
        button('收藏', { icon: 'bookmark', onClick: () => toggleCodex('bookmark') }),
      );
      article.append(actions);
      body.append(article);

      const comments = element('section', 'jc-codex-comments');
      comments.append(element('h3', '', `讨论 ${post.commentCount || 0}`));
      const list = element('div', 'jc-codex-comment-list');
      comments.append(list);
      if (!post.showcase) {
        const form = element('form', 'jc-codex-comment-form');
        const input = element('textarea', 'jc-textarea');
        input.name = 'content';
        input.placeholder = state.session ? '写下你的问题或经验' : '登录后参与讨论';
        input.maxLength = 2000;
        input.required = true;
        input.disabled = !state.session;
        const commentAction = state.session
          ? button('发表评论', { icon: 'send', variant: 'primary' })
          : button('登录后讨论', { icon: 'user', onClick: () => openAuth('login') });
        if (state.session) commentAction.type = 'submit';
        form.append(input, commentAction);
        form.addEventListener('submit', submitCodexComment);
        comments.append(form);
        loadCodexComments(post.id, list);
      } else list.append(element('p', 'jc-codex-comment-empty', '演示内容不包含真实讨论。'));
      body.append(comments);
      showDialog(dialog);
    } catch (error) { toast(error.message); }
  }

  async function loadCodexComments(postId, target) {
    try {
      const result = await request(`/codex/posts/${postId}/comments`, { auth: false });
      target.replaceChildren();
      if (!result.items.length) {
        target.append(element('p', 'jc-codex-comment-empty', '还没有讨论，来发表第一条评论。'));
        return;
      }
      result.items.forEach((comment) => {
        const item = element('article', 'jc-codex-comment');
        item.append(renderAuthor({ displayName: comment.author_name, avatarUrl: comment.author_avatar }), element('p', '', comment.content));
        target.append(item);
      });
    } catch (error) { target.replaceChildren(element('p', 'jc-codex-comment-empty', '讨论加载失败。')); }
  }

  async function submitCodexComment(event) {
    event.preventDefault();
    if (!state.session) return openAuth('login');
    const form = event.currentTarget;
    const submit = form.querySelector('button');
    const content = form.elements.content.value.trim();
    if (!content) return;
    submit.disabled = true;
    try {
      await request(`/codex/posts/${state.activeCodexPost.post.id}/comments`, { method: 'POST', body: { content } });
      toast('评论已发布');
      openCodexDetail(state.activeCodexPost.post.id);
    } catch (error) { handleAuthError(error); } finally { submit.disabled = false; }
  }

  async function toggleCodex(kind) {
    if (!state.session) return openAuth('login');
    const post = state.activeCodexPost?.post;
    if (!post || post.showcase) return toast('演示内容不支持互动');
    try {
      const result = await request(`/codex/posts/${post.id}/${kind}`, { method: 'POST' });
      toast(result.active ? (kind === 'like' ? '已点赞' : '已收藏') : (kind === 'like' ? '已取消点赞' : '已取消收藏'));
      openCodexDetail(post.id);
    } catch (error) { handleAuthError(error); }
  }

  function codexInputField(label, name, options = {}) {
    const wrapper = element('label', `jc-field${options.className ? ` ${options.className}` : ''}`);
    wrapper.append(element('span', 'jc-label', label));
    const input = element('input', 'jc-input');
    input.name = name;
    input.type = options.type || 'text';
    input.placeholder = options.placeholder || '';
    input.maxLength = options.maxLength || 200;
    input.required = Boolean(options.required);
    wrapper.append(input);
    return wrapper;
  }

  function codexSelectField() {
    const wrapper = element('label', 'jc-field');
    wrapper.append(element('span', 'jc-label', '内容类型'));
    const select = element('select', 'jc-input');
    select.name = 'kind';
    Object.entries(codexKindLabels).forEach(([value, label]) => {
      const option = element('option', '', label);
      option.value = value;
      select.append(option);
    });
    wrapper.append(select);
    return wrapper;
  }

  function openCodexComposer(defaultKind = '') {
    if (!state.session) return openAuth('login');
    const dialog = document.querySelector('.jc-codex-composer');
    const body = dialog.querySelector('.jc-codex-composer-body');
    body.replaceChildren();
    const form = element('form', 'jc-form jc-codex-form');
    const scroll = element('div', 'jc-codex-form-scroll');
    const kindField = codexSelectField();
    if (codexKindLabels[defaultKind]) kindField.querySelector('select').value = defaultKind;
    scroll.append(kindField, codexInputField('标题', 'title', { required: true, maxLength: 120, placeholder: '清楚说明分享内容' }));
    scroll.append(codexInputField('一句话摘要', 'summary', { maxLength: 600, placeholder: '说明它解决什么问题' }));
    const contentField = textareaField('正文', 'content', '记录使用方式、经验或需要讨论的问题', '');
    contentField.classList.add('jc-codex-content-field');
    contentField.querySelector('textarea').required = true;
    contentField.querySelector('textarea').maxLength = 20000;
    scroll.append(contentField);

    const skillFields = element('section', 'jc-codex-skill-fields');
    skillFields.append(
      codexInputField('Skill 名称', 'skillName', { maxLength: 100, placeholder: '例如：ui-ux-pro-max' }),
      codexInputField('GitHub 仓库', 'repositoryUrl', { type: 'url', maxLength: 2048, placeholder: 'https://github.com/owner/repository' }),
      codexInputField('安装命令', 'installCommand', { maxLength: 1000, placeholder: '仅用于展示和复制' }),
      codexInputField('版本', 'version', { maxLength: 80, placeholder: '例如：1.0.0' }),
      codexInputField('许可证', 'license', { maxLength: 80, placeholder: '例如：MIT' }),
    );
    const fileRow = element('div', 'jc-codex-file-row');
    const file = document.createElement('input');
    file.type = 'file';
    file.accept = '.zip,application/zip,application/x-zip-compressed';
    file.hidden = true;
    const choose = button('选择 ZIP 压缩包', { icon: 'upload', onClick: () => file.click() });
    const fileName = element('span', '', 'Skill / 工作流仅允许 ZIP，文件将直接上传 OSS');
    file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      if (!/\.zip$/i.test(selected.name)) { file.value = ''; return toast('请选择 .zip 压缩包'); }
      if (selected.size > 50 * 1024 * 1024) { file.value = ''; return toast('ZIP 压缩包不能超过 50MB'); }
      form.jiarenSkillPackage = selected;
      fileName.textContent = `${selected.name} · ${JiarenFormatBytes(selected.size)}`;
      const nameInput = skillFields.querySelector('[name="skillName"]');
      if (!nameInput.value) nameInput.value = selected.name.replace(/\.zip$/i, '');
    });
    fileRow.append(choose, fileName, file);
    skillFields.append(fileRow);
    scroll.append(skillFields, codexInputField('标签', 'tags', { maxLength: 360, placeholder: '例如：视频，分镜，提示词' }));
    const error = element('div', 'jc-form-error');
    error.setAttribute('role', 'alert');
    const actions = element('div', 'jc-codex-form-actions');
    const publish = button('发布', { icon: 'send', variant: 'primary' });
    publish.type = 'submit';
    actions.append(error, button('取消', { onClick: closeDialogs }), publish);
    form.append(scroll, actions);

    const updateFields = () => {
      const kind = kindField.querySelector('select').value;
      skillFields.hidden = !['skill', 'workflow'].includes(kind);
      skillFields.querySelector('[name="skillName"]').required = kind === 'skill';
      file.required = ['skill', 'workflow'].includes(kind);
    };
    kindField.querySelector('select').addEventListener('change', updateFields);
    updateFields();
    form.addEventListener('submit', submitCodexPost);
    body.append(form);
    showDialog(dialog);
  }

  async function submitCodexPost(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('.jc-codex-form-actions .jc-button[data-variant="primary"]');
    const error = form.querySelector('.jc-form-error');
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    error.textContent = '';
    try {
      let packageData = {};
      if (['skill', 'workflow'].includes(values.kind)) {
        const zip = form.jiarenSkillPackage;
        if (!zip || !/\.zip$/i.test(zip.name)) throw new Error('发布 Skill 或工作流必须上传 ZIP 压缩包。');
        const uploaded = await uploadCommunityBlob(zip, zip.name, 'skill-package', 'application/zip');
        packageData = { packageUrl: uploaded.url, packageFileName: zip.name, packageSize: zip.size, packageMimeType: 'application/zip' };
      }
      const result = await request('/codex/posts', { method: 'POST', body: {
        ...values,
        ...packageData,
        tags: String(values.tags || '').split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
      }});
      closeDialogs();
      state.codexCursor = null;
      state.codexExhausted = false;
      state.codexPosts = [];
      renderFeed();
      loadFeed();
      toast(result.verificationStatus === 'pending' ? '已发布，等待管理员验证' : '已发布到 Codex');
    } catch (cause) {
      error.textContent = cause.message;
      handleAuthError(cause, false);
    } finally { submit.disabled = false; }
  }

  function addToCanvas() {
    const work = state.activeWork?.work || {};
    const raw = state.activeWork?.canvasPackage;
    if (!raw) return;
    const rawAssets = Array.isArray(raw.assets) ? raw.assets : [];
    const fallbackUrl = raw.url || work.assets?.[0]?.url || work.coverUrl;
    const assets = (rawAssets.length ? rawAssets : fallbackUrl ? [{
      type: raw.type || work.type || 'image',
      url: fallbackUrl,
      mimeType: raw.mimeType || work.mimeType,
      width: raw.width || work.width,
      height: raw.height || work.height,
      durationSeconds: raw.durationSeconds || work.durationSeconds,
    }] : []).map((asset) => ({
      ...asset,
      url: /^(?:https?:|blob:|data:)/i.test(String(asset.url || ''))
        ? asset.url
        : new URL(asset.url, location.href).href,
    }));
    if (!assets.length) return toast('当前作品没有可添加到画布的媒体');
    const detail = {
      ...raw,
      title: raw.title || work.title || '社区作品',
      prompt: raw.prompt || work.prompt || '',
      negativePrompt: raw.negativePrompt || work.negativePrompt || '',
      model: raw.model || work.model || '',
      source: 'jiaren-community',
      workId: work.id,
      assets,
    };
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        source: 'jiaren-community',
        type: 'jiaren:community:add-to-canvas',
        detail,
      }, '*');
    } else {
      window.dispatchEvent(new CustomEvent('jiaren:community:add-to-canvas', { detail }));
    }
    closeDialogs();
    close();
    toast('作品已发送到画布');
  }

  function openUploadPicker() {
    if (!state.session) return openAuth('login');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/mp4,video/webm,video/quicktime';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const url = URL.createObjectURL(file);
      const draft = {
        type,
        url,
        blob: file,
        mimeType: file.type,
        fileName: file.name,
        title: file.name.replace(/\.[^.]+$/, ''),
        nodeType: 'creator-center-upload',
      };
      const probe = document.createElement(type === 'video' ? 'video' : 'img');
      const ready = () => {
        draft.width = probe.videoWidth || probe.naturalWidth || 0;
        draft.height = probe.videoHeight || probe.naturalHeight || 0;
        draft.durationSeconds = Number.isFinite(probe.duration) ? probe.duration : null;
        openShare(draft);
      };
      probe.addEventListener(type === 'video' ? 'loadedmetadata' : 'load', ready, { once: true });
      probe.src = url;
    }, { once: true });
    input.click();
  }

  function openCreatorCenter(tab = 'overview') {
    if (!state.session) return openAuth('login');
    state.creatorTab = tab;
    const dialog = document.querySelector('.jc-creator-center');
    const nav = dialog.querySelector('.jc-creator-nav');
    nav.replaceChildren();
    const user = currentUser();
    const identity = element('div', 'jc-creator-identity');
    identity.append(renderAuthor(user), element('small', '', 'JiarenAI 创作者'));
    nav.append(identity);
    [
      ['overview', '首页', 'chart'],
      ['publish', '发布作品', 'upload'],
      ['skills', '发布 Skill', 'code'],
      ['works', '作品管理', 'image'],
      ['comments', '评论管理', 'message'],
      ['profile', '账号资料', 'user'],
    ].forEach(([id, label, iconName]) => {
      const item = button(label, { icon: iconName, onClick: () => openCreatorCenter(id) });
      item.dataset.active = String(state.creatorTab === id);
      nav.append(item);
    });
    const logout = button('退出登录', { onClick: () => {
      request('/auth/logout', { method: 'POST' }).catch(() => {});
      state.session = null;
      localStorage.removeItem('jiaren-community-session');
      state.creatorData = { dashboard: null, works: [], received: [], mine: [] };
      renderHeader();
      closeDialogs();
      toast('已退出登录');
    } });
    logout.classList.add('jc-creator-logout');
    nav.append(logout);
    renderCreatorPanel(dialog.querySelector('.jc-creator-body'));
    showDialog(dialog);
  }

  async function renderCreatorPanel(body) {
    body.replaceChildren();
    const requestedTab = state.creatorTab;
    body.append(renderCreatorLoading());
    try {
      if (requestedTab === 'overview') {
        const [dashboard, works] = await Promise.all([
          request('/me/dashboard'),
          request('/me/works?limit=6'),
        ]);
        state.creatorData.dashboard = dashboard;
        state.creatorData.works = works.items || [];
      } else if (requestedTab === 'works') {
        state.creatorData.works = (await request('/me/works?limit=100')).items || [];
      } else if (requestedTab === 'comments') {
        const [received, mine] = await Promise.all([
          request('/me/comments?scope=received&limit=100'),
          request('/me/comments?scope=mine&limit=100'),
        ]);
        state.creatorData.received = received.items || [];
        state.creatorData.mine = mine.items || [];
      }
    } catch (error) {
      body.replaceChildren(renderCreatorError(error, () => renderCreatorPanel(body)));
      handleAuthError(error);
      return;
    }
    if (state.creatorTab !== requestedTab) return;
    body.replaceChildren();
    if (state.creatorTab === 'overview') {
      const works = state.creatorData.works;
      const statsData = state.creatorData.dashboard?.stats || {};
      const hero = element('section', 'jc-creator-welcome');
      hero.append(renderAuthor(currentUser()), element('div', '', undefined));
      hero.lastElementChild.append(element('p', '', currentUser().bio || '持续发布作品，积累自己的创作档案。'));
      body.append(hero);
      const actions = element('section', 'jc-creator-quick-actions');
      const imageAction = button('发布图片', { icon: 'image', onClick: openUploadPicker });
      const videoAction = button('发布视频', { icon: 'video', onClick: openUploadPicker });
      const canvasAction = button('从画布发布', { icon: 'share', onClick: () => { closeDialogs(); if (!state.embedded) close(); else toast('进入画布后右击作品，选择分享到社区'); } });
      const skillAction = button('发布 Skill', { icon: 'code', onClick: () => openCodexComposer('skill') });
      actions.append(imageAction, videoAction, canvasAction, skillAction);
      body.append(actions);
      const stats = element('section', 'jc-creator-stats');
      [
        ['作品', statsData.works || 0, `${statsData.images || 0} 图 · ${statsData.videos || 0} 视频`],
        ['获赞', statsData.likes || 0, '全部作品'],
        ['评论', statsData.comments || 0, '作品评论总数'],
        ['收藏', statsData.bookmarks || 0, '作品被收藏'],
        ['粉丝', statsData.followers || 0, '关注你的用户'],
        ['关注', statsData.following || 0, '你关注的用户'],
      ].forEach(([label, value, note]) => {
        const item = element('div', '');
        item.append(element('span', '', label), element('strong', '', String(value)), element('small', '', note));
        stats.append(item);
      });
      body.append(stats);
      const recent = element('section', 'jc-creator-section');
      recent.append(element('h3', '', '最近作品'));
      recent.append(renderCreatorWorksList(works, body, true));
      body.append(recent);
      return;
    }
    if (state.creatorTab === 'publish') {
      const panel = element('section', 'jc-creator-section');
      panel.append(element('h3', '', '发布新作品'), element('p', '', '图片和视频会保留原始比例；从画布发布时会同时带入提示词、模型和生成参数。'));
      const actions = element('div', 'jc-creator-publish-actions');
      actions.append(
        button('发布图片', { icon: 'image', variant: 'primary', onClick: openUploadPicker }),
        button('发布视频', { icon: 'video', onClick: openUploadPicker }),
        button('发布 Skill ZIP', { icon: 'code', onClick: () => openCodexComposer('skill') }),
      );
      panel.append(actions);
      body.append(panel);
      return;
    }
    if (state.creatorTab === 'skills') {
      const panel = element('section', 'jc-creator-section jc-creator-skill-panel');
      panel.append(
        element('h3', '', '发布 Skill'),
        element('p', '', '上传 ZIP 压缩包并填写仓库、安装命令和版本信息。压缩包会直接保存到 OSS，不占用社区服务器空间。'),
      );
      const actions = element('div', 'jc-creator-publish-actions');
      actions.append(
        button('上传 Skill ZIP', { icon: 'upload', variant: 'primary', onClick: () => openCodexComposer('skill') }),
        button('查看 Skill 广场', { icon: 'code', onClick: () => { closeDialogs(); setSection('codex'); } }),
      );
      panel.append(actions);
      body.append(panel);
      return;
    }
    if (state.creatorTab === 'works') {
      const works = state.creatorData.works;
      const panel = element('section', 'jc-creator-section');
      panel.append(element('h3', '', `作品管理 ${works.length}`));
      panel.append(renderCreatorWorksList(works, body));
      body.append(panel);
      return;
    }
    if (state.creatorTab === 'comments') {
      const comments = state.creatorData[state.creatorCommentScope];
      const panel = element('section', 'jc-creator-section');
      panel.append(element('h3', '', '评论管理'));
      const scopes = element('div', 'jc-creator-comment-scopes');
      [['received', '收到的评论'], ['mine', '我的评论']].forEach(([scope, label]) => {
        const scopeButton = button(label, { icon: 'message', onClick: () => {
          state.creatorCommentScope = scope;
          renderCreatorPanel(body);
        } });
        scopeButton.dataset.active = String(state.creatorCommentScope === scope);
        scopes.append(scopeButton);
      });
      panel.append(scopes);
      const list = element('div', 'jc-creator-list');
      if (!comments.length) list.append(element('p', 'jc-creator-empty', state.creatorCommentScope === 'received' ? '还没有收到评论。' : '你还没有发表过评论。'));
      comments.forEach((comment) => {
        const item = element('article', 'jc-creator-comment-row');
        const thumb = document.createElement('img');
        thumb.src = comment.work_cover_url;
        thumb.alt = '';
        const copy = element('div', '');
        const context = state.creatorCommentScope === 'received'
          ? `${comment.author_name} 评论了《${comment.work_title}》`
          : `你评论了《${comment.work_title}》`;
        copy.append(element('strong', '', context), element('p', '', comment.content), element('time', '', formatCommunityDate(comment.created_at)));
        const actions = element('div', 'jc-creator-row-actions');
        actions.append(button('查看作品', { onClick: () => openDetail(comment.work_id) }));
        if (state.creatorCommentScope === 'received') {
          actions.append(button('回复', { icon: 'reply', onClick: () => openCreatorReplyComposer(comment, item, body) }));
        }
        actions.append(button('', { icon: 'trash', iconOnly: true, label: '删除评论', onClick: (event) => confirmDestructive(event.currentTarget, async () => {
          await request(`/comments/${comment.id}`, { method: 'DELETE' });
          state.creatorData.received = state.creatorData.received.filter((entry) => entry.id !== comment.id);
          state.creatorData.mine = state.creatorData.mine.filter((entry) => entry.id !== comment.id);
          await renderCreatorPanel(body);
          toast('评论已删除');
        }) }));
        item.append(thumb, copy, actions);
        list.append(item);
      });
      panel.append(list);
      body.append(panel);
      return;
    }
    const panel = element('section', 'jc-creator-section');
    panel.append(element('h3', '', '账号资料'));
    const profile = element('div', 'jc-creator-profile-summary');
    profile.append(renderAuthor(currentUser()));
    const details = element('div', '');
    details.append(element('span', '', currentUser().email || ''), element('p', '', currentUser().bio || '还没有填写个人简介。'));
    profile.append(details, button('编辑头像与资料', { icon: 'user', variant: 'primary', onClick: openProfile }));
    panel.append(profile);
    body.append(panel);
  }

  function renderCreatorLoading() {
    const loading = element('div', 'jc-creator-loading');
    loading.setAttribute('role', 'status');
    loading.append(element('span', ''), element('p', '', '正在同步创作者数据…'));
    return loading;
  }

  function renderCreatorError(error, retry) {
    const panel = element('section', 'jc-creator-error');
    panel.append(element('h3', '', '创作者数据暂时无法加载'), element('p', '', error.message || '请检查网络连接后重试。'), button('重新加载', { icon: 'refresh', variant: 'primary', onClick: retry }));
    return panel;
  }

  function renderCreatorWorksList(works, body, compact = false) {
    const list = element('div', 'jc-creator-list');
    if (!works.length) {
      list.append(element('p', 'jc-creator-empty', '还没有发布作品。'));
      return list;
    }
    works.forEach((work) => {
      const item = element('article', 'jc-creator-list-item');
      const thumb = document.createElement('img');
      thumb.src = work.coverUrl;
      thumb.alt = '';
      const copy = element('div', '');
      const status = work.visibility === 'private' ? '仅自己可见' : work.visibility === 'unlisted' ? '不公开推荐' : '公开';
      copy.append(element('strong', '', work.title), element('span', '', `${work.type === 'video' ? '视频' : '图片'} · ${status} · ${work.model || '未记录模型'}`));
      const metrics = element('small', '', `${Number(work.likeCount) || 0} 赞 · ${Number(work.commentCount) || 0} 评论`);
      copy.append(metrics);
      const actions = element('div', 'jc-creator-row-actions');
      actions.append(button('查看', { onClick: () => openDetail(work.id) }));
      if (!compact) {
        actions.append(button('编辑', { onClick: () => openWorkEditor(work, body) }));
        actions.append(button('', { icon: 'trash', iconOnly: true, label: '删除作品', onClick: (event) => confirmDestructive(event.currentTarget, async () => {
          await request(`/works/${work.id}`, { method: 'DELETE' });
          state.creatorData.works = state.creatorData.works.filter((entry) => entry.id !== work.id);
          await renderCreatorPanel(body);
          toast('作品已删除');
        }) }));
      }
      item.append(thumb, copy, actions);
      list.append(item);
    });
    return list;
  }

  function openWorkEditor(work, body) {
    body.replaceChildren();
    const panel = element('section', 'jc-creator-section jc-work-editor');
    const header = element('div', 'jc-work-editor-header');
    header.append(button('返回作品管理', { onClick: () => renderCreatorPanel(body) }), element('h3', '', '编辑作品'));
    const form = element('form', 'jc-form jc-work-editor-form');
    form.append(field('作品标题', 'title', 'text', '作品标题'));
    form.querySelector('[name="title"]').value = work.title || '';
    form.append(textareaField('作品说明', 'description', '介绍创作思路', work.description || ''));
    form.append(textareaField('提示词', 'prompt', '作品提示词', work.prompt || ''));
    form.append(field('生成模型', 'model', 'text', '生成模型'));
    form.querySelector('[name="model"]').required = false;
    form.querySelector('[name="model"]').value = work.model || '';
    form.append(field('标签', 'tags', 'text', '多个标签用逗号分隔'));
    form.querySelector('[name="tags"]').required = false;
    form.querySelector('[name="tags"]').value = (work.tags || []).join('，');
    const visibilityField = element('label', 'jc-field');
    visibilityField.append(element('span', 'jc-label', '可见范围'));
    const select = element('select', 'jc-input');
    select.name = 'visibility';
    [['public', '公开'], ['unlisted', '不公开推荐'], ['private', '仅自己可见']].forEach(([value, label]) => {
      const option = element('option', '', label);
      option.value = value;
      option.selected = (work.visibility || 'public') === value;
      select.append(option);
    });
    visibilityField.append(select);
    const error = element('div', 'jc-form-error');
    const submit = button('保存修改', { icon: 'send', variant: 'primary' });
    submit.type = 'submit';
    form.append(visibilityField, error, submit);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      error.textContent = '';
      const values = Object.fromEntries(new FormData(form));
      try {
        await request(`/works/${work.id}`, { method: 'PATCH', body: {
          ...values,
          tags: String(values.tags || '').split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
        } });
        state.creatorData.works = (await request('/me/works?limit=100')).items || [];
        state.creatorTab = 'works';
        await renderCreatorPanel(body);
        toast('作品信息已保存');
      } catch (cause) { error.textContent = cause.message; }
      finally { submit.disabled = false; }
    });
    panel.append(header, form);
    body.append(panel);
  }

  function openCreatorReplyComposer(comment, item, body) {
    item.querySelector('.jc-inline-reply')?.remove();
    const form = element('form', 'jc-inline-reply');
    const input = element('textarea', 'jc-textarea');
    input.required = true;
    input.maxLength = 1000;
    input.placeholder = `回复 ${comment.author_name}`;
    const actions = element('div', 'jc-inline-reply-actions');
    actions.append(button('取消', { onClick: () => form.remove() }));
    const submit = button('发送回复', { icon: 'send', variant: 'primary' });
    submit.type = 'submit';
    actions.append(submit);
    form.append(input, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = input.value.trim();
      if (!content) return;
      submit.disabled = true;
      try {
        await request(`/works/${comment.work_id}/comments`, { method: 'POST', body: { content, parentId: comment.id } });
        state.creatorData.received = (await request('/me/comments?scope=received&limit=100')).items || [];
        await renderCreatorPanel(body);
        toast('回复已发布');
      } catch (error) { handleAuthError(error); }
      finally { submit.disabled = false; }
    });
    item.append(form);
    input.focus();
  }

  function openAuth(mode = 'login') {
    showDialog(document.querySelector('.jc-auth'));
    renderAuthForm(mode);
  }

  function renderAuthForm(mode) {
    const selectedMode = mode === 'reset-confirm' ? 'reset' : mode;
    document.querySelectorAll('.jc-auth-tab').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.mode === selectedMode)));
    const form = document.querySelector('.jc-auth .jc-form');
    form.replaceChildren();
    if (mode === 'register') form.append(field('昵称', 'displayName', 'text', '你的社区昵称'));
    form.append(field('邮箱', 'email', 'email', 'name@example.com'));
    if (mode === 'login' || mode === 'register') form.append(field('密码', 'password', 'password', mode === 'register' ? '至少 10 位' : '输入密码'));
    if (mode === 'verify') form.append(field('验证码', 'code', 'text', '6 位验证码'));
    if (mode === 'reset-confirm') {
      form.append(field('验证码', 'code', 'text', '6 位验证码'));
      form.append(field('新密码', 'newPassword', 'password', '至少 10 位'));
    }
    if (mode === 'register') form.append(element('p', 'jc-form-note', '创建账号后，6 位验证码会发送到该邮箱。'));
    if (mode === 'reset') form.append(element('p', 'jc-form-note', '验证码将发送到注册邮箱，不会向任何人展示原密码。'));
    if (mode === 'verify') {
      const emailInput = form.querySelector('[name="email"]');
      if (emailInput) emailInput.value = localStorage.getItem('jiaren-community-pending-email') || '';
      form.append(element('p', 'jc-form-note', '验证码 10 分钟内有效。请勿向任何人提供验证码。'));
    }
    if (mode === 'reset-confirm') {
      const emailInput = form.querySelector('[name="email"]');
      if (emailInput) emailInput.value = localStorage.getItem('jiaren-community-reset-email') || '';
    }
    const error = element('div', 'jc-form-error');
    error.setAttribute('role', 'alert');
    const submitLabel = mode === 'login' ? '登录' : mode === 'register' ? '创建账号' : mode === 'verify' ? '完成验证' : mode === 'reset' ? '发送验证码' : '重置密码';
    const actions = element('div', 'jc-auth-actions');
    const submit = button(submitLabel, { variant: 'primary' });
    submit.type = 'submit';
    actions.append(submit);
    if (mode === 'verify') {
      const resend = button('重新发送验证码', { icon: 'refresh' });
      const cooldownKey = 'jiaren-community-verification-resend-at';
      const refreshCooldown = () => {
        if (!resend.isConnected) return;
        const remaining = Math.max(0, Math.ceil((Number(sessionStorage.getItem(cooldownKey) || 0) - Date.now()) / 1000));
        resend.disabled = remaining > 0;
        resend.querySelector('.jc-button-label').textContent = remaining > 0 ? `${remaining} 秒后可重发` : '重新发送验证码';
        if (remaining > 0) setTimeout(refreshCooldown, 1000);
      };
      resend.addEventListener('click', async () => {
        const emailValue = form.querySelector('[name="email"]')?.value.trim();
        if (!emailValue) { error.textContent = '请先填写注册邮箱。'; return; }
        resend.disabled = true;
        error.textContent = '';
        try {
          try {
            await request('/auth/resend-verification', { method: 'POST', auth: false, body: { email: emailValue } });
          } catch (cause) {
            const pending = state.pendingRegistration;
            const canRetryRegistration = cause.status === 404
              && pending
              && pending.email.toLowerCase() === emailValue.toLowerCase();
            if (!canRetryRegistration) {
              if (cause.status === 404) throw new Error('请返回注册页重新填写资料后发送验证码。');
              throw cause;
            }
            await request('/auth/register', { method: 'POST', auth: false, body: pending });
          }
          localStorage.setItem('jiaren-community-pending-email', emailValue);
          sessionStorage.setItem(cooldownKey, String(Date.now() + 60000));
          toast('新的验证码已发送');
          refreshCooldown();
        } catch (cause) {
          error.textContent = cause.message || '验证码发送失败，请稍后重试。';
          resend.disabled = false;
        }
      });
      actions.append(resend);
      refreshCooldown();
    }
    form.append(error, actions);
    form.addEventListener('submit', (event) => submitAuth(event, mode));
  }

  async function openProfile() {
    if (!state.session) return openAuth('login');
    const dialog = document.querySelector('.jc-profile');
    const body = dialog.querySelector('.jc-profile-body');
    body.replaceChildren();
    try {
      const result = await request('/me');
      state.session.user = result.user;
      localStorage.setItem('jiaren-community-session', JSON.stringify(state.session));
    } catch (error) {
      return handleAuthError(error);
    }

    const user = state.session.user;
    const form = element('form', 'jc-form jc-profile-form');
    const avatarField = element('div', 'jc-profile-avatar-field');
    const preview = element('span', 'jc-profile-avatar-preview');
    if (user.avatarUrl) {
      const image = document.createElement('img');
      image.src = user.avatarUrl;
      image.alt = '当前头像';
      preview.append(image);
    } else preview.textContent = (user.displayName || '创').slice(0, 1);
    const avatarCopy = element('div', 'jc-profile-avatar-copy');
    avatarCopy.append(element('strong', '', '社区头像'), element('span', '', '支持 JPG、PNG、WebP，最大 8MB'));
    const choose = button('选择头像', { icon: 'image' });
    const file = document.createElement('input');
    file.type = 'file';
    file.name = 'avatar';
    file.accept = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
    file.hidden = true;
    choose.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const selected = file.files?.[0];
      if (!selected) return;
      if (selected.size > 8 * 1024 * 1024) { file.value = ''; toast('头像不能超过 8MB'); return; }
      const image = document.createElement('img');
      image.src = URL.createObjectURL(selected);
      image.alt = '新头像预览';
      preview.replaceChildren(image);
    });
    avatarField.append(preview, avatarCopy, choose, file);
    form.append(avatarField, field('昵称', 'displayName', 'text', '你的社区昵称'));
    form.querySelector('[name="displayName"]').value = user.displayName || '';
    form.append(textareaField('个人简介', 'bio', '介绍你的创作方向（可选）', user.bio || ''));
    const error = element('div', 'jc-form-error');
    error.setAttribute('role', 'alert');
    const save = button('保存资料', { variant: 'primary' });
    save.type = 'submit';
    form.append(error, save);
    form.addEventListener('submit', submitProfile);
    body.append(form);
    showDialog(dialog);
  }

  async function submitProfile(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('button[data-variant="primary"]');
    const error = form.querySelector('.jc-form-error');
    const file = form.querySelector('[name="avatar"]').files?.[0];
    const values = Object.fromEntries(new FormData(form));
    submit.disabled = true;
    error.textContent = '';
    try {
      let avatarUrl = state.session.user.avatarUrl || '';
      if (file) avatarUrl = (await uploadCommunityBlob(file, file.name, 'avatar')).url;
      const result = await request('/me', { method: 'PATCH', body: { displayName: values.displayName, bio: values.bio, avatarUrl } });
      state.session.user = result.user;
      localStorage.setItem('jiaren-community-session', JSON.stringify(state.session));
      renderHeader();
      closeDialogs();
      toast('个人资料已更新');
    } catch (cause) {
      error.textContent = cause.code === 'OSS_NOT_CONFIGURED' ? '头像存储尚未配置，可先保存昵称和简介，或稍后再上传头像。' : cause.message;
      handleAuthError(cause, false);
    } finally { submit.disabled = false; }
  }

  function field(label, name, type, placeholder) {
    const wrapper = element('label', 'jc-field');
    wrapper.append(element('span', 'jc-label', label));
    const input = element('input', 'jc-input');
    input.name = name; input.type = type; input.placeholder = placeholder; input.required = true;
    if (name === 'code') { input.inputMode = 'numeric'; input.maxLength = 6; }
    wrapper.append(input);
    return wrapper;
  }

  async function submitAuth(event, mode) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('button[data-variant="primary"]');
    const errorNode = form.querySelector('.jc-form-error');
    const data = Object.fromEntries(new FormData(form));
    submit.disabled = true; errorNode.textContent = '';
    try {
      const path = mode === 'verify' ? 'verify-email' : mode === 'reset' ? 'password-reset/request' : mode === 'reset-confirm' ? 'password-reset/confirm' : mode;
      const result = await request(`/auth/${path}`, { method: 'POST', auth: false, body: data });
      if (mode === 'register') {
        state.pendingRegistration = {
          email: String(data.email || '').trim(),
          displayName: String(data.displayName || '').trim(),
          password: String(data.password || ''),
        };
        localStorage.setItem('jiaren-community-pending-email', data.email);
        renderAuthForm('verify');
        const emailInput = document.querySelector('.jc-auth [name="email"]');
        if (emailInput) emailInput.value = data.email;
        toast('验证码已发送');
        return;
      }
      if (mode === 'reset') {
        localStorage.setItem('jiaren-community-reset-email', data.email);
        renderAuthForm('reset-confirm');
        toast('如果该邮箱已注册，验证码将发送到邮箱');
        return;
      }
      if (mode === 'reset-confirm') {
        localStorage.removeItem('jiaren-community-reset-email');
        renderAuthForm('login');
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput) emailInput.value = data.email;
        toast('密码已重置，请重新登录');
        return;
      }
      state.session = { ...result.session, user: result.user };
      state.pendingRegistration = null;
      state.creatorData = { dashboard: null, works: [], received: [], mine: [] };
      localStorage.setItem('jiaren-community-session', JSON.stringify(state.session));
      localStorage.removeItem('jiaren-community-pending-email');
      renderHeader(); closeDialogs(); toast('登录成功');
      if (state.pendingShare) openShare(state.pendingShare);
      else if (state.section === 'media') setType(state.type);
      else setSection('codex');
    } catch (error) {
      errorNode.textContent = error.code === 'HTTPS_REQUIRED'
        ? '社区安全连接尚未完成，请稍后重试。'
        : error.message || '社区服务暂时无法连接，没有创建本地虚假账号，请稍后重试。';
    } finally { submit.disabled = false; }
  }

  function openShare(draft) {
    state.pendingShare = draft;
    if (!state.session) return openAuth('login');
    const dialog = document.querySelector('.jc-share');
    const body = dialog.querySelector('.jc-share-body');
    body.replaceChildren();
    const preview = element('div', 'jc-share-preview');
    const media = element('div', 'jc-share-preview-media');
    const asset = document.createElement(draft.type === 'video' ? 'video' : 'img');
    asset.src = draft.url; if (draft.type === 'video') asset.muted = true; else asset.alt = '';
    media.append(asset);
    const copy = element('div', 'jc-share-preview-copy');
    copy.append(element('strong', '', draft.title || '画布作品'), element('span', '', draft.type === 'video' ? '视频作品' : '图片作品'));
    if (draft.model || draft.seed || draft.nodeType) copy.append(element('small', '', [draft.model, draft.seed ? `Seed ${draft.seed}` : '', draft.nodeType].filter(Boolean).join(' · ')));
    preview.append(media, copy);
    const form = element('form', 'jc-form jc-share-form');
    const scroll = element('div', 'jc-share-scroll');
    scroll.append(preview, shareCategoryField(draft.category || ''));
    scroll.append(field('作品标题', 'title', 'text', '为作品起个名字'));
    const titleInput = scroll.querySelector('[name="title"]'); titleInput.value = draft.title || '';
    scroll.append(textareaField('作品说明', 'description', '说说创作思路（可选）', draft.description || ''));
    scroll.append(textareaField('提示词', 'prompt', '分享提示词（可选）', draft.prompt || ''));
    scroll.append(field('生成模型', 'model', 'text', '例如：GPT Image 2 / Seedance 2.0'));
    scroll.querySelector('[name="model"]').required = false;
    scroll.querySelector('[name="model"]').value = draft.model || '';
    scroll.append(field('标签', 'tags', 'text', '例如：人物，电影感，赛博朋克'));
    scroll.querySelector('[name="tags"]').required = false;
    const error = element('div', 'jc-form-error'); error.setAttribute('role', 'alert');
    const share = button('确认分享', { icon: 'send', variant: 'primary' });
    share.type = 'submit';
    const actions = element('div', 'jc-share-actions');
    actions.append(error, button('取消', { onClick: closeDialogs }), share);
    form.append(scroll, actions);
    form.addEventListener('submit', submitShare);
    body.append(form);
    showDialog(dialog);
  }

  function shareCategoryField(value = '') {
    const wrapper = element('label', 'jc-field jc-category-field');
    wrapper.append(element('span', 'jc-label', '发布栏目 *'));
    const select = element('select', 'jc-input');
    select.name = 'category';
    select.required = true;
    const placeholder = element('option', '', '请选择发布栏目');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = !mediaCategories.includes(value);
    select.append(placeholder);
    mediaCategories.forEach((category) => {
      const option = element('option', '', category);
      option.value = category;
      option.selected = category === value;
      select.append(option);
    });
    wrapper.append(select);
    return wrapper;
  }

  function textareaField(label, name, placeholder, value) {
    const wrapper = element('label', 'jc-field');
    wrapper.append(element('span', 'jc-label', label));
    const input = element('textarea', 'jc-textarea'); input.name = name; input.placeholder = placeholder; input.value = value;
    wrapper.append(input);
    return wrapper;
  }

  async function submitShare(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submit = form.querySelector('button[data-variant="primary"]');
    const error = form.querySelector('.jc-form-error');
    const values = Object.fromEntries(new FormData(form));
    const submitLabel = submit.querySelector('.jc-button-label');
    const setProgress = (text) => { if (submitLabel) submitLabel.textContent = text; };
    submit.disabled = true; error.textContent = ''; setProgress('读取素材…');
    try {
      const uploaded = await ensureCommunityAsset(state.pendingShare, setProgress);
      setProgress('发布作品…');
      await request('/works', { method: 'POST', body: {
        type: state.pendingShare.type,
        title: values.title,
        description: values.description,
        prompt: values.prompt,
        model: values.model || state.pendingShare.model || '',
        coverUrl: uploaded.url,
        width: state.pendingShare.width,
        height: state.pendingShare.height,
        durationSeconds: state.pendingShare.durationSeconds,
        tags: [...new Set([
          values.category,
          ...String(values.tags || '').split(/[，,]/).map((tag) => tag.trim()).filter(Boolean),
        ])],
        assets: [{ kind: state.pendingShare.type, url: uploaded.url, mimeType: uploaded.mimeType, width: state.pendingShare.width, height: state.pendingShare.height }],
        sourceMetadata: { nodeType: state.pendingShare.nodeType, aspectRatio: state.pendingShare.aspectRatio, seed: state.pendingShare.seed },
      }});
      state.pendingShare = null; closeDialogs(); toast('作品已分享到社区'); setType(state.type);
    } catch (cause) {
      error.textContent = cause.message || '作品发布失败，请检查网络后重试。';
      handleAuthError(cause, false);
    }
    finally { submit.disabled = false; setProgress('确认分享'); }
  }

  async function ensureCommunityAsset(draft, onProgress = () => {}) {
    if (/^https:\/\/cdn\.jiaren\.xyz\//.test(draft.url)) return { url: draft.url, mimeType: draft.mimeType };
    let blob = draft.blob;
    let fileName = draft.fileName || `canvas-${Date.now()}`;
    let rendererError;
    if (!blob) {
      try {
        const response = await fetch(draft.url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        blob = await response.blob();
      } catch (cause) {
        rendererError = cause;
      }
    }
    if (!blob) {
      const readAsset = window.jiaren?.system?.readCommunityAsset;
      if (!readAsset) throw new Error('无法读取当前素材，请先保存素材后重试');
      const result = await readAsset({
        source: draft.url,
        mimeType: draft.mimeType,
        fileName,
        maxBytes: draft.type === 'video' ? 300 * 1024 * 1024 : 80 * 1024 * 1024,
      });
      if (!result?.ok || !result.bytes) {
        throw new Error(result?.message || rendererError?.message || '无法读取当前素材，请先保存素材后重试');
      }
      const bytes = result.bytes instanceof Uint8Array ? result.bytes : new Uint8Array(result.bytes);
      blob = new Blob([bytes], { type: result.mimeType || draft.mimeType || 'application/octet-stream' });
      fileName = result.fileName || fileName;
    }
    const mimeType = blob.type || draft.mimeType || (draft.type === 'video' ? 'video/mp4' : 'image/png');
    onProgress('上传素材…');
    return uploadCommunityBlob(blob, fileName, 'work', mimeType);
  }

  async function uploadCommunityBlob(blob, fileName, purpose, explicitMimeType) {
    const mimeType = explicitMimeType || blob.type || 'application/octet-stream';
    const policy = await request('/uploads/presign', { method: 'POST', body: { fileName, mimeType, size: blob.size, purpose } });
    const data = new FormData();
    Object.entries(policy.fields).forEach(([key, value]) => data.append(key, value));
    data.append('file', blob, fileName);
    const uploaded = await fetch(policy.uploadUrl, { method: 'POST', body: data });
    if (!uploaded.ok) throw new Error('素材上传失败，请检查 OSS 跨域配置');
    return { url: policy.publicUrl, mimeType };
  }

  function handleAuthError(error, openDialog = true) {
    if (error.status === 401) {
      state.session = null;
      localStorage.removeItem('jiaren-community-session');
      state.creatorData = { dashboard: null, works: [], received: [], mine: [] };
      renderHeader();
      if (openDialog) openAuth('login');
      else toast('登录已过期，请重新登录');
      return;
    }
    if (error.message) toast(error.message);
  }

  function showDialog(dialog) {
    document.querySelector('.jc-scrim').dataset.open = 'true';
    document.querySelectorAll('.jc-dialog').forEach((node) => { node.dataset.open = String(node === dialog); });
    setTimeout(() => dialog.querySelector('input, textarea, button')?.focus(), 20);
  }

  function isDialogOpen() { return [...document.querySelectorAll('.jc-dialog')].some((node) => node.dataset.open === 'true'); }
  function closeDialogs() {
    state.activeWork = null;
    state.activeCodexPost = null;
    document.querySelector('.jc-scrim').dataset.open = 'false';
    document.querySelectorAll('.jc-dialog').forEach((node) => { node.dataset.open = 'false'; });
  }

  function debounce(callback, wait) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), wait); };
  }

  function open() {
    buildShell();
    state.open = true;
    document.querySelector('.jc-shell').dataset.open = 'true';
    document.body.style.setProperty('--jc-previous-overflow', document.body.style.overflow || '');
    document.body.style.overflow = 'hidden';
    if (state.section === 'codex') {
      if (!state.codexPosts.length) loadCodexFeed();
    } else if (!state.works.length) loadFeed();
  }

  function close() {
    state.open = false;
    closeDialogs();
    const shell = document.querySelector('.jc-shell');
    if (shell) shell.dataset.open = 'false';
    document.body.style.overflow = document.body.style.getPropertyValue('--jc-previous-overflow');
  }

  function boot(options = {}) {
    buildShell();
    if (options.open) open();
  }

  window.JiarenCommunity = { boot, open, close, openShare };
  if (document.body?.dataset.communityStandalone === 'true') boot({ open: true });
})();
