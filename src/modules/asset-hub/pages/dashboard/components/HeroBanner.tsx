// Dashboard hero band — forest gradient + CTA to the Skill / Prompt workspaces.
// Mirrors mock.html's hero: eyebrow pill, bold title, subtitle, two action buttons.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Reveal } from '../../skill/components/motion-primitives';
import { springSnappy } from '../../../theme/motion';
import { SURFACE_HERO } from '../../../theme/surfaces';
import { Icon } from '../../../layout/icons';

const HeroBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Reveal>
      <div className={`relative overflow-hidden rounded-2xl p-6 shadow-ah-float sm:p-8 ${SURFACE_HERO}`}>
        {/* Decorative oversized glyph, clipped by the rounded frame. */}
        <div className="pointer-events-none absolute -bottom-10 -right-8 opacity-10">
          <Icon name="governance" className="h-56 w-56" strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="mb-3 inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-white/90 backdrop-blur-sm">
            Enterprise Data &amp; Analytics Division
          </span>
          <h1 className="mb-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Quản lý Tài nguyên AI Hub</h1>
          <p className="mb-6 max-w-xl text-sm font-light leading-relaxed text-white/80 sm:text-[15px]">
            Khám phá, đóng góp và phê duyệt các gói Skill Packages &amp; Prompts chuẩn hóa cho toàn ngân hàng.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={() => navigate('/asset-hub/skill')}
              whileHover={{ y: -2, transition: springSnappy }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ah-green-d shadow-md transition-shadow hover:shadow-ah-glow"
            >
              <Icon name="skill" className="h-4 w-4" /> Khám phá Skills
            </motion.button>
            <motion.button
              type="button"
              onClick={() => navigate('/asset-hub/prompt')}
              whileHover={{ y: -2, transition: springSnappy }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Icon name="prompt" className="h-4 w-4" /> Khám phá Prompts
            </motion.button>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default HeroBanner;
