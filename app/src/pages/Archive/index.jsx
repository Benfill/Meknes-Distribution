import React, { useEffect, useState } from "react";
import GET from "../../utils/GET";
import POST from "../../utils/POST";
import Spinner from "../../components/Other/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import DELETE from "../../utils/DELETE";

let icons = {
  file: (
    <svg
      fill="currentColor"
      className="text-yellow-400 w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        className="cursor-pointer"
        d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z"
      />
    </svg>
  ),
  client: (
    <svg
      fill="currentColor"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 477.297 477.297"
    >
      <path d="M42.85 358.075V27.158c23.9 0 278.867 0 302.767 0v99.722c5.846-1.079 11.842-1.812 17.99-1.812 3.149 0 6.126.647 9.232.928V0H15.649v385.233h224.638v-27.158H42.85z" />
      <path d="M81.527 206.842h184.495a74.235 74.235 0 0 1 10.095-28.452H81.527v28.452zM81.527 89.432h225.372v28.452H81.527zM81.527 295.822h191.268a73.862 73.862 0 0 1 16.415-7.183 74.323 74.323 0 0 1-13.978-21.269H81.527v28.452z" />
      <path d="M363.629 298.669c41.071 0 74.16-33.197 74.16-74.139 0-40.984-33.09-74.16-74.16-74.16-40.898 0-74.009 33.176-74.009 74.16 0 40.942 33.111 74.139 74.009 74.139zM423.143 310.706H304.288c-21.226 0-38.612 19.457-38.612 43.422v119.33c0 1.316.604 2.481.69 3.84h194.59c.086-1.337.69-2.524.69-3.84v-119.33c.087-23.965-17.256-43.486-38.503-43.486z" />
    </svg>
  ),
  user: (
    <svg
      fill="none"
      stroke="currentColor"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="6" r="4" strokeWidth="1.5" />
      <path
        d="M19.9975 18C20 17.8358 20 17.669 20 17.5C20 15.0147 16.4183 13 12 13C7.58172 13 4 15.0147 4 17.5C4 19.9853 4 22 12 22C14.231 22 15.8398 21.8433 17 21.5634"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  product: (
    <svg
      fill="currentColor"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <path d="M5.969 5C4.336 5 3 6.367 3 8v16.406a15.95 15.95 0 0 0-1.156.875c-.45.38-.504 1.051-.125 1.5.379.45 1.05.504 1.5.125 2.457-2.066 5.601-3.312 9.062-3.312 7.809 0 14.125 6.32 14.125 14.125-.039.398.152.785.492.996.34.215.77.215 1.11 0 .34-.21.531-.598.492-.996 0-.242-.02-.48-.031-.719h4.312A10.975 10.975 0 0 0 31 42c0 4.406 3.594 8 8 8s8-3.594 8-8c0-2.133-.852-4.062-2.219-5.5.2-.11.375-.242.563-.375a4.308 4.308 0 0 0 1.625-2l2.906-7.937c.336-.914-.078-1.922-.688-2.438-.609-.515-1.351-.75-2.124-.75h-6.938V17c0-1.906.43-2.594.656-2.813.114-.109.207-.113.25-.125.29.012.566-.097.773-.296.207-.2.325-.477.32-.766V11a1.04 1.04 0 0 0-.308-.754A.969.969 0 0 0 41 9.938c-1.289 0-2.992.234-4.469 1.25-1.476 1.015-2.593 2.87-2.593 5.624V23h-5.157l-4.125-15.219c-.004-.023-.027-.039-.031-.062a3.286 3.286 0 0 0-.875-1.782C23.27 5.403 22.512 5 21.688 5H5.969zm0 2h15.719c.261 0 .421.059.593.25.172.191.32.54.407.938.007.02.019.042.03.062L27.063 24.25c.113.441.511.75.969.75h6.593c.23.082.489.082.719 0h3.281c.23.082.489.082.719 0h7.719c.316 0 .691.152.843.281.153.13.13.04.063.22l-2.875 7.937c-.094.254-.485.734-.938 1.063-.453.328-.988.5-1.187.5H28.25c-1.301-7.649-7.953-13.5-15.969-13.5-2.617 0-5.086.621-7.281 1.719V8c0-.563.43-1 .969-1zM7.812 9a.97.97 0 0 0-.718.281A.988.988 0 0 0 7 10v9c0 .55.45 1 1 1h14.906a1.02 1.02 0 0 0 .79-.387c.19-.246.257-.562.179-.863L21.437 9.75A1.005 1.005 0 0 0 20.47 9H8c-.031 0-.063 0-.094 0-.031 0-.062 0-.094 0zM9 11h10.719l1.906 7H9v-7zm30.938 1.188v.124c-.223.114-.434.16-.657.376-.773.742-1.343 2.07-1.343 4.312V23h-1.876v-6.188c0-2.238.715-3.257 1.657-3.906.644-.445 1.437-.613 2.219-.718zM12 26C5.387 26 0 31.387 0 38s5.387 12 12 12 12-5.387 12-12-5.387-12-12-12zm0 2c5.531 0 10 4.469 10 10 0 5.531-4.469 10-10 10-.344 0-.695-.027-1.031-.062-.336-.036-.676-.059-1-.125C5.406 46.883 2 42.84 2 38c0-.348.027-.695.062-1.031C2.574 31.918 6.816 28 12 28zm-.094 4.5c-.031.008-.062.02-.094.031-.062.004-.125.016-.187.032-.012.011-.02.02-.032.03-2.824.223-5.093 2.528-5.093 5.407C6.5 41.023 8.977 43.5 12 43.5S17.5 41.023 17.5 38c0-2.856-2.234-5.152-5.031-5.406-.035-.004-.059-.028-.094-.032-.102-.039-.207-.058-.312-.062-.02 0-.043 0-.063 0-.03 0-.062 0-.094 0zm.032 2c.019 0 .042 0 .062 0 1.941 0 3.5 1.562 3.5 3.5 0 1.938-1.562 3.5-3.5 3.5A3.495 3.495 0 0 1 8.5 38c0-1.918 1.527-3.465 3.438-3.5zm23.687 2.5h3.281c-.031.008-.062.02-.094.031-.062.004-.125.016-.187.032-.012.011-.02.02-.032.03-2.55.22-4.593 2.305-4.593 4.907 0 2.746 2.254 5 5 5s5-2.254 5-5c0-2.582-2.012-4.656-4.532-4.906-.035-.004-.059-.028-.094-.032-.059-.028-.125-.047-.187-.063h3.187c.04.047.078.086.125.125C41.02 38.215 42 39.984 42 42c0 3.32-2.68 6-6 6s-6-2.68-6-6c0-1.93.899-3.652 2.313-4.75.12-.062.226-.144.312-.25zM39 39c1.66 0 3 1.336 3 3s-1.34 3-3 3-3-1.34-3-3 1.336-3 3-3z" />
    </svg>
  ),
  supplier: (
    <svg
      fill="currentColor"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 121.52 122.88"
    >
      <path d="M49.91 26.09l53.86-13.45a2.81 2.81 0 0 1 3.46 2.08l13.45 53.86a2.81 2.81 0 0 1-2.08 3.46l-53.85 13.45a2.81 2.81 0 0 1-3.46-2.08L47.83 29.55a2.81 2.81 0 0 1 2.08-3.46zM54.59 90.54a16.17 16.17 0 1 1 0 32.34 16.17 16.17 0 0 1 0-32.34zM74 92.69l41.87-11.22 2.51-.67.67 2.51 1.8 6.72.67 2.51-2.51.67-41.87 11.22-2.51.67-.67-2.51-1.8-6.72-.67-2.51 2.51-.67zM4.21.04l8.34 1.45c9.58 1.67 14.41 2.63 17.54 5.12 3.37 2.68 4.13 6.28 5.59 13.26.27 1.27.56 2.69.96 4.4.36 1.58.82 3.43 1.42 5.64l14.87 54.67a2.48 2.48 0 0 1-1.83 3.19l-.12.03-6.61 1.79a2.48 2.48 0 0 1-3.18-1.83l-6.76-24.85-8.11-29.82c-.56-2.08-1.05-4.08-1.47-5.94l-.02-.12c-.41-1.8-.73-3.33-1.02-4.7-.73-3.47-1.1-5.27-2.23-6.08-1.47-1.07-4.67-1.67-11.06-2.79l-3.23-.56-5.11-.89a2.48 2.48 0 0 1-2.12-3l1.17-6.86A2.48 2.48 0 0 1 4.21.04z" />
    </svg>
  ),
};

export const Archive = () => {
  const [archivedData, setArchivedData] = useState({
    products: [],
    suppliers: [],
    users: [],
    clients: [],
    clientFiles: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  async function getArchived() {
    try {
      let d = await GET("archives", true);
      setLoading(false);
      setArchivedData({
        products: Array.isArray(d.products) ? d.products : [],
        suppliers: Array.isArray(d.suppliers) ? d.suppliers : [],
        users: Array.isArray(d.users) ? d.users : [],
        clients: Array.isArray(d.clients) ? d.clients : [],
        clientFiles: Array.isArray(d.clientFiles) ? d.clientFiles : [],
      });
    } catch (error) {
      console.error("Error fetching archived data:", error);
      toast.error("Failed to fetch archived data");
      setLoading(false);
    }
  }

  useEffect(() => {
    getArchived();
  }, [loading]);

  const handleDelete = async (item, category) => {
    setLoading(true);
    try {
      let r = await DELETE(category, item.id);
      setLoading(false);
      sessionStorage.removeItem("archives");
      console.log(
        `Permanently deleting ${item.name || item.file_name} from ${category}`
      );
      toast.success(`${item.name || item.file_name} permanently deleted`);
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  const handleRestore = async (item, category) => {
    console.log("test");
    setLoading(true);
    try {
      const r = await POST("archives", {
        id: item.id,
        category,
      });
      sessionStorage.removeItem("archives");
      setLoading(false);
      console.log(`Restoring ${item.name || item.file_name} from ${category}`);
      toast.success(`${item.name || item.file_name} restored`);
    } catch (e) {
      setLoading(false);
      toast.error(e);
    }
  };

  const renderItems = () => {
    let items = [];
    Object.entries(archivedData).forEach(([category, data]) => {
      if ((filter === "all" || filter === category) && Array.isArray(data)) {
        items = [...items, ...data.map((item) => ({ ...item, category }))];
      }
    });

    const DotsVerticalIcon = () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    );

    return items.map((item, index) => (
      <div
        key={index}
        className="p-3 hover:opacity-80 border border-black hover:shadow-lg transition-all rounded-lg relative"
      >
        <Menu as="div" className="absolute top-2 right-2">
          <Menu.Button className="flex items-center text-gray-400 hover:text-gray-600">
            <DotsVerticalIcon />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleRestore(item, item.category)}
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      Restore
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleDelete(item, item.category)}
                      className={`${
                        active ? "bg-red-500 text-white" : "text-gray-900"
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    >
                      Permanently Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
        <div className="flex justify-end">
          {icons[item.category.slice(0, -1)] || icons.file}
        </div>
        <div className="w-full text-center">
          <p>{item.name || item.file_name}</p>
          <p className="text-sm text-gray-400">{item.category}</p>
        </div>
      </div>
    ));
  };

  return loading ? (
    <div className="w-full flex justify-center h-screen items-center">
      <Spinner />
    </div>
  ) : (
    <div className="h-screen flex flex-col ml-12">
      <div className="p-4 flex justify-between">
        <Link to="/settings" className="text-gray-600 hover:text-gray-800">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </Link>
        <select
          className="p-2 px-3 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="products">Products</option>
          <option value="suppliers">Suppliers</option>
          <option value="users">Users</option>
          <option value="clients">Clients</option>
          <option value="clientFiles">Client Files</option>
        </select>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {renderItems().length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {renderItems()}
          </div>
        ) : (
          <p className="text-center">
            No data available for the selected filter.
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
