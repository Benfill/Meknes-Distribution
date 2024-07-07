import { useEffect, useState } from "react";
import Table from "../../components/Other/Table";
import Spinner from "../../components/Other/Spinner";
import GET from "../../utils/GET";

import React from "react";
import { validateSupplier } from "../../utils/validationFunctions";

const columns = [
  {
    accessorKey: "id",
    header: "Id",
    enableEditing: false,
  },
  {
    accessorKey: "name",
    header: "Nom de Fournisseur",
  },
  {
    accessorKey: "remise_f",
    header: "Remise",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "remise_f_composition",
    header: "Remise Composition",
  },
  {
    accessorKey: "date_debut",
    header: "Date de Debut",
    DataTypeNeeded: "date",
  },
  {
    accessorKey: "date_fin",
    header: "Date de Fin",
    DataTypeNeeded: "date",
    nullable: true,
  },
];
const Supplier = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let recieve = async () => {
      setLoading(true);
      const d = await GET("suppliers");
      setData(d.suppliers);
      setLoading(false);
    };
    recieve();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-auto ml-12 px-2 mt-2">
      <h1 className="pb-12 text-center">Suppliers Table</h1>
      {data ? (
        <Table
          updatedData={(updatedData) => setData(updatedData.suppliers)}
          data={data}
          columns={columns}
          entityType="Supplier"
          validateEntity={validateSupplier}
        />
      ) : (
        <div className="text-center">Table is Empty</div>
      )}
    </div>
  );
};

export default Supplier;
