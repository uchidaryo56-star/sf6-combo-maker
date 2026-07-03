const fs = require('fs');
let src = fs.readFileSync('data.js', 'utf8');

const modernMap = {
  '立ち弱P（ジャブ）': 'modern_l|弱',
  '立ち弱K（ローキック）': 'modern_auto,modern_l|弱',
  '立ち中P（鉤突き）': 'modern_m|中',
  '立ち強P（正拳突き）': 'modern_h|強',
  'しゃがみ弱P（ジャブ）': 'key-d,modern_l>key-d,modern_l|弱弱',
  'しゃがみ弱K（キック）': 'key-d,modern_l|弱',
  'しゃがみ中P（ストレート）': 'modern_auto,modern_m|中',
  'しゃがみ中K（くるぶしキック）': 'key-d,modern_m|中',
  'しゃがみ強P（突き上げアッパー）': 'key-d,modern_h|強',
  'ジャンプ弱P（肘落とし）': 'modern_l|ジャンプ中に弱',
  'ジャンプ弱K（ひざ蹴り）': 'modern_auto,modern_l|ジャンプ中に弱',
  'ジャンプ中P（すくい突き）': 'modern_m|ジャンプ中に中',
  'ジャンプ中K（飛び蹴り）': 'modern_auto,modern_m|ジャンプ中に中',
  'ジャンプ強P（ストレート）': 'modern_auto,modern_h|ジャンプ中に強',
  'ジャンプ強K（跳び前蹴り）': 'modern_h|ジャンプ中に強',
  '鎖骨割り': 'key-r,modern_m|中',
  '鳩尾砕き': 'modern_auto,modern_h|強',
  'かかと落とし': 'key-l,modern_h|強',
  '旋風脚': 'key-r,modern_h|強',
  '回転足払い': 'key-dr,modern_h|強',
  '上段二連撃': 'modern_h>modern_h|強強',
  '不破三連撃（2段目）': 'modern_m>modern_m|中中',
  '不破三連撃（3段目）': 'modern_m>modern_m>modern_m|中中中',
  '弱 波動拳': 'key-d,key-dr,key-r,modern_l|弱',
  '中 波動拳': 'key-d,key-dr,key-r,modern_m|中',
  '強 波動拳': 'key-nutral,modern_sp,key-d,key-dr,key-r,modern_h',
  '[電刃錬気]波動拳': 'key-nutral,modern_sp,key-d,key-dr,key-r,key-all',
  'OD 波動拳': 'modern_auto,modern_sp,key-d,key-dr,key-r,key-all,key-all',
  '[電刃錬気]OD 波動拳': 'modern_auto,modern_sp,key-d,key-dr,key-r,key-all,key-all',
  '弱 昇龍拳': 'key-r,key-d,key-dr,modern_l|弱',
  '中 昇龍拳': 'key-r,key-d,key-dr,modern_m|中',
  '強 昇龍拳': 'key-r,modern_sp,key-r,key-d,key-dr,modern_h',
  'OD 昇龍拳': 'key-r,modern_auto,modern_sp,key-r,key-d,key-dr,key-all,key-all',
  '中 竜巻旋風脚': 'key-l,modern_sp',
  'OD 竜巻旋風脚': 'key-l,modern_auto,modern_sp',
  '空中竜巻旋風脚': 'modern_sp,key-d,key-dl,key-l,key-all|前ジャンプ中に',
  'OD 空中竜巻旋風脚': 'modern_auto,modern_sp,key-d,key-dl,key-l,key-all,key-all|前ジャンプ中に',
  '弱 上段足刀蹴り': 'modern_auto,modern_l>modern_l|弱弱',
  '中 上段足刀蹴り': 'key-d,modern_sp',
  'OD 上段足刀蹴り': 'key-d,modern_auto,modern_sp',
  '弱 波掌撃': 'key-d,key-dl,key-l,modern_l|弱',
  '中 波掌撃': 'key-d,key-dl,key-l,modern_m|中',
  '強 波掌撃': 'key-d,key-dl,key-l,modern_h|強',
  '[電刃錬気]波掌撃': 'key-d,key-dl,key-l,key-all',
  'OD 波掌撃': 'key-d,key-dl,key-l,key-all,key-all',
  '[電刃錬気]OD 波掌撃': 'key-d,key-dl,key-l,key-all,key-all',
  '電刃錬気': 'key-d,key-d,key-all',
  'SA1 真空波動拳': 'key-nutral,modern_sp,modern_h,key-d,key-dr,key-r,key-d,key-dr,key-r,modern_l|強',
  '[電刃錬気]SA1 真空波動拳': 'key-nutral,modern_sp,modern_h,key-d,key-dr,key-r,key-d,key-dr,key-r,modern_l|強',
  'SA2 真波掌撃（Lv1）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  'SA2 真波掌撃（Lv2）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  'SA2 真波掌撃（Lv3）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  '[電刃錬気]SA2 真波掌撃（Lv1）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  '[電刃錬気]SA2 真波掌撃（Lv2）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  '[電刃錬気]SA2 真波掌撃（Lv3）': 'key-l,modern_sp,modern_h,key-d,key-dl,key-l,key-d,key-dl,key-l,modern_m|強',
  'SA3 真・昇龍拳': 'key-d,modern_sp,modern_h,key-d,key-dr,key-r,key-d,key-dr,key-r,modern_h|強',
  'CA 真・昇龍拳': 'key-d,modern_sp,modern_h,key-d,key-dr,key-r,key-d,key-dr,key-r,modern_h|体力25%以下で強',
  '背負い投げ': 'key-nutral,key-or,key-r,modern_l,modern_m|近距離で弱中',
  '巴投げ': 'key-l,modern_l,modern_m|近距離で弱中',
  '前方ステップ': 'key-r,key-r',
  '後方ステップ': 'key-l,key-l',
  'ドライブインパクト（震撃）': 'modern_dl',
  '[ガード時]ドライブリバーサル（胸尖打ち）': 'key-r,modern_dl|ガード中orドライブパリィ成立中に',
  '[起き上がり時]ドライブリバーサル（胸尖打ち）': 'key-r,modern_dl|起き上がり時に',
  'ドライブパリィ': 'modern_dp',
  'ジャストパリィ（打撃）': 'modern_dp|ガード方向',
  'ジャストパリィ（飛び道具）': 'modern_dp',
  'パリィドライブラッシュ': 'key-r,key-r|ドライブパリィ中に',
  'キャンセルドライブラッシュ': 'key-r,key-r,key-or,key-nutral,key-or,key-r,modern_dp|必殺技キャンセル可能な攻撃ヒット中に',
};

// RYUフレームセクションの範囲を特定
const framesStart = src.indexOf('"frames":');
const ryuStart = src.indexOf('"ryu": [', framesStart);
const nextSection = src.indexOf('\n    "guile"', ryuStart);
let ryuSection = src.slice(ryuStart, nextSection);

let count = 0;
for (const [moveName, compact] of Object.entries(modernMap)) {
  const escaped = moveName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('("move":\\s*"' + escaped + '"[\\s\\S]*?"commandModern":\\s*)"[^"]*"');
  const before = ryuSection;
  ryuSection = ryuSection.replace(re, '$1"' + compact + '"');
  if (ryuSection !== before) count++;
}

src = src.slice(0, ryuStart) + ryuSection + src.slice(nextSection);
fs.writeFileSync('data.js', src, 'utf8');
console.log('更新完了:', count, '件');
