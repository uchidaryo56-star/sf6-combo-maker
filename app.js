/* =====================================================================
 * SF6 コンパニオン  アプリ本体
 *  - ユーザーデータ(お気に入り/練習チェック/追加コンボ/メモ等)は
 *    localStorage に保存（ログイン不要・このブラウザのみ）
 * ===================================================================*/

const LS_KEY = "sf6companion.v1";
let store = loadStore();
let currentChar = SF6_DATA.characters[0].id;
let comboFilter = "全て";

function loadStore(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function saveStore(){ localStorage.setItem(LS_KEY, JSON.stringify(store)); }
function ns(key){ // キャラ別ネームスペース
  store[currentChar] = store[currentChar] || {};
  store[currentChar][key] = store[currentChar][key] || (key==="notes"?[]:{});
  if(key==="userCombos"||key==="userSetplays") store[currentChar][key] = store[currentChar][key] || [];
  return store[currentChar][key];
}
function gns(key){ // キャラに依存しない全体共通のネームスペース（用語集など）
  store._global = store._global || {};
  store._global[key] = store._global[key] || (key==="glossaryUser"?[]:{});
  return store._global[key];
}

/* -------- キャラセレクタ＆タブ -------- */
function initChars(){
  const sel = document.getElementById("charSelect");
  sel.innerHTML = SF6_DATA.characters.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
  sel.value = currentChar;
  sel.onchange = ()=>{ currentChar = sel.value; renderAll(); };
}
document.querySelectorAll(".tab").forEach(t=>{
  t.onclick = ()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    document.getElementById("view-"+t.dataset.view).classList.add("active");
  };
});

/* ============ コンボ ============ */
function allCombos(){
  const base = SF6_DATA.combos[currentChar] || [];
  const user = store[currentChar] && store[currentChar].userCombos ? store[currentChar].userCombos : [];
  return [...base, ...user];
}
function comboStartCategories(){
  const set = new Set(["全て"]);
  allCombos().forEach(c=>set.add(c.start));
  return [...set];
}
function renderComboFilters(){
  const wrap = document.getElementById("comboFilters");
  wrap.innerHTML = comboStartCategories().map(cat=>
    `<span class="chip ${cat===comboFilter?'active':''}" data-cat="${cat}">${cat}</span>`).join("");
  wrap.querySelectorAll(".chip").forEach(ch=>{
    ch.onclick = ()=>{ comboFilter = ch.dataset.cat; renderComboFilters(); renderCombos(); };
  });
}
function renderCombos(){
  const favs = ns("favCombos");
  const done = ns("doneCombos");
  const favOnly = document.getElementById("favOnly").checked;
  let list = allCombos();
  if(comboFilter!=="全て") list = list.filter(c=>c.start===comboFilter);
  if(favOnly) list = list.filter(c=>favs[c.id]);

  const el = document.getElementById("comboList");
  if(!list.length){ el.innerHTML = `<div class="empty">該当するコンボがありません</div>`; return; }

  el.innerHTML = list.map(c=>{
    const isUser = c.id.startsWith("u-");
    const media = hasMedia("comboVideos", c);
    return `<div class="card">
      <div class="card-head">
        <span class="star ${favs[c.id]?'on':''}" data-fav="${c.id}">★</span>
        <h3>${esc(c.name)}</h3>
        <span class="badge">${esc(c.start)}</span>
        <span class="badge">${esc(c.position||"中央")}</span>
        <span class="stars" title="難易度">${"●".repeat(c.difficulty||1)}${"○".repeat(5-(c.difficulty||1))}</span>
      </div>
      <div class="notation">${esc(c.notation)}</div>
      <div class="stats">
        <span>ダメージ <b>${c.damage??"-"}</b></span>
        <span>Dゲージ <b>${c.drive??0}</b></span>
        <span>SAゲージ <b>${c.super??0}</b></span>
      </div>
      ${c.note?`<div class="note">${esc(c.note)}</div>`:""}
      ${mediaHTML("comboVideos", c)}
      <div class="row-actions">
        <label class="check"><input type="checkbox" data-done="${c.id}" ${done[c.id]?"checked":""}> 練習済み</label>
        <button class="ghost" data-vidfile="${c.id}">📁 動画ファイル</button>
        <button class="ghost" data-vidurl="${c.id}">🔗 URL</button>
        ${media?`<button class="ghost" data-vidclear="${c.id}">動画を消す</button>`:""}
        ${isUser?`<button class="danger" data-delcombo="${c.id}">削除</button>`:""}
      </div>
    </div>`;
  }).join("");

  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("comboVideos", b.dataset.vidfile, renderCombos));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("comboVideos", list.find(x=>x.id===b.dataset.vidurl), renderCombos));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("comboVideos", b.dataset.vidclear, renderCombos));
  el.querySelectorAll("[data-fav]").forEach(s=>s.onclick=()=>{
    const id=s.dataset.fav; favs[id]=!favs[id]; saveStore(); renderCombos();
  });
  el.querySelectorAll("[data-done]").forEach(c=>c.onchange=()=>{
    done[c.dataset.done]=c.checked; saveStore();
  });
  el.querySelectorAll("[data-delcombo]").forEach(b=>b.onclick=()=>{
    store[currentChar].userCombos = store[currentChar].userCombos.filter(x=>x.id!==b.dataset.delcombo);
    saveStore(); renderComboFilters(); renderCombos();
  });
}
document.getElementById("favOnly").onchange = renderCombos;
document.getElementById("addCombo").onclick = ()=>{
  const name = prompt("コンボ名"); if(!name) return;
  const start = prompt("始動カテゴリ（例: 通常ヒット / パニッシュカウンター / ドライブラッシュ）","通常ヒット")||"その他";
  const notation = prompt("入力（例: 2中K > 弱波動拳）")||"";
  const damage = parseInt(prompt("ダメージ","2000"))||0;
  const video = prompt("動画URL（YouTube等・任意）")||"";
  store[currentChar] = store[currentChar]||{};
  store[currentChar].userCombos = store[currentChar].userCombos||[];
  store[currentChar].userCombos.push({
    id:"u-"+Date.now(), name, start, notation, damage, drive:0, super:0,
    difficulty:1, position:"中央", video, note:"（自作）"
  });
  saveStore(); renderComboFilters(); renderCombos();
};

/* ============ フレーム ============ */
let frameSort = null; // null = 公式ページの掲載順を維持
function renderFrames(){
  const orig = SF6_DATA.frames[currentChar]||[];
  const data = orig.slice();
  if(frameSort){
    data.sort((a,b)=>{
      let x=a[frameSort.key], y=b[frameSort.key];
      // 数値優先で比較、欠損(null)は末尾へ
      const xn=typeof x==="number", yn=typeof y==="number";
      if(xn&&yn) return frameSort.asc? x-y : y-x;
      if(xn) return -1; if(yn) return 1;
      x=String(x??""); y=String(y??"");
      return frameSort.asc? x.localeCompare(y): y.localeCompare(x);
    });
  }
  const tb = document.querySelector("#frameTable tbody");
  const m = "color:var(--muted);font-size:14px";
  tb.innerHTML = data.map(f=>`<tr data-fi="${orig.indexOf(f)}">
    <td>${esc(f.move)}</td><td style="${m}">${esc(f.type)}</td>
    <td>${f.startup??"-"}</td>
    <td style="${m}">${esc(f.active||"-")}</td>
    <td style="${m}">${esc(f.recovery||"-")}</td>
    <td class="${cls(f.onHit)}">${fmt(f.onHit)}</td>
    <td class="${cls(f.onBlock)}">${fmt(f.onBlock)}</td>
    <td style="${m}">${esc(f.cancel||"-")}</td>
    <td>${esc(f.damage||"-")}</td>
    <td style="${m}">${esc(f.comboCorrect||"-")}</td>
    <td style="${m}">${esc(f.driveGain||"-")}</td>
    <td style="${m}">${esc(f.driveLoseGuard||"-")}</td>
    <td style="${m}">${esc(f.driveLosePunish||"-")}</td>
    <td style="${m}">${esc(f.saGain||"-")}</td>
    <td style="${m}">${esc(f.attribute||"-")}</td>
    <td style="color:var(--muted);font-size:13px">${esc(f.note||"")}</td>
  </tr>`).join("");
  renderPunish();
}
function cls(n){ if(typeof n!=="number") return "zero"; return n>0?"pos":(n<0?"neg":"zero"); }
function fmt(n){ if(n==null||n==="") return "-"; if(typeof n!=="number") return esc(n); return n>0?("+"+n):(""+n); }

// 確反候補にする技：地上の打撃/投げ技で発生が数値のもの
//   除外: ジャンプ技・共通システム・当身技（noteに「当身」を含む＝それ自体では確定反撃にならない）
function punishMoves(){
  const okType = ["通常技","特殊技","必殺技","スーパーアーツ"];
  const frames = SF6_DATA.frames[currentChar]||[];
  return frames
    .map((f,idx)=>({f, idx}))
    .filter(({f})=>typeof f.startup==="number" && okType.includes(f.type)
      && !/ジャンプ/.test(f.move) && !/当身/.test(f.note||""))
    .sort((a,b)=>a.f.startup-b.f.startup);
}
function renderPunish(){
  const guard = parseInt(document.getElementById("punishFrame").value);
  const gap = isNaN(guard)? null : -guard;        // 相手の不利F（=こちらの猶予）
  const moves = punishMoves();
  const res = document.getElementById("punishResult");
  const sum = document.getElementById("punishSummary");
  if(gap==null){ sum.innerHTML="硬直差を入力してください"; res.innerHTML=""; return; }

  const judged = moves.map(({f,idx})=>({f, idx, adv: gap - f.startup}));
  const okCount = judged.filter(j=>j.adv>=0).length;
  sum.innerHTML = gap>=0
    ? `この硬直差なら <b>${okCount}</b> 個の技で確定反撃できます（猶予 ${gap}F）。技をクリックすると下の表の該当行へ移動します。`
    : `相手は有利フレーム（${gap}F）。基本的に確定反撃は入りません。`;

  res.innerHTML = judged.map(({f,idx,adv})=>{
    const okk = adv>=0;
    const meta = okk ? `発生${f.startup}F ・ 猶予+${adv}` : `発生${f.startup}F ・ ${adv}`;
    return `<div class="pmove ${okk?'ok':'ng'}" title="${esc(f.move)}" ${okk?`data-goto="${idx}"`:""}>
      <span class="pname">${esc(f.move)}</span>
      <span class="pmeta">${meta}</span>
    </div>`;
  }).join("") || `<div class="empty">確反に使える技がありません</div>`;

  res.querySelectorAll("[data-goto]").forEach(el=>el.onclick=()=>gotoFrameRow(el.dataset.goto));
}
// フレーム表の該当行へスクロール＆ハイライト
function gotoFrameRow(idx){
  const tr = document.querySelector(`#frameTable tbody tr[data-fi="${idx}"]`);
  if(!tr) return;
  tr.scrollIntoView({behavior:"smooth", block:"center"});
  tr.classList.remove("flash"); void tr.offsetWidth; tr.classList.add("flash");
}
document.querySelectorAll("#frameTable th[data-sort]").forEach(th=>{
  th.onclick = ()=>{
    const k=th.dataset.sort;
    if(!frameSort || frameSort.key!==k) frameSort = {key:k, asc:true};      // 昇順
    else if(frameSort.asc) frameSort = {key:k, asc:false};                  // 降順
    else frameSort = null;                                                  // 公式順に戻す
    renderFrames();
  };
});
document.getElementById("punishFrame").oninput = renderPunish;

/* ============ セットプレイ ============ */
function allSetplays(){
  const base = SF6_DATA.setplays[currentChar]||[];
  const user = store[currentChar] && store[currentChar].userSetplays ? store[currentChar].userSetplays : [];
  return [...base, ...user];
}
function renderSetplays(){
  const list = allSetplays();
  const el = document.getElementById("setplayList");
  if(!list.length){ el.innerHTML=`<div class="empty">セットプレイがありません</div>`; return; }
  el.innerHTML = list.map(s=>{
    const isUser = s.id.startsWith("u-");
    const media = hasMedia("setplayVideos", s);
    return `<div class="card">
      <div class="card-head"><h3>${esc(s.situation)}</h3>
        ${s.timestamp?`<span class="badge">⏱ ${esc(s.timestamp)}</span>`:""}</div>
      <div class="stats"><span>手順 <b>${esc(s.setup)}</b></span></div>
      <div class="stats"><span>択 <b>${esc(s.mixup)}</b></span></div>
      ${s.note?`<div class="note">${esc(s.note)}</div>`:""}
      ${mediaHTML("setplayVideos", s)}
      <div class="row-actions">
        <button class="ghost" data-vidfile="${s.id}">📁 動画ファイル</button>
        <button class="ghost" data-vidurl="${s.id}">🔗 URL</button>
        ${media?`<button class="ghost" data-vidclear="${s.id}">動画を消す</button>`:""}
        ${isUser?`<button class="danger" data-delsp="${s.id}">削除</button>`:""}</div>
    </div>`;
  }).join("");
  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("setplayVideos", b.dataset.vidfile, renderSetplays));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("setplayVideos", list.find(x=>x.id===b.dataset.vidurl), renderSetplays));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("setplayVideos", b.dataset.vidclear, renderSetplays));
  el.querySelectorAll("[data-delsp]").forEach(b=>b.onclick=()=>{
    store[currentChar].userSetplays = store[currentChar].userSetplays.filter(x=>x.id!==b.dataset.delsp);
    saveStore(); renderSetplays();
  });
}
document.getElementById("addSetplay").onclick = ()=>{
  const situation = prompt("状況（例: 端 強昇龍ダウン後）"); if(!situation) return;
  const setup = prompt("手順（例: 前ステ x2）")||"";
  const mixup = prompt("択（例: 打撃 / 投げ）")||"";
  const video = prompt("動画URL（任意）")||"";
  const timestamp = video? (prompt("動画の時間（例: 1:23）")||"") : "";
  store[currentChar] = store[currentChar]||{};
  store[currentChar].userSetplays = store[currentChar].userSetplays||[];
  store[currentChar].userSetplays.push({id:"u-"+Date.now(),situation,setup,mixup,video,timestamp,note:"（自作）"});
  saveStore(); renderSetplays();
};

/* ============ マッチアップメモ ============ */
function renderNotes(){
  const notes = ns("notes");
  const el = document.getElementById("noteList");
  if(!notes.length){ el.innerHTML=`<div class="empty">まだメモがありません</div>`; return; }
  el.innerHTML = notes.map((n,i)=>`<div class="card">
    <div class="card-head"><h3>対 ${esc(n.opponent)}</h3>
      <span class="badge">${esc(n.date)}</span></div>
    <div class="note" style="white-space:pre-wrap;color:var(--text)">${esc(n.body)}</div>
    <div class="row-actions"><button class="danger" data-delnote="${i}">削除</button></div>
  </div>`).join("");
  el.querySelectorAll("[data-delnote]").forEach(b=>b.onclick=()=>{
    notes.splice(parseInt(b.dataset.delnote),1); saveStore(); renderNotes();
  });
}
document.getElementById("saveNote").onclick = ()=>{
  const opp = document.getElementById("noteOpponent").value.trim();
  const body = document.getElementById("noteBody").value.trim();
  if(!opp||!body){ alert("相手キャラ名とメモを入力してください"); return; }
  const notes = ns("notes");
  notes.unshift({opponent:opp, body, date:new Date().toLocaleDateString("ja-JP")});
  saveStore();
  document.getElementById("noteOpponent").value="";
  document.getElementById("noteBody").value="";
  renderNotes();
};

/* ============ 用語集 ============ */
// 初期データ(glossary.js) + ブラウザに保存した 追加/編集/削除 をマージして返す
// builtin項目は id="b-<index>"、自作項目は id="u-<timestamp>"
function allGlossaryRaw(){
  const builtinSrc = typeof SF6_GLOSSARY!=="undefined" ? SF6_GLOSSARY : [];
  const edits   = gns("glossaryEdits");
  const deleted = gns("glossaryDeleted");
  const builtin = builtinSrc
    .map((t,i)=>({...t, id:"b-"+i, builtin:true}))
    .filter(t=>!deleted[t.id])
    .map(t=> edits[t.id] ? {...t, ...edits[t.id]} : t);
  const user = gns("glossaryUser").map(t=>({...t, builtin:false}));
  return [...builtin, ...user];
}
function isGlossaryModified(t){ return t.builtin && !!gns("glossaryEdits")[t.id]; }

let glossaryCat = "全て";
function glossaryCats(){
  const set = new Set(["全て"]);
  allGlossaryRaw().forEach(t=>set.add(t.cat));
  return [...set];
}
function renderGlossaryFilters(){
  const wrap = document.getElementById("glossaryFilters");
  wrap.innerHTML = glossaryCats().map(c=>
    `<span class="chip ${c===glossaryCat?'active':''}" data-gcat="${c}">${c}</span>`).join("");
  wrap.querySelectorAll(".chip").forEach(ch=>ch.onclick=()=>{
    glossaryCat = ch.dataset.gcat; renderGlossaryFilters(); renderGlossary();
  });
}
function hl(text, q){
  if(!q) return esc(text);
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i<0) return esc(text);
  return esc(text.slice(0,i))+"<mark>"+esc(text.slice(i,i+q.length))+"</mark>"+esc(text.slice(i+q.length));
}
function renderGlossary(){
  const all = allGlossaryRaw();
  const q = (document.getElementById("glossarySearch").value||"").trim();
  const ql = q.toLowerCase();
  let list = all;
  if(glossaryCat!=="全て") list = list.filter(t=>t.cat===glossaryCat);
  if(ql) list = list.filter(t=>
    (t.term+" "+(t.read||"")+" "+t.def).toLowerCase().includes(ql));

  // 非表示にした(削除した)既定の用語があれば、個別に復元できるよう案内する
  const hidden = document.getElementById("glossaryHidden");
  const deletedIds = Object.keys(gns("glossaryDeleted"));
  if(deletedIds.length){
    const builtinSrc = typeof SF6_GLOSSARY!=="undefined" ? SF6_GLOSSARY : [];
    const names = builtinSrc.map((t,i)=>({...t, id:"b-"+i})).filter(t=>deletedIds.includes(t.id));
    hidden.style.display = "block";
    hidden.innerHTML = `非表示にした既定の用語（${names.length}件）: ` +
      names.map(t=>`<button class="ghost" data-grestore="${t.id}" style="margin:2px">${esc(t.term)} を復元</button>`).join(" ");
    hidden.querySelectorAll("[data-grestore]").forEach(b=>b.onclick=()=>{
      delete gns("glossaryDeleted")[b.dataset.grestore]; saveStore(); renderGlossaryFilters(); renderGlossary();
    });
  } else { hidden.style.display="none"; hidden.innerHTML=""; }

  const el = document.getElementById("glossaryList");
  if(!list.length){ el.innerHTML=`<div class="empty">該当する用語がありません</div>`; return; }
  el.innerHTML = list.map(t=>`<div class="card">
    <div class="term">
      <span class="term-name">${hl(t.term,q)}</span>
      ${t.read?`<span class="term-read">${hl(t.read,q)}</span>`:""}
      <span class="badge">${esc(t.cat)}</span>
      ${isGlossaryModified(t)?`<span class="badge" style="color:var(--warn);border-color:var(--warn)">編集済み</span>`:""}
      ${!t.builtin?`<span class="badge" style="color:var(--accent2);border-color:var(--accent2)">自作</span>`:""}
    </div>
    <div class="term-def">${hl(t.def,q)}</div>
    <div class="row-actions">
      <button class="ghost" data-gedit="${t.id}">✎ 編集</button>
      <button class="danger" data-gdel="${t.id}">削除</button>
      ${isGlossaryModified(t)?`<button class="ghost" data-greset="${t.id}">↺ 元に戻す</button>`:""}
    </div>
  </div>`).join("");

  el.querySelectorAll("[data-gedit]").forEach(b=>b.onclick=()=>editGlossaryTerm(list.find(x=>x.id===b.dataset.gedit)));
  el.querySelectorAll("[data-gdel]").forEach(b=>b.onclick=()=>deleteGlossaryTerm(list.find(x=>x.id===b.dataset.gdel)));
  el.querySelectorAll("[data-greset]").forEach(b=>b.onclick=()=>{
    delete gns("glossaryEdits")[b.dataset.greset]; saveStore(); renderGlossaryFilters(); renderGlossary();
  });
}
function editGlossaryTerm(item){
  if(!item) return;
  const term = prompt("用語名", item.term); if(term===null||term.trim()==="") return;
  const read = prompt("読み・別名（検索用、任意）", item.read||"");
  if(read===null) return;
  const cat = prompt("カテゴリ（例: システム / 攻め / 守り / 立ち回り / コンボ / フレーム / 表記）", item.cat);
  if(cat===null||cat.trim()==="") return;
  const def = prompt("意味の説明", item.def); if(def===null||def.trim()==="") return;
  const patch = {term:term.trim(), read:read.trim(), cat:cat.trim(), def:def.trim()};
  if(item.builtin){
    gns("glossaryEdits")[item.id] = patch;
  } else {
    const list = gns("glossaryUser");
    const idx = list.findIndex(x=>x.id===item.id);
    if(idx>=0) list[idx] = {...list[idx], ...patch};
  }
  saveStore(); renderGlossaryFilters(); renderGlossary();
}
function deleteGlossaryTerm(item){
  if(!item) return;
  if(!confirm(`「${item.term}」を削除しますか？`)) return;
  if(item.builtin){
    gns("glossaryDeleted")[item.id] = true;   // 既定データ自体は残し、表示だけ非表示にする
  } else {
    const list = gns("glossaryUser");
    const idx = list.findIndex(x=>x.id===item.id);
    if(idx>=0) list.splice(idx,1);
  }
  saveStore(); renderGlossaryFilters(); renderGlossary();
}
document.getElementById("addGlossary").onclick = ()=>{
  const term = prompt("用語名"); if(!term) return;
  const read = prompt("読み・別名（検索用、任意）")||"";
  const cat = prompt("カテゴリ（例: システム / 攻め / 守り / 立ち回り / コンボ / フレーム / 表記）","自作")||"自作";
  const def = prompt("意味の説明")||"";
  gns("glossaryUser").push({id:"u-"+Date.now(), term:term.trim(), read:read.trim(), cat:cat.trim(), def:def.trim()});
  saveStore(); renderGlossaryFilters(); renderGlossary();
};

/* ============ 初心者ガイド ============ */
function renderGuide(){
  const steps = (typeof SF6_GUIDE!=="undefined" ? SF6_GUIDE : []).slice().sort((a,b)=>a.order-b.order);
  const el = document.getElementById("guideList");
  if(!steps.length){ el.innerHTML = `<div class="empty">ガイドがありません</div>`; return; }
  el.innerHTML = steps.map(s=>{
    const media = hasMedia("guideVideos", s);
    return `<div class="card guide-card">
      <div class="guide-num">${s.order}</div>
      <div class="guide-body">
        <div class="card-head"><h3>${esc(s.title)}</h3><span class="badge">${esc(s.summary||"")}</span></div>
        <p>${esc(s.body||"")}</p>
        ${s.diagram?`<div class="guide-diagram">${s.diagram}</div>`:""}
        ${mediaHTML("guideVideos", s)}
        <div class="row-actions">
          ${s.relatedView?`<button class="ghost" data-gotoview="${esc(s.relatedView)}">→ ${esc(s.relatedLabel||"関連タブを開く")}</button>`:""}
          <button class="ghost" data-vidfile="${s.id}">📁 動画ファイル</button>
          <button class="ghost" data-vidurl="${s.id}">🔗 URL</button>
          ${media?`<button class="ghost" data-vidclear="${s.id}">動画を消す</button>`:""}
        </div>
      </div>
    </div>`;
  }).join("");

  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("guideVideos", b.dataset.vidfile, renderGuide));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("guideVideos", steps.find(x=>x.id===b.dataset.vidurl), renderGuide));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("guideVideos", b.dataset.vidclear, renderGuide));
  el.querySelectorAll("[data-gotoview]").forEach(b=>b.onclick=()=>{
    const tab = document.querySelector(`.tab[data-view="${b.dataset.gotoview}"]`);
    if(tab) tab.click();
  });
}

/* -------- ユーティリティ -------- */
function esc(s){ return String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m])); }

/* -------- 動画 -------- */
// "1:23" や "83" → 秒
function tsToSec(ts){
  if(!ts) return 0;
  ts=String(ts).trim();
  if(/^\d+$/.test(ts)) return parseInt(ts);
  const p=ts.split(":").map(Number);
  if(p.some(isNaN)) return 0;
  return p.reduce((a,n)=>a*60+n,0);
}
function parseVideo(url){
  if(!url) return null;
  url=String(url).trim();
  const m=url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if(m){
    let start=0;
    const t1=url.match(/[?&](?:t|start)=(\d+)/);
    const t2=url.match(/[?&]t=(?:(\d+)h)?(?:(\d+)m)?(\d+)s/);
    if(t2) start=(+(t2[1]||0))*3600+(+(t2[2]||0))*60+ +t2[3];
    else if(t1) start=+t1[1];
    return {type:"yt", id:m[1], start};
  }
  if(/\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url)) return {type:"file", url};
  return {type:"link", url};
}
// カード内に表示する動画HTML（YouTubeはサムネ→クリック再生）
function videoHTML(url, ts){
  const v=parseVideo(url); if(!v) return "";
  if(v.type==="yt"){
    const start = ts ? tsToSec(ts) : (v.start||0);
    const thumb=`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    return `<div class="video-wrap"><div class="video-embed" data-yt="${v.id}" data-start="${start}">
      <img src="${thumb}" alt="" loading="lazy" onerror="this.style.opacity=.2"><div class="play">▶</div></div></div>`;
  }
  if(v.type==="file") return `<div class="video-wrap"><video src="${esc(v.url)}" controls preload="metadata"></video></div>`;
  return `<div class="video-wrap"><a class="link" href="${esc(v.url)}" target="_blank">▶ 動画を開く（埋め込み非対応のリンク）</a></div>`;
}
// サムネクリックで iframe 再生に差し替え
function attachVideoHandlers(container){
  container.querySelectorAll(".video-embed[data-yt]").forEach(el=>el.onclick=()=>{
    const id=el.dataset.yt, start=el.dataset.start||0;
    const f=document.createElement("iframe");
    f.src=`https://www.youtube-nocookie.com/embed/${id}?start=${start}&autoplay=1&rel=0`;
    f.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    f.allowFullscreen=true;
    el.replaceWith(f);
  });
}
// "comboVideos"/"setplayVideos" はキャラ別、"guideVideos" はキャラに依存しない全体共通
const GLOBAL_VIDEO_KINDS = new Set(["guideVideos"]);
function videoStore(kind){ return GLOBAL_VIDEO_KINDS.has(kind) ? gns(kind) : ns(kind); }

// 動画URLの上書き保存（シードカードにも後から動画を付けられる）
function videoOf(kind, item){
  const ov = videoStore(kind);
  return (item.id in ov) ? ov[item.id] : (item.video||"");
}
function editVideo(kind, item, after){
  const cur = videoOf(kind, item);
  const url = prompt("動画URL（YouTube / mp4 など）。空欄で削除:", cur);
  if(url===null) return;            // キャンセル
  const ov = videoStore(kind);
  if(url.trim()==="") delete ov[item.id]; else ov[item.id]=url.trim();
  saveStore(); after();
}

/* -------- ローカル動画ファイル（IndexedDBに保存） -------- */
const VID_DB = "sf6cm-videos";
let _vdb = null;
let localVideoKeys = new Set();   // 保存済みキーの一覧（同期判定用）
const objURLcache = {};
function vkey(kind, id){ return `${GLOBAL_VIDEO_KINDS.has(kind)?"global":currentChar}:${kind}:${id}`; }
function idb(){
  return new Promise((res, rej)=>{
    if(_vdb) return res(_vdb);
    const r = indexedDB.open(VID_DB, 1);
    r.onupgradeneeded = ()=>r.result.createObjectStore("vids");
    r.onsuccess = ()=>{ _vdb = r.result; res(_vdb); };
    r.onerror = ()=>rej(r.error);
  });
}
function idbOp(mode, fn){
  return idb().then(db=>new Promise((res, rej)=>{
    const tx = db.transaction("vids", mode);
    const rq = fn(tx.objectStore("vids"));
    tx.oncomplete = ()=>res(rq && rq.result);
    tx.onerror = ()=>rej(tx.error);
  }));
}
const idbPut  = (k, blob)=>idbOp("readwrite", s=>s.put(blob, k));
const idbGet  = (k)=>idbOp("readonly",  s=>s.get(k));
const idbDel  = (k)=>idbOp("readwrite", s=>s.delete(k));
const idbKeys = ()=>idbOp("readonly",   s=>s.getAllKeys());

// 共有ファイル選択input
const vfile = document.createElement("input");
vfile.type = "file"; vfile.accept = "video/*"; vfile.style.display = "none";
document.body.appendChild(vfile);
let vfileTarget = null;
vfile.onchange = ()=>{
  const f = vfile.files[0];
  if(f && vfileTarget){
    const { kind, id, after } = vfileTarget;
    const k = vkey(kind, id);
    idbPut(k, f).then(()=>{ localVideoKeys.add(k); delete objURLcache[k]; after(); })
                .catch(e=>alert("保存に失敗しました: "+e));
  }
  vfile.value = ""; vfileTarget = null;
};
function pickVideoFile(kind, id, after){ vfileTarget = { kind, id, after }; vfile.click(); }

// ローカル動画 or URL動画 を選んでカード用HTMLを返す（ローカル優先）
function mediaHTML(kind, item){
  const k = vkey(kind, item.id);
  if(localVideoKeys.has(k))
    return `<div class="video-wrap"><video data-localvideo="${k}" controls preload="metadata"></video></div>`;
  return videoHTML(videoOf(kind, item), kind==="setplayVideos" ? item.timestamp : null);
}
function hasMedia(kind, item){ return localVideoKeys.has(vkey(kind, item.id)) || !!videoOf(kind, item); }
// data-localvideo の<video>に保存済みBlobを非同期で流し込む
function fillLocalVideos(container){
  container.querySelectorAll("video[data-localvideo]").forEach(v=>{
    const k = v.dataset.localvideo;
    if(objURLcache[k]){ v.src = objURLcache[k]; return; }
    idbGet(k).then(blob=>{ if(blob){ const u = URL.createObjectURL(blob); objURLcache[k]=u; v.src=u; }});
  });
}
function clearVideo(kind, id, after){
  if(!confirm("この動画を削除しますか？")) return;
  const ov = videoStore(kind); delete ov[id]; saveStore();
  const k = vkey(kind, id);
  idbDel(k).then(()=>{ localVideoKeys.delete(k); delete objURLcache[k]; after(); });
}

document.getElementById("glossarySearch").oninput = renderGlossary;

/* -------- 全描画 -------- */
function renderAll(){
  renderGuide();
  renderComboFilters(); renderCombos();
  renderFrames();
  renderSetplays();
  renderNotes();
  renderGlossaryFilters(); renderGlossary();
}
initChars();
renderAll();
// 保存済みローカル動画のキーを読み込んでから再描画（再読み込み後も動画が出るように）
idbKeys().then(keys=>{ localVideoKeys = new Set(keys); renderCombos(); renderSetplays(); renderGuide(); }).catch(()=>{});
