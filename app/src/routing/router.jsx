import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import { useLayoutEffect, useState } from "react";
import authChecker from "../utils/authChecker";
import { Home } from "../pages/Home";
import { Layout } from "../components/Layout";
import { Product } from "../pages/Product";
import Client from "../pages/Client";
import Spinner from "../components/Other/Spinner";
import Supplier from "../pages/Supplier";
import { User } from "../pages/User";
import Category from "../pages/Category";
import Setting from "../pages/Setting";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Stats from "../pages/Stats";
import { invoke } from "@tauri-apps/api/tauri";

import ClientFile from "../pages/ClientFile";
import Details from "../components/Client-File/Details";
import Create from "../components/Client-File/Create";
import { Mails } from "../pages/Mails";
import ProductDetails from "../components/Other/ProductDetails";

export const Router = (props) => {
  const [isConnected, setIsConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    const waitForIt = async () => {
      setIsConnected(await authChecker());
    };
    waitForIt();
    invoke("close_splashscreen");
    setLoading(false);
    props.setLoading(false);
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <HashRouter>
      <Routes>
        {!isConnected && (
          <Route path="/" element={<Login setIsConnected={setIsConnected} />} />
        )}
        {isConnected && (
          <Route
            element={
              <Layout
                setIsConnected={setIsConnected}
                page={page}
                setPage={setPage}
              />
            }
          >
            <Route path="/" element={<Home setPage={setPage} />} />
            <Route path="/client-file" element={<ClientFile />} />
            <Route path="/client-file/:id" element={<Details />} />
            <Route path="/client-file/create" element={<Create />} />
            {/* <Route path="/client-file/edit/:id" element={<Edit />} /> */}
            <Route path="/products" element={<Product />} />
            <Route path="/clients" element={<Client />} />
            <Route path="/suppliers" element={<Supplier />} />
            <Route path="/users" element={<User />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/spinner" element={<Spinner />} />
            <Route path="/mails" element={<Mails />} />
            <Route path="/products/:id" element={<ProductDetails />} />
          </Route>
        )}
      </Routes>
    </HashRouter>
  );
};
