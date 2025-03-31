export interface Skill {
  label: string;
  value: string;
  category: string;
}

export const skills: Skill[] = [
  // Programming Languages
  { label: 'JavaScript', value: 'javascript', category: 'Programming Languages' },
  { label: 'Python', value: 'python', category: 'Programming Languages' },
  { label: 'Java', value: 'java', category: 'Programming Languages' },
  { label: 'C++', value: 'cpp', category: 'Programming Languages' },
  { label: 'C#', value: 'csharp', category: 'Programming Languages' },
  { label: 'TypeScript', value: 'typescript', category: 'Programming Languages' },
  { label: 'Ruby', value: 'ruby', category: 'Programming Languages' },
  { label: 'PHP', value: 'php', category: 'Programming Languages' },
  { label: 'Swift', value: 'swift', category: 'Programming Languages' },
  { label: 'Kotlin', value: 'kotlin', category: 'Programming Languages' },
  { label: 'Go', value: 'go', category: 'Programming Languages' },
  { label: 'Rust', value: 'rust', category: 'Programming Languages' },
  { label: 'Scala', value: 'scala', category: 'Programming Languages' },
  { label: 'R', value: 'r', category: 'Programming Languages' },
  { label: 'MATLAB', value: 'matlab', category: 'Programming Languages' },
  { label: 'Perl', value: 'perl', category: 'Programming Languages' },
  { label: 'Dart', value: 'dart', category: 'Programming Languages' },
  { label: 'Lua', value: 'lua', category: 'Programming Languages' },
  { label: 'Haskell', value: 'haskell', category: 'Programming Languages' },
  { label: 'Elixir', value: 'elixir', category: 'Programming Languages' },
  { label: 'VBA', value: 'vba', category: 'Programming Languages' },
  { label: 'Groovy', value: 'groovy', category: 'Programming Languages' },

  // Web Development
  { label: 'HTML', value: 'html', category: 'Web Development' },
  { label: 'CSS', value: 'css', category: 'Web Development' },
  { label: 'React', value: 'react', category: 'Web Development' },
  { label: 'Angular', value: 'angular', category: 'Web Development' },
  { label: 'Vue.js', value: 'vuejs', category: 'Web Development' },
  { label: 'Node.js', value: 'nodejs', category: 'Web Development' },
  { label: 'Express.js', value: 'expressjs', category: 'Web Development' },
  { label: 'Next.js', value: 'nextjs', category: 'Web Development' },
  { label: 'Django', value: 'django', category: 'Web Development' },
  { label: 'Flask', value: 'flask', category: 'Web Development' },
  { label: 'Ruby on Rails', value: 'ruby-on-rails', category: 'Web Development' },
  { label: 'GraphQL', value: 'graphql', category: 'Web Development' },
  { label: 'REST APIs', value: 'rest-apis', category: 'Web Development' },
  { label: 'WebSocket', value: 'websocket', category: 'Web Development' },
  { label: 'Redux', value: 'redux', category: 'Web Development' },
  { label: 'Svelte', value: 'svelte', category: 'Web Development' },
  { label: 'Webpack', value: 'webpack', category: 'Web Development' },
  { label: 'Bootstrap', value: 'bootstrap', category: 'Web Development' },
  { label: 'Tailwind CSS', value: 'tailwind-css', category: 'Web Development' },
  { label: 'Laravel', value: 'laravel', category: 'Web Development' },
  { label: 'ASP.NET', value: 'asp-net', category: 'Web Development' },
  { label: 'jQuery', value: 'jquery', category: 'Web Development' },

  // Database
  { label: 'SQL', value: 'sql', category: 'Database' },
  { label: 'MySQL', value: 'mysql', category: 'Database' },
  { label: 'PostgreSQL', value: 'postgresql', category: 'Database' },
  { label: 'MongoDB', value: 'mongodb', category: 'Database' },
  { label: 'Redis', value: 'redis', category: 'Database' },
  { label: 'Oracle', value: 'oracle', category: 'Database' },
  { label: 'Elasticsearch', value: 'elasticsearch', category: 'Database' },
  { label: 'Firebase', value: 'firebase', category: 'Database' },
  { label: 'DynamoDB', value: 'dynamodb', category: 'Database' },
  { label: 'Cassandra', value: 'cassandra', category: 'Database' },
  { label: 'SQLite', value: 'sqlite', category: 'Database' },
  { label: 'MariaDB', value: 'mariadb', category: 'Database' },
  { label: 'Neo4j', value: 'neo4j', category: 'Database' },
  { label: 'CouchDB', value: 'couchdb', category: 'Database' },
  { label: 'BigQuery', value: 'bigquery', category: 'Database' },
  { label: 'Microsoft Access', value: 'microsoft-access', category: 'Database' },

  // Cloud & DevOps
  { label: 'AWS', value: 'aws', category: 'Cloud & DevOps' },
  { label: 'Azure', value: 'azure', category: 'Cloud & DevOps' },
  { label: 'Google Cloud', value: 'google-cloud', category: 'Cloud & DevOps' },
  { label: 'Docker', value: 'docker', category: 'Cloud & DevOps' },
  { label: 'Kubernetes', value: 'kubernetes', category: 'Cloud & DevOps' },
  { label: 'Jenkins', value: 'jenkins', category: 'Cloud & DevOps' },
  { label: 'Git', value: 'git', category: 'Cloud & DevOps' },
  { label: 'CI/CD', value: 'ci-cd', category: 'Cloud & DevOps' },
  { label: 'Terraform', value: 'terraform', category: 'Cloud & DevOps' },
  { label: 'Linux', value: 'linux', category: 'Cloud & DevOps' },
  { label: 'Ansible', value: 'ansible', category: 'Cloud & DevOps' },
  { label: 'Puppet', value: 'puppet', category: 'Cloud & DevOps' },
  { label: 'Chef', value: 'chef', category: 'Cloud & DevOps' },
  { label: 'Nagios', value: 'nagios', category: 'Cloud & DevOps' },
  { label: 'Prometheus', value: 'prometheus', category: 'Cloud & DevOps' },
  { label: 'Grafana', value: 'grafana', category: 'Cloud & DevOps' },
  { label: 'GitLab CI', value: 'gitlab-ci', category: 'Cloud & DevOps' },
  { label: 'Bitbucket Pipelines', value: 'bitbucket-pipelines', category: 'Cloud & DevOps' },
  { label: 'Windows Server', value: 'windows-server', category: 'Cloud & DevOps' },
  { label: 'VMware', value: 'vmware', category: 'Cloud & DevOps' },

  // Data Science & Analytics
  { label: 'Machine Learning', value: 'machine-learning', category: 'Data Science & Analytics' },
  { label: 'Deep Learning', value: 'deep-learning', category: 'Data Science & Analytics' },
  { label: 'Natural Language Processing', value: 'nlp', category: 'Data Science & Analytics' },
  { label: 'Data Analysis', value: 'data-analysis', category: 'Data Science & Analytics' },
  {
    label: 'Data Visualization',
    value: 'data-visualization',
    category: 'Data Science & Analytics',
  },
  {
    label: 'Statistical Analysis',
    value: 'statistical-analysis',
    category: 'Data Science & Analytics',
  },
  { label: 'Python Libraries', value: 'python-libraries', category: 'Data Science & Analytics' },
  { label: 'TensorFlow', value: 'tensorflow', category: 'Data Science & Analytics' },
  { label: 'PyTorch', value: 'pytorch', category: 'Data Science & Analytics' },
  { label: 'Pandas', value: 'pandas', category: 'Data Science & Analytics' },
  { label: 'NumPy', value: 'numpy', category: 'Data Science & Analytics' },
  { label: 'Scikit-learn', value: 'scikit-learn', category: 'Data Science & Analytics' },
  { label: 'Tableau', value: 'tableau', category: 'Data Science & Analytics' },
  { label: 'Power BI', value: 'power-bi', category: 'Data Science & Analytics' },
  { label: 'Hadoop', value: 'hadoop', category: 'Data Science & Analytics' },
  { label: 'Spark', value: 'spark', category: 'Data Science & Analytics' },
  { label: 'Data Engineering', value: 'data-engineering', category: 'Data Science & Analytics' },
  { label: 'ETL Processes', value: 'etl-processes', category: 'Data Science & Analytics' },
  { label: 'Excel Analytics', value: 'excel-analytics', category: 'Data Science & Analytics' },
  { label: 'SAS', value: 'sas', category: 'Data Science & Analytics' },
  { label: 'SPSS', value: 'spss', category: 'Data Science & Analytics' },

  // Design & Creative
  { label: 'UI Design', value: 'ui-design', category: 'Design & Creative' },
  { label: 'UX Design', value: 'ux-design', category: 'Design & Creative' },
  { label: 'Graphic Design', value: 'graphic-design', category: 'Design & Creative' },
  { label: 'Adobe Creative Suite', value: 'adobe-creative-suite', category: 'Design & Creative' },
  { label: 'Figma', value: 'figma', category: 'Design & Creative' },
  { label: 'Sketch', value: 'sketch', category: 'Design & Creative' },
  { label: 'Prototyping', value: 'prototyping', category: 'Design & Creative' },
  { label: 'Motion Design', value: 'motion-design', category: 'Design & Creative' },
  { label: 'Visual Design', value: 'visual-design', category: 'Design & Creative' },
  { label: 'Brand Design', value: 'brand-design', category: 'Design & Creative' },
  { label: 'Illustration', value: 'illustration', category: 'Design & Creative' },
  { label: '3D Modeling', value: '3d-modeling', category: 'Design & Creative' },
  { label: 'Animation', value: 'animation', category: 'Design & Creative' },
  { label: 'Video Editing', value: 'video-editing', category: 'Design & Creative' },
  { label: 'Photography', value: 'photography', category: 'Design & Creative' },
  { label: 'InDesign', value: 'indesign', category: 'Design & Creative' },
  { label: 'Blender', value: 'blender', category: 'Design & Creative' },
  { label: 'Typography', value: 'typography', category: 'Design & Creative' },

  // Project Management
  { label: 'Agile', value: 'agile', category: 'Project Management' },
  { label: 'Scrum', value: 'scrum', category: 'Project Management' },
  { label: 'Kanban', value: 'kanban', category: 'Project Management' },
  { label: 'JIRA', value: 'jira', category: 'Project Management' },
  { label: 'Confluence', value: 'confluence', category: 'Project Management' },
  { label: 'Risk Management', value: 'risk-management', category: 'Project Management' },
  { label: 'Budgeting', value: 'budgeting', category: 'Project Management' },
  { label: 'Team Leadership', value: 'team-leadership', category: 'Project Management' },
  { label: 'Strategic Planning', value: 'strategic-planning', category: 'Project Management' },
  {
    label: 'Stakeholder Management',
    value: 'stakeholder-management',
    category: 'Project Management',
  },
  { label: 'PMP Certification', value: 'pmp-certification', category: 'Project Management' },
  { label: 'Lean Management', value: 'lean-management', category: 'Project Management' },
  { label: 'Change Management', value: 'change-management', category: 'Project Management' },
  { label: 'Microsoft Project', value: 'microsoft-project', category: 'Project Management' },
  { label: 'Trello', value: 'trello', category: 'Project Management' },
  { label: 'Asana', value: 'asana', category: 'Project Management' },

  // Marketing
  { label: 'Digital Marketing', value: 'digital-marketing', category: 'Marketing' },
  { label: 'SEO', value: 'seo', category: 'Marketing' },
  { label: 'Content Marketing', value: 'content-marketing', category: 'Marketing' },
  { label: 'Social Media Marketing', value: 'social-media-marketing', category: 'Marketing' },
  { label: 'Email Marketing', value: 'email-marketing', category: 'Marketing' },
  { label: 'Google Analytics', value: 'google-analytics', category: 'Marketing' },
  { label: 'Marketing Analytics', value: 'marketing-analytics', category: 'Marketing' },
  { label: 'Brand Management', value: 'brand-management', category: 'Marketing' },
  { label: 'Market Research', value: 'market-research', category: 'Marketing' },
  { label: 'Campaign Management', value: 'campaign-management', category: 'Marketing' },
  { label: 'PPC Advertising', value: 'ppc-advertising', category: 'Marketing' },
  { label: 'Influencer Marketing', value: 'influencer-marketing', category: 'Marketing' },
  { label: 'Public Relations', value: 'public-relations', category: 'Marketing' },
  { label: 'Copywriting', value: 'copywriting', category: 'Marketing' },
  { label: 'Event Marketing', value: 'event-marketing', category: 'Marketing' },
  { label: 'Marketing Automation', value: 'marketing-automation', category: 'Marketing' },
  { label: 'HubSpot', value: 'hubspot', category: 'Marketing' },
  { label: 'SEM', value: 'sem', category: 'Marketing' },

  // Soft Skills
  { label: 'Communication', value: 'communication', category: 'Soft Skills' },
  { label: 'Leadership', value: 'leadership', category: 'Soft Skills' },
  { label: 'Problem Solving', value: 'problem-solving', category: 'Soft Skills' },
  { label: 'Time Management', value: 'time-management', category: 'Soft Skills' },
  { label: 'Teamwork', value: 'teamwork', category: 'Soft Skills' },
  { label: 'Critical Thinking', value: 'critical-thinking', category: 'Soft Skills' },
  { label: 'Adaptability', value: 'adaptability', category: 'Soft Skills' },
  { label: 'Creativity', value: 'creativity', category: 'Soft Skills' },
  { label: 'Emotional Intelligence', value: 'emotional-intelligence', category: 'Soft Skills' },
  { label: 'Negotiation', value: 'negotiation', category: 'Soft Skills' },
  { label: 'Conflict Resolution', value: 'conflict-resolution', category: 'Soft Skills' },
  { label: 'Decision Making', value: 'decision-making', category: 'Soft Skills' },
  { label: 'Stress Management', value: 'stress-management', category: 'Soft Skills' },
  { label: 'Presentation Skills', value: 'presentation-skills', category: 'Soft Skills' },
  { label: 'Empathy', value: 'empathy', category: 'Soft Skills' },
  { label: 'Attention to Detail', value: 'attention-to-detail', category: 'Soft Skills' },

  // Healthcare
  { label: 'Patient Care', value: 'patient-care', category: 'Healthcare' },
  { label: 'Medical Billing', value: 'medical-billing', category: 'Healthcare' },
  { label: 'Clinical Research', value: 'clinical-research', category: 'Healthcare' },
  { label: 'Healthcare Informatics', value: 'healthcare-informatics', category: 'Healthcare' },
  { label: 'Nursing', value: 'nursing', category: 'Healthcare' },
  { label: 'Pharmacy Management', value: 'pharmacy-management', category: 'Healthcare' },
  { label: 'HIPAA Compliance', value: 'hipaa-compliance', category: 'Healthcare' },
  { label: 'Surgical Assistance', value: 'surgical-assistance', category: 'Healthcare' },
  { label: 'Diagnostic Testing', value: 'diagnostic-testing', category: 'Healthcare' },
  { label: 'Public Health', value: 'public-health', category: 'Healthcare' },
  { label: 'EMR Systems', value: 'emr-systems', category: 'Healthcare' },
  { label: 'Medical Coding', value: 'medical-coding', category: 'Healthcare' },
  { label: 'Physical Therapy', value: 'physical-therapy', category: 'Healthcare' },

  // Finance
  { label: 'Financial Analysis', value: 'financial-analysis', category: 'Finance' },
  { label: 'Accounting', value: 'accounting', category: 'Finance' },
  { label: 'Tax Preparation', value: 'tax-preparation', category: 'Finance' },
  { label: 'Investment Management', value: 'investment-management', category: 'Finance' },
  { label: 'Risk Assessment', value: 'risk-assessment', category: 'Finance' },
  { label: 'Budget Forecasting', value: 'budget-forecasting', category: 'Finance' },
  { label: 'QuickBooks', value: 'quickbooks', category: 'Finance' },
  { label: 'Auditing', value: 'auditing', category: 'Finance' },
  { label: 'Financial Modeling', value: 'financial-modeling', category: 'Finance' },
  { label: 'Blockchain', value: 'blockchain', category: 'Finance' },
  { label: 'SAP', value: 'sap', category: 'Finance' },
  { label: 'Cost Accounting', value: 'cost-accounting', category: 'Finance' },
  { label: 'Payroll Management', value: 'payroll-management', category: 'Finance' },

  // Education
  { label: 'Curriculum Development', value: 'curriculum-development', category: 'Education' },
  { label: 'Teaching', value: 'teaching', category: 'Education' },
  { label: 'E-Learning', value: 'e-learning', category: 'Education' },
  { label: 'Instructional Design', value: 'instructional-design', category: 'Education' },
  { label: 'Classroom Management', value: 'classroom-management', category: 'Education' },
  { label: 'Educational Technology', value: 'educational-technology', category: 'Education' },
  { label: 'Student Counseling', value: 'student-counseling', category: 'Education' },
  { label: 'Assessment Design', value: 'assessment-design', category: 'Education' },
  { label: 'Special Education', value: 'special-education', category: 'Education' },
  {
    label: 'Learning Management Systems',
    value: 'learning-management-systems',
    category: 'Education',
  },
  { label: 'Pedagogy', value: 'pedagogy', category: 'Education' },

  // Manufacturing
  { label: 'Lean Manufacturing', value: 'lean-manufacturing', category: 'Manufacturing' },
  { label: 'Six Sigma', value: 'six-sigma', category: 'Manufacturing' },
  { label: 'Supply Chain Management', value: 'supply-chain-management', category: 'Manufacturing' },
  { label: 'Quality Control', value: 'quality-control', category: 'Manufacturing' },
  { label: 'CAD/CAM', value: 'cad-cam', category: 'Manufacturing' },
  { label: 'Process Engineering', value: 'process-engineering', category: 'Manufacturing' },
  { label: 'Inventory Management', value: 'inventory-management', category: 'Manufacturing' },
  { label: 'Equipment Maintenance', value: 'equipment-maintenance', category: 'Manufacturing' },
  { label: 'Robotics', value: 'robotics', category: 'Manufacturing' },
  { label: 'Welding', value: 'welding', category: 'Manufacturing' },
  { label: 'CNC Programming', value: 'cnc-programming', category: 'Manufacturing' },

  // Legal
  { label: 'Contract Law', value: 'contract-law', category: 'Legal' },
  { label: 'Legal Research', value: 'legal-research', category: 'Legal' },
  { label: 'Compliance', value: 'compliance', category: 'Legal' },
  { label: 'Litigation Support', value: 'litigation-support', category: 'Legal' },
  { label: 'Intellectual Property', value: 'intellectual-property', category: 'Legal' },
  { label: 'Corporate Law', value: 'corporate-law', category: 'Legal' },
  { label: 'Paralegal Skills', value: 'paralegal-skills', category: 'Legal' },
  { label: 'Legal Writing', value: 'legal-writing', category: 'Legal' },
  { label: 'Mediation', value: 'mediation', category: 'Legal' },
  { label: 'Arbitration', value: 'arbitration', category: 'Legal' },
  { label: 'Case Management', value: 'case-management', category: 'Legal' },

  // Entertainment
  { label: 'Scriptwriting', value: 'scriptwriting', category: 'Entertainment' },
  { label: 'Film Production', value: 'film-production', category: 'Entertainment' },
  { label: 'Sound Design', value: 'sound-design', category: 'Entertainment' },
  { label: 'Acting', value: 'acting', category: 'Entertainment' },
  { label: 'Directing', value: 'directing', category: 'Entertainment' },
  { label: 'Stage Management', value: 'stage-management', category: 'Entertainment' },
  { label: 'Music Production', value: 'music-production', category: 'Entertainment' },
  { label: 'Casting', value: 'casting', category: 'Entertainment' },
  { label: 'Costume Design', value: 'costume-design', category: 'Entertainment' },

  // Customer Service
  { label: 'Customer Support', value: 'customer-support', category: 'Customer Service' },
  { label: 'CRM Software', value: 'crm-software', category: 'Customer Service' },
  {
    label: 'Conflict De-escalation',
    value: 'conflict-de-escalation',
    category: 'Customer Service',
  },
  { label: 'Technical Support', value: 'technical-support', category: 'Customer Service' },
  { label: 'Salesforce', value: 'salesforce', category: 'Customer Service' },
  {
    label: 'Call Center Operations',
    value: 'call-center-operations',
    category: 'Customer Service',
  },
  { label: 'Zendesk', value: 'zendesk', category: 'Customer Service' },
  { label: 'Live Chat Support', value: 'live-chat-support', category: 'Customer Service' },

  // Office & Administrative
  { label: 'Microsoft Office', value: 'microsoft-office', category: 'Office & Administrative' },
  { label: 'Microsoft Word', value: 'microsoft-word', category: 'Office & Administrative' },
  { label: 'Microsoft Excel', value: 'microsoft-excel', category: 'Office & Administrative' },
  {
    label: 'Microsoft PowerPoint',
    value: 'microsoft-powerpoint',
    category: 'Office & Administrative',
  },
  { label: 'Microsoft Outlook', value: 'microsoft-outlook', category: 'Office & Administrative' },
  { label: 'Data Entry', value: 'data-entry', category: 'Office & Administrative' },
  { label: 'Scheduling', value: 'scheduling', category: 'Office & Administrative' },
  { label: 'Office Management', value: 'office-management', category: 'Office & Administrative' },
  { label: 'Google Workspace', value: 'google-workspace', category: 'Office & Administrative' },
  {
    label: 'Document Management',
    value: 'document-management',
    category: 'Office & Administrative',
  },
  { label: 'Typing', value: 'typing', category: 'Office & Administrative' },
  { label: 'Bookkeeping', value: 'bookkeeping', category: 'Office & Administrative' },

  // Sales
  { label: 'Sales Strategy', value: 'sales-strategy', category: 'Sales' },
  { label: 'Cold Calling', value: 'cold-calling', category: 'Sales' },
  { label: 'Lead Generation', value: 'lead-generation', category: 'Sales' },
  { label: 'CRM Management', value: 'crm-management', category: 'Sales' },
  { label: 'Negotiation', value: 'negotiation-sales', category: 'Sales' },
  { label: 'Account Management', value: 'account-management', category: 'Sales' },
  { label: 'Retail Sales', value: 'retail-sales', category: 'Sales' },
  { label: 'B2B Sales', value: 'b2b-sales', category: 'Sales' },
  { label: 'B2C Sales', value: 'b2c-sales', category: 'Sales' },
];

export function filterSkills(searchTerm: string): Skill[] {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return [];

  const exactLabelMatches = skills.filter((skill) => skill.label.toLowerCase().startsWith(term));
  if (exactLabelMatches.length > 0) {
    return exactLabelMatches;
  }

  const wordMatches = skills.filter((skill) =>
    skill.label
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(term))
  );
  if (wordMatches.length > 0) {
    return wordMatches;
  }

  return skills.filter((skill) => skill.category.toLowerCase().includes(term));
}

export function getSkillCategories(): string[] {
  return Array.from(new Set(skills.map((skill) => skill.category)));
}
