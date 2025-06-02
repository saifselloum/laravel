"use client"

import Pagination from "@/Components/Pagination"
import TextInput from "@/Components/TextInput"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, Link, router } from "@inertiajs/react"
import TableHeading from "@/Components/TableHeading"
import { Users, Plus, Search, Edit, Trash2, UserCheck } from "lucide-react"

export default function Index({ auth, users, queryParams = null, success }) {
  queryParams = queryParams || {}

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }
    router.get(route("user.index"), queryParams)
  }

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return
    searchFieldChanged(name, e.target.value)
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc"
      } else {
        queryParams.sort_direction = "asc"
      }
    } else {
      queryParams.sort_field = name
      queryParams.sort_direction = "asc"
    }
    router.get(route("user.index"), queryParams)
  }

  const deleteUser = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    router.delete(route("user.destroy", user.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Users</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage team members</p>
            </div>
          </div>
          <Link
            href={route("user.create")}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-emerald-700 focus:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Link>
        </div>
      }
    >
      <Head title="Users" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-3 px-4 text-white rounded-lg mb-6 flex items-center shadow-lg">
              <UserCheck className="h-5 w-5 mr-2" />
              {success}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-xs uppercase font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-600">
                    <TableHeading
                      name="id"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                      className="px-6 py-4"
                    >
                      ID
                    </TableHeading>
                    <TableHeading
                      name="name"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                      className="px-6 py-4"
                    >
                      Name
                    </TableHeading>
                    <TableHeading
                      name="email"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                      className="px-6 py-4"
                    >
                      Email
                    </TableHeading>
                    <TableHeading
                      name="created_at"
                      sort_field={queryParams.sort_field}
                      sort_direction={queryParams.sort_direction}
                      sortChanged={sortChanged}
                      className="px-6 py-4"
                    >
                      Created Date
                    </TableHeading>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <TextInput
                          className="w-full pl-10 text-sm border-gray-300 dark:border-gray-600 rounded-lg"
                          defaultValue={queryParams.name}
                          placeholder="Search by name..."
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <TextInput
                          className="w-full pl-10 text-sm border-gray-300 dark:border-gray-600 rounded-lg"
                          defaultValue={queryParams.email}
                          placeholder="Search by email..."
                          onBlur={(e) => searchFieldChanged("email", e.target.value)}
                          onKeyPress={(e) => onKeyPress("email", e)}
                        />
                      </div>
                    </th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.data.map((user, index) => (
                    <tr
                      className={`${index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-750"} hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}
                      key={user.id}
                    >
                      <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-8 w-8 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.created_at}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={route("user.edit", user.id)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={(e) => deleteUser(user)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No users found</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                            Add your first team member to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-t dark:border-gray-600">
              <Pagination links={users.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
