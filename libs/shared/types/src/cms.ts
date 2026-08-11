export interface CmsPage {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published';
}

export interface PageVersion {
  id: string | number;
  title?: string;
  created_at?: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: 'draft' | 'published';
  published_at?: string;
}

export interface Faq {
  id: string | number;
  question: string;
  answer: string;
  position: number;
  is_active: boolean;
}
