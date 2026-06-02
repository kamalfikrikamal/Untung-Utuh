import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const HeroCTA = () => {
  return (
     <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-600 to-primary-800">
       <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-6">
         <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Coba Fitur Dasar — Gratis 100%
         </h2>
         <p className="text-primary-200 text-lg font-light">
          Tidak perlu kartu kredit. Tidak perlu pasang aplikasi.
          Toko Anda online dalam hitungan menit.
         </p>

         <Link to="/register">
           <Button
            size="lg"
            className="bg-white text-primary-700 hover:bg-primary-50 shadow-xl text-base px-10 group"
           >
             Buat Toko Online Sekarang
             <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
           </Button>
         </Link>

         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t border-white/20 pt-6 mt-2">
           {[
             { val: '0%', label: 'Komisi Per Transaksi' },
             { val: '5 menit', label: 'Waktu setup toko' },
             { val: '99.9%', label: 'Uptime dijamin' },
           ].map(({ val, label }) => (
             <div key={label} className="flex flex-col items-center gap-0.5">
               <span className="text-2xl font-extrabold text-white">{val}</span>
               <span className="text-sm text-primary-200">{label}</span>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
};

export default HeroCTA;
