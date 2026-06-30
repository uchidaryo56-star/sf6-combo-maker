// jp_parsed.json / ryu_parsed.json と既存サンプルから data.js を生成
const fs = require("fs");
const jp = JSON.parse(fs.readFileSync("jp_parsed.json", "utf8"));
const ryu = JSON.parse(fs.readFileSync("ryu_parsed.json", "utf8"));
const guile = JSON.parse(fs.readFileSync("guile_parsed.json", "utf8"));
const terry = JSON.parse(fs.readFileSync("terry_parsed.json", "utf8"));

// リュウのサンプルデータ（コンボ/セットプレイの例。フレームはJPのみ実数値）
const ryuCombos = [
  { id:"ryu-c1", name:"基本中央ヒット確認", start:"通常ヒット", notation:"2中K > 弱波動拳", damage:1300, drive:0, super:1, difficulty:1, position:"中央", video:"", note:"削り・牽制から。安全に締める基本。" },
  { id:"ryu-c2", name:"パニカン standard", start:"パニッシュカウンター", notation:"中P > 5中P > 強昇龍拳", damage:2600, drive:1, super:2, difficulty:2, position:"中央", video:"", note:"確反からの基本火力。" },
  { id:"ryu-c3", name:"ドライブラッシュ始動", start:"ドライブラッシュ", notation:"DR中P > 大P > 中竜巻 > OD昇龍", damage:3400, drive:3, super:2, difficulty:3, position:"中央", video:"", note:"ゲージ使用の主力。運び込み。" },
];
const ryuSetplays = [
  { id:"ryu-s1", situation:"中央 強昇龍ダウン後", setup:"前ステップ x2", mixup:"打撃(2中K) / 投げ の二択", video:"", timestamp:"", note:"基本の重ね。" },
];

// 公式サイト(streetfighter.com)掲載順の全キャラクター
// キャラ別にコンボ/セットプレイ/フレームを追加していける（未登録キャラは空リストとして動作）
const palette = ["#d23b3b","#3b78d2","#3bbf6f","#e0a52a","#9b59b6","#1abc9c","#e0533b","#5b6cd2","#cc6fa8","#4a9bd1"];
const characters = [
  ["ryu","リュウ"], ["luke","ルーク"], ["jamie","ジェイミー"], ["chunli","春麗"], ["guile","ガイル"],
  ["kimberly","キンバリー"], ["juri","ジュリ"], ["ken","ケン"], ["blanka","ブランカ"], ["dhalsim","ダルシム"],
  ["ehonda","エドモンド本田"], ["deejay","ディージェイ"], ["manon","マノン"], ["marisa","マリーザ"], ["jp","JP"],
  ["zangief","ザンギエフ"], ["lily","リリー"], ["cammy","キャミィ"], ["rashid","ラシード"], ["aki","A.K.I."],
  ["ed","ED"], ["gouki_akuma","豪鬼"], ["vega_mbison","ベガ"], ["terry","テリー"], ["mai","舞"],
  ["elena","エレナ"], ["sagat","サガット"], ["cviper","C.ヴァイパー"], ["alex","アレックス"], ["ingrid","イングリッド"],
].map(([id,name],i)=>({ id, name, color: palette[i % palette.length] }));

// ---- おすすめ動画 シードデータ ----
// ここに追加したURLはGitHub Pagesにpushすると全ユーザーに表示される。
// id は "rvs-数字" 形式を使うこと（ユーザー追加の "rv-" と区別するため）。
// group は自由入力（例: "入門", "リュウ", "差し合い" など）
const seedRecVideos = [
  { id:"rvs-1", title:"【SF6、スト6】初心者向け！まず最初に覚えるべき事＆おすすめゲーム内設定！", url:"https://www.youtube.com/watch?v=MXhbzQYukHM&source_ve_path=MTc4NDI0", group:"始めたら見る動画" },
  { id:"rvs-2", title:"「選択肢が少ないんじゃなく有効に使えていないだけ」格闘ゲームの基本の戦い方を解説するマゴさん【ストリートファイター6】", url:"https://www.youtube.com/watch?v=EWz-LHZWYlQ&source_ve_path=MTc4NDI0", group:"慣れてきたら必ず一度は見る動画" },
  { id:"rvs-3", title:"【スト6、SF6】脱初心者のためにやめるべき事5選！", url:"https://www.youtube.com/watch?v=Qi4kyyYcpgI", group:"始めたら見る動画" },
];

const data = {
  characters,
  combos:     { jp: [], ryu: ryuCombos },
  frames:     { jp: jp, ryu: ryu, guile: guile, terry: terry },
  setplays:   { jp: [], ryu: ryuSetplays },
  recVideos:  seedRecVideos,
};

const banner = `/* =====================================================================
 * スト6コンボメーカー  シードデータ
 *  - frames.jp / frames.ryu / frames.guile / frames.terry は公式サイト(streetfighter.com)から取得した実データ
 *  - combos / setplays はユーザーが追加していく想定（リュウは例として同梱）
 *  - recVideos: gen_data.js の seedRecVideos に追記 → node gen_data.js → push で全ユーザーに反映
 *  - 他キャラ追加: characters に1行足し、frames/combos 等にキー追加
 * ===================================================================*/

const SF6_DATA = ${JSON.stringify(data, null, 2)};

if (typeof module !== "undefined") { module.exports = SF6_DATA; }
`;

fs.writeFileSync("data.js", banner);
console.log("data.js written. jp:", jp.length, "| ryu:", ryu.length, "| guile:", guile.length, "| terry:", terry.length, "| chars:", data.characters.map(c=>c.id).join(","));
