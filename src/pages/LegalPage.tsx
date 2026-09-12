import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageHero } from '../components/page/PageHero'
import { PlaceholderNote } from '../components/PlaceholderNote'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
import { site } from '../data/site'
import { openPreferences } from '../lib/consentManager'
import type { LegalDoc } from '../data/legal'

type LegalPageProps = {
  doc: LegalDoc
}

export function LegalPage({ doc }: LegalPageProps) {
  return (
    <>
      <PageMeta
        title={doc.title}
        description={`${doc.title} van ${site.name}. Tijdelijke tekst, geen juridisch advies.`}
        path={doc.path}
        noIndex
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: doc.title, href: doc.path },
        ]}
        eyebrow="Concepttekst"
        title={doc.title}
        intro={doc.intro}
        narrow
      />
      <Section>
        <Container className="max-w-3xl">
          <PlaceholderNote>
            Placeholder. Vervang deze tekst door een getoetste versie voordat de
            site live gaat. Dit is geen juridisch advies en geen bewijs van
            naleving.
          </PlaceholderNote>
          {doc.sections.map((section) => (
            <article key={section.heading} className="mt-8">
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            {doc.path === '/cookies' ? (
              <Button onClick={() => openPreferences()}>Cookie-instellingen</Button>
            ) : null}
            <Link to="/contact" className="inline-flex min-h-11 items-center underline">
              Contact over deze pagina
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
