import type { TrustCertification } from '../../data/trust'
import { Card } from '../Card'

type CertificationCardProps = {
  certification: TrustCertification
}

export function CertificationCard({ certification }: CertificationCardProps) {
  if (!certification.approved) return null

  return (
    <Card>
      {certification.logo ? (
        <img
          src={certification.logo}
          alt=""
          className="mb-4 h-12 w-auto object-contain"
        />
      ) : null}
      <h3 className="font-semibold">{certification.name}</h3>
      <p className="mt-2 text-sm text-ink-muted">{certification.description}</p>
      {certification.certificateRef ? (
        <p className="mt-3 text-sm">
          <span className="text-ink-muted">Nummer: </span>
          {certification.certificateRef}
        </p>
      ) : null}
      {certification.validUntil ? (
        <p className="mt-1 text-sm">
          <span className="text-ink-muted">Geldig tot: </span>
          {certification.validUntil}
        </p>
      ) : null}
      {certification.certificateImage ? (
        <img
          src={certification.certificateImage}
          alt={`Certificaat ${certification.name}`}
          className="mt-4 w-full rounded-md border border-line object-contain"
        />
      ) : null}
      {certification.verificationUrl ? (
        <p className="mt-3 text-sm">
          <a
            href={certification.verificationUrl}
            className="font-semibold underline underline-offset-2"
            rel="noopener noreferrer"
            target="_blank"
          >
            Controleer bij de uitgever
          </a>
        </p>
      ) : null}
    </Card>
  )
}
