import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import getProductData from "./getData";
import Spinner from "../../components/Spinner";

const columns = [
  {
    accessorKey: "id",
    header: "Id",
    size: 100,
  },
  {
    accessorKey: "designation",
    header: "Designation",
    size: 200,
  },
  {
    accessorKey: "supplier.name",
    header: "Fournisseur",
    size: 100,
  },
  {
    accessorKey: "group.name",
    header: "Group",
    size: 200,
  },
  {
    accessorKey: "group.category.name",
    header: "Category",
  },
  {
    accessorKey: "marge_brut",
    header: "Marge Brut",
  },
  {
    accessorKey: "prix_achat",
    header: "Prix Achat",
  },
  {
    accessorKey: "prix_tarif",
    header: "Prix Tarif",
  },
  {
    accessorKey: "prix_vente",
    header: "Prix Vente",
  },
  {
    accessorKey: "prix_vente_net",
    header: "Prix Vente Net",
  },
  {
    accessorKey: "remise",
    header: "Remise",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
];
export const Product = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const waitForIt = async () => {
      setLoading(true);
      setData(await getProductData());
      setLoading(false);
      console.log(data);
    };

    waitForIt();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="ml-12 p-4">
      <h1 className="pb-12 text-center">Products Table</h1>
      {data ? (
        <DataTable data={data} columns={columns} />
      ) : (
        <div className="text-center">Table is Empty</div>
      )}
    </div>
  );
};
