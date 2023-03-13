import React, { useState } from 'react'

export default function New() {
  const [newDeed, setNewDeed] = useState('')

  function submitForm() {}
  return (
    <form onSubmit={submitForm} className="">
      <div className="grid gap-2">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          className="p-1 border"
          placeholder="What good did you do today?"
          //id={deedName + 'name'}
          //name="skill_name"
          value={newDeed}
          onChange={(e) => setNewDeed(e.target.value)}
        />
      </div>
      <p className="mt-4">
        <button type="submit">Submit</button>
      </p>
    </form>
  )
}
