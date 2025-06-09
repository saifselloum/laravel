"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Save } from "lucide-react"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import TextAreaInput from "@/Components/TextAreaInput"
import Checkbox from "@/Components/Checkbox"

export default function Edit({ auth, team }) {
  const { data, setData, patch, errors, processing } = useForm({
    name: team.name || "",
    description: team.description || "",
    color: team.color || "#3B82F6",
    is_active: team.is_active ?? true,
  })

  // Safety check for auth prop
  if (!auth || !auth.user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading...</h2>
          <p className="text-gray-500 dark:text-gray-400">Please wait while we load your data.</p>
        </div>
      </div>
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    patch(route("teams.update", team.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center space-x-3">
          <Link
            href={route("teams.show", team.id)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: data.color }}
          >
            {data.name ? data.name.charAt(0).toUpperCase() : team.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Team</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update team information and settings</p>
          </div>
        </div>
      }
    >
      <Head title={`Edit Team: ${team.name}`} />

      <div className="py-8">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update the details for this team</p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              {/* Team Name */}
              <div>
                <InputLabel htmlFor="name" value="Team Name" className="font-medium" />
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-2 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter team name"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Team Description */}
              <div>
                <InputLabel htmlFor="description" value="Description" className="font-medium" />
                <TextAreaInput
                  id="description"
                  name="description"
                  value={data.description}
                  className="mt-2 block w-full"
                  rows={4}
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Describe the team's purpose and responsibilities"
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              {/* Team Color */}
              <div>
                <InputLabel htmlFor="color" value="Team Color" className="font-medium" />
                <div className="mt-2 flex items-center space-x-3">
                  <input
                    id="color"
                    type="color"
                    name="color"
                    value={data.color}
                    onChange={(e) => setData("color", e.target.value)}
                    className="h-10 w-20 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <TextInput
                      type="text"
                      value={data.color}
                      onChange={(e) => setData("color", e.target.value)}
                      className="w-full"
                      placeholder="#3B82F6"
                    />
                  </div>
                  <div
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: data.color }}
                  >
                    {data.name ? data.name.charAt(0).toUpperCase() : "T"}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This color will be used to identify the team throughout the application
                </p>
                <InputError message={errors.color} className="mt-2" />
              </div>

              {/* Team Status */}
              <div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="is_active"
                    name="is_active"
                    checked={data.is_active}
                    onChange={(e) => setData("is_active", e.target.checked)}
                  />
                  <div>
                    <InputLabel htmlFor="is_active" value="Active Team" className="font-medium" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Inactive teams won't be available for new assignments
                    </p>
                  </div>
                </div>
                <InputError message={errors.is_active} className="mt-2" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={route("teams.show", team.id)}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Team
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
