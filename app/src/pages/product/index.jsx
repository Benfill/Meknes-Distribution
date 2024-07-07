import { useEffect, useState } from "react";
import Table from "../../components/Other/Table";
import Spinner from "../../components/Other/Spinner";
import GET from "../../utils/GET";
import { validateProduct } from "../../utils/validationFunctions";
import { Link } from "react-router-dom";

const columns = [
  {
    accessorKey: "id",
    header: "Id",
    enableEditing: false,
  },
  {
    accessorKey: "designation",
    header: "Designation",
  },
  {
    accessorKey: "supplier_id",
    header: "Fournisseur",
  },
  {
    accessorKey: "sub_category_id",
    header: "Group",
  },
  {
    accessorKey: "marge_brut",
    header: "Marge Brut",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "prix_achat",
    header: "Prix Achat",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "prix_tarif",
    header: "Prix Tarif",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "prix_vente",
    header: "Prix Vente",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "prix_vente_net",
    header: "Prix Vente Net",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "remise",
    header: "Remise",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "TVA",
    header: "TVA",
    DataTypeNeeded: "float",
  },
  {
    accessorKey: "reference",
    header: "Reference",
  },
  {
    accessorKey: "image",
    header: "Image",
    DataTypeNeeded: "image",
    Cell: ({ cell }) =>
      cell.value ? (
        <img
          src={cell.value}
          alt="Product"
          style={{ width: "50px", height: "50px" }}
        />
      ) : (
        "No Image"
      ),
  },
  {
    accessorKey: 'view-more',
    header: "View More",
    Cell: ({ row }) => (
      <Link
        to={`/products/${row.original.id}`}
      >
        View More
      </Link>
    ),
  }
];


export const Product = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const d = await GET("products");
    setData(d.products);
    setLoading(false);
  };

  const getSuppliers = async () => {
    const r = await GET('suppliers');
    if (r.message === 'success') {
      setSuppliers(r.suppliers);
    }
  };

  useEffect(() => {
    fetchData();
    getSuppliers();
  }, []);


  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-auto ml-12 px-2 mt-10">
      <h1 className="py-10 text-center">Products Table</h1>

      {data ? (
        <Table
          updatedData={(updatedData) => setData(updatedData.products)}
          data={data}
          columns={columns}
          entityType="Product"
          validateEntity={validateProduct}
          suppliers={suppliers}
        />
      ) : (
        <p>No records.</p>
      )}
    </div>
  );
};
