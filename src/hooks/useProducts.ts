// =====================================================
// HOOK PARA MANEJAR PRODUCTOS (ADMIN)
// =====================================================

import { useState } from 'react';
import { supabase } from '../config/supabase';
import type { Product } from '../data/mockData';

export const useProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products (admin only)
  const fetchAllProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Transform to Product interface
      const products: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.image || '',
        category: p.category as 'garrafon' | 'botella' | 'hielo',
        description: p.description || '',
        marca: p.marca || '',
        submarca: p.submarca || undefined,
        sabor: p.sabor || undefined,
        presentacion: p.presentacion || '',
        tamaño: p.tamaño || '',
        tipoAgua: p.tipoAgua || '',
        tipoProducto: p.tipoProducto || '',
      }));

      return products;
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData: Partial<Product> & {
    stock_quantity?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: createError } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          category: productData.category,
          marca: productData.marca,
          submarca: productData.submarca,
          sabor: productData.sabor,
          presentacion: productData.presentacion,
          tamaño: productData.tamaño,
          tipoAgua: productData.tipoAgua,
          tipoProducto: productData.tipoProducto,
          stock_quantity: productData.stock_quantity || 0,
          is_active: true,
        }])
        .select()
        .single();

      if (createError) throw createError;
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al crear producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update product
  const updateProduct = async (productId: string, productData: Partial<Product> & {
    stock_quantity?: number;
    is_active?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatePayload: any = {};
      
      if (productData.name !== undefined) updatePayload.name = productData.name;
      if (productData.description !== undefined) updatePayload.description = productData.description;
      if (productData.price !== undefined) updatePayload.price = productData.price;
      if (productData.image !== undefined) updatePayload.image = productData.image;
      if (productData.category !== undefined) updatePayload.category = productData.category;
      if (productData.marca !== undefined) updatePayload.marca = productData.marca;
      if (productData.submarca !== undefined) updatePayload.submarca = productData.submarca;
      if (productData.sabor !== undefined) updatePayload.sabor = productData.sabor;
      if (productData.presentacion !== undefined) updatePayload.presentacion = productData.presentacion;
      if (productData.tamaño !== undefined) updatePayload.tamaño = productData.tamaño;
      if (productData.tipoAgua !== undefined) updatePayload.tipoAgua = productData.tipoAgua;
      if (productData.tipoProducto !== undefined) updatePayload.tipoProducto = productData.tipoProducto;
      if (productData.stock_quantity !== undefined) updatePayload.stock_quantity = productData.stock_quantity;
      if (productData.is_active !== undefined) updatePayload.is_active = productData.is_active;

      const { data, error: updateError } = await supabase
        .from('products')
        .update(updatePayload)
        .eq('id', productId)
        .select()
        .single();

      if (updateError) throw updateError;
      return data;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product (soft delete by setting is_active to false)
  const deleteProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', productId);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      setError(err.message || 'Error al eliminar producto');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

