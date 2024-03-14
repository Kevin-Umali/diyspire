import { useMutation, useQuery } from "@tanstack/react-query";

import { loginUser, logoutUser, refreshToken, registerUser } from "./auth";
import { getAllGuides, getGuideByPath } from "./guide";
import { generateProjectExplanations, generateProjectIdeas, getCommunityGeneratedIdea, incrementCounterOfGeneratedIdea } from "./idea";
import { searchImages } from "./image";
import { getShareLinkData, saveShareLinkData } from "./share";
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

export const useCommunityGeneratedIdea = (params: { limit?: number; orderBy?: string } = {}) => {
  return useQuery({
    queryKey: ["community", params],
    queryFn: () => getCommunityGeneratedIdea(params),
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

/** Share API */

export const useSaveShareLinkData = () => {
  return useMutation({
    mutationFn: saveShareLinkData,
  });
};

export const useShareLinkData = (id: string) => {
  return useQuery({
    queryKey: ["share", id],
    queryFn: () => getShareLinkData(id),
  });
};
