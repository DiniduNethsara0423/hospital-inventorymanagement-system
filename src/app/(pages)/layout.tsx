import Navbar from "../components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <div className="flex h-screen">
          {/* Sidebar/Navbar */}
          <div className="w-[16%] text-white">
            <Navbar />
          </div>

          {/* Main Content */}
          <div className="flex-1 mt-12 overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
