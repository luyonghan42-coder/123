interface FooterProps {
  pythonVersion: string;
}

export default function Footer({ pythonVersion }: FooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-base font-bold text-slate-900">PyStudio</div>
          <p className="text-xs text-slate-500">
            Python 互動教學與線上實作平台 · 執行核心 {pythonVersion}
          </p>
        </div>

        <nav aria-label="頁尾導覽" className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
          <a href="#curriculum" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            課程單元
          </a>
          <a href="#sandbox" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            程式沙盒
          </a>
          <a href="#stdlib" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            標準函式庫
          </a>
          <a href="#faq" className="hover:text-slate-900 transition-colors whitespace-nowrap">
            常見問答
          </a>
        </nav>

        <div className="text-xs text-slate-400">
          © 2026 PyStudio. 採用標準 Python 直譯器執行。
        </div>
      </div>
    </footer>
  );
}
