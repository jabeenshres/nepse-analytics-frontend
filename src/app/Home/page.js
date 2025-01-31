import Homedesign from "./homedesign";
import { BASE_URL } from "../config/constraints";
import { stock_recent_endpoint } from "../config/endpoint";
import axios from "axios";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function Homee() {
  const cookieStore = await cookies();

  let username = "Guest";
  try {
    const token = JSON.parse(cookieStore.get("token")?.value);

    if (token) {
      username = token?.username ?? "Guest";
    }
  } catch (error) {
    username = "Guest";
  }

  let gainer, looser;
  try {
    looser = await axios.get(`${BASE_URL}${stock_recent_endpoint}?gainer=0`);
    gainer = await axios.get(`${BASE_URL}${stock_recent_endpoint}?gainer=1`);
  } catch (err) {
    if (err.response?.status === 403 || err.response?.status === 401) {
      redirect("/Login");
    }
  }
  return (
    <div>
      <p>Welcome {username}</p>
      <Homedesign gainer={gainer.data} looser={looser.data} />
    </div>
  );
}
