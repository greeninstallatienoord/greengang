import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { mainNav } from '../../data/navigation'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { BrandLogo } from '../media/BrandLogo'
import { MobileMenu } from './MobileMenu'
import { TopBar } from './TopBar'

export function Header() {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 24,
  )
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 24
      setCompact((current) => (current === next ? current : next))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40">
      <TopBar />
      <div
        className={cn(
          'relative border-b border-line bg-paper/95 backdrop-blur-sm transition-shadow',
          compact && 'shadow-header',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between gap-4 transition-[min-height] duration-200',
            compact ? 'min-h-14' : 'min-h-16 sm:min-h-[4.25rem]',
          )}
        >
          <BrandLogo compact={compact} />

          <nav className="hidden xl:block" aria-label="Hoofdnavigatie">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-2.5 py-2 text-[0.92rem] font-medium text-ink-muted hover:bg-brand-soft hover:text-ink',
                        isActive && 'bg-brand-soft text-brand-dark',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink to="/afspraak-maken" variant="secondary" size="sm">
              {site.copy.ctaAppointment}
            </ButtonLink>
            <ButtonLink to="/offerte-aanvragen" size="sm">
              {site.copy.ctaQuote}
            </ButtonLink>
          </div>

          <div className="flex min-w-0 items-center gap-2 xl:hidden">
            <ButtonLink
              to="/offerte-aanvragen"
              size="sm"
              className="max-w-[42vw] truncate px-3 lg:hidden"
            >
              <span className="sm:hidden">Offerte</span>
              <span className="hidden sm:inline">{site.copy.ctaQuote}</span>
            </ButtonLink>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigatie"
              aria-haspopup="true"
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
              <span className="sr-only">
                {menuOpen ? 'Menu sluiten' : 'Menu openen'}
              </span>
            </button>
          </div>
        </Container>
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </header>
  )
}
