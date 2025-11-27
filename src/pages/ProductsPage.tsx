import React from 'react';
import PublicLayout from '../components/PublicLayout';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/mockData';

const ProductsPage: React.FC = () => {
    return (
        <PublicLayout>
            <div className="bg-cyan-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Productos</h1>
                    <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                        Descubre nuestra variedad de presentaciones diseñadas para cada necesidad.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
};

export default ProductsPage;
