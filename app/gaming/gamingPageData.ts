import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const GAMING_ASSETS = {
  bannerGridImg: "/assets/_shared/banner_grid.svg",
  bannerLayerImg: "/assets/_shared/portolio_layer.svg",
  jumpImg1: "/assets/_shared/jumping_1-1.svg",
  jumpImg2: "/assets/_shared/jumping_2-1.svg",
  jumpImg3: "/assets/_shared/jumping_3-1.svg",
} as const;

const GAMING_ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: "/assets/_shared/playtika-min.png",
    desktopImg: "/assets/_shared/Playtika-desktop.png",
    mobileImg: "/assets/_shared/Playtika-mobile.png",
    title:
      "Redefining game intelligence by enhancing user engagement and performance through Playtika's management and analytics platforms.",
    description:
      "A long and successful collaborations with Playtika on their internal platforms, focusing on analysis solutions, marketing, game experience, user satisfaction, data and more.",
    tags: ["InternalCommunication", "GameExperience", "UserData"],
  },
  {
    logo: "/assets/_shared/overwolf-min.png",
    desktopImg: "/assets/_shared/Eternal-overwolf-desktop.png",
    mobileImg: "/assets/_shared/Eternal-overwolf-mobile.png",
    title:
      "Empowering gaming's future with Overwolf's Eternal platform—enabling studios to create scalable, creator-driven UGC experiences.",
    description:
      "Overwolf's Eternal platform enables game studios to integrate community mods and content, boosting engagement, monetization, and game longevity—connecting millions of players with over 178,000 creators across 1,500+ titles.",
    tags: ["GameStudio", "ProductPlatform", "OnlineCommunity"],
  },
  {
    logo: "/assets/_shared/spring-games-min.png",
    desktopImg: "/assets/_shared/spring-game-desktop.png",
    mobileImg: "/assets/_shared/spring-game-mobile.png",
    title:
      "Bringing casual gaming to life—creating an engaging design and accessible player experience from the ground up.",
    description:
      "We collaborated with Spring games in order to create the UI for their mobile games with a focus on clarity, accessibility, and player immersion. From intuitive navigation and responsive controls to visually engaging menus and HUD elements.",
    tags: ["EngagingDesign", "MobileUI", "MobileUX"],
  },
  {
    logo: "/assets/_shared/cha-games-min.png",
    desktopImg: "/assets/_shared/Cha-game-sdesktop.png",
    mobileImg: "/assets/_shared/cha-games-mobile.png",
    title:
      "Redefining social play—Cha Games unites players with user-first, interactive mini-games.",
    description:
      "We designed an intuitive interfaces for Cha Games' multiplayer matchmaking, leaderboards, and group challenges—enhancing engagement while ensuring a seamless, secure, and privacy-conscious experience for all users.",
    tags: ["ProductDesigners", "StudioDesigners", "GamingDesign"],
  },
  {
    logo: "/assets/_shared/my-town-min.png",
    desktopImg: "/assets/_shared/my-town-desktop.png",
    mobileImg: "/assets/_shared/my-town-mobile.png",
    title:
      "Inspiring imaginative play—My Town Games lets kids explore, create, and tell stories in safe, interactive worlds.",
    description:
      "We partnered with My Town Games to enhance UX and visual design, creating intuitive interfaces and playful visuals that support creativity and immersive, open-ended play.",
    tags: ["VisualDesign", "GamingProduct", "ImmersiveExperience"],
  },
  {
    logo: "/assets/_shared/Frame-2147223744-e1747836676565.png",
    desktopImg: "/assets/_shared/BabyTV-desktop.png",
    mobileImg: "/assets/_shared/BabyTV-mobile.png",
    title:
      "Bringing early learning to life—BabyTV offers safe, playful experiences that support toddler development and parent peace of mind.",
    description:
      "Collaborating with BabyTV to enhance the user experience and visual design of their digital platforms, focusing on creating intuitive interfaces and engaging visuals.",
    tags: ["DigitalPlatforms", "IntuitiveInterfaces", "EngagingVisuals"],
  },
  {
    logo: "/assets/_shared/Frame-2147223744-1.png",
    desktopImg: "/assets/_shared/Aspire-global-desktop.png",
    mobileImg: "/assets/_shared/aspire-golobal-mobile.png",
    title:
      "Driving iGaming growth—Aspire Global powers operators with seamless, end-to-end platforms and services.",
    description:
      "We partnered with Aspire Global on various games to refine UX and visual design, creating clear, scalable interfaces that support both operator efficiency and user trust in regulated iGaming environments.",
    tags: ["UserTrust", "iGaming", "GamingExperience"],
  },
  {
    logo: "/assets/_shared/Group-1410103797.png",
    desktopImg: "/assets/_shared/Survivor-desktop.png",
    mobileImg: "/assets/_shared/survivor-mobile.png",
    title:
      "We created a real-time voting game for Survivor viewers, letting fans predict outcomes and vote on key moments, bringing the show's excitement to life on a second screen.",
    description:
      "A collaboration with CBS for the show Survivor, We designed an interactive voting game for viewers watching Survivor at home, transforming passive viewing into an engaging, real-time experience. The game lets fans cast votes on key decisions, predict outcomes, and compete with friends and other viewers.",
    tags: ["RealTimeExperience", "OnlineGaming", "LiveStream"],
  },
];

const GAMING_ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...GAMING_ITEMS_EN[0],
    title:
      "חידוש בתובנות משחק: שיגרור מעורבות וביצועים באמצעות פלטפורמות הניהול והאנליטיקה של Playtika.",
    description:
      "שיתוף פעולה ארוך ומוצלח עם Playtika במערכות פנימיות — פתרונות ניתוח, שיווק, חוויית משחק, שביעות רצון משתמשים, נתונים ועוד.",
  },
  {
    ...GAMING_ITEMS_EN[1],
    title:
      "מנוע לעתיד הגיימינג — פלטפורמת Eternal של Overwolf מאפשרת לסטודיואים לבנות חוויות UGC סקלאביליות ומונעות יוצרים.",
    description:
      "Eternal מאפשרת לסטודיואים לשלב מודים ותוכן קהילתי, לחזק מעורבות, מונטיזציה ואורך חיים — ולחבר מיליוני שחקנים לאלפי יוצרים ואלפי משחקים.",
  },
  {
    ...GAMING_ITEMS_EN[2],
    title:
      "גיימינג קז'ואל חי — עיצוב מעורר השראה וחוויית שחקן נגישה מהיסוד.",
    description:
      "שיתוף פעולה עם Spring Games ליצירת ממשק למשחקי מובייל עם דגש על בהירות, נגישות ושקיעה במשחק — ניווט אינטואיטיבי, שליטה רספונסיבית ותפריטים ו-HUD ויזואליים.",
  },
  {
    ...GAMING_ITEMS_EN[3],
    title:
      "חוויית שיחה חברתית מחודשת — Cha Games מאחדת שחקנים סביב מיני־משחקים אינטראקטיביים עם משתמש במרכז.",
    description:
      "עיצוב ממשקים ל־matchmaking רב־משתתפים, לוחות מובילים ואתגרי קבוצה — מעורבות גבוהה לצד חוויה חלקה, מאובטחת ומכבדת פרטיות.",
  },
  {
    ...GAMING_ITEMS_EN[4],
    title:
      "משחק דמיוני ובטוח — My Town Games מאפשרת לילדים לחקור, ליצור ולספר סיפורים בעולמות אינטראקטיביים.",
    description:
      "שיתוף פעולה לחיזוק UX ועיצוב ויזואלי — ממשקים אינטואיטיביים ווויזואליה שמחה שתומכים ביצירתיות ובמשחק פתוח.",
  },
  {
    ...GAMING_ITEMS_EN[5],
    title:
      "למידה מוקדמת בחיים — BabyTV עם חוויות בטוחות ומשחקיות לקידום התפתחות ולשקט נפשי להורים.",
    description:
      "שיתוף פעולה עם BabyTV לשיפור חוויית המשתמש והעיצוב בפלטפורמות הדיגיטליות — ממשקים אינטואיטיביים ויזואליה מרתקת.",
  },
  {
    ...GAMING_ITEMS_EN[6],
    title:
      "צמיחת iGaming — Aspire Global מספקת למפעילים פלטפורמות ושירותים מקצה לקצה ללא תקלות.",
    description:
      "שיתוף פעולה במגוון משחקים לדיוק UX ועיצוב — ממשקים ברורים וסקלאביליים שתומכים ביעילות מפעיל ובאמון משתמשים בסביבות iGaming רגולטוריות.",
  },
  {
    ...GAMING_ITEMS_EN[7],
    title:
      "משחק הצבעות בזמן אמת לצופי Survivor — חיזוי תוצאות והצבעות ברגעי מפתח, והצגת הריגוש גם במסך שני.",
    description:
      "שיתוף פעולה עם CBS לתכנית Survivor: משחק הצבעות אינטראקטיבי לצופים בבית — ממעבר פסיבי לחוויה חיה, הצבעות להחלטות מפתח, חיזויים ותחרות מול חברים וצופים נוספים.",
  },
];

const GAMING_GLOBAL_LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: "/assets/_shared/microsoft_global.svg", alt: "Microsoft" },
  { img: "/assets/_shared/american_express_global.svg", alt: "American Express" },
  { img: "/assets/_shared/n_gloabl.svg", alt: "N" },
  { img: "/assets/_shared/human_global.svg", alt: "Human" },
  { img: "/assets/_shared/passport_cart_global.svg", alt: "Passport" },
  { img: "/assets/_shared/jfrog_global.svg", alt: "JFrog" },
  { img: "/assets/_shared/alam_global.svg", alt: "Alam" },
  { img: "/assets/_shared/taboola_global.svg", alt: "Taboola" },
  { img: "/assets/_shared/is_global.svg", alt: "IS" },
  { img: "/assets/_shared/star_global.svg", alt: "Star" },
  { img: "/assets/_shared/playtika_global.svg", alt: "Playtika" },
  { img: "/assets/_shared/finaro_global.svg", alt: "Finaro" },
];

export const GAMING_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  partnerCount: "50+ Gaming platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Gaming",
    subtitle: "Team up with product design specialists who deliver.",
    description:
      "Fluent in Gaming, Triolla delivers immersive gameplay and engaging experiences...",
    expandedText:
      "We design immersive and engaging interfaces that elevate gameplay and keep players coming back for more. Our product design process for gaming focuses on intuitive navigation, captivating visuals, and seamless user interaction across platforms. With Triolla, your gaming products benefit from design expertise that enhances player experience, boosts retention, and brings your creative vision to life.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...GAMING_ASSETS,
  },
  portfolioItems: GAMING_ITEMS_EN,
  why: {
    mainTitle: "Why Do Gaming companies choose us?",
    items: [
      {
        title: "We play to win",
        description:
          "Fluent in player journeys, game mechanics, and immersive experiences.",
      },
      {
        title: "Game design expertise",
        description:
          "Extensive experience crafting interfaces for top gaming platforms and studios.",
      },
      {
        title: "In the game from day one",
        description:
          "We understand gamer culture, so we create engaging experiences right away.",
      },
      {
        title: "Fun by design",
        description:
          "Our UX is built for excitement, retention, and seamless player interaction.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
    logos: GAMING_GLOBAL_LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const GAMING_PAGE_DATA_HE: PortfolioPageData = {
  ...GAMING_PAGE_DATA_EN,
  dir: "rtl",
  partnerCount: "למעלה מ־50 פלטפורמות גיימינג",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "גיימינג",
    subtitle: "הצטרפו לצוות מומחי המוצר שמיישמים את החזון ומספקים תוצאות.",
    description:
      "שוטפים בשפה של גיימינג — טריאולה מספקת חוויית משחק מרתקת וסוחפת...",
    expandedText:
      "אנו מעצבים ממשקים סוחפים ומרתקים שמרימים את חוויית המשחק ומחזירים שחקנים שוב ושוב. תהליך עיצוב המוצר מתמקד בניווט אינטואיטיבי, ויזואליה מושכת ואינטראקציה חלקה בין פלטפורמות. עם טריאולה, מוצרי הגיימינג שלכם נהנים ממומחיות שמשפרת חוויית שחקן, שימור והגשמת חזון יצירתי.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...GAMING_ASSETS,
  },
  portfolioItems: GAMING_ITEMS_HE,
  why: {
    mainTitle: "למה חברות גיימינג בוחרות בנו?",
    items: [
      {
        title: "משחקים כדי לנצח",
        description: "שוטפים במסעות שחקן, במכאניקת משחק ובחוויות סוחפות.",
      },
      {
        title: "מומחיות בעיצוב משחק",
        description: "ניסיון רחב בממשקים לפלטפורמות ולסטודיואים מובילים.",
      },
      {
        title: "במשחק מהיום הראשון",
        description: "אנו מבינים תרבות גיימרים — ויוצרים חוויות מעורבות מהרגע הראשון.",
      },
      {
        title: "כיף בעיצוב",
        description: "ה־UX שלנו בנוי להתרגשות, שימור ואינטראקציה חלקה בין שחקנים.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle: "מקטן לגדול — התקדמנו עם חברות מגוונות ומובילות",
    logos: GAMING_GLOBAL_LOGOS,
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
