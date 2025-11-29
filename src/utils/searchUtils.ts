import type { Product } from '../data/mockData';

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Search products by query string
 * Searches across: name, description, category, marca, submarca, sabor
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  return products.filter((product) => {
    const searchableFields = [
      product.name,
      product.description,
      product.category,
      product.marca,
      product.submarca || '',
      product.sabor || '',
      product.presentacion,
      product.tamaño,
      product.tipoAgua,
    ].map(field => field.toLowerCase());

    return searchableFields.some(field => field.includes(normalizedQuery));
  });
}

/**
 * Highlight matching text in a string
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(products: Product[], query: string, limit: number = 5): string[] {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.name);
    }
    if (product.marca.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.marca);
    }
    if (product.submarca && product.submarca.toLowerCase().includes(normalizedQuery)) {
      suggestions.add(product.submarca);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
