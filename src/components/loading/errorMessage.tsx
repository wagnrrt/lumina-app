interface ErrorMessageProps {
  message: string
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const formattedMessage = message.replace(/NetworkError/g, 'Network Error')
  return (
    <div className="flex items-center justify-center py-16 sm:py-20">
      <p className="text-muted-foreground text-[11px] sm:text-[12px] uppercase tracking-widest text-center px-4">
        {formattedMessage}
      </p>
    </div>
  )
}
