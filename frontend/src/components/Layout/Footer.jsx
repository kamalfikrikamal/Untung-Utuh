import React from 'react';

const footerLinks = {
  Produk: ['Fitur', 'Harga', 'Template Toko', 'Demo'],
  Perusahaan: ['Tentang Kami', 'Blog UMKM', 'Testimoni', 'Kontak'],
  Legal: ['Kebijakan Privasi', 'Syarat & Ketentuan', 'Keamanan Data'],
};

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-lg bg-primary-600 flex-shrink-0" />
              <span className="text-lg font-bold text-primary-600">Untung Utuh</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Platform toko online untuk UMKM Indonesia.
              Bebas biaya komisi, 100% milik Anda.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Untung Utuh. Hak cipta dilindungi.
          </p>
          <p className="text-xs text-gray-400">Dibuat dengan ♥ untuk UMKM Indonesia</p>
        </div>

      </div>
    </footer>
  );
}


