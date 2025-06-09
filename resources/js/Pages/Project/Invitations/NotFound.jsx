import { Head, Link } from "@inertiajs/react"
import { AlertTriangle, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head title="Invitation Not Found" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Invitation Not Found</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            The invitation link you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">This could happen if:</p>
            <ul className="text-left text-sm text-gray-600 dark:text-gray-400 mb-6 space-y-2">
              <li>• The invitation has been cancelled</li>
              <li>• The link is incorrect or incomplete</li>
              <li>• The invitation has already been processed</li>
            </ul>

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
