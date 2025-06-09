"use client"

import { useState } from "react"
import { Head, useForm } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import TextAreaInput from "@/Components/TextAreaInput"
import SelectInput from "@/Components/SelectInput"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import { Link } from "@inertiajs/react"

export default function Create({ auth, project, projectMembers }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    description: "",
    color: "#3B82F6",
    team_leader_id: "",
    member_ids: [],
  })

  const [selectedMembers, setSelectedMembers] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("project.teams.store", project.id), {
      onSuccess: () => reset(),
    })
  }

  const toggleMember = (memberId) => {
    const newSelectedMembers = selectedMembers.includes(memberId)
      ? selectedMembers.filter((id) => id !== memberId)
      : [...selectedMembers, memberId]

    setSelectedMembers(newSelectedMembers)
    setData("member_ids", newSelectedMembers)
  }

  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Team - {project.name}</h2>
        </div>
      }
    >
      <Head title={`Create Team - ${project.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Team Name" />
                  <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("name", e.target.value)}
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="description" value="Description" />
                  <TextAreaInput
                    id="description"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("description", e.target.value)}
                    rows={3}
                  />
                  <InputError message={errors.description} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="color" value="Team Color" />
                  <div className="mt-2 flex space-x-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          data.color === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setData("color", color)}
                      />
                    ))}
                  </div>
                  <InputError message={errors.color} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="team_leader_id" value="Team Leader" />
                  <SelectInput
                    id="team_leader_id"
                    name="team_leader_id"
                    value={data.team_leader_id}
                    className="mt-1 block w-full"
                    onChange={(e) => setData("team_leader_id", e.target.value)}
                    required
                  >
                    <option value="">Select Team Leader</option>
                    {projectMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </SelectInput>
                  <InputError message={errors.team_leader_id} className="mt-2" />
                </div>

                <div>
                  <InputLabel value="Team Members" />
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
                    {projectMembers.map((member) => (
                      <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => toggleMember(member.id)}
                          className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                        <span className="text-sm">
                          {member.name} ({member.email})
                        </span>
                      </label>
                    ))}
                  </div>
                  <InputError message={errors.member_ids} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                  <PrimaryButton disabled={processing}>Create Team</PrimaryButton>

                  <Link
                    href={route("project.teams.index", project.id)}
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
