"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, useForm } from "@inertiajs/react"
import { UserPlus, ArrowLeft, Mail, Lock, User } from "lucide-react"

export default function Create({ auth }) {
  const { data, setData, post, errors, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })

  const onSubmit = (e) => {
    e.preventDefault()
    post(route("user.store"))
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
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New User</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add a new team member</p>
            </div>
          </div>
        </div>
      }
    >
      <Head title="Create User" />

      <div className="py-8">
        <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fill in the details for the new user</p>
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
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Enter email address"
                />
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Password Field */}
              <div>
                <InputLabel
                  htmlFor="user_password"
                  value="Password"
                  className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                >
                  <Lock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Password
                </InputLabel>
                <TextInput
                  id="user_password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter password"
                />
                <InputError message={errors.password} className="mt-2" />
              </div>

              {/* Confirm Password Field */}
              <div>
                <InputLabel
                  htmlFor="user_password_confirmation"
                  value="Confirm Password"
                  className="flex items-center text-gray-700 dark:text-gray-300 font-medium"
                >
                  <Lock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  Confirm Password
                </InputLabel>
                <TextInput
                  id="user_password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  className="mt-2 block w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  placeholder="Confirm password"
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
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
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
