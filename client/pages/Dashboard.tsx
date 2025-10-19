import Sidebar from "@/components/dashboard/Sidebar";

const stats = [
  {
    title: "Interviews Scheduled",
    value: "89",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/24ca280599b1361bae75fb31ac1f29ff98b238c7?width=240",
    bgColor: "bg-husky-green",
  },
  {
    title: "Applications Sent",
    value: "45",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/c1ad262c022aa68b6b0007595ee3661b5a4aa83e?width=218",
    bgColor: "bg-husky-cyan",
  },
  {
    title: "Profile Viewed",
    value: "25",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/db4dff301c4cbde60c283e0873aea5b4f1a887ad?width=224",
    bgColor: "bg-husky-accent-purple",
  },
];

const jobCards = [
  "https://api.builder.io/api/v1/image/assets/TEMP/f0db36fb6979d9054c3a75727c917cbcd49cdf49?width=528",
  "https://api.builder.io/api/v1/image/assets/TEMP/e4caa8ef5480a3a0abeb100bda96e2e301ce67da?width=550",
  "https://api.builder.io/api/v1/image/assets/TEMP/d63b2600ae8bc28be81ad0745ae3bbdca0f0228f?width=508",
  "https://api.builder.io/api/v1/image/assets/TEMP/2d939b44faf9e875442e5bc12f2149abc5b10efa?width=538",
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`${stat.bgColor} rounded-3xl p-4 md:p-6 flex flex-col items-center justify-center text-white relative overflow-hidden min-h-[160px] md:min-h-[184px]`}
            >
              <h3 className="text-base md:text-xl font-kavoon text-center mb-2 md:mb-3">
                {stat.title}
              </h3>
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src={stat.icon}
                  alt={stat.title}
                  className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                />
                <span className="text-4xl md:text-5xl lg:text-6xl font-kavoon">
                  {stat.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-[rgba(31,27,27,0.91)] rounded-3xl p-4 md:p-6 flex flex-col items-center text-white">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/fd1f629486707aaf87ec2ce54684a45bdbdd7aec?width=182"
              alt="Profile"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-3 md:mb-4"
            />
            <div className="w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 flex items-center justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/33140bc9bf640f10a3723a326b4d4805e3484aab?width=184"
                alt="Progress"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl md:text-3xl font-kavoon text-center">Goals Achieved</h3>
          </div>

          <div className="bg-transparent rounded-3xl overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/ad7cfce562f5e8015048ae9a5ef1427aef16090a?width=1618"
              alt="Vacancy Stats Chart"
              className="w-full h-auto object-contain rounded-3xl"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-4 text-center">
              <span className="text-white text-sm md:text-base lg:text-xl font-kavoon">Vacancy Stats</span>
              <span className="text-white text-sm md:text-base lg:text-xl font-kavoon">Applications Sent</span>
              <span className="text-white text-sm md:text-base lg:text-xl font-kavoon">Interviews</span>
              <span className="text-white text-sm md:text-base lg:text-xl font-kavoon">Rejected</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-white text-xl md:text-2xl font-kavoon mb-4 md:mb-6 text-center md:text-left">
            Recommended Jobs and Scholarships
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {jobCards.map((card, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={card}
                  alt={`Opportunity ${index + 1}`}
                  className="w-full h-auto object-cover rounded-3xl"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
