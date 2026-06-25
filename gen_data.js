// jp_parsed.json と既存サンプルから data.js を生成
const fs = require("fs");
const jp = JSON.parse(fs.readFileSync("jp_parsed.json", "utf8"));

// リュウのサンプルデータ（コンボ/セットプレイの例。フレームはJPのみ実数値）
const ryuCombos = [
  { id:"ryu-c1", name:"基本中央ヒット確認", start:"通常ヒット", notation:"2中K > 弱波動拳", damage:1300, drive:0, super:1, difficulty:1, position:"中央", video:"", note:"削り・牽制から。安全に締める基本。" },
  { id:"ryu-c2", name:"パニカン standard", start:"パニッシュカウンター", notation:"中P > 5中P > 強昇龍拳", damage:2600, drive:1, super:2, difficulty:2, position:"中央", video:"", note:"確反からの基本火力。" },
  { id:"ryu-c3", name:"ドライブラッシュ始動", start:"ドライブラッシュ", notation:"DR中P > 大P > 中竜巻 > OD昇龍", damage:3400, drive:3, super:2, difficulty:3, position:"中央", video:"", note:"ゲージ使用の主力。運び込み。" },
];
const ryuSetplays = [
  { id:"ryu-s1", situation:"中央 強昇龍ダウン後", setup:"前ステップ x2", mixup:"打撃(2中K) / 投げ の二択", video:"", timestamp:"", note:"基本の重ね。" },
];

const data = {
  characters: [
    { id:"jp",  name:"JP",     color:"#7b5bd6" },
    { id:"ryu", name:"リュウ", color:"#d23b3b" },
  ],
  combos:   { jp: [], ryu: ryuCombos },
  frames:   { jp: jp, ryu: [
    { move:"5中P", type:"通常技", startup:6, active:"", recovery:"", onBlock:2, onHit:5, cancel:"C", damage:"", attribute:"上", note:"※サンプル値" },
  ]},
  setplays: { jp: [], ryu: ryuSetplays },
};

const banner = `/* =====================================================================
 * スト6コンボメーカー  シードデータ
 *  - frames.jp は公式サイト(streetfighter.com)から取得した実データ
 *  - combos / setplays はユーザーが追加していく想定（リュウは例として同梱）
 *  - 他キャラ追加: characters に1行足し、frames/combos 等にキー追加
 * ===================================================================*/

const SF6_DATA = ${JSON.stringify(data, null, 2)};

if (typeof module !== "undefined") { module.exports = SF6_DATA; }
`;

fs.writeFileSync("data.js", banner);
console.log("data.js written. jp frames:", jp.length, "| chars:", data.characters.map(c=>c.id).join(","));
