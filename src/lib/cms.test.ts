import { describe, expect, it } from "vitest";
import { localized, normalizeSlug, reorderBlocks, reservedSlug, type CmsBlock } from "./cms";
describe("CMS pages", () => {
  it("supports French, English and Kiswahili with fallback", () => {
    const content = {fr: "Bonjour", en: "Hello", sw: "Habari"};
    expect(localized(content,"fr")).toBe("Bonjour");
    expect(localized(content,"en")).toBe("Hello");
    expect(localized(content,"sw")).toBe("Habari");
    expect(localized({en:"Hello"},"sw")).toBe("Hello");
  });
  it("reorders visual blocks without losing content", () => {
    const blocks: CmsBlock[] = ["a","b","c"].map(id => ({id,type:"text",content:{en:id}}));
    expect(reorderBlocks(blocks,0,2).map(b=>b.id)).toEqual(["b","c","a"]);
    expect(blocks.map(b=>b.id)).toEqual(["a","b","c"]);
  });
  it("protects login, biography and retired hackathon URLs", () => {
    for(const slug of ["admin","admin/login","our-team/name","buja-hackathon"]) expect(reservedSlug(slug)).toBe(true);
    expect(reservedSlug("new-page")).toBe(false);
    expect(normalizeSlug(" /New-Page/ ")).toBe("new-page");
  });
});