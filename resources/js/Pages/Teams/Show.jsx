"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, router, useForm, usePage } from "@inertiajs/react"
import {
  ArrowLeft,
  Users,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Calendar,
  Crown,
  Shield,
  Eye,
  CheckCircle,
} from "lucide-react"
import { useState } from "react"
import Modal from "@/Components/Modal"
import SelectInput from "@/Components/SelectInput"
import InputLabel from "@/Components/InputLabel"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import DangerButton from "@/Components/DangerButton"

const roleIcons = {
  manager: Crown,
  approver: Shield,
  reviewer: Eye,
  contributor: CheckCircle,
}

const roleColors = {
  manager: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  approver: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  reviewer: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  contributor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export default function Show({ auth, team, availableUsers = [] }) {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState(null)

  const { data, setData, post, errors, processing, reset } = useForm({
    user_id: "",
    role: "contributor",
  })

  const addMemberForm = useForm({
    user_id: "",
    role: "contributor",
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

  const deleteTeam = () => {
    router.delete(route("teams.destroy", team.id))
  }

  const addMember = (e) => {
    e.preventDefault()
    addMemberForm.post(route("teams.add-member", team.id), {
      onSuccess: () => {
        setShowAddMemberModal(false)
        addMemberForm.reset()
      },
    })
  }

  const removeMember = (user) => {
    router.delete(route("teams.remove-member", [team.id, user.id]), {
      onSuccess: () => {
        setMemberToRemove(null)
        setShowDeleteModal(false)
      },
    })
  }

  const updateMemberRole = (user, newRole) => {
    router.patch(route("teams.update-member-role", [team.id, user.id]), {
      role: newRole,
    })
  }

  const getRoleIcon = (role) => {
    const IconComponent = roleIcons[role] || CheckCircle
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={route("teams.index")}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: team.color }}
            >
              {team.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{team.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Team Details & Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={route("workflow.configure", team.id)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-purple-700 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Workflow
            </Link>
            <Link
              href={route("teams.edit", team.id)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Team
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      }
    >
      <Head title={`Team: ${team.name}`} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {/* Team Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {team.description || "No description provided"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              team.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {team.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                        <p className="text-gray-900 dark:text-white mt-1">{team.created_at}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Team Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Members</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{team.members?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Active Tasks</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {team.active_tasks_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Projects</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{team.projects_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h3>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-sm">
                    {team.members?.length || 0}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>
            </div>

            <div className="p-6">
              {team.members && team.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{member.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[member.pivot?.role] || roleColors.contributor}`}
                          >
                            {getRoleIcon(member.pivot?.role || "contributor")}
                            <span className="ml-1 capitalize">{member.pivot?.role || "contributor"}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SelectInput
                            value={member.pivot?.role || "contributor"}
                            onChange={(e) => updateMemberRole(member, e.target.value)}
                            className="text-xs py-1 px-2"
                          >
                            <option value="contributor">Contributor</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="approver">Approver</option>
                            <option value="manager">Manager</option>
                          </SelectInput>
                          <button
                            onClick={() => {
                              setMemberToRemove(member)
                              setShowDeleteModal(true)
                            }}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {member.pivot?.joined_at && (
                        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Joined {member.pivot.joined_at}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No team members</h4>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start building your team by adding members</p>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Member
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal show={showAddMemberModal} onClose={() => setShowAddMemberModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Team Member</h3>
          <form onSubmit={addMember} className="space-y-4">
            <div>
              <InputLabel htmlFor="user_id" value="Select User" />
              <SelectInput
                id="user_id"
                value={addMemberForm.data.user_id}
                onChange={(e) => addMemberForm.setData("user_id", e.target.value)}
                className="mt-1 block w-full"
                required
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </SelectInput>
              <InputError message={addMemberForm.errors.user_id} className="mt-2" />
            </div>

            <div>
              <InputLabel htmlFor="role" value="Role" />
              <SelectInput
                id="role"
                value={addMemberForm.data.role}
                onChange={(e) => addMemberForm.setData("role", e.target.value)}
                className="mt-1 block w-full"
              >
                <option value="contributor">Contributor</option>
                <option value="reviewer">Reviewer</option>
                <option value="approver">Approver</option>
                <option value="manager">Manager</option>
              </SelectInput>
              <InputError message={addMemberForm.errors.role} className="mt-2" />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <SecondaryButton onClick={() => setShowAddMemberModal(false)}>Cancel</SecondaryButton>
              <PrimaryButton disabled={addMemberForm.processing}>Add Member</PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {memberToRemove ? "Remove Team Member" : "Delete Team"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {memberToRemove
              ? `Are you sure you want to remove ${memberToRemove.name} from this team?`
              : `Are you sure you want to delete the team "${team.name}"? This action cannot be undone.`}
          </p>
          <div className="flex items-center justify-end space-x-3">
            <SecondaryButton onClick={() => setShowDeleteModal(false)}>Cancel</SecondaryButton>
            <DangerButton
              onClick={() => {
                if (memberToRemove) {
                  removeMember(memberToRemove)
                } else {
                  deleteTeam()
                }
              }}
            >
              {memberToRemove ? "Remove Member" : "Delete Team"}
            </DangerButton>
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  )
}
