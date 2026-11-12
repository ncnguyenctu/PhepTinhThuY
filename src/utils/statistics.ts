/**
 * Biostatistics Calculator – Utility Functions
 * Các hàm tính toán thống kê sinh học chuẩn xác
 */

// ─── Phân phối chuẩn (Normal Distribution) ───────────────────────────────────

/**
 * Hàm phân phối tích lũy chuẩn tắc – thuật toán xấp xỉ Abramowitz & Stegun
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  const absx = Math.abs(x);
  const t = 1.0 / (1.0 + p * absx);
  const y =
    1.0 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-absx * absx);
  return 0.5 * (1.0 + sign * y);
}

// ─── Phân phối Chi-square ──────────────────────────────────────────────────────

/**
 * Log Gamma (Lanczos approximation)
 */
export function gammaLn(x: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - gammaLn(1 - x);
  let xAdj = x - 1;
  let a = c[0];
  const t = xAdj + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (xAdj + i);
  return 0.5 * Math.log(2 * Math.PI) + (xAdj + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Regularized incomplete gamma function P(a,x) – dùng series hoặc continued fraction
 */
function gammaSeries(a: number, x: number): number {
  const MAX_ITER = 200;
  const EPS = 3e-15;
  let ap = a;
  let sum = 1.0 / a;
  let del = sum;
  for (let n = 1; n <= MAX_ITER; n++) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * EPS) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - gammaLn(a));
}

function gammaCF(a: number, x: number): number {
  const MAX_ITER = 200;
  const EPS = 3e-15;
  const FPMIN = 1e-300;
  let b = x + 1 - a;
  let c = 1 / FPMIN;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= MAX_ITER; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return Math.exp(-x + a * Math.log(x) - gammaLn(a)) * h;
}

function regularizedIncompleteGamma(a: number, x: number): number {
  if (x < 0) return 0;
  if (x === 0) return 0;
  if (x < a + 1) return gammaSeries(a, x);
  return 1 - gammaCF(a, x);
}

/**
 * P-value từ Chi-square và degrees of freedom
 */
export function chiSquarePValue(chi2: number, df: number): number {
  if (chi2 <= 0) return 1;
  if (df <= 0) return NaN;
  return 1 - regularizedIncompleteGamma(df / 2, chi2 / 2);
}

// ─── Tính cỡ mẫu ──────────────────────────────────────────────────────────────

export interface SampleSizeResult {
  n: number;
  Z: number;
  P: number;
  d: number;
  nExact: number;
}

export function calculateSampleSize(
  P: number,
  d: number,
  confidenceLevel: number
): SampleSizeResult {
  const zMap: Record<number, number> = {
    90: 1.645,
    95: 1.96,
    99: 2.576,
  };
  const Z = zMap[confidenceLevel] ?? 1.96;
  const nExact = (Z * Z * P * (1 - P)) / (d * d);
  const n = Math.ceil(nExact);
  return { n, Z, P, d, nExact };
}

// ─── Chi-square & Yates ───────────────────────────────────────────────────────

export interface ContingencyResult {
  observed: number[][];
  expected: number[][];
  rowTotals: number[];
  colTotals: number[];
  grandTotal: number;
  chiSquare: number;
  chiSquareYates?: number;
  df: number;
  pValue: number;
  pValueYates?: number;
  method: string;
  methodNote: string;
  significant: boolean;
  significantYates?: boolean;
  warning?: string;
  recommendation?: string;
  minExpected: number;
  cellsBelowFive: number;
}

export function calculateChiSquare(observed: number[][]): ContingencyResult {
  const rows = observed.length;
  const cols = observed[0].length;

  const rowTotals = observed.map((row) => row.reduce((a, b) => a + b, 0));
  const colTotals = Array(cols)
    .fill(0)
    .map((_, j) => observed.reduce((a, row) => a + row[j], 0));
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  if (grandTotal === 0) throw new Error('Tổng toàn bảng bằng 0. Vui lòng nhập dữ liệu.');

  // Tần số kỳ vọng
  const expected: number[][] = observed.map((row, i) =>
    row.map((_, j) => (rowTotals[i] * colTotals[j]) / grandTotal)
  );

  let minExpected = Infinity;
  let cellsBelowFive = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (expected[i][j] < minExpected) minExpected = expected[i][j];
      if (expected[i][j] < 5) cellsBelowFive++;
    }
  }

  const df = (rows - 1) * (cols - 1);
  const is2x2 = rows === 2 && cols === 2;

  // Pearson Chi-square
  let chiSquare = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (expected[i][j] > 0) {
        const diff = observed[i][j] - expected[i][j];
        chiSquare += (diff * diff) / expected[i][j];
      }
    }
  }

  // Yates correction
  let chiSquareYates: number | undefined;
  let pValueYates: number | undefined;
  let significantYates: boolean | undefined;
  if (is2x2) {
    let yates = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (expected[i][j] > 0) {
          const diff = Math.max(0, Math.abs(observed[i][j] - expected[i][j]) - 0.5);
          yates += (diff * diff) / expected[i][j];
        }
      }
    }
    chiSquareYates = yates;
    pValueYates = chiSquarePValue(yates, df);
    significantYates = pValueYates < 0.05;
  }

  const pValue = chiSquarePValue(chiSquare, df);
  const significant = pValue < 0.05;

  let method = '';
  let methodNote = '';
  let warning: string | undefined;
  let recommendation: string | undefined;

  const totalCells = rows * cols;
  const pctBelowFive = cellsBelowFive / totalCells;

  if (is2x2) {
    if (cellsBelowFive === 0) {
      method = 'Pearson Chi-square';
      methodNote = 'Tất cả tần số kỳ vọng ≥ 5. Sử dụng Chi-square Pearson.';
    } else if (minExpected >= 1) {
      method = 'Chi-square có hiệu chỉnh Yates';
      methodNote =
        'Bảng 2×2 có tần số kỳ vọng < 5. Áp dụng hiệu chỉnh Yates để giảm sai lệch Type I.';
    } else {
      method = "Fisher's Exact Test được khuyến nghị";
      methodNote = 'Tần số kỳ vọng quá nhỏ (< 1). Chi-square không đáng tin cậy.';
      recommendation =
        "Vui lòng chuyển sang sử dụng Fisher's Exact Test để có kết quả chính xác hơn.";
    }
  } else {
    if (cellsBelowFive === 0) {
      method = 'Pearson Chi-square';
      methodNote = 'Tất cả tần số kỳ vọng ≥ 5. Phép kiểm định Chi-square Pearson phù hợp.';
    } else if (pctBelowFive <= 0.2) {
      method = 'Pearson Chi-square (có cảnh báo)';
      methodNote = `Có ${cellsBelowFive}/${totalCells} ô có tần số kỳ vọng < 5 (≤ 20%). Kết quả có thể chấp nhận nhưng cần thận trọng.`;
      warning = `Cảnh báo: ${cellsBelowFive} ô (${(pctBelowFive * 100).toFixed(0)}%) có tần số kỳ vọng < 5. Kết quả Chi-square có thể không hoàn toàn đáng tin cậy.`;
    } else {
      method = 'Pearson Chi-square (không đáng tin cậy)';
      methodNote = `Có ${cellsBelowFive}/${totalCells} ô có tần số kỳ vọng < 5 (> 20%). Kết quả Chi-square có thể không đáng tin cậy.`;
      warning = `Cảnh báo nghiêm trọng: ${cellsBelowFive}/${totalCells} ô có tần số kỳ vọng < 5. Chi-square không đáng tin cậy.`;
      recommendation =
        "Khuyến nghị: Sử dụng phương pháp Monte Carlo hoặc gộp các nhóm có số lượng nhỏ. Cân nhắc dùng Fisher's Exact Test (tab riêng).";
    }
  }

  return {
    observed,
    expected,
    rowTotals,
    colTotals,
    grandTotal,
    chiSquare,
    chiSquareYates,
    df,
    pValue,
    pValueYates,
    method,
    methodNote,
    significant,
    significantYates,
    warning,
    recommendation,
    minExpected,
    cellsBelowFive,
  };
}

// ─── Fisher's Exact Test ──────────────────────────────────────────────────────

export interface FisherResult {
  pValue: number;
  oddsRatio?: number;
  ciLower?: number;
  ciUpper?: number;
  method: string;
  methodNote: string;
  significant: boolean;
}

function logFactorial(n: number): number {
  if (n <= 1) return 0;
  let result = 0;
  for (let i = 2; i <= n; i++) result += Math.log(i);
  return result;
}

function hypergeomProb(a: number, b: number, c: number, d: number): number {
  return Math.exp(
    logFactorial(a + b) +
      logFactorial(c + d) +
      logFactorial(a + c) +
      logFactorial(b + d) -
      logFactorial(a + b + c + d) -
      logFactorial(a) -
      logFactorial(b) -
      logFactorial(c) -
      logFactorial(d)
  );
}

export function fisherExact2x2(table: number[][]): FisherResult {
  const [[a, b], [c, d]] = table;
  const r1 = a + b;
  const r2 = c + d;
  const c1 = a + c;

  const pObs = hypergeomProb(a, b, c, d);

  let pValue = 0;
  const kMin = Math.max(0, c1 - r2);
  const kMax = Math.min(c1, r1);

  for (let k = kMin; k <= kMax; k++) {
    const bk = r1 - k;
    const ck = c1 - k;
    const dk = r2 - ck;
    if (bk < 0 || ck < 0 || dk < 0) continue;
    const p = hypergeomProb(k, bk, ck, dk);
    if (p <= pObs + 1e-10) pValue += p;
  }
  pValue = Math.min(1, pValue);

  let oddsRatio: number | undefined;
  let ciLower: number | undefined;
  let ciUpper: number | undefined;

  if (b === 0 && c === 0) {
    oddsRatio = NaN;
  } else if (b === 0) {
    oddsRatio = Infinity;
  } else if (c === 0) {
    oddsRatio = 0;
  } else {
    oddsRatio = (a * d) / (b * c);
    if (a > 0 && b > 0 && c > 0 && d > 0) {
      const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
      const logOR = Math.log(oddsRatio);
      ciLower = Math.exp(logOR - 1.96 * se);
      ciUpper = Math.exp(logOR + 1.96 * se);
    }
  }

  return {
    pValue,
    oddsRatio,
    ciLower,
    ciUpper,
    method: "Fisher's Exact Test (2×2)",
    methodNote:
      "Phép kiểm định chính xác Fisher dựa trên phân phối siêu bội (hypergeometric distribution), phù hợp cho bảng 2×2, đặc biệt khi tần số kỳ vọng nhỏ.",
    significant: pValue < 0.05,
  };
}

/**
 * Monte Carlo simulation cho bảng m×n
 * Dùng thuật toán Rcont2 (Patefield, 1981) – xáo trộn permutation
 */
export function fisherExactMonteCarlo(
  observed: number[][],
  nSim: number = 50000
): FisherResult {
  const rows = observed.length;
  const cols = observed[0].length;

  const rowTotals = observed.map((row) => row.reduce((a, b) => a + b, 0));
  const colTotals = Array(cols)
    .fill(0)
    .map((_, j) => observed.reduce((a, row) => a + row[j], 0));
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

  const expected = observed.map((row, i) =>
    row.map((_, j) => (rowTotals[i] * colTotals[j]) / grandTotal)
  );

  // Chi-square quan sát
  let chiObs = 0;
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      if (expected[i][j] > 0)
        chiObs += ((observed[i][j] - expected[i][j]) ** 2) / expected[i][j];

  // Tạo "pool" – danh sách nhãn cột cho từng quan sát
  const pool: number[] = [];
  for (let j = 0; j < cols; j++)
    for (let k = 0; k < colTotals[j]; k++)
      pool.push(j);

  function shuffleArr(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  let extreme = 0;
  for (let sim = 0; sim < nSim; sim++) {
    shuffleArr(pool);
    const simMat: number[][] = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
    let idx = 0;
    for (let i = 0; i < rows; i++) {
      for (let k = 0; k < rowTotals[i]; k++) {
        simMat[i][pool[idx++]]++;
      }
    }
    let chiSim = 0;
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        if (expected[i][j] > 0)
          chiSim += ((simMat[i][j] - expected[i][j]) ** 2) / expected[i][j];
    if (chiSim >= chiObs - 1e-10) extreme++;
  }

  const pValue = extreme / nSim;

  return {
    pValue,
    method: "Fisher's Exact Test – Monte Carlo",
    methodNote: `Phương pháp Monte Carlo với ${nSim.toLocaleString('vi-VN')} lần mô phỏng ngẫu nhiên. Phù hợp cho bảng m×n khi Fisher's Exact chính xác không khả thi về mặt tính toán.`,
    significant: pValue < 0.05,
  };
}

export function runFisherTest(observed: number[][]): FisherResult {
  const rows = observed.length;
  const cols = observed[0].length;
  if (rows === 2 && cols === 2) {
    return fisherExact2x2(observed);
  }
  return fisherExactMonteCarlo(observed, 50000);
}

// ─── Định dạng số ─────────────────────────────────────────────────────────────

export function formatPValue(p: number): string {
  if (isNaN(p)) return 'N/A';
  if (p < 0.0001) return '< 0,0001';
  return p.toFixed(4).replace('.', ',');
}

export function formatNumber(n: number, digits = 4): string {
  if (isNaN(n) || !isFinite(n)) return 'N/A';
  return n.toFixed(digits).replace('.', ',');
}
