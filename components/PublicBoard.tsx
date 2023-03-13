import React from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import Deed from './Deed'

type deed = Database['public']['Tables']['deeds']['Row']

export default function GoodBoard() {
  const supabase = useSupabaseClient()
  const [deeds, setDeeds] = useState<any>([])

  useEffect(() => {
    async function fetchDeeds() {
      try {
        let { data: deeds, error } = await supabase.from('deeds').select().limit(20)
        if (deeds) setDeeds(deeds)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDeeds()
  })

  return (
    <div>
      <h2>Good board</h2>
      <p>Get inspiration from all the good that others have done</p>
      <ul>
        {deeds.map((deed: deed) => (
          <Deed key={deed.id} deed={deed} />
        ))}
      </ul>
    </div>
  )
}
