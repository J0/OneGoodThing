import GoodBoard from '@/components/PublicBoard'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import Deed from '@/components/Deed'
import { CheckIcon, FaceIcon, ImageIcon, Pencil2Icon, SunIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

type deed = Database['public']['Tables']['deeds']['Row']

const today = new Date().toISOString().slice(0, 10)

export default function Home() {
  const supabase = useSupabaseClient()
  const [deeds, setDeeds] = useState<any>([])
  console.log('deeds', deeds)
  // check if user has already posted today
  const [deedUpToDate, setDeedUpToDate] = useState(false)
  const user = useUser()

  useEffect(() => {
    async function fetchDeeds() {
      try {
        let { data: deeds, error } = await supabase.from('deeds').select().eq('user_id', user?.id).limit(20)

        // if you've got a Deed with created_at == today, you're up to date
        if (deeds?.map((deed) => deed.created_at !== today)) {
          setDeedUpToDate(true)
        }

        if (deeds) setDeeds(deeds)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDeeds()
  }, [user])

  return (
    <>
      <div>
        <p className="mt-8">Recording all the good you do, every day. </p>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-16">
        <div className="border-r pr-16">
          <h2 className="mb-4">Your good deeds</h2>
          {deedUpToDate ? (
            <div className="flex gap-1 items-center bg-green-50 p-2">
              <CheckIcon />
              <span>You are up to date</span>
            </div>
          ) : (
            <p className="flex gap-1 items-center">
              <Pencil2Icon />
              <Link href="deeds/new">Post your update for today!</Link>
            </p>
          )}
          <ul className="grid gap-2 mt-4">
            {deeds.map((deed: deed) => (
              <Deed key={deed.id} deed={deed} />
            ))}
          </ul>
        </div>

        <GoodBoard />
      </div>
      <div className="mt-24 border-t pt-12">
        <h2 className="text-lg">Why One Good Thing?</h2>
        <p className="text-slate-600 mt-4">
          Are you tired of feeling weighed down by the negativity around you? Do you want to make a change in your life and spread
          positivity? <em>One Good Thing</em> is the solution you have been looking for! With our innovative platform, you can share one
          positive thing that you haveve accomplished each day, no matter how big or small. By sharing your achievements with the world, you
          willl inspire others and create a ripple effect of positivity. <em>One Good Thing</em> is the perfect way to start your day on a
          positive note and cultivate a more optimistic outlook. Join us and start making a difference, one good thing at a time!
        </p>
      </div>
    </>
  )
}
