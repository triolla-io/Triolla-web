import { Color, TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

// Custom FontSize — replaces Tiptap Pro's FontSize extension.
// Stores font-size as a TextStyle attribute so it round-trips through the editor.
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types as string[],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el: HTMLElement) => el.style.fontSize || null,
            renderHTML: (attrs: Record<string, unknown>) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: () => ReturnType<typeof chain> }) =>
          (chain() as ReturnType<typeof chain>).setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ReturnType<typeof chain> }) =>
          (chain() as ReturnType<typeof chain>)
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

export function createEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      // StarterKit v3 bundles Link and Underline — disable them here so we can
      // register our own configured versions below without duplicate warnings.
      link: false,
      underline: false,
    }),
    Underline,
    TextStyle,
    Color.configure({ types: ["textStyle"] }),
    FontSize.configure({ types: ["textStyle"] }),
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({
      types: ["heading", "paragraph", "blockquote"],
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: { rel: "noopener noreferrer" },
    }),
  ];
}
