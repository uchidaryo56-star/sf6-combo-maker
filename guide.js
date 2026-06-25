/* =====================================================================
 * スト6コンボメーカー  初心者ガイドデータ
 *  - order順の段階的ロードマップ。各ステップに図解(SVG)を同梱。
 *  - relatedView を付けると、ガイドからそのタブへワンタップで移動できる。
 *  - 動画は kind:"guideVideos" でアプリ内の動画埋め込み機能を共用する。
 * ===================================================================*/
const SF6_GUIDE = [
  {
    id: "g1", order: 1,
    title: "操作に慣れる（トレーニングモード）",
    summary: "まずは操作とレバー表記に慣れる",
    body: "・モダン操作とクラシック操作の違いを理解し、自分に合う方を選ぶ\n・レバー表記（テンキー）の見方を覚える（下の図解参照）\n・トレーニングモードのコンボトライアルで基本入力に慣れる",
    diagram: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <style>.cell{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .num{fill:var(--text);font-size:30px;font-weight:700;text-anchor:middle}
      .lbl{fill:var(--muted);font-size:12px;text-anchor:middle}</style>
      <rect class="cell" x="0" y="0" width="100" height="100"/>
      <rect class="cell" x="100" y="0" width="100" height="100"/>
      <rect class="cell" x="200" y="0" width="100" height="100"/>
      <rect class="cell" x="0" y="100" width="100" height="100"/>
      <rect class="cell" x="100" y="100" width="100" height="100" fill="var(--accent2)" opacity="0.18"/>
      <rect class="cell" x="200" y="100" width="100" height="100"/>
      <rect class="cell" x="0" y="200" width="100" height="100"/>
      <rect class="cell" x="100" y="200" width="100" height="100"/>
      <rect class="cell" x="200" y="200" width="100" height="100"/>
      <text class="num" x="50" y="45">7</text><text class="lbl" x="50" y="70">斜め後ジャンプ</text>
      <text class="num" x="150" y="45">8</text><text class="lbl" x="150" y="70">ジャンプ</text>
      <text class="num" x="250" y="45">9</text><text class="lbl" x="250" y="70">斜め前ジャンプ</text>
      <text class="num" x="50" y="145">4</text><text class="lbl" x="50" y="170">後ろ（ガード）</text>
      <text class="num" x="150" y="150">5</text><text class="lbl" x="150" y="172">ニュートラル</text>
      <text class="num" x="250" y="145">6</text><text class="lbl" x="250" y="170">前（前進）</text>
      <text class="num" x="50" y="245">1</text><text class="lbl" x="50" y="270">後ろしゃがみ</text>
      <text class="num" x="150" y="245">2</text><text class="lbl" x="150" y="270">しゃがみ</text>
      <text class="num" x="250" y="245">3</text><text class="lbl" x="250" y="270">前しゃがみ</text>
    </svg>`,
  },
  {
    id: "g2", order: 2,
    title: "差し合い・間合いの基礎",
    summary: "中距離の駆け引きの基本を知る",
    body: "・自分の技が当たり相手の技が当たらない距離（間合い）を意識する\n・リーチのある牽制技を置いて相手の接近を抑える\n・相手の技の空振りに差し返す（後で当てる）意識を持つ",
    diagram: `<svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
      <style>.fig{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .lbl{fill:var(--text);font-size:15px;text-anchor:middle}
      .sub{fill:var(--muted);font-size:12px;text-anchor:middle}</style>
      <defs><marker id="ar1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0L10,5L0,10z" fill="var(--accent2)"/></marker></defs>
      <line x1="20" y1="180" x2="620" y2="180" stroke="var(--line)" stroke-width="2"/>
      <rect class="fig" x="70" y="80" width="60" height="100" rx="10"/>
      <rect class="fig" x="510" y="80" width="60" height="100" rx="10"/>
      <text class="lbl" x="100" y="70">自分</text>
      <text class="lbl" x="540" y="70">相手</text>
      <rect x="70" y="190" width="110" height="22" fill="var(--bad)" opacity="0.25"/>
      <text class="sub" x="125" y="206">投げ間合い</text>
      <line x1="150" y1="40" x2="500" y2="40" stroke="var(--accent2)" stroke-width="3" marker-end="url(#ar1)" marker-start="url(#ar1)"/>
      <text class="lbl" x="325" y="28">差し合いの距離</text>
      <text class="sub" x="325" y="200">この距離で牽制を当て合い、空振りに差し返す</text>
    </svg>`,
  },
  {
    id: "g3", order: 3,
    title: "ガードの基礎（中段・下段）",
    summary: "中段・下段の二択を理解する",
    body: "・立ちガードは中段を防げるが、下段には当たってしまう\n・しゃがみガードは下段を防げるが、中段には当たってしまう\n・最初は崩されて当然。中段/下段の意識だけ持って反応練習を積む",
    diagram: `<svg viewBox="0 0 480 260" xmlns="http://www.w3.org/2000/svg">
      <style>.box{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .ttl{fill:var(--text);font-size:15px;font-weight:700;text-anchor:middle}
      .ok{fill:var(--good);font-size:18px;text-anchor:middle}
      .ng{fill:var(--bad);font-size:18px;text-anchor:middle}
      .lbl{fill:var(--muted);font-size:13px;text-anchor:middle}</style>
      <rect class="box" x="20" y="20" width="200" height="220" rx="10"/>
      <rect class="box" x="260" y="20" width="200" height="220" rx="10"/>
      <text class="ttl" x="120" y="45">立ちガード</text>
      <text class="ttl" x="360" y="45">しゃがみガード</text>
      <text class="lbl" x="120" y="85">中段</text><text class="ok" x="120" y="110">○ 防げる</text>
      <text class="lbl" x="120" y="155">下段</text><text class="ng" x="120" y="180">× 当たる</text>
      <text class="lbl" x="360" y="85">中段</text><text class="ng" x="360" y="110">× 当たる</text>
      <text class="lbl" x="360" y="155">下段</text><text class="ok" x="360" y="180">○ 防げる</text>
      <text class="lbl" x="240" y="248">中段/下段を見て二択を防ぐ意識を持つ</text>
    </svg>`,
  },
  {
    id: "g4", order: 4,
    title: "ドライブゲージを理解する",
    summary: "5つの行動が同じゲージを消費すると知る",
    body: "・パリィ／ジャストパリィ／ドライブインパクト／ドライブラッシュ／OD技／リバーサルは全部Dゲージを消費する共通リソース\n・0本になるとバーンアウト（ガークラの危険・OD技が使えない）\n・むやみに使わず、攻めと守りでバランス良く配分する",
    diagram: `<svg viewBox="0 0 640 180" xmlns="http://www.w3.org/2000/svg">
      <style>.lbl{fill:var(--text);font-size:12px;text-anchor:middle}
      .sub{fill:var(--muted);font-size:11px;text-anchor:middle}</style>
      <rect x="20" y="60" width="596" height="40" fill="var(--accent2)" opacity="0.7"/>
      <rect x="20" y="60" width="596" height="40" fill="none" stroke="var(--line)" stroke-width="2"/>
      <line x1="120" y1="60" x2="120" y2="100" stroke="var(--bg)" stroke-width="3"/>
      <line x1="220" y1="60" x2="220" y2="100" stroke="var(--bg)" stroke-width="3"/>
      <line x1="320" y1="60" x2="320" y2="100" stroke="var(--bg)" stroke-width="3"/>
      <line x1="420" y1="60" x2="420" y2="100" stroke="var(--bg)" stroke-width="3"/>
      <line x1="520" y1="60" x2="520" y2="100" stroke="var(--bg)" stroke-width="3"/>
      <text class="lbl" x="70" y="35">パリィ</text>
      <text class="lbl" x="170" y="35">ジャストパリィ</text>
      <text class="lbl" x="270" y="35">ドライブ<tspan x="270" dy="13">インパクト</tspan></text>
      <text class="lbl" x="370" y="35">ドライブ<tspan x="370" dy="13">ラッシュ</tspan></text>
      <text class="lbl" x="470" y="35">OD技</text>
      <text class="lbl" x="570" y="35">リバーサル</text>
      <rect x="20" y="118" width="596" height="22" fill="var(--bad)" opacity="0.25"/>
      <text class="sub" x="318" y="134">0本＝バーンアウト（OD技不可・ガークラの危険）</text>
    </svg>`,
  },
  {
    id: "g5", order: 5,
    title: "確定反撃（確反）の考え方",
    summary: "発生フレームと硬直差を見て判断する",
    body: "・相手の技をガードした時の硬直差と、自分の技の発生フレームを比べる\n・自分の技の発生が、相手の不利フレームより速ければ確定反撃が入る\n・「フレーム」タブの確反逆引きに数値を入れると、使える技が自動で分かる",
    relatedView: "frame", relatedLabel: "フレームタブの確反逆引きを開く",
    diagram: `<svg viewBox="0 0 640 200" xmlns="http://www.w3.org/2000/svg">
      <style>.lbl{fill:var(--text);font-size:13px}.sub{fill:var(--muted);font-size:12px}</style>
      <line x1="40" y1="170" x2="600" y2="170" stroke="var(--line)" stroke-width="2"/>
      <text class="sub" x="40" y="188">ガード成立(0F)</text>
      <rect x="40" y="60" width="260" height="28" fill="var(--bad)" opacity="0.55"/>
      <text class="lbl" x="50" y="50">相手の不利フレーム（硬直差）</text>
      <rect x="40" y="100" width="180" height="28" fill="var(--good)" opacity="0.7"/>
      <text class="lbl" x="50" y="142">自分の技の発生フレーム</text>
      <line x1="220" y1="95" x2="220" y2="160" stroke="var(--good)" stroke-width="2" stroke-dasharray="4 3"/>
      <text class="sub" x="225" y="165">技が届く</text>
      <line x1="300" y1="55" x2="300" y2="160" stroke="var(--bad)" stroke-width="2" stroke-dasharray="4 3"/>
      <text class="sub" x="305" y="50">相手が動ける</text>
      <text class="lbl" x="330" y="118" fill="var(--good)">余裕あり → 確定反撃成立</text>
    </svg>`,
  },
  {
    id: "g6", order: 6,
    title: "コンボを1つ覚えて使う",
    summary: "難しいコンボより再現性を優先する",
    body: "・最初は難易度の低い基本コンボを1つ、完璧に出せるようにする\n・ヒット確認（ヒットした時だけ繋ぐ）を意識する\n・「コンボ」タブで難易度の低いものから練習し、練習済みチェックを使う",
    relatedView: "combo", relatedLabel: "コンボタブを開く",
    diagram: "",
  },
  {
    id: "g7", order: 7,
    title: "起き攻め・セットプレイの基礎",
    summary: "ダウンを取った後の「型」を1つ持つ",
    body: "・ダウンを取ったら毎回同じ手順で攻める「型」を1つ用意する\n・打撃／投げ／シミー（一歩下がって投げ抜けを誘う）の択を使い分ける\n・「セットプレイ」タブで状況別の型を整理しておく",
    relatedView: "setplay", relatedLabel: "セットプレイタブを開く",
    diagram: `<svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
      <style>.fig{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .lbl{fill:var(--text);font-size:13px;text-anchor:middle}
      .sub{fill:var(--muted);font-size:11px;text-anchor:middle}</style>
      <defs><marker id="ar2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0L10,5L0,10z" fill="var(--accent2)"/></marker></defs>
      <rect class="fig" x="20" y="160" width="70" height="20" rx="6"/>
      <text class="lbl" x="55" y="198">ダウン中の相手</text>
      <rect class="fig" x="150" y="120" width="40" height="60" rx="8"/>
      <text class="lbl" x="170" y="112">前ステで近づく</text>
      <path d="M230,140 C280,100 280,60 320,50" stroke="var(--accent2)" stroke-width="2" fill="none" marker-end="url(#ar2)"/>
      <path d="M230,150 C300,150 300,150 320,140" stroke="var(--accent2)" stroke-width="2" fill="none" marker-end="url(#ar2)"/>
      <path d="M230,160 C280,200 280,210 320,210" stroke="var(--accent2)" stroke-width="2" fill="none" marker-end="url(#ar2)"/>
      <rect class="fig" x="330" y="20" width="90" height="40" rx="8"/><text class="lbl" x="375" y="44">打撃</text>
      <rect class="fig" x="330" y="120" width="90" height="40" rx="8"/><text class="lbl" x="375" y="144">投げ</text>
      <rect class="fig" x="330" y="195" width="90" height="22" rx="6"/><text class="sub" x="375" y="209">シミー</text>
    </svg>`,
  },
  {
    id: "g8", order: 8,
    title: "対戦して振り返る",
    summary: "対戦数を増やし、負けをデータにする",
    body: "・初心者の練習は、対戦数を増やすこと自体が一番の練習になる\n・負けても気にしすぎず、原因を一言でメモしてデータとして残す\n・「マッチアップメモ」タブで対キャラごとの気づきを書き溜める",
    relatedView: "notes", relatedLabel: "マッチアップメモタブを開く",
    diagram: `<svg viewBox="0 0 520 200" xmlns="http://www.w3.org/2000/svg">
      <style>.node{fill:var(--panel2);stroke:var(--accent2);stroke-width:2}
      .lbl{fill:var(--text);font-size:14px;text-anchor:middle}</style>
      <defs><marker id="ar3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0L10,5L0,10z" fill="var(--muted)"/></marker></defs>
      <rect class="node" x="20"  y="80" width="100" height="50" rx="10"/><text class="lbl" x="70" y="110">対戦する</text>
      <rect class="node" x="160" y="20" width="100" height="50" rx="10"/><text class="lbl" x="210" y="50">気づきを得る</text>
      <rect class="node" x="300" y="80" width="100" height="50" rx="10"/><text class="lbl" x="350" y="110">メモする</text>
      <rect class="node" x="160" y="140" width="100" height="50" rx="10"/><text class="lbl" x="210" y="170">練習する</text>
      <path d="M100,90 C120,60 140,50 160,45" stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#ar3)"/>
      <path d="M260,45 C280,50 300,60 320,80" stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#ar3)"/>
      <path d="M340,130 C320,150 280,160 260,162" stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#ar3)"/>
      <path d="M160,162 C120,160 100,140 80,130" stroke="var(--muted)" stroke-width="2" fill="none" marker-end="url(#ar3)"/>
    </svg>`,
  },
];

if (typeof module !== "undefined") { module.exports = SF6_GUIDE; }
