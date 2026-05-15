/**
 * SEO component — uses React 19 native document metadata hoisting.
 * Supports Open Graph, Twitter Cards, and canonical URLs for Googlebot crawling.
 */
export default function SEO({
  title,
  description = 'A full-stack MERN application',
  image,
  url,
  type = 'website',
  noindex = false,
}) {
  const appName = import.meta.env.VITE_APP_NAME || 'MERN App';
  const appUrl = import.meta.env.VITE_APP_URL || 'https://example.com';
  const fullTitle = title ? `${title} | ${appName}` : appName;
  const canonicalUrl = url ? `${appUrl}${url}` : appUrl;
  const ogImage = image || `${appUrl}/og-default.png`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={appName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
