import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Navbar/sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const robertoitalic = localFont({
  src: "./fonts/Robertoitalic.ttf",
  variable: "--font-roboto-italic",
  weight: "100 900",
});

const robertV = localFont({
  src: "./fonts/Roberto.ttf",
  variable: "--font-roboto-variable",
  weight: "100 900",
});

export const metadata = {
  title: "Share Nepal",
  description: "THREE JS",
};


export default async function RootLayout({ children }) {
  
  // const data = await fetchData();
  const data = []
  return (
    <html lang="en">
      <link rel="icon" href="./sharelogom.ico" sizes="any"></link>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robertV.variable} ${robertoitalic.variable} antialiased bg-background text-foreground`}>
          <Sidebar/>
       {/* <DataWrapper data={data}> */}
        <div className="p-4 sm:ml-64"> 
        {children}
        </div>
       {/* </DataWrapper> */}
      </body>
    </html>
  );
}

// function DataWrapper({data,children}) {
//   return (
//     <div data-server-data ={JSON.stringify(data)}>{children}</div>
//   )
// }
