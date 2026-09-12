import type { BlogCategorySlug, ServiceSlug } from '../types'
import comfort from '../assets/images/blog/comfort.jpg'
import tips from '../assets/images/blog/tips.jpg'
import heroHome from '../assets/images/hero/home.jpg'
import airco from '../assets/images/services/airco.jpg'
import cvKetel from '../assets/images/services/cv-ketel.jpg'
import onderhoud from '../assets/images/services/onderhoud.jpg'
import warmtepomp from '../assets/images/services/warmtepomp.jpg'

export type MediaAsset = {
  src: string
  width: number
  height: number
  alt: string
}

export const heroImage: MediaAsset = {
  src: heroHome,
  width: 1280,
  height: 720,
  alt: 'Monteur installeert een binnenunit voor klimaatbeheersing in een moderne woonkamer',
}

export const serviceImages: Record<ServiceSlug, MediaAsset> = {
  'cv-ketel': {
    src: cvKetel,
    width: 1152,
    height: 864,
    alt: 'Nette cv-ketelopstelling in een technische ruimte',
  },
  airco: {
    src: airco,
    width: 1152,
    height: 864,
    alt: 'Binnenunit van een airconditioning in een lichte slaapkamer',
  },
  warmtepomp: {
    src: warmtepomp,
    width: 1152,
    height: 864,
    alt: 'Buitenunit van een warmtepomp bij een bakstenen woning',
  },
  'service-onderhoud': {
    src: onderhoud,
    width: 1152,
    height: 864,
    alt: 'Onderhoud aan een cv-ketel, met gereedschap en meetapparatuur',
  },
}

const blogComfort: MediaAsset = {
  src: comfort,
  width: 1280,
  height: 720,
  alt: 'Lichte woonkamer met een discreet geplaatste klimaatunit',
}

const blogTips: MediaAsset = {
  src: tips,
  width: 1280,
  height: 720,
  alt: 'Aantekeningen en een tablet bij een binnenunit, ter voorbereiding van een offerte',
}

export const blogImages: Record<BlogCategorySlug, MediaAsset> = {
  'cv-ketel': serviceImages['cv-ketel'],
  airco: serviceImages.airco,
  warmtepomp: serviceImages.warmtepomp,
  onderhoud: serviceImages['service-onderhoud'],
  'energie-comfort': blogComfort,
  'praktische-tips': blogTips,
}

export const localImage: MediaAsset = {
  src: warmtepomp,
  width: 1152,
  height: 864,
  alt: 'Illustratief beeld van een Nederlandse woning met een buitenopstelling voor klimaattechniek',
}

export function serviceImage(slug: ServiceSlug): MediaAsset {
  return serviceImages[slug]
}

export function blogImage(category: BlogCategorySlug): MediaAsset {
  return blogImages[category]
}
