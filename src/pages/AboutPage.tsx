import { Building2, Check, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { CtaPair } from '../components/CtaPair'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { Container } from '../components/Container'
import { CTASection } from '../components/sections/CTASection'
import { ProcessSteps } from '../components/sections/ProcessSteps'
import { SocialLinks } from '../components/SocialLinks'
import { TrustMarks } from '../components/home/TrustMarks'
import { OpeningHours } from '../components/OpeningHours'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd } from '../lib/jsonld'
import { services } from '../data/services'
import { pageImages } from '../data/media'
import { MediaImage } from '../components/media/MediaImage'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { RegionGlance } from '../components/region/RegionGlance'
import { business } from '../data/business'
import { serviceArea } from '../data/region'
import { site } from '../data/site'
import { cn } from '../lib/cn'

const expect = [
  {
    title: 'Communicatie',
    text: 'U weet wie u spreekt en wat de volgende stap is.',
  },
  {
    title: 'Zorgvuldig werken',
    text: 'Installatiewerk in huis vraagt om nette montage en aandacht voor detail.',
  },
  {
    title: 'Afronding',
    text: 'Na het werk krijgt u uitleg. Voor onderhoud of een latere vraag blijft u ons bereiken.',
  },
]

/** Slightly tighter than default section-y, used consistently on /over-ons. */
const aboutSection = '!py-8 sm:!py-10 lg:!py-12'

export function AboutPage() {
  return (
    <>
      <PageMeta {...pageSeo.about} jsonLd={localBusinessJsonLd()} />
      <PageHero
        compact
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Over ons', href: '/over-ons' },
        ]}
        eyebrow="Green Installatie Noord"
        title="Specialist in installatietechniek in Noord-Nederland"
        titleClassName="max-w-[16ch] sm:max-w-[18ch] lg:max-w-[15.5ch] text-[clamp(1.55rem,3.6vw,2.55rem)]"
        intro="Betrouwbaar werk, eerlijk advies en snelle opvolging. We installeren en onderhouden cv-ketels, airconditioning en warmtepompen — met ervaring uit de praktijk en duidelijke afspraken."
        image={pageImages.aboutHero}
        imageClassName="rounded-md shadow-[0_10px_28px_-14px_rgba(20,40,28,0.32)]"
        imageVariant="project"
        actions={<CtaPair />}
      />

      <Section className={cn(aboutSection, 'section-grain')}>
        <Container>
          <div className="grid gap-7 lg:grid-cols-12 lg:items-start lg:gap-10">
            <Reveal className="lg:col-span-6">
              <div className="max-w-xl">
                <p className="eyebrow">Het bedrijf</p>
                <Heading as="h2" className="mt-2.5 sm:mt-3">
                  Vanuit Oude Pekela actief in Noord-Nederland
                </Heading>
                <p className="lead mt-4">
                  De werkplaats en het adres liggen in Oude Pekela. Het werkgebied is
                  Noord-Nederland, met Groningen als thuisprovincie en daarnaast
                  Drenthe en Friesland.
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:text-[0.95rem]">
                  Cv-ketel, airco, warmtepomp en onderhoud: bereikbaar vanuit Oude
                  Pekela.
                </p>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-6" delay={70}>
              <RegionGlance />
            </Reveal>
          </div>

          <div className="mt-8 grid items-start gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:gap-7">
            <Reveal delay={40} image>
              <figure>
                <MediaImage
                  asset={pageImages.aboutHouse}
                  variant="project"
                  className="mx-auto w-fit max-w-full max-h-[18rem] rounded-md sm:max-h-[20rem] lg:max-h-[22rem]"
                  sizes="(min-width: 640px) 42vw, 100vw"
                />
                <figcaption className="mt-2.5 text-sm text-ink-muted">
                  Buitenunit aan de gevel op een beugel, met leidinggoot. Foto uit eigen werk.
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={90} image className="sm:pt-6 lg:pt-10">
              <figure>
                <MediaImage
                  asset={pageImages.aboutCraft}
                  variant="project"
                  className="mx-auto w-fit max-w-full max-h-[18rem] rounded-md sm:max-h-[20rem] lg:max-h-[22rem]"
                  sizes="(min-width: 640px) 42vw, 100vw"
                />
                <figcaption className="mt-2.5 text-sm text-ink-muted">
                  Afgewerkte buitenunit met leidinggoot en elektra aan de gevel. Foto uit eigen werk.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </Container>
      </Section>

      <ProcessSteps numbered className={cn(aboutSection, 'bg-paper')} />

      <Section className={cn(aboutSection, 'section-soft')}>
        <Container>
          <Reveal>
            <div className="max-w-xl">
              <p className="eyebrow">Vakmanschap</p>
              <Heading as="h2" className="mt-2.5 sm:mt-3">
                Nette montage, duidelijke uitleg
              </Heading>
              <p className="lead mt-4">
                Leidingwerk, plaatsing en afronding horen bij elkaar. We laten
                zien wat we doen en leggen het resultaat helder uit.
              </p>
            </div>
          </Reveal>
          <ul className="mt-7 grid gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-8">
            {expect.map((item, index) => (
              <Reveal key={item.title} delay={index * 60}>
                <li className="border-t border-brand/25 pt-4">
                  <p
                    className="font-display text-[1.15rem] leading-none tracking-[-0.02em] text-brand-dark/65"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2.5 font-semibold tracking-[-0.015em]">{item.title}</h3>
                  <p className="mt-1.5 max-w-[18rem] text-sm leading-relaxed text-ink-muted">
                    {item.text}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <TrustMarks />

      <Section className={cn(aboutSection, 'bg-paper')}>
        <Container className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <Reveal className="lg:col-span-7">
            <Heading as="h2">Bedrijfsgegevens</Heading>
            <p className="mt-2 max-w-xl text-sm text-ink-muted">
              Adres, KvK en openingstijden op een rij. Bel of mail voor een snelle reactie.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
              <a
                href={site.contact.phoneHref}
                className="inline-flex min-h-11 items-center gap-2 text-ink underline-offset-2 hover:underline"
              >
                <Phone size={16} strokeWidth={1.7} className="text-brand-dark" aria-hidden="true" />
                {site.contact.phone}
              </a>
              <a
                href={site.contact.emailHref}
                className="inline-flex min-h-11 items-center gap-2 text-ink underline-offset-2 hover:underline"
              >
                <Mail size={16} strokeWidth={1.7} className="text-brand-dark" aria-hidden="true" />
                {site.contact.email}
              </a>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <InfoCard icon={MapPin} title="Adres">
                <p>{business.address.street}</p>
                <p>
                  {business.address.postalCode} {business.address.city}
                </p>
                {business.googleBusinessProfile ? (
                  <p className="mt-2">
                    <a
                      href={business.googleBusinessProfile}
                      className="font-medium text-ink underline underline-offset-2"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Locatie op Google
                    </a>
                  </p>
                ) : null}
              </InfoCard>

              <InfoCard icon={Building2} title="Bedrijf">
                <p className="font-medium text-ink">{business.businessName}</p>
                <p className="mt-2">
                  <span className="text-ink-muted">KVK</span>{' '}
                  <span className="font-medium text-ink">{business.kvk}</span>
                </p>
                <p className="mt-2 text-ink-muted">Vestiging in {business.address.city}</p>
              </InfoCard>

              <InfoCard icon={Clock3} title="Openingstijden" className="sm:col-span-2 xl:col-span-1">
                <OpeningHours compact />
              </InfoCard>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold tracking-[-0.01em] text-ink">Volg ons</p>
              <SocialLinks />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={70}>
            <div className="border-t border-line pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
              <Heading as="h2">Werkgebied</Heading>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
                Wij zijn actief in heel Noord-Nederland, met focus op de volgende
                provincies:
              </p>

              <ul className="mt-5 divide-y divide-line border-y border-line">
                {serviceArea.provinces.map((province) => (
                  <li key={province.name} className="flex items-start gap-3 py-3.5">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-brand-dark">
                      <Check size={16} strokeWidth={2.25} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold tracking-[-0.01em] text-ink">
                        {province.name}
                        {province.featured ? (
                          <span className="ml-2 align-middle text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-brand-dark">
                            Thuisprovincie
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {province.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-4 text-sm text-ink-muted">{serviceArea.baseLine}</p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <RelatedServices services={services} />
      <CTASection image={null} />
    </>
  )
}

function InfoCard({
  icon: Icon,
  title,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <article
      className={cn(
        'flex h-full flex-col border border-line bg-white p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="inline-flex size-9 shrink-0 items-center justify-center bg-brand-soft text-brand-dark">
          <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <h3 className="text-sm font-semibold tracking-[-0.01em] text-ink">{title}</h3>
      </div>
      <div className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{children}</div>
    </article>
  )
}
