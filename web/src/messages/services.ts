import type { Locale } from "@/lib/i18n";

export type ServicePageMessages = {
  title: string;
  lead: string;
  paragraphs: string[];
};

export type ServicesMessages = {
  wireframing: ServicePageMessages;
  uiDesign: ServicePageMessages;
  prototyping: ServicePageMessages;
  presentations: ServicePageMessages;
  motionDesign: ServicePageMessages;
  frontEndDev: ServicePageMessages;
  backEndDev: ServicePageMessages;
  aiAutomation: ServicePageMessages;
  uxResearch: ServicePageMessages;
  userTesting: ServicePageMessages;
  designSystem: ServicePageMessages;
  logoDesign: ServicePageMessages;
  creativeConcept: ServicePageMessages;
  characterDesign: ServicePageMessages;
  productStars: ServicePageMessages;
  productUxUiDesign: ServicePageMessages;
};

export const services: Record<Locale, ServicesMessages> = {
  en: {
    wireframing: {
      title: "Wireframing",
      lead: "Imagine starting a journey without a map. That's what building a digital product without wireframes feels like. Wireframing is the blueprint of your user experience, giving structure and clarity to your ideas before a single pixel is designed or a line of code is written.",
      paragraphs: [
        "Our wireframing process is where creativity meets strategy. We begin by listening—diving deep into your goals, your users' needs, and the challenges your product aims to solve. Using collaborative workshops and AI-powered research, we quickly translate concepts into clear, interactive wireframes that outline the flow, hierarchy, and functionality of every screen.",
        "Wireframes are more than just sketches. They are a powerful communication tool, aligning your team, stakeholders, and developers around a shared vision. By mapping out user journeys and key interactions early, we help you spot potential issues, test ideas, and make informed decisions before investing in design or development.",
        "Throughout the process, we use smart prototyping tools and automation to iterate rapidly, adapting wireframes based on real user feedback and data-driven insights. This approach ensures that every element serves a purpose and that the final product is intuitive, efficient, and ready to delight your users.",
        "With our wireframing services, you gain more than just a set of diagrams. You receive a strategic foundation for your project, a clear roadmap for designers and developers, and the confidence that your product will be built on solid ground. Wireframing is where your vision takes shape—and where great digital experiences begin.",
      ],
    },
    uiDesign: {
      title: "UI Design",
      lead: "Exceptional UI design is where creativity, strategy, and technology converge to create digital experiences that are not only beautiful but also intuitive, accessible, and effective. Our UI design team specializes in transforming ideas and requirements into visually compelling interfaces that engage users and drive results across every platform.",
      paragraphs: [
        "We believe that great user interface design is much more than just choosing colors and arranging elements on a screen. It's about understanding your brand, your users, and your business goals, then translating that understanding into a visual language that feels natural and inspiring. Our process begins with in-depth research, where we analyze your market, study your competitors, and dive deep into your audience's needs and behaviors.",
        "Collaboration is at the heart of our approach. We work closely with your team through workshops and brainstorming sessions, ensuring that every stakeholder's perspective is heard and integrated into the design process. Together, we define the core principles and visual direction that will shape your product's identity.",
        "Our designers are experts in creating pixel-perfect interfaces for web, mobile, and desktop applications. We leverage the latest design tools and intelligent automation to streamline workflows, maintain consistency, and accelerate delivery. Every component is crafted with attention to detail and usability. We prioritize accessibility, ensuring your product is inclusive and easy to use for everyone.",
        "Throughout the design process, we use AI-driven testing and user feedback to validate our choices and optimize the user journey. Interactive prototypes allow you and your stakeholders to experience the interface in action, gather real-time feedback, and make informed decisions before development begins.",
        "Our UI design services extend beyond the screen. We create comprehensive design systems with clear guidelines for colors, typography, spacing, and components, making it easy for your development team to implement and scale the design across all platforms.",
        "With our UI design expertise, you gain more than a beautiful interface. You gain a strategic partner who will help you elevate your brand, deliver outstanding user experiences, and support your business growth.",
      ],
    },
    prototyping: {
      title: "Prototyping",
      lead: "Our UX/UI team specializes in crafting realistic, interactive prototypes that bring your ideas to life. These prototypes are adaptable across platforms, enabling you to test new concepts, validate technical feasibility, and explore innovative features with confidence.",
      paragraphs: [
        "We believe that prototyping is a crucial step in building successful digital products. By creating interactive prototypes for both mobile and desktop, we allow investors, developers, and real users to engage with your product vision early in the process. This hands-on experience reveals how the final product will look, feel, and function—long before development begins.",
        "Throughout the process, we maintain an open and dynamic creative process, using intelligent design systems and data-driven insights. Our team explores, experiments, and refines ideas until every concept reaches the highest level of execution.",
        "At the end of the process you receive a clear creative direction and a cohesive set of ideas that will inspire your team, give fresh energy to your marketing activity, and strengthen your brand's presence in the world.",
        "The benefits of prototyping are clear: it reduces time and costs by catching problems early, leads to a higher quality product, and provides a powerful tool for gathering feedback. For those seeking investment, a working prototype is the most compelling way to showcase your vision.",
        "With our prototyping services, you gain more than just a preview—you get a strategic advantage that accelerates development, improves quality, and increases your chances of success in the market.",
      ],
    },
    presentations: {
      title: "Presentations",
      lead: "A powerful presentation can turn ideas into action and leave a lasting impression on any audience. Our team specializes in designing presentations that combine compelling storytelling, striking visuals, and smart technology to help you communicate with clarity and confidence.",
      paragraphs: [
        "We start with a deep understanding of your goals, your audience, and the message you want to convey. Using collaborative workshops and AI-guided research, we uncover the key insights and emotional triggers that will make your presentations leave a mark. Our designers create a visual narrative that supports your story through custom graphics, animations, and data visualizations.",
        "Throughout the process, we leverage advanced design tools and automation to streamline slide creation and ensure every detail is polished. We pay close attention to structure, pacing, and visual hierarchy, making sure your presentation flows smoothly and keeps your audience engaged from start to finish.",
        "Our approach blends creativity with data-driven strategy, allowing us to tailor each presentation to your unique needs—whether it's a pitch deck, investor update, product launch, or keynote speech. We deliver a complete presentation package, including editable slides, brand-aligned templates, and clear guidelines for future use.",
        "With our presentation design services, you gain more than just beautiful slides. You receive a powerful communication tool that inspires action, builds credibility, and helps your ideas stand out in any setting.",
      ],
    },
    motionDesign: {
      title: "Motion Design",
      lead: "From Smile to Trust. Motion Design that Excites, Harmonizes, and Converts.",
      paragraphs: [
        "Trusted by 500+ of the world's biggest brands. We use motion to activate positive emotions, build trust, and make interfaces feel alive—from micro-interactions to full product stories.",
        "Positive activation and excitement: surprise your users and turn everyday interactions into moments they remember. Trust and emotional bond: motion that helps users feel confident, connected, and at home in your product.",
        "Motivation and engagement: reward loops, feedback, and movement that keep people coming back. Whether it's Lottie, video, or UI choreography, we align motion with your brand and your goals—so the experience doesn't just look good, it performs.",
        "Make your product unforgettable—with the right motion, users don't just use it; they enjoy it. Book a call to explore how motion design can elevate your platform.",
      ],
    },
    frontEndDev: {
      title: "Front End Development",
      lead: "We specialize in building robust, scalable interfaces with React.js, Angular, Vue.js, and Next.js—choosing the right technology stack to match your project's needs and future growth. By combining deep technical expertise with a passion for user experience, we create web applications that not only look great but also perform flawlessly under real-world conditions.",
      paragraphs: [
        "Our process starts with a thorough understanding of your brand, your users, and your business goals. We collaborate closely with your team to translate design systems and creative concepts into pixel-perfect, accessible interfaces. Using smart automation and AI-powered testing tools, we optimize every interaction for speed, accessibility, and consistency.",
        "Throughout development, we focus on clean, maintainable code and best practices that make it easy to scale and evolve your product. Whether you need a dynamic single-page application, a high-performance website, or a complex dashboard, our developers ensure every detail is crafted with care.",
        "With our front end development services, you gain more than just a beautiful interface—you get a powerful, future-ready platform that delights users and drives results.",
      ],
    },
    backEndDev: {
      title: "Back End Development",
      lead: "Back-end development is the engine that powers your digital products, ensuring they are robust, scalable, and secure. Our expert team specializes in building high-performance server-side solutions that seamlessly connect your front-end experiences with powerful databases, APIs, and cloud infrastructure.",
      paragraphs: [
        "From designing efficient data models to implementing secure authentication and real-time data processing, we handle every aspect of your back-end ecosystem. Our approach combines deep technical expertise with a clear understanding of your business goals, allowing us to deliver solutions that optimize performance, enhance security, and support seamless integration with third-party services.",
        "Our process begins with a thorough analysis of your requirements and existing systems. We use advanced monitoring and analytics tools to identify bottlenecks, anticipate future needs, and ensure your infrastructure is ready for scale.",
        "Throughout our collaboration, we focus on building maintainable codebases, implementing robust security protocols, and ensuring high availability. We document every step and empower your team to manage and extend your back-end systems with confidence.",
        "With our back-end development services, you gain a solid technological foundation that enables you to launch new features faster, deliver seamless user experiences, and adapt quickly to changing market demands.",
      ],
    },
    aiAutomation: {
      title: "AI & Automation",
      lead: "AI-driven solutions are revolutionizing business process automation, allowing digital interfaces to adapt dynamically to user needs and behaviors. By integrating advanced automation tools, artificial intelligence, and predictive analytics, we deliver seamless digital experiences that are highly efficient and personalized.",
      paragraphs: [
        "Our methodology is AI-powered from the very beginning. We start by applying advanced analytics to understand your business, your target audience, and your market landscape. AI-driven insights help us identify new opportunities, predict emerging trends, and tailor intelligent automation solutions that fit your specific needs.",
        "Throughout our collaboration, we harness AI to craft compelling brand storytelling, conduct audience analysis using machine learning, and perform competitive reviews with AI-powered insights. We map and automate your business processes and develop a customized automation strategy.",
        "With our AI-driven digital branding process, you receive a complete brand guideline and automation roadmap that enable you to continuously improve your products, services, and digital assets.",
      ],
    },
    uxResearch: {
      title: "UX Research",
      lead: "In order to create a great product you must really understand your users. Triolla will conduct professional UX research to reveal all users' hidden needs and motivations for your product to succeed.",
      paragraphs: [
        "In today's fast-moving digital landscape, building a product that simply works is no longer enough. Users expect seamless, intuitive, and emotionally resonant experiences. That's where Product UX Research steps in—not as a luxury, but as a strategic essential that drives innovation, reduces risk, and unlocks product-market fit.",
        "Whether you're a startup, scale-up, or an established enterprise, investing in UX Research is the smartest move you can make to future-proof your product. With AI transforming the way users engage with technology, aligning your UX strategy with real user needs has never been more critical.",
        "Product UX Research is the process of understanding your users' behaviors, needs, pain points, and motivations through observation and analysis. This insight feeds directly into your product design, ensuring that every interaction is meaningful, efficient, and aligned with your business goals.",
        "These answers empower teams to make data-driven design decisions, reduce development waste, and increase customer satisfaction and retention. Companies that invest in UX Research tend to ship more successful products and grow over time.",
      ],
    },
    userTesting: {
      title: "User Testing",
      lead: "User testing is the key to creating digital products that truly resonate with your audience. Our team specializes in designing and conducting user testing sessions that reveal real insights, validate design decisions, and drive continuous improvement.",
      paragraphs: [
        "Throughout the process, we analyze both quantitative data and qualitative insights, looking for patterns in user behavior and pain points that might otherwise go unnoticed. Our team synthesizes findings into clear recommendations, helping you prioritize improvements and optimize the user experience before launch.",
        "With our user testing services, you gain more than just feedback. You receive a roadmap for refinement, a deeper understanding of your users, and the confidence that your product will perform in the real world.",
      ],
    },
    designSystem: {
      title: "Design System Creation",
      lead: "A strong design system is the backbone of every successful digital product. Our team specializes in building flexible, scalable, and visually consistent design systems that empower your brand to grow and adapt with confidence.",
      paragraphs: [
        "Throughout the process, we leverage intelligent design tools and automation to streamline asset creation and documentation. Our approach ensures that every element is not only beautiful but also functional and easy to implement across platforms.",
        "As your design system takes shape, we provide clear guidelines and interactive documentation that make it simple for your team to adopt and extend. The result is a living system that evolves with your brand and delivers a seamless user experience at every touchpoint.",
        "With our design system creation services, you gain more than just a set of rules—you unlock a creative foundation that inspires innovation, supports collaboration, and keeps your brand looking sharp as you scale.",
      ],
    },
    logoDesign: {
      title: "Logo Design",
      lead: "A great logo is more than just a symbol. It is the face of your brand and the foundation of your entire visual identity. Our logo design team combines creative vision, strategic thinking, and advanced technology to craft logos that are instantly recognizable, memorable, and built to stand the test of time.",
      paragraphs: [
        "Our designers move into the creative exploration phase, developing a wide range of concepts that experiment with shapes, colors, and typography. We pay close attention to every detail, ensuring that every element works together to create a logo that is both original and clear.",
        "We rigorously test logo concepts across various platforms and sizes, making sure your new mark looks sharp and consistent whether it appears on a website, mobile app, business card, or billboard.",
        "With our logo design services, you receive more than just a new logo. You gain a powerful brand asset that captures your essence, tells your story, and leaves a lasting impression on everyone who encounters your brand.",
      ],
    },
    creativeConcept: {
      title: "Creative Concept",
      lead: "Every memorable brand begins with a bold creative concept. Our team specializes in turning sparks of inspiration into fully realized ideas that capture attention and drive real engagement. By fusing creative intuition with AI-driven research and design, we help you uncover the unique story only your brand can tell.",
      paragraphs: [
        "We start by immersing ourselves in your world, learning what motivates your audience and what sets you apart. Using advanced analytics and trend-spotting tools, we surface fresh opportunities and creative directions. Together, we explore visual languages, narrative possibilities, and emotional triggers that can become the heart of your next campaign or product.",
        "Throughout the process, we use intelligent design systems and automation to keep the creative energy flowing. Our team blends artistic vision with data-driven insights to refine every idea until it's ready to shine.",
        "By the end, you'll have a clear creative direction and a toolkit of ideas ready to inspire your team, energize your marketing, and set your brand apart.",
      ],
    },
    characterDesign: {
      title: "Character Design",
      lead: "From initial sketches to fully realized digital personas, our Character Design team brings your stories and products to life with creativity, strategy, and cutting-edge technology. We blend artistic vision with AI-powered tools to create memorable, engaging characters that resonate with your audience.",
      paragraphs: [
        "The team works side by side with you through every phase—from brainstorming and mood boards, through detailed illustration, to animation-ready assets. Smart design systems and automation keep the process efficient and visually consistent.",
        "Throughout our collaboration, we use AI to enhance creative exploration, analyze audience preferences, and personalize character features for maximum engagement. We also develop iconography, illustration systems, and clear documentation.",
        "With our Character Design services, you receive a complete creative toolkit and brand-aligned character assets ready to be used across digital platforms, marketing campaigns, games, and more.",
      ],
    },
    productStars: {
      title: "Product Stars",
      lead: "Meet the Product Stars of Triolla: where user experience meets excellence. In today's digital world, what truly sets one product apart is not just technology—it's the experience.",
      paragraphs: [
        "Product Stars is a unique concept by Triolla, a leading UX/UI agency, designed to highlight the critical importance of outstanding user experience for product success. These are real products that Triolla helped design—and they achieved remarkable success thanks to exceptional user experience.",
        "In an era of endless options, users have no patience for clunky interfaces or complex processes. A product with great UX drives user retention, increases engagement, differentiates from competitors, reduces support costs, and increases revenue.",
        "Triolla deeply understands the nuances of the UX/UI world. Whether building an innovative product from scratch or improving an existing experience, our team of experts has one goal: to turn every product into a star.",
        "If you're a product manager, entrepreneur, or business owner and want your next product to be a true star in the market, don't underestimate the importance of UX/UI.",
      ],
    },
    productUxUiDesign: {
      title: "Product UX/UI Design",
      lead: "At our Product Design UX/UI studio, we have a mission: to design user interfaces for mobile apps and complex platforms that people not only use, but love and remember.",
      paragraphs: [
        "As industry leaders, we go beyond just delivering expert design services—we offer full accompaniment of the entire process, from concept to launch. By partnering with us, you can trust that we'll be with you every step of the way.",
        "The research phase is essential to the UX/UI design process. We gather and analyze data about your target audience, the market, and the competitive landscape—through competitive analysis, user research, ecosystem analysis, and industry analysis.",
        "Personas are fictional characters representing different user types of the product. Defining personas ensures precise alignment of the product to users, improves usability, and guides design decisions throughout the project.",
        "Wireframing allows designers to build an initial blueprint of the user interface and navigation flow, helping define the product structure and test design decisions before visual design begins.",
        "A strong design system provides guidelines for colors, typography, spacing, and components—ensuring a consistent, high-quality user experience and accelerating development across all platforms.",
      ],
    },
  },

  he: {
    wireframing: {
      title: "ווירפריימים",
      lead: "תהליך יצירת הוויירפריים שלנו יהיה המקום שבו יצירתיות תפגוש אסטרטגיה. נתחיל בהקשבה, ולאחר מכן נצלול לעומק המטרות שלכם, הצרכים של המשתמשים שלכם והאתגרים שהמוצר שלכם נועד לפתור.",
      paragraphs: [
        "באמצעות סדנאות שיתופיות ומחקר מונחה AI, נתרגם במהירות את הרעיונות שלכם לוויירפריימים אינטראקטיביים וברורים, שימפו את הזרימה, ההיררכיה והפונקציונליות של כל מסך.",
        "וויירפריימים יהיו הרבה יותר מסקיצות. הם יהפכו לכלי תקשורת עוצמתי שיאחד את הצוות שלכם סביב חזון משותף. באמצעות מיפוי מסעות משתמש ואינטראקציות מרכזיות כבר בשלבים המוקדמים, נסייע לכם לזהות בעיות פוטנציאליות, לבדוק רעיונות ולקבל החלטות מושכלות עוד לפני ההשקעה בעיצוב או בפיתוח.",
        "במהלך התהליך נשתמש בכלי אבטיפוס חכמים ובאוטומציה כדי לבצע איטרציות מהירות, נתאים את הוויירפריימים בהתאם למשוב אמיתי מהמשתמשים ולתובנות מונחות נתונים. גישה זו תבטיח שכל אלמנט ישמש מטרה ברורה, כך שהמוצר הסופי יהיה אינטואיטיבי, יעיל ומוכן לספק חוויית משתמש מהנה.",
        "עם שירותי יצירת הוויירפריימים שלנו תקבל הרבה יותר ממערכת דיאגרמות – תקבלו בסיס אסטרטגי לפרויקט שלכם, מפת דרכים ברורה עבור המעצבים והמפתחים, ובסיס שיבטיח את הכיוון של המוצר שלכם. כאן בדיוק החזון שלכם יקבל צורה – וכאן יתחילו חוויות דיגיטליות מצוינות.",
      ],
    },
    uiDesign: {
      title: "עיצוב UI",
      lead: "אנחנו מאמינים שעיצוב ממשק משתמש מוצלח, עיצוב UI, הוא הרבה יותר מבחירה של צבעים וסידור אלמנטים על המסך. מדובר בהבנה מעמיקה של המותג, המשתמשים והמטרות העסקיות, ובתרגום ההבנה הזו לשפה חזותית ברורה ומעוררת השראה.",
      paragraphs: [
        "נתחיל במחקר מעמיק, בו ננתח את השוק, נבחן את המתחרים ונצלול לעומק הצרכים וההתנהגויות של קהל היעד שלך. באמצעות ניתוחים מונחי AI וחיזוי מגמות, נחשוף תובנות שינחו כל החלטת עיצוב ויסייעו לנו לזהות מה יתחבר בצורה הטובה ביותר עם המשתמשים שלך.",
        "שיתוף פעולה הוא לב הגישה שלנו. ביחד עם הצוות שלכם, נקיים סדנאות ומפגשי סיעור מוחות, כדי לוודא שכל נקודת המבט שלכם תישמע ותשתלב בתהליך העיצוב. נגדיר את העקרונות המרכזיים ואת הכיוון החזותי שיעצבו את זהות המוצר.",
        "המעצבים שלנו מתמחים בעיצוב UI ממשקים מדויקים ומוקפדים לאפליקציות ווב, מובייל ודסקטופ. ננצל את כלי העיצוב המתקדמים ביותר ואת יכולות האוטומציה החכמה כדי לייעל את זרימת העבודה, לשמור על אחידות ולזרז את קצב ההפקה. ניתן עדיפות גבוהה לנגישות, כדי להבטיח שהמוצר שלך יהיה נגיש וקל לשימוש עבור כולם.",
        "במהלך תהליך העיצוב נשתמש בבדיקות מונחות AI ובמשוב מהמשתמשים כדי לאמת את הבחירות שלנו ולמטב את מסע המשתמש. אבטיפוסים אינטראקטיביים יאפשרו לך ולבעלי העניין שלך לחוות את הממשק בפעולה, לאסוף משוב בזמן אמת ולקבל החלטות מושכלות עוד לפני תחילת הפיתוח.",
        "שירותי עיצוב UI שלנו יתפרסו מעבר למסך. ניצור מערכות עיצוב מקיפות הכוללות הנחיות ברורות לשימוש בצבעים, טיפוגרפיה, ריווחים ורכיבים, כך שלצוות הפיתוח שלך יהיה קל ליישם את העיצוב ולהרחיב אותו בכל הפלטפורמות.",
        "עם המומחיות שלנו בעיצוב ממשק משתמש תקבל הרבה יותר מממשק יפה. תקבל שותף אסטרטגי שילווה אותך בהעצמת המותג שלך, בהענקת חוויית משתמש מעולה ובתמיכה בצמיחת העסק שלך.",
      ],
    },
    prototyping: {
      title: "פרוטוטייפ",
      lead: "אנחנו מאמינים שיצירת פרוטוטייפ היא שלב חיוני בבניית מוצרים דיגיטליים מצליחים. באמצעות יצירת פרוטוטייפים אינטראקטיביים למובייל ולדסקטופ, נאפשר למשקיעים, למפתחים ולמשתמשים אמיתיים לחוות את החזון של המוצר שלך כבר בשלבים מוקדמים.",
      paragraphs: [
        "החוויה המעשית הזו תחשוף כיצד המוצר הסופי ייראה, ירגיש ויתפקד – הרבה לפני שהפיתוח יתחיל.",
        "במהלך התהליך אנו שומרים על תהליך יצירתי פתוח ודינמי, תוך שימוש במערכות עיצוב חכמות ובתובנות מבוססות נתונים. הצוות שלנו בוחן, מנסה ומשכלל רעיונות, עד שכל קונספט מגיע לרמת הביצוע הגבוהה ביותר.",
        "בסיום התהליך תקבל כיוון קריאייטיבי ברור ומערך רעיונות מגובש, שייתן השראה לצוות שלך, יעניק אנרגיה חדשה לפעילות השיווקית ויחזק את הנוכחות של המותג שלך בעולם.",
      ],
    },
    presentations: {
      title: "מצגות",
      lead: "נתחיל בהבנה מעמיקה של המטרות שלך, הקהל שלך והמסר שברצונך להעביר. באמצעות סדנאות משותפות ומחקר מונחה AI, נחשוף את התובנות המרכזיות והטריגרים הרגשיים שיגרמו למצגות שלך להשאיר חותם.",
      paragraphs: [
        "המעצבים שלנו ייצרו נרטיב חזותי שתומך בסיפור שלך, באמצעות גרפיקה מותאמת אישית, אנימציות והמחשות נתונים שממחישות רעיונות מורכבים בצורה ברורה ומעוררת עניין.",
        "במהלך התהליך ננצל כלים מתקדמים לעיצוב ואוטומציה כדי לייעל את יצירת השקפים ולהבטיח שכל פרט יהיה מלוטש ומדויק. נשים דגש רב על מבנה, קצב והיררכיה חזותית, כדי לוודא שהמצגת תזרום באופן חלק ותשמור על מעורבות הקהל מההתחלה ועד הסוף.",
        "הגישה שלנו משלבת יצירתיות עם אסטרטגיה מונחית נתונים, מה שיאפשר לנו להתאים כל מצגת לצרכים הייחודיים שלך, בין אם מדובר בדק משקיעים, עדכון לבעלי מניות, השקת מוצר או הרצאת מפתח. נספק עבורך חבילת מצגת מלאה הכוללת שקפים ניתנים לעריכה, תבניות מותאמות למותג והנחיות ברורות לשימוש עתידי.",
        "עם שירותי עיצוב המצגות שלנו תקבל הרבה יותר משקפים מעוצבים. תקבל כלי תקשורת עוצמתי שיניע לפעולה, יחזק את האמינות שלך ויעזור לרעיונות שלך לבלוט בכל במה.",
      ],
    },
    motionDesign: {
      title: "עיצוב מושן",
      lead: "נתחיל בהבנה מעמיקה של סיפור המותג שלך, המטרות וקהל היעד. באמצעות סדנאות יצירתיות ומחקר מונחה AI, נזהה את השפה החזותית וסגנונות התנועה שיבטאו בצורה הטובה ביותר את האישיות של המותג.",
      paragraphs: [
        "המעצבים והאנימטורים שלנו חוקרים מגוון רחב של קונספטים, מתנסים בתזמון, במעברים ובאפקטים חזותיים, כדי למצוא את הקצב והזרימה המושלמים.",
        "במהלך התהליך אנו משתמשים בכלי אנימציה מתקדמים ובאוטומציה חכמה כדי לייעל את תהליך ההפקה ולהבטיח שכל פרט יהיה מלוטש ומדויק. אנו בודקים את נכסי האנימציה במגוון פלטפורמות ומכשירים, כדי לוודא שהתנועה חלקה, רספונסיבית ואחידה.",
        "הגישה שלנו משלבת חזון אמנותי עם תובנות מונחות נתונים, מה שמאפשר לנו ליצור עיצוב בתנועה שנראה מרהיב וגם משפר את חוויית המשתמש ומגביר את המעורבות. אנו מספקים סט מלא של נכסי אנימציה, לצד הנחיות ברורות ליישום.",
        "עם שירותי עיצוב בתנועה שלנו, תקבל הרבה יותר מאנימציות יפות. תפתח ממד חדש של סיפור מותג, שימשוך את המשתמשים פנימה, יחזק את זהות המותג שלך וישאיר רושם מתמשך.",
      ],
    },
    frontEndDev: {
      title: "פיתוח Front End",
      lead: "אנו מתמחים בבניית ממשקים באמצעות React.js, Angular, Vue.js ו-Next.js, תוך התאמת טכנולוגיות הפיתוח המתאימות ביותר לצרכים של הפרויקט שלך ולהתפתחות העתידית שלו. באמצעות שילוב של מומחיות טכנולוגית עמוקה ותשוקה לחוויית משתמש איכותית, אנו יוצרים אפליקציות ווב שנראות מצוין ופועלות בצורה מושלמת גם בתנאי שימוש אמיתיים.",
      paragraphs: [
        "התהליך שלנו מתחיל בהבנה מעמיקה של המותג שלך, המשתמשים שלך והמטרות העסקיות שלך. אנו עובדים בשיתוף פעולה צמוד עם הצוות שלך כדי לתרגם מערכות עיצוב ורעיונות קריאייטיב לממשקים מדויקים ונגישים. באמצעות אוטומציה חכמה וכלי בדיקות מונחי AI, אנו ממטבים כל אינטראקציה למהירות, נגישות ואחידות.",
        "במהלך הפיתוח אנו מקפידים על כתיבת קוד נקי וניתן לתחזוקה, תוך יישום שיטות עבודה מומלצות שמאפשרות למוצר שלך לגדול ולהתפתח בקלות. בין אם מדובר ביישום חד-עמוד דינמי, אתר עתיר ביצועים או לוח בקרה מורכב, המפתחים שלנו מקפידים על כל פרט בתשומת לב ובקפדנות.",
        "עם שירותי הפיתוח לצד הלקוח שלנו, תקבל לא רק ממשק יפה אלא גם פלטפורמה חזקה ומוכנה לעתיד, שמעניקה חוויית משתמש מעולה ומייצרת תוצאות ממשיות.",
      ],
    },
    backEndDev: {
      title: "פיתוח Back End",
      lead: "מתכנון מודלי נתונים יעילים ועד ליישום מנגנוני אימות מאובטחים ועיבוד נתונים בזמן אמת, אנו מטפלים בכל היבט של מערך ה-Back-End שלך. הגישה שלנו משלבת מומחיות טכנית מעמיקה עם הבנה עסקית רחבה.",
      paragraphs: [
        "התהליך שלנו מתחיל בניתוח יסודי של הדרישות שלך ושל המערכות הקיימות. אנו משתמשים בכלי ניטור וניתוח מתקדמים לזיהוי צווארי בקבוק, לצפייה בצרכים עתידיים ולהבטחה שהתשתית שלך מוכנה לגדול.",
        "במהלך שיתוף הפעולה אנו מקפידים על פיתוח קוד יציב וניתן לתחזוקה, יישום פרוטוקולי אבטחה מתקדמים והבטחת זמינות גבוהה. כל שלב מתועד ומלווה בהנחיות ברורות לפיתוח עתידי.",
        "עם שירותי פיתוח ה-Back-End שלנו תוכל ליהנות מתשתית טכנולוגית חזקה שתאפשר לך להשיק פיצ'רים חדשים במהירות, לספק חוויות משתמש חלקות ולהתאים את עצמך לשינויים בשוק.",
      ],
    },
    aiAutomation: {
      title: "AI ואוטומציה",
      lead: "מהניתוח החכם ביותר של נתונים ועד לאוטומציה מלאה, אנו משלבים טכנולוגיות AI מתקדמות בכל שלב בפרויקט. בשיתוף פעולה, נגלה כיצד בינה מלאכותית ולמידת מכונה יכולות לחזק את המותג שלך, לייעל תהליכים ולהעניק ערך ייחודי לעסק שלך.",
      paragraphs: [
        "הגישה שלנו מונעת AI כבר מהרגע הראשון. בעזרת ניתוחים מתקדמים, אנו לומדים את העסק שלך, את קהל היעד ואת סביבת השוק. תובנות מונחות AI מסייעות לנו לזהות הזדמנויות חדשות ולהתאים פתרונות אוטומציה חכמים לצרכים שלך.",
        "לאורך הדרך, נשתמש ביכולות AI ליצירת סיפור מותג מעורר השראה, לניתוח קהלים בלמידת מכונה ולסקירת המתחרים בעזרת תובנות מתקדמות. נמפה ונייעל תהליכים עסקיים ונפתח אסטרטגיית אוטומציה מותאמת אישית.",
        "עם תהליך מיתוג דיגיטלי מונחה AI, תקבל כלים מעשיים – מדריך מותג ומפת דרכים לאוטומציה – שיאפשרו לך לשפר בהתמדה את המוצרים, השירותים והנכסים הדיגיטליים שלך.",
      ],
    },
    uxResearch: {
      title: "מחקר UX",
      lead: "בעולם הדיגיטלי המהיר של היום, בניית מוצר שפשוט פועל כבר לא מספיקה. המשתמשים מצפים לחוויה חלקה, אינטואיטיבית ובעלת ערך רגשי. כאן נכנס לתמונה מחקר חוויית משתמש (UX Research) – לא כמותרות, אלא ככלי אסטרטגי חיוני.",
      paragraphs: [
        "בין אם אתם סטארטאפ, חברה בצמיחה או ארגון מבוסס, השקעה במחקר UX תהיה המהלך החכם ביותר שתוכל לבצע כדי להבטיח שהמוצר שלכם יצליח. עם AI שמשנה את האופן שבו משתמשים מתקשרים עם טכנולוגיה, ההתאמה לצרכי משתמשים אמיתיים מעולם לא הייתה קריטית יותר.",
        "מחקר UX הוא תהליך שבו נבין לעומק את ההתנהגויות, הצרכים, נקודות הכאב והמניעים של המשתמשים שלך. תובנות אלו מזינות ישירות את עיצוב המוצר – ומבטיחות שכל אינטראקציה היא בעלת משמעות ותואמת את מטרות העסק.",
        "התשובות שנקבל יאפשרו לצוות שלכם לקבל החלטות עיצוביות מונחות נתונים, לצמצם זמן בפיתוח ולהגדיל את שביעות רצון המשתמשים. חברות שמשקיעות במחקר UX נוטות להשיק מוצרים מוצלחים יותר ולצמוח לאורך זמן.",
        "ב-Triolla עזרנו למאות חברות טכנולוגיה למצות את הפוטנציאל של מוצריהן באמצעות מחקר UX אסטרטגי – בתחומים כמו סייבר, פינטק, רפואה, גיימינג ועוד.",
      ],
    },
    userTesting: {
      title: "בדיקות משתמשים",
      lead: "נתחיל בהבנה מעמיקה של המטרות שלך ובזיהוי מסעות המשתמש הקריטיים בתוך המוצר שלך. באמצעות שילוב של ניתוחים מונחי AI ותצפיות מעשיות, נגייס משתמשים אמיתיים ונדריך אותם דרך אבטיפוסים אינטראקטיביים או ממשקים חיים.",
      paragraphs: [
        "במהלך התהליך ננתח גם נתונים כמותיים וגם תובנות איכותניות, ונחפש דפוסים בהתנהגות המשתמשים ובנקודות כאב שעשויות להישאר בלתי נראות אחרת. נזקק את הממצאים למסקנות ברורות וננסח המלצות שיעזרו לך לתעדף שיפורים.",
        "עם שירותי בדיקות המשתמש שלנו תקבל הרבה יותר ממשוב. תקבל מפת דרכים לשיפור, הבנה עמוקה יותר של המשתמשים שלך והביטחון שהמוצר שלך יתפקד היטב בעולם האמיתי.",
      ],
    },
    designSystem: {
      title: "בניית Design System",
      lead: "תהליך היצירה שלנו מתחיל בצלילה מעמיקה אל זהות המותג שלך, בהבנת המטרות שלך ובמיפוי האתגרים הייחודיים שהמוצר שלך מתמודד איתם. אנו מזהים את אבני הבניין: פלטות צבעים, טיפוגרפיה, אייקונים, רכיבים ותבניות.",
      paragraphs: [
        "במהלך התהליך אנו משתמשים בכלי עיצוב חכמים ובאוטומציה כדי לייעל את יצירת הנכסים ואת תהליך התיעוד. הגישה שלנו מבטיחה שכל רכיב הוא לא רק יפה אלא גם פונקציונלי וקל ליישום בכל הפלטפורמות.",
        "ככל שמערכת העיצוב שלך מתגבשת, אנו מספקים הנחיות ברורות ותיעוד אינטראקטיבי שמקל על הצוות שלך לאמץ ולהרחיב את המערכת. התוצאה היא מערכת חיה שמתפתחת עם המותג שלך.",
        "עם שירותי יצירת מערכת העיצוב שלנו תקבל הרבה יותר מאוסף של כללים. תקבל בסיס יצירתי שמעודד חדשנות, תומך בשיתוף פעולה ומבטיח שהמותג שלך ייראה מצוין בכל קנה מידה.",
      ],
    },
    logoDesign: {
      title: "עיצוב לוגו",
      lead: "אנחנו מאמינים שכל לוגו מוצלח מתחיל בהבנה עמוקה של הסיפור, הערכים והקהל של המותג שלך. תהליך העבודה שלנו מתחיל במחקר מעמיק וסדנאות משותפות, שבהן אנו בוחנים את סביבת השוק שלך.",
      paragraphs: [
        "בהמשך, המעצבים שלנו נכנסים לשלב החקר היצירתי ומפתחים מגוון רחב של קונספטים, תוך ניסוי בצורות, צבעים וטיפוגרפיה. אנו שמים דגש על כל פרט כדי להבטיח שכל אלמנט עובד יחד ליצירת לוגו מקורי וברור.",
        "אנו בודקים בקפדנות את קונספטי הלוגו במגוון פלטפורמות וגדלים, כדי לוודא שהסמל החדש שלך נראה חד ואחיד בין אם הוא מופיע באתר אינטרנט, אפליקציה, כרטיס ביקור או שלט חוצות.",
        "עם שירותי עיצוב הלוגו שלנו, תקבל הרבה יותר מלוגו חדש. תקבל נכס מותג עוצמתי שמעביר את המהות שלך, מספר את הסיפור שלך ומשאיר רושם בל יימחה.",
      ],
    },
    creativeConcept: {
      title: "קונספט יצירתי",
      lead: "נתחיל בהיכרות מעמיקה עם עולם התוכן שלך, נלמד מה מניע את הקהל שלך ומה מבדל את המותג שלך בשוק. בעזרת ניתוחים מתקדמים וכלים לזיהוי מגמות, אנו חושפים הזדמנויות חדשות וכיווני יצירה מקוריים.",
      paragraphs: [
        "במהלך התהליך אנו שומרים על תהליך יצירתי פתוח ודינמי, תוך שימוש במערכות עיצוב חכמות ובתובנות מבוססות נתונים. הצוות שלנו בוחן, מנסה ומשכלל רעיונות, עד שכל קונספט מגיע לרמת הביצוע הגבוהה ביותר.",
        "בסיום התהליך תקבל כיוון קריאייטיבי ברור ומערך רעיונות מגובש, שייתן השראה לצוות שלך, יעניק אנרגיה חדשה לפעילות השיווקית ויחזק את הנוכחות של המותג שלך בעולם.",
      ],
    },
    characterDesign: {
      title: "עיצוב דמויות",
      lead: "תהליך עיצוב הדמויות שלנו מתחיל בהבנה מעמיקה של המותג שלך, המטרות שלך והרגשות שברצונך לעורר. אנו מזהים את השפה הוויזואלית, תכונות האופי ואלמנטים הסיפוריים שיהפכו את הדמויות שלך לייחודיות ובעלות השפעה.",
      paragraphs: [
        "הצוות שלנו פועל בשיתוף מלא איתך בכל שלב בתהליך היצירה – החל מסיעור מוחות ובניית לוחות השראה, דרך איור מפורט ועד להכנת נכסים מוכנים לאנימציה. מערכות עיצוב חכמות ואוטומציה שומרות על יעילות ואחידות ויזואלית.",
        "במהלך שיתוף הפעולה אנו משתמשים ביכולות AI להרחבת החקר היצירתי, לניתוח העדפות קהל ולהתאמה אישית של מאפייני הדמויות. אנו מפתחים גם אייקונוגרפיה, מערכות איור ותיעוד ברור.",
        "עם שירותי עיצוב הדמויות שלנו, תקבל ערכת כלים יצירתית מלאה ונכסים מותאמים למותג, המוכנים לשימוש במגוון רחב של פלטפורמות דיגיטליות, קמפיינים שיווקיים, משחקים ועוד.",
      ],
    },
    productStars: {
      title: "Product Stars",
      lead: "הכירו את Product Stars של Triolla: המקום שבו חוויית משתמש פוגשת מצוינות. בעולם הדיגיטלי של היום, מה שמבדיל מוצר אחד מהשני הוא לא רק הטכנולוגיה – אלא החוויה.",
      paragraphs: [
        "Product Stars הוא קונספט ייחודי של Triolla, סוכנות UX/UI מובילה, שנועד להדגיש את החשיבות הקריטית של חוויית משתמש מצוינת להצלחת המוצר. אלו הם מוצרים אמיתיים שטריולה עזרה לעצב – והם הגיעו להצלחה יוצאת דופן.",
        "בעידן של אינסוף אפשרויות, למשתמשים אין סבלנות לממשקים מסורבלים. מוצר עם חוויית משתמש טובה מגביר שימור, מעורבות והכנסות, מפחית עלויות תמיכה ומבדיל אתכם מהמתחרים.",
        "Triolla מבינה לעומק את הניואנסים של עולם ה-UX/UI. בין אם מדובר בבניית מוצר חדשני מאפס, שיפור חוויה קיימת, או ייעול תהליכים מורכבים – הצוות שלנו יוצר מוצרים שהופכים לכוכבים.",
        "אם אתם מנהלי מוצר, יזמים או בעלי עסקים ורוצים שהמוצר הבא שלכם יהיה כוכב אמיתי בשוק, אל תמעיטו בחשיבות ה-UX/UI.",
      ],
    },
    productUxUiDesign: {
      title: "עיצוב UX/UI למוצר",
      lead: "בסטודיו שלנו לעיצוב מוצר וחוויית משתמש (UX/UI), יש לנו מטרה ברורה: לעצב ממשקי משתמש לאפליקציות מובייל ולפלטפורמות מורכבות, שאנשים לא רק משתמשים בהן – אלא גם אוהבים וזוכרים.",
      paragraphs: [
        "כמובילים בתעשייה, אנו לא מסתפקים במתן שירותי עיצוב מקצועיים בלבד – אלא מציעים ליווי מלא של כל תהליך הפיתוח, משלב הרעיון ועד ההשקה.",
        "שלב המחקר הוא מרכיב חיוני בתהליך. אנו אוספים ומנתחים נתונים על קהל היעד, השוק ונוף התחרות – באמצעות ניתוח מתחרים, מחקר משתמשים, ניתוח מערכת אקולוגית וניתוח תעשייתי.",
        "פרסונות הן דמויות פיקטיביות המייצגות את סוגי המשתמשים השונים. הגדרתן מבטיחה התאמה מדויקת של המוצר למשתמשים, משפרת את חוויית השימוש ומנחה החלטות עיצוב לאורך כל הפרויקט.",
        "יצירת ויירפריימים מאפשרת למעצבים לבנות תרשים ראשוני של ממשק המשתמש וזרימת הניווט, ולבחון החלטות עיצוב לפני שמתחילים בעיצוב הוויזואלי.",
        "מערכת עיצוב חזקה מספקת הנחיות לצבעים, טיפוגרפיה, ריווח ורכיבים – ומבטיחה חוויית משתמש עקבית ואיכותית בכל הפלטפורמות.",
      ],
    },
  },
};
