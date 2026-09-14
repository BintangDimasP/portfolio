"use client";

import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    agree: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "", agree: false });
    }, 4000);
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
                {/* Row 1: Name/Company & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Name / Company"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <input
                      id="phone"
                      type="tel"
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
                    type="email"
                    required
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
                    type="text"
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
                    required
                    rows={1}
                    placeholder="Type your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pb-2 bg-transparent border-b border-neutral-800 text-white placeholder-neutral-500 text-[15px] focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                {/* Row 5: Privacy statement agreement */}
                <label className="flex items-center gap-3.5 cursor-pointer select-none text-neutral-400 text-[13.5px] sm:text-[14px]">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="hidden"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center flex-shrink-0 ${
                      formData.agree ? "border-white bg-white" : "border-neutral-600 bg-transparent"
                    }`}
                  >
                    {formData.agree && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </span>
                  <span>
                    I have read and understood the{" "}
                    <span className="underline text-neutral-300 hover:text-white transition-colors">
                      privacy statement
                    </span>
                  </span>
                </label>

                {/* Row 6: Submit Button (Rounded pill white button) */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-9 py-3.5 rounded-2xl bg-white text-black font-semibold text-[15px] hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-md cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Note (Menempel langsung tanpa jarak mengambang) */}
        <div className="pt-8 pb-8 border-t border-neutral-900 w-full text-center text-xs text-neutral-500 ">
          <p>© {new Date().getFullYear()} Bintang Dimas. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}
