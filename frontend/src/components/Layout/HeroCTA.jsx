import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import {cta} from '../../data/aboutData';

const HeroCTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 px-8 py-14 sm:px-16 text-center overflow-hidden shadow-2xl">
          <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5" />

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {cta.title}
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg font-light max-w-md mx-auto leading-relaxed">
                {cta.subtitle}
              </p>
            </div>

            <Link to={cta.buttonLink}>
              <Button
                size="lg"
                className="text-base px-10 bg-white text-emerald-700 hover:bg-emerald-50 shadow-none font-semibold"
              >
                {cta.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <div className="w-full pt-5 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {cta.trustBadges.map((text) => (
                <div key={text} className="flex items-center justify-center gap-2 text-sm text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCTA;
