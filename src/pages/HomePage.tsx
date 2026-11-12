import { BarChart2, FlaskConical, GitFork, ArrowRight, Atom, BookOpen, Star } from 'lucide-react';
import type { TabType } from '../components/Navbar';

interface HomePageProps {
  onTabChange: (tab: TabType) => void;
}

const features = [
  {
    id: 'sample-size' as TabType,
    icon: <BarChart2 size={28} />,
    title: 'Tính cỡ mẫu',
    subtitle: 'Sample Size Calculator',
    desc: 'Tính cỡ mẫu cần thiết cho nghiên cứu khoa học dựa trên tỷ lệ dương tính, sai số mong muốn và mức độ tin cậy.',
    tags: ['Nghiên cứu cắt ngang', 'Khảo sát', 'Dịch tễ học'],
    color: '#1f5ca9',
    bg: 'linear-gradient(135deg, #e8f1fc 0%, #cde3f7 100%)',
  },
  {
    id: 'fisher' as TabType,
    icon: <FlaskConical size={28} />,
    title: "Fisher's Exact Test",
    subtitle: "Kiểm định chính xác Fisher",
    desc: "Kiểm định chính xác cho bảng phân phối tần số. Hỗ trợ bảng 2×2 và bảng m×n (Monte Carlo). Tính Odds Ratio và khoảng tin cậy 95%.",
    tags: ['Bảng 2×2', 'Bảng m×n', 'Monte Carlo', 'Odds Ratio'],
    color: '#0891b2',
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  },
  {
    id: 'chi-square' as TabType,
    icon: <GitFork size={28} />,
    title: 'Chi-square & Yates',
    subtitle: 'Pearson χ² & Yates Correction',
    desc: 'Kiểm định Chi-square Pearson và hiệu chỉnh Yates. Tự động lựa chọn phương pháp phù hợp, hiển thị tần số kỳ vọng và cảnh báo điều kiện áp dụng.',
    tags: ['Pearson χ²', 'Hiệu chỉnh Yates', 'Expected Freq.', 'Xuất PDF/Excel'],
    color: '#0d9488',
    bg: 'linear-gradient(135deg, #e6f7f5 0%, #ccf0eb 100%)',
  },
];

const stats = [
  { value: '3', label: 'Công cụ thống kê', icon: <Atom size={20} /> },
  { value: '100%', label: 'Độ chính xác', icon: <Star size={20} /> },
  { value: 'Miễn phí', label: 'Hoàn toàn miễn phí', icon: <BookOpen size={20} /> },
];

export default function HomePage({ onTabChange }: HomePageProps) {
  return (
    <div className="animate-fadeIn">
      {/* Hero Banner */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '520px',
          background: 'linear-gradient(135deg, #0d3572 0%, #1f5ca9 45%, #007ab5 100%)',
          backgroundImage: `linear-gradient(135deg, rgba(13,53,114,0.92) 0%, rgba(31,92,169,0.88) 45%, rgba(0,122,181,0.92) 100%), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: 500, height: 500, background: '#fff',
            top: -120, right: -80,
          }}
        />
        <div
          className="absolute rounded-full opacity-10"
          style={{
            width: 300, height: 300, background: '#00afef',
            bottom: -80, left: -60,
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center text-white">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-scaleIn"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <Atom size={16} />
            Công cụ thống kê sinh học chuyên nghiệp
          </div>

          <h1
            className="font-black mb-4 leading-tight animate-fadeIn"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.01em' }}
          >
            BIOSTATISTICS
            <br />
            <span style={{ color: '#7dd3fc' }}>CALCULATOR</span>
          </h1>

          <p
            className="max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.85)' }}
          >
            Công cụ hỗ trợ tính toán thống kê trong nghiên cứu khoa học, dịch tễ học, y học và thú y.
            Chính xác, miễn phí và dễ sử dụng.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onTabChange('sample-size')}
              className="btn-primary text-base px-8 py-3"
              style={{ background: '#fff', color: '#1f5ca9', fontWeight: 700, fontSize: '1rem' }}
            >
              <ArrowRight size={18} />
              Bắt đầu ngay
            </button>
            <button
              onClick={() => onTabChange('guide')}
              className="btn-secondary text-base px-8 py-3"
              style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              <BookOpen size={18} />
              Hướng dẫn sử dụng
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#fff', borderBottom: '1.5px solid #e0eaf5' }}>
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center gap-2 justify-center text-center sm:text-left">
              <span style={{ color: '#1f5ca9' }}>{s.icon}</span>
              <div>
                <div className="font-bold text-xl" style={{ color: '#1f5ca9' }}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3" style={{ color: '#1f5ca9' }}>
            Công cụ thống kê
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Ba công cụ thống kê sinh học quan trọng nhất, được thiết kế dành cho nghiên cứu khoa học chuyên nghiệp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.id}
              className="card group cursor-pointer animate-fadeIn hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
              onClick={() => onTabChange(f.id)}
            >
              {/* Icon area */}
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>

              <h3 className="font-bold text-lg mb-1" style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className="text-xs font-medium mb-3 text-gray-400">{f.subtitle}</p>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{f.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {f.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all"
                style={{ color: f.color }}
              >
                Sử dụng ngay <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Info section */}
      <section style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1f5ca9' }}>
                Tại sao chọn Biostatistics Calculator?
              </h2>
              <div className="space-y-4">
                {[
                  { icon: '🎯', title: 'Chính xác theo tiêu chuẩn học thuật', desc: 'Tất cả công thức được xây dựng theo nguyên lý thống kê sinh học chuẩn xác.' },
                  { icon: '🔄', title: 'Tự động lựa chọn phương pháp', desc: 'Hệ thống tự động kiểm tra điều kiện và chọn phương pháp kiểm định phù hợp.' },
                  { icon: '📋', title: 'Xuất kết quả đa dạng', desc: 'Xuất kết quả dưới dạng PDF, Excel hoặc sao chép nhanh.' },
                  { icon: '🌐', title: 'Giao diện tiếng Việt', desc: 'Toàn bộ giao diện và diễn giải kết quả bằng tiếng Việt, dễ hiểu.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm" style={{ color: '#1f5ca9' }}>{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)', color: '#fff' }}>
              <h3 className="font-bold text-xl mb-2">Phù hợp cho</h3>
              <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.8)' }}>
                Công cụ được thiết kế cho nhiều đối tượng người dùng trong lĩnh vực khoa học
              </p>
              {[
                '🎓 Sinh viên đại học và sau đại học',
                '👨‍🏫 Giảng viên và giáo viên',
                '🔬 Nhà nghiên cứu khoa học',
                '🏥 Bác sĩ và dược sĩ',
                '🐾 Bác sĩ thú y',
                '📊 Chuyên gia dịch tễ học',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 py-2 border-b text-sm"
                  style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
