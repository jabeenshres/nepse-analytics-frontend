export const fetchPrediction = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/admin/predict/");
    if (!response.ok) {
      throw new Error("Failed to fetch prediction data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return null;
  }
};
