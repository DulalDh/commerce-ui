import { api } from '../http';
import { resource } from './resource';

export const cmsPublicService = {
  pages: () => api.get('/cms/pages'),
  blogPosts: () => api.get('/cms/blog-posts'),
  faqs: () => api.get('/cms/faqs'),
};

export const pagesService = {
  ...resource('/admin/pages'),
  versions: (pageId: string | number) => api.get(`/admin/pages/${pageId}/versions`),
};
export const blogPostsService = resource('/admin/blog-posts');
export const faqsService = resource('/admin/faqs');
