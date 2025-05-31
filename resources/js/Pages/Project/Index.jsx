import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/Constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Tab } from "@headlessui/react";
import {
  BeakerIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/16/solid";

import { Head, Link, router } from "@inertiajs/react";

function Index({ auth, projects, queryParams = null, success }) {
  queryParams = queryParams || {};
  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }
    router.get(route("project.index", queryParams));
    const onKeyPress = (name, e) => {
      if (e.key === "Enter") {
        searchFieldChanged(name, e.target.value);
      }
    };
  };
  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("project.index", queryParams));
  };
  const deleteProject = (project) => {
    if (confirm("Are you sure you want to delete this project?")) {
      router.delete(route("project.destroy", project.id), {
        onSuccess: () => console.log("Project deleted successfully"),
        onError: (error) => console.error("Error deleting project:", error),
      });
    }
  };
  console.log(projects)
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
          <Link
            href={route("project.create")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 "
          >
            Add new
          </Link>
        </div>
      }
    >
      <Head title="Projects" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {success&&(
              <div className="bg-emerald-500 py-2 px-4 text-white rounded">
                {success}
              </div>
            )}
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                  <thead className="text-xs uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Id
                      </TableHeading>

                      <th className="px-3 py-2">Image</th>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Name
                      </TableHeading>
                      <TableHeading
                        name="status"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Status
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Created Date
                      </TableHeading>
                      <TableHeading
                        name="due_date"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Due Date
                      </TableHeading>
                      <th className="px-3 py-2">Created By</th>
                      <th className="px-3 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <thead className="text-xs uppercase text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200">
                    <tr className="text-nowrap">
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name || ""}
                          placeholder="Project Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-2">
                        <SelectInput
                          className="w-full"
                          defaultValue={queryParams.status || ""}
                          onChange={(e) =>
                            searchFieldChanged("status", e.target.value)
                          }
                        >
                          <option value="">Select Status</option>
                          <option value="pending">Pending</option>
                          <option value="in_progress">In progress</option>
                          <option value="completed">Completed</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2 text-right"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.data.map((project) => (
                      <tr
                        key={project.id}
                        className="bg-white dark:bg-gray-800 border-b border-gray-200"
                      >
                        <td className="px-3 py-2">{project.id}</td>
                        <td className="px-3 py-2">
                          {project.image_path ? (
                            <img
                            src={project.image_path}
                            className="w-10 h-10 object-cover rounded-full"
                          />
                          )
                        :<img src="https://placehold.co/40x40" className="rounded-full"/>}
                        </td>
                        <td className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                          <Link href={route("project.show", project.id)}>
                            {project.name}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded text-white ${
                              PROJECT_STATUS_CLASS_MAP[project.status]
                            }`}
                          >
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                        </td>
                        <td className="px-3 py-2">{project.created_at}</td>
                        <td className="px-3 py-2">{project.due_date}</td>
                        <td className="px-3 py-2">{project.createdBy.name}</td>
                        <td className="px-3 py-2">
                          <Link
                            href={route("project.edit", project.id)}
                            className="front-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                          >
                            Edit
                          </Link>
                          <button
                          onClick={e => deleteProject(project)}
                            className="front-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={projects.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
