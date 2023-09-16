import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MetaTagProps {
  title: string;
  description?: string;
  type?: string; // For OG type (defaults to "website")
  imageUrl?: string; // If you have a dynamic image URL for OG and Twitter cards
}

const MetaTag: React.FC<MetaTagProps> = ({ title, description, type = "website", imageUrl }) => {
  const location = useLocation(); // From react-router-dom to get the current URL path

  useEffect(() => {
    document.title = title;

    const setMetaTag = (name: string, content: string, attr: "name" | "property" = "name") => {
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      if (meta) {
        (meta as HTMLMetaElement).content = content;
      } else {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        (meta as HTMLMetaElement).content = content;
        document.head.appendChild(meta);
      }
    };

    // Primary Meta Tags
    setMetaTag("description", description || "");

    // Open Graph (Facebook) tags
    setMetaTag("og:type", type, "property");
    setMetaTag("og:url", window.location.origin + location.pathname, "property");
    setMetaTag("og:title", title, "property");
    setMetaTag("og:description", description || "", "property");
    if (imageUrl) {
      setMetaTag("og:image", imageUrl, "property");
    }

    // Twitter Card tags
    setMetaTag("twitter:card", imageUrl ? "summary_large_image" : "summary");
    setMetaTag("twitter:url", window.location.origin + location.pathname);
    setMetaTag("twitter:title", title);
    setMetaTag("twitter:description", description || "");
    if (imageUrl) {
      setMetaTag("twitter:image", imageUrl);
    }
  }, [title, description, type, imageUrl, location]);

  return null;
};

export default MetaTag;
