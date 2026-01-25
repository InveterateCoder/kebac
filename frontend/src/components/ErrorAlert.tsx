import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from "lucide-react"

type ErrorAlertProps = {
  title?: string
  message: string
}

export function ErrorAlert({ title = "Something went wrong", message }: ErrorAlertProps) {
  if (!message) return null

  return (
    <Alert variant="destructive" className="shadow-sm">
      <TriangleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
