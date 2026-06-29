import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { adminService } from "../adminService";
import { FaUser, FaCheck, FaTimes, FaLock, FaUnlock, FaShieldAlt, FaStore, FaClock } from "react-icons/fa";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import ErrorMessage from "../../../components/common/ErrorMessage";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter tabs
  const [tab, setTab] = useState<"all" | "pending">("all");
  const [search, setSearch] = useState("");

  // Action states
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number>(2); // Default to User
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [goldShopsList, setGoldShopsList] = useState<any[]>([]);
  const [selectedGoldShopId, setSelectedGoldShopId] = useState<string>("");
  const [blockDays, setBlockDays] = useState<number>(7);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryUserId = searchParams.get("userId");

  const backendUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, "") : "http://localhost:5262";

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await adminService.getUsers();
      setUsers(allUsers);
      const roles = await adminService.getRoles();
      setRolesList(roles);
      const shops = await adminService.getGoldShops();
      setGoldShopsList(shops);
      if (shops.length > 0) setSelectedGoldShopId(shops[0].id);

      // Auto-select user from query param
      if (queryUserId) {
        const details = await adminService.getUserById(queryUserId);
        setSelectedUser(details);
        // Sync selected role ID if role is available
        if (details.roles && details.roles.length > 0) {
          const roleObj = roles.find((r: any) => r.name === details.roles[0]);
          if (roleObj) setSelectedRoleId(roleObj.id);
        }
      }
    } catch (err: any) {
      setError("Failed to load users data from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and Search logic
  useEffect(() => {
    let result = users;
    if (tab === "pending") {
      result = result.filter((u) => u.verificationStatus === "Pending");
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    setFilteredUsers(result);
  }, [users, tab, search]);

  // Load detailed user info when clicked
  const handleSelectUser = async (userId: string) => {
    try {
      const details = await adminService.getUserById(userId);
      setSelectedUser(details);
      setRejectReason("");
      setSearchParams({ userId });
      if (details.roles && details.roles.length > 0) {
        const roleObj = rolesList.find((r: any) => r.name === details.roles[0]);
        if (roleObj) setSelectedRoleId(roleObj.id);
      }
    } catch (err) {
      alert("Failed to load user details");
    }
  };

  // Verify User Action (Approve / Reject)
  const handleVerify = async (isApproved: boolean) => {
    if (!isApproved && !rejectReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    try {
      await adminService.verifyUser({
        userId: selectedUser.id,
        isApproved,
        reason: isApproved ? undefined : rejectReason,
      });
      alert(`User ${isApproved ? "Approved" : "Rejected"} successfully.`);
      setSelectedUser(null);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to update verification status");
    }
  };

  // Assign Role Action
  const handleAssignRole = async () => {
    try {
      await adminService.assignRole({
        userId: selectedUser.id,
        roleId: selectedRoleId,
      });
      alert("Role assigned successfully");
      // Reload details
      handleSelectUser(selectedUser.id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to assign role");
    }
  };

  // Activate GoldShop Action
  const handleActivateGoldShop = async () => {
    if (!selectedGoldShopId) {
      alert("Please select a Gold Shop");
      return;
    }
    try {
      await adminService.activateGoldShop({
        userId: selectedUser.id,
        goldShopId: selectedGoldShopId,
      });
      alert("Employee assigned to Gold Shop and role updated successfully!");
      handleSelectUser(selectedUser.id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to link Gold Shop");
    }
  };

  // Block User Action
  const handleBlockUser = async () => {
    try {
      await adminService.blockUser({
        userId: selectedUser.id,
        days: blockDays,
      });
      alert("User blocked successfully");
      handleSelectUser(selectedUser.id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to block user");
    }
  };

  // Unblock User Action
  const handleUnblockUser = async () => {
    try {
      await adminService.unblockUser(selectedUser.id);
      alert("User unblocked successfully");
      handleSelectUser(selectedUser.id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data || "Failed to unblock user");
    }
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-amber-500 flex items-center gap-2">
          <FaShieldAlt /> User Management
        </h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-sm rounded-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Middle: List & Filters */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs & Search */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setTab("all")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "all" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
                  }`}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setTab("pending")}
                className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${tab === "pending" ? "bg-amber-500 text-black shadow" : "text-gray-400 hover:text-white"
                  }`}
              >
                Pending ({users.filter((u) => u.verificationStatus === "Pending").length})
              </button>
            </div>

            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-500"
            />
          </div>

          {/* Table */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-gray-400 uppercase tracking-wider border-b border-slate-800">
                  <th className="px-6 py-4 font-semibold">User Details</th>
                  <th className="px-6 py-4 font-semibold">Verification Status</th>
                  <th className="px-6 py-4 font-semibold">Roles</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-slate-900/40 transition-colors ${selectedUser?.id === u.id ? "bg-slate-900/60 border-l-4 border-l-amber-500" : ""
                      }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-200">{u.fullName}</div>
                      <div className="text-gray-500 text-xxs mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xxs font-medium ${u.verificationStatus === "Approved"
                          ? "bg-green-950 text-green-400 border border-green-800"
                          : u.verificationStatus === "Pending"
                            ? "bg-yellow-950 text-yellow-400 border border-yellow-800 animate-pulse"
                            : "bg-red-950 text-red-400 border border-red-800"
                          }`}
                      >
                        {u.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.map((r: string) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 bg-slate-800 rounded text-xxs text-amber-400 font-semibold"
                          >
                            {r}
                          </span>
                        )) || <span className="text-gray-600">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSelectUser(u.id)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors text-xxs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-500 py-12">
                      No users matching the criteria found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Pane: User Management Panel */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-xl sticky top-20">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-200">{selectedUser.fullName}</h2>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                  <p className="text-xs text-gray-500">{selectedUser.phone}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSearchParams({});
                  }}
                  className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Close
                </button>
              </div>

              {/* Verification Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FaShieldAlt /> User Verification
                </h3>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-xxs text-gray-400 block">Verification Status</span>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xxs font-medium ${selectedUser.verificationStatus === "Approved"
                          ? "bg-green-950 text-green-400 border border-green-800"
                          : selectedUser.verificationStatus === "Pending"
                            ? "bg-yellow-950 text-yellow-400 border border-yellow-800 animate-pulse"
                            : "bg-red-950 text-red-400 border border-red-800"
                          }`}
                      >
                        {selectedUser.verificationStatus}
                      </span>
                    </div>
                    {selectedUser.verificationRejectionReason && (
                      <div className="max-w-[150px] text-right">
                        <span className="text-xxs text-red-400 block font-semibold">Rejection Reason</span>
                        <p className="text-xxs text-gray-400 whitespace-pre-wrap">{selectedUser.verificationRejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Image comparison gallery - ALWAYS SHOW */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-xxs text-gray-400 block font-medium">Profile</span>
                      <div className="bg-slate-950 aspect-video rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        {selectedUser.profileImageUrl ? (
                          <img
                            src={`${backendUrl}${selectedUser.profileImageUrl}`}
                            alt="Profile"
                            className="object-cover w-full h-full hover:scale-110 transition duration-300 cursor-zoom-in"
                            onClick={() => window.open(`${backendUrl}${selectedUser.profileImageUrl}`, "_blank")}
                          />
                        ) : (
                          <FaUser className="text-gray-700 text-2xl" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xxs text-gray-400 block font-medium">Selfie Face</span>
                      <div className="bg-slate-950 aspect-video rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        {selectedUser.faceImageUrl ? (
                          <img
                            src={`${backendUrl}${selectedUser.faceImageUrl}`}
                            alt="Selfie"
                            className="object-cover w-full h-full hover:scale-110 transition duration-300 cursor-zoom-in"
                            onClick={() => window.open(`${backendUrl}${selectedUser.faceImageUrl}`, "_blank")}
                          />
                        ) : (
                          <FaUser className="text-gray-700 text-2xl" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xxs text-gray-400 block font-medium">ID Card</span>
                      <div className="bg-slate-950 aspect-video rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        {selectedUser.identityImageUrl ? (
                          <img
                            src={`${backendUrl}${selectedUser.identityImageUrl}`}
                            alt="Identity"
                            className="object-cover w-full h-full hover:scale-110 transition duration-300 cursor-zoom-in"
                            onClick={() => window.open(`${backendUrl}${selectedUser.identityImageUrl}`, "_blank")}
                          />
                        ) : (
                          <span className="text-xxs text-gray-700">No image</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions - SHOW ONLY IF PENDING */}
                  {selectedUser.verificationStatus === "Pending" && (
                    <div className="space-y-2 border-t border-slate-800 pt-3">
                      <button
                        onClick={() => handleVerify(true)}
                        className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FaCheck /> Approve Verification
                      </button>

                      <div className="border-t border-slate-800 my-2 pt-2">
                        <input
                          type="text"
                          placeholder="Rejection reason…"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xxs text-white focus:outline-none focus:ring-1 focus:ring-red-500 placeholder-gray-600"
                        />
                        <button
                          onClick={() => handleVerify(false)}
                          className="w-full mt-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <FaTimes /> Reject Verification
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Roles Management */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FaShieldAlt /> Role Assignment
                </h3>
                <div className="flex gap-2">
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {rolesList.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignRole}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>

              {/* GoldShop Activation */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FaStore /> Link Gold Shop Employee
                </h3>
                <p className="text-xxs text-gray-500 leading-snug">
                  Activate this user as a shop employee for verifying local customer purchases.
                </p>
                <div className="flex gap-2">
                  <select
                    value={selectedGoldShopId}
                    onChange={(e) => setSelectedGoldShopId(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {goldShopsList.map((shop) => (
                      <option key={shop.id} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleActivateGoldShop}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg text-xs transition-colors"
                  >
                    Link Shop
                  </button>
                </div>
                {selectedUser.goldShopName && (
                  <p className="text-xxs text-green-400 font-semibold flex items-center gap-1">
                    <FaCheck /> Currently linked to: {selectedUser.goldShopName}
                  </p>
                )}
              </div>

              {/* Block / Unblock Controls */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FaLock /> User Restrictions
                </h3>

                {selectedUser.isActive ? (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xxs text-gray-400">Block Duration (Days)</span>
                      <input
                        type="number"
                        min={1}
                        value={blockDays}
                        onChange={(e) => setBlockDays(Math.max(1, Number(e.target.value)))}
                        className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-white focus:outline-none text-center"
                      />
                    </div>
                    <button
                      onClick={handleBlockUser}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FaLock /> Block User Account
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2">
                    <p className="text-xxs text-red-400 font-semibold flex items-center gap-1">
                      <FaLock /> Account currently blocked / inactive.
                    </p>
                    <button
                      onClick={handleUnblockUser}
                      className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FaUnlock /> Unblock Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-gray-500 shadow-xl py-24">
              <FaUser className="mx-auto text-4xl mb-3 text-slate-800" />
              <p className="text-xs">Select a user from the list to view verification images and manage permissions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
