// SkillBridge AI - Technical Mock AI Service Layer

const TECH_SKILLS = [
  'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'Tailwind CSS',
  'Python', 'TensorFlow', 'PyTorch', 'Kubernetes', 'Docker', 'AWS', 'Rust', 'Go',
  'Next.js', 'PostgreSQL', 'GraphQL', 'Redis', 'CI/CD', 'Git', 'Agile'
];

const TARGET_ROLES = {
  'NEURAL_ARCHITECT': {
    required: ['React', 'Rust', 'Python', 'TensorFlow', 'Docker', 'Kubernetes'],
    description: 'Build neural models and high-performance React user interfaces for digital intelligence.'
  },
  'SENIOR_NODE_ENGINEER': {
    required: ['Node.js', 'Express', 'MongoDB', 'Redis', 'TypeScript', 'Docker'],
    description: 'Scale high-density backend systems and data stream buffers.'
  },
  'SYSTEM_REDACTOR': {
    required: ['TypeScript', 'Next.js', 'PostgreSQL', 'GraphQL', 'AWS'],
    description: 'Architect frontend platforms and microservice integrations.'
  }
};

export const analyzeResume = (fileName, textContent = '') => {
  // Simple keyword matching to simulate ATS parsing
  const words = textContent.toLowerCase().split(/\W+/);
  const detectedSkills = [];

  TECH_SKILLS.forEach(skill => {
    if (textContent.toLowerCase().includes(skill.toLowerCase()) || words.includes(skill.toLowerCase())) {
      detectedSkills.push(skill);
    }
  });

  // If no skills detected, assign 3 random ones to make the mock responsive
  if (detectedSkills.length === 0) {
    const shuffled = [...TECH_SKILLS].sort(() => 0.5 - Math.random());
    detectedSkills.push(...shuffled.slice(0, 4));
  }

  // Calculate ATS Score
  const baseScore = 60;
  const skillPoints = Math.min(30, detectedSkills.length * 7);
  const formattingPoints = Math.floor(Math.random() * 10);
  const atsScore = Math.min(99, baseScore + skillPoints + formattingPoints);

  // Formatting Checklist
  const pdfValidation = atsScore > 75 ? 'VALID' : 'WARNING';
  const fontCompatibility = atsScore > 80 ? 'OPTIMIZED' : 'COMPATIBLE';
  const structuralScan = atsScore > 70 ? 'SUCCESS' : 'WARNING';

  // Recommendations/Suggestions
  const allSuggestions = [
    'Expand your experience section with quantitative metrics (e.g. Optimized buffer pools leading to 15% latency reduction).',
    'Increase density of keywords related to neural network orchestration or cloud architectures.',
    'Replace non-standard fonts with standard web-compatible sans-serif typography.',
    'Add an explicit modules overview indicating your experience with high-performance JS frameworks.',
    'Refine formatting margins to prevent layout overflow on dual-column ATS rendering sweeps.'
  ];

  // Pick 3 suggestions randomly
  const suggestions = allSuggestions.sort(() => 0.5 - Math.random()).slice(0, 3);

  return {
    fileName,
    atsScore,
    skillsDetected: detectedSkills,
    formattingIntegrity: {
      pdfValidation,
      fontCompatibility,
      structuralScan,
    },
    keywordMap: detectedSkills,
    suggestions,
  };
};

export const detectSkillGap = (userSkills = []) => {
  const matrix = {};
  
  Object.keys(TARGET_ROLES).forEach(role => {
    const roleData = TARGET_ROLES[role];
    const missing = roleData.required.filter(skill => !userSkills.includes(skill));
    const matchCount = roleData.required.length - missing.length;
    const matchPercentage = Math.round((matchCount / roleData.required.length) * 100);

    matrix[role] = {
      role,
      matchPercentage,
      missingSkills: missing,
      requiredSkills: roleData.required,
      description: roleData.description
    };
  });

  return matrix;
};

export const generateRoadmap = (userId, currentSkills = []) => {
  const gapData = detectSkillGap(currentSkills);
  // Find the role with the highest match that is not 100% to generate a roadmap for, or fallback to Neural Architect
  let targetRole = 'NEURAL_ARCHITECT';
  let bestMatch = -1;

  Object.keys(gapData).forEach(role => {
    if (gapData[role].matchPercentage > bestMatch && gapData[role].matchPercentage < 100) {
      bestMatch = gapData[role].matchPercentage;
      targetRole = role;
    }
  });

  const missingSkills = gapData[targetRole].missingSkills;
  const steps = [];

  // Always generate at least 3 steps
  const skillsToLearn = missingSkills.length > 0 ? missingSkills : ['Rust Core', 'Vector DB', 'CI/CD pipeline'];
  
  skillsToLearn.forEach((skill, index) => {
    steps.push({
      name: `MASTER_${skill.toUpperCase().replace(/\s+/g, '_')}`,
      estComp: `${(index + 1) * 14}H`,
      status: index === 0 ? 'active' : 'locked',
      description: `Complete deep-dive learning modules and build a prototype project implementing ${skill}.`,
    });
  });

  // Add a final project step
  steps.push({
    name: `DEPLOY_${targetRole}_CAPSTONE_PROJECT`,
    estComp: '48H',
    status: 'locked',
    description: `Deploy a production-grade MERN system incorporating all newly acquired ${targetRole.toLowerCase()} competencies.`,
  });

  return {
    userId,
    title: `${targetRole.replace(/_/g, ' ')} ACCELERATION PATH`,
    steps,
  };
};

export const generateInterviewQuestions = () => {
  return [
    {
      id: 1,
      text: 'How would you approach scaling our neural pipeline while maintaining sub-100ms latency for architectural-level synthesis?',
      tips: 'Mention caching layers, distributed buffers, and asynchronous tasks workflows.'
    },
    {
      id: 2,
      text: 'Describe the latency implications of implementing a distributed shard-manager versus a single shared memory store.',
      tips: 'Contrast network roundtrips, CPU cache coherence, and database horizontal scaling.'
    },
    {
      id: 3,
      text: 'How do you optimize React rendering performance in high-frequency data streaming dashboards?',
      tips: 'Mention memoization (useMemo, useCallback), virtualization, and custom throttled hooks.'
    }
  ];
};

export const evaluateInterviewAnswer = (questionIndex, answerText = '') => {
  const wordCount = answerText.trim().split(/\s+/).length;
  
  // Calculate vitals dynamically based on length and key terms
  let confidenceVal = 70 + Math.floor(Math.random() * 20);
  let clarityVal = 65 + Math.floor(Math.random() * 25);
  let contentIndexVal = 50 + Math.floor(Math.random() * 40);

  const keywords = ['shard', 'cache', 'buffer', 'react', 'rendering', 'virtualization', 'memo', 'scale', 'async'];
  let matched = 0;
  keywords.forEach(kw => {
    if (answerText.toLowerCase().includes(kw)) {
      matched += 1;
    }
  });

  contentIndexVal = Math.min(99, contentIndexVal + matched * 8);
  clarityVal = Math.min(99, clarityVal + Math.min(10, wordCount / 5));

  const insights = matched > 0 
    ? `STRONG TECHNICAL FOUNDATION. User utilized key concepts: ${keywords.filter(kw => answerText.toLowerCase().includes(kw)).join(', ')}.`
    : `AWAITING TECHNICAL DEPTH. Suggest elaborating on architectural components and cache strategies.`;

  return {
    vitals: {
      clarity: clarityVal,
      confidence: confidenceVal,
      contentIndex: contentIndexVal,
    },
    annotation: matched > 0 ? 'TECH_KEYWORD_MATCH' : 'WAITING_FOR_TECHNICAL_TERMS',
    insights,
  };
};
