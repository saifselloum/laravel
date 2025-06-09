"use client"

import { PROJECT_STATUS_TEXT_MAP } from "@/Constant"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import TasksTable from "../Task/TasksTable"
import Modal from "@/Components/Modal"
import TextInput from "@/Components/TextInput"
import InputLabel from "@/Components/InputLabel"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import SelectInput from "@/Components/SelectInput"
import TextAreaInput from "@/Components/TextAreaInput"
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  User,
  Users,
  Plus,
  X,
  Search,
  UserPlus,
} from "lucide-react"
import { useState, useEffect } from "react"

function Show({ auth, project, tasks, queryParams, projectMembers = [], teams = [], availableUsers = [], isCreator }) {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  // Form for user invitation
  const inviteForm = useForm({
    email: "",
    user_id: null,
  })

  // Form for team creation
  const teamForm = useForm({
    name: "",
    description: "",
    color: "#3B82F6",
    team_leader_id: "",
    member_ids: [],
  })

  // Ensure arrays are properly initialized
  const safeProjectMembers = Array.isArray(projectMembers) ? projectMembers : []
  const safeTeams = Array.isArray(teams) ? teams : []
  const safeAvailableUsers = Array.isArray(availableUsers) ? availableUsers : []

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = safeAvailableUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers([])
    }
  }, [searchQuery, safeAvailableUsers])

  // Handle user selection from search
  const handleUserSelect = (user) => {
    setSelectedUser(user)
    inviteForm.setData({
      email: user.email,
      user_id: user.id,
    })
    setSearchQuery(user.name)
    setFilteredUsers([])
  }

  // Handle manual email input
  const handleEmailChange = (e) => {
    const email = e.target.value
    inviteForm.setData("email", email)
    setSelectedUser(null)
    setSearchQuery("")
  }

  // Submit invitation
  const handleInviteSubmit = (e) => {
    e.preventDefault()
    inviteForm.post(route("project.invitations.store", project.id), {
      onSuccess: () => {
        setShowInviteModal(false)
        inviteForm.reset()
        setSelectedUser(null)
        setSearchQuery("")
      },
    })
  }

  // Submit team creation
  const handleTeamSubmit = (e) => {
    e.preventDefault()
    teamForm.post(route("project.teams.store", project.id), {
      onSuccess: () => {
        setShowTeamModal(false)
        teamForm.reset()
      },
    })
  }

  // Toggle team member selection
  const toggleTeamMember = (userId) => {
    const currentMembers = teamForm.data.member_ids || []
    const isSelected = currentMembers.includes(userId)

    if (isSelected) {
      teamForm.setData(
        "member_ids",
        currentMembers.filter((id) => id !== userId),
      )
    } else {
      teamForm.setData("member_ids", [...currentMembers, userId])
    }
  }

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


  // Get all project participants (creator + members) for team creation
  const allProjectParticipants = [project.createdBy, ...safeProjectMembers].filter(
    (user, index, self) => index === self.findIndex((u) => u.id === user.id),
  )

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
          <div className="flex space-x-2">
            <Link
              href={route("project.edit", project.id)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Link>
          </div>
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

          {/* Project Members Section */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Project Members ({safeProjectMembers.length + 1})
                </h2>
                {isCreator && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowInviteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </button>
                    <Link
                      href={route("project.invitations.index", project.id)}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                      View Invitations
                    </Link>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Project Creator */}
                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {project.createdBy.name.charAt(0)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{project.createdBy.name}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Project Owner</p>
                  </div>
                </div>

                {/* Project Members */}
                {safeProjectMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">Member</p>
                    </div>
                    {isCreator && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this member?")) {
                            // Handle member removal
                          }
                        }}
                        className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teams Section */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <Users className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Teams ({safeTeams.length})
                </h2>
                {isCreator && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </button>
                    <Link
                      href={route("project.teams.index", project.id)}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                      Manage All
                    </Link>
                  </div>
                )}
              </div>

              {safeTeams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {safeTeams.map((team) => (
                    <div
                      key={team.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: team.color }}></div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{team.name}</h3>
                        </div>
                        <Link
                          href={route("project.teams.show", [project.id, team.id])}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Leader: <span className="font-medium">{team.leader?.name || "Not assigned"}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{team.members_count || 0} members</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No teams created yet.</p>
                  {isCreator && (
                    <button
                      onClick={() => setShowTeamModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create First Team
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Project Tasks */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                Project Tasks
              </h2>
              <TasksTable tasks={tasks} queryParams={queryParams} hideProjectColumn={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Invite User Modal */}
      <Modal show={showInviteModal} onClose={() => setShowInviteModal(false)} maxWidth="md">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invite User to Project</h2>

          <form onSubmit={handleInviteSubmit}>
            <div className="mb-4">
              <InputLabel htmlFor="user_search" value="Search Users" />
              <div className="relative">
                <TextInput
                  id="user_search"
                  type="text"
                  className="mt-1 block w-full"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              {/* Search Results */}
              {filteredUsers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleUserSelect(user)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="email" value="Email Address" />
              <TextInput
                id="email"
                type="email"
                className="mt-1 block w-full"
                value={inviteForm.data.email}
                onChange={handleEmailChange}
                placeholder="Enter email address"
                required
              />
              <InputError message={inviteForm.errors.email} className="mt-2" />
            </div>

            {selectedUser && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Selected: <strong>{selectedUser.name}</strong> ({selectedUser.email})
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <SecondaryButton onClick={() => setShowInviteModal(false)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={inviteForm.processing}>
                {inviteForm.processing ? "Sending..." : "Send Invitation"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>

      {/* Create Team Modal */}
      <Modal show={showTeamModal} onClose={() => setShowTeamModal(false)} maxWidth="lg">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Team</h2>

          <form onSubmit={handleTeamSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <InputLabel htmlFor="team_name" value="Team Name" />
                <TextInput
                  id="team_name"
                  type="text"
                  className="mt-1 block w-full"
                  value={teamForm.data.name}
                  onChange={(e) => teamForm.setData("name", e.target.value)}
                  required
                />
                <InputError message={teamForm.errors.name} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="team_color" value="Team Color" />
                <input
                  id="team_color"
                  type="color"
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 dark:border-gray-700"
                  value={teamForm.data.color}
                  onChange={(e) => teamForm.setData("color", e.target.value)}
                />
                <InputError message={teamForm.errors.color} className="mt-2" />
              </div>
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="team_description" value="Description (Optional)" />
              <TextAreaInput
                id="team_description"
                className="mt-1 block w-full"
                value={teamForm.data.description}
                onChange={(e) => teamForm.setData("description", e.target.value)}
                rows={3}
              />
              <InputError message={teamForm.errors.description} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="team_leader" value="Team Leader" />
              <SelectInput
                id="team_leader"
                className="mt-1 block w-full"
                value={teamForm.data.team_leader_id}
                onChange={(e) => teamForm.setData("team_leader_id", e.target.value)}
                required
              >
                <option value="">Select Team Leader</option>
                {allProjectParticipants.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.id === project.created_by ? "(Project Owner)" : ""}
                  </option>
                ))}
              </SelectInput>
              <InputError message={teamForm.errors.team_leader_id} className="mt-2" />
            </div>

            <div className="mb-6">
              <InputLabel value="Team Members (Optional)" />
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {allProjectParticipants.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                      checked={(teamForm.data.member_ids || []).includes(user.id)}
                      onChange={() => toggleTeamMember(user.id)}
                      disabled={user.id.toString() === teamForm.data.team_leader_id}
                    />
                    <div className="ml-3 flex items-center">
                      <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-900 dark:text-white">
                        {user.name}
                        {user.id === project.created_by && " (Owner)"}
                        {user.id.toString() === teamForm.data.team_leader_id && " (Leader)"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <InputError message={teamForm.errors.member_ids} className="mt-2" />
            </div>

            <div className="flex justify-end space-x-2">
              <SecondaryButton onClick={() => setShowTeamModal(false)}>Cancel</SecondaryButton>
              <PrimaryButton type="submit" disabled={teamForm.processing}>
                {teamForm.processing ? "Creating..." : "Create Team"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </Modal>
    </AuthenticatedLayout>
  )
}

export default Show
