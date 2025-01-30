import Homedesign from "./homedesign";
import { authorization } from "../hoc/auth";
import { BASE_URL } from "../config/constraints";
import { stock_recent_endpoint } from "../config/endpoint";
import axios from "axios";
export default async function Homee() {

    const token = await authorization();
    const looser = await axios.get(
        `${BASE_URL}${stock_recent_endpoint}?gainer=0`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
    const gainer = await axios.get(
        `${BASE_URL}${stock_recent_endpoint}?gainer=1`,
        {
          headers: {
            Authorization: `Bearer ${token.access}`,
          },
        }
      );
    return (
        <div>
            <Homedesign gainer={gainer.data} looser={looser.data}/>
        </div>
    )
}