export const COMPANY_INFO = {
  name: 'Agua Purificada Blanquita',
  address: 'Calle Camargo, Colonia Revolución Obrera, Reynosa, Tamps. México',
  phone: '(899) 921-1010',
  email: 'contacto@grupoblanquita.com',
  whatsapp: '5218999211010',
  logo: '/LOGO AGUA NUEVO 2.png',
  social: {
    facebook: 'https://www.facebook.com/apblanquita',
    instagram: 'https://www.instagram.com/apblanquita/'
  }
};

export const NAVIGATION = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/products' },
  { name: 'Aguacentros', href: '/aguacentros' },
  { name: 'Contacto', href: '/contact' },
  { name: 'Nuestra Empresa', href: '/about' },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'garrafon' | 'botella' | 'hielo';
  description: string;
  marca: string;
  submarca?: string;
  sabor?: string;
  presentacion: string;
  tamaño: string;
  tipoAgua: string;
  tipoProducto: string;
}

// Filter option constants
export const FILTER_OPTIONS = {
  marcas: ['Blanquita'],
  submarcas: ['Natural', 'Premium', 'Fórmula'],
  sabores: ['Natural', 'Saborizada'],
  presentaciones: ['Garrafón', 'Botella', 'Galón'],
  tamaños: ['20L', '11L', '5L', '1.5L', '1L', '600ml', '350ml'],
  tiposAgua: ['Natural', 'Purificada', 'Mineral'],
  tiposProducto: ['Con envase', 'Sin envase']
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Garrafón 20lt',
    price: 45.00,
    image: '/BLANQUITA_WATER_STILL_20L.png',
    category: 'garrafon',
    description: 'Agua purificada de la mejor calidad en presentación familiar.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Garrafón',
    tamaño: '20L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '2',
    name: 'Botella 5 Litros',
    price: 25.00,
    image: '/BLANQUITA_WATER_STILL_5L.png',
    category: 'botella',
    description: 'Ideal para compartir en reuniones o viajes cortos.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Botella',
    tamaño: '5L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '3',
    name: 'Galón',
    price: 20.00,
    image: '/BLANQUITA_WATER_STILL_GALLON.png',
    category: 'botella',
    description: 'Práctico envase para el consumo diario.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Galón',
    tamaño: '1L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '4',
    name: 'Medio Galón',
    price: 15.00,
    image: '/BLANQUITA_WATER_STILL_0.5 GALLON.png',
    category: 'botella',
    description: 'Tamaño perfecto para llevar contigo.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Galón',
    tamaño: '600ml',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '5',
    name: 'Galón Baby Fórmula',
    price: 22.00,
    image: '/BLANQUITA_WATER_STILL_GALLON BABY.png',
    category: 'botella',
    description: 'Especialmente diseñada para la preparación de alimentos para bebés.',
    marca: 'Blanquita',
    submarca: 'Fórmula',
    presentacion: 'Galón',
    tamaño: '1L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '6',
    name: 'Botella Litro y Medio',
    price: 12.00,
    image: '/BLANQUITA_WATER_STILL_1.5L.png',
    category: 'botella',
    description: 'Hidratación prolongada para tu día.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Botella',
    tamaño: '1.5L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '7',
    name: 'Botella 1 Litro',
    price: 10.00,
    image: '/BLANQUITA_WATER_STILL_1000ML_SPORT.png',
    category: 'botella',
    description: 'La medida estándar para tu sed.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Botella',
    tamaño: '1L',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '8',
    name: 'Botella 600 ml',
    price: 8.00,
    image: '/BLANQUITA_&_CRISTALINA_WATER_STILL_600ML.png',
    category: 'botella',
    description: 'Compacta y ligera, llévala a todas partes.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Botella',
    tamaño: '600ml',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  },
  {
    id: '9',
    name: 'Botella 350 ml',
    price: 6.00,
    image: '/BLANQUITA_&_CRISTALINA_WATER_STILL_355ML.png',
    category: 'botella',
    description: 'Pequeña y práctica, ideal para niños o eventos.',
    marca: 'Blanquita',
    submarca: 'Natural',
    presentacion: 'Botella',
    tamaño: '350ml',
    tipoAgua: 'Purificada',
    tipoProducto: 'Con envase'
  }
];

export const LOCATIONS = [
  {
    name: 'Agua Centro Río Purificación',
    address: 'Calle Nueva Ciudad Guerrero esq. #867. Prol. Río Purificación, col. Revolución Obrera, Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Cumbres',
    address: 'Av. Mil Cumbres 960, Las Cumbres, 88740 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Las Fuentes',
    address: 'Blvd. Las Fuentes 913, Aztlán, 88740 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Calle 20',
    address: 'Calle 20, Veinte 117, Aztlán, 88740 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua centro Petrolera',
    address: 'Poza Rica 1203, Refinería, 88640 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Vista Hermosa',
    address: 'Av. Vista Hermosa y C. 13, Vista Hermosa, 88710 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Pedro J. Méndez',
    address: 'Enrique Canseco y C. 13, Pedro J. Méndez, 88799 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Hielo (Col. Rodríguez)',
    address: 'Jalapa esq. Herón Ramírez, Col. Rodríguez, Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Lomas',
    address: 'José de Rivera, Lomas de Jarachina Sur, 88730 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  },
  {
    name: 'Agua Centro Cavazos',
    address: 'Calle Amado Nervo 510, Los Cavazos, 88720 Reynosa, Tamps.',
    phone: '(899) 921-10-10'
  }
];

export const COMPANY_HISTORY = {
  founded: '1993',
  description: 'Nuestra compañía fue fundada en el mes de octubre de 1993 con la firme idea de proporcionar y garantizar el abasto a cada hogar y establecimiento de trabajo, el agua purificada tan necesaria en la vida diaria. Desde entonces nos hemos esforzado por estar más cerca de ti.',
  mission: 'APB nació para proporcionar a todas las familias un producto de la más alta calidad, agua confiable y efectivamente purificada, utilizando los procesos y equipos de purificación más modernos y seguros. Trabajamos para ser la mejor opción en relación con la calidad, comercialización y distribución, logrando de esta manera ser una empresa generadora de desarrollo social y laboral.',
  vision: 'Mantenernos como la opción preferida por los consumidores. Llegar cada día a más hogares y establecimientos.',
  values: [
    {
      title: 'Ética y Transparencia',
      description: 'Actuamos conforme a las normas éticas y sociales en las actividades relacionadas con el trabajo sin mentir ni engañar; no ocultando información relevante.'
    },
    {
      title: 'Trabajo en Unidad',
      description: 'Gestionamos con la habilidad de trabajar juntos con sinergia hacia una visión, una meta u objetivo.'
    },
    {
      title: 'Orgullo de Pertenecer',
      description: 'Fomentamos y Generamos un ambiente de compañerismo, respeto y tolerancia.'
    },
    {
      title: 'Carácter Firme',
      description: 'Nos referimos a la cualidad o valor que moldean nuestros pensamientos, nuestras acciones, reacciones, decisiones y sentimientos.'
    },
    {
      title: 'Comunicación Efectiva',
      description: 'Logramos una forma de comunicación, que quien transmite el mensaje lo haga de modo claro y entendible.'
    },
    {
      title: 'Responsabilidad y Confianza',
      description: 'Logramos el cumplimiento de las obligaciones correctamente y a tiempo.'
    },
    {
      title: 'Pasión por el Trabajo',
      description: 'Logramos día a día que nuestra fuerza laboral disfrute y realicen su trabajo con pasión y entrega.'
    },
    {
      title: 'Prontitud ante los Cambios',
      description: 'Estamos listos para los cambios y aceptamos la responsabilidad de inspirar y crear cambios positivos.'
    },
    {
      title: 'Actitud Emprendedora e Innovación',
      description: 'Cultivamos la superación de retos y buscamos de manera incesante, generar e implementar soluciones tecnológicas.'
    },
    {
      title: 'Excelencia',
      description: 'Buscamos en lo que hacemos, comercializamos, o producimos que la excelencia sea una virtud, un talento o cualidad.'
    }
  ]
};
