import React from "react";
import StaffList from "../components/StaffList";

const AdminStaff = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-[#537D5D]">Admin: Staff Management</h1>
      <StaffList />
    </div>
  );
};

export default AdminStaff;
