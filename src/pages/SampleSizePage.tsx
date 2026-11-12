import { useState } from 'react';
import { Calculator, RefreshCw, Copy, CheckCircle, AlertCircle, Info } from 'lucide-react';
import KaTeXFormula from '../components/KaTeXFormula';
import { calculateSampleSize, formatNumber } from '../utils/statistics';

export default function SampleSizePage() {
  const [P, setP] = useState('');
  const [d, setD] = useState('');
  const [confidence, setConfidence] = useState(95);
  const [result, setResult] = useState<ReturnType<typeof calculateSampleSize> | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const zMap: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 };

  const validate = (): boolean => {
    const pVal = parseFloat(P.replace(',', '.'));
    const dVal = parseFloat(d.replace(',', '.'));

    if (P.trim() === '' || d.trim() === '') {
      setError('Vui lòng nhập đầy đủ giá trị P và d.');
      return false;
    }
    if (isNaN(pVal) || pVal <= 0 || pVal >= 1) {
      setError('Giá trị P phải là số thực trong khoảng (0; 1). Ví dụ: 0,5 hoặc 0,3.');
      return false;
    }
    if (isNaN(dVal) || dVal <= 0 || dVal >= 1) {
      setError('Sai số d phải là số thực trong khoảng (0; 1). Ví dụ: 0,05 hoặc 0,1.');
      return false;
    }
    if (dVal >= pVal) {
      setError('Sai số d nên nhỏ hơn tỷ lệ P để kết quả có ý nghĩa.');
      return false;
    }
    setError('');
    return true;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const pVal = parseFloat(P.replace(',', '.'));
    const dVal = parseFloat(d.replace(',', '.'));
    const res = calculateSampleSize(pVal, dVal, confidence);
    setResult(res);
    setAnimKey((k) => k + 1);
  };

  const handleReset = () => {
    setP('');
    setD('');
    setConfidence(95);
    setResult(null);
    setError('');
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Kết quả Tính Cỡ Mẫu\n` +
      `Mức tin cậy: ${confidence}%\n` +
      `Giá trị Z: ${result.Z}\n` +
      `Tỷ lệ P: ${result.P}\n` +
      `Sai số d: ${result.d}\n` +
      `Cỡ mẫu n (chính xác): ${formatNumber(result.nExact)}\n` +
      `Cỡ mẫu n (làm tròn): ${result.n}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNumericInput = (
    val: string,
    setter: (v: string) => void
  ) => {
    // Cho phép số thập phân với dấu phẩy hoặc chấm
    if (/^[0-9]*[,.]?[0-9]*$/.test(val) || val === '') {
      setter(val);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="flex items-center justify-center rounded-xl w-12 h-12"
            style={{ background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)' }}
          >
            <Calculator size={22} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1f5ca9' }}>
              Tính cỡ mẫu
            </h1>
            <p className="text-sm text-gray-500">Sample Size Calculator</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Tính cỡ mẫu cần thiết cho nghiên cứu cắt ngang và khảo sát dịch tễ học theo công thức tỷ lệ một mẫu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Công thức */}
        <div className="card">
          <h2 className="section-title mb-4">Công thức tính cỡ mẫu</h2>
          <div
            className="rounded-xl p-5 mb-4 text-center"
            style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%)', border: '2px solid #c0d8f0' }}
          >
            <KaTeXFormula
              formula="n = \\dfrac{Z^2 \\cdot P(1-P)}{d^2}"
              displayMode={true}
            />
          </div>

          <div className="space-y-2">
            {[
              {
                sym: 'n',
                label: 'Cỡ mẫu cần thiết',
                formula: 'n',
                note: 'Làm tròn lên số nguyên',
              },
              {
                sym: 'Z',
                label: 'Giá trị phân phối chuẩn tắc',
                formula: 'Z',
                note: 'Phụ thuộc mức tin cậy',
              },
              {
                sym: 'P',
                label: 'Tỷ lệ dương tính dự đoán',
                formula: 'P',
                note: '0 < P < 1',
              },
              {
                sym: 'd',
                label: 'Sai số mong muốn',
                formula: 'd',
                note: '0 < d < 1',
              },
            ].map((item) => (
              <div
                key={item.sym}
                className="flex items-start gap-3 py-2 border-b"
                style={{ borderColor: '#e0eaf5' }}
              >
                <span
                  className="font-bold text-sm w-6 text-center mt-0.5 shrink-0"
                  style={{ color: '#1f5ca9' }}
                >
                  <KaTeXFormula formula={item.formula} />
                </span>
                <div>
                  <div className="text-sm font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng Z */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2" style={{ color: '#1f5ca9' }}>
              Giá trị Z theo mức tin cậy
            </h3>
            <table className="w-full text-sm text-center rounded-xl overflow-hidden">
              <thead>
                <tr style={{ background: 'linear-gradient(90deg, #1f5ca9, #00afef)', color: '#fff' }}>
                  <th className="py-2 px-3">Mức tin cậy</th>
                  <th className="py-2 px-3">Giá trị Z</th>
                </tr>
              </thead>
              <tbody>
                {[90, 95, 99].map((cl, i) => (
                  <tr
                    key={cl}
                    style={{ background: i % 2 === 0 ? '#f8fbff' : '#fff' }}
                    className={`font-medium ${confidence === cl ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <td className="py-2 px-3">{cl}%</td>
                    <td className="py-2 px-3">{zMap[cl]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form nhập liệu */}
        <div className="flex flex-col gap-5">
          <div className="card">
            <h2 className="section-title mb-4">Nhập thông số</h2>

            {/* Mức tin cậy */}
            <div className="mb-4">
              <label className="label-text block mb-1">
                Mức độ tin cậy (Confidence Level)
              </label>
              <div className="flex gap-2">
                {[90, 95, 99].map((cl) => (
                  <button
                    key={cl}
                    onClick={() => setConfidence(cl)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      confidence === cl
                        ? 'text-white border-transparent'
                        : 'text-gray-600 border-gray-200 hover:border-blue-300'
                    }`}
                    style={
                      confidence === cl
                        ? { background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)', borderColor: 'transparent' }
                        : {}
                    }
                  >
                    {cl}%
                    <div className="text-xs font-normal opacity-80">Z = {zMap[cl]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* P */}
            <div className="mb-4">
              <label className="label-text block mb-1">
                Tỷ lệ dương tính dự đoán{' '}
                <KaTeXFormula formula="P" className="text-xs" />
              </label>
              <input
                type="text"
                inputMode="decimal"
                className="input-field"
                placeholder="Ví dụ: 0,5 hoặc 0,3"
                value={P}
                onChange={(e) => handleNumericInput(e.target.value, setP)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Nhập giá trị từ 0 đến 1. Nếu chưa biết, dùng P = 0,5 để cỡ mẫu lớn nhất.
              </p>
            </div>

            {/* d */}
            <div className="mb-5">
              <label className="label-text block mb-1">
                Sai số mong muốn{' '}
                <KaTeXFormula formula="d" className="text-xs" />
              </label>
              <input
                type="text"
                inputMode="decimal"
                className="input-field"
                placeholder="Ví dụ: 0,05 (5%) hoặc 0,1 (10%)"
                value={d}
                onChange={(e) => handleNumericInput(e.target.value, setD)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Sai số tuyệt đối (absolute error). Thường dùng 0,05 hoặc 0,1.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm animate-fadeIn"
                style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#dc2626' }}
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleCalculate} className="btn-primary flex-1 justify-center">
                <Calculator size={17} />
                Tính cỡ mẫu
              </button>
              <button onClick={handleReset} className="btn-secondary px-4">
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="card animate-scaleIn" key={animKey}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0">Kết quả</h2>
                <button
                  onClick={handleCopy}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                  {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>

              {/* n result highlight */}
              <div
                className="text-center py-6 rounded-xl mb-4"
                style={{ background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)' }}
              >
                <div className="text-white text-sm font-medium mb-1 opacity-80">
                  Cỡ mẫu cần thiết
                </div>
                <div className="text-white font-black" style={{ fontSize: '3.5rem' }}>
                  {result.n}
                </div>
                <div className="text-white text-xs opacity-70">
                  (Làm tròn lên từ {formatNumber(result.nExact, 2).replace('.', ',')})
                </div>
              </div>

              {/* Detail */}
              <div className="space-y-2">
                {[
                  {
                    label: 'Mức tin cậy',
                    value: `${confidence}%`,
                    formula: null,
                  },
                  {
                    label: 'Giá trị Z',
                    value: result.Z.toString(),
                    formula: 'Z',
                  },
                  {
                    label: 'Tỷ lệ P',
                    value: formatNumber(result.P, 4),
                    formula: 'P',
                  },
                  {
                    label: 'Sai số d',
                    value: formatNumber(result.d, 4),
                    formula: 'd',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: '#e0eaf5' }}
                  >
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      {item.formula && (
                        <KaTeXFormula formula={item.formula} className="text-xs" />
                      )}
                      {item.label}
                    </span>
                    <span className="font-semibold text-sm" style={{ color: '#1f5ca9' }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="mt-4 p-3 rounded-xl flex items-start gap-2 text-xs"
                style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}
              >
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>
                  Kết quả áp dụng cho nghiên cứu cắt ngang, một nhóm đơn. Với nghiên cứu phức tạp hơn (đoàn hệ, bệnh-chứng, thử nghiệm lâm sàng), cần sử dụng công thức chuyên biệt.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
