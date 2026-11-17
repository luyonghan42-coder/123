import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/pythonCurriculum';

const STYLE_COMPARISON = [
  {
    topic: '字串格式化',
    avoid: '"Hello " + name + ", score: " + str(round(score, 2))',
    pythonic: 'f"Hello {name}, score: {score:.2f}"',
  },
  {
    topic: '走訪索引與元素',
    avoid: 'for i in range(len(items)): print(i, items[i])',
    pythonic: 'for i, item in enumerate(items): print(i, item)',
  },
  {
    topic: '條件篩選建立串列',
    avoid: 'res = []\nfor x in nums:\n    if x > 0: res.append(x * 2)',
    pythonic: 'res = [x * 2 for x in nums if x > 0]',
  },
  {
    topic: '安全關閉檔案資源',
    avoid: 'f = open("data.txt")\ndata = f.read()\nf.close()',
    pythonic: 'with open("data.txt", encoding="utf-8") as f:\n    data = f.read()',
  },
];

export default function GuideAndFaqSection() {
  const [openFaqId, setOpenFaqId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <section id="faq" className="py-16 lg:py-24 bg-slate-50">
      <div className="max-w-[1280px] mx-auto px-6 space-y-16">
        {/* Pythonic Idioms Table */}
        <div className="space-y-6">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-medium text-slate-500">撰寫習慣與 PEP 8</div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              寫出更地道（Pythonic）的程式碼
            </h2>
            <p className="text-sm lg:text-base text-slate-600">
              對照常見初學寫法與 Python 社群推崇的慣用語法，讓程式更精簡、易讀且更不容易出錯。
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-5 w-44">語法場景</th>
                    <th className="py-3.5 px-5">一般冗長寫法</th>
                    <th className="py-3.5 px-5">推薦 Pythonic 寫法</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {STYLE_COMPARISON.map((row) => (
                    <tr key={row.topic} className="align-top">
                      <td className="py-4 px-5 font-medium text-slate-900 whitespace-nowrap">
                        {row.topic}
                      </td>
                      <td className="py-4 px-5">
                        <pre className="font-mono text-xs text-slate-500 whitespace-pre-wrap leading-relaxed">
                          {row.avoid}
                        </pre>
                      </td>
                      <td className="py-4 px-5">
                        <pre className="font-mono text-xs text-blue-700 bg-blue-50/60 border border-blue-100 rounded-lg p-2.5 whitespace-pre-wrap leading-relaxed">
                          {row.pythonic}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4 border-t border-slate-200">
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-medium text-slate-500">技術問答</div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              常見學習疑問與觀念釐清
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              整理開發者在從基礎邁向實戰專案時最常遇到的語法細節與效能考量。
            </p>
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : item.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <span className="text-sm lg:text-base font-semibold text-slate-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 space-y-3">
                      <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                      {item.exampleCode && (
                        <pre className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs leading-6 overflow-x-auto">
                          <code>{item.exampleCode}</code>
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
