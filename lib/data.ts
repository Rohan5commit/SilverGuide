export type ModuleDefinition = {
  id: string;
  title: string;
  summary: string;
  route: string;
  icon: "shield" | "sparkles" | "monitor" | "check";
  audienceBenefit: string;
  demoMoment: string;
  bullets: string[];
};

export type ScamExample = {
  id: string;
  title: string;
  channel: "Text" | "Email" | "Popup" | "Poster" | "Direct message";
  sender: string;
  summary: string;
  message: string;
  verdict: "safe" | "suspicious" | "very_suspicious";
  redFlags: string[];
  simpleExplanation: string;
  recommendedAction: string;
  neverDoThis: string[];
};

export type LessonStep = {
  title: string;
  body: string;
  tip: string;
};

export type TechLesson = {
  id: string;
  title: string;
  category: "scam" | "ai" | "everyday";
  duration: string;
  blurb: string;
  goal: string;
  steps: LessonStep[];
};

export type PracticeQuestion = {
  id: string;
  category: "scam" | "ai" | "everyday";
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  takeaway: string;
  watchOutFor: string;
};

export const moduleDefinitions: ModuleDefinition[] = [
  {
    id: "scam-shield",
    title: "Scam Shield",
    summary: "Practice spotting risky messages before they can do harm.",
    route: "/scam-shield",
    icon: "shield",
    audienceBenefit: "Builds confidence against texts, emails, popups, and social engineering.",
    demoMoment: "Classify a fake bank text and review the red flags in plain language.",
    bullets: [
      "12 realistic scam examples",
      "Simple red-flag explanations",
      "Conservative AI scam checker",
    ],
  },
  {
    id: "ai-practice",
    title: "AI Practice",
    summary: "Learn safe, useful ways to use AI without sharing too much.",
    route: "/ai-practice",
    icon: "sparkles",
    audienceBenefit: "Turns AI curiosity into safe daily habits and better prompts.",
    demoMoment: "Improve a prompt for writing a polite note to a doctor.",
    bullets: [
      "Prompt coaching with privacy reminders",
      "Plain-language AI safety lessons",
      "NVIDIA NIM lesson helper",
    ],
  },
  {
    id: "everyday-tech",
    title: "Everyday Tech Coach",
    summary: "Follow step-by-step lessons for common digital tasks.",
    route: "/everyday-tech",
    icon: "monitor",
    audienceBenefit: "Makes daily device tasks less stressful through guided practice.",
    demoMoment: "Walk through joining a video call and checking the right buttons.",
    bullets: [
      "One step per screen",
      "Readable lessons with voice playback",
      "Accessibility rewrite option",
    ],
  },
  {
    id: "practice-mode",
    title: "Practice Mode",
    summary: "Replay short scenarios and finish with a friendly summary.",
    route: "/practice",
    icon: "check",
    audienceBenefit: "Reinforces learning without pressure or test anxiety.",
    demoMoment: "Answer one scenario per screen and finish with a confidence-focused recap.",
    bullets: [
      "Large touch targets",
      "Replayable mini-quiz",
      "Gentle feedback and reminders",
    ],
  },
];

export const scamExamples: ScamExample[] = [
  {
    id: "fake-bank-text",
    title: "Fake bank text",
    channel: "Text",
    sender: "SecureBank Alerts",
    summary: "An urgent message says your account is locked and asks you to tap a link.",
    message:
      "Security alert: Your SecureBank account has been locked after unusual activity. Verify now at securebank-review.example to avoid suspension.",
    verdict: "very_suspicious",
    redFlags: [
      "It creates panic and asks you to act right away.",
      "It sends you to a link instead of asking you to use the bank app you know.",
      "The web address is unfamiliar and not the normal bank website.",
    ],
    simpleExplanation:
      "Real banks do not want you to rush into a strange link from a text. When a message creates fear, slow down and check it another way.",
    recommendedAction:
      "Do not tap the link. Open your bank app or call the phone number on the back of your card.",
    neverDoThis: ["Do not share one-time passcodes.", "Do not sign in through a link you did not expect."],
  },
  {
    id: "package-delivery-text",
    title: "Fake package delivery text",
    channel: "Text",
    sender: "ParcelTrack",
    summary: "A package notice says a small fee is needed to release a delivery.",
    message:
      "Package held at local depot. Pay $1.99 redelivery fee within 2 hours or your parcel will be returned. Confirm here: parcel-help.example",
    verdict: "very_suspicious",
    redFlags: [
      "A tiny fee is often used to steal card details.",
      "The deadline is very short so you feel pressured.",
      "The sender does not clearly name a trusted delivery company.",
    ],
    simpleExplanation:
      "This message tries to make a small payment feel harmless. The real goal is often your card number or address details.",
    recommendedAction:
      "Delete the text. Check deliveries by opening the shipping app or website yourself.",
    neverDoThis: ["Do not pay through a link in a surprise text.", "Do not enter your card details just to 'release' a package."],
  },
  {
    id: "password-reset-email",
    title: "Fake password reset email",
    channel: "Email",
    sender: "Account Support <alerts@account-secure-help.example>",
    summary: "An email says your password was changed and asks you to click now if it was not you.",
    message:
      "We detected a password change on your account. If this was not you, click immediately to restore access and prevent data loss.",
    verdict: "suspicious",
    redFlags: [
      "The sender address is generic and does not match a known company.",
      "It tells you to click quickly instead of giving a clear support path.",
      "There is no personal detail proving the company knows who you are.",
    ],
    simpleExplanation:
      "A real service may email you about security activity, but you should still go to the service directly instead of clicking a surprise link.",
    recommendedAction:
      "Open the service in a new browser tab or app and check security settings there.",
    neverDoThis: ["Do not click email links just because the message sounds urgent."],
  },
  {
    id: "irs-warning",
    title: "Fake IRS or government warning",
    channel: "Email",
    sender: "Tax Collections Bureau",
    summary: "A warning says you owe money and legal action will begin today.",
    message:
      "FINAL NOTICE: Your tax file is under review for unpaid balance. Immediate payment is required today to avoid legal enforcement.",
    verdict: "very_suspicious",
    redFlags: [
      "It uses fear and punishment language.",
      "It asks for immediate payment without formal paperwork.",
      "The sender name is vague and not an official government contact.",
    ],
    simpleExplanation:
      "Government agencies do not usually begin with threatening emails or demand instant payment through a link.",
    recommendedAction:
      "Do not reply. Contact the agency through its official website or a phone number from a bill you trust.",
    neverDoThis: ["Do not send gift cards, crypto, or wire payments to settle a government threat."],
  },
  {
    id: "grandson-emergency",
    title: "Fake grandson emergency message",
    channel: "Text",
    sender: "Unknown number",
    summary: "Someone says a grandchild is in trouble and needs money fast.",
    message:
      "Grandma, it's me. I dropped my phone and this is my new number. I need help paying a bill today. Please do not tell Mom yet.",
    verdict: "very_suspicious",
    redFlags: [
      "It asks for secrecy so you will not verify the story.",
      "It starts emotional pressure before proving identity.",
      "It moves quickly toward money or urgency.",
    ],
    simpleExplanation:
      "Family impersonation scams often begin with panic and secrecy. A real family emergency should still be checked by calling a known number.",
    recommendedAction:
      "Stop and call your family member or another relative using the number you already have.",
    neverDoThis: ["Do not send money before speaking to a trusted family member directly."],
  },
  {
    id: "gift-card-request",
    title: "Fake gift card request",
    channel: "Email",
    sender: "Director Office <director-helpdesk.example>",
    summary: "A boss or volunteer coordinator says gift cards are needed right now.",
    message:
      "Can you help me quickly? I need 5 gift cards for a surprise appreciation program. Buy them now and send me the codes by email.",
    verdict: "very_suspicious",
    redFlags: [
      "Gift cards are a common scam payment method.",
      "The request is urgent and unusual.",
      "It avoids normal approval or purchasing steps.",
    ],
    simpleExplanation:
      "Scammers pretend to be leaders because people want to be helpful. Gift card requests are especially risky because the money is hard to recover.",
    recommendedAction:
      "Verify the request with a phone call or in person before doing anything.",
    neverDoThis: ["Do not email gift card codes.", "Do not trust purchase requests that skip the usual process."],
  },
  {
    id: "crypto-pitch",
    title: "Fake crypto investment pitch",
    channel: "Direct message",
    sender: "Mia Investor",
    summary: "A friendly message promises quick profits and a private tip.",
    message:
      "I made 3x returns this month with a private crypto mentor. I can add you to the next group if you invest before tonight.",
    verdict: "very_suspicious",
    redFlags: [
      "It promises fast, easy returns.",
      "It uses social proof without evidence.",
      "It pushes you to act before you can think or research.",
    ],
    simpleExplanation:
      "Investment scams sound exciting and personal. Quick-profit claims are a major warning sign, especially when the details stay vague.",
    recommendedAction:
      "Ignore the message and discuss investments only with regulated, trusted professionals.",
    neverDoThis: ["Do not send money because a stranger says others are earning quickly."],
  },
  {
    id: "tech-support-popup",
    title: "Fake Microsoft or Apple tech support alert",
    channel: "Popup",
    sender: "Browser popup",
    summary: "A full-screen alert says your device is infected and a number must be called.",
    message:
      "WARNING: Trojan spyware detected. Do not close this window. Call Apple Security at 1-800-000-0000 immediately to protect your photos and banking details.",
    verdict: "very_suspicious",
    redFlags: [
      "Real security tools do not ask you to call a random number from a browser popup.",
      "It tries to trap you by saying you cannot close the window.",
      "It mixes fear, urgency, and personal-data threats.",
    ],
    simpleExplanation:
      "This kind of popup wants you to panic and hand control of your device to a scammer.",
    recommendedAction:
      "Close the browser tab if you can. If it keeps appearing, restart the browser and run a trusted device update or antivirus check.",
    neverDoThis: ["Do not let a stranger remote into your computer because of a popup."],
  },
  {
    id: "qr-code-poster",
    title: "Suspicious QR code poster",
    channel: "Poster",
    sender: "Printed poster",
    summary: "A public poster promises free Wi-Fi or a prize if you scan a code.",
    message:
      "FREE community Wi-Fi upgrade. Scan this QR code to secure your device and claim a free tablet raffle entry today.",
    verdict: "suspicious",
    redFlags: [
      "You cannot see the web address before scanning.",
      "It combines a technical promise with a prize.",
      "There is no trusted organization clearly behind it.",
    ],
    simpleExplanation:
      "QR codes can hide risky links. If you do not know who posted it, treat it like an unknown web link.",
    recommendedAction:
      "Only scan codes from trusted places. If unsure, ask staff or type the website manually.",
    neverDoThis: ["Do not scan public QR codes just because the offer sounds helpful."],
  },
  {
    id: "job-offer",
    title: "Fake job offer",
    channel: "Email",
    sender: "Talent Team <careers-fastpay.example>",
    summary: "An offer promises easy remote work with very high pay and asks for personal details.",
    message:
      "Congratulations! Based on your online profile, you have been pre-selected for a remote assistant role paying $550 per day. Reply with your full name, home address, and bank details to begin onboarding.",
    verdict: "very_suspicious",
    redFlags: [
      "The pay sounds too good for a surprise offer.",
      "It asks for sensitive details before a real interview.",
      "The offer is vague about the company and work itself.",
    ],
    simpleExplanation:
      "Real employers do not need your bank details before they have clearly identified themselves and hired you properly.",
    recommendedAction:
      "Delete the email or research the company through trusted sources before answering.",
    neverDoThis: ["Do not share banking details in a first-contact email."],
  },
  {
    id: "romance-opener",
    title: "Romance scam opener",
    channel: "Direct message",
    sender: "Sofia",
    summary: "A stranger quickly becomes personal and tries to move the conversation off-platform.",
    message:
      "Hello dear, your smile made my day. I feel we have a special connection. Can we talk on a private app? I do not stay here often.",
    verdict: "suspicious",
    redFlags: [
      "The message becomes personal very quickly.",
      "It pushes you away from the safer platform.",
      "It does not say anything specific that shows the person truly knows you.",
    ],
    simpleExplanation:
      "Romance scams often begin with warm words and then move to private channels where reporting is harder.",
    recommendedAction:
      "Keep conversations on the original platform and be careful with personal details or money requests.",
    neverDoThis: ["Do not send money or private documents to someone you have not verified."],
  },
  {
    id: "account-suspension-email",
    title: "Urgent account suspension email",
    channel: "Email",
    sender: "Streaming Billing <suspension-bot.example>",
    summary: "A message says your account will be suspended today unless you confirm payment information.",
    message:
      "Your account is scheduled for suspension in 30 minutes due to a failed payment method. Confirm your card details now to continue service without interruption.",
    verdict: "suspicious",
    redFlags: [
      "A 30-minute deadline is designed to stop careful thinking.",
      "It asks for card details through a message link.",
      "The sender address is not a familiar company domain.",
    ],
    simpleExplanation:
      "Urgent billing threats are a common way to get you to hand over payment information.",
    recommendedAction:
      "Open the service website or app yourself and check billing there.",
    neverDoThis: ["Do not update payment details through a surprise email link."],
  },
];

export const techLessons: TechLesson[] = [
  {
    id: "spot-phishing-text",
    title: "Spotting a phishing text",
    category: "scam",
    duration: "3 min",
    blurb: "Learn three fast checks before you tap a link in a text message.",
    goal: "Pause, read carefully, and verify from a trusted place.",
    steps: [
      {
        title: "Start with the feeling",
        body: "If the text makes you feel rushed, scared, or guilty, slow down right away. Strong emotion is a common scam tool.",
        tip: "A real company can wait a few minutes while you verify.",
      },
      {
        title: "Check the sender and the link",
        body: "Look at the sender name and web address. Small spelling changes, strange numbers, or unfamiliar websites are warning signs.",
        tip: "When in doubt, type the website yourself instead of tapping the text link.",
      },
      {
        title: "Look for the ask",
        body: "Scam texts usually want money, passwords, passcodes, or personal information. Ask yourself what the message wants from you.",
        tip: "One-time passcodes should never be shared with another person.",
      },
      {
        title: "Verify another way",
        body: "Open the app you already trust or call the official number on your card, bill, or contact list.",
        tip: "Use contact details you already had before the message arrived.",
      },
    ],
  },
  {
    id: "fake-tech-support-popup",
    title: "Spotting a fake tech-support popup",
    category: "scam",
    duration: "2 min",
    blurb: "Know what to do when a scary browser popup claims your device is infected.",
    goal: "Recognize panic tactics and avoid giving strangers control of your device.",
    steps: [
      {
        title: "Remember where the message appeared",
        body: "A browser popup is not the same as a trusted device security app. It is often just a web page trying to scare you.",
        tip: "The web browser cannot diagnose your whole device by itself.",
      },
      {
        title: "Ignore the phone number",
        body: "Scam popups often display a support number and tell you to call immediately. That number connects you to the scammer.",
        tip: "Close the tab instead of calling.",
      },
      {
        title: "Do not give remote access",
        body: "A stranger may ask to control your computer so they can 'fix' it. This is a major risk.",
        tip: "Only use remote help from a person or company you already know and trust.",
      },
      {
        title: "Use trusted help",
        body: "Restart the browser if needed, update your device, and ask a trusted volunteer or family member for help if the alert returns.",
        tip: "Calm steps are safer than quick steps.",
      },
    ],
  },
  {
    id: "use-chatgpt-safely",
    title: "Using ChatGPT and AI tools safely",
    category: "ai",
    duration: "4 min",
    blurb: "Use AI as a helper for writing, explaining, and organizing without oversharing.",
    goal: "Ask clear questions, protect private details, and verify important answers.",
    steps: [
      {
        title: "Use AI for low-risk help",
        body: "AI is useful for drafting messages, simplifying an email, or making a checklist from notes.",
        tip: "Start with small everyday tasks.",
      },
      {
        title: "Do not share private details",
        body: "Leave out account numbers, passwords, Social Security numbers, and private medical details unless you fully trust the tool and policy.",
        tip: "You can say 'my doctor' instead of the full name or patient number.",
      },
      {
        title: "Ask for the format you want",
        body: "Clear prompts help. For example: 'Explain this email in plain English in three short bullets.'",
        tip: "Short, specific prompts usually work better than long unclear ones.",
      },
      {
        title: "Verify important advice",
        body: "AI can be wrong. Double-check anything medical, legal, financial, or safety-related with a trusted source.",
        tip: "Treat AI like a helper, not a final authority.",
      },
    ],
  },
  {
    id: "strong-password",
    title: "Making a stronger password",
    category: "everyday",
    duration: "3 min",
    blurb: "Create passwords that are easier for you to remember and harder for others to guess.",
    goal: "Use longer passwords and avoid reusing the same one everywhere.",
    steps: [
      {
        title: "Think long, not clever",
        body: "A long password is safer than a short complicated one. Four or five words can work well when they are not predictable.",
        tip: "Example pattern: LampRiverTeaWindow!",
      },
      {
        title: "Avoid personal clues",
        body: "Do not use birthdays, pet names, or your street name if others might know them.",
        tip: "If a stranger could guess it from social media, skip it.",
      },
      {
        title: "Do not reuse your main password",
        body: "If one site is hacked, reused passwords can unlock your other accounts too.",
        tip: "Your email account deserves its own strong password.",
      },
      {
        title: "Use a safe helper if needed",
        body: "A password manager or a written record stored in a safe place can be better than using the same password everywhere.",
        tip: "What matters most is a plan you can use consistently.",
      },
    ],
  },
  {
    id: "join-video-call",
    title: "Joining a video call",
    category: "everyday",
    duration: "3 min",
    blurb: "Practice joining a call calmly and checking the right audio and camera buttons.",
    goal: "Feel ready before the meeting starts.",
    steps: [
      {
        title: "Open the invite from a trusted source",
        body: "Use the email or calendar invite you expected. If you are unsure, ask the organizer to resend it.",
        tip: "Do not join through a copied link from a stranger.",
      },
      {
        title: "Join a few minutes early",
        body: "This gives you time to test your microphone, speaker, and camera without stress.",
        tip: "Early is calm. Rushed is hard.",
      },
      {
        title: "Look for the mute and camera buttons",
        body: "Before entering, check whether your microphone and camera are on or off. Most apps show a microphone and camera icon.",
        tip: "If you cannot hear, check the speaker volume first.",
      },
      {
        title: "Ask for help in simple words",
        body: "If something is wrong, say: 'I can hear you, but you cannot hear me,' or 'My picture is off.' That makes it easier for others to help.",
        tip: "Clear descriptions save time.",
      },
    ],
  },
  {
    id: "secure-website",
    title: "Checking whether a website is secure",
    category: "everyday",
    duration: "2 min",
    blurb: "Use the padlock and the full address together, not by themselves.",
    goal: "Understand what the browser address bar is telling you.",
    steps: [
      {
        title: "Look at the full address",
        body: "The most important part is the web address itself. A padlock does not mean the website is trustworthy if the address is fake.",
        tip: "Read the name slowly from left to right.",
      },
      {
        title: "Check for https",
        body: "A secure site usually starts with https. This helps protect the connection, but it does not prove the business is honest.",
        tip: "Secure connection and trusted business are not the same thing.",
      },
      {
        title: "Watch for extra words",
        body: "Scam sites often add words like login, verify, or support around a familiar brand name.",
        tip: "Example danger pattern: brandname-login-help.example",
      },
      {
        title: "Pause before signing in",
        body: "If anything feels off, stop. Search for the official site yourself or use a bookmark you already trust.",
        tip: "A short pause prevents many mistakes.",
      },
    ],
  },
  {
    id: "suspicious-download-buttons",
    title: "Identifying suspicious download buttons",
    category: "everyday",
    duration: "3 min",
    blurb: "Learn why websites sometimes show fake buttons that look like part of the page.",
    goal: "Find the real action and ignore the noisy extras.",
    steps: [
      {
        title: "Expect extra ads on free sites",
        body: "Some pages place ad buttons that say Download or Start Now even when they are not the real file.",
        tip: "If a page looks crowded, slow down before clicking anything.",
      },
      {
        title: "Find the section you meant to use",
        body: "Look for the button nearest the file name, program name, or article you actually opened.",
        tip: "Distance matters. The correct button is usually next to the item you chose.",
      },
      {
        title: "Ignore flashing or oversized buttons",
        body: "Fake buttons often use bright colors, animation, or all-caps words to grab attention.",
        tip: "Calm buttons are often the real ones.",
      },
      {
        title: "When unsure, leave the page",
        body: "If you cannot tell what is real, close the page and search for the official site instead.",
        tip: "Leaving is safer than guessing.",
      },
    ],
  },
  {
    id: "adjust-text-size",
    title: "Adjusting text size on a phone or tablet",
    category: "everyday",
    duration: "2 min",
    blurb: "Make devices easier to read without feeling lost in settings.",
    goal: "Know where text size and display zoom usually live.",
    steps: [
      {
        title: "Open Settings",
        body: "Most devices keep text size under Settings, then Display, Accessibility, or Display & Brightness.",
        tip: "If you do not see it, use the settings search bar.",
      },
      {
        title: "Try Text Size first",
        body: "Increase text a little at a time until menus and messages feel comfortable.",
        tip: "Small changes can make a big difference.",
      },
      {
        title: "Use Display Zoom if needed",
        body: "If text size is not enough, display zoom can make buttons and app layouts larger too.",
        tip: "Zoom changes the whole feel of the screen.",
      },
      {
        title: "Keep what feels comfortable",
        body: "The best setting is the one that feels easy to use every day.",
        tip: "Comfort is more important than matching someone else's screen.",
      },
    ],
  },
  {
    id: "safe-search",
    title: "Using search safely",
    category: "everyday",
    duration: "2 min",
    blurb: "Know the difference between a search result and an ad.",
    goal: "Choose results carefully instead of clicking the first thing you see.",
    steps: [
      {
        title: "Notice the ad label",
        body: "Some top results are ads. They may still be legitimate, but you should notice the label before clicking.",
        tip: "Ads are not always bad, but they deserve a closer look.",
      },
      {
        title: "Read the web address under the title",
        body: "A familiar title can hide an unfamiliar website. The address line tells you more.",
        tip: "Read the address, not just the headline.",
      },
      {
        title: "Open results that match your goal",
        body: "If you searched for your doctor's portal, the result should clearly match the clinic or hospital name you know.",
        tip: "Specific searches give safer results.",
      },
      {
        title: "Leave unclear pages quickly",
        body: "If a page looks cluttered, noisy, or different from what you expected, back out and try again.",
        tip: "Back is a safety tool.",
      },
    ],
  },
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "practice-bank-link",
    category: "scam",
    question: "A text says your bank account is locked and gives you a link. What is the safest next step?",
    choices: [
      "Tap the link so you can fix it quickly",
      "Open your bank app or call the number on your card",
      "Reply to the text and ask if it is real",
    ],
    correctIndex: 1,
    explanation: "The safest move is to use contact details you already trust, not the message link.",
    takeaway: "Pause and verify from a trusted place.",
    watchOutFor: "Urgent links in texts",
  },
  {
    id: "practice-popup",
    category: "scam",
    question: "A popup says your computer is infected and tells you to call a support number. What should you avoid?",
    choices: [
      "Closing the browser tab",
      "Giving a stranger remote access to your device",
      "Restarting the browser",
    ],
    correctIndex: 1,
    explanation: "Remote access can let scammers take control of your device and accounts.",
    takeaway: "A scary popup is not the same as trusted tech support.",
    watchOutFor: "Remote access requests",
  },
  {
    id: "practice-ai-privacy",
    category: "ai",
    question: "Which prompt is safer to send to an AI tool?",
    choices: [
      "Write a letter to my doctor about my test results. My full name is Maria Jones and my patient ID is 88441.",
      "Write a polite note to my doctor asking about next steps after my recent test results.",
      "Store my insurance number and remind me of it later.",
    ],
    correctIndex: 1,
    explanation: "The safer prompt removes extra private details while still asking for useful help.",
    takeaway: "Share less, ask clearly.",
    watchOutFor: "Oversharing personal details with AI",
  },
  {
    id: "practice-password",
    category: "everyday",
    question: "Which password is stronger?",
    choices: ["Buddy1954", "LampRiverTeaWindow!", "Password123"],
    correctIndex: 1,
    explanation: "Longer passwords with unrelated words are usually harder to guess.",
    takeaway: "Think long, not obvious.",
    watchOutFor: "Using birthdays or common words",
  },
  {
    id: "practice-secure-site",
    category: "everyday",
    question: "What should you check first before signing in on a website?",
    choices: [
      "Whether the page has a padlock icon only",
      "The full website address and whether it matches the company you expect",
      "Whether the page loaded quickly",
    ],
    correctIndex: 1,
    explanation: "The full address matters more than the padlock alone.",
    takeaway: "Read the address bar slowly.",
    watchOutFor: "Look-alike websites",
  },
  {
    id: "practice-family-message",
    category: "scam",
    question: "A message claims to be from your grandchild and says not to tell anyone. What is the best response?",
    choices: [
      "Send the money because family comes first",
      "Ask for their full address right away",
      "Call your grandchild or another family member using a number you already know",
    ],
    correctIndex: 2,
    explanation: "Secrecy is a major warning sign. Verification with a known number is the safest step.",
    takeaway: "Never let urgency replace verification.",
    watchOutFor: "Requests for secrecy",
  },
  {
    id: "practice-download-button",
    category: "everyday",
    question: "You see three big Download buttons on a page. What is the safest choice?",
    choices: [
      "Click the largest flashing button",
      "Choose the button nearest the file or article you actually opened",
      "Click any button because they should all work",
    ],
    correctIndex: 1,
    explanation: "Fake download buttons are often designed to stand out with animation or bright colors.",
    takeaway: "Look for the real action, not the loudest button.",
    watchOutFor: "Crowded pages with ads",
  },
  {
    id: "practice-prompt-improvement",
    category: "ai",
    question: "Why is 'Explain this email in plain English in three short bullets' a good AI prompt?",
    choices: [
      "It clearly states the task and the format",
      "It gives the AI your password",
      "It guarantees the AI will always be right",
    ],
    correctIndex: 0,
    explanation: "Good prompts are specific about the task and the kind of answer you want.",
    takeaway: "Clear prompts make clearer answers.",
    watchOutFor: "Trusting AI without verification",
  },
];

export const aiPromptExamples = [
  "Help me write a polite message to my doctor asking about my appointment.",
  "Explain this email in simple words and tell me if anything looks suspicious.",
  "Create a grocery list from this recipe for four people.",
  "Turn these handwritten notes into a short checklist.",
];

export const aiSafetyReminders = [
  "AI can be wrong, especially about medical, legal, and financial issues.",
  "Do not share passwords, account numbers, or other sensitive personal details.",
  "Ask for short answers in plain language when you want something easier to read.",
  "Use AI as a helper, then verify important facts with a trusted source.",
];

export const pilotHighlights = [
  "Works on any modern laptop, tablet, or desktop browser.",
  "No login is required for the MVP, so a volunteer can start a session immediately.",
  "Built-in lessons and scam examples mean a center can use it even without internet-connected AI.",
];
