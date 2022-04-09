export interface RoadMapArticle {
  title: string;
  id: string;
}

export interface RoadMap {
  title: string;
  description: string;
  articles: RoadMapArticle[];
}

export interface Category {
  label: string;
  description: string;
  roadMaps: RoadMap[];
}
