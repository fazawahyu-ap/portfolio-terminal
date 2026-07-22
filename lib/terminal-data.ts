export const COMMAND_LIST = [
  "help",
  "whoami",
  "projects",
  "experience",
  "certifications",
  "socials",
  "media",
  "clear",
] as const;

export type CommandName = (typeof COMMAND_LIST)[number];

export const BIO = 
  "Saya Faza Wahyu Adi Putra. Mahasiswa Aktif Teknik Informatika. Memiliki Pengalaman Kerja di PT. Putra Mulia Telecommunication dalam divisi Preventive Maintenance Tower Provider & Pemeliharaan Infrastruktur Jaringan.";

export const PROJECTS = [
  {
    name: "curator-vault",
    description:
      "Personal web development project built with Next.js — a curated space for organizing and showcasing work.",
    stack: "Next.js, React, Tailwind CSS",
  },
  {
    name: "SportSpace",
    description:
      "Digital venture platform designed as a marketplace and scheduling app for sports facilities.",
    stack: "Full-stack web platform (React.js & Firebase)",
    url: "https://sportspaceid.vercel.app/"
  },
  {
    name: "Faza Dev Portfolio",
    description:
      "Personal web portfolio v1 built to showcase fundamental web development skills.",
    stack: "Web Development(Python Django)",
    url: "https://faza-dev.vercel.app/"
  }
];

export const EXPERIENCE = [
  {
    company: "PT. Putra Telecommunication",
    period: "Agustus - Nov 2023",
    role: "Preventive Maintenance & Troubleshooting Jaringan."
  },
  {
    company: "CV. Arjuna Jaya Sakti",
    period: "Maret - Juli 2023",
    role: "Maintenance CCTV, Jaringan & IT Support."
  }
];

export const CERTIFICATIONS = [
  "Belajar Dasar Cloud dan Gen AI di AWS (Dicoding Indonesia)",
  "Foundations of AI and Machine Learning (Microsoft)",
  "Foundations: Data, Data, Everywhere (Google)",
  "Foundations of Cybersecurity (Google)"
];

export const SOCIALS = [
  { label: "LinkedIn", value: "faza-wap", url: "https://www.linkedin.com/in/faza-wap/" },
  { label: "GitHub", value: "fazawahyu-ap", url: "https://github.com/fazawahyu-ap" },
  { label: "Email", value: "fazawahyu10@gmail.com", url: "mailto:fazawahyu10@gmail.com" },
  { label: "Certifications", value: "See All Certifications", url: "https://drive.google.com/drive/folders/1Zah1VfcO4CHtFoAsclDLXG5zsPInj3LA" },

];

export const MEDIA = [
  { label: "Spotify", value: "Currently on repeat: your favorite playlist", url: "https://open.spotify.com/user/yourprofile" },
  { label: "Letterboxd", value: "Recently watched & rated films", url: "https://letterboxd.com/yourprofile" },
];