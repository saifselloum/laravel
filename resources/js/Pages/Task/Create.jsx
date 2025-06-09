"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import SelectInput from "@/Components/SelectInput"
import TextAreaInput from "@/Components/TextAreaInput"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, ImageIcon, Layers, User, Users } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Create({ auth, projects, teams = [], users = [], selectedProjectId, selectedTeamId }) {
  const { data, setData, post, errors, processing } = useForm({
    image: "",
    name: "",
    status: "pending",
    description: "",
    due_date: "",
    project_id: selectedProjectId || "",
    team_id: selectedTeamId || "",
    priority: "medium",
    assigned_user_id: "",
  })

  const [availableTeams, setAvailableTeams] = useState(Array.isArray(teams) ? teams : [])
  const [availableUsers, setAvailableUsers] = useState(Array.isArray(users) ? users : [])
  const [loadingProjectData, setLoadingProjectData] = useState(false)
  const [loadingTeamData, setLoadingTeamData] = useState(false)

  // Debug logging
  useEffect(() => {
    console.log("Task Create Component Mounted", {
      projects: projects,
      initialTeams: teams,
      initialUsers: users,
      selectedProjectId,
      selectedTeamId,
    })
  }, [])

  // Handle project change
  const handleProjectChange = async (projectId) => {
    console.log("Project selection changed:", projectId)

    setData((prev) => ({
      ...prev,
      project_id: projectId,
      team_id: "", // Reset team when project changes
      assigned_user_id: "", // Reset assigned user when project changes
    }))

    if (projectId) {
      setLoadingProjectData(true)
      console.log("Loading project data for project ID:", projectId)

      try {
        const url = route("task.project-data", projectId)
        console.log("Making request to:", url)

        const response = await axios.get(url)
        console.log("Project data response:", response.data)

        setAvailableTeams(response.data.teams || [])
        setAvailableUsers(response.data.users || [])

        console.log("Updated state:", {
          teams: response.data.teams || [],
          users: response.data.users || [],
        })
      } catch (error) {
        console.error("Error loading project data:", error)
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        })

        setAvailableTeams([])
        setAvailableUsers([])
      } finally {
        setLoadingProjectData(false)
      }
    } else {
      console.log("No project selected, clearing teams and users")
      setAvailableTeams([])
      setAvailableUsers([])
    }
  }

  // Handle team change
  const handleTeamChange = async (teamId) => {
    console.log("Team selection changed:", teamId)

    setData((prev) => ({
      ...prev,
      team_id: teamId,
      assigned_user_id: "", // Reset assigned user when team changes
    }))

    if (teamId) {
      setLoadingTeamData(true)
      console.log("Loading team data for team ID:", teamId)

      try {
        const url = route("task.team-data", teamId)
        console.log("Making request to:", url)

        const response = await axios.get(url)
        console.log("Team data response:", response.data)

        setAvailableUsers(response.data.users || [])
      } catch (error) {
        console.error("Error loading team data:", error)
        console.error("Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        })
        // Keep project users if team loading fails
      } finally {
        setLoadingTeamData(false)
      }
    } else if (data.project_id) {
      console.log("No team selected, reloading project users")
      // Reset to project users when no team is selected
      handleProjectChange(data.project_id)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting task form with data:", data)
    post(route("task.store"))
  }

  // Check if user has access to any projects
  const projectsData = Array.isArray(projects?.data) ? projects.data : []
  console.log("Projects data:", projectsData)

  if (projectsData.length === 0) {
    return (
      <AuthenticatedLayout
        user={auth.user}
        header={
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Task</h2>
          </div>
        }
      >
        <Head title="Create Task" />

        <div className="py-12">
          <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6 text-center">
                <div className="mb-4">
                  <Layers className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Project Access</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You need to be a member of at least one project to create tasks. Please ask a project owner to invite
                  you to their project.
                </p>
                <Link
                  href={route("dashboard")}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthenticatedLayout>
    )
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
                      Project *
                    </InputLabel>

                    <SelectInput
                      name="project_id"
                      id="task_project_id"
                      value={data.project_id}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => handleProjectChange(e.target.value)}
                      disabled={loadingProjectData}
                    >
                      <option value="">Select Project</option>
                      {projectsData.map((project) => (
                        <option value={project.id} key={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </SelectInput>

                    {loadingProjectData && (
                      <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Loading project data...</p>
                    )}

                    <InputError message={errors.project_id} className="mt-2" />
                  </div>

                  {/* Team Selection */}
                  {data.project_id && (
                    <div>
                      <InputLabel
                        htmlFor="task_team_id"
                        value="Team (Optional)"
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        Team (Optional)
                      </InputLabel>

                      <SelectInput
                        name="team_id"
                        id="task_team_id"
                        value={data.team_id}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => handleTeamChange(e.target.value)}
                        disabled={loadingProjectData || loadingTeamData}
                      >
                        <option value="">No Team</option>
                        {availableTeams.map((team) => (
                          <option value={team.id} key={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </SelectInput>

                      {loadingTeamData && (
                        <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">Loading team data...</p>
                      )}

                      {availableTeams.length === 0 && data.project_id && !loadingProjectData && (
                        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                          No teams available in this project.
                        </p>
                      )}

                      <InputError message={errors.team_id} className="mt-2" />
                    </div>
                  )}

                  {/* Task Name */}
                  <div>
                    <InputLabel
                      htmlFor="task_name"
                      value="Task Name"
                      className="flex items-center text-gray-700 dark:text-gray-300"
                    >
                      <FileText className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Task Name *
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
                          accept="image/*"
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
                      Task Status *
                    </InputLabel>

                    <SelectInput
                      name="status"
                      id="task_status"
                      value={data.status}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("status", e.target.value)}
                    >
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
                      Task Priority *
                    </InputLabel>

                    <SelectInput
                      name="priority"
                      id="task_priority"
                      value={data.priority}
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      onChange={(e) => setData("priority", e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </SelectInput>

                    <InputError message={errors.priority} className="mt-2" />
                  </div>

                  {/* Assigned User */}
                  {data.project_id && (
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
                        value={data.assigned_user_id}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => setData("assigned_user_id", e.target.value)}
                        disabled={loadingProjectData || loadingTeamData}
                      >
                        <option value="">Unassigned</option>
                        {availableUsers.map((user) => (
                          <option value={user.id} key={user.id}>
                            {user.name} ({user.email})
                          </option>
                        ))}
                      </SelectInput>

                      {availableUsers.length === 0 && data.project_id && !loadingProjectData && (
                        <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                          No members available for assignment. Invite users to this project first.
                        </p>
                      )}

                      <InputError message={errors.assigned_user_id} className="mt-2" />

                      {/* Debug info */}
                      <div className="mt-2 text-xs text-gray-500">
                        Debug: {availableUsers.length} users available
                        {availableUsers.length > 0 && (
                          <div className="mt-1">Users: {availableUsers.map((u) => u.name).join(", ")}</div>
                        )}
                      </div>
                    </div>
                  )}
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
                  disabled={processing || !data.project_id || loadingProjectData}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  {processing ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
