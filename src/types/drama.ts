export interface Drama {
  id: number;
  title_en: string;
  title_pt: string;
  title_es: string;
  synopsis_en: string;
  synopsis_pt: string;
  synopsis_es: string;
  genre: string[];
  status: 'active' | 'completed' | 'draft';
  rating: number;
  views: number;
  cover_image_url_en: string;
  cover_image_url_pt: string;
  cover_image_url_es: string;
  trailer_url_en: string;
  trailer_url_pt: string;
  trailer_url_es: string;
  created_at: string;
  updated_at: string;
}

export interface DramaCardProps {
  drama: any;
  onPlay: (drama: any) => void;
} 