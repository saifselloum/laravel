"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import SelectInput from "@/Components/SelectInput"
import TextAreaInput from "@/Components/TextAreaInput"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, ImageIcon, Layers, User } from "lucide-react"

export default function Create({ auth, projects, users }) {
  const { data, setData, post, errors, processing } = useForm({
    image: "",
    name: "",
    status: "",
    description: "",
    due_date: "",
    project_id: "",
    priority: "",
    assigned_user_id: "",
  })

  const onSubmit = (e) => {
    e.preventDefault()
    post(route("task.store"))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center">
            <Link
              href={route("task.index")}
              className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            Create New Task
          </h2>
        </div>
      }
    >
      <Head title="Create Task" />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Task Information</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Fill in the details below to create a new task.
              </p>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Project Selection */}
                  <div>
                    <InputLabel
                      htmlFor="task_project_id"
                      value="Project"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Layers className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project
                    </InputLabel>

                    <SelectInput
                      name="project_id"
                      id="task_project_id"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("project_id", e.target.value)}
                    >
                      <option value="">Select Project</option>
                      {projects.data.map((project) => (
                        <option value={project.id} key={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </SelectInput>

                    <InputError message={errors.project_id} className="mt-2" />
                  </div>

                  {/* Task Name */}
                  <div>
                    <InputLabel
                      htmlFor="task_name"
                      value="Task Name"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Name
                    </InputLabel>

                    <TextInput
                      id="task_name"
                      type="text"
                      name="name"
                      value={data.name}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      isFocused={true}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Enter task name"
                    />

                    <InputError message={errors.name} className="mt-2" />
                  </div>

                  {/* Task Image */}
                  <div>
                    <InputLabel
                      htmlFor="task_image_path"
                      value="Task Image"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <ImageIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Image
                    </InputLabel>

                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="task_image_path"
                          type="file"
                          name="image"
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-50 file:text-gray-700
                            dark:file:bg-gray-700 dark:file:text-gray-200
                            hover:file:bg-gray-100 dark:hover:file:bg-gray-600
                            focus:outline-none"
                          onChange={(e) => setData("image", e.target.files[0])}
                        />
                      </label>
                    </div>

                    <InputError message={errors.image} className="mt-2" />
                  </div>

                  {/* Task Description */}
                  <div>
                    <InputLabel
                      htmlFor="task_description"
                      value="Task Description"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Description
                    </InputLabel>

                    <TextAreaInput
                      id="task_description"
                      name="description"
                      value={data.description}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      rows={4}
                      onChange={(e) => setData("description", e.target.value)}
                      placeholder="Enter task description"
                    />

                    <InputError message={errors.description} className="mt-2" />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Due Date */}
                  <div>
                    <InputLabel
                      htmlFor="task_due_date"
                      value="Due Date"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Due Date
                    </InputLabel>

                    <TextInput
                      id="task_due_date"
                      type="date"
                      name="due_date"
                      value={data.due_date}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("due_date", e.target.value)}
                    />

                    <InputError message={errors.due_date} className="mt-2" />
                  </div>

                  {/* Task Status */}
                  <div>
                    <InputLabel
                      htmlFor="task_status"
                      value="Task Status"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Status
                    </InputLabel>

                    <SelectInput
                      name="status"
                      id="task_status"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("status", e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </SelectInput>

                    <InputError message={errors.status} className="mt-2" />
                  </div>

                  {/* Task Priority */}
                  <div>
                    <InputLabel
                      htmlFor="task_priority"
                      value="Task Priority"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Priority
                    </InputLabel>

                    <SelectInput
                      name="priority"
                      id="task_priority"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("priority", e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </SelectInput>

                    <InputError message={errors.priority} className="mt-2" />
                  </div>

                  {/* Assigned User */}
                  <div>
                    <InputLabel
                      htmlFor="task_assigned_user"
                      value="Assigned User"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Assigned User
                    </InputLabel>

                    <SelectInput
                      name="assigned_user_id"
                      id="task_assigned_user"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("assigned_user_id", e.target.value)}
                    >
                      <option value="">Select User</option>
                      {users.data.map((user) => (
                        <option value={user.id} key={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </SelectInput>

                    <InputError message={errors.assigned_user_id} className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-6 gap-4">
                <Link
                  href={route("task.index")}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-gray-300 dark:focus:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
