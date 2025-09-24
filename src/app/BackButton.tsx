'use client';

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="bg-white border-[4px] border-[#0B0B0B] rounded-[16px] px-8 py-4 text-[18px] font-[800] text-[#0B0B0B] uppercase shadow-[6px_6px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-75 rotate-[1deg] hover:rotate-0 w-full sm:w-auto"
    >
      <span className="mr-2">⬅️</span>
      이전 페이지
    </button>
  );
}
