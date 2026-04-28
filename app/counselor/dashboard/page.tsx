'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CounselorDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteStatus, setInviteStatus] = useState('')
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/signup'); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (!prof || prof.role !== 'counselor') { router.push('/dashboard'); return }
      setProfile(prof)

      const { data: cs } = await supabase
        .from('counselor_students')
        .select('*, student:student_id(user_id, full_name, email, gpa, intended_major, grade)')
        .eq('counselor_id', session.user.id)

      setStudents(cs || [])
      setLoading(false)
    }
    init()
  }, [])

  const sendInvite = async () => {
    setInviteStatus('loading')
    setInviteError('')
    setInviteSuccess(false)

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, email')
      .ilike('email', inviteEmail.trim())
      .single()

    console.log('lookup:', data, error)

    if (error || !data) {
      setInviteStatus('')
      setInviteError('No SheldonAI account found with that email.')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()

    const { error: insertError } = await supabase
      .from('counselor_students')
      .insert({
        counselor_id: session!.user.id,
        student_id: data.user_id,
        invite_status: 'pending'
      })

    if (insertError) {
      setInviteStatus('')
      setInviteError('Failed to send invite: ' + insertError.message)
      return
    }

    // Refresh roster so new card appears immediately
    const { data: cs } = await supabase
      .from('counselor_students')
      .select('*, student:student_id(user_id, full_name, email, gpa, intended_major, grade)')
      .eq('counselor_id', session!.user.id)
    setStudents(cs || [])

    setInviteStatus('')
    setInviteSuccess(true)
    setInviteEmail('')
    setTimeout(() => { setShowModal(false); setInviteSuccess(false) }, 1500)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(10,10,18,0.4)', fontSize: 14 }}>Loading...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* NAV */}
      <nav style={{ height: 56, borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link href="/" style={{ color: 'rgba(10,10,18,0.45)', fontSize: '22px', textDecoration: 'none', marginRight: '14px', lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.color = '#9a7040')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,18,0.45)')}>←</Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 500, color: '#0a0a12' }}>
              Sheldon<span style={{ color: '#9a7040' }}>AI</span>
            </span>
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 13, color: 'rgba(10,10,18,0.45)' }}>{profile?.email}</span>
          <Link href="/settings" style={{ color: 'rgba(10,10,18,0.4)', textDecoration: 'none', fontSize: 18 }}>⚙</Link>
          <button onClick={signOut} style={{ fontSize: 13, color: 'rgba(10,10,18,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 500, color: '#0a0a12', marginBottom: 4 }}>
              {greeting}, {profile?.full_name?.split(' ')[0] || 'Counselor'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(10,10,18,0.45)' }}>Your student roster</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#9a7040', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            + Add Student
          </button>
        </div>

        {/* STATS BAR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Total Students', value: students.length },
            { label: 'Active', value: students.filter(s => s.invite_status === 'accepted').length },
            { label: 'Pending', value: students.filter(s => s.invite_status === 'pending').length },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'rgba(154,112,64,0.05)', border: '0.5px solid rgba(154,112,64,0.2)', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: '#9a7040', fontFamily: 'Georgia,serif' }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(10,10,18,0.45)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* STUDENT GRID */}
        {students.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 500, color: '#0a0a12', marginBottom: 8 }}>No students yet</div>
            <div style={{ fontSize: 13, color: 'rgba(10,10,18,0.45)', marginBottom: 24 }}>Click &quot;+ Add Student&quot; to invite your first student.</div>
            <button onClick={() => setShowModal(true)} style={{ background: '#9a7040', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' }}>+ Add Your First Student</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {students.map(s => (
              <div key={s.id} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.09)', borderRadius: 14, padding: 24, transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 500, fontSize: 15, color: '#0a0a12' }}>{s.student?.full_name || 'Unnamed Student'}</div>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 999,
                    background: s.invite_status === 'accepted' ? 'rgba(22,163,74,0.1)' : 'rgba(234,179,8,0.1)',
                    color: s.invite_status === 'accepted' ? '#16a34a' : '#a16207'
                  }}>
                    {s.invite_status === 'accepted' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(10,10,18,0.4)', marginBottom: 16 }}>{s.student?.email}</div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '0.5px solid rgba(0,0,0,0.07)' }}>
                  {[
                    { label: 'GPA', value: s.student?.gpa || '—' },
                    { label: 'Grade', value: s.student?.grade || '—' },
                    { label: 'Major', value: s.student?.intended_major ? s.student.intended_major.substring(0,12) + (s.student.intended_major.length > 12 ? '…' : '') : '—' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 11, color: 'rgba(10,10,18,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{stat.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#0a0a12' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
                {s.invite_status === 'accepted' ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => router.push('/counselor/student/' + s.student_id)} style={{ flex: 1, padding: '8px 0', border: '1px solid #9a7040', borderRadius: 8, background: '#fff', color: '#9a7040', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      View Profile
                    </button>
                    <button onClick={() => router.push('/counselor/student/' + s.student_id + '/essays')} style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, background: '#9a7040', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      View Essays
                    </button>
                  </div>
                ) : (
                  <button disabled style={{ width: '100%', padding: '8px 0', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, background: 'rgba(0,0,0,0.03)', color: 'rgba(10,10,18,0.3)', fontSize: 13, cursor: 'default' }}>
                    Awaiting acceptance
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ADD STUDENT MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: 440, maxWidth: '90vw', position: 'relative' }}>
            <button onClick={() => { setShowModal(false); setInviteStatus(''); setInviteError(''); setInviteSuccess(false) }} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'rgba(10,10,18,0.4)' }}>×</button>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 500, color: '#0a0a12', marginBottom: 6 }}>Invite a Student</div>
            <div style={{ fontSize: 13, color: 'rgba(10,10,18,0.45)', marginBottom: 20 }}>Enter their email. They must already have a SheldonAI account.</div>
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="student@email.com"
              style={{ width: '100%', padding: '10px 14px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, fontSize: 14, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }}
            />
            {inviteError && (
              <div style={{ fontSize: 13, color: '#dc2626', marginBottom: 12 }}>{inviteError}</div>
            )}
            {inviteSuccess && (
              <div style={{ fontSize: 13, color: '#16a34a', marginBottom: 12 }}>Invitation sent! ✓</div>
            )}
            <button
              onClick={sendInvite}
              disabled={inviteStatus === 'loading'}
              style={{ width: '100%', height: 44, background: '#9a7040', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
            >
              {inviteStatus === 'loading' ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
