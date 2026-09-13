/**
 * Build optimized hero slideshow derivatives from ./hero-afbeeldingen/
 * Preserves originals. Outputs to public/images/hero/
 *
 * Run: npx tsx scripts/build-hero-images.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'hero-afbeeldingen')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'hero')

type CropFocus = { x: number; y: number } // 0–1 within content after letterbox remove

type SourcePlan = {
  id: string
  file: string
  mobileFocus: CropFocus
  desktopEnabled: boolean
  desktopFocus?: CropFocus
  /** Slight brightness adjust after crop (−1..1), optional */
  modulate?: { brightness?: number; saturation?: number }
}

const plans: SourcePlan[] = [
  {
    id: 'hero-airco-exterior-gevel-01',
    file: 'WhatsApp Image 2026-09-13 at 13.07.44.jpeg',
    mobileFocus: { x: 0.58, y: 0.62 },
    desktopEnabled: true,
    desktopFocus: { x: 0.62, y: 0.58 },
  },
  {
    id: 'hero-airco-indoor-attic-01',
    file: '4532.jpeg',
    mobileFocus: { x: 0.48, y: 0.32 },
    desktopEnabled: true,
    desktopFocus: { x: 0.55, y: 0.28 },
  },
  {
    id: 'hero-airco-exterior-duo-01',
    file: 'WhatsApp Image 2026-09-13 at 13.08.01.jpeg',
    mobileFocus: { x: 0.52, y: 0.7 },
    desktopEnabled: true,
    desktopFocus: { x: 0.55, y: 0.68 },
  },
  {
    id: 'hero-airco-indoor-kaisai-01',
    file: 'rfsdfsd.jpeg',
    mobileFocus: { x: 0.52, y: 0.42 },
    desktopEnabled: false,
  },
  {
    id: 'hero-airco-exterior-nok-01',
    file: 'WhatsApp Image 2026-09-13 at 13.08.59.jpeg',
    mobileFocus: { x: 0.38, y: 0.52 },
    desktopEnabled: true,
    desktopFocus: { x: 0.36, y: 0.7 },
  },
  {
    id: 'hero-warmtepomp-indoor-remeha-01',
    file: 'WhatsApp Image 2026-09-13 at 13.09.00.jpeg',
    mobileFocus: { x: 0.55, y: 0.42 },
    desktopEnabled: false,
  },
  {
    id: 'hero-airco-indoor-praktijk-01',
    file: 'fdsgdfh.jpeg',
    mobileFocus: { x: 0.4, y: 0.28 },
    desktopEnabled: false,
  },
]

const MOBILE = { width: 900, height: 1200 }
const DESKTOP = { width: 1600, height: 900 }

async function detectContentBox(input: Buffer) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const threshold = 18
  let top = 0
  let bottom = height - 1
  let left = 0
  let right = width - 1

  const isDarkRow = (y: number) => {
    let dark = 0
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      if (r <= threshold && g <= threshold && b <= threshold) dark++
    }
    return dark / width > 0.92
  }

  const isDarkCol = (x: number) => {
    let dark = 0
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      if (r <= threshold && g <= threshold && b <= threshold) dark++
    }
    return dark / height > 0.92
  }

  while (top < bottom && isDarkRow(top)) top++
  while (bottom > top && isDarkRow(bottom)) bottom--
  while (left < right && isDarkCol(left)) left++
  while (right > left && isDarkCol(right)) right--

  // Trim a couple of pixels of residual edge noise
  top = Math.min(height - 2, top + 2)
  bottom = Math.max(top + 2, bottom - 2)
  left = Math.min(width - 2, left + 1)
  right = Math.max(left + 2, right - 1)

  return {
    left,
    top,
    width: right - left + 1,
    height: bottom - top + 1,
    sourceWidth: width,
    sourceHeight: height,
  }
}

function coverExtract(
  srcW: number,
  srcH: number,
  outW: number,
  outH: number,
  focus: CropFocus,
) {
  const scale = Math.max(outW / srcW, outH / srcH)
  const cropW = Math.round(outW / scale)
  const cropH = Math.round(outH / scale)
  const maxLeft = Math.max(0, srcW - cropW)
  const maxTop = Math.max(0, srcH - cropH)
  const left = Math.round(Math.min(maxLeft, Math.max(0, focus.x * srcW - cropW / 2)))
  const top = Math.round(Math.min(maxTop, Math.max(0, focus.y * srcH - cropH / 2)))
  return { left, top, width: cropW, height: cropH }
}

async function encodeVariants(
  pipeline: sharp.Sharp,
  basename: string,
  width: number,
  height: number,
) {
  const webpPath = path.join(OUT_DIR, `${basename}.webp`)
  const avifPath = path.join(OUT_DIR, `${basename}.avif`)
  const jpgPath = path.join(OUT_DIR, `${basename}.jpg`)

  await pipeline
    .clone()
    .webp({ quality: 78, effort: 5 })
    .toFile(webpPath)
  await pipeline
    .clone()
    .avif({ quality: 55, effort: 4 })
    .toFile(avifPath)
  await pipeline
    .clone()
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(jpgPath)

  const sizes = {
    webp: fs.statSync(webpPath).size,
    avif: fs.statSync(avifPath).size,
    jpg: fs.statSync(jpgPath).size,
  }
  console.log(
    `  ${basename}: avif ${(sizes.avif / 1024).toFixed(0)}KB · webp ${(sizes.webp / 1024).toFixed(0)}KB · jpg ${(sizes.jpg / 1024).toFixed(0)}KB`,
  )
  return { width, height, sizes }
}

async function processOne(plan: SourcePlan) {
  const inputPath = path.join(SOURCE_DIR, plan.file)
  const input = fs.readFileSync(inputPath)
  const box = await detectContentBox(input)
  console.log(
    `\n${plan.id}\n  source ${box.sourceWidth}×${box.sourceHeight} → content ${box.width}×${box.height} @ (${box.left},${box.top})`,
  )

  const content = sharp(input).extract({
    left: box.left,
    top: box.top,
    width: box.width,
    height: box.height,
  })

  const contentBuf = await content.toBuffer()
  const meta = await sharp(contentBuf).metadata()
  const cw = meta.width!
  const ch = meta.height!

  const mobileExtract = coverExtract(
    cw,
    ch,
    MOBILE.width,
    MOBILE.height,
    plan.mobileFocus,
  )
  let mobilePipe = sharp(contentBuf)
    .extract(mobileExtract)
    .resize(MOBILE.width, MOBILE.height, { fit: 'fill' })
  if (plan.modulate) {
    mobilePipe = mobilePipe.modulate({
      brightness: plan.modulate.brightness ?? 1,
      saturation: plan.modulate.saturation ?? 1,
    })
  }
  const mobileMeta = await encodeVariants(
    mobilePipe,
    `${plan.id}-mobile`,
    MOBILE.width,
    MOBILE.height,
  )

  let desktopMeta: typeof mobileMeta | null = null
  if (plan.desktopEnabled && plan.desktopFocus) {
    // Prefer landscape crop without extreme upscale: cap width to content width * 1.2
    const targetW = Math.min(DESKTOP.width, Math.max(1200, Math.round(cw * 1.35)))
    const targetH = Math.round((targetW * 9) / 16)
    const desktopExtract = coverExtract(
      cw,
      ch,
      targetW,
      targetH,
      plan.desktopFocus,
    )
    let desktopPipe = sharp(contentBuf)
      .extract(desktopExtract)
      .resize(targetW, targetH, { fit: 'fill' })
    if (plan.modulate) {
      desktopPipe = desktopPipe.modulate({
        brightness: plan.modulate.brightness ?? 1,
        saturation: plan.modulate.saturation ?? 1,
      })
    }
    desktopMeta = await encodeVariants(
      desktopPipe,
      `${plan.id}-desktop`,
      targetW,
      targetH,
    )
  }

  return {
    id: plan.id,
    desktopEnabled: plan.desktopEnabled,
    mobile: mobileMeta,
    desktop: desktopMeta,
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const file of fs.readdirSync(OUT_DIR)) {
    fs.unlinkSync(path.join(OUT_DIR, file))
  }

  const results = []
  for (const plan of plans) {
    results.push(await processOne(plan))
  }

  const manifestPath = path.join(OUT_DIR, 'build-report.json')
  fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2))
  console.log(`\nWrote ${results.length} image sets to ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
