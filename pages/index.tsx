import GoodBoard from '@/components/GoodBoard'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import Deed from '@/components/Deed'

type deed = Database['public']['Tables']['deeds']['Row']

export default function Home() {
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
    <>
      <div>
        <p className="mt-8">Recording all the good you do, every day.</p>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-16">
        <div className="">
          <h2>Your good deeds</h2>
          <ul>
            {deeds.map((deed: deed) => (
              <Deed key={deed.id} deed={deed} />
            ))}
          </ul>
        </div>

        <GoodBoard />
      </div>
    </>
  )
}
