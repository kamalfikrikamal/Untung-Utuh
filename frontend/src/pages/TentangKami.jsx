import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import FadeInSection from '../components/ui/FadeInSection';
import SEO from '../components/seo/SEO';
import {
  ArrowRight,
  Target,
  Heart,
  Eye,
  ShieldCheck,
  Zap,
  Users,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

import {
  story,
  visionMission,
  values,
  impactStats,
  team,
  partners,
  cta,
  seo,
} from '../data/aboutData';
import HeroCTA from '../components/layout/HeroCTA';

/* ── Icon Resolver ──────────────────────────────────────── */

const iconMap = { Target, Heart, Eye, ShieldCheck, Zap, Users, Lightbulb };
function resolveIcon(name) {
  return iconMap[name] || Target;
}

/* ── CountUp Hook (intersection + ease-out cubic) ───────── */

function useCountUp(rawValue, duration = 2000) {
  const [display, setDisplay] = useState(rawValue);
  const ref = useRef(null);
  const ran = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ran.current) {
          ran.current = true;
          const end = parseInt(rawValue.replace(/[^0-9]/g, ''), 10);
          if (Number.isNaN(end)) return;
          const start = performance.now();
          (function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const current = Math.floor(eased * end);
            setDisplay(
              rawValue.includes('M+')
                ? `Rp ${current.toLocaleString('id-ID')}M+`
                : rawValue.includes('%')
                  ? `${current}%`
                  : `${current.toLocaleString('id-ID')}+`
            );
            if (p < 1) requestAnimationFrame(tick);
          })(start);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rawValue, duration]);

  return { display, ref };
}

export default function TentangKami() {
  return (
    <>
      <SEO title={seo.title} description={seo.description} url={seo.url} />

      <div className="flex flex-col w-full">
        {/* ═══════════════════════════════════════════════════════
            Cerita Kami — 2-col, matches Landing spacing/style
            ═══════════════════════════════════════════════════════ */}
        <FadeInSection>
          <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <SectionHeader title={story.title} subtitle={story.subtitle} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary-100 via-primary-50 to-emerald-100 border border-primary-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary-200/70 flex items-center justify-center mb-4">
                      <Users className="h-10 w-10 text-primary-600" />
                    </div>
                    <p className="text-primary-700 font-medium text-sm">Ilustrasi Tim & UMKM</p>
                    <p className="text-primary-500 text-xs mt-1">{story.imageAlt}</p>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" aria-hidden="true">
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-primary-600" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {story.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={idx === 0 ? 'text-gray-600 leading-relaxed text-lg' : 'text-gray-500 leading-relaxed'}
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ═══════════════════════════════════════════════════════
            Visi & Misi — 3-col cards, matches Landing "Why Us"
            ═══════════════════════════════════════════════════════ */}
        <FadeInSection>
          <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                badge="Visi & Misi"
                title="Arah dan Tujuan Kami"
                subtitle="Tiga pilar yang menuntun setiap langkah Untung Utuh."
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {visionMission.map((item, idx) => {
                  const Icon = resolveIcon(item.icon);
                  return (
                    <FadeInSection key={item.title} delay={idx * 150}>
                      <div
                        className="flex flex-col p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                      >
                        <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-primary-700 font-semibold text-sm mb-3 leading-snug">
                          {item.highlight}
                        </p>
                        <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
                      </div>
                    </FadeInSection>
                  );
                })}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ═══════════════════════════════════════════════════════
            Nilai-Nilai — horizontal icon+text cards, matches
            Landing "Value Proposition" grid
            ═══════════════════════════════════════════════════════ */}
        <FadeInSection>
          <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                badge="Nilai-Nilai Kami"
                title="Prinsip yang Kami Pegang Teguh"
                subtitle="Empat pilar yang menjadi fondasi setiap fitur dan keputusan kami."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {values.map((val, idx) => {
                  const Icon = resolveIcon(val.icon);
                  return (
                    <FadeInSection key={val.title} delay={idx * 150}>
                      <div
                        className="flex gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className={`h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`h-5 w-5 text-emerald-600`} />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 mb-1">{val.title}</h3>
                          <p className={`text-sm font-semibold mb-1.5 text-emerald-600`}>{val.tagline}</p>
                          <p className="text-gray-500 text-sm leading-relaxed">{val.description}</p>
                        </div>
                      </div>
                    </FadeInSection>
                  );
                })}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* ═══════════════════════════════════════════════════════
            Impact — 3-col stats, count-up on scroll
            ═══════════════════════════════════════════════════════
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Dampak"
              title="Impact Kami"
              subtitle="Angka berbicara lebih keras — inilah hasil nyata yang sudah kami capai."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              {impactStats.map((stat) => (
                <ImpactCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </section>
        */}

        {/* ═══════════════════════════════════════════════════════
            Tim Kami — 3-col profile cards, matches Landing
            ═══════════════════════════════════════════════════════
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Tim Kami"
              title="Kenali Orang di Balik Untung Utuh"
              subtitle="Kami adalah para pembangun yang peduli pada nasib UMKM Indonesia."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <div
                    className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center text-white text-2xl font-bold mb-4`}
                    aria-label={`Foto profil ${member.name}`}
                  >
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-medium text-primary-600 mt-1 mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        */}

        {/* ═══════════════════════════════════════════════════════
            Mitra & Komunitas — logo grid + community badge
            ═══════════════════════════════════════════════════════
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Mitra & Komunitas"
              title="Didukung oleh Platform Terbaik"
              subtitle="Kami bekerja sama dengan layanan terpercaya untuk pengalaman terbaik."
            />

            <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex flex-col items-center gap-3 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-md transition-all duration-200 min-w-[180px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                    <span className="text-2xl font-extrabold text-primary-600">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{partner.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                    {partner.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center p-8 rounded-3xl bg-primary-50 border border-primary-100">
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Bergabung dengan Komunitas Seller</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                Ribuan UMKM sudah saling berbagi tips dan pengalaman di grup WhatsApp kami.
              </p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 underline underline-offset-2 transition-colors"
              >
                Gabung Grup WhatsApp Komunitas
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>
        */}

        {/* ═══════════════════════════════════════════════════════
            CTA Banner — emerald, matches Landing CTA exactly
            ═══════════════════════════════════════════════════════ */}
        <FadeInSection>
          <HeroCTA />
        </FadeInSection>

      </div>
    </>
  );
}

/* ── Impact Card (count-up on scroll) ───────────────────── */

function ImpactCard({ stat }) {
  const { display, ref } = useCountUp(stat.value);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm"
    >
      <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-600 mb-2">
        {display}
      </p>
      <p className="text-sm font-semibold text-gray-900 mb-2">{stat.label}</p>
      <p className="text-gray-500 text-xs leading-relaxed max-w-xs">{stat.description}</p>
    </div>
  );
}
