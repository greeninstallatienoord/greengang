/**
 * Build optimized large-screen (≥1024px) homepage hero derivatives
 * from ./hero-groteschermen/. Does NOT touch legacy /public/images/hero/* files.
 *
 * Run: npx tsx scripts/build-hero-large-screen.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'hero-groteschermen')
const OUT_DIR = path.join(ROOT, 'public', 'images', 'hero', 'large')

/**
 * Stable ids mapped to the ChatGPT-exported PNG filenames in hero-groteschermen/.
 * Order = slideshow order (strong outdoor LCP first).
 */
const plans = [
  {
    id: 'hero-large-warmtepomp-patio-01',
    file: 'ChatGPT Image 14 sep 2026, 02_07_30 (1).png',
  },
  {
    id: 'hero-large-warmtepomp-tuin-01',
    file: 'ChatGPT Image 14 sep 2026, 02_07_30 (2).png',
  },
  {
    id: 'hero-large-cv-ketel-binnen-01',
    file: 'ChatGPT Image 14 sep 2026, 02_07_31 (3).png',
  },
  {
    id: 'hero-large-service-buitenunit-01',
    file: 'ChatGPT Image 14 sep 2026, 02_07_31 (4).png',
  },
  {
    id: 'hero-large-warmtepomp-mitsubishi-01',
    file: 'ChatGPT Image 14 sep 2026, 02_07_31 (5).png',
  },
] as const

/** Target width for large desktop heroes — no soft upscale beyond source. */
const MAX_WIDTH = 1920
const QUALITY = { webp: 88, avif: 68, jpg: 90 } as const

async function encodeVariants(
  pipeline: sharp.Sharp,
  basename: string,
  width: number,
  height: number,
) {
  const webpPath = path.join(OUT_DIR, `${basename}.webp`)
  const avifPath = path.join(OUT_DIR, `${basename}.avif`)
  const jpgPath = path.join(OUT_DIR, `${basename}.jpg`)

  await pipeline.clone().webp({ quality: QUALITY.webp, effort: 5 }).toFile(webpPath)
  await pipeline.clone().avif({ quality: QUALITY.avif, effort: 4 }).toFile(avifPath)
  await pipeline
    .clone()
    .jpeg({ quality: QUALITY.jpg, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(jpgPath)

  const sizes = {
    webp: fs.statSync(webpPath).size,
    avif: fs.statSync(avifPath).size,
    jpg: fs.statSync(jpgPath).size,
  }
  console.log(
    `  ${basename}: ${width}×${height} · avif ${(sizes.avif / 1024).toFixed(0)}KB · webp ${(sizes.webp / 1024).toFixed(0)}KB · jpg ${(sizes.jpg / 1024).toFixed(0)}KB`,
  )
  return { width, height, sizes }
}

async function processOne(plan: (typeof plans)[number]) {
  const inputPath = path.join(SOURCE_DIR, plan.file)
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing source: ${inputPath}`)
  }

  const meta = await sharp(inputPath).metadata()
  const srcW = meta.width ?? 0
  const srcH = meta.height ?? 0
  if (!srcW || !srcH) throw new Error(`Invalid dimensions for ${plan.file}`)

  const targetW = Math.min(MAX_WIDTH, srcW)
  const targetH = Math.round((targetW / srcW) * srcH)

  console.log(`\n${plan.id}\n  source ${srcW}×${srcH} → ${targetW}×${targetH}`)

  // Keep full wide composition — only downscale, never aggressive crop.
  const pipeline = sharp(inputPath).resize(targetW, targetH, {
    fit: 'inside',
    withoutEnlargement: true,
    kernel: 'lanczos3',
  })

  return {
    id: plan.id,
    file: plan.file,
    ...(await encodeVariants(pipeline, plan.id, targetW, targetH)),
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
  fs.writeFileSync(
    manifestPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
  )
  console.log(`\nWrote ${results.length} large-screen image sets to ${OUT_DIR}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
