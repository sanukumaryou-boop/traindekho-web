import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DeveloperShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar containerClassName="max-w-7xl" />
      <main className="docs-canvas pt-16 pb-20">{children}</main>
      <Footer containerClassName="max-w-7xl" />
    </>
  );
}
