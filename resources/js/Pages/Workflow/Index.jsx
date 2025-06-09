import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, usePage } from "@inertiajs/react"
import { Workflow, Settings, ArrowRight, Users, CheckCircle } from 'lucide-react'

export default function Index({ auth, states, transitions, teams }) {
  const getStateColor = (state) => {
    return state.color || "#6B7280"
  }

  const getTransitionsForState = (stateId) => {
    return transitions.filter((transition) => transition.from_state.id === stateId)
  }


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2 rounded-lg">
              <Workflow className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Workflow Management</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configure team-based workflow permissions</p>
            </div>
          </div>
        </div>
      }
    >
      <Head title="Workflow Management" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {/* Workflow States Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Workflow States
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Current workflow states and their transitions
              </p>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-4">
                {states && states.length > 0 ? (
                  states.map((state, index) => (
                    <div key={state.id} className="flex items-center">
                      <div
                        className="px-4 py-2 rounded-lg text-white font-medium flex items-center space-x-2"
                        style={{ backgroundColor: getStateColor(state) }}
                      >
                        <span>{state.name}</span>
                        {state.is_initial && <span className="text-xs bg-white/20 px-2 py-1 rounded">Initial</span>}
                        {state.is_final && <span className="text-xs bg-white/20 px-2 py-1 rounded">Final</span>}
                      </div>
                      {index < states.length - 1 && <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 dark:text-gray-400">No workflow states defined yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Team Configuration */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Team Workflow Configuration
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Configure workflow permissions for each team
              </p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams && teams.length > 0 ? (
                  teams.map((team) => (
                    <div
                      key={team.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: team.color || "#6B7280" }}
                        >
                          {team.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{team.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{team.members_count || 0} members</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {team.workflow_permissions?.length > 0 ? (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <p>{team.workflow_permissions.length} transitions configured</p>
                          </div>
                        ) : (
                          <div className="text-sm text-amber-600 dark:text-amber-400">
                            <p>No workflow permissions configured</p>
                          </div>
                        )}
                      </div>

                      <Link
                        href={route("workflow.configure", team.id)}
                        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Workflow
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No teams found</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Create teams first to configure workflow permissions
                    </p>
                    <Link
                      href={route("teams.create")}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Create Team
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Workflow Transitions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Transitions</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available state transitions and team permissions
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {transitions && transitions.length > 0 ? (
                  transitions.map((transition) => (
                    <div key={transition.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
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

                      {transition.team_permissions && transition.team_permissions.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Permissions:</h5>
                          <div className="flex flex-wrap gap-2">
                            {transition.team_permissions.map((permission) => (
                              <div
                                key={permission.team_id}
                                className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg"
                              >
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {permission.team_name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  ({permission.allowed_roles.join(", ")})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Workflow className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No workflow transitions found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Workflow transitions need to be configured in the system
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
