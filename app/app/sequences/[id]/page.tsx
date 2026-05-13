import { redirect } from 'next/navigation'

export default function SequenceDetailPage({ params }: { params: { id: string } }) {
  redirect(`/app/sequences/${params.id}/builder`)
}
