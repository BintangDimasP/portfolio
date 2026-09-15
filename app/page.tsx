import { Playfair_Display } from "next/font/google";
import LightRays from "@/components/LightRays";
import TiltedCard from "@/components/TiltedCard";
import SpecularButton from "@/components/SpecularButton";
import { cn } from "@/lib/utils";

import TechTools from "@/components/TechTools";
import WorkExperience from "@/components/WorkExperience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import ScrollBlurSection from "@/components/ScrollBlurSection";
import { ArrowRight } from "lucide-react";
import { getProjects, getExperiences, getProfile, getTechTools } from "@/app/admin/actions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [projects, experiences, profile, techTools] = await Promise.all([
    getProjects(),
    getExperiences(),
    getProfile(),
    getTechTools(),
  ]);
  return (
    <div className="w-full">
      <ScrollBlurSection id="home">
        <section 
          className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden bg-black"
        >
          {/* Background LightRays Animation */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.3}
            lightSpread={0.5}
            rayLength={1.5}
            followMouse={true}
            mouseInfluence={0}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={0.7}
            saturation={0.5}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-[20px] md:text-[30px] font-bold leading-none mb-3 text-white">
            {profile.greeting || "Hello, I'm"}
          </h2>
          <h1 className="text-[50px] md:text-[80px] font-bold leading-none mb-6 text-white tracking-tight">
            {profile.name || "Bintang Dimas"}
          </h1>
          <p className="text-[12px] md:text-[20px] font-normal text-neutral-300 mb-8 md:mb-10">
            {profile.tagline || "Web Developer • UI/UX Designer • Graphic Designer • System Analyst"}
          </p>

          {/* Button: Get to Know me */}
          <a
            href="#about"
            className="group inline-flex items-center gap-3.5 sm:gap-4 pl-6 sm:pl-7 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full bg-[#ECECEC] text-black font-sans font-medium text-[14px] sm:text-[15px] shadow-md cursor-pointer select-none"
          >
            <span className="tracking-tight">Get to Know me</span>
            <span className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full bg-black shadow-md group-hover:bg-neutral-800 group-hover:scale-110 group-hover:shadow-xl group-active:scale-95 transition-all duration-300 ease-out origin-center" />
              <ArrowRight className="relative z-10 w-4 h-4 text-[#F5F5F0] stroke-[2] pointer-events-none" />
            </span>
          </a>
        </div>
      </section>
    </ScrollBlurSection>

    <ScrollBlurSection id="about">
      <section 
        className="relative w-full py-24 px-6 md:px-16 bg-[#F8F9FA] text-black rounded-t-[80px] rounded-b-[40px] shadow-2xl overflow-hidden z-10"
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0",
            "[background-size:24px_24px]",
            "[background-image:radial-gradient(#d4d4d4_1.2px,transparent_1.2px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-[#F8F9FA] [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black)] opacity-80" />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-center gap-16">
          <h2 className="text-center text-[24px] md:text-[34px] font-bold text-black mb-2 flex items-baseline justify-center">
            <span className={`${playfair.className} text-[42px] md:text-[62px] font-semibold italic mr-0.5 leading-none select-none`}>
              Persona
            </span>
            
          </h2> 
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
            
            <div className="shrink-0 flex items-center justify-center">
              <TiltedCard
                imageSrc={profile.avatar_url || "/me.jpg"}
                altText={profile.name || "Bintang Dimas"}
                containerHeight="320px"
                containerWidth="280px"
                imageHeight="320px"
                imageWidth="280px"
                imageScale={1.0}
                imagePosition="top"
                objectFit="cover"
                rotateAmplitude={12}
                scaleOnHover={1.05}
                showMobileWarning={false}
                showTooltip={true}
              />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] md:text-[17px] font-normal leading-relaxed text-justify mb-6 text-neutral-700 whitespace-pre-line">
                {profile.about_text}
              </p>

              
              <div className="flex items-center justify-center md:justify-start gap-3 mb-5">
                {profile.github_url && (
                  <a
                    href={profile.github_url.startsWith("http") ? profile.github_url : `https://${profile.github_url.replace(/^\/+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-neutral-800 hover:scale-110 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300 ease-out cursor-pointer"
                    title="GitHub"
                    aria-label="GitHub Profile"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                )}

                {profile.linkedin_url && (
                  <a
                    href={profile.linkedin_url.startsWith("http") ? profile.linkedin_url : `https://${profile.linkedin_url.replace(/^\/+/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md hover:bg-neutral-800 hover:scale-110 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 transition-all duration-300 ease-out cursor-pointer"
                    title="LinkedIn"
                    aria-label="LinkedIn Profile"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>

              
              <div className="flex justify-center md:justify-start">
                <a 
                  href={profile.cv_url || "/cv.pdf"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <SpecularButton
                    size="md"
                    radius={18}
                    tint="#ffffff"
                    tintOpacity={1}
                    blur={0}
                    textColor="#000000"
                    lineColor="#000000"
                    baseColor="#d4d4d8"
                    intensity={1}
                    shineSize={10}
                    shineFade={40}
                    thickness={1}
                    speed={1.5}
                    followMouse={false}
                    proximity={250}
                    autoAnimate
                    className="bg-white hover:bg-neutral-50 shadow-md hover:shadow-xl hover:scale-[1.03] hover:-translate-y-0.5 border border-neutral-200/60 font-semibold transition-all duration-300 ease-out"
                  >
                    Preview CV
                  </SpecularButton>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            
            <div className="flex flex-col">
              
              <div className="w-full flex flex-col">
                <h2 className="text-[25px] text-center md:text-center font-bold mb-4 text-black">Education & Skills</h2>
                <div className="w-full flex flex-col gap-3.5 p-6 sm:p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 shadow-md hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 hover:border-neutral-300 transition-all duration-300 ease-out cursor-default">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-[18px] sm:text-[20px] text-black">
                      {profile.education_school || "Telkom University Surabaya"}
                    </h3>
                    <span className="shrink-0 text-[11px] font-extrabold px-3 py-1 rounded-full bg-black text-white uppercase tracking-wider shadow-sm">
                      {profile.education_period || "2020 - 2024"}
                    </span>
                  </div>
                  <p className="text-[16px] sm:text-[17px] font-normal text-neutral-700">
                    {profile.education_degree || "Bachelor Degree of Information System"}
                  </p>
                  <p className="text-[16px] sm:text-[17px] font-normal text-neutral-700">
                    GPA : {profile.education_gpa || "3.89 / 4.00"}
                  </p>
                  
                  <div className="mt-1">
                    <h4 className="font-semibold text-[15px] sm:text-[16px] text-neutral-900 mb-2">Hard Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(profile.hard_skills && profile.hard_skills.length > 0
                        ? profile.hard_skills
                        : [
                            "Fullstack Developer",
                            "Graphic Design",
                            "UI/UX Design",
                            "Web Development",
                            "Data Entry",
                            "IT System Analyst",
                            "IT Support",
                          ]
                      ).map((skill) => (
                        <span
                          key={skill}
                          className="text-[12.5px] sm:text-[13px] font-medium px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-sm hover:scale-105 hover:bg-neutral-900 hover:text-white hover:border-black hover:shadow-md transition-all duration-200 ease-out cursor-pointer select-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-1">
                    <h4 className="font-semibold text-[15px] sm:text-[16px] text-neutral-900 mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {(profile.soft_skills && profile.soft_skills.length > 0
                        ? profile.soft_skills
                        : [
                            "Problem Solving",
                            "Teamwork & Collaboration",
                            "Time Management",
                            "Critical Thinking",
                            "Communication",
                            "Adaptability",
                          ]
                      ).map((skill) => (
                        <span
                          key={skill}
                          className="text-[12.5px] sm:text-[13px] font-medium px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 shadow-sm hover:scale-105 hover:bg-neutral-900 hover:text-white hover:border-black hover:shadow-md transition-all duration-200 ease-out cursor-pointer select-none"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-[25px] text-center md:text-center font-bold mb-4 text-black">Tech & Tools</h2>
              <TechTools initialTools={techTools} />
            </div>
          </div>
        </div>
      </section>
    </ScrollBlurSection>

    <ScrollBlurSection>
      <WorkExperience initialExperiences={experiences} />
    </ScrollBlurSection>

    <ScrollBlurSection>
      <Projects initialProjects={projects} />
    </ScrollBlurSection>

    <ScrollBlurSection>
      <Contact />
    </ScrollBlurSection>
  </div>
);
}
