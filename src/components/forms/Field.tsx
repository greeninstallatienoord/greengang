import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1 text-sm text-ink-muted">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

export function TextInput({ error, className, id, ...props }: TextInputProps) {
  return (
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(
        'min-h-11 w-full rounded-md border border-line bg-paper px-3 text-base outline-none focus:border-brand',
        error && 'border-danger',
        className,
      )}
      {...props}
    />
  )
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
}

export function TextArea({ error, className, id, ...props }: TextAreaProps) {
  return (
    <textarea
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(
        'min-h-28 w-full rounded-md border border-line bg-paper px-3 py-2 text-base outline-none focus:border-brand',
        error && 'border-danger',
        className,
      )}
      {...props}
    />
  )
}
