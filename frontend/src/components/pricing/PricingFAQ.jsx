import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const PricingFAQ = () => {
  const faqs = [
    {
      question: "Apa perbedaan utama dengan marketplace seperti Tokopedia atau Shopee?",
      answer: "Platform marketplace biasanya mengenakan komisi 10-25% dari setiap transaksi, biaya iklan yang terus meningkat, dan memaksa Anda bersaing dengan ribuan penjual lain. Dengan Untung Utuh, Anda memiliki kontrol penuh atas pelanggan sendiri tanpa biaya tersembunyi. Tidak ada algoritma yang menyembunyikan produk Anda, tidak ada biaya promosi wajib, dan Anda tidak perlu bersaing dengan harga murah dari kompetitor di marketplace. Semua data penjualan tetap milik Anda sepenuhnya.",
    },
    {
      question: "Bisa upgrade atau downgrade paket kapan saja?",
      answer: "Tentu! Anda bisa mengubah paket kapan saja tanpa biaya administrasi tambahan. Jika upgrade, tagihan bulan berikutnya akan disesuaikan dengan paket baru. Jika downgrade, Anda tetap membayar sesuai paket saat ini hingga periode berakhir. Tidak ada kontrak mengikat - Anda bebas memilih dan mengubah paket setiap waktu.",
    },
    {
      question: "Metode pembayaran apa yang tersedia?",
      answer: "Kami menerima berbagai metode pembayaran yang aman dan terpercaya:\n- Transfer Bank (BCA, Mandiri, BRI, BNI)\n- E-Wallet (GoPay, OVO, DANA, ShopeePay)\n- Kartu Kredit (untuk paket berbayar)\n- Virtual Account\nSemua transaksi diproses oleh pihak ketiga yang terverifikasi. Untuk langganan tahunan, Anda mendapatkan diskon 33% langsung.",
    },
    {
      question: "Bagaimana kebijakan refund jika saya tidak puas?",
      answer: "Kami memberikan garansi uang kembali 14 hari untuk semua paket berbayar. Jika dalam 14 hari pertama Anda merasa platform tidak sesuai dengan yang dijanjikan, kami akan mengembalikan uang Anda penuh tanpa pertanyaan. Ini adalah komitmen kami terhadap kualitas layanan dan kepercayaan pelanggan.",
    },
    {
      question: "Apakah data saya aman?",
      answer: "Keamanan data adalah prioritas utama kami. Kami menggunakan:\n- Enkripsi end-to-end untuk semua data\n- SSL certificate untuk koneksi aman\n- Backup otomatis harian\n- Compliance dengan standar keamanan data Indonesia\n- Tidak pernah menjual atau membagikan data pelanggan Anda\nData Anda sepenuhnya milik Anda dan tidak akan pernah dijual ke pihak ketiga.",
    },
    {
      question: "Bisa coba gratis sebelum berlangganan?",
      answer: "Ya! Paket Gratis tersedia selamanya tanpa kartu kredit. Anda bisa mencoba semua fitur dasar untuk memahami bagaimana platform bekerja. Setelah merasa nyaman, upgrade kapan saja sesuai kebutuhan bisnis Anda. Tidak ada risiko, tidak ada komitmen tersembunyi.",
    },
  ];

  const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
     <section className="py-20 bg-gray-50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
             Pertanyaan yang Sering Diajukan
           </h2>
           <p className="text-lg text-gray-600 max-w-3xl mx-auto">
             Semua pertanyaan yang biasa diajukan oleh pengguna baru, dijawab dengan transparan dan jujur.
           </p>
         </div>

         <div className="max-w-4xl mx-auto space-y-4">
           {faqs.map((faq, index) => (
             <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
               <button
                 onClick={() => handleToggle(index)}
                 className="w-full px-6 py-4 flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
               >
                 <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                 {openIndex === index ? (
                   <ChevronUp className="w-5 h-5 text-gray-400" />
                 ) : (
                   <ChevronDown className="w-5 h-5 text-gray-400" />
                 )}
               </button>
               <div
                 className={`px-6 overflow-hidden transition-all duration-300 ${
                   openIndex === index ? 'max-h-auto py-4' : 'max-h-0'
                 }`}
               >
                 <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
               </div>
             </div>
           ))}
         </div>
       </div>
     </section>
   );
};

export default PricingFAQ;
