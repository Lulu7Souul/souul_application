import { CalmClient } from '@/components/player/CalmClient'

export default function CalmPage({
  searchParams,
}: {
  searchParams: { returnTo?: string }
}) {
  return <CalmClient returnTo={searchParams.returnTo ?? '/play/today'} />
}
