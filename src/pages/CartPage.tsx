import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import GlassButton from '../components/ui/GlassButton';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, getTotal } = useCartStore();
    const total = getTotal();

    if (items.length === 0) {
        return (
            <PublicLayout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                        <ShoppingBag size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
                    <GlassButton to="/products" label="Ver Productos" variant="blue" size="lg" />
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <ul className="divide-y divide-gray-100">
                                    {items.map((item) => (
                                        <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg p-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="flex-1 text-center sm:text-left">
                                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                                <p className="text-gray-500 text-sm">{item.description}</p>
                                                <p className="text-cyan-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 text-gray-500 hover:text-cyan-600 transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 text-gray-500 hover:text-cyan-600 transition-colors"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-6">
                                <GlassButton
                                    to="/products"
                                    label={<span className="flex items-center gap-2"><ArrowLeft size={20} /> Continuar Comprando</span>}
                                    variant="white"
                                    size="md"
                                />
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 mt-8 lg:mt-0">
                            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <GlassButton
                                    label="Proceder al Pago"
                                    variant="blue"
                                    size="lg"
                                    onClick={() => navigate('/checkout')}
                                    className="w-full"
                                />

                                <p className="mt-4 text-xs text-center text-gray-400">
                                    Transacciones seguras y encriptadas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default CartPage;
