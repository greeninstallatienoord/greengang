import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { headerNav } from '../../data/navigation'
import { site } from '../../data/site'
import { cn } from '../../lib/cn'
import { ButtonLink } from '../ButtonLink'
import { Container } from '../Container'
import { BrandLogo } from '../media/BrandLogo'
import { MobileMenu } from './MobileMenu'
import { ServicesMenu } from './ServicesMenu'
import { TopBar } from './TopBar'

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
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
    const el = headerRef.current
    if (!el) return

    const publishOffset = () => {
      document.documentElement.style.setProperty(
        '--header-offset',
        `${el.offsetHeight}px`,
      )
    }

    publishOffset()
    const observer = new ResizeObserver(publishOffset)
    observer.observe(el)
    window.addEventListener('orientationchange', publishOffset)
    return () => {
      observer.disconnect()
      window.removeEventListener('orientationchange', publishOffset)
    }
  }, [compact, menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    document.documentElement.dataset.navOpen = menuOpen ? 'on' : ''
    return () => {
      document.body.style.overflow = ''
      delete document.documentElement.dataset.navOpen
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 64rem)').matches) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40">
        <TopBar />
        <div
          className={cn(
            'relative border-b border-line bg-paper/96 backdrop-blur-md',
            compact && 'shadow-header',
          )}
        >
          <Container
            className={cn(
              'flex items-center justify-between gap-2.5 transition-[min-height] duration-200 sm:gap-6',
              compact ? 'min-h-12 sm:min-h-14' : 'min-h-[3.25rem] sm:min-h-16 lg:min-h-[4.35rem]',
            )}
          >
            <BrandLogo compact={compact} className="min-w-0" />

            <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Hoofdnavigatie">
              <ServicesMenu />
              {headerNav.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn('nav-link', isActive && 'nav-link-active')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <NavLink
                to="/afspraak-maken"
                className={({ isActive }) =>
                  cn('nav-link px-1', isActive && 'nav-link-active')
                }
              >
                {site.copy.ctaAppointment}
              </NavLink>
              <ButtonLink to="/offerte-aanvragen" size="sm">
                {site.copy.ctaQuote}
              </ButtonLink>
            </div>

            <button
              type="button"
              className="inline-flex h-10 w-[6.35rem] shrink-0 touch-manipulation items-center justify-center gap-1.5 rounded-sm border border-line bg-paper text-[0.8125rem] font-semibold tracking-[-0.01em] text-ink transition-[border-color,background-color] duration-[var(--duration-fast)] hover:border-ink/30 hover:bg-stone lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigatie"
              aria-haspopup="dialog"
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? (
                <>
                  <span>Sluiten</span>
                  <X size={15} strokeWidth={1.8} aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>Menu</span>
                  <Menu size={15} strokeWidth={1.8} aria-hidden="true" />
                </>
              )}
            </button>
          </Container>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
