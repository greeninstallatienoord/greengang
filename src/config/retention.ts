/**
 * Operational retention guidelines for personal data.
 * Privacy copy and LEGAL_REVIEW.md derive from this file.
 * Owner confirmation recommended before treating these as definitive policy.
 */

export const retentionPolicy = {
  lastReviewed: '2026-09-13',
  note:
    'Richtlijnen voor de bedrijfsvoering. Kortere of langere bewaring kan nodig zijn bij een lopende klacht, garantie of wettelijke verplichting.',
  items: [
    {
      activity: 'Contactaanvragen',
      retention: 'Tot 24 maanden na afronding of laatste inhoudelijke opvolging',
      basis: 'Administratie en opvolging van verzoeken',
    },
    {
      activity: 'Offerteaanvragen',
      retention: 'Tot 36 maanden na laatste statuswijziging of afronding',
      basis: 'Opvolging van aanvragen en redelijke bedrijfsadministratie',
    },
    {
      activity: 'Afspraakaanvragen en afspraken',
      retention: 'Tot 36 maanden na afronding of annulering',
      basis: 'Planning, servicehistorie en redelijke bedrijfsadministratie',
    },
    {
      activity: 'Klantadministratie (klantprofiel)',
      retention:
        'Zolang er een lopende relatie of openstaande opvolging is, daarna tot maximaal 36 maanden na laatste activiteit, tenzij langer nodig voor garantie of geschil',
      basis: 'Uitvoering / voorbereiding van werkzaamheden en administratie',
    },
    {
      activity: 'E-maillogs (verzonden berichten)',
      retention: 'Tot 24 maanden',
      basis: 'Bewijs van verzending en klantcommunicatie',
    },
    {
      activity: 'Formulierconcepten in de browser',
      retention: 'Alleen tijdens de browsersessie (sessionStorage)',
      basis: 'Gebruiksgemak van het formulier',
    },
    {
      activity: 'Cookievoorkeuren',
      retention: 'Tot u de browsergegevens wist of de keuze wijzigt',
      basis: 'Vastleggen van uw cookiekeuze',
    },
    {
      activity: 'Beheersessies',
      retention: 'Maximaal 12 uur (idle 2 uur)',
      basis: 'Beveiligde toegang tot het beheerscherm',
    },
    {
      activity: 'Beveiligings- en misbruiklogs',
      retention: 'Beperkt, voor beveiliging en misbruikpreventie',
      basis: 'Gerechtvaardigd belang bij beveiliging van systemen',
    },
  ],
} as const
