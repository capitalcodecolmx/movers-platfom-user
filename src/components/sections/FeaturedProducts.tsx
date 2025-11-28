import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { PRODUCTS } from '../../data/mockData';

const FeaturedProducts: React.FC = () => {
    const featuredProducts = PRODUCTS.slice(0, 3);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Compact & Aligned */}
                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b border-gray-100 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-1 bg-cyan-500 rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Nuestros Productos
                            </h2>
                        </div>
                        <p className="text-base text-gray-500 font-medium max-w-lg">
                            Las presentaciones favoritas de nuestros clientes.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="hidden sm:flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-800 transition-all hover:gap-3 text-xs uppercase tracking-wider"
                    >
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Grid - Responsive & Tight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {featuredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-800 transition-colors px-6 py-2.5 bg-cyan-50 rounded-full text-sm"
                    >
                        Ver todos los productos <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
