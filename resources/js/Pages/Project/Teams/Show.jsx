"use client"

import { Head, Link, router } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { ArrowLeft, Edit, Trash2, UserPlus, UserMinus, Users, CheckSquare } from "lucide-react"
import { useState } from "react"

export default function Show({ auth, project, team, tasks, canManage, isProjectCreator, isTeamLeader }) {
  const [showAddMember, setShowAddMember] = useState(false)

  const deleteTeam = () => {
    if (confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      router.delete(route("project.teams.destroy", [project.id, team.id]))
    }
  }

  const removeMember = (user) => {
    if (confirm(`Remove ${user.name} from the team?`)) {
      router.delete(route("project.teams.removeMember", [project.id, team.id, user.id]))
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    )
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center">
            <Link href={route("project.teams.index", project.id)} className="mr-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            {team.name} - {project.name}
          </h2>
          <div className="flex space-x-2">
            {canManage && (
              <Link
                href={route("project.teams.edit", [project.id, team.id])}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Team
              </Link>
            )}
            {isProjectCreator && (
              <button
                onClick={deleteTeam}
                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Team
              </button>
            )}
          </div>
        </div>
      }
    >
      <Head title={`${team.name} - ${project.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Team Details Card */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full mr-3" style={{ backgroundColor: team.color }}></div>
                <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
              </div>

              {team.description && <p className="text-gray-600 mb-4">{team.description}</p>}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Team Leader</h3>
                  <p className="mt-1 text-gray-900">{team.leader.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Members</h3>
                  <p className="mt-1 text-gray-900">{team.members?.length || 0} members</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tasks</h3>
                  <p className="mt-1 text-gray-900">{tasks?.length || 0} tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Team Members
                </h2>
                {canManage && (
                  <button
                    onClick={() => setShowAddMember(!showAddMember)}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add Member
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Team Leader */}
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {team.leader.name.charAt(0)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">{team.leader.name}</p>
                    <p className="text-xs text-blue-600">Team Leader</p>
                  </div>
                </div>

                {/* Team Members */}
                {team.members?.map((member) => (
                  <div key={member.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">Member</p>
                    </div>
                    {canManage && (
                      <button onClick={() => removeMember(member)} className="text-red-600 hover:text-red-800 p-1">
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Tasks */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CheckSquare className="h-5 w-5 mr-2" />
                  Team Tasks
                </h2>
                <Link
                  href={route("task.create", { team_id: team.id })}
                  className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700"
                >
                  Create Task
                </Link>
              </div>

              {tasks?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Task Name</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Priority</th>
                        <th className="px-6 py-3">Assigned To</th>
                        <th className="px-6 py-3">Due Date</th>
                        <th className="px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="bg-white border-b">
                          <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                          <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                task.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : task.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {task.priority?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">{task.assigned_user?.name || "Unassigned"}</td>
                          <td className="px-6 py-4">{task.due_date}</td>
                          <td className="px-6 py-4">
                            <Link href={route("task.show", task.id)} className="text-blue-600 hover:text-blue-800">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks assigned to this team yet.</p>
                  <Link
                    href={route("task.create", { team_id: team.id })}
                    className="mt-2 inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700"
                  >
                    Create First Task
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
