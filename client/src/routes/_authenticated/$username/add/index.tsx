import { createFileRoute } from '@tanstack/react-router'
import EditProfileForm from './-components/add-profile-form'

export const Route = createFileRoute('/_authenticated/$username/add/')({
  component: EditProfile,
})

function EditProfile() {
  return (
    <div>
      <EditProfileForm />
    </div>
  )
}
