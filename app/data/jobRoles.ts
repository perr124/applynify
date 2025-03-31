export interface JobRole {
  label: string;
  value: string;
  category: string;
}

export const jobRoles: JobRole[] = [
  // Engineering & Technology
  { label: 'Software Engineer', value: 'software-engineer', category: 'Engineering & Technology' },
  {
    label: 'Frontend Developer',
    value: 'frontend-developer',
    category: 'Engineering & Technology',
  },
  { label: 'Backend Developer', value: 'backend-developer', category: 'Engineering & Technology' },
  {
    label: 'Full Stack Developer',
    value: 'full-stack-developer',
    category: 'Engineering & Technology',
  },
  { label: 'DevOps Engineer', value: 'devops-engineer', category: 'Engineering & Technology' },
  { label: 'Cloud Engineer', value: 'cloud-engineer', category: 'Engineering & Technology' },
  { label: 'Security Engineer', value: 'security-engineer', category: 'Engineering & Technology' },
  { label: 'Mobile Developer', value: 'mobile-developer', category: 'Engineering & Technology' },
  { label: 'UI/UX Designer', value: 'ui-ux-designer', category: 'Engineering & Technology' },
  { label: 'Product Designer', value: 'product-designer', category: 'Engineering & Technology' },
  { label: 'Technical Lead', value: 'technical-lead', category: 'Engineering & Technology' },
  { label: 'Architect', value: 'architect', category: 'Engineering & Technology' },
  { label: 'QA Engineer', value: 'qa-engineer', category: 'Engineering & Technology' },
  { label: 'Data Engineer', value: 'data-engineer', category: 'Engineering & Technology' },
  {
    label: 'Machine Learning Engineer',
    value: 'machine-learning-engineer',
    category: 'Engineering & Technology',
  },
  { label: 'AI Engineer', value: 'ai-engineer', category: 'Engineering & Technology' },
  {
    label: 'Blockchain Developer',
    value: 'blockchain-developer',
    category: 'Engineering & Technology',
  },
  { label: 'Game Developer', value: 'game-developer', category: 'Engineering & Technology' },
  {
    label: 'Embedded Systems Engineer',
    value: 'embedded-systems-engineer',
    category: 'Engineering & Technology',
  },
  { label: 'Robotics Engineer', value: 'robotics-engineer', category: 'Engineering & Technology' },
  { label: 'Network Engineer', value: 'network-engineer', category: 'Engineering & Technology' },
  {
    label: 'Systems Administrator',
    value: 'systems-administrator',
    category: 'Engineering & Technology',
  },
  {
    label: 'Database Administrator',
    value: 'database-administrator',
    category: 'Engineering & Technology',
  },
  {
    label: 'IT Support Specialist',
    value: 'it-support-specialist',
    category: 'Engineering & Technology',
  },
  { label: 'CTO', value: 'cto', category: 'Engineering & Technology' },
  { label: 'CIO', value: 'cio', category: 'Engineering & Technology' },
  { label: 'CISO', value: 'ciso', category: 'Engineering & Technology' },
  { label: 'Hardware Engineer', value: 'hardware-engineer', category: 'Engineering & Technology' },
  { label: 'AR/VR Developer', value: 'ar-vr-developer', category: 'Engineering & Technology' },
  { label: 'IoT Specialist', value: 'iot-specialist', category: 'Engineering & Technology' },

  // Product & Design
  { label: 'Product Manager', value: 'product-manager', category: 'Product & Design' },
  { label: 'Product Owner', value: 'product-owner', category: 'Product & Design' },
  {
    label: 'Product Marketing Manager',
    value: 'product-marketing-manager',
    category: 'Product & Design',
  },
  { label: 'Product Analyst', value: 'product-analyst', category: 'Product & Design' },
  { label: 'Product Designer', value: 'product-designer', category: 'Product & Design' },
  { label: 'UX Researcher', value: 'ux-researcher', category: 'Product & Design' },
  { label: 'Visual Designer', value: 'visual-designer', category: 'Product & Design' },
  { label: 'Interaction Designer', value: 'interaction-designer', category: 'Product & Design' },
  { label: 'Service Designer', value: 'service-designer', category: 'Product & Design' },
  {
    label: 'Design Systems Designer',
    value: 'design-systems-designer',
    category: 'Product & Design',
  },
  { label: 'Creative Director', value: 'creative-director', category: 'Product & Design' },
  { label: 'Art Director', value: 'art-director', category: 'Product & Design' },
  { label: 'Graphic Designer', value: 'graphic-designer', category: 'Product & Design' },
  { label: 'Motion Designer', value: 'motion-designer', category: 'Product & Design' },
  { label: 'Illustrator', value: 'illustrator', category: 'Product & Design' },
  { label: 'Content Designer', value: 'content-designer', category: 'Product & Design' },
  { label: 'Chief Product Officer', value: 'chief-product-officer', category: 'Product & Design' },
  { label: 'Design Manager', value: 'design-manager', category: 'Product & Design' },
  { label: 'Web Designer', value: 'web-designer', category: 'Product & Design' },
  { label: 'Prototyper', value: 'prototyper', category: 'Product & Design' },

  // Data & Analytics
  { label: 'Data Scientist', value: 'data-scientist', category: 'Data & Analytics' },
  { label: 'Data Analyst', value: 'data-analyst', category: 'Data & Analytics' },
  {
    label: 'Business Intelligence Analyst',
    value: 'business-intelligence-analyst',
    category: 'Data & Analytics',
  },
  { label: 'Data Engineer', value: 'data-engineer', category: 'Data & Analytics' },
  { label: 'Data Architect', value: 'data-architect', category: 'Data & Analytics' },
  { label: 'Data Product Manager', value: 'data-product-manager', category: 'Data & Analytics' },
  { label: 'Analytics Engineer', value: 'analytics-engineer', category: 'Data & Analytics' },
  {
    label: 'Machine Learning Engineer',
    value: 'machine-learning-engineer',
    category: 'Data & Analytics',
  },
  { label: 'AI Researcher', value: 'ai-researcher', category: 'Data & Analytics' },
  {
    label: 'Data Visualization Specialist',
    value: 'data-visualization-specialist',
    category: 'Data & Analytics',
  },
  { label: 'Chief Data Officer', value: 'chief-data-officer', category: 'Data & Analytics' },
  { label: 'Data Science Manager', value: 'data-science-manager', category: 'Data & Analytics' },
  { label: 'Quantitative Analyst', value: 'quantitative-analyst', category: 'Data & Analytics' },
  { label: 'Statistician', value: 'statistician', category: 'Data & Analytics' },
  {
    label: 'Data Governance Manager',
    value: 'data-governance-manager',
    category: 'Data & Analytics',
  },
  { label: 'Big Data Engineer', value: 'big-data-engineer', category: 'Data & Analytics' },
  { label: 'Database Developer', value: 'database-developer', category: 'Data & Analytics' },
  {
    label: 'Research Data Scientist',
    value: 'research-data-scientist',
    category: 'Data & Analytics',
  },
  { label: 'Data Quality Analyst', value: 'data-quality-analyst', category: 'Data & Analytics' },
  { label: 'NLP Engineer', value: 'nlp-engineer', category: 'Data & Analytics' },

  // Marketing & Sales
  { label: 'Marketing Manager', value: 'marketing-manager', category: 'Marketing & Sales' },
  {
    label: 'Digital Marketing Manager',
    value: 'digital-marketing-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Content Marketing Manager',
    value: 'content-marketing-manager',
    category: 'Marketing & Sales',
  },
  { label: 'SEO Specialist', value: 'seo-specialist', category: 'Marketing & Sales' },
  { label: 'Social Media Manager', value: 'social-media-manager', category: 'Marketing & Sales' },
  {
    label: 'Email Marketing Specialist',
    value: 'email-marketing-specialist',
    category: 'Marketing & Sales',
  },
  { label: 'Marketing Analyst', value: 'marketing-analyst', category: 'Marketing & Sales' },
  { label: 'Brand Manager', value: 'brand-manager', category: 'Marketing & Sales' },
  { label: 'Sales Manager', value: 'sales-manager', category: 'Marketing & Sales' },
  { label: 'Sales Representative', value: 'sales-representative', category: 'Marketing & Sales' },
  { label: 'Account Executive', value: 'account-executive', category: 'Marketing & Sales' },
  {
    label: 'Sales Operations Manager',
    value: 'sales-operations-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Business Development Manager',
    value: 'business-development-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Customer Success Manager',
    value: 'customer-success-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Growth Marketing Manager',
    value: 'growth-marketing-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Chief Marketing Officer',
    value: 'chief-marketing-officer',
    category: 'Marketing & Sales',
  },
  { label: 'Chief Sales Officer', value: 'chief-sales-officer', category: 'Marketing & Sales' },
  { label: 'VP of Sales', value: 'vp-of-sales', category: 'Marketing & Sales' },
  { label: 'VP of Marketing', value: 'vp-of-marketing', category: 'Marketing & Sales' },
  { label: 'Content Strategist', value: 'content-strategist', category: 'Marketing & Sales' },
  { label: 'Copywriter', value: 'copywriter', category: 'Marketing & Sales' },
  {
    label: 'Public Relations Manager',
    value: 'public-relations-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Market Research Analyst',
    value: 'market-research-analyst',
    category: 'Marketing & Sales',
  },
  {
    label: 'Demand Generation Manager',
    value: 'demand-generation-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Inside Sales Representative',
    value: 'inside-sales-representative',
    category: 'Marketing & Sales',
  },
  {
    label: 'Sales Development Representative',
    value: 'sales-development-representative',
    category: 'Marketing & Sales',
  },
  {
    label: 'Field Sales Representative',
    value: 'field-sales-representative',
    category: 'Marketing & Sales',
  },
  {
    label: 'Affiliate Marketing Manager',
    value: 'affiliate-marketing-manager',
    category: 'Marketing & Sales',
  },
  {
    label: 'Performance Marketing Manager',
    value: 'performance-marketing-manager',
    category: 'Marketing & Sales',
  },
  { label: 'SEM Specialist', value: 'sem-specialist', category: 'Marketing & Sales' },

  // Operations & Management
  { label: 'Operations Manager', value: 'operations-manager', category: 'Operations & Management' },
  { label: 'Project Manager', value: 'project-manager', category: 'Operations & Management' },
  { label: 'Program Manager', value: 'program-manager', category: 'Operations & Management' },
  { label: 'Scrum Master', value: 'scrum-master', category: 'Operations & Management' },
  { label: 'Agile Coach', value: 'agile-coach', category: 'Operations & Management' },
  { label: 'Business Analyst', value: 'business-analyst', category: 'Operations & Management' },
  {
    label: 'Process Improvement Manager',
    value: 'process-improvement-manager',
    category: 'Operations & Management',
  },
  {
    label: 'Supply Chain Manager',
    value: 'supply-chain-manager',
    category: 'Operations & Management',
  },
  { label: 'Logistics Manager', value: 'logistics-manager', category: 'Operations & Management' },
  {
    label: 'Quality Assurance Manager',
    value: 'quality-assurance-manager',
    category: 'Operations & Management',
  },
  {
    label: 'Chief Operations Officer',
    value: 'chief-operations-officer',
    category: 'Operations & Management',
  },
  { label: 'VP of Operations', value: 'vp-of-operations', category: 'Operations & Management' },
  {
    label: 'Director of Operations',
    value: 'director-of-operations',
    category: 'Operations & Management',
  },
  { label: 'Fleet Manager', value: 'fleet-manager', category: 'Operations & Management' },
  { label: 'Facilities Manager', value: 'facilities-manager', category: 'Operations & Management' },
  {
    label: 'Procurement Manager',
    value: 'procurement-manager',
    category: 'Operations & Management',
  },
  { label: 'Warehouse Manager', value: 'warehouse-manager', category: 'Operations & Management' },
  { label: 'Production Manager', value: 'production-manager', category: 'Operations & Management' },
  { label: 'Inventory Manager', value: 'inventory-manager', category: 'Operations & Management' },
  { label: 'Office Manager', value: 'office-manager', category: 'Operations & Management' },

  // Finance & Accounting
  { label: 'Financial Analyst', value: 'financial-analyst', category: 'Finance & Accounting' },
  { label: 'Accountant', value: 'accountant', category: 'Finance & Accounting' },
  {
    label: 'Financial Controller',
    value: 'financial-controller',
    category: 'Finance & Accounting',
  },
  { label: 'Finance Manager', value: 'finance-manager', category: 'Finance & Accounting' },
  { label: 'Investment Analyst', value: 'investment-analyst', category: 'Finance & Accounting' },
  { label: 'Risk Manager', value: 'risk-manager', category: 'Finance & Accounting' },
  { label: 'Treasury Manager', value: 'treasury-manager', category: 'Finance & Accounting' },
  { label: 'Auditor', value: 'auditor', category: 'Finance & Accounting' },
  { label: 'Tax Manager', value: 'tax-manager', category: 'Finance & Accounting' },
  { label: 'Financial Planner', value: 'financial-planner', category: 'Finance & Accounting' },
  {
    label: 'Chief Financial Officer',
    value: 'chief-financial-officer',
    category: 'Finance & Accounting',
  },
  { label: 'VP of Finance', value: 'vp-of-finance', category: 'Finance & Accounting' },
  { label: 'Director of Finance', value: 'director-of-finance', category: 'Finance & Accounting' },
  { label: 'Budget Analyst', value: 'budget-analyst', category: 'Finance & Accounting' },
  { label: 'Cost Accountant', value: 'cost-accountant', category: 'Finance & Accounting' },
  { label: 'Forensic Accountant', value: 'forensic-accountant', category: 'Finance & Accounting' },
  { label: 'Payroll Manager', value: 'payroll-manager', category: 'Finance & Accounting' },
  { label: 'Credit Analyst', value: 'credit-analyst', category: 'Finance & Accounting' },
  { label: 'Investment Banker', value: 'investment-banker', category: 'Finance & Accounting' },
  { label: 'Equity Analyst', value: 'equity-analyst', category: 'Finance & Accounting' },

  // Human Resources
  { label: 'HR Manager', value: 'hr-manager', category: 'Human Resources' },
  { label: 'HR Business Partner', value: 'hr-business-partner', category: 'Human Resources' },
  {
    label: 'Talent Acquisition Manager',
    value: 'talent-acquisition-manager',
    category: 'Human Resources',
  },
  { label: 'Recruiter', value: 'recruiter', category: 'Human Resources' },
  { label: 'HR Generalist', value: 'hr-generalist', category: 'Human Resources' },
  {
    label: 'Compensation & Benefits Manager',
    value: 'compensation-benefits-manager',
    category: 'Human Resources',
  },
  {
    label: 'Learning & Development Manager',
    value: 'learning-development-manager',
    category: 'Human Resources',
  },
  {
    label: 'Employee Relations Manager',
    value: 'employee-relations-manager',
    category: 'Human Resources',
  },
  { label: 'HR Analytics Manager', value: 'hr-analytics-manager', category: 'Human Resources' },
  { label: 'HR Technology Manager', value: 'hr-technology-manager', category: 'Human Resources' },
  {
    label: 'Chief Human Resources Officer',
    value: 'chief-human-resources-officer',
    category: 'Human Resources',
  },
  { label: 'VP of Human Resources', value: 'vp-of-human-resources', category: 'Human Resources' },
  {
    label: 'Director of Human Resources',
    value: 'director-of-human-resources',
    category: 'Human Resources',
  },
  {
    label: 'Talent Development Specialist',
    value: 'talent-development-specialist',
    category: 'Human Resources',
  },
  {
    label: 'Diversity & Inclusion Manager',
    value: 'diversity-inclusion-manager',
    category: 'Human Resources',
  },
  { label: 'HRIS Specialist', value: 'hris-specialist', category: 'Human Resources' },
  {
    label: 'Organizational Development Manager',
    value: 'organizational-development-manager',
    category: 'Human Resources',
  },
  { label: 'HR Consultant', value: 'hr-consultant', category: 'Human Resources' },
  {
    label: 'Employee Experience Manager',
    value: 'employee-experience-manager',
    category: 'Human Resources',
  },
  {
    label: 'Workforce Planning Manager',
    value: 'workforce-planning-manager',
    category: 'Human Resources',
  },

  // Customer Success & Support
  {
    label: 'Customer Success Manager',
    value: 'customer-success-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Support Manager',
    value: 'customer-support-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Service Representative',
    value: 'customer-service-representative',
    category: 'Customer Success & Support',
  },
  {
    label: 'Technical Support Engineer',
    value: 'technical-support-engineer',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Experience Manager',
    value: 'customer-experience-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Success Specialist',
    value: 'customer-success-specialist',
    category: 'Customer Success & Support',
  },
  {
    label: 'Implementation Manager',
    value: 'implementation-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Onboarding Specialist',
    value: 'onboarding-specialist',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Success Operations Manager',
    value: 'customer-success-operations-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Success Analyst',
    value: 'customer-success-analyst',
    category: 'Customer Success & Support',
  },
  {
    label: 'Chief Customer Officer',
    value: 'chief-customer-officer',
    category: 'Customer Success & Support',
  },
  {
    label: 'VP of Customer Success',
    value: 'vp-of-customer-success',
    category: 'Customer Success & Support',
  },
  {
    label: 'Director of Customer Support',
    value: 'director-of-customer-support',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Support Team Lead',
    value: 'customer-support-team-lead',
    category: 'Customer Success & Support',
  },
  {
    label: 'Client Relationship Manager',
    value: 'client-relationship-manager',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Advocate',
    value: 'customer-advocate',
    category: 'Customer Success & Support',
  },
  {
    label: 'Customer Education Specialist',
    value: 'customer-education-specialist',
    category: 'Customer Success & Support',
  },
  { label: 'Account Manager', value: 'account-manager', category: 'Customer Success & Support' },
  {
    label: 'Customer Retention Specialist',
    value: 'customer-retention-specialist',
    category: 'Customer Success & Support',
  },
  {
    label: 'Help Desk Specialist',
    value: 'help-desk-specialist',
    category: 'Customer Success & Support',
  },

  // Legal & Compliance
  { label: 'Legal Counsel', value: 'legal-counsel', category: 'Legal & Compliance' },
  { label: 'Compliance Manager', value: 'compliance-manager', category: 'Legal & Compliance' },
  { label: 'Corporate Counsel', value: 'corporate-counsel', category: 'Legal & Compliance' },
  { label: 'Privacy Officer', value: 'privacy-officer', category: 'Legal & Compliance' },
  {
    label: 'Risk & Compliance Officer',
    value: 'risk-compliance-officer',
    category: 'Legal & Compliance',
  },
  {
    label: 'Legal Operations Manager',
    value: 'legal-operations-manager',
    category: 'Legal & Compliance',
  },
  {
    label: 'Regulatory Affairs Manager',
    value: 'regulatory-affairs-manager',
    category: 'Legal & Compliance',
  },
  { label: 'Compliance Analyst', value: 'compliance-analyst', category: 'Legal & Compliance' },
  { label: 'Legal Assistant', value: 'legal-assistant', category: 'Legal & Compliance' },
  { label: 'Contract Manager', value: 'contract-manager', category: 'Legal & Compliance' },
  { label: 'General Counsel', value: 'general-counsel', category: 'Legal & Compliance' },
  { label: 'Patent Attorney', value: 'patent-attorney', category: 'Legal & Compliance' },
  {
    label: 'Intellectual Property Manager',
    value: 'intellectual-property-manager',
    category: 'Legal & Compliance',
  },
  { label: 'Ethics Officer', value: 'ethics-officer', category: 'Legal & Compliance' },
  {
    label: 'Legal Technology Manager',
    value: 'legal-technology-manager',
    category: 'Legal & Compliance',
  },
  { label: 'Paralegal', value: 'paralegal', category: 'Legal & Compliance' },
  { label: 'Corporate Secretary', value: 'corporate-secretary', category: 'Legal & Compliance' },
  { label: 'Litigation Manager', value: 'litigation-manager', category: 'Legal & Compliance' },
  {
    label: 'Data Protection Officer',
    value: 'data-protection-officer',
    category: 'Legal & Compliance',
  },
  { label: 'Commercial Lawyer', value: 'commercial-lawyer', category: 'Legal & Compliance' },

  // Research & Development
  { label: 'Research Scientist', value: 'research-scientist', category: 'Research & Development' },
  { label: 'R&D Engineer', value: 'rd-engineer', category: 'Research & Development' },
  { label: 'Research Analyst', value: 'research-analyst', category: 'Research & Development' },
  { label: 'Research Manager', value: 'research-manager', category: 'Research & Development' },
  {
    label: 'Development Scientist',
    value: 'development-scientist',
    category: 'Research & Development',
  },
  { label: 'Research Associate', value: 'research-associate', category: 'Research & Development' },
  { label: 'R&D Director', value: 'rd-director', category: 'Research & Development' },
  {
    label: 'Research Coordinator',
    value: 'research-coordinator',
    category: 'Research & Development',
  },
  {
    label: 'Research Technician',
    value: 'research-technician',
    category: 'Research & Development',
  },
  { label: 'R&D Project Manager', value: 'rd-project-manager', category: 'Research & Development' },
  {
    label: 'Chief Science Officer',
    value: 'chief-science-officer',
    category: 'Research & Development',
  },
  {
    label: 'VP of Research & Development',
    value: 'vp-of-research-development',
    category: 'Research & Development',
  },
  { label: 'Laboratory Manager', value: 'laboratory-manager', category: 'Research & Development' },
  {
    label: 'Clinical Research Associate',
    value: 'clinical-research-associate',
    category: 'Research & Development',
  },
  {
    label: 'Formulation Scientist',
    value: 'formulation-scientist',
    category: 'Research & Development',
  },
  { label: 'Prototype Engineer', value: 'prototype-engineer', category: 'Research & Development' },
  { label: 'Innovation Manager', value: 'innovation-manager', category: 'Research & Development' },
  {
    label: 'Materials Scientist',
    value: 'materials-scientist',
    category: 'Research & Development',
  },
  {
    label: 'Research Investigator',
    value: 'research-investigator',
    category: 'Research & Development',
  },
  {
    label: 'Product Development Manager',
    value: 'product-development-manager',
    category: 'Research & Development',
  },

  // Healthcare & Medical
  { label: 'Physician', value: 'physician', category: 'Healthcare & Medical' },
  { label: 'Nurse', value: 'nurse', category: 'Healthcare & Medical' },
  { label: 'Nurse Practitioner', value: 'nurse-practitioner', category: 'Healthcare & Medical' },
  { label: 'Physician Assistant', value: 'physician-assistant', category: 'Healthcare & Medical' },
  { label: 'Medical Director', value: 'medical-director', category: 'Healthcare & Medical' },
  {
    label: 'Healthcare Administrator',
    value: 'healthcare-administrator',
    category: 'Healthcare & Medical',
  },
  { label: 'Pharmacist', value: 'pharmacist', category: 'Healthcare & Medical' },
  { label: 'Physical Therapist', value: 'physical-therapist', category: 'Healthcare & Medical' },
  {
    label: 'Occupational Therapist',
    value: 'occupational-therapist',
    category: 'Healthcare & Medical',
  },
  { label: 'Radiologist', value: 'radiologist', category: 'Healthcare & Medical' },
  { label: 'Surgeon', value: 'surgeon', category: 'Healthcare & Medical' },
  { label: 'Psychiatrist', value: 'psychiatrist', category: 'Healthcare & Medical' },
  { label: 'Psychologist', value: 'psychologist', category: 'Healthcare & Medical' },
  { label: 'Dentist', value: 'dentist', category: 'Healthcare & Medical' },
  { label: 'Dental Hygienist', value: 'dental-hygienist', category: 'Healthcare & Medical' },
  {
    label: 'Medical Technologist',
    value: 'medical-technologist',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Medical Laboratory Scientist',
    value: 'medical-laboratory-scientist',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Respiratory Therapist',
    value: 'respiratory-therapist',
    category: 'Healthcare & Medical',
  },
  { label: 'Dietitian', value: 'dietitian', category: 'Healthcare & Medical' },
  { label: 'Speech Therapist', value: 'speech-therapist', category: 'Healthcare & Medical' },
  {
    label: 'Healthcare IT Manager',
    value: 'healthcare-it-manager',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Medical Records Manager',
    value: 'medical-records-manager',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Clinical Research Coordinator',
    value: 'clinical-research-coordinator',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Hospital Administrator',
    value: 'hospital-administrator',
    category: 'Healthcare & Medical',
  },
  {
    label: 'Public Health Specialist',
    value: 'public-health-specialist',
    category: 'Healthcare & Medical',
  },

  // Education & Training
  { label: 'Teacher', value: 'teacher', category: 'Education & Training' },
  { label: 'Professor', value: 'professor', category: 'Education & Training' },
  { label: 'Principal', value: 'principal', category: 'Education & Training' },
  {
    label: 'School Administrator',
    value: 'school-administrator',
    category: 'Education & Training',
  },
  {
    label: 'Instructional Designer',
    value: 'instructional-designer',
    category: 'Education & Training',
  },
  {
    label: 'Educational Consultant',
    value: 'educational-consultant',
    category: 'Education & Training',
  },
  {
    label: 'Curriculum Developer',
    value: 'curriculum-developer',
    category: 'Education & Training',
  },
  { label: 'Academic Advisor', value: 'academic-advisor', category: 'Education & Training' },
  {
    label: 'Education Technology Specialist',
    value: 'education-technology-specialist',
    category: 'Education & Training',
  },
  { label: 'School Counselor', value: 'school-counselor', category: 'Education & Training' },
  {
    label: 'Special Education Teacher',
    value: 'special-education-teacher',
    category: 'Education & Training',
  },
  {
    label: 'Educational Psychologist',
    value: 'educational-psychologist',
    category: 'Education & Training',
  },
  { label: 'Dean', value: 'dean', category: 'Education & Training' },
  {
    label: 'University President',
    value: 'university-president',
    category: 'Education & Training',
  },
  { label: 'Librarian', value: 'librarian', category: 'Education & Training' },
  {
    label: 'E-Learning Developer',
    value: 'e-learning-developer',
    category: 'Education & Training',
  },
  { label: 'Corporate Trainer', value: 'corporate-trainer', category: 'Education & Training' },
  { label: 'Training Manager', value: 'training-manager', category: 'Education & Training' },
  {
    label: 'Education Program Director',
    value: 'education-program-director',
    category: 'Education & Training',
  },
  { label: 'Admissions Officer', value: 'admissions-officer', category: 'Education & Training' },

  // Creative & Media
  { label: 'Journalist', value: 'journalist', category: 'Creative & Media' },
  { label: 'Editor', value: 'editor', category: 'Creative & Media' },
  { label: 'Writer', value: 'writer', category: 'Creative & Media' },
  { label: 'Content Creator', value: 'content-creator', category: 'Creative & Media' },
  { label: 'Photographer', value: 'photographer', category: 'Creative & Media' },
  { label: 'Videographer', value: 'videographer', category: 'Creative & Media' },
  { label: 'Film Director', value: 'film-director', category: 'Creative & Media' },
  { label: 'Producer', value: 'producer', category: 'Creative & Media' },
  { label: 'Actor', value: 'actor', category: 'Creative & Media' },
  { label: 'Animator', value: 'animator', category: 'Creative & Media' },
  { label: 'Art Director', value: 'art-director', category: 'Creative & Media' },
  { label: 'Broadcast Technician', value: 'broadcast-technician', category: 'Creative & Media' },
  { label: 'Media Planner', value: 'media-planner', category: 'Creative & Media' },
  { label: 'News Anchor', value: 'news-anchor', category: 'Creative & Media' },
  {
    label: 'Social Media Influencer',
    value: 'social-media-influencer',
    category: 'Creative & Media',
  },
  { label: 'Music Producer', value: 'music-producer', category: 'Creative & Media' },
  { label: 'Sound Engineer', value: 'sound-engineer', category: 'Creative & Media' },
  { label: 'Audio Engineer', value: 'audio-engineer', category: 'Creative & Media' },
  { label: 'Radio DJ', value: 'radio-dj', category: 'Creative & Media' },
  { label: 'Podcast Producer', value: 'podcast-producer', category: 'Creative & Media' },
  { label: 'Game Designer', value: 'game-designer', category: 'Creative & Media' },
  { label: 'Screenwriter', value: 'screenwriter', category: 'Creative & Media' },
  { label: 'Fashion Designer', value: 'fashion-designer', category: 'Creative & Media' },
  { label: 'Interior Designer', value: 'interior-designer', category: 'Creative & Media' },
  {
    label: 'Advertising Creative Director',
    value: 'advertising-creative-director',
    category: 'Creative & Media',
  },
  { label: '3D Artist', value: '3d-artist', category: 'Creative & Media' },

  // Hospitality & Tourism
  { label: 'Hotel Manager', value: 'hotel-manager', category: 'Hospitality & Tourism' },
  { label: 'Restaurant Manager', value: 'restaurant-manager', category: 'Hospitality & Tourism' },
  { label: 'Executive Chef', value: 'executive-chef', category: 'Hospitality & Tourism' },
  { label: 'Sous Chef', value: 'sous-chef', category: 'Hospitality & Tourism' },
  { label: 'Pastry Chef', value: 'pastry-chef', category: 'Hospitality & Tourism' },
  { label: 'Restaurant Owner', value: 'restaurant-owner', category: 'Hospitality & Tourism' },
  { label: 'Catering Manager', value: 'catering-manager', category: 'Hospitality & Tourism' },
  { label: 'Event Planner', value: 'event-planner', category: 'Hospitality & Tourism' },
  { label: 'Wedding Planner', value: 'wedding-planner', category: 'Hospitality & Tourism' },
  { label: 'Travel Agent', value: 'travel-agent', category: 'Hospitality & Tourism' },
  { label: 'Tour Guide', value: 'tour-guide', category: 'Hospitality & Tourism' },
  {
    label: 'Hotel Front Desk Manager',
    value: 'hotel-front-desk-manager',
    category: 'Hospitality & Tourism',
  },
  { label: 'Concierge', value: 'concierge', category: 'Hospitality & Tourism' },
  {
    label: 'Food and Beverage Director',
    value: 'food-and-beverage-director',
    category: 'Hospitality & Tourism',
  },
  { label: 'Sommelier', value: 'sommelier', category: 'Hospitality & Tourism' },
  { label: 'Bartender', value: 'bartender', category: 'Hospitality & Tourism' },
  {
    label: 'Housekeeping Manager',
    value: 'housekeeping-manager',
    category: 'Hospitality & Tourism',
  },
  { label: 'Casino Manager', value: 'casino-manager', category: 'Hospitality & Tourism' },
  { label: 'Cruise Director', value: 'cruise-director', category: 'Hospitality & Tourism' },
  {
    label: 'Tourism Development Officer',
    value: 'tourism-development-officer',
    category: 'Hospitality & Tourism',
  },

  // Construction & Architecture
  { label: 'Architect', value: 'architect', category: 'Construction & Architecture' },
  { label: 'Civil Engineer', value: 'civil-engineer', category: 'Construction & Architecture' },
  {
    label: 'Structural Engineer',
    value: 'structural-engineer',
    category: 'Construction & Architecture',
  },
  {
    label: 'Construction Manager',
    value: 'construction-manager',
    category: 'Construction & Architecture',
  },
  { label: 'Project Manager', value: 'project-manager', category: 'Construction & Architecture' },
  {
    label: 'General Contractor',
    value: 'general-contractor',
    category: 'Construction & Architecture',
  },
  {
    label: 'Construction Superintendent',
    value: 'construction-superintendent',
    category: 'Construction & Architecture',
  },
  { label: 'Electrician', value: 'electrician', category: 'Construction & Architecture' },
  { label: 'Plumber', value: 'plumber', category: 'Construction & Architecture' },
  { label: 'HVAC Technician', value: 'hvac-technician', category: 'Construction & Architecture' },
  { label: 'Carpenter', value: 'carpenter', category: 'Construction & Architecture' },
  { label: 'Welder', value: 'welder', category: 'Construction & Architecture' },
  {
    label: 'Landscape Architect',
    value: 'landscape-architect',
    category: 'Construction & Architecture',
  },
  { label: 'Urban Planner', value: 'urban-planner', category: 'Construction & Architecture' },
  {
    label: 'Interior Designer',
    value: 'interior-designer',
    category: 'Construction & Architecture',
  },
  {
    label: 'Building Inspector',
    value: 'building-inspector',
    category: 'Construction & Architecture',
  },
  { label: 'Estimator', value: 'estimator', category: 'Construction & Architecture' },
  { label: 'Safety Manager', value: 'safety-manager', category: 'Construction & Architecture' },
  { label: 'Surveyor', value: 'surveyor', category: 'Construction & Architecture' },
  { label: 'CAD Technician', value: 'cad-technician', category: 'Construction & Architecture' },

  // Manufacturing & Industrial
  {
    label: 'Manufacturing Manager',
    value: 'manufacturing-manager',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Production Manager',
    value: 'production-manager',
    category: 'Manufacturing & Industrial',
  },
  { label: 'Plant Manager', value: 'plant-manager', category: 'Manufacturing & Industrial' },
  {
    label: 'Operations Manager',
    value: 'operations-manager',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Quality Control Manager',
    value: 'quality-control-manager',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Industrial Engineer',
    value: 'industrial-engineer',
    category: 'Manufacturing & Industrial',
  },
  { label: 'Process Engineer', value: 'process-engineer', category: 'Manufacturing & Industrial' },
  {
    label: 'Mechanical Engineer',
    value: 'mechanical-engineer',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Chemical Engineer',
    value: 'chemical-engineer',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Maintenance Manager',
    value: 'maintenance-manager',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Maintenance Technician',
    value: 'maintenance-technician',
    category: 'Manufacturing & Industrial',
  },
  { label: 'CNC Machinist', value: 'cnc-machinist', category: 'Manufacturing & Industrial' },
  { label: 'Welder', value: 'welder', category: 'Manufacturing & Industrial' },
  {
    label: 'Assembly Technician',
    value: 'assembly-technician',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Production Supervisor',
    value: 'production-supervisor',
    category: 'Manufacturing & Industrial',
  },
  { label: 'Fabricator', value: 'fabricator', category: 'Manufacturing & Industrial' },
  {
    label: 'Health and Safety Officer',
    value: 'health-and-safety-officer',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Logistics Coordinator',
    value: 'logistics-coordinator',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Manufacturing Engineer',
    value: 'manufacturing-engineer',
    category: 'Manufacturing & Industrial',
  },
  {
    label: 'Quality Assurance Specialist',
    value: 'quality-assurance-specialist',
    category: 'Manufacturing & Industrial',
  },

  // Transportation & Logistics
  {
    label: 'Logistics Manager',
    value: 'logistics-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Supply Chain Manager',
    value: 'supply-chain-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Transportation Manager',
    value: 'transportation-manager',
    category: 'Transportation & Logistics',
  },
  { label: 'Fleet Manager', value: 'fleet-manager', category: 'Transportation & Logistics' },
  {
    label: 'Warehouse Manager',
    value: 'warehouse-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Distribution Manager',
    value: 'distribution-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Inventory Manager',
    value: 'inventory-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Procurement Manager',
    value: 'procurement-manager',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Shipping Coordinator',
    value: 'shipping-coordinator',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Freight Forwarder',
    value: 'freight-forwarder',
    category: 'Transportation & Logistics',
  },
  { label: 'Customs Broker', value: 'customs-broker', category: 'Transportation & Logistics' },
  { label: 'Truck Driver', value: 'truck-driver', category: 'Transportation & Logistics' },
  { label: 'Delivery Driver', value: 'delivery-driver', category: 'Transportation & Logistics' },
  { label: 'Pilot', value: 'pilot', category: 'Transportation & Logistics' },
  {
    label: 'Air Traffic Controller',
    value: 'air-traffic-controller',
    category: 'Transportation & Logistics',
  },
  { label: 'Ship Captain', value: 'ship-captain', category: 'Transportation & Logistics' },
  {
    label: 'Logistics Analyst',
    value: 'logistics-analyst',
    category: 'Transportation & Logistics',
  },
  {
    label: 'Transportation Planner',
    value: 'transportation-planner',
    category: 'Transportation & Logistics',
  },
  { label: 'Dispatch Manager', value: 'dispatch-manager', category: 'Transportation & Logistics' },
  {
    label: 'Import/Export Specialist',
    value: 'import-export-specialist',
    category: 'Transportation & Logistics',
  },

  // Government & Public Administration
  { label: 'City Manager', value: 'city-manager', category: 'Government & Public Administration' },
  {
    label: 'Policy Analyst',
    value: 'policy-analyst',
    category: 'Government & Public Administration',
  },
  {
    label: 'Urban Planner',
    value: 'urban-planner',
    category: 'Government & Public Administration',
  },
  {
    label: 'Public Administrator',
    value: 'public-administrator',
    category: 'Government & Public Administration',
  },
  {
    label: 'Program Manager',
    value: 'program-manager',
    category: 'Government & Public Administration',
  },
  {
    label: 'Government Affairs Director',
    value: 'government-affairs-director',
    category: 'Government & Public Administration',
  },
  {
    label: 'Legislative Assistant',
    value: 'legislative-assistant',
    category: 'Government & Public Administration',
  },
  {
    label: 'Foreign Service Officer',
    value: 'foreign-service-officer',
    category: 'Government & Public Administration',
  },
  { label: 'Diplomat', value: 'diplomat', category: 'Government & Public Administration' },
  {
    label: 'Intelligence Analyst',
    value: 'intelligence-analyst',
    category: 'Government & Public Administration',
  },
  {
    label: 'Public Health Director',
    value: 'public-health-director',
    category: 'Government & Public Administration',
  },
  {
    label: 'Emergency Management Director',
    value: 'emergency-management-director',
    category: 'Government & Public Administration',
  },
  {
    label: 'Environmental Health Officer',
    value: 'environmental-health-officer',
    category: 'Government & Public Administration',
  },
  { label: 'Tax Examiner', value: 'tax-examiner', category: 'Government & Public Administration' },
  {
    label: 'Border Patrol Agent',
    value: 'border-patrol-agent',
    category: 'Government & Public Administration',
  },
  {
    label: 'Postal Service Manager',
    value: 'postal-service-manager',
    category: 'Government & Public Administration',
  },
  {
    label: 'Court Administrator',
    value: 'court-administrator',
    category: 'Government & Public Administration',
  },
  {
    label: 'Social Services Director',
    value: 'social-services-director',
    category: 'Government & Public Administration',
  },
  {
    label: 'Election Administrator',
    value: 'election-administrator',
    category: 'Government & Public Administration',
  },
  {
    label: 'Grant Coordinator',
    value: 'grant-coordinator',
    category: 'Government & Public Administration',
  },

  // Agriculture & Environment
  { label: 'Farm Manager', value: 'farm-manager', category: 'Agriculture & Environment' },
  {
    label: 'Agricultural Scientist',
    value: 'agricultural-scientist',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Environmental Scientist',
    value: 'environmental-scientist',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Conservation Scientist',
    value: 'conservation-scientist',
    category: 'Agriculture & Environment',
  },
  { label: 'Forester', value: 'forester', category: 'Agriculture & Environment' },
  {
    label: 'Agricultural Engineer',
    value: 'agricultural-engineer',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Environmental Engineer',
    value: 'environmental-engineer',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Wildlife Biologist',
    value: 'wildlife-biologist',
    category: 'Agriculture & Environment',
  },
  { label: 'Ecologist', value: 'ecologist', category: 'Agriculture & Environment' },
  { label: 'Agronomist', value: 'agronomist', category: 'Agriculture & Environment' },
  { label: 'Soil Scientist', value: 'soil-scientist', category: 'Agriculture & Environment' },
  {
    label: 'Environmental Consultant',
    value: 'environmental-consultant',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Sustainability Manager',
    value: 'sustainability-manager',
    category: 'Agriculture & Environment',
  },
  { label: 'Horticulturist', value: 'horticulturist', category: 'Agriculture & Environment' },
  { label: 'Landscape Manager', value: 'landscape-manager', category: 'Agriculture & Environment' },
  { label: 'Fishery Manager', value: 'fishery-manager', category: 'Agriculture & Environment' },
  { label: 'Animal Scientist', value: 'animal-scientist', category: 'Agriculture & Environment' },
  {
    label: 'Food Safety Inspector',
    value: 'food-safety-inspector',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Renewable Energy Specialist',
    value: 'renewable-energy-specialist',
    category: 'Agriculture & Environment',
  },
  {
    label: 'Water Resource Specialist',
    value: 'water-resource-specialist',
    category: 'Agriculture & Environment',
  },

  // Energy & Utilities
  { label: 'Energy Manager', value: 'energy-manager', category: 'Energy & Utilities' },
  { label: 'Petroleum Engineer', value: 'petroleum-engineer', category: 'Energy & Utilities' },
  { label: 'Power Plant Manager', value: 'power-plant-manager', category: 'Energy & Utilities' },
  { label: 'Utilities Manager', value: 'utilities-manager', category: 'Energy & Utilities' },
  {
    label: 'Solar Energy Installer',
    value: 'solar-energy-installer',
    category: 'Energy & Utilities',
  },
  {
    label: 'Wind Energy Technician',
    value: 'wind-energy-technician',
    category: 'Energy & Utilities',
  },
  { label: 'Electrical Engineer', value: 'electrical-engineer', category: 'Energy & Utilities' },
  { label: 'Nuclear Engineer', value: 'nuclear-engineer', category: 'Energy & Utilities' },
  { label: 'Pipeline Engineer', value: 'pipeline-engineer', category: 'Energy & Utilities' },
  { label: 'Geologist', value: 'geologist', category: 'Energy & Utilities' },
  { label: 'Geophysicist', value: 'geophysicist', category: 'Energy & Utilities' },
  { label: 'Drilling Engineer', value: 'drilling-engineer', category: 'Energy & Utilities' },
  { label: 'Reservoir Engineer', value: 'reservoir-engineer', category: 'Energy & Utilities' },
  { label: 'Energy Analyst', value: 'energy-analyst', category: 'Energy & Utilities' },
  {
    label: 'Renewable Energy Project Manager',
    value: 'renewable-energy-project-manager',
    category: 'Energy & Utilities',
  },
  { label: 'Utility Technician', value: 'utility-technician', category: 'Energy & Utilities' },
  { label: 'Gas Controller', value: 'gas-controller', category: 'Energy & Utilities' },
  { label: 'Energy Consultant', value: 'energy-consultant', category: 'Energy & Utilities' },
  { label: 'Smart Grid Engineer', value: 'smart-grid-engineer', category: 'Energy & Utilities' },
  {
    label: 'Energy Policy Analyst',
    value: 'energy-policy-analyst',
    category: 'Energy & Utilities',
  },

  // Real Estate & Property Management
  {
    label: 'Real Estate Agent',
    value: 'real-estate-agent',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Broker',
    value: 'real-estate-broker',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Property Manager',
    value: 'property-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Facilities Manager',
    value: 'facilities-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Commercial Real Estate Manager',
    value: 'commercial-real-estate-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Developer',
    value: 'real-estate-developer',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Appraiser',
    value: 'real-estate-appraiser',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Investor',
    value: 'real-estate-investor',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Leasing Manager',
    value: 'leasing-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Mortgage Loan Officer',
    value: 'mortgage-loan-officer',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Attorney',
    value: 'real-estate-attorney',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Property Inspector',
    value: 'property-inspector',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Home Inspector',
    value: 'home-inspector',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Estate Manager',
    value: 'estate-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Marketing Manager',
    value: 'real-estate-marketing-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Real Estate Analyst',
    value: 'real-estate-analyst',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Maintenance Supervisor',
    value: 'maintenance-supervisor',
    category: 'Real Estate & Property Management',
  },
  { label: 'Asset Manager', value: 'asset-manager', category: 'Real Estate & Property Management' },
  {
    label: 'Property Acquisition Manager',
    value: 'property-acquisition-manager',
    category: 'Real Estate & Property Management',
  },
  {
    label: 'Community Association Manager',
    value: 'community-association-manager',
    category: 'Real Estate & Property Management',
  },

  // Nonprofit & Social Services
  {
    label: 'Nonprofit Director',
    value: 'nonprofit-director',
    category: 'Nonprofit & Social Services',
  },
  { label: 'Program Director', value: 'program-director', category: 'Nonprofit & Social Services' },
  { label: 'Social Worker', value: 'social-worker', category: 'Nonprofit & Social Services' },
  { label: 'Case Manager', value: 'case-manager', category: 'Nonprofit & Social Services' },
  {
    label: 'Fundraising Manager',
    value: 'fundraising-manager',
    category: 'Nonprofit & Social Services',
  },
  { label: 'Grant Writer', value: 'grant-writer', category: 'Nonprofit & Social Services' },
  {
    label: 'Volunteer Coordinator',
    value: 'volunteer-coordinator',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Community Outreach Coordinator',
    value: 'community-outreach-coordinator',
    category: 'Nonprofit & Social Services',
  },
  { label: 'Counselor', value: 'counselor', category: 'Nonprofit & Social Services' },
  { label: 'Therapist', value: 'therapist', category: 'Nonprofit & Social Services' },
  {
    label: 'Rehabilitation Counselor',
    value: 'rehabilitation-counselor',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Crisis Intervention Specialist',
    value: 'crisis-intervention-specialist',
    category: 'Nonprofit & Social Services',
  },
  { label: 'Youth Worker', value: 'youth-worker', category: 'Nonprofit & Social Services' },
  {
    label: 'Mental Health Counselor',
    value: 'mental-health-counselor',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Executive Director',
    value: 'executive-director',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Nonprofit Program Manager',
    value: 'nonprofit-program-manager',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Child Welfare Specialist',
    value: 'child-welfare-specialist',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Human Services Coordinator',
    value: 'human-services-coordinator',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Substance Abuse Counselor',
    value: 'substance-abuse-counselor',
    category: 'Nonprofit & Social Services',
  },
  {
    label: 'Humanitarian Aid Worker',
    value: 'humanitarian-aid-worker',
    category: 'Nonprofit & Social Services',
  },

  // Sports & Fitness
  { label: 'Athletic Director', value: 'athletic-director', category: 'Sports & Fitness' },
  { label: 'Sports Coach', value: 'sports-coach', category: 'Sports & Fitness' },
  { label: 'Fitness Trainer', value: 'fitness-trainer', category: 'Sports & Fitness' },
  {
    label: 'Physical Education Teacher',
    value: 'physical-education-teacher',
    category: 'Sports & Fitness',
  },
  { label: 'Sports Agent', value: 'sports-agent', category: 'Sports & Fitness' },
  { label: 'Sports Psychologist', value: 'sports-psychologist', category: 'Sports & Fitness' },
  { label: 'Sports Nutritionist', value: 'sports-nutritionist', category: 'Sports & Fitness' },
  { label: 'Team Manager', value: 'team-manager', category: 'Sports & Fitness' },
  { label: 'Sports Analyst', value: 'sports-analyst', category: 'Sports & Fitness' },
  {
    label: 'Sports Marketing Manager',
    value: 'sports-marketing-manager',
    category: 'Sports & Fitness',
  },
  { label: 'Recreation Manager', value: 'recreation-manager', category: 'Sports & Fitness' },
  { label: 'Yoga Instructor', value: 'yoga-instructor', category: 'Sports & Fitness' },
  { label: 'Pilates Instructor', value: 'pilates-instructor', category: 'Sports & Fitness' },
  { label: 'Athletic Trainer', value: 'athletic-trainer', category: 'Sports & Fitness' },
  {
    label: 'Sports Medicine Physician',
    value: 'sports-medicine-physician',
    category: 'Sports & Fitness',
  },
  { label: 'Gym Manager', value: 'gym-manager', category: 'Sports & Fitness' },
  { label: 'Professional Athlete', value: 'professional-athlete', category: 'Sports & Fitness' },
  { label: 'Referee', value: 'referee', category: 'Sports & Fitness' },
  { label: 'Physical Therapist', value: 'physical-therapist', category: 'Sports & Fitness' },
  {
    label: 'Sports Facilities Manager',
    value: 'sports-facilities-manager',
    category: 'Sports & Fitness',
  },

  // Telecommunications
  {
    label: 'Telecommunications Manager',
    value: 'telecommunications-manager',
    category: 'Telecommunications',
  },
  { label: 'Network Engineer', value: 'network-engineer', category: 'Telecommunications' },
  {
    label: 'Telecommunications Engineer',
    value: 'telecommunications-engineer',
    category: 'Telecommunications',
  },
  { label: 'RF Engineer', value: 'rf-engineer', category: 'Telecommunications' },
  {
    label: 'Telecommunications Technician',
    value: 'telecommunications-technician',
    category: 'Telecommunications',
  },
  {
    label: 'Cell Tower Technician',
    value: 'cell-tower-technician',
    category: 'Telecommunications',
  },
  {
    label: 'Telecom Project Manager',
    value: 'telecom-project-manager',
    category: 'Telecommunications',
  },
  {
    label: 'Network Operations Manager',
    value: 'network-operations-manager',
    category: 'Telecommunications',
  },
  {
    label: 'Network Administrator',
    value: 'network-administrator',
    category: 'Telecommunications',
  },
  {
    label: 'Telecommunications Analyst',
    value: 'telecommunications-analyst',
    category: 'Telecommunications',
  },
  {
    label: 'Telecom Sales Manager',
    value: 'telecom-sales-manager',
    category: 'Telecommunications',
  },
  {
    label: 'Telecom Account Manager',
    value: 'telecom-account-manager',
    category: 'Telecommunications',
  },
  {
    label: 'Fiber Optic Technician',
    value: 'fiber-optic-technician',
    category: 'Telecommunications',
  },
  { label: 'VoIP Engineer', value: 'voip-engineer', category: 'Telecommunications' },
  { label: 'Telecom Consultant', value: 'telecom-consultant', category: 'Telecommunications' },
  {
    label: 'Satellite Communications Specialist',
    value: 'satellite-communications-specialist',
    category: 'Telecommunications',
  },
  {
    label: 'Wireless Network Engineer',
    value: 'wireless-network-engineer',
    category: 'Telecommunications',
  },
  {
    label: 'Telecommunications Director',
    value: 'telecommunications-director',
    category: 'Telecommunications',
  },
  {
    label: 'Network Security Specialist',
    value: 'network-security-specialist',
    category: 'Telecommunications',
  },
  { label: '5G Network Engineer', value: '5g-network-engineer', category: 'Telecommunications' },

  // Insurance
  { label: 'Insurance Agent', value: 'insurance-agent', category: 'Insurance' },
  { label: 'Insurance Broker', value: 'insurance-broker', category: 'Insurance' },
  { label: 'Insurance Underwriter', value: 'insurance-underwriter', category: 'Insurance' },
  { label: 'Claims Adjuster', value: 'claims-adjuster', category: 'Insurance' },
  { label: 'Risk Manager', value: 'risk-manager', category: 'Insurance' },
  { label: 'Actuary', value: 'actuary', category: 'Insurance' },
  { label: 'Insurance Manager', value: 'insurance-manager', category: 'Insurance' },
  { label: 'Insurance Analyst', value: 'insurance-analyst', category: 'Insurance' },
  { label: 'Insurance Sales Manager', value: 'insurance-sales-manager', category: 'Insurance' },
  { label: 'Insurance Claims Manager', value: 'insurance-claims-manager', category: 'Insurance' },
  { label: 'Loss Control Specialist', value: 'loss-control-specialist', category: 'Insurance' },
  { label: 'Insurance Product Manager', value: 'insurance-product-manager', category: 'Insurance' },
  {
    label: 'Insurance Compliance Officer',
    value: 'insurance-compliance-officer',
    category: 'Insurance',
  },
  {
    label: 'Insurance Fraud Investigator',
    value: 'insurance-fraud-investigator',
    category: 'Insurance',
  },
  { label: 'Reinsurance Specialist', value: 'reinsurance-specialist', category: 'Insurance' },
  {
    label: 'Insurance Customer Service Representative',
    value: 'insurance-customer-service-representative',
    category: 'Insurance',
  },
  {
    label: 'Employee Benefits Specialist',
    value: 'employee-benefits-specialist',
    category: 'Insurance',
  },
  {
    label: 'Insurance Operations Manager',
    value: 'insurance-operations-manager',
    category: 'Insurance',
  },
  { label: 'Insurance Trainer', value: 'insurance-trainer', category: 'Insurance' },
  { label: 'Insurance Agency Owner', value: 'insurance-agency-owner', category: 'Insurance' },

  // Fashion & Beauty
  { label: 'Fashion Designer', value: 'fashion-designer', category: 'Fashion & Beauty' },
  { label: 'Fashion Merchandiser', value: 'fashion-merchandiser', category: 'Fashion & Beauty' },
  { label: 'Fashion Buyer', value: 'fashion-buyer', category: 'Fashion & Beauty' },
  { label: 'Fashion Stylist', value: 'fashion-stylist', category: 'Fashion & Beauty' },
  { label: 'Retail Manager', value: 'retail-manager', category: 'Fashion & Beauty' },
  {
    label: 'Cosmetics Brand Manager',
    value: 'cosmetics-brand-manager',
    category: 'Fashion & Beauty',
  },
  { label: 'Beauty Salon Manager', value: 'beauty-salon-manager', category: 'Fashion & Beauty' },
  { label: 'Cosmetologist', value: 'cosmetologist', category: 'Fashion & Beauty' },
  { label: 'Esthetician', value: 'esthetician', category: 'Fashion & Beauty' },
  { label: 'Makeup Artist', value: 'makeup-artist', category: 'Fashion & Beauty' },
  { label: 'Hairstylist', value: 'hairstylist', category: 'Fashion & Beauty' },
  { label: 'Fashion Consultant', value: 'fashion-consultant', category: 'Fashion & Beauty' },
  { label: 'Textile Designer', value: 'textile-designer', category: 'Fashion & Beauty' },
  { label: 'Jewelry Designer', value: 'jewelry-designer', category: 'Fashion & Beauty' },
  { label: 'Retail Buyer', value: 'retail-buyer', category: 'Fashion & Beauty' },
  { label: 'Fashion Model', value: 'fashion-model', category: 'Fashion & Beauty' },
  {
    label: 'Fashion Marketing Manager',
    value: 'fashion-marketing-manager',
    category: 'Fashion & Beauty',
  },
  {
    label: 'Beauty Product Developer',
    value: 'beauty-product-developer',
    category: 'Fashion & Beauty',
  },
  { label: 'Visual Merchandiser', value: 'visual-merchandiser', category: 'Fashion & Beauty' },
  { label: 'Fashion Photographer', value: 'fashion-photographer', category: 'Fashion & Beauty' },

  // Science & Research
  { label: 'Scientist', value: 'scientist', category: 'Science & Research' },
  { label: 'Research Scientist', value: 'research-scientist', category: 'Science & Research' },
  { label: 'Laboratory Director', value: 'laboratory-director', category: 'Science & Research' },
  { label: 'Biochemist', value: 'biochemist', category: 'Science & Research' },
  { label: 'Biologist', value: 'biologist', category: 'Science & Research' },
  { label: 'Chemist', value: 'chemist', category: 'Science & Research' },
  { label: 'Physicist', value: 'physicist', category: 'Science & Research' },
  { label: 'Astronomer', value: 'astronomer', category: 'Science & Research' },
  { label: 'Geneticist', value: 'geneticist', category: 'Science & Research' },
  { label: 'Microbiologist', value: 'microbiologist', category: 'Science & Research' },
  { label: 'Neuroscientist', value: 'neuroscientist', category: 'Science & Research' },
  { label: 'Pharmacologist', value: 'pharmacologist', category: 'Science & Research' },
  { label: 'Epidemiologist', value: 'epidemiologist', category: 'Science & Research' },
  { label: 'Geologist', value: 'geologist', category: 'Science & Research' },
  { label: 'Oceanographer', value: 'oceanographer', category: 'Science & Research' },
  { label: 'Meteorologist', value: 'meteorologist', category: 'Science & Research' },
  { label: 'Botanist', value: 'botanist', category: 'Science & Research' },
  { label: 'Zoologist', value: 'zoologist', category: 'Science & Research' },
  { label: 'Forensic Scientist', value: 'forensic-scientist', category: 'Science & Research' },
  {
    label: 'Scientific Laboratory Technician',
    value: 'scientific-laboratory-technician',
    category: 'Science & Research',
  },

  // Executive Leadership
  {
    label: 'Chief Executive Officer',
    value: 'chief-executive-officer',
    category: 'Executive Leadership',
  },
  { label: 'President', value: 'president', category: 'Executive Leadership' },
  {
    label: 'Chief Operating Officer',
    value: 'chief-operating-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Financial Officer',
    value: 'chief-financial-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Marketing Officer',
    value: 'chief-marketing-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Technology Officer',
    value: 'chief-technology-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Information Officer',
    value: 'chief-information-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Human Resources Officer',
    value: 'chief-human-resources-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Product Officer',
    value: 'chief-product-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Revenue Officer',
    value: 'chief-revenue-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Strategy Officer',
    value: 'chief-strategy-officer',
    category: 'Executive Leadership',
  },
  {
    label: 'Chief Innovation Officer',
    value: 'chief-innovation-officer',
    category: 'Executive Leadership',
  },
  { label: 'Chief Data Officer', value: 'chief-data-officer', category: 'Executive Leadership' },
  {
    label: 'Chief Administrative Officer',
    value: 'chief-administrative-officer',
    category: 'Executive Leadership',
  },
  { label: 'Executive Director', value: 'executive-director', category: 'Executive Leadership' },
  { label: 'Managing Director', value: 'managing-director', category: 'Executive Leadership' },
  {
    label: 'Executive Vice President',
    value: 'executive-vice-president',
    category: 'Executive Leadership',
  },
  {
    label: 'Senior Vice President',
    value: 'senior-vice-president',
    category: 'Executive Leadership',
  },
  { label: 'Vice President', value: 'vice-president', category: 'Executive Leadership' },
  {
    label: 'Chairman of the Board',
    value: 'chairman-of-the-board',
    category: 'Executive Leadership',
  },
];

export function filterJobRoles(searchTerm: string): JobRole[] {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  // First try exact label matches at the start of the label
  const exactLabelMatches = jobRoles.filter((role) => role.label.toLowerCase().startsWith(term));

  if (exactLabelMatches.length > 0) {
    return exactLabelMatches;
  }

  // Then try word-by-word matches in the label
  const wordMatches = jobRoles.filter((role) =>
    role.label
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(term))
  );

  if (wordMatches.length > 0) {
    return wordMatches;
  }

  // Finally, try category matches only if no label matches found
  return jobRoles.filter((role) => role.category.toLowerCase().includes(term));
}

export function getJobRoleCategories(): string[] {
  return Array.from(new Set(jobRoles.map((role) => role.category)));
}
