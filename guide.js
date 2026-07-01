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
    body: "・モダン操作とクラシック操作の違いを理解し、自分に合う方を選ぶ\n・レバー表記（テンキー）の見方を覚える。数字とレバーを倒す方向（矢印）は1P・2Pで同じだが、「前」「後ろ」の意味だけ左右で入れ替わる（下の図解参照）\n・トレーニングモードのコンボトライアルで基本入力に慣れる",
    diagram: `<svg viewBox="-30 0 630 345" xmlns="http://www.w3.org/2000/svg">
      <style>.cell{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .num{fill:var(--text);font-size:22px;font-weight:700;text-anchor:middle}
      .lbl{fill:var(--muted);font-size:11px;text-anchor:middle}
      .hdr{fill:var(--text);font-size:15px;font-weight:700;text-anchor:middle}
      .note{fill:var(--muted);font-size:12px;text-anchor:middle}</style>
      <text class="hdr" x="129" y="22">1P（画面左側）</text>
      <text class="hdr" x="437" y="22">2P（画面右側）</text>

      <rect class="cell" x="0" y="50" width="86" height="86"/>
      <rect class="cell" x="86" y="50" width="86" height="86"/>
      <rect class="cell" x="172" y="50" width="86" height="86"/>
      <rect class="cell" x="0" y="136" width="86" height="86"/>
      <rect class="cell" x="86" y="136" width="86" height="86" fill="var(--accent2)" opacity="0.18"/>
      <rect class="cell" x="172" y="136" width="86" height="86"/>
      <rect class="cell" x="0" y="222" width="86" height="86"/>
      <rect class="cell" x="86" y="222" width="86" height="86"/>
      <rect class="cell" x="172" y="222" width="86" height="86"/>
      <text class="num" x="43" y="92">7 ↖</text><text class="lbl" x="43" y="112">斜め後ジャンプ</text>
      <text class="num" x="129" y="92">8 ↑</text><text class="lbl" x="129" y="112">ジャンプ</text>
      <text class="num" x="215" y="92">9 ↗</text><text class="lbl" x="215" y="112">斜め前ジャンプ</text>
      <text class="num" x="43" y="178">4 ←</text><text class="lbl" x="43" y="198">後ろ<tspan x="43" dy="13">（ガード）</tspan></text>
      <text class="num" x="129" y="183">5</text><text class="lbl" x="129" y="200">ニュートラル</text>
      <text class="num" x="215" y="178">6 →</text><text class="lbl" x="215" y="198">前<tspan x="215" dy="13">（前進）</tspan></text>
      <text class="num" x="43" y="264">1 ↙</text><text class="lbl" x="43" y="284">後ろしゃがみ<tspan x="43" dy="13">（ガード）</tspan></text>
      <text class="num" x="129" y="269">2 ↓</text><text class="lbl" x="129" y="286">しゃがみ</text>
      <text class="num" x="215" y="264">3 ↘</text><text class="lbl" x="215" y="284">前しゃがみ</text>

      <rect class="cell" x="308" y="50" width="86" height="86"/>
      <rect class="cell" x="394" y="50" width="86" height="86"/>
      <rect class="cell" x="480" y="50" width="86" height="86"/>
      <rect class="cell" x="308" y="136" width="86" height="86"/>
      <rect class="cell" x="394" y="136" width="86" height="86" fill="var(--accent2)" opacity="0.18"/>
      <rect class="cell" x="480" y="136" width="86" height="86"/>
      <rect class="cell" x="308" y="222" width="86" height="86"/>
      <rect class="cell" x="394" y="222" width="86" height="86"/>
      <rect class="cell" x="480" y="222" width="86" height="86"/>
      <text class="num" x="351" y="92">7 ↖</text><text class="lbl" x="351" y="112">斜め前ジャンプ</text>
      <text class="num" x="437" y="92">8 ↑</text><text class="lbl" x="437" y="112">ジャンプ</text>
      <text class="num" x="523" y="92">9 ↗</text><text class="lbl" x="523" y="112">斜め後ジャンプ</text>
      <text class="num" x="351" y="178">4 ←</text><text class="lbl" x="351" y="198">前<tspan x="351" dy="13">（前進）</tspan></text>
      <text class="num" x="437" y="183">5</text><text class="lbl" x="437" y="200">ニュートラル</text>
      <text class="num" x="523" y="178">6 →</text><text class="lbl" x="523" y="198">後ろ<tspan x="523" dy="13">（ガード）</tspan></text>
      <text class="num" x="351" y="264">1 ↙</text><text class="lbl" x="351" y="284">前しゃがみ</text>
      <text class="num" x="437" y="269">2 ↓</text><text class="lbl" x="437" y="286">しゃがみ</text>
      <text class="num" x="523" y="264">3 ↘</text><text class="lbl" x="523" y="284">後ろしゃがみ<tspan x="523" dy="13">（ガード）</tspan></text>

      <text class="note" x="283" y="332">数字と矢印は1P・2Pで同じ。「前」「後ろ」の意味（ラベル）だけが左右で入れ替わる</text>
    </svg>`,
  },
  {
    id: "g10", order: 8,
    title: "読み合いの基本（三すくみ・通称じゃんけん）",
    summary: "打撃・投げ・ガードはじゃんけんと同じ三すくみ",
    body: "・打撃は投げに勝つ（投げようとした相手に技を当てられる）\n・投げはガードに勝つ（投げはガードでは防げない）\n・ガードは打撃に勝つ（ガードしていれば打撃は防げる）\n・SF6ではガードの代わりに「パリィ」も選べるが、パリィも投げには弱い（投げられてしまう）ので、結局この三すくみが土台になる\n・読み合いは「相手キャラの性能」「残りゲージ・体力」「画面位置」などから次の一手を予測して的を絞ると勝率が上がる",
    diagram: `<svg viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg">
      <style>.node{fill:var(--panel2);stroke:var(--accent2);stroke-width:2}
      .lbl{fill:var(--text);font-size:18px;font-weight:700;text-anchor:middle}
      .arc{stroke:var(--accent2);stroke-width:2.5;fill:none}
      .at{fill:var(--muted);font-size:13px;text-anchor:middle}</style>
      <defs><marker id="arJk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0L10,5L0,10z" fill="var(--accent2)"/></marker></defs>
      <circle class="node" cx="280" cy="60" r="55"/><text class="lbl" x="280" y="66">ガード</text>
      <circle class="node" cx="110" cy="300" r="55"/><text class="lbl" x="110" y="306">打撃</text>
      <circle class="node" cx="450" cy="300" r="55"/><text class="lbl" x="450" y="306">投げ</text>
      <path class="arc" d="M250,105 C190,170 160,220 135,250" marker-end="url(#arJk)"/>
      <text class="at" x="155" y="190">ガードは打撃に勝つ</text>
      <path class="arc" d="M165,300 C260,300 300,300 395,300" marker-end="url(#arJk)"/>
      <text class="at" x="280" y="325">打撃は投げに勝つ</text>
      <path class="arc" d="M425,250 C400,220 370,170 310,105" marker-end="url(#arJk)"/>
      <text class="at" x="405" y="190">投げはガードに勝つ</text>
      <text class="at" x="280" y="385" fill="var(--bad)">※パリィもこの三すくみに乗っている（投げには弱い）</text>
    </svg>`,
  },
  {
    id: "g2", order: 9,
    title: "差し合い・間合いの基礎（立ち回り応用）",
    summary: "中距離の駆け引きの基本を知る",
    body: "・自分の技が当たり相手の技が当たらない距離（間合い）を意識する\n・リーチのある牽制技を置いて相手の接近を抑える\n・相手の技の空振りに差し返す（後で当てる）意識を持つ\n・読み合いは「相手キャラの性能」「残りドライブゲージ・体力」「画面位置（端に近いか）」から相手の行動を予測すると精度が上がる\n・前歩きで届かない／相手の牽制が長すぎて差し合いにならない距離は、ドライブラッシュで一気に詰めるのも有効",
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
    id: "g9", order: 2,
    title: "対戦中にやることチェックリスト（とりあえずこれだけ）",
    summary: "深く考えず、この5つだけ意識すれば勝てて楽しい",
    body: "・技が当たったら、覚えた1つのコンボで確実に締める（無理に難しい技を狙わない）\n・相手の技をガードできたら、反射で一番発生が速い技を1発入れる（それだけで上位の確定反撃になる）\n・ガードはしゃがみガード固定でOK。中段が当たるのは仕方ないと割り切る（反応で切り替えるのは後でいい）\n・ダウンを取ったら、覚えた1つの起き攻めの型を毎回同じように仕掛ける\n・勝ち負けより「技を当てる／反応する回数」を増やすことを優先する。それが一番の練習になる",
    diagram: `<svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
      <style>.row{fill:var(--panel2);stroke:var(--line);stroke-width:1.5}
      .chk{fill:var(--good);font-size:22px;font-weight:700;text-anchor:middle}
      .txt{fill:var(--text);font-size:15px}</style>
      <rect class="row" x="20" y="10" width="600" height="44" rx="8"/>
      <text class="chk" x="50" y="40">✓</text>
      <text class="txt" x="80" y="38">技が当たったら、覚えた1つのコンボで締める</text>
      <rect class="row" x="20" y="64" width="600" height="44" rx="8"/>
      <text class="chk" x="50" y="94">✓</text>
      <text class="txt" x="80" y="92">ガードできたら、一番速い技で殴り返す</text>
      <rect class="row" x="20" y="118" width="600" height="44" rx="8"/>
      <text class="chk" x="50" y="148">✓</text>
      <text class="txt" x="80" y="146">ガードはしゃがみ固定でOK。中段は当たって割り切る</text>
      <rect class="row" x="20" y="172" width="600" height="44" rx="8"/>
      <text class="chk" x="50" y="202">✓</text>
      <text class="txt" x="80" y="200">ダウンを取ったら、同じ起き攻めの型を仕掛ける</text>
      <rect class="row" x="20" y="226" width="600" height="44" rx="8"/>
      <text class="chk" x="50" y="256">✓</text>
      <text class="txt" x="80" y="254">勝敗より「当てる／反応する回数」を増やす</text>
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
    summary: "6つの行動が同じゲージを消費すると知る",
    body: "・パリィ／ジャストパリィ／ドライブインパクト／ドライブラッシュ／OD技／ドライブリバーサルは全部Dゲージを消費する共通リソース\n・0本になるとバーンアウト。OD技が使えなくなり、壁際でドライブインパクトを受けるとスタンしてしまう危険がある\n・むやみに使わず、攻めと守りでバランス良く配分する",
    diagram: `<svg viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">
      <style>.seg{fill:var(--accent2);opacity:0.7}
      .segline{stroke:var(--bg);stroke-width:3}
      .lbl{fill:var(--text);font-size:13px;text-anchor:middle}
      .sub{fill:var(--muted);font-size:11px;text-anchor:middle}
      .chip{fill:var(--panel2);stroke:var(--line);stroke-width:1.5}
      .chiptxt{fill:var(--text);font-size:12px;text-anchor:middle}</style>
      <rect x="20" y="20" width="600" height="40" class="seg"/>
      <rect x="20" y="20" width="600" height="40" fill="none" stroke="var(--line)" stroke-width="2"/>
      <line x1="120" y1="20" x2="120" y2="60" class="segline"/>
      <line x1="220" y1="20" x2="220" y2="60" class="segline"/>
      <line x1="320" y1="20" x2="320" y2="60" class="segline"/>
      <line x1="420" y1="20" x2="420" y2="60" class="segline"/>
      <line x1="520" y1="20" x2="520" y2="60" class="segline"/>
      <text class="sub" x="320" y="78">ドライブゲージ（6本）</text>
      <text class="lbl" x="320" y="105" font-weight="700">この6つの行動が同じゲージを消費する</text>
      <rect class="chip" x="40"  y="120" width="170" height="36" rx="8"/><text class="chiptxt" x="125" y="143">パリィ</text>
      <rect class="chip" x="230" y="120" width="170" height="36" rx="8"/><text class="chiptxt" x="315" y="143">ジャストパリィ</text>
      <rect class="chip" x="420" y="120" width="170" height="36" rx="8"/><text class="chiptxt" x="505" y="143">ドライブインパクト</text>
      <rect class="chip" x="40"  y="166" width="170" height="36" rx="8"/><text class="chiptxt" x="125" y="189">ドライブラッシュ</text>
      <rect class="chip" x="230" y="166" width="170" height="36" rx="8"/><text class="chiptxt" x="315" y="189">OD技</text>
      <rect class="chip" x="420" y="166" width="170" height="36" rx="8"/><text class="chiptxt" x="505" y="189">ドライブリバーサル</text>
      <rect x="20" y="212" width="600" height="22" fill="var(--bad)" opacity="0.25"/>
      <text class="sub" x="320" y="228">0本＝バーンアウト（OD技不可・壁際でドライブインパクトを受けるとスタンの危険）</text>
    </svg>`,
  },
  {
    id: "g5", order: 5,
    title: "確定反撃（確反）の考え方",
    summary: "「相手が動けない時間」に技を当てる",
    body: "■ 確定反撃とは\n相手の技をガードした後、「絶対に当たる反撃」を入れること。\n相手が技を振ると、振り終わった直後に必ず「動けない時間（不利フレーム）」が生まれる。その間に自分の技を出せば、確実にヒットする。\n\n■ 見方（シンプル版）\n・「相手の不利F」 ＝ 相手が固まっている時間（フレームタブのガード欄のマイナス値）\n・「発生F」 ＝ 自分の技が当たるまでの時間\n・発生F ≦ 不利F の絶対値 → 確定で当たる！\n\n■ 具体例\n相手が -10F の技をガードされた → 発生10F以内の技なら確定で当たる。発生14Fの技は間に合わない（相手が先に動ける）。\n\n■ まず覚えること\n「ガードしたらとりあえず最速の弱攻撃を1発入れる」だけでOK。フレームタブの「確反逆引き」に相手の不利Fを入力すると、使える技が一覧で出てくる。",
    relatedView: "frame", relatedLabel: "フレームタブの確反逆引きを開く",
    diagram: `<div style="font-size:13px;font-family:inherit">
  <div style="font-weight:700;margin-bottom:10px;color:var(--text)">ガード後のフレーム（1マス＝1F）</div>
  <div style="display:flex;align-items:center;gap:6px;margin:5px 0;flex-wrap:nowrap">
    <span style="min-width:72px;font-size:11px;color:var(--text);flex:none">相手の硬直</span>
    <div style="display:flex;gap:2px;flex:none"><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.75;border-radius:2px"></div></div>
    <div style="width:2px;height:24px;background:var(--accent2);border-radius:1px;flex:none"></div>
    <div style="width:78px;flex:none"></div>
    <span style="font-size:10px;color:var(--muted)">← -10F（動けない）</span>
  </div>
  <div style="display:flex;align-items:center;gap:6px;margin:5px 0;flex-wrap:nowrap">
    <span style="min-width:72px;font-size:11px;color:var(--text);flex:none">発生10F</span>
    <div style="display:flex;gap:2px;flex:none"><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--good);opacity:.85;border-radius:2px"></div></div>
    <div style="width:2px;height:24px;background:var(--accent2);border-radius:1px;flex:none"></div>
    <div style="width:78px;flex:none"></div>
    <span style="font-size:11px;font-weight:700;color:var(--good)">✓ 確定○（収まる）</span>
  </div>
  <div style="display:flex;align-items:center;gap:6px;margin:5px 0;flex-wrap:nowrap">
    <span style="min-width:72px;font-size:11px;color:var(--text);flex:none">発生14F</span>
    <div style="display:flex;gap:2px;flex:none"><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div><div style="width:18px;height:20px;background:var(--panel2);border:1px solid var(--line);border-radius:2px"></div></div>
    <div style="width:2px;height:24px;background:var(--accent2);border-radius:1px;flex:none"></div>
    <div style="display:flex;gap:2px;flex:none"><div style="width:18px;height:20px;background:var(--bad);opacity:.5;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.5;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.5;border-radius:2px"></div><div style="width:18px;height:20px;background:var(--bad);opacity:.5;border-radius:2px"></div></div>
    <span style="font-size:11px;font-weight:700;color:var(--bad)">✗ 確定×</span>
  </div>
  <div style="border-top:1px solid var(--line);margin:14px 0"></div>
  <div style="font-weight:700;margin-bottom:8px;color:var(--text)">例：相手の技が -10F の場合（技表で見ると）</div>
  <table style="width:100%;border-collapse:collapse;font-size:12px">
    <thead>
      <tr style="background:var(--panel2)">
        <th style="text-align:left;padding:6px 8px;border:1px solid var(--line);color:var(--text);font-weight:700">技の速さ</th>
        <th style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--text);font-weight:700">発生F</th>
        <th style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--text);font-weight:700">確定反撃</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:6px 8px;border:1px solid var(--line);color:var(--text)">弱攻撃（速い）</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--text)">4F</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--good);font-weight:700">✓ 確定○</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid var(--line);color:var(--text)">中攻撃（ちょうど）</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--text)">10F</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--good);font-weight:700">✓ 確定○（ぎりぎり）</td>
      </tr>
      <tr>
        <td style="padding:6px 8px;border:1px solid var(--line);color:var(--text)">強攻撃（遅い）</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--text)">14F</td>
        <td style="text-align:center;padding:6px 8px;border:1px solid var(--line);color:var(--bad);font-weight:700">✗ 確定×</td>
      </tr>
    </tbody>
  </table>
  <p style="color:var(--muted);font-size:11px;margin:8px 0 0">フレームタブの「確反逆引き」に不利Fを入力すると使える技が一覧で出る</p>
</div>`,
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
    title: "起き攻め・セットプレイの考え方",
    summary: "3択それぞれが「何に勝つか」を知る",
    body: "ダウンを取った後に仕掛ける攻めのこと。基本は3択で、それぞれ「勝てる相手の行動」が違う。\n\n● 打撃を重ねる\n→ 起き上がりにボタンを押してくる相手に勝つ\n（例：相手が暴れで技を出そうとした瞬間に打撃が当たる）\n\n● 投げる\n→ ガードして固まっている相手に勝つ\n（例：怖くてじっとしている相手を掴む）\n\n● シミー（わざと一歩下がる）\n→ 無敵技・投げ抜け・遅らせ投げをしてくる相手に勝つ\n（例：相手が投げ抜けや無敵技を出した瞬間を空振りさせ、その硬直に反撃する）\n\n相手の癖に合わせて3択を使い分けるのが起き攻め。毎回同じ「型」で攻めると考える負担が減って安定する。",
    relatedView: "setplay", relatedLabel: "セットプレイタブを開く",
    diagram: `<svg viewBox="0 0 580 300" xmlns="http://www.w3.org/2000/svg">
      <style>.fig{fill:var(--panel2);stroke:var(--line);stroke-width:2}
      .lbl{fill:var(--text);font-size:14px;font-weight:700;text-anchor:middle}
      .win{fill:var(--good);font-size:11px;text-anchor:middle}
      .arrow{stroke:var(--accent2);stroke-width:2;fill:none}</style>
      <defs><marker id="arOki2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0L10,5L0,10z" fill="var(--accent2)"/></marker></defs>
      <rect class="fig" x="20" y="120" width="130" height="48" rx="10"/>
      <text class="lbl" x="85" y="149">ダウンした相手</text>
      <path class="arrow" d="M150,130 C210,90 280,70 340,60" marker-end="url(#arOki2)"/>
      <path class="arrow" d="M150,144 L340,144" marker-end="url(#arOki2)"/>
      <path class="arrow" d="M150,158 C210,200 280,220 340,232" marker-end="url(#arOki2)"/>
      <rect class="fig" x="350" y="36" width="210" height="48" rx="10"/>
      <text class="lbl" x="455" y="58">打撃を重ねる</text>
      <text class="win" x="455" y="75">→ 暴れてくる相手に勝つ</text>
      <rect class="fig" x="350" y="120" width="210" height="48" rx="10"/>
      <text class="lbl" x="455" y="142">投げる</text>
      <text class="win" x="455" y="159">→ 固まってる相手に勝つ</text>
      <rect class="fig" x="350" y="208" width="210" height="48" rx="10"/>
      <text class="lbl" x="455" y="228">シミー（下がる）</text>
      <text class="win" x="455" y="245">→ 無敵・投げ抜けに勝つ</text>
    </svg>`,
  },
  {
    id: "g8", order: 10,
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
