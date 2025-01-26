import { fetchData } from "../lib/api"
import Homedesign from "./homedesign";
import { authorization } from "../hoc/auth";

export default async function Homee() {
    // const data = await fetchData();
    await authorization();
    const data = []
    return (
        <div>
            <Homedesign result={data} />
        </div>
    )
}