import IndicesClient from "./IndicesClient";
import { BASE_URL } from "../config/constraints";
import { indices_list_endpoint, indices_analysis_endpoint, indices_compare_endpoint } from "../config/endpoint";
import axios from "axios";
import { requireFeature, authHeaders } from "@/app/lib/auth";

export default async function IndicesPage({ searchParams }) {
  await requireFeature("indices");
  const headers = await authHeaders();
  const params = await searchParams;
  const selectedId = params?.id || "";

  let indicesList = { indices: [] };
  let selectedAnalysis = null;
  let comparison = null;

  try {
    // Fetch all indices
    const listRes = await axios.get(`${BASE_URL}${indices_list_endpoint}`, { headers });
    indicesList = listRes.data;

    // If specific index selected, fetch analysis
    if (selectedId) {
      const analysisRes = await axios.get(`${BASE_URL}${indices_analysis_endpoint}?index_id=${selectedId}&days=30`, { headers });
      selectedAnalysis = analysisRes.data;
    }

    // Fetch comparison of main indices
    const compareRes = await axios.get(`${BASE_URL}${indices_compare_endpoint}?index_ids=58,51,54,55,65,59&days=30`, { headers });
    comparison = compareRes.data;
  } catch (err) {
    console.error("Error fetching indices:", err.message);
  }

  return (
    <IndicesClient 
      indicesList={indicesList}
      selectedAnalysis={selectedAnalysis}
      comparison={comparison}
      initialSelectedId={selectedId}
    />
  );
}
