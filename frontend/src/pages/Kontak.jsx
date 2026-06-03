import React, { useState, useEffect, useRef, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import {
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  Home,
  Users,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import SEO from '../components/seo/SEO';
import SectionHeader from '../components/ui/SectionHeader';
import { cn } from '../utils/cn';
import {
  contactInfo,
  subjectOptions,
  businessCategoryOptions,
  faqItems,
  communityLinks,
  successMessage,
  seo,
} from '../data/contactData';

/* ------------------------------------------------------------------ */
/*  Zod validation schema                                              */
/* ------------------------------------------------------------------ */
const contactSchema = z.object({
  name: z
    .string({ message: 'Nama lengkap wajib diisi' })
    .min(3, 'Nama lengkap minimal 3 karakter'),
  email: z
    .string({ message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  subject: z
    .string({ message: 'Silakan pilih subjek' })
    .refine((v) => v !== '', { message: 'Silakan pilih subjek' }),
  businessCategory: z.string().optional(),
  message: z
    .string({ message: 'Pesan wajib diisi' })
    .min(10, 'Pesan minimal 10 karakter')
    .max(1000, 'Pesan maksimal 1000 karakter'),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

/* ------------------------------------------------------------------ */
/*  Icon renderer                                                      */
/* ------------------------------------------------------------------ */
function DynamicIcon({ name, className }) {
  const icons = { Mail, Phone, Clock, MessageCircle, Users };
  const Icon = icons[name];
  return Icon ? <Icon className={className} /> : null;
}

/* ------------------------------------------------------------------ */
/*  Contact Card                                                       */
/* ------------------------------------------------------------------ */
function ContactCard({ item, index }) {
  const Wrapper = item.href ? 'a' : 'div';
  const wrapperProps = item.href
    ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <div
      className="group rounded-xl bg-white p-6 shadow-soft border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
        <DynamicIcon name={item.icon} className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-gray-900">{item.title}</h3>
      <Wrapper
        {...wrapperProps}
        className={cn(
          'mb-2 block text-sm font-medium transition-colors',
          item.href
            ? 'text-emerald-600 hover:text-emerald-700 hover:underline'
            : 'text-gray-800',
        )}
      >
        {item.value}
      </Wrapper>
      <p className="text-sm text-gray-500">{item.description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ Accordion                                                      */
/* ------------------------------------------------------------------ */
function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="rounded-lg border border-gray-200 bg-white overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset transition-colors"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <span>{faq.question}</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              )}
            </button>
            <div
              id={`faq-answer-${faq.id}`}
              role="region"
              className={cn(
                'transition-all duration-300 ease-in-out',
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Fade-in section wrapper                                            */
/* ------------------------------------------------------------------ */
function FadeInSection({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Success page after form submission                                 */
/* ------------------------------------------------------------------ */
function SuccessPage({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-gray-900">Pesan Terkirim! 🎉</h3>
      <p className="mb-8 max-w-md text-gray-500">{successMessage}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={onReset} variant="outline">
          Kirim Pesan Lagi
        </Button>
        <Link to="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function Kontak() {
  const [isSuccess, setIsSuccess] = useState(false);
  const formId = useId();
  const honeypotRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      businessCategory: '',
      message: '',
      honeypot: '',
    },
  });

  const messageValue = watch('message', '');
  const charsLeft = 1000 - (messageValue?.length || 0);

  const onSubmit = async (data) => {
    // Honeypot check
    if (data.honeypot) {
      // Bot detected — silently pretend success
      setIsSuccess(true);
      return;
    }

    try {
      // Simulate API call — replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(successMessage, {
        duration: 5000,
        position: 'top-right',
      });
      setIsSuccess(true);
      reset();
    } catch {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.', {
        position: 'top-right',
      });
    }
  };

  return (
    <>
      <SEO
        title={seo.title}
        description={seo.description}
        url={seo.url}
      />

      {/* ================================================================ */}
      {/*  HERO SECTION                                                     */}
      {/* ================================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        {/* Decorative background blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <FadeInSection>
            <div className="mb-6 inline-flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 shadow-sm">
                <MessageCircle className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Hubungi Kami
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 sm:text-xl">
              Tim kami siap membantu Anda. Respons cepat dalam 1x24 jam.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  INFO KONTAK — GRID 3 KOLOM                                       */}
      {/* ================================================================ */}
      <section className="relative -mt-12 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <FadeInSection delay={100}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {contactInfo.map((item, index) => (
                <ContactCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  FORMULIR KONTAK + FAQ                                            */}
      {/* ================================================================ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <FadeInSection>
            <SectionHeader
              badge="Formulir Kontak"
              title="Kirim Pesan kepada Kami"
              subtitle="Isi formulir di bawah ini dan tim kami akan segera merespon pertanyaan Anda."
            />
          </FadeInSection>

          {isSuccess ? (
            <FadeInSection>
              <SuccessPage onReset={() => setIsSuccess(false)} />
            </FadeInSection>
          ) : (
            <FadeInSection delay={100}>
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
                {/* -------- FORM (kiri, 3/5 lebar di desktop) -------- */}
                <div className="lg:col-span-3">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-6 rounded-xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8 shadow-soft"
                  >
                    {/* Honeypot — hidden from real users */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <label htmlFor={`${formId}-hp`}>Jangan diisi</label>
                      <input
                        id={`${formId}-hp`}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register('honeypot')}
                      />
                    </div>

                    {/* NAMA */}
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-name`}>
                        Nama Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id={`${formId}-name`}
                        type="text"
                        placeholder="Masukkan nama lengkap Anda"
                        aria-label="Nama Lengkap"
                        aria-required="true"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? `${formId}-name-err` : undefined}
                        className={cn(
                          'flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50',
                          errors.name
                            ? 'border-red-400 focus-visible:ring-red-500'
                            : 'border-gray-300',
                        )}
                        {...register('name')}
                      />
                      {errors.name && (
                        <p id={`${formId}-name-err`} className="text-xs text-red-500" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-email`}>
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id={`${formId}-email`}
                        type="email"
                        placeholder="nama@email.com"
                        aria-label="Email"
                        aria-required="true"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? `${formId}-email-err` : undefined}
                        className={cn(
                          'flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50',
                          errors.email
                            ? 'border-red-400 focus-visible:ring-red-500'
                            : 'border-gray-300',
                        )}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p id={`${formId}-email-err`} className="text-xs text-red-500" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* SUBJEK */}
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-subject`}>
                        Subjek <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id={`${formId}-subject`}
                        aria-label="Subjek"
                        aria-required="true"
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? `${formId}-subject-err` : undefined}
                        className={cn(
                          'flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50',
                          errors.subject
                            ? 'border-red-400 focus-visible:ring-red-500'
                            : 'border-gray-300',
                        )}
                        {...register('subject')}
                      >
                        {subjectOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p id={`${formId}-subject-err`} className="text-xs text-red-500" role="alert">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    {/* KATEGORI USAHA */}
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-category`}>
                        Kategori Usaha <span className="text-gray-400 font-normal">(opsional)</span>
                      </Label>
                      <select
                        id={`${formId}-category`}
                        aria-label="Kategori Usaha"
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        {...register('businessCategory')}
                      >
                        {businessCategoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PESAN */}
                    <div className="space-y-2">
                      <Label htmlFor={`${formId}-message`}>
                        Pesan <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id={`${formId}-message`}
                        rows={5}
                        placeholder="Ceritakan kebutuhan atau pertanyaan Anda secara detail..."
                        aria-label="Pesan"
                        aria-required="true"
                        aria-invalid={!!errors.message}
                        aria-describedby={
                          errors.message
                            ? `${formId}-message-err`
                            : `${formId}-char-count`
                        }
                        className={cn(
                          'flex w-full rounded-lg border bg-white px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y min-h-[120px]',
                          errors.message
                            ? 'border-red-400 focus-visible:ring-red-500'
                            : 'border-gray-300',
                        )}
                        {...register('message')}
                      />
                      <div className="flex items-center justify-between">
                        {errors.message ? (
                          <p id={`${formId}-message-err`} className="text-xs text-red-500" role="alert">
                            {errors.message.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <p
                          id={`${formId}-char-count`}
                          className={cn(
                            'text-xs',
                            charsLeft < 0 ? 'text-red-500 font-medium' : 'text-gray-400',
                          )}
                        >
                          {charsLeft} karakter tersisa
                        </p>
                      </div>
                    </div>

                    {/* SUBMIT */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {!isSubmitting && (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* -------- FAQ + KOMUNITAS (kanan, 2/5 lebar di desktop) -------- */}
                <div className="lg:col-span-2 space-y-8">
                  {/* FAQ CEPAT */}
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      FAQ Cepat
                    </h3>
                    <FAQAccordion items={faqItems} />
                    <div className="mt-4 text-center">
                      <Link
                        to="/faq"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                      >
                        Lihat FAQ Lengkap
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* KOMUNITAS KAMI */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 shadow-soft">
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Komunitas Kami
                    </h3>
                    <p className="mb-4 text-sm text-gray-500">
                      Bergabung dengan sesama seller UMKM untuk diskusi, tips, dan
                      sharing pengalaman.
                    </p>
                    <div className="space-y-3">
                      {communityLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <DynamicIcon name={link.icon} className="h-5 w-5 text-emerald-600" />
                          <span>{link.label}</span>
                          <ArrowRight className="ml-auto h-4 w-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          )}
        </div>
      </section>

      {/* ================================================================ */}
      {/*  CTA ALTERNATIF — WhatsApp                                        */}
      {/* ================================================================ */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30">
        <FadeInSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Lebih suka chat?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-gray-500">
              Hubungi kami via WhatsApp untuk respons lebih cepat. Tim kami siap
              membantu secara langsung!
            </p>
            <div className="mt-8">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                <Phone className="h-5 w-5" />
                Chat Via WhatsApp
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
