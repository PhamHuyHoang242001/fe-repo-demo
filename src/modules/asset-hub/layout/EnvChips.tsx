import React from 'react';

// Chip môi trường (visual) — lấy từ process.env.NODE_ENV (dotenv-webpack inject),
// chỉ hiện MỘT chip đúng môi trường build, không hardcode mảng nhiều env.
// production nhấn mạnh (viền + chữ đỏ + dot có glow).
interface EnvStyle {
  label: string;
  dot: string; // class nền dot
  emphasize?: boolean;
}

// Map NODE_ENV → hiển thị. Giá trị lạ → fallback nhãn viết hoa, style trung tính.
const ENV_MAP: Record<string, EnvStyle> = {
  development: { label: 'DEV', dot: 'bg-ah-green' },
  test: { label: 'TEST', dot: 'bg-ah-amber' },
  staging: { label: 'UAT', dot: 'bg-ah-amber' },
  production: { label: 'PROD', dot: 'bg-ah-red', emphasize: true },
};

const nodeEnv = (process.env.NODE_ENV || 'development').toLowerCase();
const env: EnvStyle = ENV_MAP[nodeEnv] || { label: nodeEnv.toUpperCase(), dot: 'bg-ah-muted' };

const EnvChips: React.FC = () => (
  <span
    className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide md:inline-flex ${
      env.emphasize ? 'border-ah-red/25 bg-ah-red/[0.04] text-ah-red' : 'border-ah-line bg-ah-card text-ah-muted'
    }`}
  >
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${env.dot} ${
        env.emphasize ? 'shadow-[0_0_0_3px_rgba(122,31,43,0.12)]' : ''
      }`}
      aria-hidden
    />
    {env.label}
  </span>
);

export default EnvChips;
