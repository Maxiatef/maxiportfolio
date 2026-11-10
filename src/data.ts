export const profile = {
  first: 'MAXIMOUS',
  full: 'Maximous Atef Shafiq',
  role: 'Full Stack Developer',
  base: 'Alexandria, Egypt',
  email: 'maxatef235@gmail.com',
  phone: '+201272546687',
  cv: '/MaximusAtefShafiq_CV.pdf',
  summary:
    'Graduated from the Faculty of Science, Alexandria University. I build full-stack products on both .NET and MERN — C#, JavaScript, TypeScript, React, Node.js, Express, MongoDB and SQL — with a focus on clean database design, solid APIs and experiences people enjoy using.',
};

export const socials = [
  { tag: 'GH', label: 'GitHub', href: 'https://github.com/Maxiatef' },
  { tag: 'IN', label: 'LinkedIn', href: 'https://www.linkedin.com/in/maximous-atef-shafiq/' },
  { tag: 'WA', label: 'WhatsApp', href: 'https://wa.me/201272546687' },
  { tag: '@', label: 'Email', href: 'mailto:maxatef235@gmail.com' },
  { tag: 'FB', label: 'Facebook', href: 'https://facebook.com/Maxi.Atef235' },
  { tag: 'DC', label: 'Discord', href: 'https://discord.com/users/464210016963133440' },
];

export type Quest = {
  when: string;
  title: string;
  org: string;
  mode: string;
  body: string;
  tags?: string[];
  now?: boolean;
};

// chronological — the walker moves left to right through time
export const quests: Quest[] = [
  {
    when: 'Jul 2022 — Aug 2022',
    title: 'Technical Staff',
    org: 'HackerRank',
    mode: 'Extra-curricular',
    body: 'Joined the technical staff for HackerRank events — first taste of competitive problem solving at scale.',
  },
  {
    when: 'Jun 2023 — Oct 2024',
    title: 'Freelance Video Editor',
    org: 'Self-employed',
    mode: 'Remote',
    body: 'Cut and delivered client videos remotely. Side quest that sharpened an eye for motion and timing.',
  },
  {
    when: 'Jun 2024 — Sep 2024',
    title: 'Web Development Training',
    org: 'CodeAlpha',
    mode: 'Remote internship',
    body: 'Built BookNest, a library management website with a RESTful Node/Express API and React front end.',
    tags: ['Node.js', 'React', 'MongoDB', 'Express'],
  },
  {
    when: 'Dec 2024 — Apr 2025',
    title: 'Military Service',
    org: 'Egyptian Armed Forces',
    mode: 'Completed',
    body: 'Completed military service as a soldier, 1 December 2024 to 8 April 2025.',
  },
  {
    when: 'Jul 2025 — Dec 2025',
    title: '.NET Full Stack & Generative AI',
    org: 'Information Technology Institute (ITI)',
    mode: 'On site · Alexandria',
    body: 'Intensive full-stack track. Graduation project: Tessera, a ticket management system with Stripe payments.',
    tags: ['.NET 9', 'EF Core', 'MySQL', 'Angular 18'],
  },
  {
    when: 'Dec 2025 — Present',
    title: 'Software Engineer',
    org: 'Inventors Incubator',
    mode: 'Full time → part time · Alexandria',
    body: 'Developed an MLS platform: TypeScript backend (REST APIs, business logic), React Native mobile app and TypeScript web UI — with agentic AI and LLM features across web and mobile.',
    tags: ['TypeScript', 'React Native', 'LLMs', 'Agents'],
    now: true,
  },
  {
    when: 'Aug 2026 — Present',
    title: 'Full Stack Developer',
    org: 'CoCoJoJo.com',
    mode: 'Full time · Remote (California, USA)',
    body: 'Building a full inventory management and online order handling system for the company’s e-commerce platform.',
    tags: ['Inventory', 'Orders', 'E-commerce'],
    now: true,
  },
];

export type SkillGroup = { id: string; label: string; items: { tag: string; name: string }[] };

export const skillGroups: SkillGroup[] = [
  {
    id: 'lang',
    label: 'Languages',
    items: [
      { tag: 'JS', name: 'JavaScript' },
      { tag: 'TS', name: 'TypeScript' },
      { tag: 'C#', name: 'C#' },
      { tag: 'C++', name: 'C++' },
      { tag: 'JV', name: 'Java' },
      { tag: 'PY', name: 'Python' },
    ],
  },
  {
    id: 'back',
    label: 'Backend',
    items: [
      { tag: '.NT', name: '.NET Core' },
      { tag: 'EF', name: 'Entity Framework' },
      { tag: 'LQ', name: 'LINQ' },
      { tag: 'ND', name: 'Node.js' },
      { tag: 'EX', name: 'Express.js' },
      { tag: 'API', name: 'RESTful APIs' },
      { tag: 'GQL', name: 'GraphQL' },
      { tag: 'IO', name: 'Socket.io' },
    ],
  },
  {
    id: 'front',
    label: 'Frontend',
    items: [
      { tag: 'RE', name: 'React' },
      { tag: 'RN', name: 'React Native' },
      { tag: 'NG', name: 'Angular' },
      { tag: 'NX', name: 'Next.js' },
      { tag: 'H5', name: 'HTML5' },
      { tag: 'C3', name: 'CSS3' },
      { tag: 'BS', name: 'Bootstrap' },
    ],
  },
  {
    id: 'data',
    label: 'Data & Ops',
    items: [
      { tag: 'SQL', name: 'SQL Server' },
      { tag: 'MY', name: 'MySQL' },
      { tag: 'MDB', name: 'MongoDB' },
      { tag: 'RD', name: 'Redis' },
      { tag: 'DK', name: 'Docker' },
      { tag: 'AI', name: 'LLMs & Agents' },
    ],
  },
  {
    id: 'soft',
    label: 'Soft skills',
    items: [
      { tag: 'PS', name: 'Problem solving' },
      { tag: 'TW', name: 'Teamwork' },
      { tag: 'AD', name: 'Adaptability' },
      { tag: 'CL', name: 'Continuous learning' },
    ],
  },
];

export type Stage = {
  title: string;
  kind: string;
  desc: string;
  stack: string[];
  link: string;
  img?: string;
  filter: 'dotnet' | 'mern' | 'web' | 'other';
  featured?: boolean;
};

export const stages: Stage[] = [
  {
    title: 'Tessera',
    kind: 'ITI graduation project',
    desc: 'Ticket management system with event listings, booking and Stripe payments. ASP.NET Core API on .NET 9 with an Angular 18 front end.',
    stack: ['.NET 9', 'ASP.NET Core', 'EF Core', 'MySQL', 'LINQ', 'Stripe.net', 'Angular 18'],
    link: 'https://github.com/gannatullah/Tessera',
    filter: 'dotnet',
    featured: true,
  },
  {
    title: 'Petpal',
    kind: 'University graduation project · Excellent',
    desc: 'Pet care platform on a MERN microservices architecture, with email flows, image uploads and OpenAI-powered features.',
    stack: ['MERN', 'Microservices', 'OpenAI', 'Cloudinary', 'Nodemailer', 'MUI'],
    link: 'https://github.com/mennamoussa/petpal',
    filter: 'mern',
    featured: true,
  },
  {
    title: 'E-Commerce Gaming',
    kind: 'University project',
    desc: 'Gaming e-commerce web application split into microservices, containerised with Docker and cached with Redis.',
    stack: ['MERN', 'Microservices', 'Docker', 'Redis', 'bcrypt'],
    link: 'https://github.com/Andrewaziz99/E-Commerce_Web_Application',
    img: '/projects/project6.webp',
    filter: 'mern',
    featured: true,
  },
  {
    title: 'BookNest',
    kind: 'CodeAlpha internship',
    desc: 'Library management website — browse, borrow and manage books through a RESTful Express API.',
    stack: ['Node.js', 'Express', 'React', 'MongoDB'],
    link: 'https://github.com/Maxiatef/BookNest',
    filter: 'mern',
    featured: true,
  },
  {
    title: 'Kemet Technologies',
    kind: 'Client project · Company website',
    desc: 'Company portfolio site for a software agency, showcasing web, mobile, SEO and AI services with an animated hero, service carousel and a built-in chat widget.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Responsive design'],
    link: 'https://kemetts.com/',
    img: '/projects/kemet.jpg',
    filter: 'web',
    featured: true,
  },
  {
    title: 'ATTRACT',
    kind: 'Next.js · Technical SEO',
    desc: 'Gaming products storefront focused on pairing dynamic data rendering with high-performance technical SEO, using a server-side API proxy.',
    stack: ['Next.js', 'SEO', 'API proxy'],
    link: 'https://seo-product.vercel.app/',
    img: '/projects/project12.webp',
    filter: 'web',
  },
  {
    title: 'FreshCart',
    kind: 'Angular e-commerce',
    desc: 'E-commerce platform with product catalog, cart, authentication, authorization and secure checkout.',
    stack: ['Angular', 'TypeScript', 'Auth'],
    link: 'https://freshcart-rho-six.vercel.app/home',
    img: '/projects/project7.webp',
    filter: 'web',
  },
  {
    title: 'SkySnap',
    kind: 'Weather app',
    desc: 'Real-time weather and a 5-day hourly forecast for any city, in a responsive dark theme.',
    stack: ['JavaScript', 'Weather API'],
    link: 'https://sky-snap-ecru.vercel.app/',
    img: '/projects/project8.webp',
    filter: 'web',
  },
  {
    title: 'Students MVC',
    kind: 'ASP.NET MVC',
    desc: 'Manage students and departments with full CRUD, Entity Framework and dynamic views.',
    stack: ['ASP.NET MVC', 'EF', 'C#'],
    link: 'https://github.com/Maxiatef/CRUD_Students_Department_MVC.Net',
    img: '/projects/project9.webp',
    filter: 'dotnet',
  },
  {
    title: 'Connect Four',
    kind: 'C# WinForms game',
    desc: 'Two players or player vs computer, with basic AI and a clean split between UI and game logic.',
    stack: ['C#', 'WinForms'],
    link: 'https://github.com/Maxiatef/Connect_Four_WindowsForms',
    img: '/projects/project2.webp',
    filter: 'dotnet',
  },
  {
    title: 'GraphQL CRUD',
    kind: 'Apollo Server API',
    desc: 'GraphQL API managing a content database of games, reviews and authors.',
    stack: ['GraphQL', 'Apollo', 'Node.js'],
    link: 'https://github.com/Maxiatef/GraphQL_CRUD',
    img: '/projects/project4.webp',
    filter: 'other',
  },
  {
    title: 'Chatroom',
    kind: 'Real-time chat',
    desc: 'Real-time chat application where users talk live through Socket.io.',
    stack: ['Node.js', 'Socket.io'],
    link: 'https://github.com/Maxiatef/Chatroom',
    img: '/projects/project11.webp',
    filter: 'other',
  },
  {
    title: 'Cybersecurity Site',
    kind: 'Bootstrap landing',
    desc: 'Clean, responsive cybersecurity website demo built with Bootstrap.',
    stack: ['Bootstrap', 'HTML', 'CSS'],
    link: 'https://bootstrap-project-ten-ruddy.vercel.app/',
    img: '/projects/project10.webp',
    filter: 'web',
  },
];

export const stageFilters = [
  { id: 'all', label: 'All' },
  { id: 'dotnet', label: '.NET / C#' },
  { id: 'mern', label: 'MERN' },
  { id: 'web', label: 'Web apps' },
  { id: 'other', label: 'APIs' },
] as const;

export const achievements = [
  { title: 'Database Fundamentals', by: 'Maharatech', when: 'Jul 2025', link: 'https://drive.google.com/file/d/158dCQu-mVdxgxpwGsnz-lWR3T-PvB01m/view?usp=sharing' },
  { title: 'The Complete Node.js Course', by: 'Maharatech', when: 'Aug 2024', link: 'https://drive.google.com/file/d/1NMmkT4_pjWdUovnYjymHAwmZRbAeXYiP/view?usp=sharing' },
  { title: 'Open-Source Development', by: 'ITI · Summer training', when: 'Aug 2023', link: 'https://drive.google.com/file/d/1q59RWLIQLUWNP9Zv2ny1-A90eQncn5Xg/view?usp=sharing' },
  { title: 'Internet of Things — IoT Value Chain', by: 'Maharatech', when: 'Jul 2023' },
  { title: 'Developing iOS Apps with Swift', by: 'ITI · Winter training', when: 'Feb 2023', link: 'https://drive.google.com/file/d/1438-WclsojbJZqiS4gQFYKIjylFhkjI1/view?usp=sharing' },
  { title: 'Introduction to Artificial Intelligence', by: 'IBM', when: 'Feb 2023', link: 'https://drive.google.com/file/d/1JhSUSxLvCn3djMU7FLFnUERf1kawc3cJ/view?usp=sharing' },
  { title: 'Linux System Administration — IBM Power', by: 'IBM', when: 'Jul 2022' },
];
