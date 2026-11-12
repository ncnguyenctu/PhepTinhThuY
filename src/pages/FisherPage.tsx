import { useState, useCallback } from 'react';
import {
  FlaskConical, RefreshCw, Plus, Minus, Play,
  CheckCircle, XCircle, AlertTriangle, Info, Copy
} from 'lucide-react';
import { runFisherTest, formatPValue, formatNumber } from '../utils/statistics';
import type { FisherResult } from '../utils/statistics';

const MIN_ROWS = 2;
const MAX_ROWS = 10;
const MIN_COLS = 2;
const MAX_COLS = 10;

function makeEmptyTable(rows: number, cols: number): string[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(''));
}

export default function FisherPage() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [table, setTable] = useState<string[][]>(makeEmptyTable(2, 2));
  const [rowLabels, setRowLabels] = useState(['Dương tính', 'Âm tính']);
  const [colLabels, setColLabels] = useState(['Nhóm 1', 'Nhóm 2']);
  const [result, setResult] = useState<FisherResult | null>(null);
  const [error, setError] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const updateCell = (r: number, c: number, val: string) => {
    if (val !== '' && !/^\d+$/.test(val)) return;
    const next = table.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c ? val : cell))
    );
    setTable(next);
    setResult(null);
    setError('');
  };

  const addRow = () => {
    if (rows >= MAX_ROWS) return;
    setRows(rows + 1);
    setTable([...table, Array(cols).fill('')]);
    setRowLabels([...rowLabels, `Trường hợp ${rows + 1}`]);
    setResult(null);
  };
  const removeRow = () => {
    if (rows <= MIN_ROWS) return;
    setRows(rows - 1);
    setTable(table.slice(0, -1));
    setRowLabels(rowLabels.slice(0, -1));
    setResult(null);
  };
  const addCol = () => {
    if (cols >= MAX_COLS) return;
    setCols(cols + 1);
    setTable(table.map((row) => [...row, '']));
    setColLabels([...colLabels, `Nghiệm thức ${cols + 1}`]);
    setResult(null);
  };
  const removeCol = () => {
    if (cols <= MIN_COLS) return;
    setCols(cols - 1);
    setTable(table.map((row) => row.slice(0, -1)));
    setColLabels(colLabels.slice(0, -1));
    setResult(null);
  };

  const handleReset = () => {
    setRows(2); setCols(2);
    setTable(makeEmptyTable(2, 2));
    setRowLabels(['Dương tính', 'Âm tính']);
    setColLabels(['Nhóm 1', 'Nhóm 2']);
    setResult(null); setError('');
  };

  const handleCalculate = useCallback(async () => {
    // Parse table
    const parsed: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        const val = table[r][c].trim();
        if (val === '') {
          setError(`Ô [${rowLabels[r]}, ${colLabels[c]}] chưa được nhập. Vui lòng nhập 0 nếu không có quan sát.`);
          return;
        }
        const n = parseInt(val, 10);
        if (isNaN(n) || n < 0) {
          setError(`Ô [${rowLabels[r]}, ${colLabels[c]}] phải là số nguyên không âm.`);
          return;
        }
        row.push(n);
      }
      parsed.push(row);
    }

    const grandTotal = parsed.flat().reduce((a, b) => a + b, 0);
    if (grandTotal === 0) {
      setError('Tổng toàn bảng bằng 0. Vui lòng nhập dữ liệu.');
      return;
    }

    // Check for zero margins
    const rowTotals = parsed.map((r) => r.reduce((a, b) => a + b, 0));
    const colTotals = Array(cols).fill(0).map((_, j) => parsed.reduce((a, r) => a + r[j], 0));
    for (let r = 0; r < rows; r++) {
      if (rowTotals[r] === 0) {
        setError(`Hàng "${rowLabels[r]}" có tổng bằng 0. Vui lòng kiểm tra lại dữ liệu.`);
        return;
      }
    }
    for (let c = 0; c < cols; c++) {
      if (colTotals[c] === 0) {
        setError(`Cột "${colLabels[c]}" có tổng bằng 0. Vui lòng kiểm tra lại dữ liệu.`);
        return;
      }
    }

    setError('');
    setCalculating(true);

    // Monte Carlo takes time – defer to allow UI update
    await new Promise((r) => setTimeout(r, 20));
    try {
      const res = runFisherTest(parsed);
      setResult(res);
      setAnimKey((k) => k + 1);
    } catch (e: unknown) {
      setError('Đã xảy ra lỗi khi tính toán: ' + (e instanceof Error ? e.message : String(e)));
    }
    setCalculating(false);
  }, [table, rows, cols, rowLabels, colLabels]);

  const handleCopy = () => {
    if (!result) return;
    const lines = [
      "Kết quả Fisher's Exact Test",
      `Phương pháp: ${result.method}`,
      `P-value: ${formatPValue(result.pValue)}`,
      result.oddsRatio !== undefined
        ? `Odds Ratio: ${typeof result.oddsRatio === 'number' && !isNaN(result.oddsRatio) && isFinite(result.oddsRatio) ? formatNumber(result.oddsRatio) : result.oddsRatio?.toString() ?? 'N/A'}`
        : '',
      result.ciLower !== undefined && result.ciUpper !== undefined
        ? `KTC 95%: [${formatNumber(result.ciLower)}, ${formatNumber(result.ciUpper)}]`
        : '',
      result.significant
        ? 'Kết quả: Có sự khác biệt có ý nghĩa thống kê (P < 0,05).'
        : 'Kết quả: Không có sự khác biệt có ý nghĩa thống kê.',
    ]
      .filter(Boolean)
      .join('\n');
    navigator.clipboard.writeText(lines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const is2x2 = rows === 2 && cols === 2;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center rounded-xl w-12 h-12"
            style={{ background: 'linear-gradient(135deg, #0891b2 0%, #00afef 100%)' }}
          >
            <FlaskConical size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0891b2' }}>
              Fisher's Exact Test
            </h1>
            <p className="text-sm text-gray-500">Kiểm định chính xác Fisher – Bảng m×n</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Phép kiểm định chính xác dựa trên phân phối siêu bội. Hỗ trợ bảng 2×2 (exact) và bảng m×n (Monte Carlo).
        </p>
      </div>

      {/* Table controls */}
      <div className="card mb-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="section-title mb-0 mr-auto">Bảng dữ liệu ({rows}×{cols})</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={addRow} disabled={rows >= MAX_ROWS} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">
              <Plus size={13} /> Thêm trường hợp
            </button>
            <button onClick={removeRow} disabled={rows <= MIN_ROWS} className="btn-danger text-xs px-3 py-1.5 disabled:opacity-40">
              <Minus size={13} /> Xóa trường hợp
            </button>
            <button onClick={addCol} disabled={cols >= MAX_COLS} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">
              <Plus size={13} /> Thêm nghiệm thức
            </button>
            <button onClick={removeCol} disabled={cols <= MIN_COLS} className="btn-danger text-xs px-3 py-1.5 disabled:opacity-40">
              <Minus size={13} /> Xóa nghiệm thức
            </button>
          </div>
        </div>

        {/* Info banner */}
        {!is2x2 && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl mb-4 text-xs"
            style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#92400e' }}
          >
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              Bảng {rows}×{cols}: Sẽ sử dụng phương pháp <strong>Monte Carlo</strong> (50.000 lần mô phỏng). Quá trình có thể mất vài giây.
            </span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th
                  className="px-3 py-2 text-left rounded-tl-xl"
                  style={{ background: '#f0f7ff', color: '#1f5ca9', minWidth: 120 }}
                >
                  Trường hợp / Nghiệm thức
                </th>
                {Array(cols).fill(0).map((_, c) => (
                  <th
                    key={c}
                    className="px-2 py-2 text-center"
                    style={{ background: '#f0f7ff', color: '#1f5ca9', minWidth: 90 }}
                  >
                    <input
                      className="text-center font-semibold text-xs w-full bg-transparent border-none outline-none"
                      style={{ color: '#1f5ca9' }}
                      value={colLabels[c]}
                      onChange={(e) => {
                        const nl = [...colLabels]; nl[c] = e.target.value; setColLabels(nl);
                      }}
                    />
                  </th>
                ))}
                <th
                  className="px-3 py-2 text-center rounded-tr-xl"
                  style={{ background: '#f0f7ff', color: '#1f5ca9' }}
                >
                  Tổng
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(rows).fill(0).map((_, r) => {
                const rowSum = Array(cols).fill(0).reduce((acc, _, c) => {
                  const v = parseInt(table[r][c], 10);
                  return acc + (isNaN(v) ? 0 : v);
                }, 0);
                return (
                  <tr key={r} style={{ background: r % 2 === 0 ? '#f8fbff' : '#fff' }}>
                    <td className="px-2 py-2">
                      <input
                        className="text-xs font-medium w-full bg-transparent border-none outline-none"
                        style={{ color: '#4a6fa5' }}
                        value={rowLabels[r]}
                        onChange={(e) => {
                          const nl = [...rowLabels]; nl[r] = e.target.value; setRowLabels(nl);
                        }}
                      />
                    </td>
                    {Array(cols).fill(0).map((_, c) => (
                      <td key={c} className="px-2 py-2 text-center">
                        <input
                          type="text"
                          inputMode="numeric"
                          className="table-cell-input"
                          value={table[r][c]}
                          onChange={(e) => updateCell(r, c, e.target.value)}
                          onFocus={(e) => e.target.select()}
                        />
                      </td>
                    ))}
                    <td
                      className="px-3 py-2 text-center font-bold text-sm"
                      style={{ color: '#1f5ca9' }}
                    >
                      {rowSum}
                    </td>
                  </tr>
                );
              })}
              {/* Col totals */}
              <tr style={{ background: '#f0f7ff' }}>
                <td className="px-3 py-2 text-sm font-bold" style={{ color: '#1f5ca9' }}>
                  Tổng
                </td>
                {Array(cols).fill(0).map((_, c) => {
                  const colSum = Array(rows).fill(0).reduce((acc, _, r) => {
                    const v = parseInt(table[r][c], 10);
                    return acc + (isNaN(v) ? 0 : v);
                  }, 0);
                  return (
                    <td
                      key={c}
                      className="px-2 py-2 text-center font-bold text-sm"
                      style={{ color: '#1f5ca9' }}
                    >
                      {colSum}
                    </td>
                  );
                })}
                <td
                  className="px-3 py-2 text-center font-black text-sm"
                  style={{ color: '#0d3572' }}
                >
                  {table.flat().reduce((acc, v) => acc + (parseInt(v, 10) || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl mt-4 text-sm animate-fadeIn"
            style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }}
          >
            <XCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="btn-primary"
            style={{ minWidth: 160 }}
          >
            {calculating ? (
              <>
                <div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
                Đang tính toán...
              </>
            ) : (
              <>
                <Play size={16} />
                Thực hiện kiểm định
              </>
            )}
          </button>
          <button onClick={handleReset} className="btn-secondary">
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="card animate-scaleIn" key={animKey}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title mb-0">Kết quả kiểm định</h2>
            <button onClick={handleCopy} className="btn-secondary text-xs px-3 py-1.5">
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>

          {/* P-value highlight */}
          <div
            className={`text-center py-6 rounded-xl mb-5 ${
              result.significant
                ? 'result-box-success'
                : 'result-box-neutral'
            }`}
          >
            <div className="text-sm font-medium text-gray-600 mb-1">P-value</div>
            <div
              className="font-black mb-2"
              style={{ fontSize: '2.8rem', color: result.significant ? '#059669' : '#4b5563' }}
            >
              {formatPValue(result.pValue)}
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
                result.significant
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {result.significant ? (
                <>
                  <CheckCircle size={16} />
                  Có sự khác biệt có ý nghĩa thống kê (P &lt; 0,05)
                </>
              ) : (
                <>
                  <Info size={16} />
                  Không có sự khác biệt có ý nghĩa thống kê
                </>
              )}
            </div>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Method */}
            <div
              className="p-4 rounded-xl"
              style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
            >
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                Phương pháp
              </div>
              <div className="font-semibold text-sm" style={{ color: '#1f5ca9' }}>
                {result.method}
              </div>
            </div>

            {/* P-value */}
            <div
              className="p-4 rounded-xl"
              style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
            >
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                P-value (Two-tailed)
              </div>
              <div className="font-bold text-xl" style={{ color: '#1f5ca9' }}>
                {formatPValue(result.pValue)}
              </div>
            </div>

            {/* Odds Ratio (chỉ 2×2) */}
            {result.oddsRatio !== undefined && (
              <div
                className="p-4 rounded-xl"
                style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
              >
                <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Odds Ratio (OR)
                </div>
                <div className="font-bold text-xl" style={{ color: '#1f5ca9' }}>
                  {isNaN(result.oddsRatio) ? 'Không xác định' :
                    !isFinite(result.oddsRatio) ? '∞ (Vô cực)' :
                    formatNumber(result.oddsRatio, 4)}
                </div>
              </div>
            )}

            {/* CI */}
            {result.ciLower !== undefined && result.ciUpper !== undefined && (
              <div
                className="p-4 rounded-xl"
                style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
              >
                <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                  Khoảng tin cậy 95% (OR)
                </div>
                <div className="font-bold text-xl" style={{ color: '#1f5ca9' }}>
                  [{formatNumber(result.ciLower, 3)}, {formatNumber(result.ciUpper, 3)}]
                </div>
              </div>
            )}
          </div>

          {/* Method note */}
          <div
            className="p-4 rounded-xl text-sm mb-4"
            style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#78350f' }}
          >
            <div className="flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold mb-1">Phương pháp áp dụng</div>
                <p>{result.methodNote}</p>
              </div>
            </div>
          </div>

          {/* Interpretation */}
          <div
            className={`p-4 rounded-xl text-sm ${
              result.significant ? 'result-box-success' : 'result-box-neutral'
            }`}
          >
            <div className="font-semibold mb-1 flex items-center gap-1.5">
              {result.significant ? (
                <CheckCircle size={15} color="#059669" />
              ) : (
                <Info size={15} color="#6b7280" />
              )}
              Diễn giải kết quả
            </div>
            <p className="text-gray-700">
              {result.significant
                ? `Với P-value = ${formatPValue(result.pValue)} < 0,05, có sự khác biệt có ý nghĩa thống kê giữa các nhóm theo phép kiểm định ${result.method}.`
                : `Với P-value = ${formatPValue(result.pValue)} ≥ 0,05, không có sự khác biệt có ý nghĩa thống kê giữa các nhóm (chưa đủ bằng chứng để bác bỏ giả thuyết H₀).`}
            </p>
            {result.oddsRatio !== undefined &&
              !isNaN(result.oddsRatio) &&
              isFinite(result.oddsRatio) && (
                <p className="mt-2 text-gray-600">
                  Odds Ratio = {formatNumber(result.oddsRatio, 3)} cho thấy{' '}
                  {result.oddsRatio > 1
                    ? `nhóm phơi nhiễm có nguy cơ cao hơn ${formatNumber(result.oddsRatio, 2)} lần so với nhóm chứng.`
                    : result.oddsRatio < 1
                    ? `nhóm phơi nhiễm có nguy cơ thấp hơn so với nhóm chứng (OR < 1).`
                    : `không có sự khác biệt về nguy cơ (OR = 1).`}
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
