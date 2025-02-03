import RoleCheckBox from "@/components/RoleCheckBox/roleCheckBox";
export default function UserTable({ datas }) {
  return (
    <div className="container mx-auto p-4 rounded-lg">
      {/* Search and Gainer Controls */}
      <div className="flex justify-between items-center mb-4 w-full bg-gray-100 h-16 text-2xl rounded-lg shadow-xl">
        <h1 className="text-2xl font-bold ml-10">User List</h1>
      </div>

      {/* Table */}
      <div className="overflow-auto relative bg-white p-4 shadow-md">
        <table className="min-w-full shadow-xl rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">Id</th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                User Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Email
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {datas.map((user) => (
              <tr key={user.id} className={`border-b font-mono text-black bg-gray-300 cursor-pointer`}>
                <td className={`px-4 py-2`}>{user.id}</td>
                <td className="px-4 py-2 ">
                  {user.username}
                </td>
                <td className="px-4 py-2">
                  {user.email}
                </td>
                <td className="px-4 py-2">
                 <RoleCheckBox id={user.id} role={user.role}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
