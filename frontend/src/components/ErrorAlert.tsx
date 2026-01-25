import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TriangleAlert, X } from "lucide-react"

type ErrorAlertProps = {
  title?: string
  message: string
  onClose?: () => void
  className?: string
}

export function ErrorAlert({
  title = "Something went wrong",
  message,
  onClose,
  className,
}: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={cn("relative shadow-sm", className)}>
      <TriangleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      {onClose ? (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7 text-destructive-foreground/70 hover:text-destructive-foreground"
          onClick={onClose}
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </Alert>
  )
}
