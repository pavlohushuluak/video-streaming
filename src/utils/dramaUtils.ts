import { Drama } from '@/types/drama';

export const getLocalizedDramaContent = (drama: Drama, language: string) => {
  switch (language) {
    case 'en':
      return {
        title: drama.title_en || drama.title_pt || drama.title_es || 'Untitled',
        synopsis: drama.synopsis_en || drama.synopsis_pt || drama.synopsis_es || '',
        coverImage: drama.cover_image_url_en || drama.cover_image_url_pt || drama.cover_image_url_es || null,
        trailerUrl: drama.trailer_url_en || drama.trailer_url_pt || drama.trailer_url_es || null
      };
    case 'pt':
      return {
        title: drama.title_pt || drama.title_en || drama.title_es || 'Sem título',
        synopsis: drama.synopsis_pt || drama.synopsis_en || drama.synopsis_es || '',
        coverImage: drama.cover_image_url_pt || drama.cover_image_url_en || drama.cover_image_url_es || null,
        trailerUrl: drama.trailer_url_pt || drama.trailer_url_en || drama.trailer_url_es || null
      };
    case 'es':
      return {
        title: drama.title_es || drama.title_en || drama.title_pt || 'Sin título',
        synopsis: drama.synopsis_es || drama.synopsis_en || drama.synopsis_pt || '',
        coverImage: drama.cover_image_url_es || drama.cover_image_url_en || drama.cover_image_url_pt || null,
        trailerUrl: drama.trailer_url_es || drama.trailer_url_en || drama.trailer_url_pt || null
      };
    default:
      return {
        title: drama.title_en || drama.title_pt || drama.title_es || 'Untitled',
        synopsis: drama.synopsis_en || drama.synopsis_pt || drama.synopsis_es || '',
        coverImage: drama.cover_image_url_en || drama.cover_image_url_pt || drama.cover_image_url_es || null,
        trailerUrl: drama.trailer_url_en || drama.trailer_url_pt || drama.trailer_url_es || null
      };
  }
};

export const getLocalizedCoverImage = (drama: any, language: string) => {
  switch (language) {
    case 'pt':
      return drama.cover_image_url_pt || drama.cover_image_url_en;
    case 'es':
      return drama.cover_image_url_es || drama.cover_image_url_en;
    default:
      return drama.cover_image_url_en;
  }
};

export const getLocalizedTrailerUrl = (drama: any, language: string) => {
  switch (language) {
    case 'pt':
      return drama.trailer_url_pt || drama.trailer_url_en;
    case 'es':
      return drama.trailer_url_es || drama.trailer_url_en;
    default:
      return drama.trailer_url_en;
  }
};

export const getDramaCategories = (drama: any) => {
  // First check if drama has existing categories in genre field
  const existingCategories = Array.isArray(drama.genre) ? drama.genre : (drama.genre ? [drama.genre] : []);
  
  if (existingCategories.length > 0) {
    return existingCategories;
  }
  
  // If no existing categories, calculate based on content
  const title = drama.title_en?.toLowerCase() || '';
  const synopsis = drama.synopsis_en?.toLowerCase() || '';
  const rating = drama.rating || 0;
  const views = drama.views || 0;
  const createdAt = new Date(drama.created_at);
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

  const categories = [];

  // Novo Lançamento - dramas created in the last 30 days
  if (daysSinceCreation <= 30) {
    categories.push("novo-lancamento");
  }
  
  // Mais Recomendado - dramas with high rating and views
  if (rating >= 4.5 && views >= 1000) {
    categories.push("mais-recomendado");
  }
  
  // Identidade Escondida - dramas with keywords in title or synopsis
  if (title.includes('secret') || title.includes('hidden') || title.includes('identity') ||
      synopsis.includes('secret') || synopsis.includes('hidden') || synopsis.includes('identity') ||
      title.includes('escondida') || title.includes('identidade') ||
      synopsis.includes('escondida') || synopsis.includes('identidade')) {
    categories.push("identidade-escondida");
  }
  
  // Bebês e Gravidezes - dramas with pregnancy/baby keywords
  if (title.includes('baby') || title.includes('pregnancy') || title.includes('pregnant') ||
      synopsis.includes('baby') || synopsis.includes('pregnancy') || synopsis.includes('pregnant') ||
      title.includes('bebê') || title.includes('gravidez') || title.includes('grávida') ||
      synopsis.includes('bebê') || synopsis.includes('gravidez') || synopsis.includes('grávida')) {
    categories.push("bebes-gravidezes");
  }
  
  // Relacionamento Tabu - dramas with taboo relationship keywords
  if (title.includes('taboo') || title.includes('forbidden') || title.includes('secret love') ||
      synopsis.includes('taboo') || synopsis.includes('forbidden') || synopsis.includes('secret love') ||
      title.includes('tabu') || title.includes('proibido') || title.includes('amor secreto') ||
      synopsis.includes('tabu') || synopsis.includes('proibido') || synopsis.includes('amor secreto')) {
    categories.push("relacionamento-tabu");
  }
  
  // Amor à Primeira Vista - dramas with love at first sight keywords
  if (title.includes('love at first sight') || title.includes('first love') ||
      synopsis.includes('love at first sight') || synopsis.includes('first love') ||
      title.includes('amor à primeira vista') || title.includes('primeiro amor') ||
      synopsis.includes('amor à primeira vista') || synopsis.includes('primeiro amor')) {
    categories.push("amor-primeira-vista");
  }
  
  // Default category based on rating
  if (rating >= 4.0 && !categories.includes("mais-recomendado")) {
    categories.push("mais-recomendado");
  }
  
  // If no categories found, add default
  if (categories.length === 0) {
    categories.push("novo-lancamento");
  }
  
  return categories;
};

export const getCategoryLabel = (categoryId: string, t: any) => {
  const categories = [
    { id: "novo-lancamento", label: t("dramas.novo.lancamento") },
    { id: "mais-recomendado", label: t("dramas.mais.recomendado") },
    { id: "identidade-escondida", label: t("dramas.identidade.escondida") },
    { id: "bebes-gravidezes", label: t("dramas.bebes.gravidezes") },
    { id: "relacionamento-tabu", label: t("dramas.relacionamento.tabu") },
    { id: "amor-primeira-vista", label: t("dramas.amor.primeira.vista") }
  ];
  
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.label : categoryId;
};

export const formatGenre = (genre: string[] | null): string => {
  if (!genre || genre.length === 0) return '';
  return Array.isArray(genre) ? genre.join(', ') : genre;
};

export const getGenreColor = (genre: string): string => {
  const colors: { [key: string]: string } = {
    'Romance': 'text-pink-500',
    'Drama': 'text-blue-500',
    'Thriller': 'text-red-500',
    'Comedy': 'text-yellow-500',
    'Action': 'text-orange-500',
    'Mystery': 'text-purple-500',
    'Horror': 'text-red-600',
    'Sci-Fi': 'text-cyan-500',
    'Fantasy': 'text-indigo-500',
    'Historical': 'text-amber-600'
  };
  return colors[genre] || 'text-gray-500';
}; 