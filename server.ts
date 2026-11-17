import express from 'express';
import type { Request, Response } from 'express';
import { spawn, execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const PORT = Number(process.env.PORT) || 3000;
const MAX_CODE_BYTES = 50 * 1024;
const MAX_OUTPUT_BYTES = 256 * 1024;
const EXECUTION_TIMEOUT_MS = 4000;
const PASS_MARKER = '__PYSTUDIO_ALL_TESTS_PASSED__';

interface RunPythonBody {
  code?: unknown;
  stdin?: unknown;
  testCode?: unknown;
}

interface RunPythonResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
  passed: boolean | null;
}

function executePythonScript(
  code: string,
  stdinText: string,
  testCode?: string,
): Promise<RunPythonResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pystudio-'));
    const scriptPath = path.join(tmpDir, 'main.py');

    const hasTests = typeof testCode === 'string' && testCode.trim().length > 0;
    const fullScript = hasTests
      ? `${code}\n\n# --- Verification Suite ---\n${testCode}\nprint("${PASS_MARKER}")\n`
      : code;

    try {
      fs.writeFileSync(scriptPath, fullScript, { encoding: 'utf8' });
    } catch (writeErr) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      resolve({
        stdout: '',
        stderr: `無法建立暫存執行檔案：${String(writeErr)}`,
        exitCode: 1,
        durationMs: Math.round(performance.now() - startTime),
        timedOut: false,
        passed: hasTests ? false : null,
      });
      return;
    }

    const child = spawn('python3', ['-I', '-u', scriptPath], {
      cwd: tmpDir,
      env: {
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
        PYTHONIOENCODING: 'utf-8',
        PYTHONDONTWRITEBYTECODE: '1',
        LANG: 'C.UTF-8',
      },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let outputTruncated = false;
    let timedOut = false;
    let settled = false;

    const cleanup = () => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    };

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdout.length + chunk.length <= MAX_OUTPUT_BYTES) {
        stdout += chunk.toString('utf8');
      } else if (!outputTruncated) {
        outputTruncated = true;
        stdout += '\n[輸出超過 256KB 上限，已截斷]';
        child.kill('SIGKILL');
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderr.length + chunk.length <= MAX_OUTPUT_BYTES) {
        stderr += chunk.toString('utf8');
      }
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve({
        stdout,
        stderr: `無法啟動 Python 直譯器：${err.message}`,
        exitCode: 1,
        durationMs: Math.round(performance.now() - startTime),
        timedOut: false,
        passed: hasTests ? false : null,
      });
    });

    child.on('close', (exitCode) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();

      const durationMs = Math.max(1, Math.round(performance.now() - startTime));
      let passed: boolean | null = null;

      if (hasTests) {
        passed = !timedOut && exitCode === 0 && stdout.includes(PASS_MARKER);
        stdout = stdout.replace(new RegExp(`\\r?\\n?${PASS_MARKER}\\r?\\n?`, 'g'), '');
      }

      if (timedOut) {
        stderr = `${stderr ? `${stderr}\n` : ''}執行逾時：程式執行超過 ${EXECUTION_TIMEOUT_MS / 1000} 秒限制（請檢查是否包含無窮迴圈）。`;
      }

      // Sanitize temporary path from tracebacks so output stays clean
      const sanitizedStderr = stderr.split(scriptPath).join('main.py');

      resolve({
        stdout,
        stderr: sanitizedStderr,
        exitCode,
        durationMs,
        timedOut,
        passed,
      });
    });

    if (stdinText) {
      child.stdin.write(stdinText);
    }
    child.stdin.end();
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '128kb' }));

  let cachedPythonVersion = 'Python 3.10';
  try {
    const { stdout } = await execFileAsync('python3', ['--version']);
    if (stdout.trim()) {
      cachedPythonVersion = stdout.trim();
    }
  } catch {
    // Keep default fallback label
  }

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      pythonVersion: cachedPythonVersion,
    });
  });

  app.post('/api/python/run', async (req: Request, res: Response) => {
    const body = (req.body || {}) as RunPythonBody;
    const code = typeof body.code === 'string' ? body.code : '';
    const stdinText = typeof body.stdin === 'string' ? body.stdin : '';
    const testCode = typeof body.testCode === 'string' ? body.testCode : undefined;

    if (!code.trim()) {
      res.status(400).json({
        error: '請先輸入 Python 程式碼再執行。',
      });
      return;
    }

    if (Buffer.byteLength(code, 'utf8') > MAX_CODE_BYTES) {
      res.status(400).json({
        error: '程式碼長度超過 50KB 限制。',
      });
      return;
    }

    const result = await executePythonScript(code, stdinText, testCode);
    res.json(result);
  });

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PyStudio server listening on http://0.0.0.0:${PORT} (${cachedPythonVersion})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
