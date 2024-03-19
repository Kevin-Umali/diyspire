import { useMutation, useQuery } from "@tanstack/react-query";

import { loginUser, logoutUser, refreshToken, registerUser } from "./auth";
import { getAllGuides, getGuideByPath } from "./guide";
import { generateProjectExplanations, generateProjectIdeas, getCommunityGeneratedProjectData, getProjectDataBySlug, incrementCounterOfGeneratedIdea } from "./idea";
import { searchImages } from "./image";
import { saveProjectData } from "./project";
import { checkBackEndHealthStatus, subscribeToNewsletter } from "./system";

/** Guides API */
export const useGuides = () => {
  return useQuery({
    queryKey: ["guides"],
    queryFn: () => getAllGuides(),
  });
};

export const useGuideByPath = (path: string) => {
  return useQuery({
    queryKey: ["guide", path],
    queryFn: () => getGuideByPath(path),
    enabled: !!path,
  });
};

/** Auth API */

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
  });
};

/** System API */

export const useCheckBackEndHealthStatus = () => {
  return useQuery({
    queryKey: ["healthcheck"],
    queryFn: () => checkBackEndHealthStatus(),
  });
};

export const useSubscribeToNewsletter = () => {
  return useMutation({
    mutationFn: subscribeToNewsletter,
  });
};

/** Idea API */

export const useGenerateProjectIdeas = () => {
  return useMutation({
    mutationFn: generateProjectIdeas,
  });
};

export const useIncrementCounterOfGeneratedIdea = () => {
  return useMutation({
    mutationFn: incrementCounterOfGeneratedIdea,
  });
};

export const useGenerateProjectExplanations = () => {
  return useMutation({
    mutationFn: generateProjectExplanations,
  });
};

export const useCommunityGeneratedIdea = (params: { page?: number; limit?: number; orderBy?: string } = {}) => {
  return useQuery({
    queryKey: ["community", params],
    queryFn: () => getCommunityGeneratedProjectData(params),
  });
};

/** Image API */

export const useSearchImages = (query: string, accessToken: string) => {
  return useQuery({
    queryKey: ["images", query, accessToken],
    queryFn: () => searchImages(query, accessToken),
    enabled: !!query && !!accessToken,
  });
};

/** Project API */

export const useSaveProjectData = () => {
  return useMutation({
    mutationFn: saveProjectData,
  });
};

export const useCommunityProjectBySlugData = (slug: string) => {
  return useQuery({
    queryKey: ["slug", slug],
    queryFn: () => getProjectDataBySlug(slug),
  });
};
