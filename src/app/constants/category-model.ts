export interface CategoryArticle {
  title: string;
  description?: string;
  id: string;
}

export interface Category {
  id: string;
  title: string;
  description?: string;
  articles: CategoryArticle[];
}
