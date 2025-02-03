import Image from "next/image";


async function About() {
    const commonInputClasses = "w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out";
   return (
       <section className="text-gray-600 body-font relative">
           <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
               <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                   <div className="absolute inset-0 flex justify center" >
                    <Image src="/images/sharelogo.jpg" alt="Share NEPAL" width={800} height={475}   />
                   </div>
                   <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
                       <div className="lg:w-1/2 px-6">
                           <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">ADDRESS</h2>
                           <p className="mt-1">Patan-Dhoka, Lalitpur, Nepal</p>
                       </div>
                       <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                           <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">EMAIL</h2>
                           <a className="text-indigo-500 leading-relaxed">sharenepal@email.com</a>
                           <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">PHONE</h2>
                           <p className="leading-relaxed">01496722</p>
                       </div>
                   </div>
               </div>
               <div className="lg:w-1/3 md:w-1/2 bg-white italic flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
                  <p>The share market is a platform where investors buy and sell shares of publicly traded companies. It operates through stock exchanges, such as the NSE and BSE, allowing companies to raise capital and investors to earn returns. Market trends are influenced by factors like economic conditions, corporate performance, and global events. Trading can be done in two primary ways: intraday trading (buying and selling within the same day) and long-term investment (holding stocks for future growth). Successful investing requires research, analysis, and risk management.</p>
                  <p>The stock market is a dynamic financial ecosystem where investors trade shares of publicly listed companies. It serves as a vital engine for economic growth, enabling businesses to raise capital while offering individuals opportunities to build wealth. Market movements are driven by corporate performance, economic indicators, and global trends. Investors engage in intraday trading for quick gains or adopt long-term investment strategies for sustained growth. Mastering the stock market requires sharp analysis, risk management, and strategic decision-making, making it a powerful tool for financial success.</p>
               </div>
           </div>
       </section>
   );
}

export default About;