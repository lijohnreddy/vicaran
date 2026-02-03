import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export default function Logo({ width = 32, height = 32, className = "" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt=""
        width={width}
        height={height}
        className="flex-shrink-0"
        priority
      />
      <span className="hidden sm:block font-bold text-slate-700 dark:text-white">Vicaran</span>
    </div>
  )
}
