import { toast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

type VerifyEmailParams = {
  token: string
}
export const Route = createFileRoute('/(auth)/verify-email/')({
  validateSearch: (search: Record<string, unknown>): VerifyEmailParams => {
    return {
      token: (search.token as string) || '',
    }
  },
  component: VerifyEmail,
})

function VerifyEmail() {
  const navigate = useNavigate({ from: '/verify-email' })
  const { token } = Route.useSearch()
  const queryClient = useQueryClient()

  const verifyToken = async (token: string) => {
    const url = 'http://localhost:5001/api/register/verify-email'
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) {
      const errorData = await res.json()
      return errorData
    }
    return await res.json()
  }

  const { mutate, isPending } = useMutation({
    mutationFn: verifyToken,
    onSuccess: (data) => {
      toast({
        variant: 'default',
        description: data.message || 'Successfully verified!',
      })
      navigate({ to: '/login' })
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['register'] })
    },

    onError: (data) => {
      toast({
        variant: 'destructive',
        description: data.message || 'verification failed.',
      })
      return
    },
  })

  useEffect(() => {
    if (token) {
      mutate(token)
    }
  }, [mutate, token])

  if (isPending) {
    return <p>Verifying email...</p>
  }
  return (
    <div className="px-4">
      <h1>Email Verification</h1>
      <p>Your token is: {token}</p>
    </div>
  )
}
