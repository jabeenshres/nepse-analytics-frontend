"use client";

import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { users_endpoint } from "@/app/config/endpoint";
import { getCookies } from "@/app/utils/setCookies";

export default function RoleCheckBox({ role, id }) {
  const [checked, setChecked] = useState(role === "manager");

  const handleChange = async () => {
    try {
      const newRole = checked ? "user" : "manager";

      await axios.put(
        `${BASE_URL}${users_endpoint}`,
        { id, role: newRole },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
          },
        }
      );

      setChecked(!checked);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  if (role === "admin") {
    return <p>Admin</p>;
  }

  return (
    <div>
      <label htmlFor="role">
        <input
          type="checkbox"
          name="role"
          id="role"
          checked={checked}
          onChange={handleChange}
        />
        {checked ? <p>Manager</p> : <p>User</p>}
      </label>
    </div>
  );
}
