import { Cloud } from 'lucide-react'
import { SearchBar } from '../search/searchBar'

interface HeaderProps {
  onSearch: (city: string) => void
}

export const Header = ({ onSearch }: HeaderProps) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center text-background flex-shrink-0">
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="leading-none">
          <h1 className="text-base sm:text-lg font-bold tracking-tight">Lumina</h1>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">
            Weather Engine
          </p>
        </div>
      </div>

      <SearchBar onSearch={onSearch} />
    </header>
  )
}
