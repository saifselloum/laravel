"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { UserCog, ArrowLeft, Mail, Lock, User, Save } from "lucide-react"

export default function Edit({ auth, user }) {
  const { data, setData, post, errors, processing } = useForm({
    name: user.name || "",
    email: user.email || "",
    password: "",
    password_confirmation: "",
    _method: "PUT",
  })

  const onSubmit = (e) => {
    e.preventDefault()
    post(route("user.update", user.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href={route("user.index")}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <UserCog className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit User</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update {user.name}'s information</p>
            </div>
          </div>
        </div>
      }
    >
      <Head title={`Edit User: ${user.name}`} />

      <div className="py-8">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-10 w-10 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-medium">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update user details and permissions</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-6">
              {/* Name Field */}
              <div>
                <InputLabel
                  htmlFor="user_name"
                  value="Full Name"
                  className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                >
                  <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Full Name
                </InputLabel>
                <TextInput
                  id="user_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter full name"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Email Field */}
              <div>
                <InputLabel
                  htmlFor="user_email"
                  value="Email Address"
                  className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                >
                  <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Email Address
                </InputLabel>
                <TextInput
                  id="user_email"
                  type="email"
                  name="email"
                  value={data.email}
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Enter email address"
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password Section */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Change Password (Optional)</h4>
                <div className="space-y-4">
                  {/* Password Field */}
                  <div>
                    <InputLabel
                      htmlFor="user_password"
                      value="New Password"
                      className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Lock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      New Password
                    </InputLabel>
                    <TextInput
                      id="user_password"
                      type="password"
                      name="password"
                      value={data.password}
                      className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setData("password", e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <InputLabel
                      htmlFor="user_password_confirmation"
                      value="Confirm New Password"
                      className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                    >
                      <Lock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                      Confirm New Password
                    </InputLabel>
                    <TextInput
                      id="user_password_confirmation"
                      type="password"
                      name="password_confirmation"
                      value={data.password_confirmation}
                      className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      onChange={(e) => setData("password_confirmation", e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={route("user.index")}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-lg font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-gray-300 dark:focus:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
