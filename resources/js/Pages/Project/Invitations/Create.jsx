"use client"

import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import { Link } from "@inertiajs/react"

export default function Create({ auth, project, users }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
  })

  const [suggestions, setSuggestions] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("project.invitations.store", project.id), {
      onSuccess: () => reset(),
    })
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setData("email", value)

    // Show suggestions based on input
    if (value.length > 1) {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (email) => {
    setData("email", email)
    setSuggestions([])
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Invite User to {project.name}</h2>
        </div>
      }
    >
      <Head title={`Invite User - ${project.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <InputLabel htmlFor="email" value="Email Address" />
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    onChange={handleEmailChange}
                    placeholder="Enter email address or start typing to see suggestions"
                    required
                  />
                  <InputError message={errors.email} className="mt-2" />

                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                      {suggestions.map((user) => (
                        <div
                          key={user.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectSuggestion(user.email)}
                        >
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <PrimaryButton disabled={processing}>Send Invitation</PrimaryButton>

                  <Link
                    href={route("project.invitations.index", project.id)}
                    className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
