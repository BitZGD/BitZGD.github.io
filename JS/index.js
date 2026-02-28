window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20));

const I = {
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    wi: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>',
    an: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.341c-.583 0-1.057.474-1.057 1.057 0 .583.474 1.057 1.057 1.057.583 0 1.057-.474 1.057-1.057 0-.583-.474-1.057-1.057-1.057zm-11.046 0c-.583 0-1.057.474-1.057 1.057 0 .583.474 1.057 1.057 1.057.583 0 1.057-.474 1.057-1.057 0-.583-.474-1.057-1.057-1.057zm11.405-6.02l1.994-3.453a.415.415 0 00-.718-.414L17.13 8.93c-1.521-.694-3.232-1.08-5.13-1.08s-3.609.386-5.13 1.08L4.842 5.454a.415.415 0 00-.718.414l1.994 3.453C2.739 11.354.398 14.939.398 19.041h23.204c0-4.102-2.341-7.687-5.72-9.72z"/></svg>',
    ap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
    us: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    mo: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sh: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    gp: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>',
    zp: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
};

const MS = {
    'bitz.customprofiles': { c: 'blue', i: 'us' },
    'bitz.darkmode_v4': { c: 'purple', i: 'mo' },
    'bitz.fakegdmod': { c: 'red', i: 'sh' },
    'bitz.moregames': { c: 'green', i: 'gp' },
    'bitz.hard_mode': { c: 'orange', i: 'zp' }
};

function parse(r) {
    let d = null;
    for (const n of r.nodes) { if (n.type === 'data' && n.data && n.data.length > 10) { const f = n.data[0]; if (f && typeof f === 'object' && 'developer' in f) { d = n.data; break; } } }
    if (!d) return null;
    const mp = d[d[0].mods], idxs = d[mp.data], mods = [];
    for (const idx of idxs) {
        const sc = d[idx], m = {};
        m.id = d[sc.id]; m.repository = d[sc.repository]; m.download_count = d[sc.download_count];
        m.created_at = d[sc.created_at]; m.updated_at = d[sc.updated_at];
        m.developers = []; const di = d[sc.developers];
        if (Array.isArray(di)) for (const i of di) { const ds = d[i]; m.developers.push({ username: d[ds.username], display_name: d[ds.display_name], is_owner: d[ds.is_owner] }); }
        m.versions = []; const vi = d[sc.versions];
        if (Array.isArray(vi)) for (const i of vi) {
            const vs = d[i], v = {}; v.name = d[vs.name]; v.description = d[vs.description]; v.version = d[vs.version]; v.download_link = d[vs.download_link]; v.geode = d[vs.geode]; v.download_count = d[vs.download_count]; v.early_load = d[vs.early_load];
            const gd = d[vs.gd]; if (typeof gd === 'object' && gd && !Array.isArray(gd)) { v.gd = {}; for (const [k, p] of Object.entries(gd)) v.gd[k] = d[p]; } else v.gd = gd;
            m.versions.push(v);
        }
        m.tags = []; const ti = d[sc.tags]; if (Array.isArray(ti)) for (const i of ti) { const t = d[i]; if (typeof t === 'string') m.tags.push(t); }
        const lr = d[sc.links]; if (typeof lr === 'object' && lr) { m.links = {}; for (const [k, i] of Object.entries(lr)) m.links[k] = d[i]; }
        mods.push(m);
    }
    const ds = d[d[0].developer];
    return { dev: { id: d[ds.id], username: d[ds.username], display_name: d[ds.display_name], verified: d[ds.verified], github_id: d[ds.github_id] }, mods, count: d[mp.count] };
}

function fmt(n) { if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'; if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'; return String(n); }
function gdV(g) { if (typeof g === 'string') return g; if (typeof g === 'object' && g) for (const v of Object.values(g)) if (v) return v; return '?'; }

function plats(g) {
    const L = [['win', 'Windows', I.wi], ['android32', 'Android 32', I.an], ['android64', 'Android 64', I.an], ['mac-intel', 'macOS Intel', I.ap], ['mac-arm', 'macOS ARM', I.ap], ['ios', 'iOS', I.ap]];
    let h = '<div class="mod-platforms">';
    for (const [k, l, ic] of L) {
        let ok = typeof g === 'string' || (typeof g === 'object' && g && g[k] != null && g[k] !== '');
        h += `<div class="plat ${ok ? 'ok' : 'no'}"><span class="plat-tip">${l}</span>${ic}</div>`;
    }
    return h + '</div>';
}

function renderMod(m, tp) {
    const v = m.versions[0]; if (!v) return '';
    const s = MS[m.id] || { c: 'blue', i: 'us' };
    const lid = 'logo-' + m.id.replace(/\./g, '-');
    const isDM = m.id === 'bitz.darkmode_v4';
    const isMG = m.id === 'bitz.moregames';

    let devs = '';
    if (m.developers.length) { devs = '<div class="mod-devs">'; for (const d of m.developers) devs += `<span class="dev-chip ${d.is_owner ? 'owner' : 'contributor'}">${d.display_name || d.username} — ${d.is_owner ? 'Owner' : 'Contributor'}</span>`; devs += '</div>'; }

    let tags = '';
    if (m.tags.length) tags = `<div class="sidebar-section"><div class="sidebar-title">Tags</div><div class="mod-tags">${m.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>`;

    let notice = '';
    if (isMG) notice = `<div class="mod-notice warning">${I.wa}<span>When will it be updated? Soon! A complete rework is currently in progress. Stay tuned!</span></div>`;

    let tpH = '';
    if (isDM && tp) {
        let rows = '';
        for (const [name, vers] of Object.entries(tp)) {
            for (const [ver, info] of Object.entries(vers)) {
                const dot = { ICE: 'ice', METAL: 'metal', SHADOW: 'shadow' }[name] || 'ice';
                rows += `<div class="tp-row"><div class="tp-info"><span class="tp-dot ${dot}"></span><span class="tp-name">${name}</span><span class="tp-ver">v${ver}</span></div><div class="tp-right"><span class="tp-count">${I.dl} ${fmt(info['download count'] || 0)}</span><a href="${info['download link'] || '#'}" target="_blank" class="tp-btn">${I.dl} Download</a></div></div>`;
            }
        }
        tpH = `<div class="tp-area"><div class="tp-label">Available Texture Packs</div><div class="tp-list">${rows}</div></div>`;
    }

    const src = m.links?.source || m.repository || null;

    return `<div class="mod-card">
<div class="mod-card-inner">
<div class="mod-card-main">
<div class="mod-header">
<div class="mod-logo ${s.c}" id="${lid}">${I[s.i] || I.us}</div>
<div class="mod-title-area">
<div class="mod-title">${v.name || m.id}</div>
<div class="mod-subtitle">${m.id}</div>
</div>
</div>
${devs}
<p class="mod-text">${(v.description || '').replace(/\n/g, ' ')}</p>
${notice}
<div class="mod-actions">
<a href="${v.download_link}" target="_blank" class="btn primary">${I.dl} Download Latest</a>
${src ? `<a href="${src}" target="_blank" class="btn">${I.gh} Source Code</a>` : ''}
</div>
${tpH}
</div>
<div class="mod-card-sidebar">
<div class="sidebar-section">
<div class="sidebar-title">Version Info</div>
<div class="mod-badges">
<span class="badge v">${I.tg} v${v.version}</span>
<span class="badge g">Geode ${v.geode}</span>
<span class="badge gd">GD ${gdV(v.gd)}</span>
<span class="badge dl">${I.dl} ${fmt(m.download_count)}</span>
</div>
</div>
<div class="sidebar-section">
<div class="sidebar-title">Platforms</div>
${plats(v.gd)}
</div>
${tags}
</div>
</div>
</div>`;
}

function loadLogos(mods) {
    for (const m of mods) {
        const el = document.getElementById('logo-' + m.id.replace(/\./g, '-'));
        if (!el) continue;
        const img = new Image();
        img.src = `https://api.geode-sdk.org/v1/mods/${m.id}/logo`;
        img.onload = () => { el.innerHTML = ''; el.style.background = 'none'; el.style.border = '1px solid var(--border-subtle)'; img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:16px;'; el.appendChild(img); };
    }
}

function loadAvatar(ghId) {
    if (!ghId) return;
    const el = document.getElementById('avatar');
    const img = new Image();
    img.src = `https://avatars.githubusercontent.com/u/${ghId}?v=4&s=320`;
    img.onload = () => { el.innerHTML = ''; img.style.cssText = 'width:100%;height:100%;object-fit:cover;'; el.appendChild(img); };
}

async function fetchJSON(url) {
    const tries = [url, `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, `https://corsproxy.io/?${encodeURIComponent(url)}`];
    for (const u of tries) { try { const r = await fetch(u); if (r.ok) return JSON.parse(await r.text()); } catch (e) { } }
    return null;
}

async function fetchGitHubStars(username) {
    try {
        const r = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=stars`);
        if (!r.ok) return 0;
        const repos = await r.json();
        return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    } catch (e) { return 0; }
}

async function init() {
    const out = document.getElementById('modsContent');

    const [raw, tp] = await Promise.all([
        fetchJSON('https://geode-sdk.org/developers/22/__data.json'),
        fetchJSON('https://raw.githubusercontent.com/iArtie/DarkModeV4-Index/refs/heads/main/downloadscount.json')
    ]);

    if (!raw) { out.innerHTML = '<div class="error-box"><p>Failed to load mods from the Geode API.</p><button class="retry-btn" onclick="location.reload()">Retry</button></div>'; return; }

    const data = parse(raw);
    if (!data || !data.mods.length) { out.innerHTML = '<div class="error-box"><p>Could not parse mod data.</p><button class="retry-btn" onclick="location.reload()">Retry</button></div>'; return; }

    loadAvatar(data.dev.github_id);

    document.getElementById('aboutBio').innerHTML = `
I'm <strong>${data.dev.display_name}</strong> (${data.dev.username}),
developer of <strong>${data.mods.length} mods</strong> on Geode.
I’m really grateful for everyone who uses my mods! You make everything I do worthwhile! <3
`;

    let totalDl = 0;
    for (const m of data.mods) totalDl += m.download_count || 0;
    document.getElementById('statDl').textContent = fmt(totalDl);
    document.getElementById('statMods').textContent = data.mods.length;

    // Floating badges
    document.getElementById('floatBadge1').innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 3v12"/>
  <path d="M7 10l5 5 5-5"/>
  <path d="M5 21h14"/>
</svg>
 ${fmt(totalDl)}`;
    document.getElementById('floatBadge2').innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
  <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/>
  <path d="M3.27 7L12 12l8.73-5"/>
  <path d="M12 22V12"/>
</svg>
 ${data.mods.length} mods`;

    // GitHub stars
    fetchGitHubStars('iArtie').then(stars => {
        document.getElementById('statStars').textContent = stars > 0 ? fmt(stars) : '—';
    });

    data.mods.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));

    out.innerHTML = '<div class="mods-grid">' + data.mods.map(m => renderMod(m, tp)).join('') + '</div>';

    document.getElementById('supportArea').style.display = '';

    loadLogos(data.mods);
}

init();