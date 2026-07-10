// クラシックコマンド → commandModern 自動生成
//   既存8キャラ（jp/ryu/guile/terry/cviper/zangief/ed/ingrid）と同じ表記規則:
//   - 通常技: P系= modern_X / K系= modern_auto,modern_X（しゃがみは key-d 前置、ジャンプはラベル）
//   - 必殺技: 方向キー列 + modern_l/m/h（+はレンダラー側で自動付与）
//   - OD技:  modern_auto,modern_sp> 方向キー列 + icon_punch/icon_kick ×2
//   - セグメント区切りは '>'、ラベルは '|' 以降
const D = { '1':'key-dl','2':'key-d','3':'key-dr','4':'key-l','5':'key-nutral','6':'key-r','7':'key-ul','8':'key-u','9':'key-ur' };
const STR = { '弱':'l', '中':'m', '強':'h' };

function dirsToKeys(digits){
  return digits.split('').map(d => D[d]).filter(Boolean);
}

// 1ステージ分（'>'区切りの1つ）を変換。戻り値 {tokens:[], labels:[]}
function convertStage(stage, ctx){
  const labels = [];
  let s = stage.trim();

  // 条件（...）はラベルへ
  s = s.replace(/（([^）]*)）/g, (_, c) => { labels.push(c); return ''; }).trim();

  // ホールド表記はラベルへ
  let hold = false;
  s = s.replace(/ホールド長押し|ホールド/g, m => { hold = true; labels.push(m); return ''; }).trim();

  if(!s) return { tokens: [], labels };

  const tokens = [];

  // 「N / N+BB」（前投げ/後ろ投げ等の or 表記）
  const orMatch = s.match(/^([1-9]*)\s*\/\s*([1-9]+)\+(.+)$/);
  if(orMatch){
    const [ , d1, d2, rest ] = orMatch;
    if(d1) tokens.push(...dirsToKeys(d1)); else tokens.push('key-nutral');
    tokens.push('key-or');
    tokens.push(...dirsToKeys(d2));
    tokens.push(...convertButtons(rest, ctx, labels));
    return { tokens, labels };
  }

  // チャージ [4]6+B / [2]8+B
  const chargeMatch = s.match(/^\[([1-9])\]([1-9]+)(?:\+(.+))?$/);
  if(chargeMatch){
    const [ , c, dirs, rest ] = chargeMatch;
    tokens.push(...dirsToKeys(c));
    tokens.push(...dirsToKeys(dirs));
    if(rest) tokens.push(...convertButtons(rest, ctx, labels));
    return { tokens, labels };
  }

  // 360/720（スクリュー系）
  s = s.replace(/720/, '4123641236').replace(/360/, '41236');

  // 通常形: [dirs+]buttons / dirsのみ
  const m = s.match(/^([1-9]+)?\+?(.*)$/);
  if(m){
    const [ , dirs, rest ] = m;
    if(dirs) tokens.push(...dirsToKeys(dirs));
    if(rest) tokens.push(...convertButtons(rest, ctx, labels));
  }
  return { tokens, labels };
}

// ボタン部分の変換。ctx.type によって通常技/必殺技等の規則を切替
function convertButtons(str, ctx, labels){
  const tokens = [];
  let s = str.trim();
  if(!s) return tokens;

  // OD: 同種2ボタン（PP, KK, 弱P中P, 弱K強K, PPP, KKK）
  const btns = [...s.matchAll(/(弱|中|強)?(P|K)/g)];
  const allP = btns.length > 0 && btns.every(b => b[2] === 'P');
  const allK = btns.length > 0 && btns.every(b => b[2] === 'K');

  if(btns.length >= 2 && (allP || allK) && !(btns.length === 2 && ctx.type === '通常投げ')){
    // 同種複数ボタン = OD/SA系 → 公式は icon_punch/icon_kick ×2
    const icon = allP ? 'icon_punch' : 'icon_kick';
    tokens.push(icon, icon);
    return tokens;
  }

  if(btns.length === 2 && ctx.type === '通常投げ'){
    // 投げ（弱P弱K想定 or LP+LK）
    tokens.push('modern_l', 'modern_m');
    return tokens;
  }

  if(btns.length === 1){
    const [ , st, pk ] = btns[0];
    if(st){
      const suffix = STR[st];
      if(ctx.type === '通常技' && pk === 'K'){
        tokens.push('modern_auto', 'modern_' + suffix);
      } else {
        tokens.push('modern_' + suffix);
      }
      labels.push(st);
    } else {
      // 強弱なしの単独P/K → SPボタン
      tokens.push('modern_sp');
    }
    return tokens;
  }

  // ボタンなし（テキストのみ）→ ラベルへ
  if(s) labels.push(s);
  return tokens;
}

// システム技は技名キーワードで固定マッピング
function systemModern(move){
  const M = [
    [/^前方ステップ/,        'key-r,key-r'],
    [/^後方ステップ/,        'key-l,key-l'],
    [/ドライブインパクト/,    'modern_dl'],
    [/\[ガード時\]ドライブリバーサル/, 'key-r,modern_dl|ガード中orドライブパリィ成立中に'],
    [/\[起き上がり時\]ドライブリバーサル/, 'key-r,modern_dl|起き上がり時に'],
    [/ドライブリバーサル/,    'key-r,modern_dl'],
    [/ジャストパリィ（打撃）/, 'modern_dp|ガード方向'],
    [/ジャストパリィ/,        'modern_dp'],
    [/ドライブパリィ/,        'modern_dp'],
    [/^パリィドライブラッシュ/,'key-r,key-r|ドライブパリィ中に'],
    [/^キャンセルドライブラッシュ/,'key-r,key-r,key-or,key-nutral,key-or,key-r,modern_dp|必殺技キャンセル可能な攻撃ヒット中に'],
  ];
  for(const [re, v] of M) if(re.test(move)) return v;
  return null;
}

// メイン変換: 技1件 → commandModern文字列
function toModern(mv){
  const cmd = (mv.command || '').trim();
  if(!cmd || cmd === '-') return '';

  if(mv.type === '共通システム'){
    const sys = systemModern(mv.move);
    if(sys) return sys;
  }

  const isOD = /^OD /.test(mv.move) || /(弱|中|強)(P|K)(弱|中|強)(P|K)/.test(cmd) ||
               /(^|\+)(PP|KK)(?![PK])/.test(cmd.replace(/（[^）]*）/g,''));

  const stages = cmd.split('>');
  const outStages = [];
  const allLabels = [];

  for(const st of stages){
    const { tokens, labels } = convertStage(st, { type: mv.type });
    allLabels.push(...labels);
    if(tokens.length) outStages.push(tokens.join(','));
  }

  if(!outStages.length) return allLabels.length ? '|' + allLabels.join('') : '';

  let result = outStages.join('>');

  // OD技は modern_auto,modern_sp> を前置（既に方向/ボタンのみの場合）
  if(isOD && (result.includes('icon_punch') || result.includes('icon_kick'))){
    result = 'modern_auto,modern_sp>' + result;
  }

  // 通常技のしゃがみ/ジャンプ/立ちのラベル調整
  const label = allLabels.join('');
  return label ? result + '|' + label : result;
}

module.exports = { toModern };

// CLI: node gen_modern.js <slug> でプレビュー
if(require.main === module){
  const slug = process.argv[2] || 'luke';
  const data = require('./' + slug + '_parsed.json');
  data.forEach(mv => {
    console.log(`${mv.type} | ${mv.move} | ${mv.command} => ${toModern(mv)}`);
  });
}
