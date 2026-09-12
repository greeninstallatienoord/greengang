import type { WorkerEnv } from './env'

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

const BRAND = {
  name: 'Green Installatie Noord',
  phone: '06 28 73 91 34',
  phoneHref: 'tel:+31628739134',
  email: 'info@greeninstallatienoord.nl',
  address: 'Burgemeester van Weringstraat 23, 9665 GN Oude Pekela',
  websiteLabel: 'greeninstallatienoord.nl',
}

export function publicSiteUrl(env: WorkerEnv): string {
  const raw = env.PUBLIC_SITE_URL.replace(/\/$/, '')
  if (raw.includes('localhost') || raw.includes('127.0.0.1')) {
    return 'https://greeninstallatienoord.nl'
  }
  return raw
}

export function emailLogoUrl(env: WorkerEnv): string {
  return `${publicSiteUrl(env)}/logo.png`
}

export function websiteUrl(env: WorkerEnv): string {
  return publicSiteUrl(env)
}

export function renderBrandedEmail(
  env: WorkerEnv,
  input: {
    title?: string
    text: string
    ctaLabel?: string
    ctaHref?: string
  },
): string {
  const logo = emailLogoUrl(env)
  const site = websiteUrl(env)
  const paragraphs = input.text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => escapeHtml(line))
        .join('<br>')
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#161a17;">${lines}</p>`
    })
    .join('')

  const cta =
    input.ctaLabel && input.ctaHref
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:8px 0 24px;">
          <tr>
            <td style="background:#1a8a34;">
              <a href="${escapeHtml(input.ctaHref)}" style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(input.ctaLabel)}</a>
            </td>
          </tr>
        </table>`
      : ''

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(input.title || BRAND.name)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f1;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f1;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe3db;">
            <tr>
              <td style="background:#102418;padding:20px 28px;">
                <img src="${escapeHtml(logo)}" alt="${escapeHtml(BRAND.name)}" width="168" style="display:block;border:0;max-width:168px;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="height:3px;background:#1a8a34;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:28px 28px 8px;">
                ${input.title ? `<p style="margin:0 0 18px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#5c635e;font-weight:700;">${escapeHtml(input.title)}</p>` : ''}
                ${paragraphs}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="border-top:1px solid #e4e8e1;padding-top:18px;padding-bottom:24px;font-size:13px;line-height:1.6;color:#5c635e;">
                      <strong style="color:#161a17;">${escapeHtml(BRAND.name)}</strong><br />
                      ${escapeHtml(BRAND.address)}<br />
                      <a href="${BRAND.phoneHref}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.phone)}</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:${BRAND.email}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.email)}</a><br />
                      <a href="${escapeHtml(site)}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.websiteLabel)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function inferCta(
  env: WorkerEnv,
  templateId?: string,
): { ctaLabel?: string; ctaHref?: string } {
  const site = websiteUrl(env)
  if (templateId === 'tpl-appointment-confirmed' || templateId === 'tpl-appointment-reminder') {
    return { ctaLabel: 'Bel ons bij vragen', ctaHref: BRAND.phoneHref }
  }
  if (templateId === 'tpl-quote-received-customer' || templateId === 'tpl-quote-followup') {
    return { ctaLabel: 'Bekijk onze diensten', ctaHref: `${site}/` }
  }
  if (templateId === 'tpl-thank-you') {
    return { ctaLabel: 'Naar de website', ctaHref: site }
  }
  return { ctaLabel: 'Naar de website', ctaHref: site }
}
