import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import TasksTable from "./TasksTable"
import { Plus, Layers } from "lucide-react"

export default function Index({ auth, tasks, queryParams = null, success, hasProjectAccess = true, message }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Tasks</h2>
          {hasProjectAccess && (
            <Link
              href={route("task.create")}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add new
            </Link>
          )}
        </div>
      }
    >
      <Head title="Tasks" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">{success}</div>}

          {!hasProjectAccess ? (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <Layers className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Project Access</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {message || "You need to be a member of at least one project to view tasks."}
                </p>
                <Link
                  href={route("dashboard")}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <TasksTable tasks={tasks} queryParams={queryParams} hideProjectColumn={false} />
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
