import { Info, Target, Code2, Users, Star, Layers, Mail, Globe, GitBranch } from 'lucide-react';

const teamMembers = [
  {
    name: 'Nhóm phát triển Biostatistics Calculator',
    role: 'Nhà phát triển & Nhà thống kê sinh học',
    desc: 'Nhóm gồm các chuyên gia thống kê sinh học, lập trình viên và nhà nghiên cứu y học. Thông tin tác giả cụ thể sẽ được cập nhật tại đây.',
    avatar: '👨‍💻',
  },
];

const versions = [
  {
    version: '1.0.0',
    date: '2025',
    changes: [
      'Tính cỡ mẫu theo công thức chuẩn',
      "Fisher's Exact Test (2×2 và m×n Monte Carlo)",
      'Chi-square Pearson và Hiệu chỉnh Yates',
      'Xuất kết quả PDF và Excel',
      'Giao diện tiếng Việt hoàn chỉnh',
    ],
    status: 'stable',
  },
  {
    version: '1.1.0',
    date: 'Sắp ra mắt',
    changes: [
      'Kiểm định t-test một mẫu và hai mẫu',
      'ANOVA một chiều',
      'Mann–Whitney U Test',
      'Kruskal–Wallis Test',
    ],
    status: 'upcoming',
  },
  {
    version: '2.0.0',
    date: 'Kế hoạch',
    changes: [
      'Hồi quy logistic',
      'Đường cong ROC',
      'Kaplan–Meier Survival Analysis',
      'Tương quan Pearson và Spearman',
      'Xuất báo cáo APA format',
    ],
    status: 'planned',
  },
];

const techStack = [
  { name: 'React 19', desc: 'Framework UI hiện đại', emoji: '⚛️' },
  { name: 'Vite', desc: 'Build tool siêu nhanh', emoji: '⚡' },
  { name: 'Tailwind CSS 4', desc: 'Utility-first CSS', emoji: '🎨' },
  { name: 'KaTeX', desc: 'Hiển thị công thức toán', emoji: '📐' },
  { name: 'jsPDF', desc: 'Xuất file PDF', emoji: '📄' },
  { name: 'SheetJS (XLSX)', desc: 'Xuất file Excel', emoji: '📊' },
  { name: 'TypeScript', desc: 'Type-safe JavaScript', emoji: '🔷' },
  { name: 'Lucide Icons', desc: 'Bộ icon hiện đại', emoji: '✨' },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center rounded-2xl w-20 h-20 mb-4"
          style={{ background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)' }}
        >
          <Info size={36} color="#fff" />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1f5ca9' }}>
          Giới thiệu
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Về Biostatistics Calculator – công cụ thống kê sinh học trực tuyến miễn phí
        </p>
      </div>

      {/* About the project */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: '#e8f1fc', color: '#1f5ca9' }}
          >
            <Globe size={20} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#1f5ca9' }}>
            Về dự án
          </h2>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed space-y-3">
          <p>
            <strong>Biostatistics Calculator</strong> là công cụ tính toán thống kê sinh học trực tuyến,
            được xây dựng nhằm hỗ trợ sinh viên, giảng viên và nhà nghiên cứu trong các lĩnh vực{' '}
            <strong>y học, thú y, dịch tễ học và sinh học</strong> thực hiện các phép tính thống kê
            một cách nhanh chóng, chính xác và dễ dàng.
          </p>
          <p>
            Tất cả các thuật toán được xây dựng từ đầu (from scratch) dựa trên các nguyên lý thống kê
            học thuật chuẩn xác, không sử dụng xấp xỉ gần đúng khi đã có thuật toán chính xác.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { v: '100%', l: 'Miễn phí' },
              { v: '3+', l: 'Công cụ thống kê' },
              { v: 'VI', l: 'Giao diện tiếng Việt' },
              { v: '∞', l: 'Không giới hạn' },
            ].map((s) => (
              <div
                key={s.l}
                className="text-center p-3 rounded-xl"
                style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
              >
                <div className="font-black text-2xl" style={{ color: '#1f5ca9' }}>
                  {s.v}
                </div>
                <div className="text-xs text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mục tiêu */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: '#e8f1fc', color: '#1f5ca9' }}
          >
            <Target size={20} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#1f5ca9' }}>
            Mục tiêu phát triển
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Chính xác học thuật',
              desc: 'Tất cả công thức đúng theo tiêu chuẩn thống kê sinh học quốc tế.',
            },
            {
              icon: '🌐',
              title: 'Tiếng Việt hoàn chỉnh',
              desc: 'Giao diện và diễn giải kết quả hoàn toàn bằng tiếng Việt.',
            },
            {
              icon: '📱',
              title: 'Responsive 100%',
              desc: 'Hoạt động tốt trên mọi thiết bị: máy tính, tablet, điện thoại.',
            },
            {
              icon: '🔓',
              title: 'Mã nguồn mở',
              desc: 'Sẵn sàng cho cộng đồng đóng góp và bổ sung thêm phép kiểm định.',
            },
            {
              icon: '⚡',
              title: 'Hiệu năng cao',
              desc: 'Tính toán nhanh, giao diện mượt mà, không cần cài đặt.',
            },
            {
              icon: '🔬',
              title: 'Mở rộng dễ dàng',
              desc: 'Kiến trúc mô-đun, dễ bổ sung t-test, ANOVA, ROC và các công cụ khác.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-3 p-3 rounded-xl"
              style={{ background: '#f8fbff', border: '1.5px solid #e0eaf5' }}
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-semibold text-sm" style={{ color: '#1f5ca9' }}>
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: '#e8f1fc', color: '#1f5ca9' }}
          >
            <Users size={20} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#1f5ca9' }}>
            Nhóm phát triển
          </h2>
        </div>
        {teamMembers.map((m) => (
          <div
            key={m.name}
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{ background: '#f0f7ff', border: '1.5px solid #c0d8f0' }}
          >
            <div
              className="text-4xl flex items-center justify-center rounded-xl w-14 h-14 shrink-0"
              style={{ background: '#fff' }}
            >
              {m.avatar}
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#1f5ca9' }}>{m.name}</h3>
              <p className="text-xs text-blue-500 mb-1">{m.role}</p>
              <p className="text-sm text-gray-600">{m.desc}</p>
            </div>
          </div>
        ))}
        <div
          className="mt-4 p-3 rounded-xl text-sm text-center flex items-center justify-center gap-2"
          style={{ background: '#f3f4f6', color: '#6b7280' }}
        >
          <Mail size={14} />
          Liên hệ: biostatcalc@example.com
        </div>
      </div>

      {/* Phiên bản */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: '#e8f1fc', color: '#1f5ca9' }}
          >
            <GitBranch size={20} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#1f5ca9' }}>
            Lịch sử phiên bản
          </h2>
        </div>
        <div className="space-y-4">
          {versions.map((v) => (
            <div
              key={v.version}
              className="p-4 rounded-xl"
              style={{
                background: v.status === 'stable' ? '#ecfdf5' : v.status === 'upcoming' ? '#fffbeb' : '#f5f3ff',
                border: `1.5px solid ${v.status === 'stable' ? '#6ee7b7' : v.status === 'upcoming' ? '#fcd34d' : '#c4b5fd'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-black text-base"
                  style={{
                    color: v.status === 'stable' ? '#059669' : v.status === 'upcoming' ? '#d97706' : '#7c3aed',
                  }}
                >
                  v{v.version}
                </span>
                <span className="text-xs text-gray-500">{v.date}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ml-auto ${
                    v.status === 'stable'
                      ? 'bg-green-100 text-green-700'
                      : v.status === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {v.status === 'stable' ? '✅ Ổn định' : v.status === 'upcoming' ? '🔜 Sắp ra mắt' : '📋 Kế hoạch'}
                </span>
              </div>
              <ul className="space-y-1">
                {v.changes.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-gray-700">
                    <span style={{ color: v.status === 'stable' ? '#059669' : v.status === 'upcoming' ? '#d97706' : '#7c3aed' }}>
                      •
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: '#e8f1fc', color: '#1f5ca9' }}
          >
            <Code2 size={20} />
          </div>
          <h2 className="text-lg font-bold" style={{ color: '#1f5ca9' }}>
            Công nghệ sử dụng
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map((t) => (
            <div
              key={t.name}
              className="p-3 rounded-xl text-center"
              style={{ background: '#f8fbff', border: '1.5px solid #e0eaf5' }}
            >
              <div className="text-2xl mb-1">{t.emoji}</div>
              <div className="font-semibold text-sm" style={{ color: '#1f5ca9' }}>{t.name}</div>
              <div className="text-xs text-gray-400">{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sắp ra mắt */}
      <div
        className="card"
        style={{ background: 'linear-gradient(135deg, #0d3572 0%, #1f5ca9 100%)', color: '#fff' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl w-10 h-10"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Layers size={20} color="#fff" />
          </div>
          <h2 className="text-lg font-bold text-white">Lộ trình phát triển</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            ['🔬', 'Kiểm định t-test (một và hai mẫu)'],
            ['📊', 'ANOVA một chiều và hai chiều'],
            ['📈', 'Mann–Whitney U Test'],
            ['📉', 'Kruskal–Wallis Test'],
            ['📐', 'Hồi quy logistic'],
            ['🔴', 'Đường cong ROC & AUC'],
            ['📅', 'Kaplan–Meier Survival Analysis'],
            ['🔗', 'Tương quan Pearson và Spearman'],
          ].map(([icon, name]) => (
            <div
              key={name}
              className="flex items-center gap-2 py-2 px-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <Star size={12} color="#fbbf24" fill="#fbbf24" />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {icon} {name}
              </span>
            </div>
          ))}
        </div>
        <p
          className="text-xs mt-4 text-center"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          Tất cả tính năng sẽ được bổ sung trong các phiên bản tiếp theo.
        </p>
      </div>
    </div>
  );
}
