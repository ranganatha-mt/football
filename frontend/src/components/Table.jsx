import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Table = ({ data, columns }) => {
  return (
    <table className="w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden">
      <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={`p-3 ${col.className}`}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.user_id} className="border-b border-gray-700 odd:bg-gray-800 even:bg-gray-700 text-white text-sm hover:bg-purple-700 transition">
              {columns.map((col, index) => (
                <td key={col.key} className={index === 0 ? "flex items-center gap-4 p-4" : "hidden md:table-cell p-3"}>
                  {col.type === "image" ? (
                    <>
                      <img
                        src={item.profile_picture ? `${API_BASE_URL}${item.profile_picture}` : "/avatar.png"}
                        alt="Profile"
                        className="md:hidden xl:block w-12 h-12 rounded-full object-cover border-2 border-purple-400 shadow-md"
                      />
                      <div className="flex flex-col block md:hidden">
                        <h3 className="font-semibold">
                        {item.user_type === "Player" ? (
          <Link to={`/player/${item.user_id}`} className="text-purple-300 hover:underline">
            {item.full_name}
          </Link>
        ) : (
          <span>{item.full_name}</span>
        )}
                        </h3>
                        <p className="text-xs text-gray-300">{item.contact_phone}</p>
                      </div>
                    </>
                  ) : col.key === "full_name" ? (
                    <Link to={`/player/${item.user_id}`} className="text-purple-300 hover:underline">
                      {item[col.key]}
                    </Link>
                  ) : (
                    item[col.key] || "N/A"
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-gray-400">
              No Players Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
