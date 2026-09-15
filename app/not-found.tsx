import Image from "next/image";

export const metadata = {
  title: "wkwk gada mas",
  description: "wkwk gada mas",
};

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen flex flex-col items-center justify-center text-center overflow-hidden select-none bg-black">
      {/* Background: 404troll.jpg full-screen penuh tanpa ada bar hitam */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/404troll.jpg"
          alt="404 Meme Background"
          fill
          priority
          quality={100}
          className="object-cover object-center w-full h-full"
        />
        {/* Overlay tipis agar teks 404 tetap terbaca tegas */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Teks 404 raksasa dan kutipan Hello */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none px-4">
        <h1 className="text-8xl sm:text-9xl md:text-[14rem] lg:text-[18rem] font-serif font-black tracking-tighter text-white leading-none drop-shadow-[0_14px_28px_rgba(0,0,0,0.95)]">
          404
        </h1>

        <h2 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif italic text-white tracking-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)] max-w-4xl">
          Hello, is it me you&apos;re looking for?
        </h2>
      </div>
    </div>
  );
}
