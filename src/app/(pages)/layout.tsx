import Navbar from "../components/navbar";
import Header from "../components/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <div className="flex w-full h-screen">
          {/* Sidebar with Navbar */}
          <div className="w-[20%] bg-gray-800 text-white">
            <Navbar />
          </div>
          {/* Main Content Area */}
          <div className="w-[80%]">
            <Header />
            <main className="p-4 mt-14">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
