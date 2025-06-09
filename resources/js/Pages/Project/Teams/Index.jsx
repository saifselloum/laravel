"use client"

import { Head, Link } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { router } from "@inertiajs/react"

export default function Index({ auth, project, teams, isCreator }) {
  const deleteTeam = (team) => {
    if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      router.delete(route("project.teams.destroy", [project.id, team.id]))
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Teams - {project.name}</h2>
          {isCreator && (
            <Link
              href={route("project.teams.create", project.id)}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
            >
              Create Team
            </Link>
          )}
        </div>
      }
    >
      <Head title={`Teams - ${project.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {teams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No teams created yet.</p>
                  {isCreator && (
                    <Link
                      href={route("project.teams.create", project.id)}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700"
                    >
                      Create First Team
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.color }}></div>
                          <div className="flex space-x-2">
                            <Link
                              href={route("project.teams.show", [project.id, team.id])}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View
                            </Link>
                            {(isCreator || team.team_leader_id === auth.user.id) && (
                              <Link
                                href={route("project.teams.edit", [project.id, team.id])}
                                className="text-emerald-600 hover:text-emerald-800 text-sm"
                              >
                                Edit
                              </Link>
                            )}
                            {isCreator && (
                              <button
                                onClick={() => deleteTeam(team)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{team.name}</h3>

                        {team.description && <p className="text-gray-600 text-sm mb-4">{team.description}</p>}

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Leader:</span>
                            <span className="font-medium">{team.leader.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Members:</span>
                            <span className="font-medium">{team.members_count || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Tasks:</span>
                            <span className="font-medium">{team.tasks_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
