import { Button } from '../components/Button'
import { LegalPageLayout } from '../components/legal/LegalPageLayout'
import { PageMeta } from '../components/seo/PageMeta'
import { openPreferences } from '../lib/consentManager'
import { downloadLegalDocument, printLegalDocument } from '../lib/legalDownload'
import type { LegalDocument } from '../data/legal'

type LegalPageProps = {
  doc: LegalDocument
}

export function LegalPage({ doc }: LegalPageProps) {
  const isTerms = doc.path === '/algemene-voorwaarden'
  const isCookies = doc.path === '/cookies'

  return (
    <>
      <PageMeta
        title={doc.title}
        description={doc.metaDescription || doc.intro}
        path={doc.path}
      />
      <LegalPageLayout
        doc={doc}
        actions={
          <div className="flex flex-wrap gap-2">
            {isCookies ? (
              <Button onClick={(event) => openPreferences(event.currentTarget)}>
                Cookie-instellingen
              </Button>
            ) : null}
            {isTerms ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => downloadLegalDocument(doc)}
                >
                  Download voorwaarden
                </Button>
                <Button variant="secondary" onClick={() => printLegalDocument()}>
                  Printen
                </Button>
              </>
            ) : null}
          </div>
        }
      />
    </>
  )
}
