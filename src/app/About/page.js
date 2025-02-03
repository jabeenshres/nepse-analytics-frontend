import Image from "next/image";

async function About() {
 
  return (
    <section className="text-gray-600 body-font relative">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
          <div className="absolute inset-0 flex justify center">
            <Image
              src="/images/sharelogo.jpg"
              alt="Share NEPAL"
              width={800}
              height={475}
            />
          </div>
          <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                ADDRESS
              </h2>
              <p className="mt-1">Patan-Dhoka, Lalitpur, Nepal</p>
            </div>
            <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                EMAIL
              </h2>
              <a className="text-indigo-500 leading-relaxed">
                sharenepal@email.com
              </a>
              <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                PHONE
              </h2>
              <p className="leading-relaxed">01496722</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 md:w-1/2 bg-white italic flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
          <p>
            Our system predicts future stock prices for the Nepal Stock Exchange
            (NEPSE) using advanced machine learning models.
          </p>

          <p>
            It extracts real-time market data, such as opening prices, closing
            prices, and trading volumes, directly from NEPSE to ensure accurate
            insights.
          </p>

          <p>
            We use two key models: Long Short-Term Memory (LSTM) and Random
            Forest Regressor. LSTM captures time-based patterns in stock data,
            while the Random Forest Regressor combines decision trees for
            improved predictions.
          </p>

          <p>
            Users can easily load market data and select dates to generate
            predictions for the next trading day. The system provides real-time
            feedback during processing, offering a smooth user experience.
          </p>

          <p>
            This tool helps investors, analysts, and financial enthusiasts make
            better decisions in a rapidly changing market.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
