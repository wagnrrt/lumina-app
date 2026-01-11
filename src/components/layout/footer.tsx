export const Footer = () => {
  return (
    <footer className="pt-6 sm:pt-8 md:pt-16 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 border-t border-border">
      <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.3em] sm:tracking-[0.4em] text-center sm:text-left">
        Lumina Intelligence &copy; 2025
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
        <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em]">
          Previsão do Tempo
        </span>
      </div>
    </footer>
  )
}
