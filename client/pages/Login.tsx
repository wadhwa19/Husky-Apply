export default function Login() {
  return (
    <div className="min-h-screen bg-husky-purple flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-8 left-4 md:left-12">
        <h2 className="text-4xl md:text-6xl font-kavoon text-husky-gold">
          Hello!
        </h2>
      </div>

      <div className="absolute top-8 right-4 md:right-12">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/933897c3073d43274d92bb6894674b999b47b382?width=580"
          alt="Husky Apply Logo"
          className="w-32 h-32 md:w-72 md:h-72 object-contain"
        />
      </div>

      <div className="text-center space-y-6 md:space-y-8 mt-20 md:mt-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-kavoon text-husky-gold leading-tight">
          Welcome to Husky apply!
        </h1>

        <p className="text-3xl md:text-5xl lg:text-6xl font-kavoon text-husky-gold">
          Find Jobs and Scholarships!
        </p>

        <button className="mt-8 md:mt-12 inline-flex items-center gap-3 md:gap-4 px-6 md:px-8 py-3 md:py-4 bg-husky-light-purple border-2 border-husky-gold rounded-lg hover:bg-opacity-90 transition-all">
          <svg
            className="w-10 h-10 md:w-14 md:h-14 fill-[#85754D]"
            viewBox="0 0 60 53"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M59.0068 15.365L30.8813 0.222097C30.61 0.0762702 30.3073 0 30 0C29.6927 0 29.39 0.0762702 29.1187 0.222097L0.993184 15.365C0.693188 15.5264 0.442299 15.7671 0.267357 16.0614C0.0924143 16.3556 0 16.6923 0 17.0355C0 17.3787 0.0924143 17.7154 0.267357 18.0096C0.442299 18.3039 0.693188 18.5446 0.993184 18.706L7.49956 22.2101V33.6667C7.49739 34.5965 7.83638 35.4942 8.45114 36.1866C11.5215 39.6387 18.4006 45.4285 30 45.4285C33.8461 45.4606 37.6633 44.7574 41.2502 43.3558V51.1071C41.2502 51.6092 41.4478 52.0906 41.7994 52.4456C42.151 52.8006 42.628 53 43.1253 53C43.6225 53 44.0995 52.8006 44.4511 52.4456C44.8027 52.0906 45.0003 51.6092 45.0003 51.1071V41.5269C47.4454 40.1021 49.6549 38.3002 51.5489 36.1866C52.1636 35.4942 52.5026 34.5965 52.5004 33.6667V22.2101L59.0068 18.706C59.3068 18.5446 59.5577 18.3039 59.7326 18.0096C59.9076 17.7154 60 17.3787 60 17.0355C60 16.6923 59.9076 16.3556 59.7326 16.0614C59.5577 15.7671 59.3068 15.5264 59.0068 15.365ZM30 41.6428C19.8584 41.6428 13.8934 36.6409 11.2496 33.6667V24.2284L29.1187 33.8489C29.39 33.9947 29.6927 34.071 30 34.071C30.3073 34.071 30.61 33.9947 30.8813 33.8489L41.2502 28.2673V39.2318C38.297 40.623 34.5751 41.6428 30 41.6428ZM48.7504 33.6573C47.6264 34.9164 46.3689 36.0471 45.0003 37.0289V26.2467L48.7504 24.2284V33.6573ZM44.0628 22.4633L44.0112 22.4325L30.886 15.365C30.448 15.1392 29.9398 15.0961 29.4707 15.245C29.0016 15.3939 28.6092 15.7228 28.3781 16.161C28.1469 16.5991 28.0955 17.1114 28.235 17.5874C28.3744 18.0634 28.6934 18.4651 29.1234 18.706L40.0783 24.607L30 30.0324L5.8589 17.0355L30 4.03859L54.1411 17.0355L44.0628 22.4633Z"
              fill="#85754D"
            />
          </svg>
          <span className="text-2xl md:text-4xl font-encode text-white">
            Login with UWNetID
          </span>
        </button>
      </div>
    </div>
  );
}
