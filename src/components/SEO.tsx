import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    image = 'https://www.aguablanquita.com/og-image.jpg',
    url,
    noIndex = false
}) => {
    const siteTitle = 'Agua Purificada Blanquita';
    const fullTitle = `${title} | ${siteTitle}`;
    const siteUrl = 'https://www.aguablanquita.com';
    const defaultKeywords = 'agua purificada, agua blanquita, garrafones de agua, Reynosa, Tamaulipas, agua libre de cloro, hielo, servicio a domicilio';

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <html lang="es" />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content="Agua Purificada Blanquita" />
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
            {url && <link rel="canonical" href={`${siteUrl}${url}`} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {url && <meta property="og:url" content={`${siteUrl}${url}`} />}
            <meta property="og:locale" content="es_MX" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Geo Tags */}
            <meta name="geo.region" content="MX-TAM" />
            <meta name="geo.placename" content="Reynosa, Tamaulipas" />
        </Helmet>
    );
};

export default SEO;
