import { Calculator, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="mt-16"
      style={{
        background: 'linear-gradient(135deg, #0d3572 0%, #1f5ca9 100%)',
        color: '#fff',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.15)', width: 40, height: 40 }}
              >
                <Calculator size={22} color="#fff" />
              </div>
              <div>
                <div className="font-bold text-lg">Biostatistics Calculator</div>
                <div className="text-xs" style={{ color: '#7ec8f0' }}>
                  Công cụ thống kê sinh học
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#b3d4f0' }}>
              Hỗ trợ sinh viên, giảng viên và nhà nghiên cứu thực hiện các phép tính thống kê trong nghiên cứu khoa học, y học và thú y.
            </p>
          </div>

          {/* Công cụ */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#7ec8f0' }}>
              Công cụ thống kê
            </h4>
            <ul className="text-sm space-y-2" style={{ color: '#b3d4f0' }}>
              <li>📊 Tính cỡ mẫu (Sample Size)</li>
              <li>🔬 Fisher's Exact Test</li>
              <li>📉 Chi-square Pearson</li>
              <li>⚖️ Hiệu chỉnh Yates</li>
              <li className="italic" style={{ color: '#6ab0d8' }}>🔜 Sắp ra mắt: t-test, ANOVA, ROC…</li>
            </ul>
          </div>

          {/* Thông tin */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#7ec8f0' }}>
              Thông tin
            </h4>
            <ul className="text-sm space-y-2" style={{ color: '#b3d4f0' }}>
              <li className="flex items-center gap-2">
                <Mail size={14} />
                biostatcalc@example.com
              </li>
              <li className="flex items-center gap-2">
                🐙 github.com/biostatcalc
              </li>
              <li className="flex items-center gap-2 mt-3">
                <span
                  className="px-2 py-0.5 text-xs rounded-full"
                  style={{ background: 'rgba(0,175,239,0.25)', color: '#7ec8f0' }}
                >
                  Phiên bản 1.0.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#7ec8f0' }}
        >
          <span>
            © {new Date().getFullYear()} Biostatistics Calculator. Tất cả quyền được bảo lưu.
          </span>
          <span className="flex items-center gap-1.5">
            Được xây dựng với <Heart size={14} color="#f87171" fill="#f87171" /> bằng React + Vite + Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  );
}
