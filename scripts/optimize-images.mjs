import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

// Source PNGs in public/, optimized variants emitted to public/images/
const PUBLIC = path.resolve('public')
const OUT = path.resolve('public/images')

const TARGETS = [
  { src: 'amit-headshot.png', base: 'amit-headshot' },
  { src: 'benioff.png', base: 'benioff' },
  { src: 'walkthrough-thumb.png', base: 'walkthrough-thumb' },
]

const WIDTHS = [400, 800, 1200]

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true })

for (const t of TARGETS) {
  const input = path.join(PUBLIC, t.src)
  const meta = await sharp(input).metadata()
  console.log(`\n${t.src}: ${meta.width}x${meta.height} (${meta.format})`)

  for (const w of WIDTHS) {
    if (w > meta.width) {
      console.log(`  skip ${w}w (source is ${meta.width}w)`)
      continue
    }

    const webpOut = path.join(OUT, `${t.base}-${w}.webp`)
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpOut)

    const avifOut = path.join(OUT, `${t.base}-${w}.avif`)
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 60, effort: 4 })
      .toFile(avifOut)

    console.log(`  ${w}w → webp + avif`)
  }
}

console.log('\nDone.')
