import React from 'react'
import { Database } from '@/types/supabase'

type deed = Database['public']['Tables']['deeds']['Row']

interface Props {
  deed: deed
}

export default function Deed({ deed }: Props) {
  return (
    <li className="p-4 bg-slate-50 flex items-center gap-4">
      <span className="text-xs text-mono text-slate-400">{deed.created_at}</span>
      <span>{deed.description}</span>
    </li>
  )
}
