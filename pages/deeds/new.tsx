import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState, FormEvent, ChangeEvent } from 'react'

interface FormValues {
  description: string
  isPublic?: string
}

const NewCompany = () => {
  const supabase = useSupabaseClient()
  const user = useUser()

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
    const { description, isPublic } = formValues
    try {
      setLoading(true)

      const updates = {
        description,
        isPublic,
      }

      // create a new company
      let { data, error } = await supabase.from('companies').insert(updates).select().single()

      // add the current user to the new company
      let { error: userError } = await supabase.from('deeds').insert({ description: data?.description, id: 'user-id-in-here' })

      if (error) throw error
      if (userError) throw userError
      alert('Update created!')
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
        <form onSubmit={createDeed}>
          <div>
            <label htmlFor="company_name">Company name:</label>
            <input type="text" id="company_name" name="company_name" value={formValues.description || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label htmlFor="email">Make your update public?</label>
            <input type="website" id="website" name="website" value={formValues.isPublic || ''} onChange={handleInputChange} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  ) : (
    'Please login to create a company'
  )
}

export default NewCompany
