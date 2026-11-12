import { useState, useCallback } from 'react';
import {
  GitFork, RefreshCw, Plus, Minus, Play,
  CheckCircle, Info, AlertTriangle, XCircle,
  Copy, Download, FileSpreadsheet
} from 'lucide-react';
import KaTeXFormula from '../components/KaTeXFormula';
import { calculateChiSquare, formatPValue, formatNumber } from '../utils/statistics';
import type { ContingencyResult } from '../utils/statistics';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const MIN_ROWS = 2;
const MAX_ROWS = 10;
const MIN_COLS = 2;
const MAX_COLS = 10;

export default function ChiSquarePage() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [table, setTable] = useState<string[][]>([['', ''], ['', '']]);
  const [rowLabels, setRowLabels] = useState(['Nhóm A', 'Nhóm B']);
  const [colLabels, setColLabels] = useState(['Kết quả 1', 'Kết quả 2']);
  const [result, setResult] = useState<ContingencyResult | null>(null);
  const [error, setError] = useState('');
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
    setRowLabels([...rowLabels, `Nhóm ${String.fromCharCode(65 + rows)}`]);
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
    setColLabels([...colLabels, `Kết quả ${cols + 1}`]);
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
    setTable([['', ''], ['', '']]);
    setRowLabels(['Nhóm A', 'Nhóm B']);
    setColLabels(['Kết quả 1', 'Kết quả 2']);
    setResult(null); setError('');
  };

  const handleCalculate = useCallback(() => {
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
    try {
      const res = calculateChiSquare(parsed);
      setResult(res);
      setAnimKey((k) => k + 1);
      setError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định.');
    }
  }, [table, rows, cols, rowLabels, colLabels]);

  const handleCopy = () => {
    if (!result) return;
    const lines = [
      'Kết quả Chi-square & Yates',
      `Phương pháp: ${result.method}`,
      `Chi-square (χ²): ${formatNumber(result.chiSquare)}`,
      result.chiSquareYates !== undefined
        ? `Chi-square Yates: ${formatNumber(result.chiSquareYates)}`
        : '',
      `Degrees of Freedom (df): ${result.df}`,
      `P-value: ${formatPValue(result.pValue)}`,
      result.pValueYates !== undefined
        ? `P-value Yates: ${formatPValue(result.pValueYates)}`
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

  const handleExportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Biostatistics Calculator', 105, 20, { align: 'center' });
    doc.setFontSize(13);
    doc.text('Chi-square & Yates Correction', 105, 30, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let y = 45;
    const addLine = (label: string, value: string) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, 20, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 85, y);
      y += 8;
    };

    addLine('Phuong phap', result.method);
    addLine('Chi-square (X2)', formatNumber(result.chiSquare));
    if (result.chiSquareYates !== undefined)
      addLine('Chi-square Yates', formatNumber(result.chiSquareYates));
    addLine('Degrees of Freedom (df)', result.df.toString());
    addLine('P-value', formatPValue(result.pValue));
    if (result.pValueYates !== undefined)
      addLine('P-value Yates', formatPValue(result.pValueYates));
    addLine('Grand Total', result.grandTotal.toString());

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text('Ket qua:', 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text(
      result.significant
        ? 'Co su khac biet co y nghia thong ke (P < 0.05).'
        : 'Khong co su khac biet co y nghia thong ke.',
      20, y, { maxWidth: 170 }
    );

    y += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('Bang tan so quan sat (Observed)', 20, y);
    y += 7;
    const colW = 30;
    const rowH = 8;
    doc.setFontSize(9);
    for (let r = 0; r < result.observed.length; r++) {
      for (let c = 0; c < result.observed[r].length; c++) {
        doc.rect(20 + c * colW, y + r * rowH, colW, rowH);
        doc.text(String(result.observed[r][c]), 20 + c * colW + colW / 2, y + r * rowH + 5.5, { align: 'center' });
      }
    }
    y += result.observed.length * rowH + 5;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bang tan so ky vong (Expected)', 20, y);
    y += 7;
    doc.setFontSize(9);
    for (let r = 0; r < result.expected.length; r++) {
      for (let c = 0; c < result.expected[r].length; c++) {
        doc.rect(20 + c * colW, y + r * rowH, colW, rowH);
        doc.text(formatNumber(result.expected[r][c], 2).replace(',', '.'), 20 + c * colW + colW / 2, y + r * rowH + 5.5, { align: 'center' });
      }
    }

    const today = new Date().toLocaleDateString('vi-VN');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Biostatistics Calculator | ${today}`, 105, 285, { align: 'center' });
    doc.save('chi-square-result.pdf');
  };

  const handleExportExcel = () => {
    if (!result) return;
    const wb = XLSX.utils.book_new();

    // Sheet 1: Bảng quan sát
    const obsData = [
      ['Quan sát', ...colLabels, 'Tổng hàng'],
      ...result.observed.map((row, i) => [rowLabels[i], ...row, result.rowTotals[i]]),
      ['Tổng cột', ...result.colTotals, result.grandTotal],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(obsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Quan sát');

    // Sheet 2: Bảng kỳ vọng
    const expData = [
      ['Kỳ vọng', ...colLabels],
      ...result.expected.map((row, i) => [rowLabels[i], ...row.map((v) => parseFloat(formatNumber(v, 4).replace(',', '.')))]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(expData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Kỳ vọng');

    // Sheet 3: Kết quả
    const resData = [
      ['Chỉ số', 'Giá trị'],
      ['Phương pháp', result.method],
      ['Chi-square (χ²)', formatNumber(result.chiSquare).replace(',', '.')],
      ...(result.chiSquareYates !== undefined
        ? [['Chi-square Yates', formatNumber(result.chiSquareYates).replace(',', '.')]]
        : []),
      ['Degrees of Freedom (df)', result.df],
      ['P-value', formatPValue(result.pValue)],
      ...(result.pValueYates !== undefined
        ? [['P-value Yates', formatPValue(result.pValueYates)]]
        : []),
      ['Ý nghĩa thống kê', result.significant ? 'Có (P < 0,05)' : 'Không'],
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(resData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Kết quả');

    XLSX.writeFile(wb, 'chi-square-result.xlsx');
  };

  const is2x2 = rows === 2 && cols === 2;

  const getMethodColor = () => {
    if (!result) return '#1f5ca9';
    if (result.warning && result.cellsBelowFive / (rows * cols) > 0.2) return '#dc2626';
    if (result.warning) return '#d97706';
    return '#059669';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center rounded-xl w-12 h-12"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #00afef 100%)' }}
          >
            <GitFork size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#0d9488' }}>
              Chi-square & Yates Correction
            </h1>
            <p className="text-sm text-gray-500">Kiểm định Chi-square Pearson và hiệu chỉnh Yates</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Tự động lựa chọn phương pháp kiểm định phù hợp, hiển thị tần số kỳ vọng và cảnh báo điều kiện áp dụng.
        </p>
      </div>

      {/* Table controls */}
      <div className="card mb-5">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="section-title mb-0 mr-auto">
            Bảng dữ liệu ({rows}×{cols})
          </h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={addRow} disabled={rows >= MAX_ROWS} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">
              <Plus size={13} /> Thêm hàng
            </button>
            <button onClick={removeRow} disabled={rows <= MIN_ROWS} className="btn-danger text-xs px-3 py-1.5 disabled:opacity-40">
              <Minus size={13} /> Xóa hàng
            </button>
            <button onClick={addCol} disabled={cols >= MAX_COLS} className="btn-secondary text-xs px-3 py-1.5 disabled:opacity-40">
              <Plus size={13} /> Thêm cột
            </button>
            <button onClick={removeCol} disabled={cols <= MIN_COLS} className="btn-danger text-xs px-3 py-1.5 disabled:opacity-40">
              <Minus size={13} /> Xóa cột
            </button>
          </div>
        </div>

        {/* Input table */}
        <div className="overflow-x-auto mb-4">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th
                  className="px-3 py-2 text-left"
                  style={{ background: '#f0f7ff', color: '#1f5ca9', minWidth: 110, borderRadius: '8px 0 0 0' }}
                >
                  Nhóm / Kết quả
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
                  className="px-3 py-2 text-center"
                  style={{ background: '#f0f7ff', color: '#1f5ca9', borderRadius: '0 8px 0 0' }}
                >
                  Tổng hàng
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(rows).fill(0).map((_, r) => {
                const rowSum = Array(cols).fill(0).reduce((acc: number, _, c: number) => {
                  const v = parseInt(table[r][c], 10);
                  return acc + (isNaN(v) ? 0 : v);
                }, 0);
                return (
                  <tr key={r} style={{ background: r % 2 === 0 ? '#f8fbff' : '#fff' }}>
                    <td className="px-2 py-2">
                      <input
                        className="text-xs font-medium w-full bg-transparent border-none outline-none"
                        style={{ color: '#4a6fa5', minWidth: 80 }}
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
                    <td className="px-3 py-2 text-center font-bold text-sm" style={{ color: '#1f5ca9' }}>
                      {rowSum}
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: '#f0f7ff' }}>
                <td className="px-3 py-2 text-sm font-bold" style={{ color: '#1f5ca9' }}>Tổng cột</td>
                {Array(cols).fill(0).map((_, c) => {
                  const colSum = Array(rows).fill(0).reduce((acc: number, _, r: number) => {
                    const v = parseInt(table[r][c], 10);
                    return acc + (isNaN(v) ? 0 : v);
                  }, 0);
                  return (
                    <td key={c} className="px-2 py-2 text-center font-bold text-sm" style={{ color: '#1f5ca9' }}>
                      {colSum}
                    </td>
                  );
                })}
                <td className="px-3 py-2 text-center font-black text-sm" style={{ color: '#0d3572' }}>
                  {table.flat().reduce((acc, v) => acc + (parseInt(v, 10) || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm animate-fadeIn"
            style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }}
          >
            <XCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button onClick={handleCalculate} className="btn-primary" style={{ minWidth: 180 }}>
            <Play size={16} />
            Kiểm định Chi-square
          </button>
          <button onClick={handleReset} className="btn-secondary">
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fadeIn" key={animKey}>
          {/* Warning/Recommendation */}
          {result.warning && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl text-sm"
              style={{
                background: result.cellsBelowFive / (rows * cols) > 0.2 ? '#fef2f2' : '#fffbeb',
                border: `1.5px solid ${result.cellsBelowFive / (rows * cols) > 0.2 ? '#fca5a5' : '#fcd34d'}`,
                color: result.cellsBelowFive / (rows * cols) > 0.2 ? '#dc2626' : '#92400e',
              }}
            >
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-1">{result.warning}</p>
                {result.recommendation && <p>{result.recommendation}</p>}
              </div>
            </div>
          )}

          {/* Significance banner */}
          <div
            className={`p-5 rounded-xl text-center ${
              result.significant ? 'result-box-success' : 'result-box-neutral'
            }`}
          >
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-base ${
                result.significant
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {result.significant ? (
                <>
                  <CheckCircle size={20} />
                  Có sự khác biệt có ý nghĩa thống kê (P &lt; 0,05)
                </>
              ) : (
                <>
                  <Info size={20} />
                  Không có sự khác biệt có ý nghĩa thống kê
                </>
              )}
            </div>
          </div>

          {/* Main results */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title mb-0">Kết quả kiểm định</h2>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-secondary text-xs px-3 py-1.5">
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
                <button onClick={handleExportPDF} className="btn-primary text-xs px-3 py-1.5">
                  <Download size={13} />
                  Xuất PDF
                </button>
                <button onClick={handleExportExcel} className="btn-success text-xs px-3 py-1.5">
                  <FileSpreadsheet size={13} />
                  Xuất Excel
                </button>
              </div>
            </div>

            {/* Method */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-5 text-sm font-medium"
              style={{
                background: '#f0f7ff',
                border: `2px solid`,
                borderColor: getMethodColor(),
                color: getMethodColor(),
              }}
            >
              <Info size={16} />
              Phương pháp: <strong>{result.method}</strong>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <StatCard
                label={<KaTeXFormula formula="\chi^2" />}
                value={formatNumber(result.chiSquare)}
                sub="Chi-square Pearson"
                color="#1f5ca9"
              />
              {result.chiSquareYates !== undefined && (
                <StatCard
                  label={<KaTeXFormula formula="\chi^2_{\text{Yates}}" />}
                  value={formatNumber(result.chiSquareYates)}
                  sub="Chi-square Yates"
                  color="#0891b2"
                />
              )}
              <StatCard
                label="df"
                value={result.df.toString()}
                sub="Degrees of Freedom"
                color="#7c3aed"
              />
              <StatCard
                label="P-value"
                value={formatPValue(result.pValue)}
                sub="Pearson"
                color={result.significant ? '#059669' : '#6b7280'}
              />
              {result.pValueYates !== undefined && (
                <StatCard
                  label="P-value Yates"
                  value={formatPValue(result.pValueYates)}
                  sub="Sau hiệu chỉnh"
                  color={result.significantYates ? '#059669' : '#6b7280'}
                />
              )}
              <StatCard
                label="N"
                value={result.grandTotal.toString()}
                sub="Tổng quan sát"
                color="#1f5ca9"
              />
              <StatCard
                label="E_min"
                value={formatNumber(result.minExpected, 2)}
                sub="Tần số kỳ vọng nhỏ nhất"
                color={result.minExpected < 5 ? '#d97706' : '#059669'}
              />
              <StatCard
                label="Ô < 5"
                value={`${result.cellsBelowFive}/${rows * cols}`}
                sub="Ô có E < 5"
                color={result.cellsBelowFive > 0 ? '#d97706' : '#059669'}
              />
            </div>

            {/* Method note */}
            <div
              className="p-4 rounded-xl text-sm mb-0"
              style={{ background: '#f8fbff', border: '1.5px solid #e0eaf5', color: '#4a6fa5' }}
            >
              <div className="flex items-start gap-2">
                <Info size={15} className="mt-0.5 shrink-0" />
                <span>{result.methodNote}</span>
              </div>
            </div>
          </div>

          {/* Observed & Expected tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <FreqTable
              title="Tần số quan sát (Observed)"
              data={result.observed}
              rowLabels={rowLabels}
              colLabels={colLabels}
              rowTotals={result.rowTotals}
              colTotals={result.colTotals}
              grandTotal={result.grandTotal}
              isObserved
            />
            <FreqTable
              title="Tần số kỳ vọng (Expected)"
              data={result.expected}
              rowLabels={rowLabels}
              colLabels={colLabels}
              rowTotals={result.rowTotals}
              colTotals={result.colTotals}
              grandTotal={result.grandTotal}
              isObserved={false}
              highlightBelow5
            />
          </div>

          {/* Chi-square formula breakdown */}
          {is2x2 && (
            <div className="card">
              <h3 className="font-semibold mb-4" style={{ color: '#1f5ca9' }}>
                Công thức tính Chi-square
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl text-center"
                  style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
                >
                  <p className="text-xs text-gray-500 mb-2">Pearson Chi-square</p>
                  <KaTeXFormula
                    formula="\chi^2 = \sum \frac{(O - E)^2}{E}"
                    displayMode
                  />
                  <p className="text-sm font-bold mt-2" style={{ color: '#1f5ca9' }}>
                    χ² = {formatNumber(result.chiSquare)}
                  </p>
                </div>
                {result.chiSquareYates !== undefined && (
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
                  >
                    <p className="text-xs text-gray-500 mb-2">Hiệu chỉnh Yates</p>
                    <KaTeXFormula
                      formula="\chi^2_{\text{Yates}} = \sum \frac{(|O-E| - 0.5)^2}{E}"
                      displayMode
                    />
                    <p className="text-sm font-bold mt-2" style={{ color: '#0891b2' }}>
                      χ²(Yates) = {formatNumber(result.chiSquareYates)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interpretation */}
          <div
            className={`card ${result.significant ? 'result-box-success' : 'result-box-neutral'}`}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#1f5ca9' }}>
              <CheckCircle size={18} />
              Diễn giải kết quả
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Phương pháp được sử dụng:</strong> {result.method}
              </p>
              <p>
                <strong>Điều kiện áp dụng:</strong> {result.methodNote}
              </p>
              <p>
                <strong>Giá trị thống kê:</strong> χ² = {formatNumber(result.chiSquare)}, df = {result.df}
              </p>
              <p>
                <strong>P-value:</strong> {formatPValue(result.pValue)}
              </p>
              {result.chiSquareYates !== undefined && (
                <p>
                  <strong>Chi-square (Yates):</strong> {formatNumber(result.chiSquareYates)}, P-value = {formatPValue(result.pValueYates ?? NaN)}
                </p>
              )}
              <div
                className={`mt-3 p-3 rounded-xl font-semibold text-center ${
                  result.significant
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {result.significant
                  ? `✅ Có sự khác biệt có ý nghĩa thống kê (P = ${formatPValue(result.pValue)} < 0,05).`
                  : `ℹ️ Không có sự khác biệt có ý nghĩa thống kê (P = ${formatPValue(result.pValue)} ≥ 0,05).`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: React.ReactNode;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="p-3 rounded-xl text-center"
      style={{ background: '#f8fbff', border: '1.5px solid #e0eaf5' }}
    >
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-bold text-lg" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  );
}

function FreqTable({
  title,
  data,
  rowLabels,
  colLabels,
  rowTotals,
  colTotals,
  grandTotal,
  isObserved,
  highlightBelow5,
}: {
  title: string;
  data: number[][];
  rowLabels: string[];
  colLabels: string[];
  rowTotals: number[];
  colTotals: number[];
  grandTotal: number;
  isObserved: boolean;
  highlightBelow5?: boolean;
}) {
  return (
    <div className="card">
      <h3 className="font-semibold mb-3 text-sm" style={{ color: '#1f5ca9' }}>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left text-xs" style={{ background: '#f0f7ff', color: '#1f5ca9' }}>
                Nhóm
              </th>
              {colLabels.map((cl, c) => (
                <th key={c} className="px-2 py-2 text-center text-xs" style={{ background: '#f0f7ff', color: '#1f5ca9' }}>
                  {cl}
                </th>
              ))}
              <th className="px-2 py-2 text-center text-xs" style={{ background: '#f0f7ff', color: '#1f5ca9' }}>
                Tổng
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, r) => (
              <tr key={r} style={{ background: r % 2 === 0 ? '#f8fbff' : '#fff' }}>
                <td className="px-2 py-2 text-xs font-medium" style={{ color: '#4a6fa5' }}>
                  {rowLabels[r]}
                </td>
                {row.map((val, c) => (
                  <td
                    key={c}
                    className="px-2 py-2 text-center text-xs font-semibold"
                    style={{
                      color: highlightBelow5 && val < 5 ? '#d97706' : '#1a2940',
                      background:
                        highlightBelow5 && val < 5
                          ? '#fffbeb'
                          : 'transparent',
                    }}
                  >
                    {isObserved ? val : formatNumber(val, 2)}
                  </td>
                ))}
                <td className="px-2 py-2 text-center text-xs font-bold" style={{ color: '#1f5ca9' }}>
                  {rowTotals[r]}
                </td>
              </tr>
            ))}
            <tr style={{ background: '#f0f7ff' }}>
              <td className="px-2 py-2 text-xs font-bold" style={{ color: '#1f5ca9' }}>Tổng</td>
              {colTotals.map((ct, c) => (
                <td key={c} className="px-2 py-2 text-center text-xs font-bold" style={{ color: '#1f5ca9' }}>
                  {ct}
                </td>
              ))}
              <td className="px-2 py-2 text-center text-xs font-black" style={{ color: '#0d3572' }}>
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {highlightBelow5 && (
        <p className="text-xs mt-2 text-amber-600">
          * Ô màu vàng: Tần số kỳ vọng &lt; 5
        </p>
      )}
    </div>
  );
}
