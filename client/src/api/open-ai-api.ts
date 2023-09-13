const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : import.meta.env.VITE_OPEN_AI_API_URL;

export const generateProjectIdeas = async (materials: string[], onlySpecified: boolean, difficulty: string, category: string, tools: string[], time: number, budget: number, endPurpose: string) => {
  const requestBody = {
    materials,
    onlySpecified,
    difficulty,
    category,
    tools,
    time,
    budget,
    endPurpose,
  };

  const response = await fetch(API_URL + "/v1/generate/idea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
