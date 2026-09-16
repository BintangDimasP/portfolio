"use client";

import React, { useState } from "react";
import { submitContactMessage } from "@/app/admin/actions";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append(
      "subject",
      formData.phone
        ? `${formData.subject || "Pesan Baru"} (Tel: ${formData.phone})`
        : formData.subject || "Pesan Baru"
    );
    fd.append("message", formData.message);
    fd.append("company_website_verify", honeypot);

    try {
      const res = await submitContactMessage(fd);
      if (res?.error) {
        alert(res.error);
      } else {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
          setHoneypot("");
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      // Fallback optimistic success
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full pt-20 pb-0 px-6 md:px-16 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col justify-between">
        
        {/* 2-Column Grid: Kiri (Let's get in touch), Kanan (Contact Us Form - ReactBits Pro Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start mb-24">
          
          {/* KOLOM KIRI: Judul & Detail Kontak */}
          <div className="flex flex-col">
            <h2 className="text-[58px] sm:text-[72px] lg:text-[84px] font-black tracking-tight mb-12 lg:mb-14 text-white leading-[0.95]">
              Let&apos;s get<br />in touch
            </h2>

            {/* List Detail Kontak */}
            <div className="flex flex-col gap-8">
              {/* Phone */}
              <div>
                <span className="block text-[14px] text-neutral-400 font-normal mb-1">
                  Phone
                </span>
                <a
                  href="https://wa.me/6281540032222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] sm:text-[17px] font-normal text-white hover:underline transition-all"
                >
                  +62 815-4003-2222
                </a>
              </div>

              {/* Email */}
              <div>
                <span className="block text-[14px] text-neutral-400 font-normal mb-1">
                  Email
                </span>
                <a
                  href="mailto:bintangdimss@gmail.com"
                  className="text-[16px] sm:text-[17px] font-normal text-white hover:underline transition-all"
                >
                  bintangdimss@gmail.com
                </a>
              </div>

              {/* Location */}
              <div>
                <span className="block text-[14px] text-neutral-400 font-normal mb-1">
                  Location
                </span>
                <p className="text-[15px] sm:text-[16px] font-normal text-white leading-relaxed">
                  Surabaya, East Java, Indonesia<br />
                  <span className="text-neutral-400 text-[13px]">Available for Remote / Hybrid / On-site / Freelance</span>
                </p>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Form Contact Us (ReactBits Pro Style - Borderless) */}
          <div className="flex flex-col w-full">
            <h3 className="text-[44px] sm:text-[54px] font-bold text-white tracking-tight mb-12 leading-none">
              Contact Me
            </h3>

            {isSubmitted ? (
              <div className="py-16 flex flex-col items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-white">Thank You! Message Sent.</h4>
                <p className="text-sm text-neutral-400 max-w-sm">
                  I&apos;ve received your message and will respond to your email as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-11 w-full">
                {/* Honeypot field (anti-bot trap: hidden completely from humans) */}
                <div
                  className="opacity-0 absolute -z-50 pointer-events-none select-none h-0 w-0 overflow-hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <label htmlFor="company_website_verify">Do not fill this field</label>
                  <input
                    id="company_website_verify"
                    name="company_website_verify"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {/* Row 1: Name/Company & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Name / Company"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={30}
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email */}
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={120}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Row 3: Subject */}
                <div>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    autoComplete="off"
                    maxLength={200}
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                {/* Row 4: Message */}
                <div>
                  <textarea
                    id="message"
                    name="message"
                    autoComplete="off"
                    required
                    maxLength={3000}
                    rows={1}
                    placeholder="Type your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Submit Button (Rounded pill white button) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-9 py-3.5 rounded-2xl bg-white text-black font-semibold text-[15px] hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Note (Menempel langsung tanpa jarak mengambang) */}
        <div className="pt-8 pb-8 border-t border-neutral-900 w-full text-center text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Bintang Dimas. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
