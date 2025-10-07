// =====================================================
// PARSER DE DIRECCIONES INTELIGENTE
// =====================================================

export interface ParsedAddress {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  formatted: string;
  raw: string;
}

// Patrones comunes de direcciones en México
const ADDRESS_PATTERNS = [
  // Patrón: "Calle/Nombre Número, Colonia, Ciudad, Estado"
  /^(.+?)\s+(\d+[a-zA-Z]?)\s*,\s*(.+?)\s*,\s*(.+?)\s*,\s*(.+)$/i,
  
  // Patrón: "Calle/Nombre Número, Ciudad, Estado"
  /^(.+?)\s+(\d+[a-zA-Z]?)\s*,\s*(.+?)\s*,\s*(.+)$/i,
  
  // Patrón: "Calle/Nombre, Número, Colonia, Ciudad, Estado"
  /^(.+?)\s*,\s*(\d+[a-zA-Z]?)\s*,\s*(.+?)\s*,\s*(.+?)\s*,\s*(.+)$/i,
  
  // Patrón: "Calle/Nombre Número, Ciudad, Estado" (sin colonia)
  /^(.+?)\s+(\d+[a-zA-Z]?)\s*,\s*(.+?)\s*,\s*(.+)$/i,
];

// Palabras comunes de calles en México
const STREET_TYPES = [
  'calle', 'avenida', 'av', 'boulevard', 'blvd', 'carretera', 'carr',
  'circuito', 'circ', 'privada', 'priv', 'cerrada', 'cerr', 'pasaje',
  'paseo', 'plaza', 'prolongación', 'prol', 'retorno', 'ret', 'vialidad'
];

// Estados de México
const MEXICAN_STATES = [
  'aguascalientes', 'baja california', 'baja california sur', 'campeche',
  'chiapas', 'chihuahua', 'coahuila', 'colima', 'durango', 'guanajuato',
  'guerrero', 'hidalgo', 'jalisco', 'méxico', 'michoacán', 'morelos',
  'nayarit', 'nuevo león', 'oaxaca', 'puebla', 'querétaro', 'quintana roo',
  'san luis potosí', 'sinaloa', 'sonora', 'tabasco', 'tamaulipas',
  'tlaxcala', 'veracruz', 'yucatán', 'zacatecas', 'cdmx', 'ciudad de méxico'
];

// Palabras comunes de colonias
const NEIGHBORHOOD_PREFIXES = [
  'col', 'colonia', 'fracc', 'fraccionamiento', 'residencial', 'res',
  'condominio', 'cond', 'unidad', 'unid', 'zona', 'sector', 'barrio'
];

export const parseAddress = (rawAddress: string): ParsedAddress => {
  const cleanAddress = rawAddress.trim();
  
  // Intentar con cada patrón
  for (const pattern of ADDRESS_PATTERNS) {
    const match = cleanAddress.match(pattern);
    if (match) {
      const [, streetPart, number, part3, part4, part5] = match;
      
      // Determinar qué es cada parte
      let street = streetPart.trim();
      let neighborhood = '';
      let city = '';
      let state = '';
      
      if (part5) {
        // Formato completo: calle, número, colonia, ciudad, estado
        neighborhood = part3.trim();
        city = part4.trim();
        state = part5.trim();
      } else {
        // Formato sin colonia: calle, número, ciudad, estado
        city = part3.trim();
        state = part4.trim();
      }
      
      // Limpiar y formatear la calle
      street = cleanStreetName(street);
      
      // Formatear el estado
      state = formatState(state);
      
      // Formatear la ciudad
      city = formatCity(city);
      
      // Formatear la colonia
      neighborhood = formatNeighborhood(neighborhood);
      
      const formatted = formatCompleteAddress({
        street,
        number,
        neighborhood,
        city,
        state,
        country: 'México'
      });
      
      return {
        street,
        number,
        neighborhood,
        city,
        state,
        country: 'México',
        formatted,
        raw: cleanAddress
      };
    }
  }
  
  // Si no coincide con ningún patrón, intentar extraer información básica
  return parseBasicAddress(cleanAddress);
};

const cleanStreetName = (street: string): string => {
  let cleaned = street.trim();
  
  // Capitalizar primera letra de cada palabra
  cleaned = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
  
  // Asegurar que los tipos de calle estén bien formateados
  STREET_TYPES.forEach(type => {
    const regex = new RegExp(`\\b${type}\\b`, 'gi');
    cleaned = cleaned.replace(regex, (match) => {
      switch (match.toLowerCase()) {
        case 'av': return 'Av.';
        case 'blvd': return 'Blvd.';
        case 'carr': return 'Carr.';
        case 'circ': return 'Circ.';
        case 'priv': return 'Priv.';
        case 'cerr': return 'Cerr.';
        case 'prol': return 'Prol.';
        case 'ret': return 'Ret.';
        default: return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      }
    });
  });
  
  return cleaned;
};

const formatState = (state: string): string => {
  const cleanState = state.trim().toLowerCase();
  
  // Buscar coincidencia exacta o parcial
  const matchedState = MEXICAN_STATES.find(s => 
    s.includes(cleanState) || cleanState.includes(s)
  );
  
  if (matchedState) {
    return matchedState.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  return state.trim();
};

const formatCity = (city: string): string => {
  return city.trim().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const formatNeighborhood = (neighborhood: string): string => {
  if (!neighborhood) return '';
  
  let formatted = neighborhood.trim();
  
  // Capitalizar prefijos de colonia
  NEIGHBORHOOD_PREFIXES.forEach(prefix => {
    const regex = new RegExp(`\\b${prefix}\\b`, 'gi');
    formatted = formatted.replace(regex, (match) => {
      switch (match.toLowerCase()) {
        case 'col': return 'Col.';
        case 'fracc': return 'Fracc.';
        case 'res': return 'Res.';
        case 'cond': return 'Cond.';
        case 'unid': return 'Unid.';
        default: return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
      }
    });
  });
  
  return formatted;
};

const formatCompleteAddress = (address: Partial<ParsedAddress>): string => {
  const parts = [];
  
  if (address.street && address.number) {
    parts.push(`${address.street} ${address.number}`);
  }
  
  if (address.neighborhood) {
    parts.push(address.neighborhood);
  }
  
  if (address.city) {
    parts.push(address.city);
  }
  
  if (address.state) {
    parts.push(address.state);
  }
  
  if (address.country) {
    parts.push(address.country);
  }
  
  return parts.join(', ');
};

const parseBasicAddress = (address: string): ParsedAddress => {
  // Extraer número si existe
  const numberMatch = address.match(/(\d+[a-zA-Z]?)/);
  const number = numberMatch ? numberMatch[1] : '';
  
  // Remover número de la dirección
  const withoutNumber = address.replace(/(\d+[a-zA-Z]?)/, '').trim();
  
  // Dividir por comas
  const parts = withoutNumber.split(',').map(p => p.trim()).filter(p => p);
  
  let street = parts[0] || '';
  let city = parts[1] || '';
  let state = parts[2] || '';
  
  // Limpiar nombres
  street = cleanStreetName(street);
  city = formatCity(city);
  state = formatState(state);
  
  const formatted = formatCompleteAddress({
    street,
    number,
    city,
    state,
    country: 'México'
  });
  
  return {
    street,
    number,
    neighborhood: '',
    city,
    state,
    country: 'México',
    formatted,
    raw: address
  };
};

// Función para generar sugerencias de búsqueda
export const generateSearchSuggestions = (parsed: ParsedAddress): string[] => {
  const suggestions = [];
  
  // Sugerencia completa
  suggestions.push(parsed.formatted);
  
  // Sugerencia sin número
  if (parsed.number) {
    const withoutNumber = formatCompleteAddress({
      ...parsed,
      number: ''
    });
    suggestions.push(withoutNumber);
  }
  
  // Sugerencia solo calle y ciudad
  if (parsed.street && parsed.city) {
    suggestions.push(`${parsed.street}, ${parsed.city}, ${parsed.state}`);
  }
  
  // Sugerencia solo ciudad y estado
  if (parsed.city && parsed.state) {
    suggestions.push(`${parsed.city}, ${parsed.state}`);
  }
  
  return suggestions.filter((s, i, arr) => arr.indexOf(s) === i); // Remover duplicados
};

export default {
  parseAddress,
  generateSearchSuggestions
};

