"use client"

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, router } from "@inertiajs/react"
import { useState } from "react"
import PrimaryButton from "@/Components/PrimaryButton"
import DangerButton from "@/Components/DangerButton"
import SecondaryButton from "@/Components/SecondaryButton"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { CheckCircle, Clock, XCircle, Mail, Calendar, User } from "lucide-react"

export default function Index({ auth, project, invitations }) {
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedInvitations = [...invitations].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "created_at" || sortField === "expires_at") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusBadge = (status) => {
    const badges = {
      pending: { icon: Clock, color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      accepted: { icon: CheckCircle, color: "bg-green-100 text-green-800", text: "Accepted" },
      declined: { icon: XCircle, color: "bg-red-100 text-red-800", text: "Declined" },
      expired: { icon: XCircle, color: "bg-gray-100 text-gray-800", text: "Expired" },
    }

    const badge = badges[status] || badges.pending
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.text}
      </span>
    )
  }

  const handleCancel = (invitationId) => {
    if (confirm("Are you sure you want to cancel this invitation?")) {
      router.delete(route("project.invitations.destroy", [project.id, invitationId]))
    }
  }

  const handleAcceptInvitation = (token) => {
    if (confirm("This will automatically add the invited user to the project. Continue?")) {
      router.post(route("invitations.accept", token))
    }
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              Project Invitations
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage invitations for "{project.name}"</p>
          </div>
          <Link href={route("project.invitations.create", project.id)}>
            <PrimaryButton>Invite User</PrimaryButton>
          </Link>
        </div>
      }
    >
      <Head title={`Invitations - ${project.name}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {invitations.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No invitations</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by inviting users to your project.
                  </p>
                  <div className="mt-6">
                    <Link href={route("project.invitations.create", project.id)}>
                      <PrimaryButton>Invite User</PrimaryButton>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Email</span>
                            {sortField === "email" &&
                              (sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {sortField === "status" &&
                              (sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Invited By
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Sent At</span>
                            {sortField === "created_at" &&
                              (sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("expires_at")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Expires At</span>
                            {sortField === "expires_at" &&
                              (sortDirection === "asc" ? (
                                <ChevronUpIcon className="w-4 h-4" />
                              ) : (
                                <ChevronDownIcon className="w-4 h-4" />
                              ))}
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sortedInvitations.map((invitation) => (
                        <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {invitation.email}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invitation.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {invitation.invited_by?.name || "Unknown"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(invitation.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(invitation.expires_at).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {invitation.status === "pending" && (
                                <>
                                  <SecondaryButton
                                    onClick={() => handleAcceptInvitation(invitation.token)}
                                    className="text-xs"
                                  >
                                    Accept
                                  </SecondaryButton>
                                  <DangerButton onClick={() => handleCancel(invitation.id)} className="text-xs">
                                    Cancel
                                  </DangerButton>
                                </>
                              )}
                              {invitation.status !== "pending" && (
                                <span className="text-gray-400 text-xs">No actions available</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
