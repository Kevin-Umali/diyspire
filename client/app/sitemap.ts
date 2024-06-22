import { MetadataRoute } from "next";
import { getCommunityGeneratedProjectData } from "@/api";

export default async function sitemap() {
  const { NEXT_PUBLIC_MAINTENANCE_MODE, NEXT_PUBLIC_PROJECT_URL } = process.env;

  const isMaintenance = NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  const baseSitemap: MetadataRoute.Sitemap = [
    { url: `${NEXT_PUBLIC_PROJECT_URL}/robot.txt`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/icon.ico`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/guide`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/generate`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/status`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/faq`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/community`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/login`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/community/project-detail`, lastModified: new Date() },
    { url: `${NEXT_PUBLIC_PROJECT_URL}/maintenance`, lastModified: new Date() },
  ];

  // If the site is under maintenance, return the base sitemap
  if (isMaintenance) {
    return baseSitemap;
  }

  try {
    let allCommunityProjects: { slug: string }[] = [];
    let page = 1;
    const limit = 20;

    while (true) {
      const response = await getCommunityGeneratedProjectData({ page, limit, onlySlug: true });
      allCommunityProjects = allCommunityProjects.concat(response.data.projects);

      if (allCommunityProjects.length >= response.data.totalCount) {
        break;
      }

      page++;
    }

    const projectDetailsSiteMap: MetadataRoute.Sitemap = allCommunityProjects.map((project) => ({
      url: `${NEXT_PUBLIC_PROJECT_URL}/community/project-detail/${project.slug}`,
      lastmod: new Date(),
    }));

    return [...baseSitemap, ...projectDetailsSiteMap];
  } catch (error) {
    return baseSitemap;
  }
}
