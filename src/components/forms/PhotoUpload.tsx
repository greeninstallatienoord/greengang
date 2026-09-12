import type { PhotoAttachment } from '../../types'
import { PHOTO_ACCEPT, PHOTO_MAX_FILES, validatePhotos } from '../../lib/photos'
import { Field } from './Field'

type PhotoUploadProps = {
  id?: string
  hint: string
  photos: PhotoAttachment[]
  error?: string
  onChange: (photos: PhotoAttachment[], error?: string) => void
}

export function PhotoUpload({
  id = 'photos',
  hint,
  photos,
  error,
  onChange,
}: PhotoUploadProps) {
  return (
    <Field
      id={id}
      label="Foto’s van de situatie (optioneel)"
      hint={`${hint} Maximaal ${PHOTO_MAX_FILES} bestanden, elk tot 8 MB. Foto’s worden bewaard tot u verstuurt; zonder backend worden ze niet geüpload.`}
      error={error}
    >
      <input
        id={id}
        type="file"
        accept={PHOTO_ACCEPT}
        multiple
        className="block w-full text-sm"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          const result = validatePhotos(files)
          onChange(result.accepted, result.errors[0])
        }}
      />
      {photos.length > 0 ? (
        <ul className="mt-2 grid gap-1 text-sm text-ink-muted">
          {photos.map((photo) => (
            <li key={photo.name}>
              {photo.name} ({Math.ceil(photo.size / 1024)} KB)
            </li>
          ))}
        </ul>
      ) : null}
    </Field>
  )
}
