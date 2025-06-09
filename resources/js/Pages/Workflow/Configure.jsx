"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Settings, Save, ArrowRight, Users, Shield, Eye, Crown, CheckCircle } from "lucide-react"
import { useState } from "react"
import Checkbox from "@/Components/Checkbox"
import InputLabel from "@/Components/InputLabel"
import { router } from "@inertiajs/react"

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

const availableRoles = [
  { value: "contributor", label: "Contributor", icon: CheckCircle },
  { value: "reviewer", label: "Reviewer", icon: Eye },
  { value: "approver", label: "Approver", icon: Shield },
  { value: "manager", label: "Manager", icon: Crown },
]

export default function Configure({ auth, team, states = [], transitions = [] }) {
  const [permissions, setPermissions] = useState(() => {
    const initialPermissions = {}
    transitions.forEach((transition) => {
      const existingPermission = team.workflow_permissions?.find((p) => p.transition_id === transition.id)
      initialPermissions[transition.id] = existingPermission?.allowed_roles || []
    })
    return initialPermissions
  })

  const { data, setData, patch, errors, processing } = useForm({
    permissions: [],
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

  const handleRoleToggle = (transitionId, role) => {
    setPermissions((prev) => {
      const currentRoles = prev[transitionId] || []
      const newRoles = currentRoles.includes(role) ? currentRoles.filter((r) => r !== role) : [...currentRoles, role]

      return {
        ...prev,
        [transitionId]: newRoles,
      }
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const formattedPermissions = Object.entries(permissions)
      .filter(([_, roles]) => roles.length > 0)
      .map(([transitionId, roles]) => ({
        transition_id: Number.parseInt(transitionId),
        allowed_roles: roles,
      }))

    router.patch(route("workflow.update-permissions", team.id), {
      data: { permissions: formattedPermissions },
    })
  }

  const getStateColor = (state) => {
    return state.color || "#6B7280"
  }

  const getRoleIcon = (role) => {
    const IconComponent = roleIcons[role] || CheckCircle
    return <IconComponent className="h-4 w-4" />
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center space-x-3">
          <Link
            href={route("workflow.index")}
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Configure Workflow</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Set permissions for {team.name}</p>
          </div>
        </div>
      }
    >
      <Head title={`Configure Workflow: ${team.name}`} />

      <div className="py-8">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Team Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{team.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{team.members_count || 0} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span>Workflow Configuration</span>
                </div>
              </div>
            </div>

            {/* Role Legend */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Roles</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableRoles.map((role) => {
                  const IconComponent = role.icon
                  return (
                    <div key={role.value} className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleColors[role.value]}`}
                      >
                        <IconComponent className="h-4 w-4 mr-1" />
                        {role.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Workflow Transitions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Permissions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Configure which roles can perform each workflow transition
                </p>
              </div>

              <div className="p-6 space-y-6">
                {transitions.map((transition) => (
                  <div key={transition.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="px-3 py-1 rounded text-white text-sm font-medium"
                            style={{ backgroundColor: getStateColor(transition.from_state) }}
                          >
                            {transition.from_state.name}
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div
                            className="px-3 py-1 rounded text-white text-sm font-medium"
                            style={{ backgroundColor: getStateColor(transition.to_state) }}
                          >
                            {transition.to_state.name}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{transition.name}</h4>
                          {transition.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{transition.description}</p>
                          )}
                        </div>
                      </div>
                      {transition.requires_approval && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-medium rounded">
                          Requires Approval
                        </span>
                      )}
                    </div>

                    <div>
                      <InputLabel value="Allowed Roles" className="mb-3" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableRoles.map((role) => {
                          const IconComponent = role.icon
                          const isChecked = permissions[transition.id]?.includes(role.value) || false

                          return (
                            <label
                              key={role.value}
                              className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                isChecked
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onChange={() => handleRoleToggle(transition.id, role.value)}
                              />
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{role.label}</span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {transitions.length === 0 && (
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No workflow transitions found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Workflow transitions need to be configured in the system first
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {transitions.length > 0 && (
              <div className="flex items-center justify-end space-x-4">
                <Link
                  href={route("workflow.index")}
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
                  Save Permissions
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
