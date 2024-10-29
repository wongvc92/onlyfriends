import {
  createFileRoute,
  createRouter,
  redirect,
  RootRoute,
} from '@tanstack/react-router'
import PostForm from './-components/post-form'
import { checkIfAuthenticated, useAuth } from '@/auth'
import { postsQueryOptions } from '@/data/postsByUserId'
import { useSuspenseQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/posts/')({
  beforeLoad: async ({ location }) => {
    const data = await checkIfAuthenticated()
    if (!data.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(postsQueryOptions)
  },
  component: Page,
})

function Page() {
  const { data } = useSuspenseQuery(postsQueryOptions)
  console.log('postsQuery data', data)
  return (
    <section className="w-full">
      <div className="w-full">
        <PostForm />
      </div>
      <pre>{JSON.stringify(data.posts, null, 2)}</pre>
    </section>
  )
}
