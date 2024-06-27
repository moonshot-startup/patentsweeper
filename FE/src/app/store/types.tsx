export interface Patent {
  inventionTitle: string;
  patentApplicationNumber: string;
  similarity_score?: number;
  explanation?: string;
}

export interface AppState {
  keywords: { value: string[] };
  pdfData: { value?: FormData };
  similarPatents: { value: Patent[] };
}
