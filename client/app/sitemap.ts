import { MetadataRoute } from "next";
import { getCommunityGeneratedProjectData } from "@/api";

export default async function sitemap() {
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
    url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail/${project.slug}`,
    lastmod: new Date(),
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/robot.txt`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/icon.ico`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/guide`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/generate`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/status`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/community`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/login`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_PROJECT_URL}/project-detail`,
      lastModified: new Date(),
    },
    ...projectDetailsSiteMap,
  ];
}
