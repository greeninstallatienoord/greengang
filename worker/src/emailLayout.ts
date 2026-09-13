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
  phone: '050 569 0997',
  phoneHref: 'tel:+31505690997',
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

function paragraphsFromText(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => escapeHtml(line))
        .join('<br>')
      return `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#1a1f1b;">${lines}</p>`
    })
    .join('')
}

/**
 * Single reusable Green Installatie Noord email shell.
 * Table-based, inline CSS, no external JS — safe for Gmail/Outlook/mobile.
 */
export function renderBrandedEmail(
  env: WorkerEnv,
  input: {
    title?: string
    heading?: string
    text: string
    ctaLabel?: string
    ctaHref?: string
  },
): string {
  const logo = emailLogoUrl(env)
  const site = websiteUrl(env)
  const docTitle = input.title || input.heading || BRAND.name
  const heading = input.heading?.trim() || ''
  const bodyHtml = paragraphsFromText(input.text)

  const cta =
    input.ctaLabel && input.ctaHref
      ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:4px 0 28px;">
          <tr>
            <td align="left" style="border-radius:2px;background:#1a8a34;">
              <a href="${escapeHtml(input.ctaHref)}" style="display:inline-block;padding:13px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;line-height:1.2;color:#ffffff;text-decoration:none;">${escapeHtml(input.ctaLabel)}</a>
            </td>
          </tr>
        </table>`
      : ''

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(docTitle)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f5f2;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(heading || input.text.slice(0, 90))}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f5f2;padding:24px 10px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #e2e5df;">
            <tr>
              <td style="background:#102418;padding:22px 28px;">
                <img src="${escapeHtml(logo)}" alt="${escapeHtml(BRAND.name)}" width="160" height="auto" style="display:block;border:0;outline:none;text-decoration:none;max-width:160px;height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="height:3px;line-height:3px;font-size:0;background:#1a8a34;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px 28px 8px;background:#ffffff;">
                ${
                  heading
                    ? `<h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;font-weight:600;color:#102418;">${escapeHtml(heading)}</h1>`
                    : ''
                }
                ${bodyHtml}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 28px;background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="border-top:1px solid #e8ebe4;padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.65;color:#5c635e;">
                      <strong style="color:#102418;">${escapeHtml(BRAND.name)}</strong><br />
                      ${escapeHtml(BRAND.address)}<br />
                      <a href="${BRAND.phoneHref}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.phone)}</a>
                      &nbsp;&middot;&nbsp;
                      <a href="mailto:${escapeHtml(BRAND.email)}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.email)}</a><br />
                      <a href="${escapeHtml(site)}" style="color:#14692a;text-decoration:none;">${escapeHtml(BRAND.websiteLabel)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
            <tr>
              <td style="padding:14px 8px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#8a918b;text-align:center;">
                Dit bericht is verzonden door ${escapeHtml(BRAND.name)}.
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
  if (
    templateId === 'tpl-appointment-confirmed' ||
    templateId === 'tpl-appointment-reminder' ||
    templateId === 'tpl-appointment-rescheduled' ||
    templateId === 'tpl-appointment-cancelled'
  ) {
    return { ctaLabel: 'Bel ons bij vragen', ctaHref: BRAND.phoneHref }
  }
  if (templateId === 'tpl-quote-received-customer' || templateId === 'tpl-quote-followup') {
    return { ctaLabel: 'Bekijk onze diensten', ctaHref: `${site}/` }
  }
  if (templateId === 'tpl-thank-you' || templateId === 'tpl-contact-response') {
    return { ctaLabel: 'Naar de website', ctaHref: site }
  }
  return { ctaLabel: 'Naar de website', ctaHref: site }
}
