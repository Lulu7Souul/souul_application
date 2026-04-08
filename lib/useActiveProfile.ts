'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Reads the active child profile from sessionStorage.
// If none is set (child navigated directly without PIN), redirects to dashboard.
export function useActiveProfile() {
  const router = useRouter()
  const [profileId, setProfileId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = sessionStorage.getItem('lulu_active_profile')
    if (!id) {
      router.replace('/app/dashboard')
      return
    }
    setProfileId(id)
    setReady(true)
  }, [router])

  return { profileId, ready }
}
