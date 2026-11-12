import IndicesClient from "./IndicesClient";
import { SERVER_BASE_URL } from "../config/constraints";
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

  // Independent requests: run them together instead of one after another.
  const [listRes, analysisRes, compareRes] = await Promise.allSettled([
    axios.get(`${SERVER_BASE_URL}${indices_list_endpoint}`, { headers, timeout: 8000 }),
    selectedId
      ? axios.get(`${SERVER_BASE_URL}${indices_analysis_endpoint}?index_id=${selectedId}&days=30`, { headers, timeout: 8000 })
      : Promise.resolve(null),
    axios.get(`${SERVER_BASE_URL}${indices_compare_endpoint}?index_ids=58,51,54,55,65,59&days=30`, { headers, timeout: 8000 }),
  ]);

  if (listRes.status === "fulfilled") indicesList = listRes.value.data;
  else console.error("Error fetching indices:", listRes.reason?.message);

  if (analysisRes.status === "fulfilled" && analysisRes.value) {
    selectedAnalysis = analysisRes.value.data;
  } else if (analysisRes.status === "rejected") {
    console.error("Error fetching index analysis:", analysisRes.reason?.message);
  }

  if (compareRes.status === "fulfilled") comparison = compareRes.value.data;
  else console.error("Error fetching index comparison:", compareRes.reason?.message);

  return (
    <IndicesClient 
      indicesList={indicesList}
      selectedAnalysis={selectedAnalysis}
      comparison={comparison}
      initialSelectedId={selectedId}
    />
  );
}
