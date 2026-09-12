import { Link, useLocation } from 'react-router-dom'
import { CtaPair } from '../components/CtaPair'
import { PageHero } from '../components/page/PageHero'
import { RelatedServices } from '../components/page/RelatedServices'
import { PageMeta } from '../components/seo/PageMeta'
import { services } from '../data/services'

export function NotFoundPage() {
  const { pathname } = useLocation()

  return (
    <>
      <PageMeta
        title="Pagina niet gevonden"
        description="Deze pagina bestaat niet. Ga terug naar home of kies een dienst."
        path={pathname || '/'}
        noIndex
      />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }]}
        eyebrow="404"
        title="Deze pagina bestaat niet"
        intro="De link is onjuist of de pagina is verplaatst. Kies hieronder een vervolgstap."
        actions={<CtaPair showCall />}
      >
        <p className="mt-4 text-sm">
          <Link to="/" className="font-semibold underline">
            Terug naar home
          </Link>
        </p>
      </PageHero>
      <RelatedServices services={services} title="Diensten" />
    </>
  )
}
