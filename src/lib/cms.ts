import type { Lang } from "./i18n";

export type LocalizedText = Partial<Record<Lang, string>>;
export type BlockType = "heading" | "text" | "image" | "gallery" | "textImage" | "collection";
export interface CmsBlock {
  id: string;
  type: BlockType;
  content: LocalizedText;
  title?: LocalizedText;
  images?: string[];
  stageImages?: Partial<Record<number, string>>;
  source?: string;
  anchor?: string;
  hidden?: boolean;
  theoryId?: string;
}
export interface CmsPageRecord {
  id: string;
  slug: string;
  name: string;
  titles: LocalizedText;
  draft_blocks: CmsBlock[];
  published_titles: LocalizedText;
  published_blocks: CmsBlock[] | null;
  updated_at: string;
}
export const localized = (value: LocalizedText | undefined, lang: Lang) => value?.[lang] || value?.en || value?.fr || value?.sw || "";
export const newBlock = (type: BlockType): CmsBlock => ({ id: crypto.randomUUID(), type, content: {}, images: [] });
export const collectionNames: Record<string, string> = {
  hero: "Diaporama d’accueil", approach: "Notre approche", about: "Qui sommes-nous", programs: "Programmes",
  video: "Vidéo", workshops: "Ateliers", events: "Événements", partners: "Partenaires", impact: "Impact",
  reports: "Rapports", testimonials: "Témoignages", team: "Équipe", jobs: "Offres d’emploi", theory: "Ce que nous faisons", biography: "Biographie",
};
export const reservedSlug = (slug: string) => /^(admin(?:\/|$)|our-team\/|buja-hackathon(?:\/|$))/.test(slug) || slug.includes(":") || slug.includes("?") || slug.includes("#");
export const normalizeSlug = (value: string) => value.trim().replace(/^\/+|\/+$/g, "").toLowerCase();
export const reorderBlocks = (blocks: CmsBlock[], from: number, to: number) => {
  if (from < 0 || to < 0 || from >= blocks.length || to >= blocks.length) return blocks;
  const next = [...blocks];
  const [block] = next.splice(from, 1);
  next.splice(to, 0, block);
  return next;
};