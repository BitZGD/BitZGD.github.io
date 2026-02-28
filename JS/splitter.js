var $ = function (id) {
    return document.getElementById(id);
};

function toast(m, t) {
    t = t || 'info';
    var c = $('toastContainer'),
        e = document.createElement('div');
    e.className = 'toast-item toast-' + t;
    var ic = {
        success: '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        error: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'
    };
    e.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + (ic[t] || ic.info) + '</svg><span>' + m + '</span>';
    c.appendChild(e);
    setTimeout(function () {
        if (e.parentNode) e.remove();
    }, 3200);
}

function switchTab(n) {
    document.querySelectorAll('.navbar-tab').forEach(function (b) {
        b.classList.remove('active');
    });
    document.querySelectorAll('.tab-panel').forEach(function (p) {
        p.classList.remove('active');
    });
    document.querySelector('[data-tab="' + n + '"]').classList.add('active');
    $('tab-' + n).classList.add('active');
}

function log(id, m, t) {
    t = t || 'info';
    var el = $(id);
    el.classList.add('visible');
    var l = document.createElement('div');
    l.className = 'log-line log-' + t;
    l.textContent = m;
    el.appendChild(l);
    el.scrollTop = el.scrollHeight;
}

function fsize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
}

// Theme
function toggleTheme() {
    var t = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : '');
    localStorage.setItem('gd-theme', t);
}
(function () {
    var t = localStorage.getItem('gd-theme');
    if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
})();

// Upload setup
function setupUpload(box, inp, cb) {
    box.addEventListener('click', function (e) {
        if (e.target.closest('.file-list-item') || e.target.closest('.file-item-remove')) return;
        inp.click();
    });
    inp.addEventListener('change', function () {
        if (inp.files && inp.files.length > 0) {
            cb(inp.files);
            inp.value = '';
        }
    });
    box.addEventListener('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
        box.classList.add('dragover');
    });
    box.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        box.classList.add('dragover');
    });
    box.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        box.classList.remove('dragover');
    });
    box.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        box.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) cb(e.dataTransfer.files);
    });
}

// Plist parser
function parsePlist(s) {
    var p = new DOMParser(),
        d = p.parseFromString(s, 'text/xml'),
        fr = {},
        mt = {},
        rd = d.querySelector('plist > dict');
    if (!rd) throw new Error('Invalid plist');
    var rc = Array.from(rd.children),
        fd, md;
    for (var i = 0; i < rc.length; i++) {
        if (rc[i].tagName === 'key') {
            var nx = rc[i + 1];
            if (rc[i].textContent === 'frames' && nx && nx.tagName === 'dict') fd = nx;
            if (rc[i].textContent === 'metadata' && nx && nx.tagName === 'dict') md = nx;
        }
    }
    if (!fd) throw new Error('No frames');
    if (md) {
        var mc = Array.from(md.children);
        for (var m = 0; m < mc.length; m++) {
            if (mc[m].tagName === 'key') {
                var mk = mc[m].textContent,
                    mv = mc[m + 1];
                if (mv) {
                    if (mv.tagName === 'true') mt[mk] = true;
                    else if (mv.tagName === 'false') mt[mk] = false;
                    else if (mv.tagName === 'integer') mt[mk] = parseInt(mv.textContent);
                    else mt[mk] = mv.textContent;
                }
            }
        }
    }
    var fc = Array.from(fd.children);
    for (var f = 0; f < fc.length; f++) {
        if (fc[f].tagName === 'key') {
            var fn = fc[f].textContent,
                fv = fc[f + 1];
            if (fv && fv.tagName === 'dict') fr[fn] = parseFrame(fv);
        }
    }
    return {
        frames: fr,
        metadata: mt
    };
}

function parseFrame(el) {
    var p = {},
        ch = Array.from(el.children);
    for (var i = 0; i < ch.length; i++) {
        if (ch[i].tagName === 'key') {
            var k = ch[i].textContent,
                v = ch[i + 1];
            if (v) {
                if (v.tagName === 'true') p[k] = true;
                else if (v.tagName === 'false') p[k] = false;
                else if (v.tagName === 'integer') p[k] = parseInt(v.textContent);
                else p[k] = v.textContent;
            }
        }
    }
    if (p.textureRect) {
        var r = pb(p.textureRect),
            ss = pb(p.spriteSize || '{' + r[2] + ',' + r[3] + '}'),
            src = pb(p.spriteSourceSize || p.spriteSize || '{' + r[2] + ',' + r[3] + '}'),
            o = pb(p.spriteOffset || '{0,0}');
        return {
            x: r[0],
            y: r[1],
            w: ss[0],
            h: ss[1],
            sw: src[0],
            sh: src[1],
            ox: o[0],
            oy: o[1],
            rot: p.textureRotated === true
        };
    }
    if (p.frame) {
        var r2 = pb(p.frame),
            s2 = pb(p.sourceSize || '{' + r2[2] + ',' + r2[3] + '}'),
            o2 = pb(p.offset || '{0,0}');
        return {
            x: r2[0],
            y: r2[1],
            w: r2[2],
            h: r2[3],
            sw: s2[0],
            sh: s2[1],
            ox: o2[0],
            oy: o2[1],
            rot: p.rotated === true
        };
    }
    return {
        x: +p.x || 0,
        y: +p.y || 0,
        w: +p.width || 0,
        h: +p.height || 0,
        sw: +(p.originalWidth || p.width) || 0,
        sh: +(p.originalHeight || p.height) || 0,
        ox: +p.offsetX || 0,
        oy: +p.offsetY || 0,
        rot: false
    };
}

function pb(s) {
    return s.replace(/[{}]/g, '').split(',').map(function (v) {
        return parseFloat(v.trim());
    });
}

// Helpers
function trimCanvas(c) {
    var ctx = c.getContext('2d'),
        w = c.width,
        h = c.height;
    if (!w || !h) return {
        canvas: c,
        ox: 0,
        oy: 0,
        ow: w,
        oh: h
    };
    var d = ctx.getImageData(0, 0, w, h).data,
        t = h,
        b = 0,
        l = w,
        r = 0;
    for (var y = 0; y < h; y++)
        for (var x = 0; x < w; x++) {
            if (d[(y * w + x) * 4 + 3] > 0) {
                if (y < t) t = y;
                if (y > b) b = y;
                if (x < l) l = x;
                if (x > r) r = x;
            }
        }
    if (t > b) return {
        canvas: c,
        ox: 0,
        oy: 0,
        ow: w,
        oh: h
    };
    var tw = r - l + 1,
        th = b - t + 1,
        tc = document.createElement('canvas');
    tc.width = tw;
    tc.height = th;
    tc.getContext('2d').drawImage(c, l, t, tw, th, 0, 0, tw, th);
    return {
        canvas: tc,
        ox: l,
        oy: t,
        ow: w,
        oh: h
    };
}

function scaleCV(c, f) {
    if (f === 1) return c;
    var nw = Math.max(1, Math.round(c.width * f)),
        nh = Math.max(1, Math.round(c.height * f)),
        s = document.createElement('canvas');
    s.width = nw;
    s.height = nh;
    var ctx = s.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(c, 0, 0, nw, nh);
    return s;
}

function detectPrefix(fr) {
    var k = Object.keys(fr);
    if (!k.length) return '';
    var f = k[0],
        si = f.indexOf('/');
    if (si < 1) return '';
    var p = f.substring(0, si + 1);
    return k.every(function (x) {
        return x.startsWith(p);
    }) ? p : '';
}

function stripPfx(n, p) {
    return (p && n.startsWith(p)) ? n.substring(p.length) : n;
}

var ICON_RE = [/^player_\d+/, /^ship_\d+/, /^bird_\d+/, /^swing_\d+/, /^spider_\d+/, /^player_ball_\d+/, /^dart_\d+/, /^robot_\d+/, /^jetpack_\d+/];

function isIcon(fr) {
    var k = Object.keys(fr);
    for (var i = 0; i < k.length; i++) {
        var n = k[i],
            si = n.lastIndexOf('/'),
            b = si >= 0 ? n.substring(si + 1) : n;
        for (var p = 0; p < ICON_RE.length; p++)
            if (ICON_RE[p].test(b)) return true;
    }
    return false;
}

function isIconMeta(mt) {
    var t = mt.textureFileName || mt.realTextureFileName || '';
    return t.toLowerCase().indexOf('icons/') === 0;
}

function isIconFiles(names) {
    for (var i = 0; i < names.length; i++) {
        var n = names[i].replace(/\.png$/i, '');
        for (var p = 0; p < ICON_RE.length; p++)
            if (ICON_RE[p].test(n)) return true;
    }
    return false;
}

// Geode
function getGP() {
    if (!$('geodeEnabled').checked) return '';
    var id = $('geodeModId').value.trim();
    return id ? id + '/' : '';
}

function toggleGeode() {
    var on = $('geodeEnabled').checked;
    $('geodeArea').style.display = on ? 'block' : 'none';
    $('geodePanel').classList.toggle('disabled', !on);
    updateGeode();
}

function updateGeode() {
    var id = $('geodeModId').value.trim(),
        el = $('geodePreview');
    if (!id) {
        el.innerHTML = '<span style="color:var(--orange)">Enter Mod ID</span>';
        return;
    }
    var s = pkFiles.length > 0 ? pkFiles.slice(0, 3).map(function (f) {
        return f.name;
    }) : ['sprite.png', 'icon.png'];
    var h = '<div style="font-weight:600;margin-bottom:3px">Key preview:</div>';
    s.forEach(function (n) {
        h += '<div>&lt;key&gt;<span class="gp-prefix">' + id + '/</span><span class="gp-name">' + n + '</span>&lt;/key&gt;</div>';
    });
    if (pkFiles.length > 3) h += '<div style="opacity:0.4">...+' + (pkFiles.length - 3) + ' more</div>';
    el.innerHTML = h;
}

// Scale
var scEn = false,
    scVal = 1,
    scBase = 'GJ_CustomSheet';

function toggleScale() {
    scEn = $('scaleEnabled').checked;
    $('scalePanel').querySelectorAll('.scale-option').forEach(function (b) {
        b.disabled = !scEn;
    });
    $('scalePanel').classList.toggle('disabled', !scEn);
    if (!scEn) {
        scVal = 1;
        $('scalePanel').querySelectorAll('.scale-option').forEach(function (b, i) {
            b.classList.toggle('active', i === 0);
        });
    }
    updScName();
    updPkEst();
}

function setScale(btn, v) {
    if (!scEn) return;
    scVal = v;
    $('scalePanel').querySelectorAll('.scale-option').forEach(function (b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    updScName();
    updPkEst();
}

function updScName() {
    var c = $('packOutputName').value.trim(),
        b = c.replace(/-(uhd|hd)$/i, '');
    scBase = b;
    if (!scEn || scVal === 1) $('packOutputName').value = b + '-uhd';
    else if (scVal === 0.5) $('packOutputName').value = b + '-hd';
    else $('packOutputName').value = b;
}

// MaxRects
function MRP(bw, bh) {
    this.bw = bw;
    this.bh = bh;
    this.fr = [{
        x: 0,
        y: 0,
        w: bw,
        h: bh
    }];
    this.ur = [];
}
MRP.prototype.ins = function (w, h) {
    var best = Infinity,
        br = null;
    for (var i = 0; i < this.fr.length; i++) {
        var f = this.fr[i];
        if (w <= f.w && h <= f.h) {
            var s = Math.min(f.w - w, f.h - h);
            if (s < best) {
                best = s;
                br = {
                    x: f.x,
                    y: f.y,
                    w: w,
                    h: h
                };
            }
        }
    }
    if (!br) return null;
    this.split(br);
    this.ur.push(br);
    return br;
};
MRP.prototype.split = function (pr) {
    var nf = [];
    for (var i = 0; i < this.fr.length; i++) {
        var f = this.fr[i];
        if (!(pr.x < f.x + f.w && pr.x + pr.w > f.x && pr.y < f.y + f.h && pr.y + pr.h > f.y)) {
            nf.push(f);
            continue;
        }
        if (pr.x > f.x) nf.push({
            x: f.x,
            y: f.y,
            w: pr.x - f.x,
            h: f.h
        });
        if (pr.x + pr.w < f.x + f.w) nf.push({
            x: pr.x + pr.w,
            y: f.y,
            w: (f.x + f.w) - (pr.x + pr.w),
            h: f.h
        });
        if (pr.y > f.y) nf.push({
            x: f.x,
            y: f.y,
            w: f.w,
            h: pr.y - f.y
        });
        if (pr.y + pr.h < f.y + f.h) nf.push({
            x: f.x,
            y: pr.y + pr.h,
            w: f.w,
            h: (f.y + f.h) - (pr.y + pr.h)
        });
    }
    this.fr = [];
    for (var a = 0; a < nf.length; a++) {
        var c = false;
        for (var b = 0; b < nf.length; b++) {
            if (a !== b && nf[a].x >= nf[b].x && nf[a].y >= nf[b].y && nf[a].x + nf[a].w <= nf[b].x + nf[b].w && nf[a].y + nf[a].h <= nf[b].y + nf[b].h) {
                c = true;
                break;
            }
        }
        if (!c && nf[a].w > 0 && nf[a].h > 0) this.fr.push(nf[a]);
    }
};
MRP.prototype.bounds = function () {
    var mx = 0,
        my = 0;
    this.ur.forEach(function (r) {
        if (r.x + r.w > mx) mx = r.x + r.w;
        if (r.y + r.h > my) my = r.y + r.h;
    });
    return {
        w: mx,
        h: my
    };
};

function tryPk(sp, pad, mw, mh, rot) {
    var pk = new MRP(mw, mh),
        pl = [],
        fl = [],
        so = sp.slice().sort(function (a, b) {
            return (b.pw * b.ph) - (a.pw * a.ph);
        });
    for (var i = 0; i < so.length; i++) {
        var s = so[i],
            pw = s.pw + pad * 2,
            ph = s.ph + pad * 2,
            r = pk.ins(pw, ph),
            rt = false;
        if (!r && rot) {
            r = pk.ins(ph, pw);
            rt = true;
        }
        if (r) pl.push({
            s: s,
            x: r.x + pad,
            y: r.y + pad,
            w: rt ? s.ph : s.pw,
            h: rt ? s.pw : s.ph,
            rot: rt
        });
        else fl.push(s);
    }
    return {
        pl: pl,
        fl: fl,
        bd: pk.bounds()
    };
}

function findPk(sp, pad, rot) {
    var ta = 0,
        mw = 0,
        mh = 0;
    sp.forEach(function (s) {
        var pw = s.pw + pad * 2,
            ph = s.ph + pad * 2;
        ta += pw * ph;
        if (pw > mw) mw = pw;
        if (ph > mh) mh = ph;
    });
    var ms = Math.max(Math.ceil(Math.sqrt(ta)), mw, mh),
        cs = [];
    for (var s = ms; s <= 16384; s = Math.ceil(s * 1.08)) cs.push(s);
    [256, 512, 1024, 2048, 4096, 8192, 16384].forEach(function (v) {
        if (v >= ms) cs.push(v);
    });
    cs.sort(function (a, b) {
        return a - b;
    });
    cs = cs.filter(function (v, i, a) {
        return !i || v !== a[i - 1];
    });
    for (var ci = 0; ci < cs.length; ci++) {
        var sz = cs[ci],
            tr = [
                [sz, sz],
                [Math.ceil(sz * 1.4), sz],
                [sz, Math.ceil(sz * 1.4)]
            ];
        for (var ti = 0; ti < tr.length; ti++) {
            var r = tryPk(sp, pad, tr[ti][0], tr[ti][1], rot);
            if (!r.fl.length) return {
                w: tr[ti][0],
                h: tr[ti][1],
                r: r
            };
        }
    }
    var big = tryPk(sp, pad, 16384, 16384, rot);
    return {
        w: 16384,
        h: 16384,
        r: big
    };
}

function np2(n) {
    var p = 1;
    while (p < n) p *= 2;
    return p;
}

// ═══════ SPLITTER ═══════
var spPlist = null,
    spImg = null,
    spSprites = [],
    spPfx = '',
    spIsIcon = false,
    spPF = null,
    spIF = null;

function handleSplitFiles(files) {
    Array.from(files).forEach(function (f) {
        if (f.name.endsWith('.plist')) loadSpPlist(f);
        else if (f.name.endsWith('.png') || f.type === 'image/png') loadSpPng(f);
    });
}

function loadSpPlist(f) {
    spPF = f;
    updSpTags();
    $('splitOutputName').value = f.name.replace('.plist', '');
    var r = new FileReader();
    r.onload = function (e) {
        try {
            spPlist = parsePlist(e.target.result);
            var n = Object.keys(spPlist.frames).length;
            spPfx = detectPrefix(spPlist.frames);
            spIsIcon = isIconMeta(spPlist.metadata) || isIcon(spPlist.frames);
            var info = n + ' sprites';
            var mt = spPlist.metadata;
            if (mt.size) {
                var sz = pb(mt.size);
                info += ' — ' + sz[0] + '×' + sz[1];
            }
            $('splitInfoText').textContent = info;
            $('splitInfoWrap').style.display = 'block';
            $('splitIconBadge').innerHTML = spIsIcon ? '<span class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Icon</span>' : '';
            toast(n + ' sprites', 'success');
            updSpBtn();
        } catch (err) {
            toast('Invalid plist', 'error');
            spPlist = null;
        }
    };
    r.readAsText(f);
}

function loadSpPng(f) {
    spIF = f;
    updSpTags();
    var img = new Image();
    img.onload = function () {
        spImg = img;
        toast('Image loaded', 'success');
        updSpBtn();
    };
    img.onerror = function () {
        toast('Load failed', 'error');
    };
    img.src = URL.createObjectURL(f);
}

function updSpTags() {
    var h = '';
    if (spPF) h += '<span class="upload-file-tag tag-plist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' + spPF.name + '</span>';
    if (spIF) h += '<span class="upload-file-tag tag-png"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' + spIF.name + '</span>';
    $('splitFilesTags').innerHTML = h;
    $('splitUploadBox').classList.toggle('has-files', !!(spPF || spIF));
}

function updSpBtn() {
    $('splitRunBtn').disabled = !(spPlist && spImg);
}

async function runSplitter() {
    if (!spPlist || !spImg) return;
    var fr = spPlist.frames,
        nms = Object.keys(fr),
        tot = nms.length,
        fmt = $('splitFormat').value,
        ks = $('splitKeepSize').checked,
        dt = $('splitTrim').checked;
    spSprites = [];
    $('splitProg').classList.add('visible');
    $('splitRunBtn').disabled = true;
    log('splitLog', 'Splitting ' + tot + '...', 'info');
    for (var i = 0; i < tot; i++) {
        var rn = nms[i],
            f = fr[rn],
            cn = stripPfx(rn, spPfx),
            tw = f.rot ? f.h : f.w,
            th = f.rot ? f.w : f.h,
            ow = ks ? f.sw : f.w,
            oh = ks ? f.sh : f.h;
        var cv = document.createElement('canvas');
        cv.width = ow;
        cv.height = oh;
        var ctx = cv.getContext('2d');
        if (f.rot) {
            var tmp = document.createElement('canvas');
            tmp.width = tw;
            tmp.height = th;
            tmp.getContext('2d').drawImage(spImg, f.x, f.y, tw, th, 0, 0, tw, th);
            var rot = document.createElement('canvas');
            rot.width = f.w;
            rot.height = f.h;
            var rc = rot.getContext('2d');
            rc.translate(f.w / 2, f.h / 2);
            rc.rotate(-Math.PI / 2);
            rc.drawImage(tmp, -tw / 2, -th / 2);
            ctx.drawImage(rot, ks ? (ow - f.w) / 2 + f.ox : 0, ks ? (oh - f.h) / 2 - f.oy : 0);
        } else {
            ctx.drawImage(spImg, f.x, f.y, f.w, f.h, ks ? (ow - f.w) / 2 + f.ox : 0, ks ? (oh - f.h) / 2 - f.oy : 0, f.w, f.h);
        }
        var fc = dt ? trimCanvas(cv).canvas : cv;
        var mime = fmt === 'webp' ? 'image/webp' : 'image/png';
        var blob = await new Promise(function (r) {
            fc.toBlob(r, mime);
        });
        var ext = fmt === 'webp' ? '.webp' : '.png';
        spSprites.push({
            name: cn.replace(/\.(png|webp)$/i, '') + ext,
            cv: fc,
            blob: blob,
            folder: spPfx ? spPfx.slice(0, -1) : ''
        });
        $('splitProgBar').style.width = Math.round(((i + 1) / tot) * 100) + '%';
        $('splitProgLabel').textContent = (i + 1) + '/' + tot;
        if (i % 10 === 0) await new Promise(function (r) {
            setTimeout(r, 0);
        });
    }
    log('splitLog', tot + ' extracted', 'success');
    toast(tot + ' sprites extracted', 'success');
    showSpResults();
    $('splitRunBtn').disabled = false;
}

function showSpResults() {
    $('splitResults').classList.add('visible');
    var h = '<div class="stat-card"><div class="stat-value">' + spSprites.length + '</div><div class="stat-label">Sprites</div></div><div class="stat-card"><div class="stat-value">' + spImg.width + '×' + spImg.height + '</div><div class="stat-label">Source</div></div>';
    if (spPfx) h += '<div class="stat-card"><div class="stat-value" style="color:var(--purple);font-size:0.82em">' + spPfx.slice(0, -1) + '</div><div class="stat-label">Geode</div></div>';
    if (spIsIcon) h += '<div class="stat-card"><div class="stat-value" style="color:var(--orange);font-size:0.82em">Icon</div><div class="stat-label">Type</div></div>';
    $('splitStats').innerHTML = h;
    var g = $('splitGrid');
    g.innerHTML = '';
    spSprites.forEach(function (sp, i) {
        var c = document.createElement('div');
        c.className = 'sprite-card';
        c.onclick = function () {
            openModal(i);
        };
        var img = document.createElement('img');
        img.src = URL.createObjectURL(sp.blob);
        var nm = document.createElement('div');
        nm.className = 'sprite-name';
        nm.textContent = sp.name;
        nm.title = sp.name;
        c.appendChild(img);
        c.appendChild(nm);
        g.appendChild(c);
    });
}

var modalSp = null;

function openModal(i) {
    modalSp = spSprites[i];
    $('modalTitle').textContent = modalSp.name;
    $('modalImage').src = URL.createObjectURL(modalSp.blob);
    $('modalMeta').textContent = modalSp.cv.width + '×' + modalSp.cv.height + 'px — ' + fsize(modalSp.blob.size);
    $('modalBackdrop').classList.add('visible');
}

function closeModal() {
    $('modalBackdrop').classList.remove('visible');
}

function downloadModalSprite() {
    if (!modalSp) return;
    var a = document.createElement('a');
    a.href = URL.createObjectURL(modalSp.blob);
    a.download = modalSp.name;
    a.click();
}

async function downloadAllSplit() {
    if (!spSprites.length) return;
    toast('Creating ZIP...', 'info');
    var zn = $('splitOutputName').value || 'sprites',
        fld = spSprites[0].folder;
    var files = spSprites.map(function (sp) {
        return {
            name: fld ? fld + '/' + sp.name : sp.name,
            blob: sp.blob
        };
    });
    var zb = await createZip(files);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(zb);
    a.download = zn + '.zip';
    a.click();
    toast('Downloaded', 'success');
}

function clearSplitter() {
    spPlist = null;
    spImg = null;
    spSprites = [];
    spPfx = '';
    spIsIcon = false;
    spPF = null;
    spIF = null;
    $('splitFileInput').value = '';
    $('splitFilesTags').innerHTML = '';
    $('splitUploadBox').classList.remove('has-files');
    $('splitLog').innerHTML = '';
    $('splitLog').classList.remove('visible');
    $('splitResults').classList.remove('visible');
    $('splitProg').classList.remove('visible');
    $('splitProgBar').style.width = '0%';
    $('splitInfoWrap').style.display = 'none';
    $('splitOutputName').value = 'sprites';
    updSpBtn();
    toast('Cleared', 'info');
}
setupUpload($('splitUploadBox'), $('splitFileInput'), handleSplitFiles);

// ═══════ PACKER ═══════
var pkFiles = [],
    pkCV = null,
    pkPL = '',
    pkIsIcon = false;

function handlePkFiles(files) {
    var pngs = [];
    for (var i = 0; i < files.length; i++) {
        if (files[i].type === 'image/png' || files[i].name.endsWith('.png')) pngs.push(files[i]);
    }
    if (!pngs.length) {
        toast('Only PNG', 'error');
        return;
    }
    var ld = 0;
    pngs.forEach(function (f) {
        if (pkFiles.some(function (p) {
            return p.name === f.name;
        })) {
            ld++;
            if (ld === pngs.length) updPkUI();
            return;
        }
        var img = new Image();
        img.onload = function () {
            pkFiles.push({
                name: f.name,
                img: img,
                w: img.width,
                h: img.height
            });
            ld++;
            if (ld === pngs.length) {
                updPkUI();
                toast(pkFiles.length + ' sprites', 'success');
            }
        };
        img.onerror = function () {
            ld++;
            if (ld === pngs.length) updPkUI();
        };
        img.src = URL.createObjectURL(f);
    });
}

function updPkUI() {
    updPkList();
    $('packRunBtn').disabled = !pkFiles.length;
    updPkEst();
    updateGeode();
    pkIsIcon = isIconFiles(pkFiles.map(function (f) {
        return f.name;
    }));
    $('packIconBadge').innerHTML = pkIsIcon ? '<span class="icon-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Icon</span>' : '';
}

function updPkList() {
    var el = $('packFileList');
    el.innerHTML = '';
    if (!pkFiles.length) {
        $('packUploadBox').classList.remove('has-files');
        return;
    }
    $('packUploadBox').classList.add('has-files');
    pkFiles.forEach(function (f, i) {
        var d = document.createElement('div');
        d.className = 'file-list-item';
        d.innerHTML = '<span class="file-item-name">' + f.name + '</span><span class="file-item-size">' + f.w + '×' + f.h + '</span><span class="file-item-remove" data-i="' + i + '">×</span>';
        el.appendChild(d);
    });
    el.querySelectorAll('.file-item-remove').forEach(function (b) {
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            pkFiles.splice(+this.dataset.i, 1);
            updPkUI();
        });
    });
}

function updPkEst() {
    if (!pkFiles.length) {
        $('packInfoWrap').style.display = 'none';
        return;
    }
    var pad = +$('packPadding').value || 0,
        sc = scEn ? scVal : 1,
        area = 0,
        mw = 0,
        mh = 0;
    pkFiles.forEach(function (f) {
        var w = Math.round(f.w * sc) + pad * 2,
            h = Math.round(f.h * sc) + pad * 2;
        area += w * h;
        if (w > mw) mw = w;
        if (h > mh) mh = h;
    });
    var est = Math.max(Math.ceil(Math.sqrt(area)), mw, mh),
        lb = !scEn ? 'UHD' : (sc === 1 ? 'UHD' : sc === 0.5 ? 'HD' : 'Low');
    $('packInfoText').textContent = pkFiles.length + ' sprites — ~' + est + '×' + est + 'px (' + lb + ')';
    $('packInfoWrap').style.display = 'block';
}

var TOOL_URL = 'https://gdspritesheettool.com';
var CREDIT_LINE = 'Generated with GD Spritesheet Tool — ' + TOOL_URL;

async function runPacker() {
    if (!pkFiles.length) return;
    var pad = +$('packPadding').value || 0,
        outN = $('packOutputName').value || 'sheet',
        pow2 = $('packPow2').checked,
        rot = $('packRot').checked,
        trim = $('packTrim').checked,
        gp = getGP(),
        sc = scEn ? scVal : 1;
    $('packRunBtn').disabled = true;
    $('packProg').classList.add('visible');
    $('packProgBar').style.width = '5%';
    var sl = !scEn ? 'UHD' : (sc === 1 ? 'UHD' : sc === 0.5 ? 'HD' : 'Low');
    log('packLog', 'Packing ' + pkFiles.length + ' at ' + sl + '...', 'info');
    if (gp) log('packLog', 'Geode: "' + gp + '"', 'info');
    if (pkIsIcon) log('packLog', 'Icon sheet detected', 'info');
    await new Promise(function (r) {
        setTimeout(r, 30);
    });
    var prep = [];
    for (var i = 0; i < pkFiles.length; i++) {
        var f = pkFiles[i],
            src = document.createElement('canvas');
        src.width = f.w;
        src.height = f.h;
        src.getContext('2d').drawImage(f.img, 0, 0);
        var scd = scaleCV(src, sc),
            sw = scd.width,
            sh = scd.height,
            pw = sw,
            ph = sh,
            tox = 0,
            toy = 0,
            fc = scd;
        if (trim) {
            var tr = trimCanvas(scd);
            fc = tr.canvas;
            pw = fc.width;
            ph = fc.height;
            tox = tr.ox;
            toy = tr.oy;
        }
        prep.push({
            name: f.name,
            cv: fc,
            pw: pw,
            ph: ph,
            ow: sw,
            oh: sh,
            tox: tox,
            toy: toy
        });
        $('packProgBar').style.width = Math.round(((i + 1) / pkFiles.length) * 20) + '%';
        if (i % 15 === 0) await new Promise(function (r) {
            setTimeout(r, 0);
        });
    }
    $('packProgBar').style.width = '25%';
    await new Promise(function (r) {
        setTimeout(r, 30);
    });
    var res = findPk(prep, pad, rot),
        cw = res.r.bd.w,
        ch = res.r.bd.h;
    if (pow2) {
        cw = np2(cw);
        ch = np2(ch);
    }
    log('packLog', 'Layout: ' + cw + '×' + ch, 'info');
    pkCV = document.createElement('canvas');
    pkCV.width = cw;
    pkCV.height = ch;
    var ctx = pkCV.getContext('2d');
    var pls = res.r.pl,
        fx = '';
    for (var pi = 0; pi < pls.length; pi++) {
        var pl = pls[pi],
            sp = pl.s;
        if (pl.rot) {
            ctx.save();
            ctx.translate(pl.x + pl.w / 2, pl.y + pl.h / 2);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(sp.cv, -sp.pw / 2, -sp.ph / 2);
            ctx.restore();
        } else {
            ctx.drawImage(sp.cv, pl.x, pl.y);
        }
        var sox = 0,
            soy = 0;
        if (trim && (sp.ow !== sp.pw || sp.oh !== sp.ph)) {
            sox = Math.round((sp.tox + sp.pw / 2) - sp.ow / 2);
            soy = Math.round(-((sp.toy + sp.ph / 2) - sp.oh / 2));
        }
        fx += '\n            <key>' + (gp + sp.name) + '</key>\n            <dict>\n                <key>aliases</key>\n                <array/>\n                <key>spriteOffset</key>\n                <string>{' + sox + ',' + soy + '}</string>\n                <key>spriteSize</key>\n                <string>{' + sp.pw + ',' + sp.ph + '}</string>\n                <key>spriteSourceSize</key>\n                <string>{' + sp.ow + ',' + sp.oh + '}</string>\n                <key>textureRect</key>\n                <string>{{' + pl.x + ',' + pl.y + '},{' + pl.w + ',' + pl.h + '}}</string>\n                <key>textureRotated</key>\n                <' + (pl.rot ? 'true' : 'false') + '/>\n            </dict>';
        $('packProgBar').style.width = (25 + Math.round(((pi + 1) / pls.length) * 75)) + '%';
        if (pi % 20 === 0) await new Promise(function (r) {
            setTimeout(r, 0);
        });
    }
    var tf = outN + '.png',
        rtf = tf;
    if (pkIsIcon) {
        tf = 'icons/' + outN + '.png';
        rtf = tf;
    }
    pkPL = '<?xml version="1.0" encoding="UTF-8"?>\n<!-- ' + CREDIT_LINE + ' -->\n<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n    <dict>\n        <key>frames</key>\n        <dict>' + fx + '\n        </dict>\n        <key>metadata</key>\n        <dict>\n            <key>format</key>\n            <integer>3</integer>\n            <key>pixelFormat</key>\n            <string>RGBA8888</string>\n            <key>premultiplyAlpha</key>\n            <false/>\n            <key>realTextureFileName</key>\n            <string>' + rtf + '</string>\n            <key>size</key>\n            <string>{' + cw + ',' + ch + '}</string>\n            <key>textureFileName</key>\n            <string>' + tf + '</string>\n            <key>generator</key>\n            <string>GD Spritesheet Tool - ' + TOOL_URL + '</string>\n        </dict>\n    </dict>\n</plist>';
    log('packLog', 'Done: ' + pls.length + ' packed ' + cw + '×' + ch, 'success');
    toast('Sheet: ' + cw + '×' + ch + ' (' + sl + ')', 'success');
    showPkRes(cw, ch, pls.length, res.r.fl.length);
    $('packRunBtn').disabled = false;
}

function showPkRes(w, h, placed, failed) {
    $('packResults').classList.add('visible');
    var sl = !scEn ? 'UHD' : (scVal === 1 ? 'UHD' : scVal === 0.5 ? 'HD' : 'Low');
    var s = '<div class="stat-card"><div class="stat-value">' + placed + '</div><div class="stat-label">Sprites</div></div><div class="stat-card"><div class="stat-value">' + w + '×' + h + '</div><div class="stat-label">Size</div></div><div class="stat-card"><div class="stat-value">' + sl + '</div><div class="stat-label">Scale</div></div>';
    if (failed) s += '<div class="stat-card"><div class="stat-value" style="color:var(--orange)">' + failed + '</div><div class="stat-label">Skipped</div></div>';
    if (pkIsIcon) s += '<div class="stat-card"><div class="stat-value" style="color:var(--orange);font-size:0.82em">Icon</div><div class="stat-label">Type</div></div>';
    $('packStats').innerHTML = s;
    var pc = $('packCanvas');
    pc.width = pkCV.width;
    pc.height = pkCV.height;
    pc.style.maxWidth = '100%';
    pc.style.height = 'auto';
    pc.getContext('2d').drawImage(pkCV, 0, 0);
}

function dlPackPng() {
    if (!pkCV) return;
    var n = $('packOutputName').value || 'sheet';
    pkCV.toBlob(function (b) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(b);
        a.download = n + '.png';
        a.click();
    });
}

function dlPackPlist() {
    if (!pkPL) return;
    var n = $('packOutputName').value || 'sheet',
        b = new Blob([pkPL], {
            type: 'application/xml'
        });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = n + '.plist';
    a.click();
}

async function dlPackBoth() {
    if (!pkCV || !pkPL) return;
    toast('Creating ZIP...', 'info');
    var n = $('packOutputName').value || 'sheet',
        pb = await new Promise(function (r) {
            pkCV.toBlob(r, 'image/png');
        }),
        plb = new Blob([pkPL], {
            type: 'application/xml'
        }),
        zb = await createZip([{
            name: n + '.png',
            blob: pb
        }, {
            name: n + '.plist',
            blob: plb
        }]);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(zb);
    a.download = n + '.zip';
    a.click();
    toast('Downloaded', 'success');
}

function clearPacker() {
    pkFiles = [];
    pkCV = null;
    pkPL = '';
    pkIsIcon = false;
    scEn = false;
    scVal = 1;
    $('packFileInput').value = '';
    $('packFileList').innerHTML = '';
    $('packUploadBox').classList.remove('has-files');
    $('packLog').innerHTML = '';
    $('packLog').classList.remove('visible');
    $('packResults').classList.remove('visible');
    $('packProg').classList.remove('visible');
    $('packProgBar').style.width = '0%';
    $('packInfoWrap').style.display = 'none';
    $('packIconBadge').innerHTML = '';
    $('packOutputName').value = 'GJ_CustomSheet-uhd';
    $('geodeEnabled').checked = false;
    $('geodeModId').value = '';
    $('scaleEnabled').checked = false;
    toggleGeode();
    toggleScale();
    $('scalePanel').querySelectorAll('.scale-option').forEach(function (b, i) {
        b.classList.toggle('active', !i);
    });
    toast('Cleared', 'info');
}
setupUpload($('packUploadBox'), $('packFileInput'), handlePkFiles);
$('packOutputName').addEventListener('input', function () {
    scBase = this.value.replace(/-(uhd|hd)$/i, '');
});

// ═══════ PREVIEW ═══════
var pvPlist = null,
    pvImg = null,
    pvSel = null,
    pvAll = [],
    pvOv = {},
    pvNW = 0,
    pvNH = 0,
    pvPF = null,
    pvIF = null;

function handlePvFiles(files) {
    Array.from(files).forEach(function (f) {
        if (f.name.endsWith('.plist')) loadPvPlist(f);
        else if (f.name.endsWith('.png') || f.type === 'image/png') loadPvPng(f);
    });
}

function loadPvPlist(f) {
    pvPF = f;
    updPvTags();
    var r = new FileReader();
    r.onload = function (e) {
        try {
            pvPlist = parsePlist(e.target.result);
            var n = Object.keys(pvPlist.frames).length;
            $('prevInfoText').textContent = n + ' sprites';
            $('prevInfoWrap').style.display = 'block';
            toast(n + ' sprites', 'success');
            tryPv();
        } catch (err) {
            toast('Invalid plist', 'error');
            pvPlist = null;
        }
    };
    r.readAsText(f);
}

function loadPvPng(f) {
    pvIF = f;
    updPvTags();
    var img = new Image();
    img.onload = function () {
        pvImg = img;
        pvNW = img.naturalWidth;
        pvNH = img.naturalHeight;
        toast('Image: ' + img.width + '×' + img.height, 'success');
        tryPv();
    };
    img.onerror = function () {
        toast('Failed', 'error');
    };
    img.src = URL.createObjectURL(f);
}

function updPvTags() {
    var h = '';
    if (pvPF) h += '<span class="upload-file-tag tag-plist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' + pvPF.name + '</span>';
    if (pvIF) h += '<span class="upload-file-tag tag-png"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>' + pvIF.name + '</span>';
    $('prevFilesTags').innerHTML = h;
    $('prevUploadBox').classList.toggle('has-files', !!(pvPF || pvIF));
}

function tryPv() {
    if (!pvPlist || !pvImg) return;
    buildPv();
}

function buildPv() {
    var wrap = $('prevViewerWrap');
    wrap.innerHTML = '';
    $('prevEmptyWrap').style.display = 'none';
    $('prevLayout').style.display = 'grid';
    $('prevDetail').classList.remove('visible');
    $('prevSidebarEmpty').style.display = 'flex';
    var bi = document.createElement('img');
    bi.src = pvImg.src;
    bi.className = 'preview-base-img';
    wrap.appendChild(bi);
    var fr = pvPlist.frames,
        nms = Object.keys(fr),
        pfx = detectPrefix(fr);
    pvAll = [];
    pvOv = {};
    var info = nms.length + ' sprites — ' + pvNW + '×' + pvNH + 'px';
    if (pfx) info += ' — Geode: "' + pfx.slice(0, -1) + '"';
    $('prevInfoText').textContent = info;

    var makeOv = function () {
        wrap.querySelectorAll('.preview-sprite-overlay').forEach(function (e) {
            e.remove();
        });
        pvOv = {};
        pvAll = [];
        var dw = bi.clientWidth,
            dh = bi.clientHeight;
        if (!dw || !dh) return;
        var sx = dw / pvNW,
            sy = dh / pvNH;
        nms.forEach(function (rn) {
            var f = fr[rn],
                cn = stripPfx(rn, pfx);
            pvAll.push({
                rn: rn,
                f: f,
                cn: cn,
                pfx: pfx
            });
            var tw = f.rot ? f.h : f.w,
                th = f.rot ? f.w : f.h;
            var ov = document.createElement('div');
            ov.className = 'preview-sprite-overlay';
            ov.style.left = (f.x * sx) + 'px';
            ov.style.top = (f.y * sy) + 'px';
            ov.style.width = (tw * sx) + 'px';
            ov.style.height = (th * sy) + 'px';
            ov.dataset.rn = rn;
            var tt = document.createElement('div');
            tt.className = 'preview-sprite-tooltip';
            tt.innerHTML = '<span class="tooltip-name">' + cn + '</span><span class="tooltip-size">' + f.w + '×' + f.h + (f.rot ? ' (R)' : '') + '</span>';
            ov.appendChild(tt);
            ov.addEventListener('click', function () {
                selectPv(rn);
            });
            pvOv[rn] = ov;
            wrap.appendChild(ov);
        });
    };
    if (bi.complete) requestAnimationFrame(makeOv);
    else bi.onload = function () {
        requestAnimationFrame(makeOv);
    };
}

function selectPv(rn) {
    var sp = pvAll.find(function (s) {
        return s.rn === rn;
    });
    if (!sp) return;
    var f = sp.f,
        cn = sp.cn;
    Object.keys(pvOv).forEach(function (k) {
        pvOv[k].classList.toggle('selected-overlay', k === rn);
    });
    var tw = f.rot ? f.h : f.w,
        th = f.rot ? f.w : f.h,
        ks = (f.sw && f.sh && (f.sw !== f.w || f.sh !== f.h));
    var cv = document.createElement('canvas');
    cv.width = f.sw || f.w;
    cv.height = f.sh || f.h;
    var ctx = cv.getContext('2d');
    if (f.rot) {
        var tmp = document.createElement('canvas');
        tmp.width = tw;
        tmp.height = th;
        tmp.getContext('2d').drawImage(pvImg, f.x, f.y, tw, th, 0, 0, tw, th);
        var rot = document.createElement('canvas');
        rot.width = f.w;
        rot.height = f.h;
        var rc = rot.getContext('2d');
        rc.translate(f.w / 2, f.h / 2);
        rc.rotate(-Math.PI / 2);
        rc.drawImage(tmp, -tw / 2, -th / 2);
        if (ks) ctx.drawImage(rot, (cv.width - f.w) / 2 + (f.ox || 0), (cv.height - f.h) / 2 - (f.oy || 0));
        else ctx.drawImage(rot, 0, 0);
    } else {
        if (ks) ctx.drawImage(pvImg, f.x, f.y, f.w, f.h, (cv.width - f.w) / 2 + (f.ox || 0), (cv.height - f.h) / 2 - (f.oy || 0), f.w, f.h);
        else ctx.drawImage(pvImg, f.x, f.y, f.w, f.h, 0, 0, f.w, f.h);
    }
    cv.toBlob(function (blob) {
        pvSel = {
            name: cn,
            blob: blob,
            cv: cv
        };
        $('prevSidebarEmpty').style.display = 'none';
        $('prevDetail').classList.add('visible');
        var th = $('prevThumb');
        th.innerHTML = '';
        var im = document.createElement('img');
        im.src = URL.createObjectURL(blob);
        th.appendChild(im);
        $('prevName').textContent = cn;
        var mh = '<span>' + cv.width + ' × ' + cv.height + ' px</span><span>' + fsize(blob.size) + '</span>';
        if (f.rot) mh += '<span style="color:var(--orange)">Rotated in sheet</span>';
        $('prevMeta').innerHTML = mh;
    }, 'image/png');
}

function dlPrevSprite() {
    if (!pvSel) return;
    var a = document.createElement('a');
    a.href = URL.createObjectURL(pvSel.blob);
    a.download = pvSel.name;
    a.click();
}

function clearPreview() {
    pvPlist = null;
    pvImg = null;
    pvSel = null;
    pvAll = [];
    pvOv = {};
    pvNW = 0;
    pvNH = 0;
    pvPF = null;
    pvIF = null;
    $('prevFileInput').value = '';
    $('prevFilesTags').innerHTML = '';
    $('prevUploadBox').classList.remove('has-files');
    $('prevInfoWrap').style.display = 'none';
    $('prevLayout').style.display = 'none';
    $('prevEmptyWrap').style.display = 'block';
    $('prevViewerWrap').innerHTML = '';
    $('prevDetail').classList.remove('visible');
    $('prevSidebarEmpty').style.display = 'flex';
    toast('Cleared', 'info');
}
setupUpload($('prevUploadBox'), $('prevFileInput'), handlePvFiles);
var rzt;
window.addEventListener('resize', function () {
    clearTimeout(rzt);
    rzt = setTimeout(function () {
        if (pvPlist && pvImg) buildPv();
    }, 200);
});

// ═══════ ZIP ═══════
async function createZip(files) {
    var lh = [],
        ce = [],
        ld = [],
        off = 0;
    for (var i = 0; i < files.length; i++) {
        var d = new Uint8Array(await files[i].blob.arrayBuffer()),
            nb = new TextEncoder().encode(files[i].name),
            cr = crc32(d);
        var l = new ArrayBuffer(30 + nb.length),
            lv = new DataView(l);
        lv.setUint32(0, 0x04034b50, true);
        lv.setUint16(4, 20, true);
        lv.setUint32(14, cr, true);
        lv.setUint32(18, d.length, true);
        lv.setUint32(22, d.length, true);
        lv.setUint16(26, nb.length, true);
        new Uint8Array(l).set(nb, 30);
        var c = new ArrayBuffer(46 + nb.length),
            cv = new DataView(c);
        cv.setUint32(0, 0x02014b50, true);
        cv.setUint16(4, 20, true);
        cv.setUint16(6, 20, true);
        cv.setUint32(16, cr, true);
        cv.setUint32(20, d.length, true);
        cv.setUint32(24, d.length, true);
        cv.setUint16(28, nb.length, true);
        cv.setUint32(38, 32, true);
        cv.setUint32(42, off, true);
        new Uint8Array(c).set(nb, 46);
        ce.push(new Uint8Array(c));
        lh.push(new Uint8Array(l));
        ld.push(d);
        off += l.byteLength + d.length;
    }
    var co = off,
        cs = 0;
    ce.forEach(function (e) {
        cs += e.length;
    });
    var er = new ArrayBuffer(22),
        ev = new DataView(er);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, files.length, true);
    ev.setUint16(10, files.length, true);
    ev.setUint32(12, cs, true);
    ev.setUint32(16, co, true);
    var parts = [];
    for (var j = 0; j < lh.length; j++) {
        parts.push(lh[j]);
        parts.push(ld[j]);
    }
    ce.forEach(function (e) {
        parts.push(e);
    });
    parts.push(new Uint8Array(er));
    return new Blob(parts, {
        type: 'application/zip'
    });
}

function crc32(d) {
    var c = 0xFFFFFFFF;
    if (!crc32.t) {
        crc32.t = [];
        for (var i = 0; i < 256; i++) {
            var v = i;
            for (var j = 0; j < 8; j++) v = (v & 1) ? (0xEDB88320 ^ (v >>> 1)) : (v >>> 1);
            crc32.t.push(v);
        }
    }
    for (var k = 0; k < d.length; k++) c = crc32.t[(c ^ d[k]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

$('modalBackdrop').addEventListener('click', function (e) {
    if (e.target === e.currentTarget) closeModal();
});
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});