// Generates lime-on-black PNG app icons (barbell mark) with zero dependencies.
// Hand-rolled PNG encoder: RGBA -> zlib -> chunks. Run: npm run icons
import zlib from 'node:zlib'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const BG = [14, 18, 15]       // #0E120F
const LIME = [200, 222, 63]   // #C8DE3F

// CRC32 (PNG chunk checksum)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const t = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0)
  return Buffer.concat([len, t, data, crc])
}

function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // color type RGBA
  const stride = size * 4
  const raw = Buffer.alloc((stride + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0 // no filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

// A barbell: central bar + two stacked plates each side. Coords normalized 0..1.
function drawBarbell(size) {
  const buf = Buffer.alloc(size * size * 4)
  const inBand = (u, lo, hi) => u >= lo && u <= hi
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size
      const v = y / size
      const dy = Math.abs(v - 0.5)
      let lime = false
      if (inBand(u, 0.30, 0.70) && dy <= 0.045) lime = true                 // bar
      else if (inBand(u, 0.255, 0.305) && dy <= 0.20) lime = true           // inner plate L
      else if (inBand(u, 0.205, 0.250) && dy <= 0.14) lime = true           // outer plate L
      else if (inBand(u, 0.695, 0.745) && dy <= 0.20) lime = true           // inner plate R
      else if (inBand(u, 0.750, 0.795) && dy <= 0.14) lime = true           // outer plate R
      const c = lime ? LIME : BG
      const i = (y * size + x) * 4
      buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255
    }
  }
  return buf
}

for (const { name, size } of [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
]) {
  writeFileSync(join(PUBLIC, name), encodePng(size, drawBarbell(size)))
  console.log('wrote', name)
}
