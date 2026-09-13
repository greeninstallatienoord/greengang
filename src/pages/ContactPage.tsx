import { Headphones, Mail, Phone } from 'lucide-react'
import { ContactDetails } from '../components/ContactDetails'
import { CtaPair } from '../components/CtaPair'
import { ContactForm } from '../components/forms/ContactForm'
import { PageFaq } from '../components/page/PageFaq'
import { PageHero } from '../components/page/PageHero'
import { ButtonLink } from '../components/ButtonLink'
import { Container } from '../components/Container'
import { Heading } from '../components/Heading'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { business } from '../data/business'
import { getFaqsByIds } from '../data/faq'
import { pageSeo } from '../data/seo'
import { site } from '../data/site'
import { contactPageJsonLd, faqJsonLd, localBusinessJsonLd } from '../lib/jsonld'

const contactFaqs = getFaqsByIds([
  'algemeen-diensten',
  'algemeen-werkwijze',
  'afspraak-hoe',
  'onderhoud-storing',
])
const contactFaqLd = faqJsonLd(contactFaqs)

function StoringCard() {
  const emergency = business.emergencyService
  if (!emergency.available) return null

  return (
    <aside
      className="border border-line bg-surface px-4 py-5 sm:px-5"
      aria-labelledby="storing-heading"
    >
      <p className="text-[0.68rem] font-semibold tracking-[0.14em] text-brand-dark uppercase">
        Storing?
      </p>
      <h2 id="storing-heading" className="mt-1.5 font-display text-[clamp(1.2rem,2.2vw,1.45rem)] tracking-[-0.015em]">
        {emergency.label}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
        {emergency.detail}
      </p>
      <ButtonLink
        to={emergency.phoneHref}
        external
        className="mt-4 min-h-12"
        aria-label={`${emergency.label}: bel ${emergency.phone}`}
      >
        <Phone size={16} strokeWidth={1.75} aria-hidden="true" />
        Bel storingsdienst — {emergency.phone}
      </ButtonLink>
      <p className="mt-3 text-xs leading-relaxed text-ink-muted sm:text-sm">
        {emergency.hoursDistinction}
      </p>
    </aside>
  )
}

export function ContactPage() {
  const emergency = business.emergencyService

  return (
    <>
      <PageMeta
        {...pageSeo.contact}
        jsonLd={[
          localBusinessJsonLd(),
          contactPageJsonLd(),
          ...(contactFaqLd ? [contactFaqLd] : []),
        ]}
      />
      <PageHero
        compact
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ]}
        eyebrow="Bereikbaar"
        title="Contact"
        titleClassName="max-w-[12ch] text-[clamp(1.55rem,3.4vw,2.45rem)]"
        intro="Bel, mail of stuur ons een bericht. Voor offertes en afspraken zijn we regulier bereikbaar. Bij een storing is de 24/7 storingsdienst beschikbaar."
        actions={<CtaPair />}
      />

      <Section className="!py-7 sm:!py-9 lg:!py-11">
        <Container>
          {/* Mobile quick actions */}
          <div className="mb-5 grid grid-cols-3 gap-2 lg:hidden">
            <ButtonLink
              to={site.contact.phoneHref}
              external
              variant="secondary"
              className="min-h-11 justify-center px-2 text-[0.8rem]"
              aria-label={`Bellen: ${site.contact.phone}`}
            >
              <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
              Bellen
            </ButtonLink>
            {emergency.available ? (
              <ButtonLink
                to={emergency.phoneHref}
                external
                className="min-h-11 justify-center px-2 text-[0.8rem]"
                aria-label={`${emergency.label}: bel ${emergency.phone}`}
              >
                <Headphones size={15} strokeWidth={1.75} aria-hidden="true" />
                24/7 storing
              </ButtonLink>
            ) : null}
            <ButtonLink
              to={site.contact.emailHref}
              variant="secondary"
              external
              className="min-h-11 justify-center px-2 text-[0.8rem]"
              aria-label={`E-mail: ${site.contact.email}`}
            >
              <Mail size={15} strokeWidth={1.75} aria-hidden="true" />
              E-mail
            </ButtonLink>
          </div>

          {/* Storing first — before the long form */}
          <Reveal className="mb-6 lg:mb-8">
            <StoringCard />
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
            <Reveal className="lg:col-span-4">
              <div className="border border-line bg-paper p-5 sm:p-6">
                <Heading as="h2" className="!text-[clamp(1.25rem,2vw,1.5rem)]">
                  Direct contact
                </Heading>
                <p className="mt-2 text-sm text-ink-muted">
                  Bel of mail voor een snelle reactie. Voor een voorstel of een moment op locatie
                  gebruikt u offerte of afspraak.
                </p>
                <ContactDetails showSocial className="mt-5" />
              </div>
            </Reveal>

            <Reveal delay={50} className="lg:col-span-8">
              <div className="border border-line bg-paper p-5 sm:p-7">
                <Heading as="h2" className="!text-[clamp(1.25rem,2vw,1.5rem)]">
                  Stuur een bericht
                </Heading>
                <p className="mt-2 max-w-xl text-sm text-ink-muted">
                  Kort en duidelijk is genoeg. We vragen geen extra persoonsgegevens. Bij een
                  acute storing belt u liever direct.
                </p>
                <div className="mt-5 max-w-2xl">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <PageFaq
        items={contactFaqs}
        title="Veelgestelde vragen"
        intro="Nog een vraag? Misschien staat het antwoord hier al tussen."
        tone="plain"
        compact
      />
    </>
  )
}
