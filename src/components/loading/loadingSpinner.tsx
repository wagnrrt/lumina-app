import { LoaderCircle } from 'lucide-react'

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-16 sm:py-20">
      <LoaderCircle className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
      <p className="text-muted-foreground text-[11px] sm:text-[12px] uppercase tracking-[0.3em]">
        Carregando dados...
      </p>
    </div>
  )
}
