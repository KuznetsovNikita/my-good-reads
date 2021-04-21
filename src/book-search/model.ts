export interface BookInfo {
  title: string;
  authors?: string[];
  publisher?: string;
  description: string;
  imageLinks?: {
    smallThumbnail: string;
    thumbnail: string;
  };
}

export interface Book {
  id: string;
  volumeInfo: BookInfo;
  searchInfo?: {
    textSnippet: string;
  };
}
