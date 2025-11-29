import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../ProductCard';
import { PRODUCTS } from '../../data/mockData';

const FeaturedProducts: React.FC = () => {
    const featuredProducts = PRODUCTS.slice(0, 3);

    return (
        <section className="py-10 md:py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header - Sleek & Compact */}
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 gap-4 pb-4 border-b border-gray-100">
                    <div className="text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                                Nuestros Productos
                            </h2>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            Las presentaciones favoritas de nuestros clientes.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="group hidden sm:flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-800 transition-all text-xs uppercase tracking-wider"
                    >
                        Ver todos
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid - Responsive & Enhanced Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {featuredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>

                {/* Mobile View All Link */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to="/products"
                        className="group inline-flex items-center gap-2 text-cyan-700 font-bold hover:text-cyan-800 transition-colors px-6 py-2.5 bg-cyan-50 rounded-full text-sm hover:bg-cyan-100"
                    >
                        Ver todos los productos
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
