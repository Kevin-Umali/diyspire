import Link from "next/link";
import { footerData } from "@/constants";

const Footer: React.FC = () => {
  return (
    <footer className="divide-y">
      <div className="container mx-auto py-5 md:py-10 px-5 space-y-5">
        <div className="flex flex-wrap justify-between space-y-3 md:space-y-0">
          {footerData.map((data, index) => (
            <div key={index} className="flex flex-col mb-3 md:w-1/4">
              <nav>
                <Link href={data.path ?? data.hash ?? "#"} className="font-semibold" passHref>
                  {data.label}
                </Link>
              </nav>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4">
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
          <p className="text-sm pl-2">
            Powered by MakeMeDIYspire ✨ | Made with ❤️ by -{" "}
            <a href="#" className="text-blue-500 py-2 px-4" rel="noopener noreferrer" target="_blank" aria-label="Kooma - External Link">
              Kooma
            </a>
          </p>
        </address>
      </div>
    </footer>
  );
};

export default Footer;
