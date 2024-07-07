import Table from "../../components/Other/Table";
import Spinner from "../../components/Other/Spinner";
import GET from "../../utils/GET";
import { useEffect, useState } from "react";
import { validateClient } from "../../utils/validationFunctions";
import { Link } from "react-router-dom";

const columns = [
  { accessorKey: 'id', header: 'Id', enableEditing: false },
  { accessorKey: 'first_name', header: 'Prénom' },
  { accessorKey: 'last_name', header: 'Nom' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Tel' },
  { accessorKey: 'raison_sociale', header: 'Raison Sociale' },
  { accessorKey: 'type', header: 'Type Du Client' },
  { accessorKey: 'CIN_ICE', header: 'CIN/ICE' },
  { accessorKey: 'role', header: 'Role Du Client', selectOptions: ["CEO", "Farm Manager", "Agronomist", "Supply Chain Manager", "Field Technician", "Sales Representative", "Marketing Director", "Research Scientist", "Quality Control Specialist", "HR Manager", "Other"]},
  { accessorKey: 'address_exploitation', header: "Address D'exploitation" },
  { accessorKey: 'address_facturation', header: 'Address De Facturation' },
  {
    accessorKey: 'view-more',
    header: "View More",
    Cell: ({ row }) => (
      <Link
        to={`/clients/${row.original.id}`}
      >
        View More
      </Link>
    ),
  },
];


const Client = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let recieve = async () => {
      setLoading(true);
      const d = await GET("clients");
      setData(d.clients);
      setLoading(false);
    };
    recieve();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-auto ml-12 px-2 mt-4">
      {data ? (
        <Table
          updatedData={(updatedData) => setData(updatedData.clients)}
          data={data}
          columns={columns}
          entityType="Client"
          validateEntity={validateClient}
        />
      ) : (
        <p>No Data.</p>
      )}
    </div>
  );
};
export default Client;
