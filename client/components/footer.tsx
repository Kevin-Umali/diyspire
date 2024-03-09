import Link from "next/link";
import { footerData } from "@/constants";

import Newsletter from "./newsletter";

const Footer: React.FC = () => {
  return (
    <footer className="divide-y">
      <div className="container mx-auto space-y-5 p-5 md:py-10">
        <Newsletter />
        <div className="flex flex-wrap justify-between space-y-3 md:space-y-0">
          {footerData.map((data, index) => (
            <div key={index} className="mb-3 flex flex-col md:w-1/4">
              <nav>
                <Link href={data.path ?? data.hash ?? "#"} className="font-semibold" passHref>
                  {data.label}
                </Link>
              </nav>
              <div className="mt-4 flex flex-col space-y-3 md:flex-row md:space-x-3 md:space-y-0">
                {data.links.map((link, linkIndex) => (
                  <nav key={linkIndex}>
                    <Link
                      href={{
                        pathname: link.path ?? "/",
                        hash: link.hash ?? undefined,
                      }}
                      className="py-2 text-sm hover:text-blue-600"
                      passHref
                    >
                      {link.label}
                    </Link>
                  </nav>
                ))}
              </div>
            </div>
          ))}
        </div>

        <address className="flex items-center">
          <p className="pl-2 text-sm">
            Powered by MakeMeDIYspire ✨ | Made with ❤️ by -{" "}
            <a href="#" className="px-4 py-2 text-blue-500" rel="noopener noreferrer" target="_blank" aria-label="Kooma - External Link">
              Kooma
            </a>
          </p>
        </address>
      </div>
    </footer>
  );
};

export default Footer;
