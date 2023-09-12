const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://your-production-api-url.com";

export const generateProjectIdeas = async (materials: string[], difficulty: string, category: string, tools: string[], time: number, budget: number, endPurpose: string) => {
  const requestBody = {
    materials,
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

  console.log(JSON.stringify(requestBody));

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
