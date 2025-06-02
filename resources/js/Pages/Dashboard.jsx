import { TASK_STATUS_TEXT_MAP } from "@/Constant"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, usePage } from "@inertiajs/react"
import { CalendarDays, CheckCircle, Clock, ListTodo, PieChart, TrendingUp, Users, FolderOpen, Plus } from "lucide-react"

export default function Dashboard({
  auth,
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
  activeTasks,
}) {

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {auth.user.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={route("task.create")}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Link>
          </div>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Pending Tasks Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-amber-100 dark:border-amber-900/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">
                        Pending Tasks
                      </p>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{myPendingTasks}</h3>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/ {totalPendingTasks} total</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${totalPendingTasks > 0 ? (myPendingTasks / totalPendingTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {totalPendingTasks > 0 ? Math.round((myPendingTasks / totalPendingTasks) * 100) : 0}% of total
                    pending
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress Tasks Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-blue-100 dark:border-blue-900/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold uppercase tracking-wider">
                        In Progress
                      </p>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{myProgressTasks}</h3>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/ {totalProgressTasks} total</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${totalProgressTasks > 0 ? (myProgressTasks / totalProgressTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {totalProgressTasks > 0 ? Math.round((myProgressTasks / totalProgressTasks) * 100) : 0}% of total in
                    progress
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Tasks Card */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-green-100 dark:border-green-900/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-green-600 dark:text-green-400 text-sm font-semibold uppercase tracking-wider">
                        Completed
                      </p>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{myCompletedTasks}</h3>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">/ {totalCompletedTasks} total</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${totalCompletedTasks > 0 ? (myCompletedTasks / totalCompletedTasks) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {totalCompletedTasks > 0 ? Math.round((myCompletedTasks / totalCompletedTasks) * 100) : 0}% of total
                    completed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href={route("project.create")}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">New Project</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Create a new project</p>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href={route("user.create")}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">New User</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Add team member</p>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            <Link
              href={route("task.index")}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <ListTodo className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">View All Tasks</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage all tasks</p>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>

          {/* My Active Tasks */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  My Active Tasks
                </h3>
                <Link
                  href={route("task.index")}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Project</th>
                    <th className="px-6 py-4 font-medium">Task</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {activeTasks.data.map((task, index) => (
                    <tr
                      key={task.id}
                      className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"} hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">#{task.id}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={route("project.show", task.project.id)}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {task.project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={route("task.show", task.id)}
                          className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {task.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            task.status === "pending"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : task.status === "in_progress"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {TASK_STATUS_TEXT_MAP[task.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{task.due_date}</td>
                    </tr>
                  ))}

                  {activeTasks.data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ListTodo className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No active tasks found</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Create a new task to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
