import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Rain Gutter Supply Prospect Management',
  description: 'Manage prospects, track calls, and access sales scripts for your rain gutter supply business',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden bg-gray-100">
          <div className="hidden md:flex md:w-64">
            <Sidebar />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
