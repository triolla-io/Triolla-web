/**
 * StyleMap.ts - Single Source of Truth for Triolla Design System
 *
 * This is the "Brain" for all styling across the project.
 * Every CSS variable, font, color, and spacing value is defined here.
 * All components reference this map - no hardcoded values.
 *
 * Usage:
 *   import { STYLE_MAP } from '@/lib/StyleMap';
 *   const fontSize = STYLE_MAP.typography.body.fontSize;
 */

export const STYLE_MAP = {
  // ============================================
  // TYPOGRAPHY SYSTEM
  // ============================================
  typography: {
    // Font Families
    families: {
      primary: "'SFProText'", // Main UI font
      display: "'SF Compact Display'", // Headings, large text
      mono: "monospace", // Code/technical text
    },

    // Font Sizes (in px)
    sizes: {
      // Hero/Large headings
      h1: {
        fontSize: 72,
        fontWeight: 860,
        lineHeight: 1,
      },
      h2: {
        fontSize: 64,
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 1.4,
      },
      // Winners section - VERIFIED from triolla.io (Live Source of Truth)
      winnerTitle: {
        fontSize: 80, // ✓ triolla.io: 80px
        fontWeight: 700, // ✓ triolla.io: 700
        lineHeight: 1, // ✓ triolla.io: 80px = 1:1 ratio
      },
      winnerSubtitle: {
        fontSize: 40, // ✓ triolla.io: 40px
        fontWeight: 600, // ✓ triolla.io: 600
        lineHeight: 1.3,
      },
      winnerBox: {
        fontSize: 30, // Optimized for visual appearance (better spacing with <br> tags)
        fontWeight: 590, // ✓ triolla.io: 590
        lineHeight: 1.2, // ✓ triolla.io: 1.2
      },
      // Body text
      body: {
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      bodySmall: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      // Labels/UI
      label: {
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      // Buttons
      button: {
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.4,
      },
    },

    // Responsive Overrides (breakpoints) - proportional to 24px base
    responsive: {
      mobile: {
        winnerTitle: {
          fontSize: 46,
          fontWeight: 700,
          lineHeight: 1.2,
        },
        winnerSubtitle: {
          fontSize: 16,
          fontWeight: 600,
          lineHeight: 1.3,
        },
        winnerBox: {
          fontSize: 14, // Proportional to 24px base (24/900 ≈ 14/480)
          fontWeight: 590,
          lineHeight: 1.2,
        },
      },
      tablet: {
        winnerTitle: {
          fontSize: 56,
          fontWeight: 700,
          lineHeight: 1.2,
        },
        winnerBox: {
          fontSize: 18, // Proportional to 24px base (24/900 ≈ 18/675)
          fontWeight: 590,
          lineHeight: 1.2,
        },
      },
    },
  },

  // ============================================
  // COLOR SYSTEM
  // ============================================
  colors: {
    // Neutrals
    black: "#000000",
    white: "#FFFFFF",
    gray50: "#FAFAFA",
    gray100: "#F0F0F0",
    gray200: "#E7EBF0",
    gray300: "#D5D9DE",
    gray600: "#666666",
    gray700: "#4F4F4F",

    // Brand Colors
    primary: "#FFD729", // Yellow accent
    secondary: "#000000", // Black
    tertiary: "#FFFFFF", // White

    // Semantic Colors
    success: "#06C",
    error: "#DC3232",
    warning: "#FFB600",

    // Background Colors
    background: {
      default: "#E7EBF0",
      dark: "#000000",
      light: "#FFFFFF",
    },

    // Text Colors
    text: {
      primary: "#000000",
      secondary: "#666666",
      tertiary: "#4F4F4F",
      light: "#FFFFFF",
    },
  },

  // ============================================
  // SPACING SYSTEM
  // ============================================
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
    huge: 96,
  },

  // ============================================
  // COMPONENT-SPECIFIC STYLES
  // ============================================
  components: {
    // Winners Section - 1:1 LIVE SITE (triolla.io)
    winners: {
      section: {
        padding: {
          desktop: "80px 0",
          tablet: "60px 0",
          mobile: "40px 0",
        },
        backgroundColor: "transparent", // ✓ triolla.io: transparent
      },
      title: {
        fontFamily: '"SF Pro"', // ✓ triolla.io: "SF Pro"
        fontSize: 80, // ✓ triolla.io: 80px
        fontWeight: 700, // ✓ triolla.io: 700
        lineHeight: 1, // ✓ triolla.io: 1:1 ratio
        marginBottom: 24,
      },
      subtitle: {
        fontFamily: '"SF Pro"', // ✓ triolla.io: "SF Pro"
        fontSize: 40, // ✓ triolla.io: 40px
        fontWeight: 600, // ✓ triolla.io: 600
        lineHeight: 1.3, // ✓ triolla.io: 1.3
        marginBottom: 50,
      },
      boxContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        marginTop: 50,
      },
      box: {
        width: "30%",
        textAlign: "center",
        fontSize: 24, // ✓ triolla.io: 24px
        fontWeight: 590, // ✓ triolla.io: 590
        lineHeight: 1.2, // ✓ triolla.io: 1.2
        marginTop: 30, // ✓ triolla.io: spacing before title
        fontFamily: '"SF Pro"', // ✓ triolla.io: "SF Pro"
      },
      image: {
        width: "100%",
        height: "auto",
        marginBottom: 20, // ✓ triolla.io: 20px spacing
      },
    },

    // Header Buttons
    headerButton: {
      fontSize: 16,
      fontWeight: 500,
      padding: "10px 20px",
      borderRadius: "50px",
      border: "1px solid #000000",
      backgroundColor: "transparent",
    },

    // Hero Section
    hero: {
      h1: {
        fontFamily: "'SFProText'",
        fontSize: 72,
        fontWeight: 860,
        lineHeight: 1,
      },
      h2: {
        fontFamily: "'SFProText'",
        fontSize: 64,
        fontWeight: 400,
        lineHeight: 1.2,
      },
    },

    // Global/Clients Section
    global: {
      h2: {
        fontFamily: "'SFProText'",
        fontSize: 32,
        fontWeight: 400,
        lineHeight: 1.3,
      },
      h3: {
        fontFamily: "'SFProText'",
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.4,
      },
    },

    // FAQ Section
    faq: {
      title: {
        fontFamily: "'SFProText'",
        fontSize: 16,
        fontWeight: 400,
      },
      detail: {
        fontFamily: "'SFProText'",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
  },

  // ============================================
  // BREAKPOINTS (Media Queries)
  // ============================================
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
    ultraWide: 1920,
  },

  // ============================================
  // ANIMATION & TRANSITIONS
  // ============================================
  animation: {
    duration: {
      fast: "0.15s",
      normal: "0.3s",
      slow: "0.5s",
      verySlow: "1.2s",
    },
    easing: {
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      linear: "linear",
    },
  },

  // ============================================
  // SHADOWS & EFFECTS
  // ============================================
  effects: {
    boxShadow: {
      subtle: "0 0 1px rgba(0,0,0,0)",
      light: "0 2px 8px rgba(0,0,0,0.1)",
      medium: "0 4px 12px rgba(0,0,0,0.15)",
      heavy: "0 8px 24px rgba(0,0,0,0.2)",
    },
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get responsive value based on breakpoint
 * Usage: getResponsiveValue(STYLE_MAP.components.winners.section.padding)
 */
export function getResponsiveValue(obj: any, breakpoint: 'mobile' | 'tablet' | 'desktop' = 'desktop') {
  return obj?.[breakpoint] ?? obj?.desktop ?? obj;
}

/**
 * Create CSS string from typography style object
 */
export function typographyToCss(style: any): string {
  return `
    font-family: ${style.fontFamily};
    font-size: ${style.fontSize}px;
    font-weight: ${style.fontWeight};
    line-height: ${style.lineHeight};
  `;
}

/**
 * Export type for strict typing in components
 */
export type StyleMapType = typeof STYLE_MAP;
