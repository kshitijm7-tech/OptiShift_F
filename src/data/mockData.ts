import {
  BusinessConfig,
  Employee,
  LeaveRequest,
  PastLeaveRecord,
  RulesConfig,
  ShiftCellData,
  ShiftDefinition
} from '../types';

export const INITIAL_BUSINESS: BusinessConfig = {
  name: 'UrbanBrew Café',
  type: 'Café & Specialty Coffee',
  location: 'Bandra West, Mumbai Outlet',
  currency: '₹ INR',
  defaultHorizon: '7',
  startOfWeek: 'monday',
  highlightWeekends: true,
  timeFormat: '12h',
  email: 'alex.morgan@urbanbrew.in',
  whatsAppEnabled: true
};

export const SHIFT_DEFINITIONS: ShiftDefinition[] = [
  {
    id: 'morning',
    name: 'Morning Shift',
    timeRange: '7:00 AM – 3:30 PM',
    startTime: '07:00',
    endTime: '15:30',
    durationHours: 8.0,
    minStaff: 3,
    accentColor: '#166534',
    icon: 'wb_sunny',
    subtitle: 'Breakfast & corporate espresso rush'
  },
  {
    id: 'evening',
    name: 'Evening Shift',
    timeRange: '3:00 PM – 11:30 PM',
    startTime: '15:00',
    endTime: '23:30',
    durationHours: 8.0,
    minStaff: 4,
    accentColor: '#1e293b',
    icon: 'nights_stay',
    subtitle: 'After-work crowd, kitchen prep & floor closing'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-priya',
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'Senior Barista',
    isFullTime: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNtUQd78UZHxnDUAqx_34vBVbdFmVVt0dzhEZEQQYQXkZTps36YtdXOby7Kr8L4nkn3WkAPiiu71Oj0Un38Yg4gfCOvAFvqiV8omS_7v5C4DJ_MQpmlUYWzn_W5UyjVX7KWoxD_txSRG7hLg7oJ_Y4UeAfpsp0MOmemmx0ioIjplbPTeuxb0Rh0seq1SqQe4zj2xXjktgVeJQTI2s19Ivoq8CSNgP3-EqD5Wgjx6iq2oproKnGdME3',
    skills: ['Coffee Specialist', 'Latte Art', 'Counter POS'],
    hourlyRate: 260,
    maxWeeklyHours: 40,
    assignedHours: 38,
    availabilityDesc: 'Mon–Fri 9:00 AM – 6:00 PM',
    dayAvailability: {
      0: 'morning',
      1: 'off',
      2: 'evening',
      3: 'morning',
      4: 'morning',
      5: 'morning',
      6: 'off'
    },
    status: 'on_leave',
    leaveNote: 'Pending Friday 18 Oct'
  },
  {
    id: 'emp-rahul',
    name: 'Rahul Patil',
    initials: 'RP',
    role: 'Shift Supervisor',
    isFullTime: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBk5LXLLRZPgYuOJV0rP8zKUg91HQPEDXsdG6KC3b08Vdc3YpSG5yqgRj_nnt6d_XCJt_FC0Lt7Lk8m0D9wES25t96tKSk_EFPAZYQMCszq90j4ZCviMdusGwbWFID9DpuQtBDrdumYRo-xGLG7nVCqYPu4S1ESc9xEMeqnIadTxC0QTdFGCHI0Adu7WbKitmYi66JxVOmNNbh3Mwt5XCByZbdxZXNkybvnwh1vnkkhJNFDaDlWr6g',
    skills: ['Management', 'Inventory', 'Lead Barista'],
    hourlyRate: 280,
    maxWeeklyHours: 40,
    assignedHours: 38.5,
    availabilityDesc: 'Mon–Sat Flexible Coverage',
    dayAvailability: {
      0: 'any',
      1: 'any',
      2: 'any',
      3: 'off',
      4: 'any',
      5: 'any',
      6: 'any'
    },
    status: 'active'
  },
  {
    id: 'emp-aisha',
    name: 'Aisha Khan',
    initials: 'AK',
    role: 'Head Barista',
    isFullTime: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUleyhmHGTRv9EA5MKBxFIDmtkqAad_pyEuEAJjNyYrKXxfq7_-vzI8gYffn-TEoMgL7svjR6GV8zktpkeCetOlDmpQvsIDwoov_ERyltRGyzTqUASHG0nVaLdODYaU7VZeigf-BpeJqLkV5erZw4ZPOGzepNGS1Bj29JBPgNxkSZkRRAaVAOLGC-nyAU7KqvvsE1iNgmJnFWQIylXChr3AfMRgL26cDE3Q3BlpFBG3I20b9huz8VA',
    skills: ['Training', 'Quality Ctrl', 'Specialty Brew'],
    hourlyRate: 270,
    maxWeeklyHours: 40,
    assignedHours: 36,
    availabilityDesc: 'Tue–Sun Flexible Coverage',
    dayAvailability: {
      0: 'morning',
      1: 'morning',
      2: 'off',
      3: 'evening',
      4: 'any',
      5: 'morning',
      6: 'off'
    },
    status: 'active'
  },
  {
    id: 'emp-vikram',
    name: 'Vikram Mehta',
    initials: 'VM',
    role: 'Counter & POS',
    isFullTime: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5ZopGxSPv3nCbrhSYG9NuU9mVqluG3QJMFnKBo0Cz7uRWHASkI5FIzqDbG-yaqgnmyWft7wXmXhS5R_iJP2rHDaVJpG3ITCZczrR2w-9o1T7wbI-XgswTGX6pMAKUPT8yvt8a1k2tgTMWn-d0OlNunDNg-qb8riXRvHIfPZB-chmEUsXZua7qGJ0RLpl1xh8HAVt_OoJbIw8P7aKeEIHFpMwu-eZMtCF5LRSm7Y3MAlRNtIxk5Lpb',
    skills: ['Billing', 'Customer Care', 'Kitchen Prep'],
    hourlyRate: 210,
    maxWeeklyHours: 25,
    assignedHours: 24,
    availabilityDesc: 'Mon, Tue, Fri, Sat Morning',
    dayAvailability: {
      0: 'morning',
      1: 'morning',
      2: 'off',
      3: 'off',
      4: 'morning',
      5: 'off',
      6: 'morning'
    },
    status: 'active'
  },
  {
    id: 'emp-kavita',
    name: 'Kavita Nair',
    initials: 'KN',
    role: 'Closing Manager',
    isFullTime: true,
    skills: ['Shift Close', 'Cash Mgmt', 'Barista'],
    hourlyRate: 290,
    maxWeeklyHours: 40,
    assignedHours: 38,
    availabilityDesc: 'Mon–Fri Evening Shift',
    dayAvailability: {
      0: 'evening',
      1: 'evening',
      2: 'evening',
      3: 'off',
      4: 'off',
      5: 'evening',
      6: 'evening'
    },
    status: 'active'
  },
  {
    id: 'emp-arjun',
    name: 'Arjun Patel',
    initials: 'AP',
    role: 'Junior Barista',
    isFullTime: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjjp0Wa_RiQtWBlAqjOYEdXnVF_7fmgZuOtFD7otYpzIHF-X3A8ZgRjw6J3y95-hbYdi5KbthkAdyxqSNbz3pJaF0Iiy_Vj27ZQ590o6vwfHnifUQSoJIyYsu1XGpE7lXdOb7FQsDhlwaceCPJTlJLGyKmNZVzcEn90fMwn3BbGm_H8x4weR26QyE4ocLc6rqHpk2Ll62JDZkXUAe7rfnDrJzAn7Mcm0Vu9P8LsDdXSPRH66pWHJN2',
    skills: ['Brew Assist', 'Sanitation', 'Barista'],
    hourlyRate: 200,
    maxWeeklyHours: 28,
    assignedHours: 25,
    availabilityDesc: 'Wed–Sun Flexible Coverage',
    dayAvailability: {
      0: 'off',
      1: 'evening',
      2: 'morning',
      3: 'morning',
      4: 'evening',
      5: 'off',
      6: 'off'
    },
    status: 'active'
  },
  {
    id: 'emp-sneha',
    name: 'Sneha Roy',
    initials: 'SR',
    role: 'Customer Service',
    isFullTime: false,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYscK3Vr3R2HncavodcTGxyTsIDLUfhGOWhOFVqMbHj1cw7-PwU5ScUi4_ezEJA_bZyc9nsKJfsSzhIUbr0iozS1WyPnAZoJ4HKXFxZD619W1kP4sjtyJQpnV4m_kE9cZk6F7996LCqOapeXed77ryaIGkCHGRvZBGgJzzJ4_C5XUlStKh5qf8MKMeEtaxThxtTQalofqdK1yvrGaF0heTgQRnI_6F_b07bYNd0kR_N5pdtD-VpsKJ',
    skills: ['POS Billing', 'Guest Exp', 'Floor Support'],
    hourlyRate: 210,
    maxWeeklyHours: 25,
    assignedHours: 24,
    availabilityDesc: 'Mon, Tue, Thu, Sat Mid Shifts',
    dayAvailability: {
      0: 'evening',
      1: 'evening',
      2: 'off',
      3: 'evening',
      4: 'off',
      5: 'evening',
      6: 'off'
    },
    status: 'active'
  },
  {
    id: 'emp-david',
    name: 'David Lobo',
    initials: 'DL',
    role: 'Kitchen & Prep',
    isFullTime: true,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbtP3LB2vl2MacDXDeASxkPd1XpC1dp4Lr4BWPTGdcf0CQWaGs5jO9YgSJvW6tR39jhFYu98IIsKd4REggHWPNrh8cxkj_U4PTjJemAj4g6USh54vU4o4NdN-j6APXeMpD670rKvF_f2uuxLbO_8nGI00UHVCYBs5hqRl1XZ8R7ubPHZmZXpKp2Ovd32MIIQKLzH1JtDP777TAwti6tvPbFkyUIBXvH58AjJbcorC9fD8S48pq-j8D',
    skills: ['Bakery Prep', 'Sandwiches', 'Food Safety'],
    hourlyRate: 240,
    maxWeeklyHours: 40,
    assignedHours: 37,
    availabilityDesc: 'Tue–Sun Early Morning (6 AM)',
    dayAvailability: {
      0: 'off',
      1: 'evening',
      2: 'morning',
      3: 'morning',
      4: 'morning',
      5: 'morning',
      6: 'evening'
    },
    status: 'active'
  }
];

// Initial schedule grid (Optimal State A)
export const INITIAL_SCHEDULE: Record<string, Record<number, ShiftCellData>> = {
  'emp-priya': {
    0: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    1: { shiftId: 'off', label: 'Day Off' },
    2: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    3: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    4: { shiftId: 'leave', label: 'Time Off', note: 'Personal (Approved)' },
    5: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    6: { shiftId: 'off', label: 'Day Off' }
  },
  'emp-rahul': {
    0: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    1: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    2: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    3: { shiftId: 'off', label: 'Day Off' },
    4: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    5: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    6: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' }
  },
  'emp-aisha': {
    0: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    1: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    2: { shiftId: 'off', label: 'Day Off' },
    3: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    4: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30', isSwap: true }, // swapped in for Priya on Friday
    5: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    6: { shiftId: 'off', label: 'Day Off' }
  },
  'emp-vikram': {
    0: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    1: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    2: { shiftId: 'off', label: 'Day Off' },
    3: { shiftId: 'off', label: 'Day Off' },
    4: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    5: { shiftId: 'off', label: 'Day Off' },
    6: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' }
  },
  'emp-kavita': {
    0: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    1: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    2: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    3: { shiftId: 'off', label: 'Day Off' },
    4: { shiftId: 'off', label: 'Day Off' },
    5: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    6: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' }
  },
  'emp-arjun': {
    0: { shiftId: 'off', label: 'Day Off' },
    1: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    2: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    3: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    4: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    5: { shiftId: 'off', label: 'Day Off' },
    6: { shiftId: 'off', label: 'Day Off' }
  },
  'emp-sneha': {
    0: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    1: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    2: { shiftId: 'off', label: 'Day Off' },
    3: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    4: { shiftId: 'off', label: 'Day Off' },
    5: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    6: { shiftId: 'off', label: 'Day Off' }
  },
  'emp-david': {
    0: { shiftId: 'off', label: 'Day Off' },
    1: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' },
    2: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    3: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    4: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    5: { shiftId: 'morning', label: 'Morning', timeRange: '7:00–15:30' },
    6: { shiftId: 'evening', label: 'Evening', timeRange: '15:00–23:30' }
  }
};

export const INITIAL_RULES: RulesConfig = {
  morningMinStaff: 3,
  eveningMinStaff: 4,
  weekendBrunchMinStaff: 4,
  maxWeeklyHours: 40,
  maxDailyHours: 8,
  minRestHours: 12,
  overtimePolicy: 'avoid',
  maxAllowedOvertime: 4,
  balanceWeeklyHours: true,
  balancedWeekendDistribution: true,
  followPreferredShifts: true,
  avoidAbruptShiftChanges: true,
  skillRules: [
    {
      id: 'rule-1',
      shiftId: 'morning',
      roleOrSkill: 'Barista (L2+)',
      minCount: 1
    },
    {
      id: 'rule-2',
      shiftId: 'morning',
      roleOrSkill: 'Cashier / POS',
      minCount: 1
    },
    {
      id: 'rule-3',
      shiftId: 'evening',
      roleOrSkill: 'Shift Supervisor',
      minCount: 1
    },
    {
      id: 'rule-4',
      shiftId: 'evening',
      roleOrSkill: 'Kitchen & Prep',
      minCount: 1
    }
  ]
};

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-priya',
    employeeName: 'Priya Sharma',
    employeeRole: 'Senior Barista · Level 2 Specialist',
    employeeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ5d09Ls122QAq1cJP8NP9b2cfycVyik85pSXxdFoD_57gknPR2pKQ9fcD978qwlKhjfqm3kO4022gNyRanNoRCunJpOFs09Ybl_fNmHZi6TsZzq9h9UkwLLeOemWGduz83qxNwKTCsrkkhwaD2qJzc8PwPleveGDh7JyVAQgwtIWGjhkzJ4FmenEa-OL6fM6dzEym60X8yu1IZVM6gpbZpYRrdFH1uO3rzFJDQEQRN9txoylc5d5y',
    dateStr: 'Friday, 18 Oct · Full Day (1 day)',
    dayIndex: 4,
    duration: 'Full Day',
    category: 'Personal',
    reasonNote: 'Need to attend a family function out of town.',
    status: 'pending',
    scheduledShift: 'Morning Shift (7:00–15:30)',
    impactNotice: 'Approving this leave creates 1 open slot on Friday Morning. Aisha Khan or Rahul V. available to cover without overtime.',
    recommendedReplacement: 'Aisha Khan (Head Barista)',
    submittedAt: 'Yesterday 9:18 AM'
  },
  {
    id: 'leave-2',
    employeeId: 'emp-arjun',
    employeeName: 'Arjun Patel',
    employeeRole: 'Junior Barista · Front Counter',
    employeeAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWPV6FJ93vjg2CkYiiUJykKtUTFfDECV44d8ZTr95VrGz4Aox1-_ahvPCNtsXfhPu5e5jTHgLWkVH_PYJFaoIH66sXCXl1Y3rb4SM6_P6nzcmxXuwfL9-tu04OtPxfZ47oot-jr9kGGq7qBIlYgWTt7Sg1qBU-P1h3qj7O103uj2iz7_BvkRloLw80LMgREPAHxXyvmSB2bIUhPDqDnDVgawbn47xaLPki9_CoEY8-GP1WfY3WKTFB',
    dateStr: 'Sunday, 20 Oct · Evening (15:00–23:30)',
    dayIndex: 6,
    duration: 'Evening',
    category: 'Education / Exam',
    reasonNote: 'College semester mid-term exam on Monday morning.',
    status: 'pending',
    scheduledShift: 'Not assigned to Sunday evening',
    impactNotice: 'Zero roster adjustments required. Approval will block him from automatic schedule fills.',
    submittedAt: 'Today 8:30 AM'
  }
];

export const UPCOMING_APPROVED_LEAVES = [
  {
    id: 'app-1',
    employeeName: 'Rahul Patil',
    employeeRole: 'Shift Supervisor',
    initials: 'RP',
    dateStr: 'Mon, 21 Oct – Tue, 22 Oct',
    duration: '2 days · Full Days',
    reason: 'Family',
    origin: 'Added by Alex Morgan (Manager)',
    status: 'Approved'
  },
  {
    id: 'app-2',
    employeeName: 'Sneha Roy',
    employeeRole: 'Customer Service',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7QytCiP2d9vFXQRrgcz3-QHP7uOIeEJ8nYh8rnu_lIT83hwUAau6w7YXE0Tq9-4tY7dzDTOuVJIX68OZw3kIg5WmpseWkX9Kejmz9Y96hOsXuxKZzB0_wiTuMehiW7_XWns4GCeHjuj6nkopEyFjS1V7BpWSvq20LRl_4AUN86glBtrQk1AWLhIDV9wwFDrJ40XoDRbOfMYnh7z0YRB8jxMMey4FeOIfGFRLpkVvPvUlPY4NmLCCH',
    dateStr: 'Saturday, 26 Oct',
    duration: '1 day · Full Day',
    reason: 'Vacation',
    origin: 'Requested by Sneha',
    status: 'Approved'
  },
  {
    id: 'app-3',
    employeeName: 'David Lobo',
    employeeRole: 'Kitchen & Prep',
    initials: 'DL',
    dateStr: 'Wed, 30 Oct',
    duration: '1 day · Morning (7:00–12:00)',
    reason: 'Medical / Doctor',
    origin: 'Requested by David',
    status: 'Approved'
  }
];

export const PAST_LEAVE_RECORDS: PastLeaveRecord[] = [
  {
    id: 'past-1',
    employeeName: 'Ananya Rao',
    dateStr: 'Thu, 10 Oct (1 day)',
    category: 'Sick Leave',
    status: 'Approved',
    resolvedNote: 'Replaced by David L.'
  },
  {
    id: 'past-2',
    employeeName: 'Karan Mehta',
    dateStr: 'Sun, 06 Oct (Evening)',
    category: 'Personal',
    status: 'Rejected',
    resolvedNote: 'Overlapping critical peak'
  },
  {
    id: 'past-3',
    employeeName: 'Sneha Roy',
    dateStr: 'Fri, 27 Sep – Sat, 28 Sep',
    category: 'Vacation',
    status: 'Approved',
    resolvedNote: 'Full team covered'
  }
];
