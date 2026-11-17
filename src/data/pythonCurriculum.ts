export interface PythonLesson {
  id: string;
  index: string;
  title: string;
  level: string;
  duration: string;
  summary: string;
  concepts: string[];
  challengeTitle: string;
  challengeDescription: string;
  hint: string;
  starterCode: string;
  solutionCode: string;
  testCode: string;
  defaultStdin?: string;
}

export interface PythonSnippet {
  id: string;
  label: string;
  category: string;
  description: string;
  code: string;
  stdin?: string;
}

export interface StdLibModule {
  id: string;
  name: string;
  title: string;
  category: string;
  summary: string;
  highlights: string[];
  code: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  exampleCode?: string;
}

export const LESSONS: PythonLesson[] = [
  {
    id: 'variables-fstrings',
    index: '01',
    title: '變數、型別與 f-string 格式化',
    level: '基礎入門',
    duration: '5 分鐘',
    summary:
      'Python 採用動態強型別系統，變數無需事先宣告型別，搭配 f-string 可直接將表達式與小數精準度嵌入字串中。',
    concepts: [
      '整數 (int)、浮點數 (float)、字串 (str) 與布林值 (bool)',
      '使用 f"{value:.2f}" 控制浮點數輸出精度',
      '使用 type() 檢查執行期物件型別',
    ],
    challengeTitle: '實作複利計算函式',
    challengeDescription:
      '請完成 compound_amount(principal, rate, years) 函式，回傳四捨五入至小數點後兩位的複利總金額（公式：principal * (1 + rate) ** years）。',
    hint: '使用 round(principal * (1 + rate) ** years, 2) 回傳計算結果。',
    starterCode: `def compound_amount(principal: float, rate: float, years: int) -> float:
    # 請在此實作複利計算並四捨五入至小數點後 2 位
    total = principal
    return round(total, 2)


# 測試輸出
result = compound_amount(100000, 0.05, 10)
print(f"本金 100,000 元、年利率 5%、10 年後總額：{result:,.2f} 元")
`,
    solutionCode: `def compound_amount(principal: float, rate: float, years: int) -> float:
    total = principal * ((1 + rate) ** years)
    return round(total, 2)


result = compound_amount(100000, 0.05, 10)
print(f"本金 100,000 元、年利率 5%、10 年後總額：{result:,.2f} 元")
`,
    testCode: `assert compound_amount(100000, 0.05, 10) == 162889.46, f"預期 162889.46，實際取得 {compound_amount(100000, 0.05, 10)}"
assert compound_amount(50000, 0.03, 5) == 57963.70, f"預期 57963.70，實際取得 {compound_amount(50000, 0.03, 5)}"
print("測試通過：複利計算公式與小數點精度皆符合規格。")`,
  },
  {
    id: 'list-comprehensions',
    index: '02',
    title: '串列推導式與資料篩選',
    level: '核心語法',
    duration: '8 分鐘',
    summary:
      '串列推導式（List Comprehension）是 Python 最具代表性的語法之一，能以單行可讀表達式取代繁瑣的迴圈與 append 呼叫。',
    concepts: [
      '[expr for item in iterable if condition] 語法結構',
      '切片運算（Slicing）如 items[::-1] 與 items[1:4]',
      '搭配 enumerate() 與 zip() 同步走訪索引與多組資料',
    ],
    challengeTitle: '篩選偶數平方值',
    challengeDescription:
      '請完成 even_squares(limit) 函式，接收正整數 limit，回傳 1 到 limit（含）之間所有偶數的平方值串列。',
    hint: '可寫成 [n ** 2 for n in range(1, limit + 1) if n % 2 == 0]。',
    starterCode: `def even_squares(limit: int) -> list[int]:
    # 請使用串列推導式回傳 1..limit 之間所有偶數的平方
    return []


samples = even_squares(10)
print("1 到 10 的偶數平方：", samples)
`,
    solutionCode: `def even_squares(limit: int) -> list[int]:
    return [n ** 2 for n in range(1, limit + 1) if n % 2 == 0]


samples = even_squares(10)
print("1 到 10 的偶數平方：", samples)
`,
    testCode: `assert even_squares(10) == [4, 16, 36, 64, 100], f"測試失敗：取得 {even_squares(10)}"
assert even_squares(1) == [], f"測試失敗：limit=1 應回傳空串列，取得 {even_squares(1)}"
assert even_squares(6) == [4, 16, 36], f"測試失敗：取得 {even_squares(6)}"
print("測試通過：串列推導式篩選結果正確。")`,
  },
  {
    id: 'functions-decorators',
    index: '03',
    title: '函式設計與統計抽象',
    level: '中階進修',
    duration: '10 分鐘',
    summary:
      'Python 將函式視為一級物件（First-Class Citizen），支援型別註記、高階函式、閉包與裝飾器，讓商用邏輯與橫切關注點徹底分離。',
    concepts: [
      '型別提示（Type Hints）提升 IDE 自動完成與可維護性',
      '字典（dict）回傳多欄位結構化資料',
      '使用 *args 與 **kwargs 設計彈性介面',
    ],
    challengeTitle: '建立數列統計摘要函式',
    challengeDescription:
      '請完成 summarize_numbers(nums) 函式，接收非空數字串列，回傳包含 "min"、"max"、"avg"（平均四捨五入至小數點後兩位）三個鍵的字典。',
    hint: '使用內建 min(nums)、max(nums) 與 round(sum(nums) / len(nums), 2)。',
    starterCode: `def summarize_numbers(nums: list[float]) -> dict[str, float]:
    if not nums:
        raise ValueError("串列不可為空")
    # 請補齊 min、max 與 avg 計算
    return {
        "min": 0,
        "max": 0,
        "avg": 0,
    }


metrics = summarize_numbers([18, 24, 31, 19, 27])
print("統計結果：", metrics)
`,
    solutionCode: `def summarize_numbers(nums: list[float]) -> dict[str, float]:
    if not nums:
        raise ValueError("串列不可為空")
    return {
        "min": min(nums),
        "max": max(nums),
        "avg": round(sum(nums) / len(nums), 2),
    }


metrics = summarize_numbers([18, 24, 31, 19, 27])
print("統計結果：", metrics)
`,
    testCode: `res = summarize_numbers([10, 20, 35])
assert res == {"min": 10, "max": 35, "avg": 21.67}, f"預期 {{'min': 10, 'max': 35, 'avg': 21.67}}，實際 {res}"
res2 = summarize_numbers([5, 5, 5])
assert res2 == {"min": 5, "max": 5, "avg": 5.0}, f"測試失敗：{res2}"
print("測試通過：統計摘要字典結構與數值完全正確。")`,
  },
  {
    id: 'dataclasses-oop',
    index: '04',
    title: '物件導向與 Dataclass 模型',
    level: '中階進修',
    duration: '12 分鐘',
    summary:
      '自 Python 3.7 起內建的 @dataclass 裝飾器，能自動產生 __init__、__repr__ 與 __eq__，讓領域模型（Domain Model）撰寫既簡潔又嚴謹。',
    concepts: [
      '使用 @dataclass 定義資料模型與預設欄位',
      '透過實例方法封裝狀態變更與驗證邏輯',
      '利用 __post_init__ 執行建構後的不變量檢查',
    ],
    challengeTitle: '設計 BankAccount 帳戶模型',
    challengeDescription:
      '請完成 BankAccount 的 deposit(amount) 與 withdraw(amount) 方法：存款需大於 0；提款若金額超過餘額須拋出 ValueError。',
    hint: '在 withdraw 中檢查 if amount > self.balance: raise ValueError("餘額不足")。',
    starterCode: `from dataclasses import dataclass

@dataclass
class BankAccount:
    owner: str
    balance: float = 0.0

    def deposit(self, amount: float) -> float:
        if amount <= 0:
            raise ValueError("存款金額必須大於 0")
        # 請更新餘額並回傳最新餘額
        return self.balance

    def withdraw(self, amount: float) -> float:
        if amount <= 0:
            raise ValueError("提款金額必須大於 0")
        # 請檢查餘額是否足夠，不足則拋出 ValueError
        return self.balance


acc = BankAccount(owner="王小明", balance=1000.0)
acc.deposit(500)
print(f"{acc.owner} 目前餘額：{acc.balance:.0f} 元")
`,
    solutionCode: `from dataclasses import dataclass

@dataclass
class BankAccount:
    owner: str
    balance: float = 0.0

    def deposit(self, amount: float) -> float:
        if amount <= 0:
            raise ValueError("存款金額必須大於 0")
        self.balance += amount
        return self.balance

    def withdraw(self, amount: float) -> float:
        if amount <= 0:
            raise ValueError("提款金額必須大於 0")
        if amount > self.balance:
            raise ValueError("餘額不足")
        self.balance -= amount
        return self.balance


acc = BankAccount(owner="王小明", balance=1000.0)
acc.deposit(500)
print(f"{acc.owner} 目前餘額：{acc.balance:.0f} 元")
`,
    testCode: `a = BankAccount("測試戶", 100.0)
assert a.deposit(250.0) == 350.0
assert a.withdraw(150.0) == 200.0
try:
    a.withdraw(500.0)
    assert False, "超額提款應拋出 ValueError"
except ValueError:
    pass
print("測試通過：BankAccount 存提款與異常防護運作正常。")`,
  },
  {
    id: 'stdlib-collections',
    index: '05',
    title: '標準函式庫：詞頻統計與資料清理',
    level: '實務應用',
    duration: '10 分鐘',
    summary:
      'Python 以「Batteries Included（內建電池）」著稱，collections.Counter 與 re 正規表達式無需安裝外部套件即可處理多數文字分析任務。',
    concepts: [
      'collections.Counter 快速計數與 most_common(k)',
      '字串正規化（lower、strip、split）管線',
      '搭配 json.dumps 輸出格式化分析報表',
    ],
    challengeTitle: '實作前 N 大高頻關鍵字分析',
    challengeDescription:
      '請完成 top_keywords(text, n) 函式，將英文句子轉小寫並以空白切分，回傳出現次數前 n 名的 (單字, 次數) 元組串列。',
    hint: '使用 Counter(text.lower().split()).most_common(n)。',
    starterCode: `from collections import Counter

def top_keywords(text: str, n: int = 3) -> list[tuple[str, int]]:
    # 請將 text 轉小寫切分後計算出現頻率並回傳前 n 名
    words = text.lower().split()
    return []


article = "Python is clean Python is fast and Python is expressive"
print("高頻關鍵字：", top_keywords(article, 3))
`,
    solutionCode: `from collections import Counter

def top_keywords(text: str, n: int = 3) -> list[tuple[str, int]]:
    words = text.lower().split()
    return Counter(words).most_common(n)


article = "Python is clean Python is fast and Python is expressive"
print("高頻關鍵字：", top_keywords(article, 3))
`,
    testCode: `sample = "data python code python data python"
res = top_keywords(sample, 2)
assert res == [("python", 3), ("data", 2)], f"預期 [('python', 3), ('data', 2)]，實際 {res}"
print("測試通過：Counter 詞頻排序完全符合預期。")`,
  },
  {
    id: 'algorithms-memoization',
    index: '06',
    title: '演算法實戰：動態規劃與記憶化快取',
    level: '進階架構',
    duration: '12 分鐘',
    summary:
      '純遞迴計算費氏數列具有 O(2^n) 指數級時間複雜度；運用 functools.lru_cache 或迭代式動態規劃，可將效能瞬間優化為 O(n) 線性時間。',
    concepts: [
      '@lru_cache(maxsize=None) 自動快取純函式結果',
      'time.perf_counter() 量測微秒級執行延遲',
      '遞迴轉迭代避免堆疊溢位（Stack Overflow）',
    ],
    challengeTitle: '高速計算第 N 項費氏數列',
    challengeDescription:
      '請完成 fast_fib(n) 函式（n >= 0，fast_fib(0)=0, fast_fib(1)=1），使其能在數毫秒內算出 n=50 的精確結果。',
    hint: '可加上 @lru_cache(maxsize=None) 或使用 a, b = 0, 1 迴圈推進。',
    starterCode: `from functools import lru_cache
import time

# 提示：在此加上快取裝飾器，或改寫為迭代法
def fast_fib(n: int) -> int:
    if n < 2:
        return n
    a, b = 0, 1
    # 請實作快速計算邏輯
    return b


t0 = time.perf_counter()
val = fast_fib(35)
elapsed_ms = (time.perf_counter() - t0) * 1000
print(f"F(35) = {val:,}（耗時 {elapsed_ms:.3f} ms）")
`,
    solutionCode: `from functools import lru_cache
import time

@lru_cache(maxsize=None)
def fast_fib(n: int) -> int:
    if n < 2:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b


t0 = time.perf_counter()
val = fast_fib(35)
elapsed_ms = (time.perf_counter() - t0) * 1000
print(f"F(35) = {val:,}（耗時 {elapsed_ms:.3f} ms）")
`,
    testCode: `assert fast_fib(0) == 0
assert fast_fib(1) == 1
assert fast_fib(10) == 55
assert fast_fib(50) == 12586269025, f"F(50) 應為 12586269025，實際取得 {fast_fib(50)}"
print("測試通過：fast_fib(50) 於線性時間內精確完成。")`,
  },
];

export const SNIPPETS: PythonSnippet[] = [
  {
    id: 'prime-sieve',
    label: '質數篩法',
    category: '演算法',
    description: '埃拉托斯特尼篩法（Sieve of Eratosthenes）找出 100 以內所有質數',
    code: `def sieve_primes(limit: int) -> list[int]:
    is_prime = [True] * (limit + 1)
    is_prime[0:2] = [False, False]
    for p in range(2, int(limit ** 0.5) + 1):
        if is_prime[p]:
            for multiple in range(p * p, limit + 1, p):
                is_prime[multiple] = False
    return [n for n, prime in enumerate(is_prime) if prime]

primes = sieve_primes(100)
print(f"100 以內共有 {len(primes)} 個質數：")
print(primes)
`,
  },
  {
    id: 'monte-carlo-pi',
    label: '蒙地卡羅估 Pi',
    category: '數值模擬',
    description: '以隨機採樣模擬四分之一單位圓面積，逼近圓周率 π',
    code: `import random

random.seed(42)
samples = 50_000
inside = 0

for _ in range(samples):
    x, y = random.random(), random.random()
    if x * x + y * y <= 1.0:
        inside += 1

pi_estimate = 4 * inside / samples
print(f"總採樣點數：{samples:,}")
print(f"落入圓內點數：{inside:,}")
print(f"估算圓周率 π ≈ {pi_estimate:.6f}")
`,
  },
  {
    id: 'pattern-matching',
    label: 'Match 結構比對',
    category: 'Python 3.10',
    description: '展示 Python 3.10 導入的 match / case 結構化模式比對語法',
    code: `def handle_event(event: dict) -> str:
    match event:
        case {"type": "click", "x": x, "y": y}:
            return f"點擊座標 ({x}, {y})"
        case {"type": "keypress", "key": "Enter"}:
            return "確認送出動作"
        case {"type": "keypress", "key": key}:
            return f"按下按鍵：{key}"
        case _:
            return "未定義事件"

events = [
    {"type": "click", "x": 120, "y": 340},
    {"type": "keypress", "key": "Enter"},
    {"type": "keypress", "key": "Escape"},
]

for e in events:
    print(handle_event(e))
`,
  },
  {
    id: 'stdin-parser',
    label: '互動標準輸入',
    category: 'I/O 處理',
    description: '讀取標準輸入（stdin）的多筆成績並計算班級平均與最高分',
    stdin: `92\n85\n78\n96\n88`,
    code: `import sys
import statistics

raw_lines = [line.strip() for line in sys.stdin if line.strip()]
scores = [float(x) for x in raw_lines]

if scores:
    print(f"共讀入 {len(scores)} 筆成績：{scores}")
    print(f"最高分：{max(scores):.1f}")
    print(f"算術平均：{statistics.mean(scores):.2f}")
    print(f"標準差：{statistics.stdev(scores):.2f}")
else:
    print("未接收到任何輸入資料")
`,
  },
];

export const STDLIB_MODULES: StdLibModule[] = [
  {
    id: 'statistics',
    name: 'statistics',
    title: '敘述統計運算',
    category: '數學與分析',
    summary: '內建平均數、中位數、眾數、變異數與標準差計算，免安裝第三方套件即可處理基礎量化分析。',
    highlights: ['mean / median / mode', 'stdev / variance', 'quantiles 分位數切割'],
    code: `import statistics

latencies = [12.4, 15.1, 11.8, 14.2, 42.0, 13.5, 12.9]
print("平均延遲 (ms)：", round(statistics.mean(latencies), 2))
print("中位數延遲 (ms)：", statistics.median(latencies))
print("樣本標準差：", round(statistics.stdev(latencies), 2))
print("四分位數：", [round(q, 2) for q in statistics.quantiles(latencies, n=4)])
`,
  },
  {
    id: 'collections',
    name: 'collections',
    title: '高效能容器型別',
    category: '資料結構',
    summary: '提供 Counter、defaultdict、deque 與 namedtuple，大幅簡化分組聚合與雙向佇列實作。',
    highlights: ['Counter 頻率統計', 'defaultdict 自動初始化', 'deque O(1) 雙端進出'],
    code: `from collections import defaultdict, deque

orders = [("北區", 1200), ("中區", 850), ("北區", 640), ("南區", 980)]
revenue_by_region = defaultdict(int)
for region, amount in orders:
    revenue_by_region[region] += amount

print("各區營收彙總：", dict(revenue_by_region))

recent_logs = deque(maxlen=3)
for i in range(1, 6):
    recent_logs.append(f"LOG-{i:03d}")
print("保留最近 3 筆紀錄：", list(recent_logs))
`,
  },
  {
    id: 'itertools',
    name: 'itertools',
    title: '惰性迭代器工具',
    category: '演算法工具',
    summary: '以零額外記憶體展開排列組合、無限計數器、視窗分組與多序列串接，適合大型串流處理。',
    highlights: ['combinations / permutations', 'accumulate 累積加總', 'groupby 連續分組'],
    code: `import itertools

team = ["Alice", "Bob", "Carol", "David"]
pairs = list(itertools.combinations(team, 2))
print(f"4 人團隊兩兩配對（共 {len(pairs)} 組）：", pairs)

monthly_sales = [120, 150, 180, 210]
cumulative = list(itertools.accumulate(monthly_sales))
print("季度累積業績：", cumulative)
`,
  },
  {
    id: 'datetime',
    name: 'datetime',
    title: '日期時間與時區計算',
    category: '系統核心',
    summary: '精準處理 ISO 8601 格式解析、跨時區轉換（zoneinfo）與時間區間運算。',
    highlights: ['timedelta 日期加減', 'isoformat 標準輸出', 'strptime / strftime 格式化'],
    code: `from datetime import datetime, timedelta, timezone

tz_taipei = timezone(timedelta(hours=8))
now = datetime(2026, 11, 16, 14, 30, tzinfo=tz_taipei)
deadline = now + timedelta(days=14, hours=6)

print("專案啟動時間：", now.isoformat())
print("兩週後截止日：", deadline.strftime("%Y-%m-%d %H:%M (%Z)"))
print("相距秒數：", int((deadline - now).total_seconds()))
`,
  },
  {
    id: 'json',
    name: 'json',
    title: '結構化資料序列化',
    category: '資料交換',
    summary: '原生支援字典、串列與 JSON 字串的雙向轉換，可指定縮排排版與 ensure_ascii=False 保留繁體中文。',
    highlights: ['dumps / loads 雙向轉換', 'ensure_ascii=False 中文友善', 'sort_keys 鍵值排序'],
    code: `import json

payload = {
    "service": "PyStudio",
    "version": "3.10.12",
    "modules": ["statistics", "collections", "json"],
    "active": True,
}

formatted = json.dumps(payload, ensure_ascii=False, indent=2)
print("格式化 JSON：")
print(formatted)
`,
  },
  {
    id: 're',
    name: 're',
    title: '正規表達式比對',
    category: '文字處理',
    summary: '透過宣告式樣式比對提取 Email、日期、日誌欄位或進行高效批次字串替換。',
    highlights: ['re.findall 提取全部符合項', '具名擷取群組 (?P<name>...)', 're.sub 動態替換'],
    code: `import re

log_line = "2026-11-16 10:42:18 [INFO] user=chen_wei latency=18ms status=200"
pattern = r"(?P<date>\\d{4}-\\d{2}-\\d{2}).*user=(?P<user>\\w+) latency=(?P<ms>\\d+)ms"

match = re.search(pattern, log_line)
if match:
    print("解析日誌欄位：", match.groupdict())
`,
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'mutable-default',
    question: '為什麼函式預設參數不建議使用可變物件（例如 def add_item(items=[])）？',
    answer:
      'Python 的函式預設參數只會在「函式定義時」求值一次，而非每次呼叫時重新建立。若使用 list 或 dict 作為預設值，多次呼叫會共用同一個物件參照。正確做法是預設為 None，再於函式內部初始化。',
    exampleCode: `def add_item(value: str, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(value)
    return items`,
  },
  {
    id: 'pep8-naming',
    question: 'PEP 8 規範中，變數、函式、常數與類別的命名慣例是什麼？',
    answer:
      '變數與函式一律採用小寫加底線的 snake_case（如 user_score、calculate_tax）；模組層級常數使用全大寫 UPPER_SNAKE_CASE（如 MAX_RETRIES）；類別名稱則採用大駝峰 PascalCase（如 BankAccount）。',
  },
  {
    id: 'list-vs-generator',
    question: '串列推導式 [x for x in ...] 與產生器表達式 (x for x in ...) 該如何選擇？',
    answer:
      '若需要隨機索引存取、多次重複遍歷或取得 len() 長度，請使用串列推導式；若資料量極大且只需單次循序迭代（例如加總 sum(...) 或篩選第一筆），產生器表達式能逐筆產出元素，幾乎不佔用記憶體。',
    exampleCode: `# 產生器表達式：僅佔用常數級記憶體即可加總百萬筆數字
total = sum(n * n for n in range(1_000_000))`,
  },
  {
    id: 'match-case-310',
    question: 'Python 3.10 之後新增的 match / case 與傳統 if / elif 有何差異？',
    answer:
      '結構化模式比對（Structural Pattern Matching）不僅能比對值，還能在比對同時「解構」字典欄位、串列長度與物件屬性，並將提取出的子結構直接綁定至區域變數，大幅提升解析 API Payload 或 AST 的清晰度。',
  },
];
