const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchApiOptions = {
  method?: string;
  body?: object;
};

const fetchApi = async (endpoint: string, { method = "GET", body }: FetchApiOptions = {}): Promise<any> => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(`${API_URL}${endpoint}`, options);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || "Network response was not ok");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Fetch API Error: ", error.message);
    throw error;
  }
};

export const generateProjectIdeas = async (
  materials: string[],
  onlySpecified: boolean,
  difficulty: string,
  category: string,
  tools: string[],
  timeValue: number,
  timeUnit: string | null,
  budget: number,
  endPurpose: string
): Promise<any> => {
  const time = timeValue && timeUnit ? `${timeValue} ${timeUnit}` : "";
  return fetchApi("/v1/generate/idea", {
    method: "POST",
    body: { materials, onlySpecified, difficulty, category, tools, time, budget, endPurpose },
  });
};

export const generateProjectExplanations = async (title: string, materials: string[], tools: string[], time: string, budget: string, description: string): Promise<any> => {
  return fetchApi("/v1/generate/explain", {
    method: "POST",
    body: { title, materials, tools, time, budget, description },
  });
};

export const searchImages = async (query: string): Promise<any> => {
  return fetchApi(`/v1/image/search?query=${encodeURIComponent(query)}`);
};

export const getGuideByPath = async (path: string): Promise<any> => {
  return fetchApi(`/v1/guide/${path}`);
};

export const getAllGuides = async (): Promise<any> => {
  return fetchApi("/v1/guide");
};

export const saveShareLinkData = async (projectDetails: object, projectImage: object, explanation: string): Promise<string> => {
  return fetchApi("/v1/share", {
    method: "POST",
    body: { projectDetails, projectImage, explanation },
  });
};

export const getShareLinkData = async (id: string): Promise<any> => {
  return fetchApi(`/v1/share/${id}`);
};

export const getTotalCountOfGeneratedIdea = async (): Promise<any> => {
  return fetchApi("/v1/counter");
};

export const incrementCounterOfGeneratedIdea = async (): Promise<any> => {
  return fetchApi("/v1/counter", { method: "POST" });
};

export const cleanMarkdown = (content: string) => {
  return content
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
};
