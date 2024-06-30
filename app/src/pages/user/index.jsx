import { useEffect, useState } from "react";
import Spinner from "../../components/Other/Spinner";
import GET from "../../utils/GET";
import Table from "../../components/Other/Table";
import { validateUser } from "../../utils/validationFunctions";
import { ToastContainer } from "react-toastify";

const columns = [
  { accessorKey: "id", header: "Id", enableEditing: false },
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "roleName", header: "Role" },
  { accessorKey: "password", header: "Password", hideInTable: true },
];

export const User = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let receive = async () => {
      setLoading(true);
      const d = await GET("users");
      const processedData = d.users.map((user) => ({
        ...user,
        roleName:
          user.roles && user.roles.length > 0 ? user.roles[0].name : "No Role",
      }));
      setData(processedData);
      setLoading(false);
    };
    receive();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-auto ml-12 px-2">
      {data ? (
        <>
          <ToastContainer className="mt-10" />
          <Table
            data={data}
            columns={columns}
            entityType="User"
            validateEntity={validateUser}
          />
        </>
      ) : (
        <p>No Data.</p>
      )}
    </div>
  );
};
