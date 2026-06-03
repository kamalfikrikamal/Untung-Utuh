import React, { useState, useMemo, useCallback } from 'react';
import { Star, Play, CheckCircle2, Quote, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import SectionHeader from '../components/ui/SectionHeader';
import SEO from '../components/seo/SEO';
import FadeInSection from '../components/ui/FadeInSection';
import { cn } from '../utils/cn';
import {
  testimonials,
  statsBadge,
  paketOptions,
  kategoriOptions,
  successStories,
  videoTestimonials,
} from '../data/testimonialsData';
import HeroCTA from '../components/layout/HeroCTA';

/* ── Utility Components ─────────────────────────────────── */

function StarRating({ rating, size = 'h-5 w-5' }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`Rating ${rating} dari 5 bintang`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size,
            i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function PaketBadge({ paket }) {
  const styles = {
    Gratis: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Pro: 'bg-emerald-600 text-white border-emerald-700',
    Premium: 'bg-amber-400 text-amber-900 border-amber-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        styles[paket] || styles.Gratis,
      )}
    >
      {paket}
    </span>
  );
}

function FilterButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
        active
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-gray-800',
      )}
    >
      {label}
    </button>
  );
}

/* ── Testimonial Card ───────────────────────────────────── */

function TestimonialCard({ data }) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Header: Avatar + Name + Paket */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={data.avatar}
            alt={`Foto profil ${data.name}`}
            className="h-12 w-12 rounded-full object-cover bg-gray-100 flex-shrink-0"
            loading="lazy"
          />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{data.name}</h3>
            <p className="text-gray-500 text-xs">{data.role}</p>
          </div>
        </div>
        <PaketBadge paket={data.paket} />
      </div>

      {/* Rating */}
      <StarRating rating={data.rating} size="h-4 w-4" />

      {/* Quote */}
      <blockquote className="mt-3 text-gray-600 text-sm leading-relaxed flex-1">
        <Quote className="h-4 w-4 text-emerald-200 inline -ml-0.5 mr-0.5" aria-hidden="true" />
        {data.quote}
      </blockquote>

      {/* Since */}
      <p className="mt-4 text-xs text-gray-400">{data.since}</p>
    </div>
  );
}

/* ── Success Story Card ─────────────────────────────────── */

function SuccessStoryCard({ story, index }) {
  return (
    <FadeInSection delay={index * 150}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-2/5 flex-shrink-0">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-56 md:h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            {story.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" />
                Verified Seller
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">{story.title}</h3>

          <blockquote className="text-gray-600 text-sm leading-relaxed">
            <Quote className="h-4 w-4 text-emerald-200 inline -ml-0.5 mr-0.5" aria-hidden="true" />
            {story.quote}
          </blockquote>

          <p className="mt-4 text-sm font-medium text-gray-500">— {story.owner}</p>
        </div>
      </div>
    </FadeInSection>
  );
}

/* ── Video Card ─────────────────────────────────────────── */

function VideoCard({ video }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={`Thumbnail video testimoni ${video.speaker}`}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Play className="h-6 w-6 text-emerald-600 ml-0.5" />
        </div>
      </div>

      {/* Duration Badge */}
      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-medium">
        {video.duration}
      </span>

      {/* Info */}
      <div className="absolute bottom-3 left-3 right-16">
        <p className="text-white text-sm font-semibold drop-shadow-sm">{video.speaker}</p>
        <p className="text-white/80 text-xs drop-shadow-sm">{video.title}</p>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */

export default function Testimoni() {
  const [filterPaket, setFilterPaket] = useState('Semua');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchPaket = filterPaket === 'Semua' || t.paket === filterPaket;
      const matchKategori = filterKategori === 'Semua' || t.kategori === filterKategori;
      return matchPaket && matchKategori;
    });
  }, [filterPaket, filterKategori]);

  const resetFilters = useCallback(() => {
    setFilterPaket('Semua');
    setFilterKategori('Semua');
  }, []);

  return (
    <>
      <SEO
        title="Testimoni Pengguna"
        description="Lihat bagaimana ribuan UMKM Indonesia menghemat biaya dan meningkatkan penjualan dengan Untung Utuh."
        url="/testimoni"
      />

      <div className="flex flex-col w-full">
        {/* ── Hero Section ─────────────────────────────────── */}
        <section className="relative px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-28 lg:px-8 flex flex-col items-center text-center overflow-hidden bg-white">
          {/* BG Decorative */}
          <div className="pointer-events-none absolute -top-48 -right-48 h-[520px] w-[520px] rounded-full bg-emerald-100/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-48 h-96 w-96 rounded-full bg-emerald-50/70 blur-3xl" />
          <div className="pointer-events-none absolute top-28 left-1/3 h-60 w-60 rounded-full bg-emerald-50/60 blur-2xl" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Apa Kata{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                Mereka?
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-light">
              Ribuan UMKM Indonesia sudah beralih dan merasakan perbedaannya.
            </p>

            {/* Stats Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {statsBadge.map((stat) => (
                <div
                  key={stat.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold shadow-sm"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {stat.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Filter Section ───────────────────────────────── */}
        <section className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Paket Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
                  Paket:
                </span>
                {paketOptions.map((opt) => (
                  <FilterButton
                    key={opt}
                    label={opt}
                    active={filterPaket === opt}
                    onClick={() => setFilterPaket(opt)}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-gray-200" />

              {/* Kategori Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">
                  Kategori:
                </span>
                {kategoriOptions.map((opt) => (
                  <FilterButton
                    key={opt}
                    label={opt}
                    active={filterKategori === opt}
                    onClick={() => setFilterKategori(opt)}
                  />
                ))}
              </div>

              {/* Reset */}
              {(filterPaket !== 'Semua' || filterKategori !== 'Semua') && (
                <button
                  onClick={resetFilters}
                  className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                  aria-label="Reset semua filter"
                >
                  <X className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Testimonial Grid ─────────────────────────────── */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Result count */}
            <p className="text-sm text-gray-500 mb-6" aria-live="polite">
              Menampilkan {filteredTestimonials.length} dari {testimonials.length} testimoni
            </p>

            {filteredTestimonials.length === 0 ? (
              <div className="text-center py-16">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada testimoni</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Coba ubah filter untuk melihat lebih banyak hasil.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-emerald-600 font-medium text-sm hover:underline"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((testimonial, idx) => (
                  <FadeInSection key={testimonial.id} delay={(idx % 9) * 100}>
                    <TestimonialCard data={testimonial} />
                  </FadeInSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Success Stories ──────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              badge="Success Stories"
              title="Kisah Sukses Pengguna Untung Utuh"
              subtitle="Cerita nyata dari UMKM yang berhasil mengembangkan usahanya bersama kami."
            />

            <div className="flex flex-col gap-8">
              {successStories.map((story, idx) => (
                <SuccessStoryCard key={story.id} story={story} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Video Testimoni ──────────────────────────────── */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="Video Testimoni"
              title="Dengar Langsung dari Mereka"
              subtitle="Simak pengalaman pengguna Untung Utuh dalam video singkat."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((video) => (
                <FadeInSection key={video.id}>
                  <VideoCard video={video} />
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────────── */}
        <HeroCTA />
      </div>
    </>
  );
}
