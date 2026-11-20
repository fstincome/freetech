import { describe, expect, it } from "vitest";
import { trainingApplicationSchema, csvCell } from "./trainingApplication";

const application = { full_name: "Test Participant", email: "participant@example.com", phone: "+25769034965", age: 20, city: "Gitega", occupation: "Étudiant", education: "Secondaire", modules: ["basic_computing"], computer_level: "beginner", design_level: "beginner", computer_access: "no", availability: "Les après-midi", motivation: "Développer mes compétences", accessibility_needs: "", consent: true, language: "fr" };
describe("Training applications", () => {
  it("accepts the Informatique de Base module", () => expect(trainingApplicationSchema.parse(application).modules).toEqual(["basic_computing"]));
  it("accepts the Design Graphique module", () => expect(trainingApplicationSchema.parse({ ...application, modules: ["graphic_design"] }).modules).toEqual(["graphic_design"]));
  it("allows only one module", () => {
    expect(trainingApplicationSchema.safeParse({ ...application, modules: ["basic_computing", "graphic_design"] }).success).toBe(false);
    expect(trainingApplicationSchema.safeParse({ ...application, modules: ["basic_computing", "basic_computing"] }).success).toBe(false);
  });
  it("requires a module and a valid email for manual replies", () => {
    expect(trainingApplicationSchema.safeParse({ ...application, modules: [] }).success).toBe(false);
    expect(trainingApplicationSchema.safeParse({ ...application, email: "invalid" }).success).toBe(false);
  });
  it("does not let applicants set their own status", () => expect(trainingApplicationSchema.safeParse({ ...application, status: "accepted" }).success).toBe(false));
  it("requires consent and bounds text", () => {
    expect(trainingApplicationSchema.safeParse({ ...application, consent: false }).success).toBe(false);
    expect(trainingApplicationSchema.safeParse({ ...application, motivation: "a".repeat(1501) }).success).toBe(false);
  });
  it("neutralizes spreadsheet formulas in exported cells", () => expect(csvCell("=1+1")).toBe('"\'=1+1"'));
});describe("Training contact owner", () => {
  it("accepts a parent's contact details and no availability", () => expect(trainingApplicationSchema.parse({ ...application, availability: undefined, contact_owner: "parent" }).contact_owner).toBe("parent"));
});
