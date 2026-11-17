import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Play,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import { LESSONS, SNIPPETS } from '../data/pythonCurriculum';
import type { PythonLesson } from '../data/pythonCurriculum';

export interface ExternalCodeLoad {
  title: string;
  code: string;
  stdin?: string;
  autoRun: boolean;
  nonce: number;
}

interface ExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  passed: boolean | null;
}

interface PythonPlaygroundProps {
  externalLoad: ExternalCodeLoad | null;
  pythonVersion: string;
}

export default function PythonPlayground({ externalLoad, pythonVersion }: PythonPlaygroundProps) {
  const [workspaceMode, setWorkspaceMode] = useState<'curriculum' | 'sandbox'>('curriculum');
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  // Keep per-lesson edited code so switching lessons doesn't discard learner progress
  const [lessonCodes, setLessonCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const lesson of LESSONS) {
      initial[lesson.id] = lesson.starterCode;
    }
    return initial;
  });

  const [sandboxCode, setSandboxCode] = useState<string>(SNIPPETS[0].code);
  const [sandboxTitle, setSandboxTitle] = useState<string>(SNIPPETS[0].label);
  const [stdinText, setStdinText] = useState<string>(SNIPPETS[0].stdin ?? '');
  const [showStdin, setShowStdin] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<ExecutionResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);

  const activeLesson: PythonLesson = useMemo(
    () => LESSONS.find((l) => l.id === activeLessonId) ?? LESSONS[0],
    [activeLessonId],
  );

  const currentCode =
    workspaceMode === 'curriculum'
      ? lessonCodes[activeLesson.id] ?? activeLesson.starterCode
      : sandboxCode;

  const lineCount = useMemo(() => Math.max(1, currentCode.split('\n').length), [currentCode]);

  const setCurrentCode = (nextCode: string) => {
    if (workspaceMode === 'curriculum') {
      setLessonCodes((prev) => ({
        ...prev,
        [activeLesson.id]: nextCode,
      }));
    } else {
      setSandboxCode(nextCode);
    }
  };

  const runPython = async (codeToRun: string, stdinToUse: string, withVerification: boolean) => {
    setIsRunning(true);
    setRequestError(null);

    const testCode =
      withVerification && workspaceMode === 'curriculum' ? activeLesson.testCode : undefined;

    try {
      const response = await fetch('/api/python/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToRun,
          stdin: stdinToUse,
          testCode,
        }),
      });

      const payload = (await response.json()) as ExecutionResponse & { error?: string };

      if (!response.ok) {
        setRequestError(payload.error || '執行請求失敗，請稍後再試。');
        setResult(null);
      } else {
        setResult(payload);
        if (withVerification && payload.passed && workspaceMode === 'curriculum') {
          setCompletedLessons((prev) => ({
            ...prev,
            [activeLesson.id]: true,
          }));
        }
      }
    } catch {
      setRequestError('無法連線至 Python 執行伺服器，請確認服務是否正常運作。');
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  // Handle code loaded externally from the Standard Library Explorer
  useEffect(() => {
    if (!externalLoad) return;
    setWorkspaceMode('sandbox');
    setSandboxCode(externalLoad.code);
    setSandboxTitle(externalLoad.title);
    const nextStdin = externalLoad.stdin ?? '';
    setStdinText(nextStdin);
    setShowStdin(Boolean(nextStdin));
    setResult(null);
    setRequestError(null);

    if (externalLoad.autoRun) {
      void runPython(externalLoad.code, nextStdin, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalLoad]);

  const handleSelectLesson = (lesson: PythonLesson) => {
    setWorkspaceMode('curriculum');
    setActiveLessonId(lesson.id);
    setShowHint(false);
    setResult(null);
    setRequestError(null);
  };

  const handleSelectSnippet = (snippetId: string) => {
    const snippet = SNIPPETS.find((s) => s.id === snippetId);
    if (!snippet) return;
    setWorkspaceMode('sandbox');
    setSandboxCode(snippet.code);
    setSandboxTitle(snippet.label);
    const nextStdin = snippet.stdin ?? '';
    setStdinText(nextStdin);
    setShowStdin(Boolean(nextStdin));
    setResult(null);
    setRequestError(null);
  };

  const handleResetCode = () => {
    if (workspaceMode === 'curriculum') {
      setCurrentCode(activeLesson.starterCode);
    } else {
      const matched = SNIPPETS.find((s) => s.label === sandboxTitle) ?? SNIPPETS[0];
      setCurrentCode(matched.code);
      setStdinText(matched.stdin ?? '');
    }
    setResult(null);
    setRequestError(null);
  };

  const handleLoadSolution = () => {
    if (workspaceMode === 'curriculum') {
      setCurrentCode(activeLesson.solutionCode);
      setResult(null);
      setRequestError(null);
    }
  };

  const handleEditorKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void runPython(currentCode, showStdin ? stdinText : '', false);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = `${currentCode.slice(0, start)}    ${currentCode.slice(end)}`;
      setCurrentCode(updated);

      requestAnimationFrame(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + 4;
          editorRef.current.selectionEnd = start + 4;
        }
      });
    }
  };

  const handleEditorScroll = () => {
    if (editorRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = editorRef.current.scrollTop;
    }
  };

  const completedCount = Object.values(completedLessons).filter(Boolean).length;

  return (
    <section id="curriculum" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200">
      <div id="sandbox" className="max-w-[1280px] mx-auto px-6">
        {/* Section Header + Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>互動實戰教室</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">已完成 {completedCount} / {LESSONS.length} 關</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              課程導引與線上 Python 沙盒
            </h2>
            <p className="text-sm lg:text-base text-slate-600">
              左側選擇主題觀念與實作目標，右側直接撰寫並執行真實 Python 程式碼（支援快捷鍵 Ctrl / Cmd + Enter）。
            </p>
          </div>

          {/* Segmented Control (Workspace Mode Switch) */}
          <div
            role="tablist"
            aria-label="工作區模式"
            className="inline-flex items-center p-1 bg-slate-200/75 rounded-lg self-start md:self-auto shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={workspaceMode === 'curriculum'}
              onClick={() => {
                setWorkspaceMode('curriculum');
                setResult(null);
                setRequestError(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'curriculum'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              課程挑戰（6 單元）
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={workspaceMode === 'sandbox'}
              onClick={() => {
                setWorkspaceMode('sandbox');
                setResult(null);
                setRequestError(null);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                workspaceMode === 'sandbox'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              自由實驗沙盒
            </button>
          </div>
        </div>

        {/* Two-Zone Sandbox Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (Concept & Curriculum Deck - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {workspaceMode === 'curriculum' ? (
              <>
                {/* 6-Stage Lesson Selector */}
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-500 mb-3 px-1">
                    選擇學習單元
                  </div>
                  <div className="space-y-1">
                    {LESSONS.map((lesson) => {
                      const isActive = lesson.id === activeLesson.id;
                      const isDone = Boolean(completedLessons[lesson.id]);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => handleSelectLesson(lesson)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 text-blue-900 border border-blue-200'
                              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`text-xs font-mono tabular-nums shrink-0 ${
                                isActive ? 'text-blue-700 font-semibold' : 'text-slate-400'
                              }`}
                            >
                              {lesson.index}.
                            </span>
                            <span className="text-sm font-medium truncate">{lesson.title}</span>
                          </div>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>通過</span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                              {lesson.level}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Lesson Details & Challenge Prompt */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <span className="font-mono tabular-nums">單元 {activeLesson.index}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeLesson.level}</span>
                        <span aria-hidden="true">·</span>
                        <span>預計 {activeLesson.duration}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{activeLesson.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mt-2">
                        {activeLesson.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-900 mb-2">核心語法重點</div>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {activeLesson.concepts.map((concept) => (
                          <li key={concept} className="flex items-start gap-2">
                            <span className="text-blue-600 font-mono text-xs mt-1 shrink-0">-</span>
                            <span>{concept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-xs font-semibold text-blue-700 mb-1.5">
                        實作任務：{activeLesson.challengeTitle}
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {activeLesson.challengeDescription}
                      </p>
                    </div>
                  </div>

                  {/* Hint & Solution Controls */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setShowHint((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 py-1.5 px-2.5 rounded-md bg-amber-50 hover:bg-amber-100/80 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{showHint ? '隱藏解題提示' : '檢視解題提示'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleLoadSolution}
                        className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-4 py-1.5 px-2 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        載入參考解答
                      </button>
                    </div>

                    {showHint && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        {activeLesson.hint}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Free Sandbox Mode: Quick Snippet Selector */
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex-1 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-1">自由實驗模式</div>
                    <h3 className="text-lg font-bold text-slate-900">快速載入經典範例腳本</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1.5">
                      在自由沙盒中可任意撰寫 Python 3.10 程式與測試標準輸入（stdin），或點選下方精選範例立即執行。
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {SNIPPETS.map((snippet) => {
                      const isCurrent = sandboxTitle === snippet.label;
                      return (
                        <button
                          key={snippet.id}
                          type="button"
                          onClick={() => handleSelectSnippet(snippet.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-colors duration-150 cursor-pointer ${
                            isCurrent
                              ? 'bg-blue-50/70 border-blue-200'
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900">
                              {snippet.label}
                            </span>
                            <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                              {snippet.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {snippet.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  提示：沙盒運行於隔離環境（<code className="font-mono text-slate-700">python3 -I</code>），單次執行上限為 4 秒，支援全套 Python 標準函式庫。
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Interactive Code IDE & Terminal - 7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-mono text-slate-200 font-medium truncate">
                  main.py
                </span>
                <span className="text-slate-600" aria-hidden="true">
                  /
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {workspaceMode === 'curriculum'
                    ? `單元 ${activeLesson.index}：${activeLesson.challengeTitle}`
                    : sandboxTitle}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetCode}
                  title="恢復預設程式碼"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>

                {workspaceMode === 'curriculum' && (
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={() => void runPython(currentCode, showStdin ? stdinText : '', true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRunning ? '驗證中...' : '驗證挑戰'}</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => void runPython(currentCode, showStdin ? stdinText : '', false)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? '執行中...' : '執行程式'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor Area with Line Numbers */}
            <div className="relative flex bg-slate-900 min-h-[340px] max-h-[440px]">
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="w-12 py-4 pr-3 text-right select-none overflow-hidden bg-slate-900/60 border-r border-slate-800/80 font-mono text-xs leading-6 text-slate-500 tabular-nums shrink-0"
              >
                {Array.from({ length: lineCount }, (_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              <textarea
                ref={editorRef}
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                onScroll={handleEditorScroll}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                aria-label="Python 程式碼編輯器"
                className="code-editor ide-scroll flex-1 w-full p-4 bg-transparent text-slate-100 font-mono text-[13px] leading-6 resize-none focus:outline-none overflow-auto whitespace-pre"
              />
            </div>

            {/* Collapsible Standard Input (stdin) Drawer */}
            <div className="border-t border-slate-800 bg-slate-950/60">
              <button
                type="button"
                onClick={() => setShowStdin((prev) => !prev)}
                className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  {showStdin ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  <span>標準輸入（stdin）</span>
                  {stdinText.trim() && !showStdin && (
                    <span className="text-slate-500">· 已填入輸入內容</span>
                  )}
                </span>
                <span className="text-slate-500 font-mono">{pythonVersion}</span>
              </button>

              {showStdin && (
                <div className="px-4 pb-3">
                  <textarea
                    value={stdinText}
                    onChange={(e) => setStdinText(e.target.value)}
                    rows={3}
                    placeholder="輸入要傳給 sys.stdin 或 input() 的資料，每行一筆..."
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            {/* Output Terminal Panel */}
            <div className="border-t border-slate-800 bg-slate-950 flex-1 min-h-[190px] flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>執行輸出</span>
                </div>

                {result && (
                  <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
                    {result.passed === true && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-sans font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>通過所有驗證測試</span>
                      </span>
                    )}
                    {result.passed === false && (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-sans font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>未通過測試驗證</span>
                      </span>
                    )}
                    {result.passed === null && (
                      <span
                        className={`inline-flex items-center gap-1 font-sans font-medium ${
                          result.exitCode === 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {result.exitCode === 0 ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{result.exitCode === 0 ? '執行成功' : '執行失敗'}</span>
                      </span>
                    )}
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{result.durationMs} ms</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">Exit {result.exitCode ?? '-'}</span>
                  </div>
                )}
              </div>

              <div className="p-4 font-mono text-[13px] leading-relaxed overflow-auto ide-scroll flex-1">
                {requestError && (
                  <div className="flex items-start gap-2 text-rose-400">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{requestError}</span>
                  </div>
                )}

                {!requestError && !result && !isRunning && (
                  <div className="text-slate-500 text-xs">
                    點擊右上角「執行程式」或按下 Ctrl / Cmd + Enter，即會由伺服器端 Python 直譯器回傳真實運算結果。
                  </div>
                )}

                {isRunning && (
                  <div className="text-slate-400 text-xs">正在編譯並執行 Python 腳本...</div>
                )}

                {!isRunning && result && (
                  <div className="space-y-3">
                    {result.stdout && (
                      <pre className="text-slate-100 whitespace-pre-wrap break-words">
                        {result.stdout}
                      </pre>
                    )}

                    {result.stderr && (
                      <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/60 text-rose-300">
                        <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-rose-300 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>錯誤追蹤訊息（Stderr）</span>
                        </div>
                        <pre className="whitespace-pre-wrap break-words text-xs leading-5">
                          {result.stderr}
                        </pre>
                      </div>
                    )}

                    {!result.stdout && !result.stderr && (
                      <div className="text-slate-500 text-xs">
                        程式正常結束，未產生標準輸出（可使用 print() 印出結果）。
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
