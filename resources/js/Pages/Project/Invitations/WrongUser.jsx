import { Head, Link } from "@inertiajs/react"
import { AlertTriangle, Home, LogOut } from "lucide-react"

export default function WrongUser({ invitation, userEmail, invitationEmail }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title="Wrong User Account" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Wrong User Account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This invitation is for a different email address.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Invitation sent to:</strong> {invitationEmail}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>You're logged in as:</strong> {userEmail}
              </p>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To accept this invitation, please log in with the email address that received the invitation.
            </p>

            <div className="space-y-3">
              <Link
                href={route("logout")}
                method="post"
                as="button"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out & Switch Account
              </Link>

              <Link
                href={route("dashboard")}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
