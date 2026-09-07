export interface ProjectLink {
  label: string;
  url: string;
  type: "github" | "demo" | "drive" | "doc" | "other";
}

export interface Project {
  id: string;
  title: string;
  category: "DevOps" | "App Dev" | "IT Governance" | "AI & Cloud";
  type: "WORK" | "PERSONAL" | "FINAL PROJECT";
  skills: string[];
  date: string;
  shortDescription: string;
  problem: string;
  role: string;
  solution: string;
  results: string;
  links: ProjectLink[];
  featured?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  companyLogoText: string;
  companyLogoUrl?: string;
  role: string;
  division?: string;
  location: string;
  period: string;
  duration?: string;
  description: string[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  period: string;
  location: string;
  logoText: string;
  logoUrl?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  iconName: string;
}

export interface TechStackCategory {
  category: string;
  description: string;
  items: {
    name: string;
    skillKey: string;
    projectCount: number;
    icon?: string;
    level: "Daily Driver" | "Proficient" | "Hands-on";
  }[];
}

export const PERSONAL_INFO = {
  name: "Irfan Noor Hidayat",
  headline: "Developer | Deep Diving Backend, DevOps, Cloud Computing & Architecture",
  subheadline: "I build Backends, Cloud Infrastructure, and Automation Systems.",
  bio: "I am an applied bachelor of Informatics and Cloud/DevOps Engineer with hands-on enterprise experience maintaining and modernizing internal systems at Panasonic, along with cloud infrastructure across AWS, GCP, and Azure. I specialize in microservices, secure network tunnels (Cloudflare Zero Trust, WireGuard), automated CI/CD workflows, and AI integration (AWS Bedrock).",
  location: "Jakarta, Indonesia",
  email: "irfannoorh@gmail.com",
  phone: "+6287784312184",
  whatsappUrl: "https://wa.me/6287784312184",
  linkedinUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
  githubUrl: "https://github.com/ChaosO9",
  resumeUrl: "#",
  avatarUrl: "https://storage.googleapis.com/web-asset-irfan/portfolio-web/Portfolio%20Profile.webp",
  languages: [
    { name: "Indonesian", level: "Native / Bilingual" },
    { name: "English", level: "Professional Working" },
    { name: "Japanese", level: "Elementary" },
  ],
};

export const EXPERIENCES: Experience[] = [
  {
    id: "panasonic-hrms",
    company: "PT Panasonic Manufacturing Indonesia",
    companyLogoText: "Panasonic",
    role: "Information System Center - HRMS",
    division: "Information System Center",
    location: "Jakarta, Indonesia",
    period: "Jan 2026 - Present",
    duration: "Current",
    description: [
      "Digitized and modernized employee contracts and in-city business trip processing, cutting manual handling time across HR and Finance.",
      "Engineered automated approval workflows deeply integrated into Microsoft Teams using Power Automate and n8n webhooks.",
      "Developed PTC (People Traffic Control) application to track and secure access of employees, contractors, suppliers, and guests entering company facilities.",
      "Maintained and enhanced core enterprise modules in ROMANSY (.NET Web Forms & SQL Server).",
    ],
    skills: [".NET Web Forms", "C#", "SQL Server", "Microsoft Teams API", "Power Automate", "n8n", "IIS"],
  },
  {
    id: "panasonic-recruitment",
    company: "PT Panasonic Manufacturing Indonesia",
    companyLogoText: "Panasonic",
    role: "IT Software Engineer (TalentTrail E-Recruitment)",
    division: "Software Engineering",
    location: "Jakarta Timur, Indonesia",
    period: "Aug 2025 - Jan 2026",
    duration: "6 months",
    description: [
      "Architected and built TalentTrail, a centralized E-Recruitment web application to streamline hiring for permanent staff across Business and HR departments.",
      "Integrated AWS Bedrock to enable AI-powered CV screening against defined job requirements (education, skills, and experience criteria).",
      "Built manpower request and approval pipelines, candidate tracking, interview scheduling, and automated stakeholder notification engines.",
    ],
    skills: ["ASP.NET Core", "Blazor UI", "AWS Bedrock", "SQL Server", "Redis", "Tailwind CSS"],
  },
  {
    id: "bangkit-mentor",
    company: "Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka",
    companyLogoText: "Bangkit",
    role: "Peer Mentor",
    division: "Cloud Computing Path",
    location: "Surabaya, Jawa Timur, Indonesia",
    period: "Sep 2024 - Jan 2025",
    duration: "5 months",
    description: [
      "Monitored and guided student learning progress in Cloud Computing through weekly one-hour technical mentoring sessions.",
      "Prepared and delivered specialized technical curriculum on GCP architecture, containerization, and soft skills.",
      "Assisted senior instructors during Instructor-Led Training (ILT) sessions and managed student escalation workflows.",
    ],
    skills: ["Google Cloud Platform", "Mentoring", "Cloud Architecture", "Docker", "Python"],
  },
  {
    id: "wowrack",
    company: "Wowrack Indonesia",
    companyLogoText: "Wowrack",
    role: "Cloud Computing Team — Cloud Raya App",
    division: "Cloud Architecture & R&D",
    location: "Samarinda, Kalimantan Timur, Indonesia",
    period: "Oct 2023 - Jan 2024",
    duration: "4 months",
    description: [
      "Developed high-performance RESTful APIs for the CloudRaya mobile application using Hapi.js and PostgreSQL.",
      "Deployed a TensorFlow.js machine learning model to detect virtual machine anomaly behavior within a microservices architecture.",
      "Constructed automated CI/CD workflows using Google Cloud Build and Artifact Registry to deploy containerized services straight to Cloud Run.",
      "Leveraged Google Cloud Load Balancers, Cloud Storage, and BigQuery for data manipulation and traffic distribution.",
    ],
    skills: ["GCP", "Cloud Run", "Docker", "Hapi.js", "PostgreSQL", "Cloud Build", "TensorFlow.js", "BigQuery"],
  },
  {
    id: "skypro",
    company: "Skypro Manajemen Teknologi",
    companyLogoText: "Skypro",
    role: "Project Assistant",
    division: "Enterprise IT Governance",
    location: "Samarinda, Kalimantan Timur, Indonesia",
    period: "Sep 2023",
    duration: "1 month",
    description: [
      "Assisted the IT project manager in auditing and compiling comprehensive SOP documentation for PT Bankaltimtara to ensure compliance with 2023 OJK regulations.",
      "Covered 9 governance domains: IT Operational, IT Development Plan, Cyber Resilience, Digital Maturity, IT Maturity, Security, DRP, BIA, and Agile Projects using COBIT frameworks.",
    ],
    skills: ["IT Governance", "COBIT", "OJK Compliance", "Cyber Resilience", "DRP / BIA", "SOP Audit"],
  },
  {
    id: "mka",
    company: "PT. Media Kreasi Abadi",
    companyLogoText: "MKA",
    role: "Web Developer",
    division: "Web Development",
    location: "Balikpapan, Kalimantan Timur, Indonesia",
    period: "Jun 2023 - Aug 2023",
    duration: "3 months",
    description: [
      "Migrated a core class attendance system with QR code check-in from procedural PHP to object-oriented Laravel, introducing multi-role access control and multi-language support.",
      "Implemented React, Livewire, and Tailwind in a third-party wedding ring reseller portal to automate and monitor sales workflows.",
      "Designed Unified Modeling Language (UML) diagrams and Entity Relationship Diagrams (ERD) for enterprise client systems.",
    ],
    skills: ["Laravel", "PHP", "React", "Livewire", "Tailwind CSS", "MySQL", "UML / ERD"],
  },
];

export const EDUCATIONS: Education[] = [
  {
    id: "pens",
    institution: "Politeknik Elektronika Negeri Surabaya (PENS)",
    degree: "Applied Bachelor's Degree (D4)",
    major: "Informatics Engineering (Teknik Informatika)",
    period: "Aug 2024 - Nov 2025 (Graduated 2026)",
    location: "Surabaya, Jawa Timur, Indonesia",
    logoText: "PENS",
    highlights: [
      "Specialized in Cloud Computing, Microservices Architecture, and Enterprise Systems Interoperability.",
      "Final Project: Engineered the SATUSEHAT HL7 FHIR Interoperability Agent connecting Trustmedis EMR to the Indonesian Ministry of Health with zero production load using master-replica DB replication.",
    ],
  },
  {
    id: "polnes",
    institution: "Politeknik Negeri Samarinda (POLNES)",
    degree: "Associate's Degree (D3)",
    major: "Information Technology (Teknologi Informasi)",
    period: "Sep 2021 - Sep 2024",
    location: "Samarinda, Kalimantan Timur, Indonesia",
    logoText: "POLNES",
    highlights: [
      "Core foundation in Software Engineering, Database Systems, Linux System Administration, and Computer Networking.",
      "Graduated with hands-on laboratory experience configuring networks, servers, and full-stack web applications.",
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proxmox-cloudflare",
    title: "Setup & Expose Proxmox Web Control with Cloudflare Zero Trust & Tunnel",
    category: "DevOps",
    type: "PERSONAL",
    skills: ["Proxmox VE", "Cloudflare Zero Trust", "Cloudflare Tunnel", "Bash", "Grafana", "Prometheus"],
    date: "Aug 2025",
    shortDescription: "Exposed on-premise Proxmox cluster and internal monitoring without inbound port forwarding using Cloudflare Zero Trust and outbound-only tunnels.",
    problem: "The Proxmox host sat inside a campus lab network without public inbound IP access or port forwarding permissions. Accessing the server remotely for development and server management required an inbound-less solution.",
    role: "Solo Project — Designed, provisioned, and verified the complete tunneling, network autologin, and access policies independently.",
    solution: "Configured Cloudflare Zero Trust with Cloudflare Tunnel (cloudflared) on the Proxmox host to route all web control panel traffic through encrypted outbound tunnels. Added automated Bash scripts for keeping network sessions alive, and extended tunnels to internal Grafana & Prometheus monitoring.",
    results: "Achieved secure zero-trust remote access to Proxmox and monitoring dashboards from anywhere in the world with zero open ports on the restricted local network.",
    links: [
      { label: "Autologin Script", url: "https://drive.google.com/file/d/1LVGCJGnI2TujPpXO8LwMV8OxHimfbaCB/view?usp=drive_link", type: "drive" },
      { label: "System Design", url: "https://drive.google.com/file/d/1RrDguQfNnkez34d3lXxKWaZleaSFTnwS/view?usp=drive_link", type: "drive" },
      { label: "Live Lab URL", url: "https://proxmox-c303-web.irfannoorhidayat.cloud/#v1:0:18:4:::::::", type: "demo" },
    ],
    featured: true,
  },
  {
    id: "wireguard-aws",
    title: "Set Up WireGuard VPN on AWS EC2 VM",
    category: "DevOps",
    type: "PERSONAL",
    skills: ["AWS EC2", "WireGuard VPN", "Ubuntu", "EBS", "Networking"],
    date: "Feb 2025",
    shortDescription: "Self-hosted, high-speed WireGuard VPN tunnel on AWS EC2 with optimized latency migration from US-East to Singapore.",
    problem: "Needed a private, self-hosted VPN for encrypted web access without relying on commercial third-party providers, while diagnosing region-based latency bottlenecks from Indonesia.",
    role: "Solo Project — Provisioned, configured, and optimized the full WireGuard protocol stack on AWS EC2.",
    solution: "Configured WireGuard on an AWS Ubuntu EC2 instance, enabling IPv4 forwarding and per-peer public/private key exchanges. Diagnosed high ping times on the initial US-East deployment and performed EBS snapshot migration to attach directly to an AP-Southeast (Singapore) instance.",
    results: "Successfully delivered an ultra-fast, encrypted private VPN tunnel that drastically reduced latency from Indonesia compared to US-based endpoints.",
    links: [
      { label: "Architecture Diagram", url: "https://drive.google.com/file/d/1Ejwqq41OZFjJ17z_Oh2BpctPokLYMFuF/view?usp=drive_link", type: "drive" },
      { label: "Client Configuration", url: "https://drive.google.com/file/d/1UXabqCQIIINGCKQTWLsfYIioFvdwzFyJ/view?usp=drive_link", type: "drive" },
    ],
    featured: true,
  },
  {
    id: "rag-chatbot-cv",
    title: "Integrate Chatbot with Retrieval Augmented Generation (RAG) with my CV",
    category: "AI & Cloud",
    type: "PERSONAL",
    skills: ["AWS Bedrock", "AWS Lambda", "AWS S3", "Node.js", "RAG"],
    date: "Jan 2025",
    shortDescription: "Interactive AI assistant powered by AWS Bedrock and serverless architecture to answer visitor and recruiter queries conversationally from resume context.",
    problem: "Static resumes and plain portfolio text don't allow recruiters or hiring managers to interactively interrogate a candidate's background, architecture decisions, and tech competencies.",
    role: "Solo Project — Built and deployed the end-to-end serverless AI pipeline.",
    solution: "Built a serverless RAG architecture that indexes portfolio projects and work history, utilizing AWS Bedrock foundation models and AWS Lambda to answer natural language questions in first person with strict rate limiting.",
    results: "Shipped an interactive AI chat interface deployed to the live portfolio, cutting recruiter evaluation time and showcasing hands-on generative AI integration.",
    links: [
      { label: "Live Chatbot", url: "#ai-assistant", type: "demo" },
    ],
    featured: true,
  },
  {
    id: "bankaltimtara-sop",
    title: "Compile and Audit SOP Documentation — PT Bankaltimtara",
    category: "IT Governance",
    type: "WORK",
    skills: ["IT Governance", "COBIT", "Cyber Resilience", "OJK Compliance", "DRP / BIA"],
    date: "Sep 2023",
    shortDescription: "Multi-domain IT governance and regulatory compliance audit for a major regional bank adhering to 2023 OJK standards.",
    problem: "PT Bankaltimtara needed to immediately bring all IT operational standards into strict compliance with new 2023 Indonesian Financial Services Authority (OJK) mandates across 9 distinct domains.",
    role: "Project Assistant — Assisted the project manager in analyzing existing operating procedures, performing gap analysis, and writing updated enterprise SOPs.",
    solution: "Applied COBIT frameworks to review, compile, and audit SOPs across IT Operations, IT Development Planning, Cyber Resilience, Digital Maturity, Security, Disaster Recovery Planning (DRP), Business Impact Analysis (BIA), and Agile Delivery.",
    results: "Successfully submitted verified compliance documentation for all 9 domains to meet OJK regulatory standards on schedule.",
    links: [
      { label: "Classified Enterprise Doc", url: "#", type: "doc" },
    ],
  },
  {
    id: "cloudraya-microservices",
    title: "Implement Microservice Architecture on Backend of CloudRaya Android App",
    category: "DevOps",
    type: "FINAL PROJECT",
    skills: ["GCP", "Cloud Run", "Docker", "Node.js", "Cloud Build", "TensorFlow.js", "PostgreSQL"],
    date: "Jan 2024",
    shortDescription: "Microservices backend on Google Cloud with automated CI/CD and TensorFlow.js machine learning anomaly detection for virtual machine health.",
    problem: "Rapid user growth in the Cloudraya Android ecosystem demanded decoupled services capable of independent scaling, automated staging delivery, and real-time VM anomaly warnings.",
    role: "Team Project — Led backend microservice implementation, container packaging, CI/CD pipeline, and ML anomaly detection service integration.",
    solution: "Deployed decoupled microservices using Hapi.js and Docker to Google Cloud Run with Google Cloud Load Balancer. Built CI/CD pipelines via Cloud Build and Artifact Registry, and integrated a TensorFlow.js microservice to detect unusual VM resource behavior.",
    results: "Production-ready backend with zero downtime deployments, independent service scalability, and automated testing from Git push to staging.",
    links: [
      { label: "GitHub Repository", url: "https://github.com/Bangkit-WowRack/Cloud-Computing", type: "github" },
      { label: "Project Document (ID)", url: "https://drive.google.com/file/d/18JCExFrldp1uRlFSbm6Hm-58IFQFa6Xj/view?usp=sharing", type: "drive" },
    ],
    featured: true,
  },
  {
    id: "satusehat-interop-agent",
    title: "SATUSEHAT HL7 FHIR Interoperability Agent (Inpatient Module)",
    category: "App Dev",
    type: "FINAL PROJECT",
    skills: ["Node.js", "HL7 FHIR", "Docker", "Docker Compose", "PostgreSQL", "Redis"],
    date: "Mar 2025",
    shortDescription: "Data standardization agent converting Trustmedis EMR records into national HL7 FHIR formats with read-replica database isolation.",
    problem: "The Indonesian Ministry of Health mandated that hospitals and healthcare platforms conform to SATUSEHAT HL7 FHIR standards for inpatient data without adding heavy read strain to production medical databases.",
    role: "Solo Final Project — Designed and implemented the complete interoperability agent, data mappings, and master-slave database architecture.",
    solution: "Engineered an ETL synchronization service that converts complex clinical schemas to HL7 FHIR JSON resources across 23 distinct medical modules. Implemented a master-replica PostgreSQL configuration to guarantee sync traffic only touches read replicas.",
    results: "Achieved seamless synchronization with the national SATUSEHAT platform across all 23 inpatient modules with 0% extra read overhead on production.",
    links: [
      { label: "GitHub Repository", url: "https://github.com/ChaosO9/tugas-akhir-2", type: "github" },
      { label: "Final Project Doc", url: "https://drive.google.com/file/d/1PrqkHf29qVJmMU7wEYVu93VcwtF05_Yd/view?usp=sharing", type: "drive" },
    ],
    featured: true,
  },
  {
    id: "jlpt-bot",
    title: "Semi-Automated Bot for JLPT Indonesia Region Registration",
    category: "DevOps",
    type: "PERSONAL",
    skills: ["JavaScript", "Playwright", "AWS EC2", "Browser Automation"],
    date: "Aug 2026",
    shortDescription: "Queue-bypass and automated form-filling bot deployed on EC2 to secure high-demand Japanese Language Proficiency Test slots.",
    problem: "JLPT registration slots across Indonesia sell out within 3 to 5 minutes. High concurrency and Cloudflare waiting room queues consistently cause manual applicants to miss seat openings.",
    role: "Solo Project — Researched website flow, built automation logic, and handled low-latency cloud execution.",
    solution: "Engineered a Playwright automation script deployed on an AWS EC2 instance. The bot maintains active queue sessions in Cloudflare Waiting Rooms, auto-fills registration profiles instantly upon opening, and safely leaves the CAPTCHA and payment verification to manual completion.",
    results: "Secured a confirmed seat for the JLPT N4 exam in Jakarta within the first 60 seconds of registration opening.",
    links: [
      { label: "System Screenshot 1", url: "https://drive.google.com/file/d/1U0jUMgdgRkTF1bedRvIz2W2cQ-T6m-L7/view?usp=drive_link", type: "drive" },
      { label: "System Screenshot 2", url: "https://drive.google.com/file/d/1TwxrV8D-gz0I3xHkMpNRGjobWk2R-z_z/view?usp=drive_link", type: "drive" },
    ],
  },
  {
    id: "hrms-romansy-ptc",
    title: "Enterprise HRMS Modernization & People Traffic Control (PTC)",
    category: "App Dev",
    type: "WORK",
    skills: [".NET Web Forms", "C#", "SQL Server", "Microsoft Teams API", "Power Automate", "n8n"],
    date: "Since Feb 2026 · Panasonic",
    shortDescription: "Modernized legacy enterprise HRMS with automated MS Teams approval pipelines and built PTC to track on-site contractor & employee traffic.",
    problem: "Legacy HR workflows handled employee contracts and business-trip authorizations manually via paper and email. In addition, physical site entry by suppliers, contractors, and visitors lacked unified real-time tracking.",
    role: "Ongoing Individual Contributor — Developed new modules and integrated APIs with Microsoft 365 services.",
    solution: "Digitized contract renewals and in-city travel approvals by integrating webhook triggers to Microsoft Teams via Power Automate and n8n. Designed and launched the PTC (People Traffic Control) sub-application to log on-site presence in real time.",
    results: "Eliminated days of manual approval lag, providing company leadership with end-to-end real-time visibility into internal requests and facility access.",
    links: [
      { label: "Internal System (Classified)", url: "#", type: "doc" },
    ],
  },
  {
    id: "ai-erecruitment-talenttrail",
    title: "TalentTrail AI E-Recruitment Web Application",
    category: "App Dev",
    type: "WORK",
    skills: ["ASP.NET Core", "Blazor UI", "AWS Bedrock", "SQL Server", "Redis", "Tailwind CSS"],
    date: "Sep 2025 · Panasonic",
    shortDescription: "Centralized talent recruitment platform featuring AWS Bedrock AI CV screening, interview scheduling, and manpower approvals.",
    problem: "HR spent hundreds of hours manually parsing incoming resumes against specific job qualifications with no standardized candidate scoring or unified applicant tracker.",
    role: "Solo Developer & Technical Analyst — Designed architecture, built UI components, and integrated Bedrock AI models.",
    solution: "Constructed an enterprise-grade recruiting hub with ASP.NET Core and Blazor. Integrated AWS Bedrock foundation models to rank resumes automatically against education, skills, and experience criteria, and implemented automated stakeholder email updates.",
    results: "Replaced scattered spreadsheets with a unified single system of record, cutting applicant screening time by over 60%.",
    links: [
      { label: "System Overview", url: "https://drive.google.com/file/d/14q0BHMaXpj9l1zCtVALtE7POAl-hDxdO/view?usp=drive_link", type: "drive" },
    ],
    featured: true,
  },
  {
    id: "nginx-gcp-routing",
    title: "Centralized Reverse Proxy & Web Server on Google Cloud VM",
    category: "DevOps",
    type: "PERSONAL",
    skills: ["NGINX", "GCP", "Linux", "Compute Engine", "SSL"],
    date: "Jan 2025",
    shortDescription: "Consolidated multiple disparate application endpoints under a centralized NGINX reverse proxy with SSL certificate termination on GCP.",
    problem: "Personal projects and lab services ran across separate VM endpoints and ports, making domain routing, SSL renewals, and traffic monitoring fragmented.",
    role: "Solo Project — Configured server routing, virtual hosts, and SSL auto-renewals.",
    solution: "Deployed and tuned an NGINX reverse proxy on a Google Cloud Compute Engine VM, acting as a single entry point directing subdomains to respective containerized workloads.",
    results: "Streamlined DNS configuration and traffic routing, establishing a single reliable gateway for hosted services.",
    links: [
      { label: "Internal Project", url: "#", type: "doc" },
    ],
  },
  {
    id: "nested-virtualization-gcp",
    title: "GCP VM Nested Virtualization (Windows Guest on Ubuntu Host)",
    category: "DevOps",
    type: "PERSONAL",
    skills: ["GCP", "KVM/QEMU", "Ubuntu", "Virtualization", "RDP"],
    date: "Jan 2025",
    shortDescription: "Enabled hardware virtualization extensions on Google Compute Engine to run a Windows guest VM inside an Ubuntu host.",
    problem: "Google Cloud VMs do not expose hardware virtualization extensions to guest hypervisors by default, preventing hypervisors like KVM/QEMU from running nested OS instances.",
    role: "Solo Project — Researched GCP nested virtualization flags and configured the KVM hypervisor.",
    solution: "Provisioned a custom GCP VM with nested virtualization enabled, installed QEMU/KVM on Ubuntu, and configured network bridging to run a fully functional Windows guest accessible via RDP.",
    results: "Enabled Windows-dependent enterprise workloads on cost-effective cloud Linux instances without needing dedicated bare-metal servers.",
    links: [
      { label: "System Architecture", url: "https://drive.google.com/file/d/1zzcNLo8DT5DzLSv0dPmO0h_8Np0hTYdR/view?usp=drive_link", type: "drive" },
    ],
  },
  {
    id: "azure-devops-cicd",
    title: "Azure DevOps Self-Hosted Agent Pool & CI/CD Pipeline",
    category: "DevOps",
    type: "WORK",
    skills: ["Azure DevOps", "CI/CD", "Pipelines", "Docker", "Automation"],
    date: "Jul 2026",
    shortDescription: "Automated commit-to-staging deployment pipeline using self-hosted Azure DevOps agent pools for enterprise apps.",
    problem: "Delivering new code changes to staging required manual compilation, artifact transport, and service restarts, leaving room for configuration drift and deployment delays.",
    role: "DevOps Engineer — Set up the agent pool and wrote pipeline YAML definitions.",
    solution: "Installed and configured a self-hosted Azure DevOps agent pool on dedicated infrastructure and wrote automated multi-stage pipelines to build, test, and deploy verified commits directly to staging.",
    results: "Reduced staging deployment cycle time from hours to minutes, creating an auditable history of all releases.",
    links: [
      { label: "Pipeline Overview 1", url: "https://drive.google.com/file/d/1duipzg2z9KKl2ZT7G_0PAfkIHjgOX0s5/view?usp=drive_link", type: "drive" },
      { label: "Pipeline Overview 2", url: "https://drive.google.com/file/d/17eA1C8O8WjSok6uJPKhKaxB9vOHlc9UF/view?usp=drive_link", type: "drive" },
    ],
  },
  {
    id: "event-manager-app",
    title: "Event-Manager App",
    category: "App Dev",
    type: "PERSONAL",
    skills: ["React", "Supabase", "Docker", "Cloud Run", "Tailwind CSS"],
    date: "2024",
    shortDescription: "Mobile-first event registration web app with QR code ticket verification and serverless backend, containerized for Cloud Run.",
    problem: "Event organizers needed a fast, mobile-friendly way to register attendees and check QR code tickets without expensive event management software.",
    role: "Full-Stack Developer — Built frontend in React and integrated Supabase auth and serverless functions.",
    solution: "Created a responsive React + Vite application utilizing Supabase database and authentication. Containerized the web application with Docker and deployed to Google Cloud Run.",
    results: "Delivered instantaneous QR verification and real-time attendee tracking with sub-second check-ins.",
    links: [
      { label: "Live Demo", url: "https://event-manager-app.irfannoorhidayat.cloud/", type: "demo" },
    ],
  },
  {
    id: "micro-expression-classifier",
    title: "Micro-Expression Classifier Service",
    category: "AI & Cloud",
    type: "FINAL PROJECT",
    skills: ["Flask", "PyTorch", "3D-CNN", "Cloud Run", "Cloud Build", "Docker"],
    date: "2024",
    shortDescription: "Deep learning computer vision service classifying micro-expressions from 16-frame image sequences using a 3D-CNN model on Cloud Run.",
    problem: "Real-time facial micro-expression classification requires heavy 3D tensor computations that are hard to run reliably in lightweight web backends.",
    role: "Machine Learning & Backend Engineer — Built inference API, containerized PyTorch runtime, and configured Cloud Build deployment.",
    solution: "Packaged a PyTorch 3D-CNN emotion recognition model into a Flask REST API. Used Docker and Google Cloud Run for serverless GPU/CPU inference with Cloud Build CI/CD.",
    results: "Achieved sub-2-second inference for image sequence batches with auto-scaling compute resources.",
    links: [
      { label: "GitHub Repository", url: "https://github.com/raihanrid/skripsijhon", type: "github" },
    ],
  },
];

export const TECH_STACK: TechStackCategory[] = [
  {
    category: "Cloud & Infrastructure",
    description: "Multi-cloud architecture, compute, and on-premise hypervisors.",
    items: [
      { name: "AWS", skillKey: "AWS", projectCount: 3, level: "Daily Driver" },
      { name: "Google Cloud (GCP)", skillKey: "GCP", projectCount: 4, level: "Daily Driver" },
      { name: "Proxmox VE", skillKey: "Proxmox", projectCount: 1, level: "Proficient" },
      { name: "Azure DevOps", skillKey: "Azure", projectCount: 1, level: "Proficient" },
      { name: "Linux Administration", skillKey: "Linux", projectCount: 4, level: "Daily Driver" },
    ],
  },
  {
    category: "DevOps, Networking & Security",
    description: "Zero Trust tunneling, containerization, VPNs, and CI/CD pipelines.",
    items: [
      { name: "Docker & Compose", skillKey: "Docker", projectCount: 5, level: "Daily Driver" },
      { name: "Cloudflare Zero Trust & Tunnel", skillKey: "Cloudflare", projectCount: 2, level: "Proficient" },
      { name: "WireGuard VPN", skillKey: "WireGuard", projectCount: 1, level: "Proficient" },
      { name: "CI/CD (Cloud Build, Azure)", skillKey: "CI/CD", projectCount: 3, level: "Daily Driver" },
      { name: "NGINX", skillKey: "NGINX", projectCount: 2, level: "Proficient" },
      { name: "Bash Automation", skillKey: "Bash", projectCount: 3, level: "Daily Driver" },
    ],
  },
  {
    category: "Backend & Databases",
    description: "Enterprise APIs, microservices, and relational & caching databases.",
    items: [
      { name: "Node.js (Hapi, Express)", skillKey: "Node.js", projectCount: 4, level: "Daily Driver" },
      { name: ".NET Core / Web Forms", skillKey: ".NET", projectCount: 2, level: "Daily Driver" },
      { name: "PostgreSQL", skillKey: "PostgreSQL", projectCount: 3, level: "Daily Driver" },
      { name: "SQL Server", skillKey: "SQL Server", projectCount: 2, level: "Daily Driver" },
      { name: "Redis", skillKey: "Redis", projectCount: 2, level: "Proficient" },
      { name: "PHP / Laravel", skillKey: "Laravel", projectCount: 1, level: "Proficient" },
      { name: "Go (Gin, Echo)", skillKey: "Go", projectCount: 1, level: "Hands-on" },
    ],
  },
  {
    category: "AI & Enterprise Automation",
    description: "Foundation model orchestration, workflow automation, and governance.",
    items: [
      { name: "AWS Bedrock (RAG, Claude)", skillKey: "AWS Bedrock", projectCount: 2, level: "Proficient" },
      { name: "Power Automate & n8n", skillKey: "Automation", projectCount: 1, level: "Daily Driver" },
      { name: "Playwright Automation", skillKey: "Playwright", projectCount: 1, level: "Hands-on" },
      { name: "HL7 FHIR (SATUSEHAT)", skillKey: "HL7 FHIR", projectCount: 1, level: "Proficient" },
      { name: "COBIT & OJK Compliance", skillKey: "COBIT", projectCount: 1, level: "Proficient" },
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "aws-academy",
    title: "AWS Academy Graduate — AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services (AWS)",
    date: "May 2025",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "aws",
  },
  {
    id: "bangkit-cert",
    title: "Bangkit Academy Graduate — Cloud Computing Path",
    issuer: "Google, Tokopedia, Gojek, & Traveloka",
    date: "Jan 2024",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "cloud",
  },
  {
    id: "bnsp-net-admin",
    title: "Junior Network Administrator",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    date: "Sep 2024",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "network",
  },
  {
    id: "bnsp-datacenter",
    title: "Data Center Technical Support",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    date: "Jul 2024",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "server",
  },
  {
    id: "google-sysadmin",
    title: "System Administration & IT Infrastructure Services",
    issuer: "Google / Coursera",
    date: "Oct 2023",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "shield",
  },
  {
    id: "dicoding-backend",
    title: "Belajar Membuat Aplikasi Back-End untuk Pemula dengan Google Cloud",
    issuer: "Dicoding Indonesia",
    date: "2023",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "code",
  },
  {
    id: "dicoding-mongodb",
    title: "Sertifikat Kelas Belajar MongoDB",
    issuer: "Dicoding Indonesia",
    date: "2023",
    credentialUrl: "https://www.linkedin.com/in/irfan-noor-hidayat-5847b2156/",
    iconName: "database",
  },
];

export const PROFILE_CONTEXT_PROMPT = `
You are the personal AI Assistant representing Irfan Noor Hidayat, a Cloud Engineer & DevOps Developer based in Jakarta, Indonesia.
Answer professionally, enthusiastically, and in the first person ("I", "my work", "my experience") as if you are Irfan's digital representative.
Keep answers concise, direct, technically accurate, and formatted cleanly with markdown bullet points where appropriate.

Summary:
- Name: ${PERSONAL_INFO.name}
- Headline: ${PERSONAL_INFO.headline}
- Location: ${PERSONAL_INFO.location}
- Email: ${PERSONAL_INFO.email}
- WhatsApp: ${PERSONAL_INFO.phone}
- LinkedIn: ${PERSONAL_INFO.linkedinUrl}
- GitHub: ${PERSONAL_INFO.githubUrl}
- Education:
  * Politeknik Elektronika Negeri Surabaya (PENS) - Applied Bachelor (D4) in Informatics (Graduated March 2026).
  * Politeknik Negeri Samarinda (POLNES) - Associate Degree (D3) in Information Technology (2021-2024).
- Key Experience:
  * PT Panasonic Manufacturing Indonesia: Information System Center - HRMS (Since Jan 2026) & IT Software Engineer (Aug 2025 - Jan 2026). Built TalentTrail AI E-Recruitment (AWS Bedrock, ASP.NET Core) and PTC (People Traffic Control).
  * Bangkit Academy: Peer Mentor (Sep 2024 - Jan 2025) and Cloud Computing graduate.
  * Wowrack Indonesia: Cloud Computing Team (Hapi.js, GCP Cloud Run, Docker, TensorFlow.js anomaly detection).
  * Skypro Manajemen Teknologi: Project Assistant (Bankaltimtara OJK SOP compliance across 9 domains).
  * PT Media Kreasi Abadi: Web Developer (Laravel, React, Tailwind).
- Key Projects:
  1. Setup & Expose Proxmox Web Control with Cloudflare Zero Trust & Tunnel (Zero inbound ports).
  2. WireGuard VPN on AWS EC2 (Optimized latency to Singapore).
  3. RAG Chatbot with AWS Bedrock & Lambda.
  4. Bankaltimtara OJK SOP Documentation Audit across 9 domains (COBIT).
  5. CloudRaya Backend Microservices on GCP (Cloud Run, Cloud Build, Docker, PostgreSQL).
  6. SATUSEHAT HL7 FHIR Interoperability Agent (Trustmedis to MoH, read-replica DB isolation).
  7. JLPT Registration Bot (Playwright, AWS EC2, Cloudflare queue handling).
  8. HRMS ROMANSY & PTC at Panasonic (MS Teams approval workflows via Power Automate & n8n).
  9. TalentTrail AI E-Recruitment at Panasonic (AWS Bedrock, Blazor, ASP.NET Core).
  10. NGINX Reverse Proxy on GCP.
  11. Nested Virtualization on GCP (Windows guest on Ubuntu host).
  12. Azure DevOps CI/CD pipeline with self-hosted agent pool.
`;
