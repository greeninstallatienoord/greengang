import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
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
      <label htmlFor={id} className="mb-2 block text-[0.95rem] font-semibold tracking-[-0.01em]">
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

export function TextInput({ error, className, id, type, inputMode, ...props }: TextInputProps) {
  const resolvedInputMode =
    inputMode ?? (type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined)

  return (
    <input
      id={id}
      type={type}
      inputMode={resolvedInputMode}
      aria-invalid={Boolean(error)}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(
        'min-h-12 w-full rounded-sm border border-line bg-surface px-3.5 text-base outline-none transition-colors focus:border-brand',
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
        'min-h-32 w-full rounded-sm border border-line bg-surface px-3.5 py-3 text-base outline-none transition-colors focus:border-brand',
        error && 'border-danger',
        className,
      )}
      {...props}
    />
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string
}

export function SelectInput({ error, className, id, children, ...props }: SelectProps) {
  return (
    <select
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error && id ? `${id}-error` : undefined}
      className={cn(
        'min-h-12 w-full rounded-sm border border-line bg-surface px-3.5 text-base outline-none transition-colors focus:border-brand',
        error && 'border-danger',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
