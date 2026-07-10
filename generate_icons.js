// PWAアイコン生成（外部ライブラリ不使用、Node標準のzlibのみでPNGを直接エンコード）
const fs = require("fs");
const zlib = require("zlib");

function crc32(buf){
  let c;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for(let n=0;n<256;n++){
      c = n;
      for(let k=0;k<8;k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[n] = c;
    }
    return t;
  })());
  c = 0xFFFFFFFF;
  for(let i=0;i<buf.length;i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function hexToRgb(hex){
  const n = parseInt(hex.replace("#",""),16);
  return [(n>>16)&255, (n>>8)&255, n&255];
}

// 対角グラデーション + 中央に丸みを帯びた「6」風のシンプルなマーク（矩形の組合せ）
function makePng(size, opts){
  const { bg1, bg2, fg, padding } = opts;
  const [r1,g1,b1] = hexToRgb(bg1);
  const [r2,g2,b2] = hexToRgb(bg2);
  const [rf,gf,bf] = hexToRgb(fg);

  const raw = Buffer.alloc((size*4+1) * size);
  const pad = Math.round(size * padding);
  const cx = size/2, cy = size/2;
  const ringOuter = size/2 - pad;
  const ringInner = ringOuter * 0.42;
  const tailW = ringOuter * 0.34;

  for(let y=0;y<size;y++){
    const rowStart = y*(size*4+1);
    raw[rowStart] = 0; // フィルタなし
    for(let x=0;x<size;x++){
      const t = (x+y)/(size*2);
      let R = Math.round(r1+(r2-r1)*t), G = Math.round(g1+(g2-g1)*t), B = Math.round(b1+(b2-b1)*t), A = 255;
      const dx = x-cx, dy = y-cy;
      const dist = Math.sqrt(dx*dx+dy*dy);
      // リング（O字）
      const inRing = dist <= ringOuter && dist >= ringInner;
      // 右下に伸びる太い「尾」で6っぽく見せる
      const tailCx = cx + ringOuter*0.55, tailCy = cy + ringOuter*0.15;
      const tdx = x-tailCx, tdy = y-tailCy;
      const inTail = Math.abs(tdx) < tailW*0.55 && tdy > -ringOuter*0.1 && tdy < ringOuter*0.9 && Math.abs(tdx - tdy*0.15) < tailW*0.5;
      if(inRing || inTail){ R=rf; G=gf; B=bf; }
      const o = rowStart + 1 + x*4;
      raw[o]=R; raw[o+1]=G; raw[o+2]=B; raw[o+3]=A;
    }
  }

  const idat = zlib.deflateSync(raw, {level:9});
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size,0); ihdr.writeUInt32BE(size,4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // 8bit RGBA

  const sig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const OPTS = { bg1:"#1d025a", bg2:"#0d0020", fg:"#e8621a", padding:0.12 };

const targets = [
  { size:192, file:"icon-192.png" },
  { size:512, file:"icon-512.png" },
  { size:180, file:"apple-touch-icon.png" },
];

targets.forEach(({size,file}) => {
  const buf = makePng(size, OPTS);
  fs.writeFileSync(file, buf);
  console.log("wrote", file, buf.length, "bytes");
});
