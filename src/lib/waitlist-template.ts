/** Shared card surface classes for waitlist / personal public pages and previews. */
export function waitlistTemplateCardClass(templateId: string): string {
  switch (templateId) {
    case "modern":
      return "bg-zinc-900 text-white border-zinc-700";
    case "neobrutal":
      return "border-4 border-black bg-yellow-300 text-black shadow-[6px_6px_0_0_#000]";
    case "minimal":
      return "border border-neutral-200 bg-white text-neutral-900 shadow-none";
    case "modern2":
      return "bg-gradient-to-br from-blue-600 to-blue-800 text-white border-transparent";
    case "neumorphism":
      return "border-0 bg-neutral-200 text-neutral-800 shadow-[12px_12px_24px_#bebebe,-12px_-12px_24px_#ffffff]";
    default:
      return "border border-neutral-200 bg-white text-neutral-900 shadow-lg";
  }
}
