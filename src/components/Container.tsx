import type { ElementType, ReactNode } from 'react'
import { cn } from '../lib/cn'

type ContainerProps = {
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Container({
  as: Component = 'div',
  className,
  children,
}: ContainerProps) {
  return (
    <Component className={cn('container-page', className)}>{children}</Component>
  )
}
