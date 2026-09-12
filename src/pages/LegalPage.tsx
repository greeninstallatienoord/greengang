import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { PageHero } from '../components/page/PageHero'
import { Container } from '../components/Container'
import { Section } from '../components/Section'
import { PageMeta } from '../components/seo/PageMeta'
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
        description={doc.intro}
        path={doc.path}
      />
      <PageHero
        crumbs={[
          { label: 'Home', href: '/' },
          { label: doc.title, href: doc.path },
        ]}
        title={doc.title}
        intro={doc.intro}
        narrow
      />
      <Section>
        <Container className="max-w-3xl">
          {doc.sections.map((section) => (
            <article key={section.heading} className="mt-8 first:mt-0">
              <h2 className="text-xl font-semibold tracking-[-0.02em]">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 max-w-[40rem] text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
          <div className="mt-10 flex flex-wrap gap-3">
            {doc.path === '/cookies' ? (
              <Button onClick={() => openPreferences()}>Cookie-instellingen</Button>
            ) : null}
            <Link to="/contact" className="inline-flex min-h-11 items-center underline">
              Vraag over deze pagina
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
