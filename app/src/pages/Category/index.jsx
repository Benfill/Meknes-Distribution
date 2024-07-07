import { useEffect, useState } from "react";
import Table from "../../components/Other/Table";
import Spinner from "../../components/Other/Spinner";
import GET from "../../utils/GET";
import { validateCategory } from "../../utils/validationFunctions";

const columns = [
  {
    accessorKey: "id",
    header: "Id",
    enableEditing: false,
  },
  {
    accessorKey: "name",
    header: "Category Name",
  }
];

function Category() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let recieve = async () => {
      setLoading(true);
      const d = await GET("categories");
      const processedData = d.categories.map((category) => ({
        ...category,
        groups:
          category.groups?.slice(0, 3)
            .map((group) => group.name)
            .join(", ") + "...",
      }));
      
      setData(processedData);
      setLoading(false);
    };
    recieve();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <div className="overflow-auto ml-12 px-2 mt-2">
      <h1 className="pb-12 text-center">Categories Table</h1>
      {data ? (
        <Table
          updatedData={(ud) => setData(ud.categories)}
          data={data}
          columns={columns}
          entityType="Category"
          validateEntity={validateCategory}
        />
      ) : (
        <div className="text-center">Table is Empty</div>
      )}
    </div>
  );
}

export default Category;
