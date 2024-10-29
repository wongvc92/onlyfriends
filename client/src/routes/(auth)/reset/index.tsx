import ResetForm from '@/components/auth/reset-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/reset/')({
  component: ResetPage,
})

function ResetPage() {
  return (
    <div className="px-4 max-w-md mx-auto">
      <ResetForm />
    </div>
  )
}
