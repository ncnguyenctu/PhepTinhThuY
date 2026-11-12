import { BookOpen, ChevronRight, AlertTriangle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import KaTeXFormula from '../components/KaTeXFormula';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
}
function Section({ title, icon, children, color = '#1f5ca9' }: SectionProps) {
  return (
    <div className="card mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center justify-center rounded-xl w-10 h-10"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
        <h2 className="text-lg font-bold" style={{ color }}>
          {title}
        </h2>
      </div>
      <div className="text-sm text-gray-700 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

interface ConditionBadgeProps {
  label: string;
  ok: boolean;
}
function ConditionBadge({ label, ok }: ConditionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
        ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
      }`}
    >
      {ok ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
      {label}
    </span>
  );
}

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-3">
          <div
            className="flex items-center justify-center rounded-2xl w-16 h-16"
            style={{ background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)' }}
          >
            <BookOpen size={28} color="#fff" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f5ca9' }}>
          Hướng dẫn sử dụng
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Hướng dẫn chi tiết về các phép kiểm định thống kê, điều kiện áp dụng và ý nghĩa của kết quả.
        </p>
      </div>

      {/* Sơ đồ lựa chọn phương pháp */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold mb-5" style={{ color: '#1f5ca9' }}>
          📊 Sơ đồ chọn phương pháp kiểm định
        </h2>

        <div className="relative">
          {/* Flowchart */}
          <div className="flex flex-col items-center gap-0">
            <FlowBox
              text="Dữ liệu của bạn là gì?"
              type="question"
              color="#1f5ca9"
            />
            <Arrow />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-center gap-0">
                <div
                  className="text-xs font-semibold px-3 py-1 rounded-full mb-2"
                  style={{ background: '#e0eaf5', color: '#1f5ca9' }}
                >
                  Bảng tần số (phân loại)
                </div>
                <Arrow />
                <FlowBox text="Tổng mẫu N ≥ 40?" type="question" color="#0891b2" small />
                <div className="grid grid-cols-2 gap-3 mt-2 w-full">
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-green-700 font-semibold mb-1">Có</div>
                    <FlowBox text="Chi-square Pearson" type="result" color="#059669" small />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-red-600 font-semibold mb-1">Không</div>
                    <FlowBox text="Bảng 2×2?" type="question" color="#d97706" small />
                    <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-green-700 font-semibold mb-1">Có</div>
                        <FlowBox text="E ≥ 1?" type="question" color="#7c3aed" small />
                        <div className="flex flex-col gap-1 mt-1 text-xs text-center">
                          <span className="text-green-700 font-semibold">→ Yates</span>
                          <span className="text-red-600 font-semibold">→ Fisher's</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-red-600 font-semibold mb-1">Không</div>
                        <FlowBox text="Fisher's Monte Carlo" type="result" color="#dc2626" small />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-0">
                <div
                  className="text-xs font-semibold px-3 py-1 rounded-full mb-2"
                  style={{ background: '#e0eaf5', color: '#1f5ca9' }}
                >
                  Dữ liệu liên tục
                </div>
                <Arrow />
                <FlowBox text="→ t-test / ANOVA (Sắp ra mắt)" type="info" color="#6b7280" small />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* P-value */}
      <Section title="Ý nghĩa của P-value" icon={<HelpCircle size={20} />} color="#1f5ca9">
        <p>
          P-value (giá trị p) là xác suất quan sát được kết quả bằng hoặc cực đoan hơn kết quả hiện tại,
          <strong> giả sử giả thuyết H₀ (không có sự khác biệt) là đúng</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div
            className="p-3 rounded-xl"
            style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7' }}
          >
            <div className="font-semibold text-green-800 mb-1 flex items-center gap-1.5">
              <CheckCircle size={15} /> P &lt; 0,05
            </div>
            <p className="text-green-700 text-xs">
              Bác bỏ H₀. Có sự khác biệt có ý nghĩa thống kê với mức tin cậy 95%.
            </p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: '#f3f4f6', border: '1.5px solid #d1d5db' }}
          >
            <div className="font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Info size={15} /> P ≥ 0,05
            </div>
            <p className="text-gray-600 text-xs">
              Chưa đủ bằng chứng để bác bỏ H₀. Không có sự khác biệt có ý nghĩa thống kê.
            </p>
          </div>
        </div>
        <div
          className="p-3 rounded-xl flex items-start gap-2 text-xs"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#92400e' }}
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            <strong>Lưu ý quan trọng:</strong> P-value không phải xác suất H₀ đúng. Kết quả "không có ý nghĩa thống kê" không có nghĩa là "không có sự khác biệt". Luôn cần kết hợp với ý nghĩa lâm sàng và kích thước hiệu ứng (effect size).
          </span>
        </div>
      </Section>

      {/* Chi-square */}
      <Section title="Khi nào dùng Chi-square Pearson?" icon={<ChevronRight size={20} />} color="#059669">
        <div className="flex flex-col gap-2 mb-3">
          <p className="font-medium">Điều kiện áp dụng:</p>
          <div className="flex flex-wrap gap-2">
            <ConditionBadge label="Dữ liệu phân loại (danh nghĩa/thứ hạng)" ok={true} />
            <ConditionBadge label="Các quan sát độc lập nhau" ok={true} />
            <ConditionBadge label="Tần số kỳ vọng E ≥ 5 ở tất cả ô" ok={true} />
            <ConditionBadge label="≤ 20% ô có E < 5 (chấp nhận được)" ok={true} />
          </div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}>
          <KaTeXFormula formula="\chi^2 = \sum_{i,j} \frac{(O_{ij} - E_{ij})^2}{E_{ij}}" displayMode />
          <p className="text-xs text-gray-500 mt-1">Với E_ij = (Tổng hàng i × Tổng cột j) / N</p>
        </div>
        <p>
          Phép kiểm định Chi-square Pearson so sánh tần số <strong>quan sát (Observed)</strong> với tần số{' '}
          <strong>kỳ vọng (Expected)</strong> nếu hai biến không có mối liên hệ.
          Giá trị Chi-square càng lớn thì sự khác biệt càng đáng kể.
        </p>
        <p>
          <strong>Degrees of Freedom (df):</strong> df = (số hàng − 1) × (số cột − 1)
        </p>
      </Section>

      {/* Yates */}
      <Section title="Khi nào dùng Hiệu chỉnh Yates?" icon={<ChevronRight size={20} />} color="#0891b2">
        <div className="flex flex-wrap gap-2 mb-3">
          <ConditionBadge label="Bảng 2×2" ok={true} />
          <ConditionBadge label="Một hoặc nhiều ô có E < 5" ok={true} />
          <ConditionBadge label="Tất cả E ≥ 1" ok={true} />
          <ConditionBadge label="N ≥ 20" ok={true} />
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}>
          <KaTeXFormula formula="\chi^2_{\text{Yates}} = \sum \frac{(|O_{ij} - E_{ij}| - 0{,}5)^2}{E_{ij}}" displayMode />
        </div>
        <p>
          Hiệu chỉnh Yates (Yates' Continuity Correction) điều chỉnh giá trị Chi-square cho bảng 2×2
          khi tần số kỳ vọng nhỏ, giúp giảm sai lệch Type I (xác suất kết luận sai "có ý nghĩa").
          Giá trị Chi-square sau hiệu chỉnh thường nhỏ hơn, dẫn đến P-value lớn hơn (bảo thủ hơn).
        </p>
        <div
          className="p-3 rounded-xl flex items-start gap-2 text-xs"
          style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#92400e' }}
        >
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          Một số tác giả cho rằng hiệu chỉnh Yates quá bảo thủ. Khi có nghi ngờ, nên sử dụng Fisher's Exact Test.
        </div>
      </Section>

      {/* Fisher's */}
      <Section title="Khi nào dùng Fisher's Exact Test?" icon={<ChevronRight size={20} />} color="#7c3aed">
        <div className="flex flex-wrap gap-2 mb-3">
          <ConditionBadge label="Bảng 2×2 (exact)" ok={true} />
          <ConditionBadge label="Có ô với E < 1" ok={true} />
          <ConditionBadge label="N nhỏ (< 20)" ok={true} />
          <ConditionBadge label="Bảng m×n (Monte Carlo)" ok={true} />
        </div>
        <p>
          Fisher's Exact Test tính <strong>xác suất chính xác</strong> dựa trên phân phối siêu bội
          (hypergeometric distribution). Không cần giả thuyết về phân phối kỳ vọng như Chi-square.
        </p>
        <p>
          Với bảng 2×2, thuật toán tính tổng xác suất của tất cả bảng có marginal totals giống nhau
          nhưng có xác suất bằng hoặc nhỏ hơn bảng quan sát (two-tailed test).
        </p>
        <p>
          Với bảng m×n (m hoặc n &gt; 2), hệ thống sử dụng phương pháp{' '}
          <strong>Monte Carlo</strong> (50.000 lần mô phỏng) để ước tính P-value.
        </p>
        <div
          className="p-3 rounded-xl text-center"
          style={{ background: '#f5f3ff', border: '1.5px solid #c4b5fd' }}
        >
          <KaTeXFormula
            formula="P = \frac{\binom{r_1}{a}\binom{r_2}{c}}{\binom{N}{c_1}}"
            displayMode
          />
          <p className="text-xs text-gray-500 mt-1">Xác suất của một bảng theo phân phối siêu bội</p>
        </div>
      </Section>

      {/* Tính cỡ mẫu */}
      <Section title="Tính cỡ mẫu (Sample Size)" icon={<ChevronRight size={20} />} color="#d97706">
        <p>
          Tính cỡ mẫu tối thiểu cho nghiên cứu cắt ngang một nhóm dựa trên công thức tỷ lệ:
        </p>
        <div className="p-3 rounded-xl text-center" style={{ background: '#fffbeb', border: '1.5px solid #fcd34d' }}>
          <KaTeXFormula formula="n = \frac{Z^2 \cdot P(1-P)}{d^2}" displayMode />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse rounded-xl overflow-hidden mt-2">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #1f5ca9, #00afef)', color: '#fff' }}>
                <th className="px-3 py-2 text-left">Thông số</th>
                <th className="px-3 py-2 text-left">Ý nghĩa</th>
                <th className="px-3 py-2 text-left">Gợi ý</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Z', 'Giá trị phân phối chuẩn tắc', '1,645 (90%); 1,96 (95%); 2,576 (99%)'],
                ['P', 'Tỷ lệ dương tính dự đoán', 'Dùng 0,5 nếu chưa biết (cho cỡ mẫu lớn nhất)'],
                ['d', 'Sai số tuyệt đối mong muốn', 'Thường dùng 0,05 (5%) hoặc 0,1 (10%)'],
                ['n', 'Cỡ mẫu cần thiết', 'Làm tròn lên số nguyên gần nhất'],
              ].map(([par, meaning, note], i) => (
                <tr key={par} style={{ background: i % 2 === 0 ? '#f8fbff' : '#fff' }}>
                  <td className="px-3 py-2 font-bold" style={{ color: '#1f5ca9' }}>{par}</td>
                  <td className="px-3 py-2 text-gray-700">{meaning}</td>
                  <td className="px-3 py-2 text-gray-500 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Quick Reference */}
      <div className="card">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1f5ca9' }}>
          📋 Bảng tóm tắt – Chọn phương pháp nào?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'linear-gradient(90deg, #1f5ca9, #00afef)', color: '#fff' }}>
                <th className="px-3 py-2 text-left">Tình huống</th>
                <th className="px-3 py-2 text-center">Chi-square</th>
                <th className="px-3 py-2 text-center">Yates</th>
                <th className="px-3 py-2 text-center">Fisher's</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Tất cả E ≥ 5, N lớn', '✅', '❌', '❌'],
                ['Bảng 2×2, có E < 5 nhưng E ≥ 1', '⚠️', '✅', '✅'],
                ['Bảng 2×2, có E < 1 hoặc N < 20', '❌', '❌', '✅'],
                ['Bảng m×n, có > 20% ô E < 5', '⚠️', 'N/A', '✅ Monte Carlo'],
                ['Bảng m×n, tất cả E ≥ 5', '✅', 'N/A', 'Tùy chọn'],
              ].map(([situation, chi, yates, fisher], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f8fbff' : '#fff' }}>
                  <td className="px-3 py-2 text-gray-700">{situation}</td>
                  <td className="px-3 py-2 text-center">{chi}</td>
                  <td className="px-3 py-2 text-center">{yates}</td>
                  <td className="px-3 py-2 text-center">{fisher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">✅ Phù hợp | ⚠️ Chấp nhận được nhưng cần thận trọng | ❌ Không phù hợp</p>
      </div>
    </div>
  );
}

function FlowBox({
  text,
  type,
  color,
  small,
}: {
  text: string;
  type: 'question' | 'result' | 'info';
  color: string;
  small?: boolean;
}) {
  const borderStyle = type === 'question' ? 'dashed' : 'solid';
  const bg = type === 'result' ? `${color}15` : type === 'info' ? '#f3f4f6' : '#fff';
  return (
    <div
      className={`text-center rounded-xl font-medium ${small ? 'text-xs px-3 py-2' : 'text-sm px-5 py-3'}`}
      style={{
        border: `2px ${borderStyle} ${color}`,
        color,
        background: bg,
        minWidth: small ? 90 : 200,
        maxWidth: small ? 160 : 300,
      }}
    >
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex flex-col items-center my-1">
      <div style={{ width: 2, height: 20, background: '#94b4d4' }} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid #94b4d4',
        }}
      />
    </div>
  );
}
