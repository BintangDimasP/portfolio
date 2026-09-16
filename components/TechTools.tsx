"use client";

import React from "react";
import GlassIcons, { type GlassIconsItem } from "@/components/GlassIcons";
import { type TechToolItem } from "@/app/admin/actions";

export const defaultTechItems: GlassIconsItem[] = [
  // Baris 1: HTML, CSS, JS, TypeScript
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" className="w-full h-full object-contain" />,
    color: "#c84318",
    label: "HTML5"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" className="w-full h-full object-contain" />,
    color: "#12619d",
    label: "CSS3"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-full h-full object-contain" />,
    color: "#b8860b",
    label: "JavaScript"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-full h-full object-contain" />,
    color: "#1c5285",
    label: "TypeScript"
  },

  // Baris 2: Next.js, React, Tailwind, React Native
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Next.js" className="w-full h-full object-contain" />,
    color: "#171717",
    label: "Next.js"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" className="w-full h-full object-contain" />,
    color: "#087ea4",
    label: "React"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind CSS" className="w-full h-full object-contain" />,
    color: "#0369a1",
    label: "Tailwind"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" className="w-full h-full object-contain" />,
    color: "#1e5689",
    label: "React Native"
  },

  // Baris 3: Python, PHP, Laravel, MySQL
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" className="w-full h-full object-contain" />,
    color: "#244f77",
    label: "Python"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" className="w-full h-full object-contain" />,
    color: "#4d547f",
    label: "PHP"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" alt="Laravel" className="w-full h-full object-contain" />,
    color: "#c51717",
    label: "Laravel"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" className="w-full h-full object-contain" />,
    color: "#00576e",
    label: "MySQL"
  },

  // Baris 4: VS Code, Git, Postman, Docker
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" className="w-full h-full object-contain" />,
    color: "#005a9e",
    label: "VS Code"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" className="w-full h-full object-contain" />,
    color: "#bf371d",
    label: "Git"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" alt="Postman" className="w-full h-full object-contain" />,
    color: "#c84a1a",
    label: "Postman"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" className="w-full h-full object-contain" />,
    color: "#116199",
    label: "Docker"
  },

  // Baris 5: Jenkins, Figma, Bizagi, Visio
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" alt="Jenkins" className="w-full h-full object-contain" />,
    color: "#9b211d",
    label: "Jenkins"
  },
  {
    icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" className="w-full h-full object-contain" />,
    color: "#6c2bd9",
    label: "Figma"
  },
  {
    icon: <img src="/icons/bizagi.svg" alt="Bizagi" className="w-full h-full object-contain" />,
    color: "#006d96",
    label: "Bizagi"
  },
  {
    icon: <img src="/icons/visio.svg" alt="Visio" className="w-full h-full object-contain" />,
    color: "#23386d",
    label: "Visio"
  }
];

interface TechToolsProps {
  initialTools?: TechToolItem[];
  className?: string;
}

export default function TechTools({ initialTools, className }: TechToolsProps) {
  const items: GlassIconsItem[] =
    initialTools && initialTools.length > 0
      ? initialTools.map((t) => ({
          label: t.label,
          color: t.color,
          icon: (
            <img
              src={t.icon_url}
              alt={t.label}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain"
            />
          ),
        }))
      : defaultTechItems;

  return (
    <div
      className={`flex items-center justify-center text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-[12px] md:text-[13.5px] lg:text-[14.5px] ${
        className || ""
      }`}
    >
      <GlassIcons
        items={items}
        showLabel={true}
        className="w-full justify-items-center"
      />
    </div>
  );
}
