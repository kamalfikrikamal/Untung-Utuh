import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqItems } from '../../data/contactData';

const PricingFAQ = () => {
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
           {faqItems.map((faq, index) => (
             <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
               <button
                 onClick={() => handleToggle(index)}
                 className="w-full px-6 py-4 flex items-center justify-between text-left focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 cursor-pointer"
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
