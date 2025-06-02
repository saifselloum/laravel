"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import SelectInput from "@/Components/SelectInput"
import TextAreaInput from "@/Components/TextAreaInput"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, ImageIcon, Save } from "lucide-react"
import { router } from "@inertiajs/react"

function Create({ auth }) {
  const { data, setData, post, errors, processing } = useForm({
    image: "",
    name: "",
    description: "",
    status: "",
    due_date: "",
    priority: "",
  })

  const onSubmit = (e) => {
    e.preventDefault()
    router.post(route("project.store"), data)
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
            Create New Project
          </h2>
        </div>
      }
    >
      <Head title="Create Project" />
      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <InputLabel
                      htmlFor="project_name"
                      value="Project Name"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Name
                    </InputLabel>
                    <TextInput
                      id="project_name"
                      type="text"
                      name="name"
                      value={data.name}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
                      isFocused={true}
                      onChange={(e) => setData("name", e.target.value)}
                      placeholder="Enter project name"
                    />
                    <InputError message={errors.name} className="mt-2" />
                  </div>

                  {/* Project Image */}
                  <div>
                    <InputLabel
                      htmlFor="project_image_path"
                      value="Project Image"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <ImageIcon className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Image
                    </InputLabel>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choose file</span>
                        <input
                          id="project_image_path"
                          type="file"
                          name="image"
                          className="block w-full text-sm text-gray-500 dark:text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-50 file:text-gray-700
                            dark:file:bg-gray-700 dark:file:text-gray-200
                            hover:file:bg-gray-100 dark:hover:file:bg-gray-600"
                          onChange={(e) => setData("image", e.target.files[0])}
                        />
                      </label>
                    </div>
                    <InputError message={errors.image} className="mt-2" />
                  </div>

                  {/* Project Description */}
                  <div>
                    <InputLabel
                      htmlFor="project_description"
                      value="Project Description"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Description
                    </InputLabel>
                    <TextAreaInput
                      id="project_description"
                      name="description"
                      value={data.description}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
                      rows={4}
                      onChange={(e) => setData("description", e.target.value)}
                      placeholder="Enter project description"
                    />
                    <InputError message={errors.description} className="mt-2" />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Due Date */}
                  <div>
                    <InputLabel
                      htmlFor="project_due_date"
                      value="Project Deadline"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Deadline
                    </InputLabel>
                    <TextInput
                      id="project_due_date"
                      type="date"
                      name="due_date"
                      value={data.due_date}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
                      onChange={(e) => setData("due_date", e.target.value)}
                    />
                    <InputError message={errors.due_date} className="mt-2" />
                  </div>

                  {/* Project Priority */}
                  <div>
                    <InputLabel
                      htmlFor="project_priority"
                      value="Project Priority"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Priority
                    </InputLabel>
                    <SelectInput
                      name="priority"
                      id="project_priority"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
                      onChange={(e) => setData("priority", e.target.value)}
                    >
                      <option value="">Select Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </SelectInput>
                    <InputError message={errors.priority} className="mt-2" />
                  </div>

                  {/* Project Status */}
                  <div>
                    <InputLabel
                      htmlFor="project_status"
                      value="Project Status"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Project Status
                    </InputLabel>
                    <SelectInput
                      name="status"
                      id="project_status"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm"
                      onChange={(e) => setData("status", e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </SelectInput>
                    <InputError message={errors.project_status} className="mt-2" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end mt-6 gap-4">
                <Link
                  href={route("project.index")}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-gray-300 dark:focus:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Create
