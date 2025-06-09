import { Head, Link } from "@inertiajs/react"
import { Clock, Home } from "lucide-react"

export default function Expired({ invitation }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title="Invitation Expired" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Invitation Expired</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This invitation has expired and is no longer valid.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The invitation to join <strong>{invitation.project?.name}</strong> expired on{" "}
              <strong>{new Date(invitation.expires_at).toLocaleDateString()}</strong>.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Please contact the project owner to request a new invitation.
            </p>

            <Link
              href={route("dashboard")}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
