import { TASK_PRIORITY_TEXT_MAP, TASK_STATUS_TEXT_MAP } from "@/Constant"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import { ArrowLeft, Calendar, Clock, FileText, Layers, Pencil, User } from "lucide-react"

export default function Show({ auth, task }) {
  // Helper function to determine badge styling based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  // Helper function to determine badge styling based on priority
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center">
            <Link
              href={route("task.index")}
              className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Tasks</span>
            </Link>
            Task Details
          </h2>
          <Link
            href={route("task.edit", task.id)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit Task
          </Link>
        </div>
      }
    >
      <Head title={`Task: ${task.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {/* Task Header with Image */}
            {task.image_path && (
              <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
                <img
                  src={task.image_path || "/placeholder.svg"}
                  alt={task.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{task.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}
                    >
                      {TASK_STATUS_TEXT_MAP[task.status]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}
                    >
                      {TASK_PRIORITY_TEXT_MAP[task.priority]} Priority
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Task Content */}
            <div className="p-6">
              {!task.image_path && (
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{task.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}
                    >
                      {TASK_STATUS_TEXT_MAP[task.status]}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}
                    >
                      {TASK_PRIORITY_TEXT_MAP[task.priority]} Priority
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      Description
                    </h2>
                    <div className="prose dark:prose-invert max-w-none">
                      {task.description ? (
                        <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No description provided</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Details</h2>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Layers className="h-4 w-4 mr-2" />
                          Project
                        </div>
                        <div className="mt-1 text-gray-900 dark:text-white font-medium">
                          <Link
                            href={route("project.show", task.project.id)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400"
                          >
                            {task.project.name}
                          </Link>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          Due Date
                        </div>
                        <div className="mt-1 text-gray-900 dark:text-white font-medium">
                          {task.due_date || "Not specified"}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="h-4 w-4 mr-2" />
                          Assigned To
                        </div>
                        <div className="mt-1 text-gray-900 dark:text-white font-medium">
                          {task.assignedUser ? task.assignedUser.name : "Unassigned"}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-2" />
                          Created
                        </div>
                        <div className="mt-1 text-gray-900 dark:text-white font-medium">{task.created_at}</div>
                      </div>

                      <div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="h-4 w-4 mr-2" />
                          Created By
                        </div>
                        <div className="mt-1 text-gray-900 dark:text-white font-medium">{task.createdBy.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
