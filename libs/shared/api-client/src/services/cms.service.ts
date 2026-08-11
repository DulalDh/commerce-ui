import { api } from '../http';
import { resource } from './resource';
import type { CmsPage, PageVersion, BlogPost, Faq } from '@org/types';

export const cmsPublicService = {
  pages: () => api.get<CmsPage[]>('/cms/pages'),
  blogPosts: () => api.get<BlogPost[]>('/cms/blog-posts'),
  faqs: () => api.get<Faq[]>('/cms/faqs'),
};

export const pagesService = {
  ...resource<CmsPage>('/admin/pages'),
  versions: (pageId: string | number) => api.get<PageVersion[]>(`/admin/pages/${pageId}/versions`),
};
export const blogPostsService = resource<BlogPost>('/admin/blog-posts');
export const faqsService = resource<Faq>('/admin/faqs');
