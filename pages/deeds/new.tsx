import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState, FormEvent, ChangeEvent } from 'react'

interface FormValues {
  description: string
  isPublic?: string
}

export default function NewDeed() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState<FormValues>({description: ''})

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(formValues)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })
  }

  async function createDeed(e: any) {
    e.preventDefault()
    console.log(formValues)
    const { description, isPublic } = formValues
    try {
      setLoading(true)

      const updates = {
        user_id: user?.id,
        description,
        is_public: isPublic,
      }

      // create a new deed
      let { data, error } = await supabase.from('deeds').insert(updates).select().single()

      if (error) throw error
      console.log('Update created')
      // go back to home upon success
      router.push('/')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return user ? (
    <div className="container mx-auto">
      <div className="grid">
        <form onSubmit={createDeed} className="grid gap-4">
          <div>
            <label htmlFor="description">Today's good deed: </label>
            <input
              className="border p-4 w-full"
              type="text"
              id="description"
              name="description"
              value={formValues.description || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="isPublic" className="flex gap-4">
              <input type="checkbox" id="isPublic" name="isPublic" value={formValues.isPublic || ''} onChange={handleInputChange} />
              <span>Make your update public?</span>
            </label>
          </div>
          <p>
            <button
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              type="submit"
            >
              Submit
            </button>
          </p>
        </form>
      </div>
    </div>
  ) : (
    "Please login to create today's deed"
  )
}
