import Homedesign from "./homedesign";
import { BASE_URL } from "../config/constraints";
import { stock_recent_endpoint } from "../config/endpoint";
import axios from "axios";
import { redirect } from "next/navigation";
export default async function Homee() {


    let gainer,looser;
    try{

       looser = await axios.get(
          `${BASE_URL}${stock_recent_endpoint}?gainer=0`
        );
       gainer = await axios.get(
          `${BASE_URL}${stock_recent_endpoint}?gainer=1`
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