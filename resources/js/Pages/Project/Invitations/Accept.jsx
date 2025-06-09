"use client"

import { Head, useForm } from "@inertiajs/react"
import { Calendar, Clock, Mail, User, Users, CheckCircle, AlertCircle } from "lucide-react"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"

export default function Accept({ invitation, project, invitedBy }) {
  const acceptForm = useForm()
  const declineForm = useForm()

  const handleAccept = () => {
    acceptForm.post(route("invitations.accept", invitation.token), {
      onSuccess: () => {
        // Optionally redirect or show success message
      },
      onError: (errors) => {
        console.error("Acceptance failed:", errors)
      },
    })
  }

  const handleDecline = () => {
    if (confirm("Are you sure you want to decline this invitation?")) {
      declineForm.post(route("invitations.decline", invitation.token))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title={`Invitation to ${project.name}`} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Project Invitation</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Accept this invitation to add the user to the project
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {/* Important Notice */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Auto-Accept Invitation</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Clicking "Accept" will automatically add <strong>{invitation.email}</strong> to this project,
                  regardless of who is currently logged in.
                </p>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">{project.name.charAt(0)}</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">{project.name}</h3>

            {project.description && (
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Invited by</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invitedBy.name}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Invited User</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{invitation.email}</p>
                </div>
              </div>

              {project.due_date && (
                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Due Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{project.due_date}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Expires</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-8">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              By accepting this invitation, the user will be able to:
            </h4>
            <ul className="space-y-2">
              {[
                "View and manage project tasks",
                "Collaborate with team members",
                "Participate in project discussions",
                "Access project resources and files",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <PrimaryButton onClick={handleAccept} disabled={acceptForm.processing} className="flex-1 justify-center">
              {acceptForm.processing ? "Adding User..." : "Accept & Add User"}
            </PrimaryButton>

            <SecondaryButton
              onClick={handleDecline}
              disabled={declineForm.processing}
              className="flex-1 justify-center"
            >
              {declineForm.processing ? "Declining..." : "Decline"}
            </SecondaryButton>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              This will add the invited user to the project automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
