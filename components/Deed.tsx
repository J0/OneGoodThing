import React from 'react'
import { Database } from '@/types/supabase'

type deed = Database['public']['Tables']['deeds']['Row']

interface Props {
  deed: deed
}

export default function Deed({ deed }: Props) {
  return <li>{deed.description}</li>
}
