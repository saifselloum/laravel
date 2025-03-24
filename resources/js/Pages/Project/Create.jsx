import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    image: "",
    name: "",
    description: "",
    status: "",
    due_date: "",
  });
  const onSubmit = (e) => {
    e.preventDefault();
    post(route("project.store"));


  };
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            Projects
          </h2>
        </div>
      }
    >
       
      <Head title="Projects" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg "
            >
              <div>
                <InputLabel
                  htmlFor="project_image_path"
                  value="Project Image"
                />
                <TextInput
                  id="project_image_path"
                  type="file"
                  value={data.image}
                  className="block w-full mt-1"
                  onChange={(e) => setData("image", e.target.files[0])}
                  />
                <InputError message={errors.image} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_name" value="Project Name" />
                <TextInput
                  name="name"
                  id="project_name"
                  type="text"
                  value={data.name}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel
                  htmlFor="project_description"
                  value="Project description"
                />
                <TextAreaInput
                  id="project_description"
                  type="text"
                  value={data.description}
                  className="block w-full mt-1"
                  isFocused={true}
                  onChange={(e) => setData("description", e.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_due_date" value="Due Date" />
                <TextInput
                  id="project_due_date"
                  type="date"
                  value={data.due_date}
                  className="block w-full mt-1"
                  onChange={(e) => setData("due_date", e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
              </div>
              <div className="mt-4">
                <InputLabel htmlFor="project_status" value="Project Status" />
                <SelectInput
                  name="status"
                  id="project_status"
                  type="text"
                  className="block w-full mt-1"
                  onChange={(e) => setData("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </SelectInput>
                <InputError message={errors.project_status} className="mt-2" />
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={route("project.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2 "
                >
                  cancel
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transiton-all hover:bg-emerald-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Create;
