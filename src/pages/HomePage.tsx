import { ExperienceSection } from '../components/home/ExperienceSection'
import { HomeHero } from '../components/home/HomeHero'
import { HomeProjects } from '../components/home/HomeProjects'
import { HomeQuickStart } from '../components/home/HomeQuickStart'
import { KnowledgePreview } from '../components/home/KnowledgePreview'
import { LocalSection } from '../components/home/LocalSection'
import { ServiceList } from '../components/home/ServiceList'
import { TrustMarks } from '../components/home/TrustMarks'
import { WhyHome } from '../components/home/WhyHome'
import { CTASection } from '../components/sections/CTASection'
import { ProcessSteps } from '../components/sections/ProcessSteps'
import { PageMeta } from '../components/seo/PageMeta'
import { pageSeo } from '../data/seo'
import { localBusinessJsonLd, websiteJsonLd } from '../lib/jsonld'

export function HomePage() {
  return (
    <>
      <PageMeta
        {...pageSeo.home}
        jsonLd={[websiteJsonLd(), localBusinessJsonLd()]}
      />
      <HomeHero />
      <HomeQuickStart />
      <ExperienceSection />
      <ServiceList />
      <WhyHome />
      <ProcessSteps />
      <HomeProjects />
      <TrustMarks />
      <LocalSection />
      <KnowledgePreview />
      <CTASection image={null} />
    </>
  )
}
