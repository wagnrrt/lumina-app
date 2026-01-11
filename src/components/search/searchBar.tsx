import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'

interface SearchBarProps {
  onSearch: (city: string) => void
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      onSearch(searchInput.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:w-auto sm:min-w-[280px] md:w-96 group">
      <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-100 transition-colors w-3.5 h-3.5 sm:w-4 sm:h-4" />
      <Input
        type="text"
        className="w-full py-2 sm:py-2.5 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm"
        placeholder="Pesquisar cidade..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </form>
  )
}
