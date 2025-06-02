"use client"

import Pagination from "@/Components/Pagination"
import SelectInput from "@/Components/SelectInput"
import TextInput from "@/Components/TextInput"
import TableHeading from "@/Components/TableHeading"
import { Link, router } from "@inertiajs/react"
import { TASK_STATUS_TEXT_MAP } from "@/Constant"
import { Edit, Eye, Filter, Search, Trash2 } from "lucide-react"

export default function TasksTable({ tasks, success, queryParams = null, hideProjectColumn = false }) {
  queryParams = queryParams || {}

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }

    router.get(route("task.index"), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return
    searchFieldChanged(name, e.target.value)
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc"
      } else {
        queryParams.sort_direction = "asc"
      }
    } else {
      queryParams.sort_field = name
      queryParams.sort_direction = "asc"
    }
    router.get(route("task.index"), queryParams)
  }

  const deleteTask = (task) => {
    if (!window.confirm("Are you sure you want to delete the task?")) {
      return
    }
    router.delete(route("task.destroy", task.id))
  }

  return (
    <>
      {success && (
        <div className="bg-emerald-500 py-2 px-4 text-white rounded-lg mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Search and Filter Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <TextInput
                className="pl-10 w-full"
                placeholder="Search by task name..."
                defaultValue={queryParams.name}
                onBlur={(e) => searchFieldChanged("name", e.target.value)}
                onKeyPress={(e) => onKeyPress("name", e)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <SelectInput
                className="pl-10 w-full"
                defaultValue={queryParams.status}
                onChange={(e) => searchFieldChanged("status", e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </SelectInput>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-xs uppercase font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                <TableHeading
                  name="id"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                  className="px-4 py-3"
                >
                  ID
                </TableHeading>
                <th className="px-4 py-3">Image</th>
                {!hideProjectColumn && <th className="px-4 py-3">Project</th>}
                <TableHeading
                  name="name"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                  className="px-4 py-3"
                >
                  Name
                </TableHeading>
                <TableHeading
                  name="status"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                  className="px-4 py-3"
                >
                  Status
                </TableHeading>
                <TableHeading
                  name="created_at"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                  className="px-4 py-3"
                >
                  Created
                </TableHeading>
                <TableHeading
                  name="due_date"
                  sort_field={queryParams.sort_field}
                  sort_direction={queryParams.sort_direction}
                  sortChanged={sortChanged}
                  className="px-4 py-3"
                >
                  Due Date
                </TableHeading>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={hideProjectColumn ? 8 : 9}
                    className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <svg
                        className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      <p className="text-lg font-medium">No tasks found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Try adjusting your search or filter to find what you're looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.data.map((task) => (
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" key={task.id}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">#{task.id}</td>
                    <td className="px-4 py-3">
                      {task.image_path ? (
                        <img
                          src={task.image_path || "/placeholder.svg"}
                          alt={task.name}
                          className="h-10 w-10 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                    </td>
                    {!hideProjectColumn && (
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        <Link
                          href={route("project.show", task.project.id)}
                          className="hover:text-blue-600 dark:hover:text-blue-500"
                        >
                          {task.project.name}
                        </Link>
                      </td>
                    )}
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={route("task.show", task.id)}
                        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500"
                      >
                        {task.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                            : task.status === "in_progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                        }`}
                      >
                        {TASK_STATUS_TEXT_MAP[task.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.created_at}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.due_date}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{task.createdBy.name}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={route("task.show", task.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={route("task.edit", task.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => deleteTask(task)}
                          className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <Pagination links={tasks.meta.links} />
        </div>
      </div>
    </>
  )
}
