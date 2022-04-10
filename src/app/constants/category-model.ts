export interface CategoryArticle {
  title: string;
  description: string;
  id: string;
}

export interface Category {
  label: string;
  description: string;
  articles: CategoryArticle[];
}
