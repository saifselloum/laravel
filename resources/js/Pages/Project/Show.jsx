import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/Constant";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import TasksTable from "../Task/TasksTable";

function Show({ auth, project,tasks,queryParams  }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          {`Project " ${project.name}"`}
        </h2>
      }
    >
      <Head title={`Project " ${project.name}"`} />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div>
                <img
                  src={project.image_path}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-1 mt-2 ">
                <div>
                  <div>
                    <label className="font-bold text-lg"> Project ID</label>
                    <p>{project.id} </p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg"> Project Name</label>
                    <p>{project.name} </p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg"> Project Created By</label>
                    <p>{project.createdBy.name} </p>
                  </div>
                  <div>
                    <label className="font-bold text-lg"> Project Status</label>
                    <p className="mt-1">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          PROJECT_STATUS_CLASS_MAP[project.status]
                        }`}
                      >
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg"> Due Date</label>
                    <p>{project.due_date} </p>
                  </div>
                  <div className="mt-1">
                    <label className="font-bold text-lg"> Create Date</label>
                    <p>{project.created_at} </p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg"> Updated By</label>
                    <p>{project.updatedBy.name} </p>
                  </div>
                  
                </div>
              </div>
              <div className="mt-4">
                    <label className="font-bold text-lg"> Project Description</label>
                    <p>{project.description} </p>
                  </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid-cols-2 gap-1 mt-2 ">
                        <TasksTable tasks={tasks} queryParams={queryParams} hideProjectColumn={true}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </AuthenticatedLayout>
  );
}

export default Show;
