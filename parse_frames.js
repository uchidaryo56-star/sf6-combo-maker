// SF6 公式フレームページHTML → 構造化JSON 抽出
//   使い方: node parse_frames.js <入力html> <出力json>
//   例:     node parse_frames.js jp_frame.html jp_parsed.json
//   クラスは「意味のある接頭辞」でマッチするのでビルド更新やキャラ違いでも壊れにくい
const fs = require("fs");
const inFile  = process.argv[2] || "jp_frame.html";
const outFile = process.argv[3] || "jp_parsed.json";
const h = fs.readFileSync(inFile, "utf8");

const strip = s => s
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<\/li>/g, " / ").replace(/<li>/g, "")      // コンボ補正値などの箇条書きを区切りに
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
  .replace(/\s*\/\s*$/,"").replace(/\s+/g, " ").trim();

// 各列の安定した「クラス接頭辞」（ハッシュ非依存）。公式テーブルの列順に対応。
const COLS = {
  startup:         "frame_startup_frame__",          // 発生
  active:          "frame_active_frame__",            // 持続
  recovery:        "frame_recovery_frame__",          // 硬直
  onHit:           "frame_hit_frame__",               // 硬直差・ヒット
  onBlock:         "frame_block_frame__",             // 硬直差・ガード
  cancel:          "frame_cancel__",                  // キャンセル
  damage:          "frame_damage__",                  // ダメージ
  comboCorrect:    "frame_combo_correct__",           // コンボ補正値
  driveGain:       "frame_drive_gauge_gain_hit__",    // Dゲージ増加(ヒット時)
  driveLoseGuard:  "frame_drive_gauge_lose_dguard__", // Dゲージ減少(ガード時)
  driveLosePunish: "frame_drive_gauge_lose_punish__", // Dゲージ減少(パニッシュカウンター時)
  saGain:          "frame_sa_gauge_gain__",           // SAゲージ増加
  attribute:       "frame_attribute__",               // 属性
  note:            "frame_note__",                    // 備考
};

// 技名セル(frame_fixed_m__)をアンカーに、次のアンカーまでを1技ブロックとする → 公式の掲載順を保持
const anchors = [...h.matchAll(/<td class="frame_fixed_m__[^"]*"[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>/g)]
  .map(m => ({ i: m.index, name: strip(m[1]) }));

// カテゴリ見出し行（通常技 / 特殊技 / 必殺技 / スーパーアーツ / 通常投げ / 共通システム）
const heads = [...h.matchAll(/frame_heading__[A-Za-z0-9_]*"[^>]*>\s*<td[^>]*>\s*<span>([^<]+)<\/span>/g)]
  .map(m => ({ i: m.index, v: m[1].trim() }));
const catAt = pos => { let c = ""; for (const hd of heads) { if (hd.i < pos) c = hd.v; else break; } return c; };

const num = v => { if (v == null || v === "") return null; return /^-?\d+$/.test(v) ? parseInt(v) : v; };
const get = (block, prefix) => {
  const m = block.match(new RegExp('<td class="' + prefix + '[^"]*"[^>]*>([\\s\\S]*?)</td>'));
  return m ? strip(m[1]) : "";
};

// コマンド表記（技名セル内の「クラシック操作」アイコン列）をテンキー表記に変換する。
// 例: key-d×2 + key-plus + icon_punch_l → "22+P"（236等のレバー方向は連結、+でボタンを繋ぐ）
const ICON_MAP = {
  "key-d": "2", "key-dl": "1", "key-dr": "3", "key-l": "4", "key-r": "6", "key-u": "8",
  "key-ul": "7", "key-ur": "9", "key-nutral": "5",
  "key-dc": "[2]", "key-lc": "[4]", "key-rc": "[6]", "key-uc": "[8]",   // 溜め（チャージ）
  "key-or": " / ", "key-plus": "+",
  "icon_punch_l": "P", "icon_punch_m": "P", "icon_punch_h": "P", "icon_punch": "P",
  "icon_kick_l": "K", "icon_kick_m": "K", "icon_kick_h": "K", "icon_kick": "K",
  "arrow_3": ">",
};
const getCommand = block => {
  const m = block.match(/<p class="frame_classic___[^"]*">([\s\S]*?)<\/p>/);
  if (!m) return "";
  let s = m[1].replace(/<img src="[^"]*\/controller\/([a-zA-Z0-9_-]+)\.png"[^>]*\/?>/g,
    (full, name) => (name in ICON_MAP) ? ICON_MAP[name] : "");
  s = s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");
  s = s.replace(/([PK])(弱|中|強)/g, "$2$1");         // 強度はアイコン直後の文字 → 「弱P」のように前へ並べ替え
  s = s.replace(/\s*\+\s*/g, "+").replace(/([PK])\s+(?=[PK])/g, "$1").replace(/\s+/g, " ").trim();
  return s;
};

const out = anchors.map((a, k) => {
  const block = h.slice(a.i, (anchors[k + 1] || { i: h.length }).i);
  const row = { move: a.name, type: catAt(a.i), command: getCommand(block) };
  for (const [field, prefix] of Object.entries(COLS)) {
    const raw = get(block, prefix);
    // フレーム系・硬直差は数値化（"D"等の表記は文字列のまま保持）
    row[field] = ["startup", "onHit", "onBlock"].includes(field) ? num(raw) : raw;
  }
  return row;
});

fs.writeFileSync(outFile, JSON.stringify(out, null, 1));
const withStartup = out.filter(o => typeof o.startup === "number").length;
console.log(`${inFile} -> ${outFile}: ${out.length} moves (${withStartup} with numeric startup)`);
console.log("type dist:", JSON.stringify(out.reduce((a, o) => (a[o.type] = (a[o.type] || 0) + 1, a), {})));
console.log("sample (弱 トリグラフ):");
console.log(JSON.stringify(out.find(o => o.move.includes("弱 トリグラフ")), null, 1));
