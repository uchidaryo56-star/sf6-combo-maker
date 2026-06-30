/* =====================================================================
 * SF6 コンパニオン  アプリ本体
 *  - ユーザーデータ(お気に入り/練習チェック/追加コンボ/メモ等)は
 *    localStorage に保存（ログイン不要・このブラウザのみ）
 * ===================================================================*/

const LS_KEY = "sf6companion.v1";
let store = loadStore();
let currentChar = SF6_DATA.characters[0].id;
let comboFilter = "全て";
let comboGroupFilter = "全て";
let setplayGroupFilter = "全て";

function loadStore(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
function saveStore(){ localStorage.setItem(LS_KEY, JSON.stringify(store)); }
function ns(key){ // キャラ別ネームスペース
  store[currentChar] = store[currentChar] || {};
  store[currentChar][key] = store[currentChar][key] || {};
  if(key==="userCombos"||key==="userSetplays") store[currentChar][key] = store[currentChar][key] || [];
  return store[currentChar][key];
}
function gns(key){ // キャラに依存しない全体共通のネームスペース（用語集など）
  store._global = store._global || {};
  store._global[key] = store._global[key] || (["glossaryUser","recVideos"].includes(key)?[]:{});
  return store._global[key];
}

/* -------- 自由グループ分け（コンボ／セットプレイ共通） --------
 * kind: "combo" | "setplay"。既定データの項目も含めて、好きなグループ名を
 * 付けられる。上書きは ns(kind+"Groups") にキャラ別保存（自作項目はitem.group直書き）。 */
function groupOf(kind, item){
  const ov = ns(kind+"Groups");
  if(item.id in ov) return ov[item.id];
  return item.group || "未分類";
}
function setGroupOverride(kind, item, after){
  const cur = groupOf(kind, item);
  const name = prompt("グループ名（自由に入力。例: 端コンボ / 対戦相手用 / 練習中）", cur);
  if(name===null) return;
  const g = name.trim() || "未分類";
  if(item.id.startsWith("u-")){
    item.group = g; // 自作項目はデータ自体を直接書き換え
  } else {
    ns(kind+"Groups")[item.id] = g;
  }
  saveStore(); after();
}
function groupsOf(kind, items, groupFn){
  const gf = groupFn || (it=>groupOf(kind, it));
  const set = new Set(["全て"]);
  items.forEach(it=>set.add(gf(it)));
  return [...set];
}
// 表示中の一覧をグループ名でまとめる（出現順、「未分類」は最後）。groupFnを省略するとgroupOf(kind,it)を使う。
function groupItems(kind, list, groupFn){
  const gf = groupFn || (it=>groupOf(kind, it));
  const map = new Map();
  list.forEach(it=>{
    const g = gf(it);
    if(!map.has(g)) map.set(g, []);
    map.get(g).push(it);
  });
  return [...map.entries()].sort((a,b)=>{
    if(a[0]==="未分類") return 1;
    if(b[0]==="未分類") return -1;
    return 0;
  });
}
// グループの開閉状態（再描画をまたいで維持。既定は開いた状態）
const closedGroups = { combo:new Set(), setplay:new Set(), recvideo:new Set() };
function wrapGroups(kind, list, cardHtmlFn, groupFn){
  return groupItems(kind, list, groupFn).map(([gname, items])=>{
    const isOpen = !closedGroups[kind].has(gname);
    return `<details class="group-section" data-gname="${esc(gname)}" ${isOpen?"open":""}>
      <summary>🏷️ ${esc(gname)} <span class="gcount">${items.length}件</span><span class="arrow">▶</span></summary>
      <div class="group-body">${items.map(cardHtmlFn).join("")}</div>
    </details>`;
  }).join("");
}
function attachGroupToggleHandlers(container, kind){
  container.querySelectorAll("details.group-section").forEach(d=>{
    d.addEventListener("toggle", ()=>{
      const g = d.dataset.gname;
      if(d.open) closedGroups[kind].delete(g); else closedGroups[kind].add(g);
    });
  });
}

/* -------- キャラセレクタ＆タブ -------- */
function initChars(){
  const sel = document.getElementById("charSelect");
  sel.innerHTML = SF6_DATA.characters.map(c=>`<option value="${c.id}">${c.name}</option>`).join("");
  sel.value = currentChar;
  sel.onchange = ()=>{
    currentChar = sel.value;
    comboFilter = "全て"; comboGroupFilter = "全て"; setplayGroupFilter = "全て"; matchupGroupFilter = "全て"; selectedOpponent = null;
    renderAll();
  };
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
  const deleted = ns("comboDeleted");
  const base = (SF6_DATA.combos[currentChar] || []).filter(c=>!deleted[c.id]);
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
  const gwrap = document.getElementById("comboGroupFilters");
  gwrap.innerHTML = groupsOf("combo", allCombos()).map(g=>
    `<span class="chip ${g===comboGroupFilter?'active':''}" data-grp="${esc(g)}">${esc(g)}</span>`).join("");
  gwrap.querySelectorAll(".chip").forEach(ch=>{
    ch.onclick = ()=>{ comboGroupFilter = ch.dataset.grp; renderComboFilters(); renderCombos(); };
  });
  renderComboHidden();
}
function renderComboHidden(){
  const hidden = document.getElementById("comboHidden");
  const deletedIds = Object.keys(ns("comboDeleted"));
  if(!deletedIds.length){ hidden.style.display="none"; hidden.innerHTML=""; return; }
  const base = SF6_DATA.combos[currentChar]||[];
  const names = base.filter(c=>deletedIds.includes(c.id));
  hidden.style.display = "block";
  hidden.innerHTML = `非表示にしたコンボ（${names.length}件）: ` +
    names.map(c=>`<button class="ghost" data-crestore="${c.id}" style="margin:2px">${esc(c.name)} を復元</button>`).join(" ");
  hidden.querySelectorAll("[data-crestore]").forEach(b=>b.onclick=()=>{
    delete ns("comboDeleted")[b.dataset.crestore]; saveStore(); renderComboFilters(); renderCombos();
  });
}
function renderCombos(){
  const favs = ns("favCombos");
  const done = ns("doneCombos");
  const favOnly = document.getElementById("favOnly").checked;
  let list = allCombos();
  if(comboFilter!=="全て") list = list.filter(c=>c.start===comboFilter);
  if(comboGroupFilter!=="全て") list = list.filter(c=>groupOf("combo",c)===comboGroupFilter);
  if(favOnly) list = list.filter(c=>favs[c.id]);

  const el = document.getElementById("comboList");
  if(!list.length){ el.innerHTML = `<div class="empty">該当するコンボがありません</div>`; return; }

  const comboCardHtml = c=>{
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
        <button class="ghost" data-grpedit="${c.id}">🏷️ グループ変更</button>
        <button class="ghost" data-vidfile="${c.id}">📁 動画ファイル</button>
        <button class="ghost" data-vidurl="${c.id}">🔗 URL</button>
        ${media?`<button class="ghost" data-vidclear="${c.id}">動画を消す</button>`:""}
        ${localVideoKeys.has(vkey("comboVideos",c.id))?`<button class="ghost" data-viddl="${c.id}">📥 動画を書き出す</button>`:""}
        <button class="danger" data-delcombo="${c.id}">削除</button>
      </div>
    </div>`;
  };
  el.innerHTML = wrapGroups("combo", list, comboCardHtml);
  attachGroupToggleHandlers(el, "combo");

  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-grpedit]").forEach(b=>b.onclick=()=>{
    setGroupOverride("combo", list.find(x=>x.id===b.dataset.grpedit), ()=>{renderComboFilters(); renderCombos();});
  });
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("comboVideos", b.dataset.vidfile, renderCombos));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("comboVideos", list.find(x=>x.id===b.dataset.vidurl), renderCombos));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("comboVideos", b.dataset.vidclear, renderCombos));
  el.querySelectorAll("[data-viddl]").forEach(b=>b.onclick=()=>downloadLocalVideo("comboVideos", b.dataset.viddl, list.find(x=>x.id===b.dataset.viddl).name));
  el.querySelectorAll("[data-fav]").forEach(s=>s.onclick=()=>{
    const id=s.dataset.fav; favs[id]=!favs[id]; saveStore(); renderCombos();
  });
  el.querySelectorAll("[data-done]").forEach(c=>c.onchange=()=>{
    done[c.dataset.done]=c.checked; saveStore();
  });
  el.querySelectorAll("[data-delcombo]").forEach(b=>b.onclick=()=>{
    const id = b.dataset.delcombo;
    if(id.startsWith("u-")){
      if(!confirm("このコンボを削除しますか？")) return;
      store[currentChar].userCombos = store[currentChar].userCombos.filter(x=>x.id!==id);
    } else {
      if(!confirm("このコンボを一覧から非表示にしますか？（後で復元できます）")) return;
      ns("comboDeleted")[id] = true;
    }
    saveStore(); renderComboFilters(); renderCombos();
  });
}
document.getElementById("favOnly").onchange = renderCombos;
document.getElementById("addCombo").onclick = ()=>{
  const newId = "u-"+Date.now();
  let localPicked = false;
  openModal(`
    <h3>コンボを追加</h3>
    <label class="fld">コンボ名</label><input id="mName" style="width:100%">
    <label class="fld">始動カテゴリ</label><input id="mStart" value="通常ヒット" style="width:100%" placeholder="例: 通常ヒット / パニッシュカウンター / ドライブラッシュ">
    <label class="fld">グループ</label><input id="mGroup" style="width:100%" placeholder="自由入力。空欄で未分類">
    <label class="fld">レシピ（コンボの入力）</label>
    <input id="mNotation" style="width:100%" placeholder="例: 2中K > 弱波動拳">
    <input class="move-search" style="width:100%;margin-top:6px" placeholder="🔍 技を検索して下から選ぶ">
    <div class="move-picker"></div>
    <div class="hint" style="margin-bottom:10px">技をクリックするとレシピ欄の末尾に追加されます（フレーム表に登録されている技）。OD技やDR等は手入力で追記してください。</div>
    <label class="fld">ダメージ</label><input id="mDamage" type="number" value="2000" style="width:100%">
    <label class="fld">動画</label>
    <input id="mVideo" style="width:100%" placeholder="動画URL（YouTube等・任意）">
    <div class="row-actions" style="margin-top:6px">
      <button class="ghost" id="mVidFile">📁 動画ファイルを選ぶ</button>
      <span class="hint" id="mVidStatus" style="display:none;margin:0"></span>
    </div>
    <div class="row-actions">
      <button id="mSave">保存</button>
      <button class="ghost" id="mCancel">キャンセル</button>
    </div>
  `);
  const box = document.getElementById("modalBox");
  attachMovePicker(box, "mNotation", " > ");
  box.querySelector("#mVidFile").onclick = ()=>{
    pickVideoFile("comboVideos", newId, ()=>{
      localPicked = true;
      const st = box.querySelector("#mVidStatus");
      st.textContent = "✓ 動画ファイルを選択しました（保存時に登録されます）";
      st.style.display = "";
    });
  };
  box.querySelector("#mCancel").onclick = ()=>{
    if(localPicked){ const k = vkey("comboVideos", newId); idbDel(k).then(()=>localVideoKeys.delete(k)); }
    closeModal();
  };
  box.querySelector("#mSave").onclick = ()=>{
    const name = box.querySelector("#mName").value.trim();
    if(!name){ alert("コンボ名を入力してください"); return; }
    const start = box.querySelector("#mStart").value.trim() || "その他";
    const group = box.querySelector("#mGroup").value.trim() || "未分類";
    const notation = box.querySelector("#mNotation").value.trim();
    const damage = parseInt(box.querySelector("#mDamage").value) || 0;
    const video = box.querySelector("#mVideo").value.trim();
    store[currentChar] = store[currentChar]||{};
    store[currentChar].userCombos = store[currentChar].userCombos||[];
    store[currentChar].userCombos.push({
      id:newId, name, start, group, notation, damage, drive:0, super:0,
      difficulty:1, position:"中央", video, note:"（自作）"
    });
    saveStore(); renderComboFilters(); renderCombos(); closeModal();
  };
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
    <td>${esc(f.move)}</td>
    <td style="font-family:Consolas,monospace;font-size:13px">${esc(f.command||"-")}</td>
    <td style="${m}">${esc(f.type)}</td>
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
  const deleted = ns("setplayDeleted");
  const base = (SF6_DATA.setplays[currentChar]||[]).filter(s=>!deleted[s.id]);
  const user = store[currentChar] && store[currentChar].userSetplays ? store[currentChar].userSetplays : [];
  return [...base, ...user];
}
function renderSetplayGroupFilters(){
  const gwrap = document.getElementById("setplayGroupFilters");
  gwrap.innerHTML = groupsOf("setplay", allSetplays()).map(g=>
    `<span class="chip ${g===setplayGroupFilter?'active':''}" data-grp="${esc(g)}">${esc(g)}</span>`).join("");
  gwrap.querySelectorAll(".chip").forEach(ch=>{
    ch.onclick = ()=>{ setplayGroupFilter = ch.dataset.grp; renderSetplayGroupFilters(); renderSetplays(); };
  });
  renderSetplayHidden();
}
function renderSetplayHidden(){
  const hidden = document.getElementById("setplayHidden");
  const deletedIds = Object.keys(ns("setplayDeleted"));
  if(!deletedIds.length){ hidden.style.display="none"; hidden.innerHTML=""; return; }
  const base = SF6_DATA.setplays[currentChar]||[];
  const names = base.filter(s=>deletedIds.includes(s.id));
  hidden.style.display = "block";
  hidden.innerHTML = `非表示にしたセットプレイ（${names.length}件）: ` +
    names.map(s=>`<button class="ghost" data-srestore="${s.id}" style="margin:2px">${esc(s.situation)} を復元</button>`).join(" ");
  hidden.querySelectorAll("[data-srestore]").forEach(b=>b.onclick=()=>{
    delete ns("setplayDeleted")[b.dataset.srestore]; saveStore(); renderSetplayGroupFilters(); renderSetplays();
  });
}
function renderSetplays(){
  let list = allSetplays();
  if(setplayGroupFilter!=="全て") list = list.filter(s=>groupOf("setplay",s)===setplayGroupFilter);
  const el = document.getElementById("setplayList");
  if(!list.length){ el.innerHTML=`<div class="empty">セットプレイがありません</div>`; return; }
  const setplayCardHtml = s=>{
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
        <button class="ghost" data-grpedit="${s.id}">🏷️ グループ変更</button>
        <button class="ghost" data-vidfile="${s.id}">📁 動画ファイル</button>
        <button class="ghost" data-vidurl="${s.id}">🔗 URL</button>
        ${media?`<button class="ghost" data-vidclear="${s.id}">動画を消す</button>`:""}
        ${localVideoKeys.has(vkey("setplayVideos",s.id))?`<button class="ghost" data-viddl="${s.id}">📥 動画を書き出す</button>`:""}
        <button class="danger" data-delsp="${s.id}">削除</button></div>
    </div>`;
  };
  el.innerHTML = wrapGroups("setplay", list, setplayCardHtml);
  attachGroupToggleHandlers(el, "setplay");
  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-grpedit]").forEach(b=>b.onclick=()=>{
    setGroupOverride("setplay", list.find(x=>x.id===b.dataset.grpedit), ()=>{renderSetplayGroupFilters(); renderSetplays();});
  });
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("setplayVideos", b.dataset.vidfile, renderSetplays));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("setplayVideos", list.find(x=>x.id===b.dataset.vidurl), renderSetplays));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("setplayVideos", b.dataset.vidclear, renderSetplays));
  el.querySelectorAll("[data-viddl]").forEach(b=>b.onclick=()=>downloadLocalVideo("setplayVideos", b.dataset.viddl, list.find(x=>x.id===b.dataset.viddl).situation));
  el.querySelectorAll("[data-delsp]").forEach(b=>b.onclick=()=>{
    const id = b.dataset.delsp;
    if(id.startsWith("u-")){
      if(!confirm("このセットプレイを削除しますか？")) return;
      store[currentChar].userSetplays = store[currentChar].userSetplays.filter(x=>x.id!==id);
    } else {
      if(!confirm("このセットプレイを一覧から非表示にしますか？（後で復元できます）")) return;
      ns("setplayDeleted")[id] = true;
    }
    saveStore(); renderSetplayGroupFilters(); renderSetplays();
  });
}
document.getElementById("addSetplay").onclick = ()=>{
  const newId = "u-"+Date.now();
  let localPicked = false;
  openModal(`
    <h3>セットプレイを追加</h3>
    <label class="fld">状況</label><input id="mSituation" style="width:100%" placeholder="例: 端 強昇龍ダウン後">
    <label class="fld">手順</label><input id="mSetup" style="width:100%" placeholder="例: 前ステ x2">
    <label class="fld">グループ</label><input id="mGroup" style="width:100%" placeholder="自由入力。空欄で未分類">
    <label class="fld">択（レシピ）</label>
    <input id="mMixup" style="width:100%" placeholder="例: 打撃(2中K) / 投げ">
    <input class="move-search" style="width:100%;margin-top:6px" placeholder="🔍 技を検索して下から選ぶ">
    <div class="move-picker"></div>
    <div class="hint" style="margin-bottom:10px">技をクリックすると択欄の末尾に追加されます（フレーム表に登録されている技）。</div>
    <label class="fld">動画</label>
    <input id="mVideo" style="width:100%" placeholder="動画URL（任意）">
    <label class="fld">動画の時間（URL動画の場合のみ。例: 1:23、任意）</label><input id="mTimestamp" style="width:100%">
    <div class="row-actions" style="margin-top:6px">
      <button class="ghost" id="mVidFile">📁 動画ファイルを選ぶ</button>
      <span class="hint" id="mVidStatus" style="display:none;margin:0"></span>
    </div>
    <div class="row-actions">
      <button id="mSave">保存</button>
      <button class="ghost" id="mCancel">キャンセル</button>
    </div>
  `);
  const box = document.getElementById("modalBox");
  attachMovePicker(box, "mMixup", " / ");
  box.querySelector("#mVidFile").onclick = ()=>{
    pickVideoFile("setplayVideos", newId, ()=>{
      localPicked = true;
      const st = box.querySelector("#mVidStatus");
      st.textContent = "✓ 動画ファイルを選択しました（保存時に登録されます）";
      st.style.display = "";
    });
  };
  box.querySelector("#mCancel").onclick = ()=>{
    if(localPicked){ const k = vkey("setplayVideos", newId); idbDel(k).then(()=>localVideoKeys.delete(k)); }
    closeModal();
  };
  box.querySelector("#mSave").onclick = ()=>{
    const situation = box.querySelector("#mSituation").value.trim();
    if(!situation){ alert("状況を入力してください"); return; }
    const setup = box.querySelector("#mSetup").value.trim();
    const mixup = box.querySelector("#mMixup").value.trim();
    const group = box.querySelector("#mGroup").value.trim() || "未分類";
    const video = box.querySelector("#mVideo").value.trim();
    const timestamp = video ? box.querySelector("#mTimestamp").value.trim() : "";
    store[currentChar] = store[currentChar]||{};
    store[currentChar].userSetplays = store[currentChar].userSetplays||[];
    store[currentChar].userSetplays.push({id:newId,situation,setup,mixup,group,video,timestamp,note:"（自作）"});
    saveStore(); renderSetplayGroupFilters(); renderSetplays(); closeModal();
  };
};

/* ============ マッチアップメモ（相手キャラ別） ============ */
let selectedOpponent = null;
let matchupGroupFilter = "全て";
function matchupGroupOf(oppId){
  const rec = ns("matchupNotes")[oppId];
  return (rec && rec.group) || "未分類";
}
function renderMatchupGroupFilters(){
  const notesMap = ns("matchupNotes");
  const set = new Set(["全て"]);
  Object.keys(notesMap).forEach(id=>{ if(notesMap[id].body) set.add(matchupGroupOf(id)); });
  const wrap = document.getElementById("matchupGroupFilters");
  wrap.innerHTML = [...set].map(g=>
    `<span class="chip ${g===matchupGroupFilter?'active':''}" data-grp="${esc(g)}">${esc(g)}</span>`).join("");
  wrap.querySelectorAll(".chip").forEach(ch=>{
    ch.onclick = ()=>{ matchupGroupFilter = ch.dataset.grp; renderMatchupGroupFilters(); renderOpponentGrid(); };
  });
}
function renderOpponentGrid(){
  const wrap = document.getElementById("opponentGrid");
  const notesMap = ns("matchupNotes");
  let chars = SF6_DATA.characters;
  if(matchupGroupFilter!=="全て") chars = chars.filter(c=>notesMap[c.id] && notesMap[c.id].body && matchupGroupOf(c.id)===matchupGroupFilter);
  wrap.innerHTML = chars.map(c=>{
    const has = notesMap[c.id] && notesMap[c.id].body;
    return `<span class="chip opp-chip ${c.id===selectedOpponent?'active':''}" data-opp="${c.id}" style="border-color:${c.color}">${has?"✎ ":""}${esc(c.name)}</span>`;
  }).join("");
  wrap.querySelectorAll("[data-opp]").forEach(ch=>{
    ch.onclick = ()=>{ selectedOpponent = ch.dataset.opp; renderOpponentGrid(); renderNoteEditor(); };
  });
}
function renderNoteEditor(){
  const box = document.getElementById("noteEditorBox");
  if(!selectedOpponent){ box.style.display="none"; return; }
  box.style.display = "block";
  const opp = SF6_DATA.characters.find(c=>c.id===selectedOpponent);
  const rec = ns("matchupNotes")[selectedOpponent] || {body:"", updated:"", group:""};
  document.getElementById("noteEditorTitle").textContent = `対 ${opp.name}`;
  document.getElementById("noteEditorMeta").textContent = rec.updated ? `最終更新: ${rec.updated}` : "まだメモがありません";
  document.getElementById("noteGroup").value = rec.group || "";
  document.getElementById("noteBody").value = rec.body;
  const pseudoItem = { id: selectedOpponent, video: "" };
  const media = hasMedia("matchupVideos", pseudoItem);
  document.getElementById("noteMedia").innerHTML = media ? mediaHTML("matchupVideos", pseudoItem) : "";
  attachVideoHandlers(box); fillLocalVideos(box);
  document.getElementById("noteVidClear").style.display = media ? "" : "none";
  document.getElementById("noteVidDl").style.display = localVideoKeys.has(vkey("matchupVideos", selectedOpponent)) ? "" : "none";
}
document.getElementById("saveNote").onclick = ()=>{
  if(!selectedOpponent) return;
  const body = document.getElementById("noteBody").value.trim();
  const group = document.getElementById("noteGroup").value.trim() || "未分類";
  ns("matchupNotes")[selectedOpponent] = {body, group, updated:new Date().toLocaleDateString("ja-JP")};
  saveStore(); renderMatchupGroupFilters(); renderOpponentGrid(); renderNoteEditor();
};
document.getElementById("clearNote").onclick = ()=>{
  if(!selectedOpponent) return;
  if(!confirm("このメモを削除しますか？")) return;
  delete ns("matchupNotes")[selectedOpponent];
  saveStore(); renderMatchupGroupFilters(); renderOpponentGrid(); renderNoteEditor();
};
document.getElementById("noteVidFile").onclick = ()=>{
  if(!selectedOpponent) return;
  pickVideoFile("matchupVideos", selectedOpponent, renderNoteEditor);
};
document.getElementById("noteVidUrl").onclick = ()=>{
  if(!selectedOpponent) return;
  editVideo("matchupVideos", { id: selectedOpponent, video:"" }, renderNoteEditor);
};
document.getElementById("noteVidClear").onclick = ()=>{
  if(!selectedOpponent) return;
  clearVideo("matchupVideos", selectedOpponent, renderNoteEditor);
};
document.getElementById("noteVidDl").onclick = ()=>{
  if(!selectedOpponent) return;
  const opp = SF6_DATA.characters.find(c=>c.id===selectedOpponent);
  downloadLocalVideo("matchupVideos", selectedOpponent, opp.name);
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
  el.innerHTML = list.map(t=>{
    const media = hasMedia("glossaryVideos", t);
    return `<div class="card">
    <div class="term">
      <span class="term-name">${hl(t.term,q)}</span>
      ${t.read?`<span class="term-read">${hl(t.read,q)}</span>`:""}
      <span class="badge">${esc(t.cat)}</span>
      ${isGlossaryModified(t)?`<span class="badge" style="color:var(--warn);border-color:var(--warn)">編集済み</span>`:""}
      ${!t.builtin?`<span class="badge" style="color:var(--accent2);border-color:var(--accent2)">自作</span>`:""}
    </div>
    <div class="term-def">${hl(t.def,q)}</div>
    ${mediaHTML("glossaryVideos", t)}
    <div class="row-actions">
      <button class="ghost" data-gedit="${t.id}">✎ 編集</button>
      <button class="danger" data-gdel="${t.id}">削除</button>
      ${isGlossaryModified(t)?`<button class="ghost" data-greset="${t.id}">↺ 元に戻す</button>`:""}
      <button class="ghost" data-vidfile="${t.id}">📁 動画ファイル</button>
      <button class="ghost" data-vidurl="${t.id}">🔗 URL</button>
      ${media?`<button class="ghost" data-vidclear="${t.id}">動画を消す</button>`:""}
      ${localVideoKeys.has(vkey("glossaryVideos",t.id))?`<button class="ghost" data-viddl="${t.id}">📥 動画を書き出す</button>`:""}
    </div>
  </div>`;
  }).join("");
  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("glossaryVideos", b.dataset.vidfile, renderGlossary));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("glossaryVideos", list.find(x=>x.id===b.dataset.vidurl), renderGlossary));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("glossaryVideos", b.dataset.vidclear, renderGlossary));
  el.querySelectorAll("[data-viddl]").forEach(b=>b.onclick=()=>downloadLocalVideo("glossaryVideos", b.dataset.viddl, list.find(x=>x.id===b.dataset.viddl).term));

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
          ${localVideoKeys.has(vkey("guideVideos",s.id))?`<button class="ghost" data-viddl="${s.id}">📥 動画を書き出す</button>`:""}
        </div>
      </div>
    </div>`;
  }).join("");

  attachVideoHandlers(el); fillLocalVideos(el);
  el.querySelectorAll("[data-viddl]").forEach(b=>b.onclick=()=>downloadLocalVideo("guideVideos", b.dataset.viddl, steps.find(x=>x.id===b.dataset.viddl).title));
  el.querySelectorAll("[data-vidfile]").forEach(b=>b.onclick=()=>pickVideoFile("guideVideos", b.dataset.vidfile, renderGuide));
  el.querySelectorAll("[data-vidurl]").forEach(b=>b.onclick=()=>editVideo("guideVideos", steps.find(x=>x.id===b.dataset.vidurl), renderGuide));
  el.querySelectorAll("[data-vidclear]").forEach(b=>b.onclick=()=>clearVideo("guideVideos", b.dataset.vidclear, renderGuide));
  el.querySelectorAll("[data-gotoview]").forEach(b=>b.onclick=()=>{
    const tab = document.querySelector(`.tab[data-view="${b.dataset.gotoview}"]`);
    if(tab) tab.click();
  });
}

/* -------- おすすめ動画（空き時間用。キャラに依存しない全体共通リスト） -------- */
const recVideoGroupOf = v => v.group || "未分類";
let recVideoGroupFilter = "全て";
function allRecVideos(){
  const deleted = gns("recVideosDeleted");
  const seed = (SF6_DATA.recVideos||[]).filter(v=>!deleted[v.id]);
  const user = gns("recVideos");
  return [...seed, ...user];
}
function renderRecVideoGroupFilters(){
  const wrap = document.getElementById("recVideoGroupFilters");
  const groups = groupsOf(null, allRecVideos(), recVideoGroupOf);
  wrap.innerHTML = groups.map(g=>
    `<span class="chip ${g===recVideoGroupFilter?'active':''}" data-grp="${esc(g)}">${esc(g)}</span>`).join("");
  wrap.querySelectorAll(".chip").forEach(ch=>{
    ch.onclick = ()=>{ recVideoGroupFilter = ch.dataset.grp; renderRecVideoGroupFilters(); renderRecVideos(); };
  });
}
function renderRecVideoHidden(){
  const hidden = document.getElementById("recVideoHidden");
  if(!hidden) return;
  const deletedIds = Object.keys(gns("recVideosDeleted"));
  if(!deletedIds.length){ hidden.style.display="none"; hidden.innerHTML=""; return; }
  const seed = SF6_DATA.recVideos||[];
  const names = seed.filter(v=>deletedIds.includes(v.id));
  hidden.style.display = "block";
  hidden.innerHTML = `非表示にした動画（${names.length}件）: ` +
    names.map(v=>`<button class="ghost" data-rvrrestore="${v.id}" style="margin:2px">${esc(v.title||v.id)} を復元</button>`).join(" ");
  hidden.querySelectorAll("[data-rvrrestore]").forEach(b=>b.onclick=()=>{
    delete gns("recVideosDeleted")[b.dataset.rvrrestore];
    saveStore(); renderRecVideoGroupFilters(); renderRecVideos();
  });
}
function renderRecVideos(){
  let list = allRecVideos();
  if(recVideoGroupFilter!=="全て") list = list.filter(v=>recVideoGroupOf(v)===recVideoGroupFilter);
  const el = document.getElementById("recVideoList");
  if(!list.length){ el.innerHTML = `<div class="empty">まだ動画がありません</div>`; renderRecVideoHidden(); return; }
  const cardHtml = v=>`<div class="card">
    <div class="card-head"><h3>${esc(v.title||"（無題）")}</h3></div>
    ${videoHTML(v.url, null)}
    <div class="row-actions">
      <button class="ghost" data-grpeditrv="${v.id}">🏷️ グループ変更</button>
      <button class="danger" data-delrec="${v.id}">削除</button>
    </div>
  </div>`;
  el.innerHTML = wrapGroups("recvideo", list, cardHtml, recVideoGroupOf);
  attachGroupToggleHandlers(el, "recvideo");
  attachVideoHandlers(el);
  renderRecVideoHidden();
  el.querySelectorAll("[data-grpeditrv]").forEach(b=>b.onclick=()=>{
    const v = list.find(x=>x.id===b.dataset.grpeditrv);
    if(!v) return;
    const name = prompt("グループ名（自由入力。例: キャラ名 / 差し合い / コンボ）", recVideoGroupOf(v));
    if(name===null) return;
    v.group = name.trim() || "未分類";
    if(!v.id.startsWith("rvs-")) saveStore();
    renderRecVideoGroupFilters(); renderRecVideos();
  });
  el.querySelectorAll("[data-delrec]").forEach(b=>b.onclick=()=>{
    const id = b.dataset.delrec;
    if(id.startsWith("rvs-")){
      if(!confirm("この動画を一覧から非表示にしますか？（後で復元できます）")) return;
      gns("recVideosDeleted")[id] = true;
    } else {
      if(!confirm("この動画を一覧から削除しますか？")) return;
      const arr = gns("recVideos");
      const idx = arr.findIndex(v=>v.id===id);
      if(idx>=0) arr.splice(idx,1);
    }
    saveStore(); renderRecVideoGroupFilters(); renderRecVideos();
  });
}
document.getElementById("addRecVideo").onclick = ()=>{
  openModal(`
    <h3>おすすめ動画を追加</h3>
    <label class="fld">タイトル</label><input id="mTitle" style="width:100%" placeholder="例: 中段下段の崩しの基本">
    <label class="fld">動画URL</label><input id="mUrl" style="width:100%" placeholder="YouTube等のURL">
    <label class="fld">グループ</label><input id="mGroup" style="width:100%" placeholder="自由入力。例: キャラ名 / ジャンル。空欄で未分類">
    <div class="row-actions">
      <button id="mSave">保存</button>
      <button class="ghost" id="mCancel">キャンセル</button>
    </div>
  `);
  const box = document.getElementById("modalBox");
  box.querySelector("#mCancel").onclick = closeModal;
  box.querySelector("#mSave").onclick = ()=>{
    const title = box.querySelector("#mTitle").value.trim();
    const url = box.querySelector("#mUrl").value.trim();
    if(!url){ alert("動画URLを入力してください"); return; }
    const group = box.querySelector("#mGroup").value.trim() || "未分類";
    gns("recVideos").push({id:"rv-"+Date.now(), title, url, group});
    saveStore(); renderRecVideoGroupFilters(); renderRecVideos(); closeModal();
  };
};

/* -------- ユーティリティ -------- */
function esc(s){ return String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m])); }

/* -------- モーダル & 技ピッカー（フレーム表の技からレシピを作る） -------- */
function openModal(html){
  document.getElementById("modalBox").innerHTML = html;
  document.getElementById("modalOverlay").style.display = "flex";
}
function closeModal(){
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("modalBox").innerHTML = "";
}
document.getElementById("modalOverlay").onclick = (e)=>{ if(e.target.id==="modalOverlay") closeModal(); };
// box内の .move-search / .move-picker を、フレーム表の技一覧で動かす。
// 技をクリックすると targetId の入力欄末尾に sep 区切りで追記する。
function attachMovePicker(box, targetId, sep){
  const seen = new Set();
  const moves = (SF6_DATA.frames[currentChar]||[]).filter(f=>{
    if(seen.has(f.move)) return false; seen.add(f.move); return true;
  });
  const wrap = box.querySelector(".move-picker");
  const search = box.querySelector(".move-search");
  if(!wrap) return;
  function draw(q){
    const qq = (q||"").trim();
    const list = moves.filter(f=>!qq || f.move.includes(qq) || (f.command||"").includes(qq));
    wrap.innerHTML = list.length
      ? list.map(f=>`<span class="chip" data-mv="${esc(f.move)}" data-cmd="${esc(f.command||"")}">
          ${esc(f.move)}${f.command?` <span style="opacity:.7">（${esc(f.command)}）</span>`:""}
        </span>`).join("")
      : `<span class="hint" style="margin:0">該当する技がありません</span>`;
    wrap.querySelectorAll("[data-mv]").forEach(ch=>ch.onclick=()=>{
      const input = box.querySelector("#"+targetId);
      const token = ch.dataset.cmd ? `${ch.dataset.mv}（${ch.dataset.cmd}）` : ch.dataset.mv;
      input.value = input.value.trim() ? (input.value.replace(/\s+$/,"") + sep + token) : token;
      input.focus();
    });
  }
  draw("");
  if(search) search.oninput = ()=>draw(search.value);
}

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
  if(!/^https?:\/\//i.test(url)) return null; // javascript: 等の危険なスキームを拒否
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
const GLOBAL_VIDEO_KINDS = new Set(["guideVideos", "glossaryVideos"]);
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
// ローカルに保存した動画ファイルを実ファイルとして書き出す（みんなに共有したい時、
// videosフォルダに置いて data.js/glossary.js/guide.js から相対パスで参照するために使う）
function downloadLocalVideo(kind, id, niceName){
  const k = vkey(kind, id);
  idbGet(k).then(blob=>{
    if(!blob){ alert("保存された動画が見つかりません"); return; }
    const ext = (blob.type.split("/")[1] || "mp4").replace(/[^a-z0-9]/gi, "");
    const safe = String(niceName||id).replace(/[^\w぀-ヿ一-鿿-]+/g, "_").slice(0, 40);
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url; a.download = `${safe || id}.${ext}`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
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
  renderRecVideoGroupFilters(); renderRecVideos();
  renderComboFilters(); renderCombos();
  renderFrames();
  renderSetplayGroupFilters(); renderSetplays();
  renderMatchupGroupFilters(); renderOpponentGrid(); renderNoteEditor();
  renderGlossaryFilters(); renderGlossary();
}
initChars();
renderAll();
// 保存済みローカル動画のキーを読み込んでから再描画（再読み込み後も動画が出るように）
idbKeys().then(keys=>{ localVideoKeys = new Set(keys); renderCombos(); renderSetplays(); renderGuide(); renderNoteEditor(); }).catch(()=>{});
