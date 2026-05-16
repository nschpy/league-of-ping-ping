import { useState } from 'react'
import { useProfileData } from './use-profile-data'
import { ProfileHeroCard } from './components/ProfileHeroCard'
import { MmrHistoryCard } from './components/MmrHistoryCard'
import { EditProfileModal } from './components/EditProfileModal'
import { ProfileSkeleton } from './components/ProfileSkeleton'
import { useAuthStore } from '@/stores/auth'

export function ProfilePage() {
  const { data, loading, error, refetch } = useProfileData()
  const [editOpen, setEditOpen] = useState(false)
  const setAuth = useAuthStore(s => s.setAuth)
  const token = useAuthStore(s => s.token)
  const user = useAuthStore(s => s.user)

  if (loading) return <ProfileSkeleton />
  if (error) return (
    <div className="p-6 md:p-8 flex items-center justify-center min-h-[40vh]">
      <p className="text-destructive text-[14px] font-mono">{error}</p>
    </div>
  )
  if (!data) return null

  const handleSaved = ({ nickname }: { nickname: string }) => {
    // Sync the auth store if nickname changed (token stays valid)
    if (user && token) {
      setAuth(token, { ...user, nickname })
    }
    refetch()
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-5">
      <ProfileHeroCard data={data} onEdit={() => setEditOpen(true)} />
      <MmrHistoryCard history={data.mmrHistory} />
      {data.user.isMe && (
        <EditProfileModal
          open={editOpen}
          current={{ nickname: data.user.nickname, city: data.user.city }}
          onClose={() => setEditOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
