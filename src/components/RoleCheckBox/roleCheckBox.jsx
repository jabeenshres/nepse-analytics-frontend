"use client";
import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/app/config/constraints";
import { users_endpoint } from "@/app/config/endpoint";
import { getCookies } from "@/app/utils/setCookies";

export default function RoleCheckBox({ role, id }) {
  const [checked, setChecked] = useState(role === "admin");

  const handleChange = async () => {
    try {
      await axios.put(
        `${BASE_URL}${users_endpoint}`,
        {
          id: id,
          role: role === "admin" ? "user" : "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(await getCookies("token")).access}`,
          },
        }
      );
      setChecked((prev) => !prev);
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        name="role"
        id="role"
        checked={checked}
        onChange={handleChange}
      />
      {checked?<p>Admin</p>:<p>User</p>}
    </div>
  );
}
