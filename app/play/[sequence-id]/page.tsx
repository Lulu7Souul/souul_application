import { PlayerClient } from '@/components/player/PlayerClient'

export default function PlayerPage({
  params,
}: {
  params: { 'sequence-id': string }
}) {
  return <PlayerClient sequenceId={params['sequence-id']} />
}
