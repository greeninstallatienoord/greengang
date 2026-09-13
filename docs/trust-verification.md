# Trust verification

Only claims marked **Approved for website: YES** may appear as trust badges, certificates, scores or guarantees.

The UI reads `src/data/trust.ts`. Records with `approved: false` are never rendered.

Related NAP facts: `docs/business-verification.md`.

## Visible today

| Claim | Evidence | Approved | How it is shown |
| --- | --- | --- | --- |
| Vestiging: Burgemeester van Weringstraat 23, 9665 GN Oude Pekela | Supplied company address | YES | Fact card in Vakmanschap & kwaliteit |
| Facebook-profiel | Official page URL | YES | Footer / contact `sameAs`, not a keurmerk |
| Diensten cv-ketel, airco, warmtepomp, onderhoud | Known service offer | YES | Service pages, not as certificates |
| Werkwijze (advies, nette installatie, service) | Process copy | YES as method only | Homepage TrustStrip — not a certificate or score |

## Prepared, not shown

| Claim | Status | Why it stays hidden | What is needed |
| --- | --- | --- | --- |
| CO-certificering / gasverbrandingsinstallaties | Unverified | Common in the trade is not evidence | Certificate, number, valid-until, official check URL, licensed logo |
| STEK | Unverified | Mentioned on older web copy only | Registration / certificate |
| BRL 100 | Unverified | Not confirmed | Recognition document |
| Kiwa | Unverified | Mentioned on older web copy only | Which scheme, number, expiry |
| “Gecertificeerde installateurs” | Unverified | Older marketing copy — not used | Named scheme and persons |
| A-merken | Unverified | Older copy | Brand list the company actually installs, plus logo licence |
| 6+ jaar ervaring | Unverified | Third-party sites / marketing | Start date or KvK history, then a number |
| Aantal projecten | Not supplied | — | Count with a definition |
| 2 jaar garantie op werk | Unverified | Older web copy | Written warranty terms |
| 24-uurs installatie | Unverified | Older web copy | What the promise means in practice |
| Techniek Nederland-lidmaatschap | Not confirmed | Official site cited as a source, not as membership | Membership confirmation |
| OOP-lidmaatschap | Not requested | Local org exists | Membership / ledenlijst |
| Solvari (profiel / reviews / partnerbadge) | Removed from website | Owner request: no Solvari links or ervaringen | Do not re-add unless explicitly requested |
| Google-beoordeling / “5.0” / “100+ reviews” | No verified GBP URL | Would be invented | Stable Maps URL in `business.googleBusinessProfile`; still no fake totals |
| KvK 86277391 | Third-party scrapers only | Not supplied as a website claim | Extract / written confirmation |

## Components and gates

| Component | Renders when |
| --- | --- |
| `CertificationCard` | `approved === true` |
| `ReviewCard` | `approved`, `republicationAllowed`, and a non-empty quote |
| `GoogleReviewsCta` | Non-empty `business.googleBusinessProfile` — label only: “Bekijk ons op Google” |
| Review-platform link | `approvedLink` and a real URL — no rating summary |
| Guarantee / brand / membership / experience number | Matching `approved` or a non-null verified number |

## How to publish a certification later

1. Collect the official name, number, valid-until date, check URL, and logo licence.
2. Fill the matching record in `src/data/trust.ts`.
3. Set `approved: true` only after that evidence is filed.
4. Update this table.

Do not turn on a card because “every installer has this”.
