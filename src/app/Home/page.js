import Homedesign from "./homedesign";
import { authorization } from "../hoc/auth";
import { BASE_URL } from "../config/constraints";
import { stock_recent_endpoint } from "../config/endpoint";
import axios from "axios";
import { redirect } from "next/navigation";
export default async function Homee() {

    const token = await authorization();
    let gainer,looser;
    try{

       looser = await axios.get(
          `${BASE_URL}${stock_recent_endpoint}?gainer=0`,
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
       gainer = await axios.get(
          `${BASE_URL}${stock_recent_endpoint}?gainer=1`,
          {
            headers: {
              Authorization: `Bearer ${token.access}`,
            },
          }
        );
    }catch(err){
      if (err.response?.status === 403 || err.response?.status === 401) {
              redirect("/Login");
            }
    }
    return (
        <div>
            <Homedesign gainer={gainer.data} looser={looser.data}/>
        </div>
    )
}