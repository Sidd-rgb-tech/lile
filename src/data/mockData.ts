import { AwarenessCategory, Challenge, Badge, Campaign, ImpactStory, UserProfile, ImpactRecord } from '../types';

export const ALL_CATEGORIES: AwarenessCategory[] = [
  'Environment & Sustainability',
  'Waste Management & Recycling',
  'Climate & Conservation',
  'Education & Literacy',
  'Equality & Inclusion',
  'Digital Literacy & Safety',
  'Cyberbullying Awareness',
  'Road Safety',
  'Community Service & Volunteering',
  'Physical Health & Habits',
  'Mental Well-being & Stress',
  "Women's Safety & Health",
  'Child Safety & Protection',
  'Civic Responsibility',
  'Animal Welfare',
  'Disaster Preparedness',
  'Responsible Technology Use',
  'Public Health Awareness',
  'Financial Literacy & Consumption',
  'School & Community Improvement'
];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'local_demo_user',
  displayName: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  isGuestMode: false,
  isGoogleUser: true,
  isOnboardingCompleted: true,
  dailyTargetMinutes: 15,
  preferredPosterVibe: 'Vibrant Modern',
  totalPoints: 165,
  currentStreakDays: 3,
  lastActiveDate: Date.now() - 3600000,
  selectedCauses: [
    'Environment & Sustainability',
    'Waste Management & Recycling',
    'Digital Literacy & Safety',
    'Road Safety'
  ],
  notificationsEnabled: true,
  isDarkMode: false
};

export const INITIAL_IMPACT_RECORDS: ImpactRecord[] = [
  {
    id: 'rec-1',
    title: 'Digital Privacy & 2FA Setup',
    category: 'Digital Literacy & Safety',
    proofTier: 'LEARNING_COMPLETED',
    pointsEarned: 50,
    timestamp: Date.now() - 86400000 * 2,
    notes: 'Configured 2-factor authentication and revoked unused OAuth apps.'
  },
  {
    id: 'rec-2',
    title: 'Single-Use Plastic Refusal Day',
    category: 'Waste Management & Recycling',
    proofTier: 'SELF_REPORTED_ACTION',
    pointsEarned: 45,
    timestamp: Date.now() - 86400000,
    notes: 'Carried personal stainless steel bottle and lunch container.'
  },
  {
    id: 'rec-3',
    title: 'School Crosswalk Safety Monitoring',
    category: 'Road Safety',
    proofTier: 'VERIFIED_ACTIVITY',
    pointsEarned: 70,
    timestamp: Date.now() - 3600000 * 4,
    notes: 'Assisted morning junior crossing with campus safety monitor.'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed your very first social awareness action or quiz',
    icon: 'Sparkles',
    category: 'General',
    isUnlocked: true,
    unlockedDate: Date.now() - 86400000 * 2,
    progress: 1.0
  },
  {
    id: 'learning_explorer',
    title: 'Learning Explorer',
    description: 'Finished 3 educational quizzes across different awareness areas',
    icon: 'GraduationCap',
    category: 'Education',
    isUnlocked: true,
    unlockedDate: Date.now() - 86400000,
    progress: 1.0
  },
  {
    id: 'eco_champion',
    title: 'Eco Champion',
    description: 'Completed 3 sustainability or waste reduction challenges',
    icon: 'Leaf',
    category: 'Environment',
    isUnlocked: false,
    progress: 0.66
  },
  {
    id: 'digital_advocate',
    title: 'Digital Safety Advocate',
    description: 'Completed digital security and cyberbullying awareness activities',
    icon: 'Shield',
    category: 'Digital',
    isUnlocked: true,
    unlockedDate: Date.now() - 86400000 * 2,
    progress: 1.0
  },
  {
    id: 'community_helper',
    title: 'Community Helper',
    description: 'Logged verified volunteer participation in local civic action',
    icon: 'HeartHandshake',
    category: 'Community',
    isUnlocked: false,
    progress: 0.5
  },
  {
    id: 'healthy_habits',
    title: 'Healthy Habits',
    description: 'Maintained physical routines and mindfulness for 5 days',
    icon: 'Activity',
    category: 'Health',
    isUnlocked: false,
    progress: 0.4
  },
  {
    id: 'awareness_creator',
    title: 'Awareness Creator',
    description: 'Designed and exported a high-impact social awareness poster',
    icon: 'Palette',
    category: 'Creative',
    isUnlocked: false,
    progress: 0.0
  },
  {
    id: 'campaign_contributor',
    title: 'Campaign Contributor',
    description: 'Participated in a school, workplace, or neighbourhood campaign',
    icon: 'Megaphone',
    category: 'Campaign',
    isUnlocked: false,
    progress: 0.0
  },
  {
    id: 'seven_day_streak',
    title: 'Seven-Day Streak',
    description: 'Logged positive awareness activities for 7 consecutive days',
    icon: 'Flame',
    category: 'Consistency',
    isUnlocked: false,
    progress: 0.43
  },
  {
    id: 'positive_change_champion',
    title: 'Positive Change Champion',
    description: 'Earned 500+ points and completed actions in at least 5 categories',
    icon: 'Trophy',
    category: 'Mastery',
    isUnlocked: false,
    progress: 0.33
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  // 1. Waste Management & Recycling
  {
    id: 'ch_waste_01',
    title: 'Zero-Waste Campus / Office Day',
    category: 'Waste Management & Recycling',
    difficulty: 'EASY',
    estimatedDurationMinutes: 30,
    shortDescription: 'Audit personal single-use plastics for 24 hours and commit to reusable swaps.',
    learningObjective: 'Understand packaging lifecycle and prevent single-use microplastics from entering municipal waste streams.',
    instructions: '1. Carry a refillable container and cloth tote bag.\n2. Decline plastic cutlery, disposable cups, and plastic wrappers.\n3. Take a quick photo of your reusable kit and record your reflection notes.',
    expectedOutcome: 'Prevented minimum 3 items of single-use plastic waste.',
    points: 45,
    status: 'COMPLETED',
    completionDate: Date.now() - 86400000,
    reflectionNotes: 'Used personal tumbler for coffee and packed lunch in reusable glass box.',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: true
  },
  // 2. Environment & Sustainability
  {
    id: 'ch_env_01',
    title: 'Document 3 Native Urban Plants',
    category: 'Environment & Sustainability',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 40,
    shortDescription: 'Explore your local park or neighbourhood to identify 3 native trees or pollinator plants.',
    learningObjective: 'Discover how native biodiversity supports urban cooling, bird life, and groundwater retention.',
    instructions: '1. Walk a 500-meter radius around your home or school.\n2. Locate 3 indigenous plant or tree varieties.\n3. Note their flowering stage and shade contribution in your reflection.',
    expectedOutcome: 'Identified 3 local native plant species.',
    points: 55,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 3. Climate & Conservation
  {
    id: 'ch_climate_01',
    title: 'Home Standby Power Audit',
    category: 'Climate & Conservation',
    difficulty: 'EASY',
    estimatedDurationMinutes: 20,
    shortDescription: 'Hunt down "vampire power" devices running on continuous standby mode.',
    learningObjective: 'Understand domestic electricity wastage and simple conservation tactics.',
    instructions: '1. Check televisions, microwave clocks, console chargers, and computer monitors.\n2. Switch off power strips when not in active use.\n3. Note estimated watts saved.',
    expectedOutcome: 'Eliminated unnecessary domestic phantom electricity draw.',
    points: 40,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 4. Digital Literacy & Safety
  {
    id: 'ch_digital_01',
    title: 'Account Privacy & 2FA Fortress',
    category: 'Digital Literacy & Safety',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 25,
    shortDescription: 'Audit primary email and social accounts to activate multi-factor authentication.',
    learningObjective: 'Prevent credential stuffing and account hijacking attacks.',
    instructions: '1. Open Google / email security dashboard.\n2. Turn on Authenticator 2FA.\n3. Review active device logins and terminate unfamiliar sessions.',
    expectedOutcome: 'Secured primary personal account with 2FA.',
    points: 50,
    status: 'COMPLETED',
    completionDate: Date.now() - 86400000 * 2,
    reflectionNotes: 'Enabled Google Authenticator and closed 2 legacy sessions.',
    proofTier: 'LEARNING_COMPLETED',
    isPointsAwarded: true
  },
  // 5. Cyberbullying Awareness
  {
    id: 'ch_cyber_01',
    title: 'The Upstander Protocol Checklist',
    category: 'Cyberbullying Awareness',
    difficulty: 'EASY',
    estimatedDurationMinutes: 15,
    shortDescription: 'Learn and commit to the 4 rules of safe digital upstanding when witnessing online toxicity.',
    learningObjective: 'Shift from a passive bystander to an empathetic supporter without escalating hostility.',
    instructions: '1. Read the non-confrontational direct message support template.\n2. Learn how to screenshot and report harassment through platform tools.\n3. Pledge to check in on targeted peers privately.',
    expectedOutcome: 'Mastery of safe digital intervention methods.',
    points: 40,
    status: 'NOT_STARTED',
    proofTier: 'LEARNING_COMPLETED',
    isPointsAwarded: false
  },
  // 6. Road Safety
  {
    id: 'ch_road_01',
    title: 'Distraction-Free Crosswalk Commitment',
    category: 'Road Safety',
    difficulty: 'EASY',
    estimatedDurationMinutes: 10,
    shortDescription: 'Pocket your phone and pause earbuds at every roadway intersection today.',
    learningObjective: 'Eliminate situational blindness and avoid pedestrian collisions.',
    instructions: '1. Put mobile devices away 10 meters before approaching any crosswalk.\n2. Make direct eye contact with approaching drivers before stepping onto the street.\n3. Log your commitment.',
    expectedOutcome: '100% focused crossing behavior.',
    points: 35,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 7. Community Service & Volunteering
  {
    id: 'ch_comm_01',
    title: 'Sidewalk & Park Micro-Litter Cleanup',
    category: 'Community Service & Volunteering',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 35,
    shortDescription: 'Dedicate 30 minutes to collecting discarded litter along a public walking path.',
    learningObjective: 'Foster civic pride and stop litter from washing into storm sewers.',
    instructions: '1. Wear protective gloves and carry a trash bag.\n2. Safely collect plastic bottles, wrappers, and cans.\n3. Dispose of collected waste in proper sorted bins.',
    expectedOutcome: 'Cleaned a 200m stretch of shared civic space.',
    points: 65,
    status: 'NOT_STARTED',
    proofTier: 'VERIFIED_ACTIVITY',
    isPointsAwarded: false
  },
  // 8. Physical Health & Habits
  {
    id: 'ch_health_01',
    title: 'Hourly Desk Ergonomics & Hydration Reset',
    category: 'Physical Health & Habits',
    difficulty: 'EASY',
    estimatedDurationMinutes: 15,
    shortDescription: 'Take 2-minute posture stretches every hour and drink 2 liters of pure water.',
    learningObjective: 'Mitigate prolonged spinal compression and boost mental alertness.',
    instructions: '1. Set an hourly chime or timer.\n2. Stand, roll shoulders backward 10 times, stretch hip flexors.\n3. Drink a cup of water.',
    expectedOutcome: 'Relieved cervical tension and maintained optimal hydration.',
    points: 30,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 9. Mental Well-being & Stress
  {
    id: 'ch_mental_01',
    title: '5-4-3-2-1 Sensory Grounding Practice',
    category: 'Mental Well-being & Stress',
    difficulty: 'EASY',
    estimatedDurationMinutes: 10,
    shortDescription: 'Learn and execute sensory grounding to calm acute academic or work stress.',
    learningObjective: 'Down-regulate autonomic nervous system during stress spikes.',
    instructions: '1. Name 5 things you can see around you.\n2. Name 4 things you can physically feel.\n3. Name 3 things you hear.\n4. Name 2 things you smell.\n5. Name 1 positive thing you taste or appreciate.',
    expectedOutcome: 'Restored emotional baseline and calm breathing.',
    points: 35,
    status: 'NOT_STARTED',
    proofTier: 'LEARNING_COMPLETED',
    isPointsAwarded: false
  },
  // 10. Women's Safety & Health
  {
    id: 'ch_women_01',
    title: 'Respectful Spaces & Boundary Awareness',
    category: "Women's Safety & Health",
    difficulty: 'EASY',
    estimatedDurationMinutes: 20,
    shortDescription: 'Review interpersonal boundary charters and language habits in shared groups.',
    learningObjective: 'Champion an environment where everyone feels respected, valued, and safe.',
    instructions: '1. Read the community communication standards on consent and respect.\n2. Reflect on conversational dynamics in team or peer chats.\n3. Write a 2-sentence reflection on fostering inclusive safety.',
    expectedOutcome: 'Demonstrated commitment to respectful peer culture.',
    points: 45,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 11. Child Safety & Protection
  {
    id: 'ch_child_01',
    title: 'Kid-Safe Online Navigation Checklist',
    category: 'Child Safety & Protection',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 25,
    shortDescription: 'Review search filters and privacy safeguards on devices used by younger students or siblings.',
    learningObjective: 'Protect younger learners from age-inappropriate content and predatory interactions.',
    instructions: '1. Enable SafeSearch in Google and YouTube Restricted Mode.\n2. Teach a younger family member or mentee the rule never to share location or real names online.\n3. Record your verification notes.',
    expectedOutcome: 'Secured household digital environment for minors.',
    points: 50,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 12. Civic Responsibility
  {
    id: 'ch_civic_01',
    title: 'Municipal Civic Issue Reporting',
    category: 'Civic Responsibility',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 30,
    shortDescription: 'Locate your local city/municipal grievance portal and report a civic repair need.',
    learningObjective: 'Practice participatory democracy by reporting broken lights, potholes, or blocked storm drains.',
    instructions: '1. Download or open your local city authority app/portal.\n2. Photograph a public maintenance issue (e.g. broken sign, damaged sidewalk).\n3. Submit an official ticket and record the confirmation number.',
    expectedOutcome: 'Submitted a legitimate municipal repair request.',
    points: 60,
    status: 'NOT_STARTED',
    proofTier: 'MEASURED_OUTCOME',
    isPointsAwarded: false
  },
  // 13. Animal Welfare
  {
    id: 'ch_animal_01',
    title: 'Outdoor Hydration Bowl for Birds & Wildlife',
    category: 'Animal Welfare',
    difficulty: 'EASY',
    estimatedDurationMinutes: 15,
    shortDescription: 'Place a clean, shallow water basin in a shaded outdoor spot for urban wildlife.',
    learningObjective: 'Support urban fauna during warm weather and promote compassionate coexistence.',
    instructions: '1. Clean a shallow clay or ceramic dish.\n2. Place in a shaded, safe balcony or garden spot away from predators.\n3. Commit to refilling fresh water daily for 3 days.',
    expectedOutcome: 'Maintained wildlife hydration spot.',
    points: 40,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 14. Disaster Preparedness
  {
    id: 'ch_disaster_01',
    title: 'Emergency Contact Card & Torch Check',
    category: 'Disaster Preparedness',
    difficulty: 'EASY',
    estimatedDurationMinutes: 20,
    shortDescription: 'Create a physical emergency numbers wallet card and test emergency flashlights.',
    learningObjective: 'Ensure communication preparedness during cellular grid or power outages.',
    instructions: '1. Write emergency contacts (family, local medical, emergency services) on a sturdy card.\n2. Keep it in your wallet.\n3. Test household emergency flashlights and spare batteries.',
    expectedOutcome: 'Physical contingency contact system in place.',
    points: 40,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 15. Responsible Technology Use
  {
    id: 'ch_tech_01',
    title: 'Digital Sunset & Screen Curfew',
    category: 'Responsible Technology Use',
    difficulty: 'EASY',
    estimatedDurationMinutes: 15,
    shortDescription: 'Set a 1-hour screen curfew before bedtime and disable non-essential app alerts.',
    learningObjective: 'Reclaim sleep quality and cognitive autonomy from attention-economy algorithms.',
    instructions: '1. Put phone on "Do Not Disturb" 60 minutes before scheduled sleep.\n2. Read a physical book or listen to calming audio instead.\n3. Log morning restedness level.',
    expectedOutcome: 'Experienced restorative phone-free evening.',
    points: 35,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 16. Public Health Awareness
  {
    id: 'ch_pubhealth_01',
    title: 'Proper Hand Hygiene & Sanitization Drill',
    category: 'Public Health Awareness',
    difficulty: 'EASY',
    estimatedDurationMinutes: 10,
    shortDescription: 'Review and execute the WHO 20-second hand hygiene technique.',
    learningObjective: 'Break transmission chains for seasonal influenza and foodborne pathogens.',
    instructions: '1. Follow the 6-step WHO technique: palms, interlaced fingers, knuckles, thumbs, and wrists.\n2. Practice with soap and warm water for at least 20 seconds.\n3. Teach technique to one friend or family member.',
    expectedOutcome: 'Reinforced gold-standard personal sanitization routine.',
    points: 30,
    status: 'NOT_STARTED',
    proofTier: 'LEARNING_COMPLETED',
    isPointsAwarded: false
  },
  // 17. Financial Literacy & Consumption
  {
    id: 'ch_finance_01',
    title: 'The 48-Hour Impulse Purchase Pause',
    category: 'Financial Literacy & Consumption',
    difficulty: 'EASY',
    estimatedDurationMinutes: 15,
    shortDescription: 'Commit to holding any non-essential online checkout in wishlist for 48 hours.',
    learningObjective: 'Cultivate mindful financial habits and decrease consumer packaging waste.',
    instructions: '1. Move any discretionary cart items to a "Wait 48h" wishlist.\n2. Re-evaluate after two days if the item is genuinely required.\n3. Reflect on emotional vs functional buying triggers.',
    expectedOutcome: 'Prevented wasteful impulse purchasing.',
    points: 40,
    status: 'NOT_STARTED',
    proofTier: 'SELF_REPORTED_ACTION',
    isPointsAwarded: false
  },
  // 18. School & Community Improvement
  {
    id: 'ch_school_01',
    title: 'Textbook & Study Material Book Drive',
    category: 'School & Community Improvement',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 30,
    shortDescription: 'Gather gently used textbooks or reading books to donate to junior learners or library.',
    learningObjective: 'Promote circular educational resources and support peer learning equity.',
    instructions: '1. Gather 2 or more complete study books or classic novels in good condition.\n2. Pass them to a school library, community free-library box, or junior student.\n3. Record who benefited.',
    expectedOutcome: 'Extended useful life of educational materials.',
    points: 55,
    status: 'NOT_STARTED',
    proofTier: 'VERIFIED_ACTIVITY',
    isPointsAwarded: false
  },
  // 19. Equality & Inclusion
  {
    id: 'ch_equality_01',
    title: 'Accessibility & Barrier Audit Walkthrough',
    category: 'Equality & Inclusion',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 25,
    shortDescription: 'Examine school or workplace routes from the perspective of someone with mobility limitations.',
    learningObjective: 'Understand physical and sensory barriers experienced by persons with disabilities.',
    instructions: '1. Walk main entrances, corridors, and restrooms.\n2. Check for wheelchair ramp slopes, tactile pathways, automatic doors, and braille signage.\n3. Document any hazardous obstacles.',
    expectedOutcome: 'Identified concrete accessibility improvement opportunities.',
    points: 50,
    status: 'NOT_STARTED',
    proofTier: 'LEARNING_COMPLETED',
    isPointsAwarded: false
  },
  // 20. Education & Literacy
  {
    id: 'ch_edu_01',
    title: 'Peer Mentoring 30-Minute Knowledge Share',
    category: 'Education & Literacy',
    difficulty: 'MEDIUM',
    estimatedDurationMinutes: 35,
    shortDescription: 'Spend 30 minutes helping a classmate or younger peer master a difficult topic.',
    learningObjective: 'Strengthen collaborative study habits and community academic confidence.',
    instructions: '1. Choose a subject you are confident in (math, grammar, coding, or science).\n2. Coach a peer with patience, asking guiding questions rather than doing it for them.\n3. Summarize key takeaways together.',
    expectedOutcome: 'Helped a peer overcome an academic hurdle.',
    points: 60,
    status: 'NOT_STARTED',
    proofTier: 'VERIFIED_ACTIVITY',
    isPointsAwarded: false
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'City-Wide Plastic-Free Campus Drive',
    category: 'Waste Management & Recycling',
    description: 'Schools and colleges unite to eliminate single-use beverage containers, promote refill stations, and run weekly waste audits.',
    objectives: [
      'Eliminate 10,000 single-use plastic bottles across campuses',
      'Install 25 clean filtered water refill stations',
      'Achieve 80% reusable container adoption in cafeterias'
    ],
    durationText: 'Active • 12 days remaining',
    participantCount: 428,
    isJoined: true,
    suggestedActions: [
      'Carry your own reusable bottle daily',
      'Organize a canteen packaging audit',
      'Create and display a CHANGE360 campaign poster'
    ]
  },
  {
    id: 'camp-2',
    title: 'Safe Crossings & Vision Zero Initiative',
    category: 'Road Safety',
    description: 'Community-led effort to audit school crosswalks, educate pedestrians against phone distractions, and petition for traffic calming measures.',
    objectives: [
      'Audit 30 high-traffic crosswalks near schools',
      'Distribute 500 reflective bag tags to young students',
      'Achieve zero pedestrian close-calls near school gates'
    ],
    durationText: 'Active • 18 days remaining',
    participantCount: 265,
    isJoined: false,
    suggestedActions: [
      'Practice distraction-free road crossing',
      'Report faded crosswalk markings to city authorities',
      'Advocate for pedestrian speed-bumps'
    ]
  },
  {
    id: 'camp-3',
    title: 'Digital Upstanders Anti-Bullying Week',
    category: 'Cyberbullying Awareness',
    description: 'A nationwide student campaign empowering young people to support peers facing harassment, report toxic content, and build kind digital spaces.',
    objectives: [
      'Train 1,000 digital upstanders in safe intervention',
      'Reach 50 participating high schools and colleges',
      'Publish 200 student-designed positive awareness posters'
    ],
    durationText: 'Starts in 4 days • 1-week intensive',
    participantCount: 612,
    isJoined: false,
    suggestedActions: [
      'Take the Upstander Protocol learning challenge',
      'Send a supportive direct message to a peer',
      'Share digital kindness guidelines'
    ]
  },
  {
    id: 'camp-4',
    title: 'Community Tree Canopy & Native Flora Drive',
    category: 'Environment & Sustainability',
    description: 'Greening urban concrete heat islands by mapping existing trees, planting native pollinators, and setting up residential watering rotations.',
    objectives: [
      'Plant and register 150 native shade trees',
      'Document 50 urban green micro-corridors',
      'Engage 30 neighbourhood volunteer waterers'
    ],
    durationText: 'Spring Season • 45 days remaining',
    participantCount: 310,
    isJoined: false,
    suggestedActions: [
      'Adopt and water a street sapling near your home',
      'Plant pollinator-friendly wildflowers in balcony boxes',
      'Log native plant species in CHANGE360'
    ]
  }
];

export const INITIAL_STORIES: ImpactStory[] = [
  {
    id: 'story-1',
    title: 'How Oakridge High Replaced 15,000 Disposable Cups in One Semester',
    category: 'Waste Management & Recycling',
    summary: 'A group of 8 high school sophomores turned their environmental science project into a campus-wide policy that eliminated disposable cafeteria cups.',
    actionTaken: 'They installed 4 sensor-activated water dispensers, ran an impact poster campaign, and partnered with the alumni association to provide free insulated tumblers to all students.',
    lessonsLearned: 'Behavior change requires reducing friction: when refilling is faster and cooler than buying single-use bottles, everyone participates naturally.',
    suggestedActionForReader: 'Audit your classroom or workplace hydration options and propose a reusable tumbler initiative.',
    isFavorited: true,
    relatedChallengeId: 'ch_waste_01'
  },
  {
    id: 'story-2',
    title: 'Senior Scam Defense: Teen Volunteers Coach 120 Grandparents',
    category: 'Digital Literacy & Safety',
    summary: 'High school computer club members hosted Saturday morning drop-in clinics at the community center to protect elders from phishing and SMS fraud.',
    actionTaken: 'Volunteers set up call filters, walked seniors through recognizing fake banking texts, and provided laminated emergency contact cards.',
    lessonsLearned: 'Patience and non-judgmental respect are the best defense. Seniors often hesitate to report scams out of embarrassment; creating a safe space changed everything.',
    suggestedActionForReader: 'Spend 20 minutes with an older relative today reviewing their phone security settings and scam awareness.',
    isFavorited: false,
    relatedChallengeId: 'ch_digital_01'
  },
  {
    id: 'story-3',
    title: 'Safe Sidewalks: How 15 Students Got a Dangerous Crosswalk Repaired',
    category: 'Civic Responsibility',
    summary: 'After witnessing multiple near-misses near their bus stop, students systematically documented the intersection and filed an official municipal report.',
    actionTaken: 'They collected photo evidence, recorded vehicle speeds during morning rush, and submitted a formal petition through their city council portal.',
    lessonsLearned: 'Official civic channels work when submissions are objective, data-backed, and respectful. The city installed new LED crossing beacons within 6 weeks.',
    suggestedActionForReader: 'Identify a hazardous infrastructure problem in your area and report it through official municipal channels.',
    isFavorited: false,
    relatedChallengeId: 'ch_civic_01'
  },
  {
    id: 'story-4',
    title: 'The Exam Season Mindful Breathing Pod',
    category: 'Mental Well-being & Stress',
    summary: 'To counter acute finals anxiety, student peer leaders set up a quiet sensory recharge corner in the library with guided 5-4-3-2-1 breathing cards.',
    actionTaken: 'Over 400 students used the quiet pod during exam week to reset their heart rates and rest without smartphone stimulation.',
    lessonsLearned: 'Normalizing stress management transforms school culture. Micro-breaks improve exam focus far more than non-stop cramming.',
    suggestedActionForReader: 'Take 5 minutes today to practice sensory grounding before your next intense study or work session.',
    isFavorited: true,
    relatedChallengeId: 'ch_mental_01'
  }
];
