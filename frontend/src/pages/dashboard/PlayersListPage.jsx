import { useEffect, useRef,useMemo } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../store/userDetails";

import {Layout} from "../../components/Layout";
import Pagination from "../../components/Pagination";
import Table from "../../components/Table";
import TableSearch from "../../components/TableSearch";

const PlayersListPage = () => {
  const userType = "Player";
  const { data, total, page, limit, search, fetchData, setSearch, setPage } = useStore();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    fetchData(page, limit, search, userType);
  }, [page, search, limit, fetchData]);

  // Define dynamic columns
  const columns = [
    { key: "info", label: "Info", type: "image" },
    { key: "full_name", label: "Name", className: "hidden  md:table-cell" }, 
    { key: "contact_phone", label: "Mobile", className: "hidden  md:table-cell" }, 
    { key: "position", label: "Position", className: "hidden  md:table-cell" },
    { key: "age", label: "Age", className: " hidden md:table-cell" },
    { key: "contact_email", label: "Email", className: "hidden md:table-cell" },
    { key: "gender", label: "Gender", className: "hidden md:table-cell" },
  ];
  // Memoize table data to avoid re-renders when data hasn't changed
  const tableData = useMemo(() => data, [data]);
  return (
     <Layout>
        <div className=" p-2 rounded-md flex-1  mt-0">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
                    <h2 className="text-3xl font-extrabold tracking-wide text-white">⚽ Players List</h2>
            </div>
          {/* HEADER */}
          <div className="flex items-center justify-between">
            {/* <h1 className="hidden md:block text-lg font-semibold text-white">Players List</h1> */}
            
            <TableSearch search={search} setSearch={setSearch} />
          </div>

          {/* PLAYERS TABLE (Dynamic Columns) */}
          <Table data={tableData} columns={columns} />

          {/* PAGINATION */}
          <Pagination page={page} total={total} limit={limit} setPage={setPage} fetchData={fetchData} search={search} userType={userType} />
        </div>
      </Layout>
  );
};

export default PlayersListPage;
