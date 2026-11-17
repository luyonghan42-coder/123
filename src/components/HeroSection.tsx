import { useState } from 'react';
import { ArrowRight, Code2 } from 'lucide-react';

interface HeroSectionProps {
  pythonVersion: string;
  onJumpToSandbox: () => void;
}

const HERO_IMAGE_SRC = '/src/assets/images/hero_python_studio_1794896831350.jpg';

export default function HeroSection({ pythonVersion, onJumpToSandbox }: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-14 lg:py-20">
        {/* 2-Column Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>Python 互動實戰網站</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{pythonVersion}</span>
                <span aria-hidden="true">·</span>
                <span>瀏覽器即時編寫與驗證</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-slate-900 leading-[1.18]"
                style={{ textWrap: 'balance' }}
              >
                用清晰優雅的語法，寫出真正能運作的 Python 程式
              </h1>

              <p className="text-base lg:text-[17px] text-slate-600 leading-relaxed max-w-[60ch]">
                從變數格式化、串列推導式到資料結構與演算法快取。不需要在本機安裝任何環境，直接在網頁中編寫程式碼、執行標準函式庫，並透過即時單元測試驗證每個觀念。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onJumpToSandbox}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <span>進入線上沙盒</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#stdlib"
                className="inline-flex items-center px-5 py-3 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200/80 hover:text-slate-900 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                探索標準函式庫
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[280px] lg:min-h-[380px]">
              {!imageError ? (
                <img
                  src={HERO_IMAGE_SRC}
                  alt="簡約工程工作桌上的筆電顯示藍色與琥珀色數據曲線"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover lg:absolute lg:inset-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 text-slate-600">
                  <Code2 className="w-10 h-10 text-blue-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-900">PyStudio Python 實機執行環境</p>
                  <p className="text-xs text-slate-500 mt-1">支援標準函式庫與單元測試驗證</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">3.10.12</div>
            <div className="text-xs text-slate-500 mt-1">後端實機 Python 直譯器核心</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">6 堂</div>
            <div className="text-xs text-slate-500 mt-1">循序漸進互動實作與驗證關卡</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">6 大模組</div>
            <div className="text-xs text-slate-500 mt-1">內建標準函式庫一鍵載入執行</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">4 秒</div>
            <div className="text-xs text-slate-500 mt-1">隔離暫存沙盒安全執行逾時保護</div>
          </div>
        </div>
      </div>
    </section>
  );
}
