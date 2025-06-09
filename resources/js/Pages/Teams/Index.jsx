"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, router } from "@inertiajs/react"
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, UserCheck } from "lucide-react"
import { useState } from "react"
import TextInput from "@/Components/TextInput"
import SelectInput from "@/Components/SelectInput"

export default function Index({ auth, teams, filters }) {
  const [search, setSearch] = useState(filters.search || "")
  const [status, setStatus] = useState(filters.status || "")

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

  const handleSearch = (e) => {
    e.preventDefault()
    router.get(route("teams.index"), { search, status }, { preserveState: true })
  }

  const deleteTeam = (team) => {
    if (confirm(`Are you sure you want to delete the team "${team.name}"?`)) {
      router.delete(route("teams.destroy", team.id))
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Teams</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your project teams</p>
            </div>
          </div>
          <Link
            href={route("teams.create")}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Team
          </Link>
        </div>
      }
    >
      <Head title="Teams" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <TextInput
                  className="pl-10 w-full"
                  placeholder="Search teams..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <SelectInput className="pl-10 w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">All Teams</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </SelectInput>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.data.map((team) => (
              <div
                key={team.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: team.color }}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              team.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {team.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {team.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{team.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <UserCheck className="h-4 w-4" />
                      <span>{team.members_count || 0} members</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Created {team.created_at}</div>
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={route("teams.show", team.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="View Team"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={route("teams.edit", team.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Team"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteTeam(team)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Team"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {teams.data.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No teams found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {search || status ? "Try adjusting your search criteria." : "Get started by creating your first team."}
              </p>
              <Link
                href={route("teams.create")}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
