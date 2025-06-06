import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";


function TableHeading({
  name,
  sortable = true,
  sort_field = null,
  sort_direction = null,
  sortChanged = () => {},
  children,
}) {
  return (
    <th
      onClick={() => sortable && sortChanged(name)}
      className="px-3 py-2 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-1">
        {children}
        {sortable && (
          <div>
            <ChevronUpIcon
              className={`w-4 ${
                sort_field === name && sort_direction === "asc"
                  ? "text-white"
                  : ""
              }`}
            />
            <ChevronDownIcon
              className={`w-4 -mt-2 ${
                sort_field === name && sort_direction === "desc"
                  ? "text-white"
                  : ""
              }`}
            />
          </div>
        )}
      </div>
    </th>
  );
}

export default TableHeading;
