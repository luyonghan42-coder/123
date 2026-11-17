import { useState } from 'react';
import { ArrowUpRight, Layers, Play } from 'lucide-react';
import { STDLIB_MODULES } from '../data/pythonCurriculum';
import type { StdLibModule } from '../data/pythonCurriculum';

interface EcosystemSectionProps {
  onLoadCodeToSandbox: (title: string, code: string) => void;
}

const DATA_SCIENCE_IMG = '/src/assets/images/ecosystem_data_science_1794896831434.jpg';
const AUTOMATION_IMG = '/src/assets/images/ecosystem_automation_grid_1794896831307.jpg';

export default function EcosystemSection({ onLoadCodeToSandbox }: EcosystemSectionProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(STDLIB_MODULES[0].id);
  const [dsImageErr, setDsImageErr] = useState(false);
  const [autoImageErr, setAutoImageErr] = useState(false);

  const selectedModule: StdLibModule =
    STDLIB_MODULES.find((m) => m.id === selectedModuleId) ?? STDLIB_MODULES[0];

  return (
    <section id="stdlib" className="py-16 lg:py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1280px] mx-auto px-6 space-y-14">
        {/* Section Heading */}
        <div className="max-w-2xl space-y-3">
          <div className="text-xs font-medium text-slate-500">
            應用生態系 · Batteries Included
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            從資料科學到自動化腳本，一應俱全的標準函式庫
          </h2>
          <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
            Python 內建超過兩百個標準模組，無論是數值統計、時間排程、JSON 交換或文字解析，都能直接引入使用。
          </p>
        </div>

        {/* Asymmetric Visual Showcase Bento (col-span-7 + col-span-5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <article className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden border-b border-slate-200">
              {!dsImageErr ? (
                <img
                  src={DATA_SCIENCE_IMG}
                  alt="三維等距統計分佈柱狀圖與平滑趨勢曲線示意圖"
                  referrerPolicy="no-referrer"
                  onError={() => setDsImageErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-blue-50 text-slate-500">
                  <Layers className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-800">數值運算與資料分析</span>
                </div>
              )}
            </div>
            <div className="p-6 lg:p-7 flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1.5">01. 資料科學與量化分析</div>
                <h3 className="text-lg font-bold text-slate-900">
                  簡潔表達統計分佈、向量運算與資料管線
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  結合 <code className="font-mono text-slate-800">statistics</code>、
                  <code className="font-mono text-slate-800">math</code> 與
                  <code className="font-mono text-slate-800">itertools</code>，只需數行程式碼即可完成樣本變異數計算與分位數分析，並無縫銜接 NumPy 與 Pandas 生態圈。
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    onLoadCodeToSandbox(
                      `std: ${STDLIB_MODULES[0].name}`,
                      STDLIB_MODULES[0].code,
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
                >
                  <span>在沙盒測試 statistics 範例</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>

          <article className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden border-b border-slate-200">
              {!autoImageErr ? (
                <img
                  src={AUTOMATION_IMG}
                  alt="精密金屬與藍色幾何模組依序咬合排列"
                  referrerPolicy="no-referrer"
                  onError={() => setAutoImageErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-amber-50 text-slate-500">
                  <Layers className="w-8 h-8 text-amber-600 mb-2" />
                  <span className="text-sm font-semibold text-slate-800">系統自動化與結構化處理</span>
                </div>
              )}
            </div>
            <div className="p-6 lg:p-7 flex-1 flex flex-col justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1.5">02. 後端工程與自動化</div>
                <h3 className="text-lg font-bold text-slate-900">
                  高可讀性的腳本組合與結構化資料交換
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  透過 <code className="font-mono text-slate-800">json</code>、
                  <code className="font-mono text-slate-800">re</code> 與
                  <code className="font-mono text-slate-800">datetime</code> 快速解析伺服器日誌與 API 酬載，建立穩定可維護的自動化工作流。
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    onLoadCodeToSandbox(
                      `std: ${STDLIB_MODULES[5].name}`,
                      STDLIB_MODULES[5].code,
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer whitespace-nowrap"
                >
                  <span>在沙盒測試日誌正規解析</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Interactive Standard Library Explorer */}
        <div className="border border-slate-200 rounded-xl bg-slate-50/70 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">標準函式庫互動探索器</h3>
              <p className="text-sm text-slate-600 mt-1">
                點選模組標籤檢視常用語法，並可一鍵載入上方沙盒即時執行。
              </p>
            </div>

            {/* Interactive Module Tabs */}
            <div
              role="tablist"
              aria-label="標準函式庫模組"
              className="flex flex-wrap items-center gap-1.5"
            >
              {STDLIB_MODULES.map((mod) => {
                const isSelected = mod.id === selectedModule.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setSelectedModuleId(mod.id)}
                    className={`px-3.5 py-2 text-xs font-mono font-medium rounded-lg border transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    {mod.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-start">
            <div className="lg:col-span-5 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-mono">{selectedModule.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedModule.category}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-900">{selectedModule.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">
                  {selectedModule.summary}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-900">常用功能亮點</div>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {selectedModule.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="text-blue-600 font-mono text-xs">-</span>
                      <span className="font-mono text-xs">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  onLoadCodeToSandbox(`std: ${selectedModule.name}`, selectedModule.code)
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>載入至沙盒執行</span>
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>import {selectedModule.name}</span>
                <span>Python 3.10</span>
              </div>
              <pre className="p-4 text-[13px] leading-6 font-mono text-slate-100 overflow-x-auto ide-scroll">
                <code>{selectedModule.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
