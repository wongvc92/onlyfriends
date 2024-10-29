import NewPasswordForm from '@/components/auth/new-password-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/new-password/')({
  component: NewPasswordPage,
})
function NewPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <NewPasswordForm />
    </div>
  )
}
