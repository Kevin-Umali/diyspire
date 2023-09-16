const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : import.meta.env.VITE_OPEN_AI_API_URL;

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

export const generateProjectExplanations = async (title: string, materials: string[], tools: string[], time: string, budget: string, description: string) => {
  const requestBody = {
    title,
    materials,
    tools,
    time,
    budget,
    description,
  };

  const response = await fetch(API_URL + "/v1/generate/explain", {
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

export const searchImages = async (query: string) => {
  const endpoint = `${API_URL}/v1/image/search?query=${encodeURIComponent(query)}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

export const getGuideByPath = async (path: string) => {
  const endpoint = `${API_URL}/v1/guide/${path}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};

export const getAllGuides = async () => {
  const response = await fetch(API_URL + "/v1/guide", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
};
