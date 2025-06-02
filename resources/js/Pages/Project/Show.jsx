import { PROJECT_STATUS_TEXT_MAP } from "@/Constant"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link } from "@inertiajs/react"
import TasksTable from "../Task/TasksTable"
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, FileText, User, Users } from "lucide-react"

function Show({ auth, project, tasks, queryParams }) {
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


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
            <Link
              href={route("project.index")}
              className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            Project Details
          </h2>
          <Link
            href={route("project.edit", project.id)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Project
          </Link>
        </div>
      }
    >
      <Head title={`Project: ${project.name}`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Project Details Card */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg mb-6">
            {/* Project Header with Image */}
            <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 h-48">
              {project.image_path && (
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={project.image_path || "/placeholder.svg"}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-6 flex items-end">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-4 shadow-md">
                  {project.image_path ? (
                    <img
                      src={project.image_path || "/placeholder.svg"}
                      alt={project.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                  <div className="flex items-center mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}
                    >
                      {PROJECT_STATUS_TEXT_MAP[project.status]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Description
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {project.description || "No description provided."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Created By
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.createdBy.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Updated By
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.updatedBy.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Due Date
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.due_date}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Created Date
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{project.created_at}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Project ID
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-white">#{project.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Tasks */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Project Tasks
              </h2>
              <TasksTable tasks={tasks} queryParams={queryParams} hideProjectColumn={true} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Show
