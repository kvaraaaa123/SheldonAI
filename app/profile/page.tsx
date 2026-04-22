"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Activity = {
  activity_type: string;
  position: string;
  organization: string;
  description: string;
  grade_9: boolean;
  grade_10: boolean;
  grade_11: boolean;
  grade_12: boolean;
  grade_pg: boolean;
  timing_school_year: boolean;
  timing_school_break: boolean;
  timing_all_year: boolean;
  hours_per_week: string;
  weeks_per_year: string;
  continue_in_college: string;
};

type ProfileData = {
  user_id: string;
  full_name: string | null;
  birthday: string | null;
  gender: string | null;
  ethnicity: string | null;
  ethnicity_other: string | null;
  religion: string | null;
  religion_other: string | null;
  ability_to_pay: string | null;
  education_status: string | null;
  graduation_year: string | null;
  start_semester: string | null;
  high_school_name: string | null;
  gpa: number | null;
  class_rank: string | null;
  sat_math: number | null;
  sat_english: number | null;
  act: number | null;
  country: string | null;
  state: string | null;
  phone: string | null;
  extracurriculars: string[] | null;
  extracurriculars_other: string | null;
  leadership_roles: string | null;
  weekly_hours: string | null;
  hobbies: string[] | null;
  passion_description: string | null;
  has_research: string | null;
  research_subject: string | null;
  research_description: string | null;
  research_awards: string | null;
  activities: Activity[] | null;
  campus_environment: string | null;
  campus_size: string | null;
  school_type: string | null;
  distance_preference: string | null;
  social_culture: string | null;
  academic_intensity: string | null;
  climate_preference: string | null;
  financial_aid_need: string | null;
  is_international: string | null;
  english_test_type: string | null;
  english_test_score: number | null;
  onboarding_complete: boolean;
  private_passion: string | null;
  unusual_trait: string | null;
  changed_mind: string | null;
  meaningful_influence: string | null;
  world_problem: string | null;
  us_citizenship: string | null;
  us_resident_state: string | null;
  friday_night: string | null;
  obsession_topic: string | null;
  self_taught: string | null;
  common_misconception: string | null;
  embarrassing_pride: string | null;
  guaranteed_success: string | null;
  second_citizenship_country: string | null;
  unique_personal_trait: string | null;
  anything_else: string | null;
  sat_score: number | null;
  act_score: number | null;
  why_this_major: string | null;
  career_goals: string | null;
  family_income_bracket: string | null;
  first_gen: string | null;
  css_profile_aware: string | null;
  essay_topics: string | null;
};

type Answers = {
  full_name: string;
  birthday: string;
  gender: string;
  ethnicity: string;
  ethnicity_other: string;
  religion: string;
  religion_other: string;
  ability_to_pay: string;
  education_status: string;
  graduation_year: string;
  start_semester: string;
  high_school_name: string;
  gpa: string;
  class_rank: string;
  sat_math: string;
  sat_english: string;
  act: string;
  country: string;
  state: string;
  phone: string;
  extracurriculars: string[];
  extracurriculars_other: string;
  leadership_roles: string;
  weekly_hours: string;
  hobbies: string[];
  passion_description: string;
  has_research: string;
  research_subject: string;
  research_description: string;
  research_awards: string;
  campus_environment: string;
  campus_size: string;
  school_type: string;
  distance_preference: string;
  social_culture: string;
  academic_intensity: string;
  climate_preference: string;
  financial_aid_need: string;
  is_international: string;
  english_test_type: string;
  english_test_score: string;
  private_passion: string;
  unusual_trait: string;
  changed_mind: string;
  meaningful_influence: string;
  world_problem: string;
  us_citizenship: string;
  us_resident_state: string;
  friday_night: string;
  obsession_topic: string;
  self_taught: string;
  common_misconception: string;
  embarrassing_pride: string;
  guaranteed_success: string;
  second_citizenship_country: string;
  unique_personal_trait: string;
  anything_else: string;
  sat_score: string;
  act_score: string;
  why_this_major: string;
  career_goals: string;
  family_income_bracket: string;
  first_gen: string;
  css_profile_aware: string;
  essay_topics: string;
};

type AnalysisResult = {
  summary: string;
  essayTopics: Array<{ topic: string; why: string }>;
  universityMatches: Array<{ school: string; reason: string }>;
  strengthenThis: string;
};

type UploadState = "idle" | "uploading" | "success" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_ACTIVITY: Activity = {
  activity_type: "", position: "", organization: "", description: "",
  grade_9: false, grade_10: false, grade_11: false, grade_12: false, grade_pg: false,
  timing_school_year: false, timing_school_break: false, timing_all_year: false,
  hours_per_week: "", weeks_per_year: "", continue_in_college: "",
};

const EMPTY: Answers = {
  full_name: "", birthday: "", gender: "",
  ethnicity: "", ethnicity_other: "",
  religion: "", religion_other: "",
  ability_to_pay: "",
  education_status: "", graduation_year: "", start_semester: "",
  high_school_name: "", gpa: "", class_rank: "",
  sat_math: "", sat_english: "", act: "",
  country: "", state: "", phone: "",
  extracurriculars: [], extracurriculars_other: "",
  leadership_roles: "", weekly_hours: "",
  hobbies: [], passion_description: "",
  has_research: "", research_subject: "",
  research_description: "", research_awards: "",
  campus_environment: "", campus_size: "", school_type: "",
  distance_preference: "", social_culture: "", academic_intensity: "",
  climate_preference: "", financial_aid_need: "",
  is_international: "", english_test_type: "", english_test_score: "",
  private_passion: "", unusual_trait: "",
  changed_mind: "", meaningful_influence: "", world_problem: "",
  us_citizenship: "", us_resident_state: "",
  friday_night: "", obsession_topic: "", self_taught: "",
  common_misconception: "", embarrassing_pride: "", guaranteed_success: "",
  second_citizenship_country: "", unique_personal_trait: "", anything_else: "",
  sat_score: "", act_score: "", why_this_major: "", career_goals: "",
  family_income_bracket: "", first_gen: "", css_profile_aware: "", essay_topics: "",
};

const ACTIVITY_TYPES: string[] = [
  "Academic", "Art", "Athletics (Club)", "Athletics (JV/Varsity)", "Career-Oriented",
  "Community Service (Volunteer)", "Computer/Technology", "Cultural", "Dance",
  "Debate/Speech", "Environmental", "Family Responsibilities", "Foreign Exchange",
  "Foreign Language", "Internship", "Journalism/Publication", "Junior R.O.T.C.",
  "LGBT", "Music (Instrumental)", "Music (Vocal)", "Religious", "Research",
  "Robotics", "School Spirit", "Science/Math", "Social Justice",
  "Student Govt./Politics", "Theater/Drama", "Work (Paid)", "Other Club/Activity",
];

const HIGH_SCHOOLS: string[] = [
  "Phillips Exeter Academy", "Phillips Academy Andover", "Milton Academy",
  "Groton School", "St. Paul's School", "Choate Rosemary Hall", "Deerfield Academy",
  "Hotchkiss School", "Lawrenceville School", "Middlesex School",
  "Noble and Greenough School", "Roxbury Latin School", "Concord Academy",
  "Brooks School", "Governor's Academy", "Tabor Academy", "Northfield Mount Hermon",
  "Loomis Chaffee", "Trinity-Pawling School", "Taft School", "Suffield Academy",
  "Westminster School", "Williston Northampton School", "Miss Porter's School",
  "Kent School", "South Kent School", "Salisbury School", "Kingswood Oxford School",
  "King School", "Brunswick School", "Greenwich Academy", "Rye Country Day School",
  "Fieldston School", "Riverdale Country School", "Horace Mann School",
  "Dalton School", "Chapin School", "Brearley School", "Nightingale-Bamford School",
  "Spence School", "Trinity School NYC", "Collegiate School NYC", "Buckley School NYC",
  "Poly Prep Country Day School", "Packer Collegiate Institute",
  "Brooklyn Friends School", "Friends Seminary", "Ethical Culture Fieldston",
  "Regis High School", "Fordham Prep", "Boston Latin School", "Boston Latin Academy",
  "O'Bryant School", "Brookline High School", "Newton South High School",
  "Newton North High School", "Lexington High School", "Westford Academy",
  "Acton-Boxborough Regional High School", "Lincoln-Sudbury Regional High School",
  "Concord-Carlisle High School", "Belmont High School", "Needham High School",
  "Wellesley High School", "Natick High School", "Framingham High School",
  "Weston High School", "Wayland High School", "Winchester High School",
  "Medfield High School", "Medford High School", "Malden Catholic High School",
  "Catholic Memorial School", "BC High", "Georgetown Prep", "St. Albans School",
  "National Cathedral School", "Sidwell Friends School", "Maret School",
  "Gonzaga College High School",
  "Thomas Jefferson High School for Science and Technology",
  "McLean High School", "Langley High School", "Stuyvesant High School",
  "Bronx High School of Science", "Brooklyn Technical High School",
  "Hunter College High School", "Townsend Harris High School",
  "Staten Island Technical High School",
  "High School for Math, Science and Engineering",
  "High School of American Studies", "Nueva School",
  "Crystal Springs Uplands School", "The Harker School",
  "Bellarmine College Prep", "Archbishop Mitty High School",
  "Presentation High School", "Monta Vista High School", "Lynbrook High School",
  "Gunn High School", "Palo Alto High School", "Los Altos High School",
  "Mountain View High School", "Saratoga High School", "Los Gatos High School",
  "Menlo School", "Castilleja School", "Sacred Heart Schools Atherton",
  "Woodside Priory School", "Notre Dame High School Belmont", "Sacred Heart Prep",
  "Pinewood School", "Freestyle Academy", "Henry M. Gunn High School",
  "Cupertino High School", "Fremont High School Sunnyvale",
  "Lakeside School Seattle", "Bush School", "University Prep Seattle",
  "Forest Ridge School", "Eastside Preparatory School", "Bellevue High School",
  "Newport High School", "Interlake High School", "Mercer Island High School",
  "Skyline High School", "Sammamish High School", "International School Bellevue",
  "Episcopal High School Alexandria", "Paul VI Catholic High School",
  "Woodrow Wilson High School DC", "School Without Walls DC", "BASIS DC",
  "BASIS Scottsdale", "Basis Tucson North", "Phoenix Country Day School",
  "Brophy College Prep", "Xavier College Prep", "Desert Vista High School",
  "Chandler High School", "Hamilton High School Chandler", "Perry High School Gilbert",
  "Notre Dame Prep Scottsdale", "University High School Tucson",
  "Catalina Foothills High School", "Sahuaro High School",
  "Vestavia Hills High School", "Mountain Brook High School",
  "Homewood High School", "Auburn High School", "Grissom High School",
  "Huntsville High School", "James Clemens High School",
  "Montgomery Blair High School", "Richard Montgomery High School", "Walter Johnson High School",
  "Whitman High School", "Churchill High School", "Wootton High School", "Poolesville High School",
  "Rockville High School", "Gaithersburg High School", "Quince Orchard High School",
  "Seneca Valley High School", "Walt Whitman High School",
  "Bethesda-Chevy Chase High School", "Springbrook High School", "Paint Branch High School",
  "Sherwood High School", "Northwest High School Maryland", "Clarksburg High School",
  "Damascus High School", "Magruder High School", "Watkins Mill High School",
  "Einstein High School", "Kennedy High School Maryland", "Northwood High School",
  "Wheaton High School", "Crossland High School", "Largo High School",
  "Eleanor Roosevelt High School", "Duval High School", "Bowie High School",
  "Suitland High School", "Oxon Hill High School", "Friendly High School",
  "Fairfax High School", "Robinson Secondary School", "Westfield High School",
  "Centreville High School", "Chantilly High School", "Herndon High School",
  "South Lakes High School", "Madison High School Virginia", "Marshall High School Virginia",
  "Oakton High School", "Vienna High School", "Falls Church High School",
  "George Mason High School", "Justice High School", "Annandale High School",
  "Stuart High School", "Lake Braddock Secondary School", "West Springfield High School",
  "West Potomac High School", "Mount Vernon High School Virginia",
  "Hayfield Secondary School", "Edison High School Virginia", "Fort Hunt High School",
  "West Allegheny High School", "Upper St Clair High School", "Mt Lebanon High School",
  "Bethel Park High School", "Peters Township High School", "Canon-McMillan High School",
  "North Allegheny High School", "Pine-Richland High School", "Fox Chapel Area High School",
  "Hampton High School Pennsylvania", "Shaler Area High School", "Penn Hills High School",
  "Gateway High School Pennsylvania", "Woodland Hills High School",
  "Sewickley Academy", "Winchester Thurston School", "Shady Side Academy",
  "Ellis School Pittsburgh", "Central Catholic High School Pittsburgh",
  "North Catholic High School Pittsburgh", "Oakland Catholic High School",
  "Stuyvesant High School", "Bronx High School of Science", "Brooklyn Technical High School",
  "Hunter College High School", "Forest Hills High School", "Bayside High School",
  "Flushing High School", "DeWitt Clinton High School", "Cardinal Spellman High School",
  "Hopkins School", "Foote School", "Staples High School Westport",
  "Wilton High School", "New Canaan High School", "Darien High School", "Greenwich High School",
  "Scarsdale High School", "Ardsley High School", "Mamaroneck High School",
  "Rye High School", "Byram Hills High School", "Somers High School New York",
  "Yorktown High School New York", "John Jay High School Cross River",
  "Saratoga Springs High School", "Niskayuna High School", "Shenendehowa High School",
  "Bethlehem Central High School", "Guilderland High School",
  "Other",
];

const COUNTRIES: string[] = [
  "United States", "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus",
  "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria", "Cambodia",
  "Canada", "Chile", "China", "Colombia", "Croatia", "Cuba", "Cyprus",
  "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Georgia",
  "Germany", "Ghana", "Greece", "Guatemala", "Honduras", "Hungary", "India",
  "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Latvia", "Lebanon", "Libya", "Lithuania", "Luxembourg", "Malaysia", "Mexico",
  "Moldova", "Mongolia", "Montenegro", "Morocco", "Nepal", "Netherlands",
  "New Zealand", "Nicaragua", "Nigeria", "North Macedonia", "Norway", "Pakistan",
  "Palestine", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Saudi Arabia", "Senegal", "Serbia", "Singapore",
  "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain",
  "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Tanzania", "Thailand", "Trinidad and Tobago", "Tunisia", "Turkey",
  "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zimbabwe",
];

const US_STATES: string[] = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "Washington D.C.",
];

const HOBBIES: string[] = [
  "Reading", "Writing", "Music (listening)", "Playing an instrument", "Singing",
  "Drawing / Painting", "Photography", "Film & Cinema", "Fashion & Design",
  "Cooking & Food", "Travel", "Hiking / Outdoors", "Sports (watching)", "Gaming",
  "Coding / Tech", "Entrepreneurship", "Investing", "Politics & Current Events",
  "History", "Philosophy", "Science & Discovery", "Mathematics", "Languages",
  "Podcasts", "Journalism", "Public Speaking", "Meditation / Wellness", "Fitness",
  "Cars", "Architecture", "Interior Design", "Other",
];

const RESEARCH_SUBJECTS: string[] = [
  "Science", "Technology", "Engineering", "Mathematics", "Social Science",
  "Humanities", "Arts", "Business", "Medicine", "Environment", "Law", "Policy", "Other",
];

const GROUP_TITLES = [
  "Basic Info",
  "Academics",
  "Activities",
  "College Preferences",
  "Background",
  "Standardized Testing",
  "Essays & Goals",
  "Financial Aid",
  "About You",
];

const TOTAL_GROUPS = 9;

const ENGLISH_SPEAKING_COUNTRIES = new Set([
  "United States", "Canada", "United Kingdom", "Australia", "New Zealand",
  "Ireland", "Singapore", "South Africa", "Jamaica", "Barbados",
  "Trinidad and Tobago", "Belize", "Guyana",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function profileToAnswers(p: ProfileData): Answers {
  return {
    full_name: p.full_name ?? "",
    birthday: p.birthday ?? "",
    gender: p.gender ?? "",
    ethnicity: p.ethnicity ?? "",
    ethnicity_other: p.ethnicity_other ?? "",
    religion: p.religion ?? "",
    religion_other: p.religion_other ?? "",
    ability_to_pay: p.ability_to_pay ?? "",
    education_status: p.education_status ?? "",
    graduation_year: p.graduation_year ?? "",
    start_semester: p.start_semester ?? "",
    high_school_name: p.high_school_name ?? "",
    gpa: p.gpa != null ? String(p.gpa) : "",
    class_rank: p.class_rank ?? "",
    sat_math: p.sat_math != null ? String(p.sat_math) : "",
    sat_english: p.sat_english != null ? String(p.sat_english) : "",
    act: p.act != null ? String(p.act) : "",
    country: p.country ?? "",
    state: p.state ?? "",
    phone: p.phone ?? "",
    extracurriculars: p.extracurriculars ?? [],
    extracurriculars_other: p.extracurriculars_other ?? "",
    leadership_roles: p.leadership_roles ?? "",
    weekly_hours: p.weekly_hours ?? "",
    hobbies: p.hobbies ?? [],
    passion_description: p.passion_description ?? "",
    has_research: p.has_research ?? "",
    research_subject: p.research_subject ?? "",
    research_description: p.research_description ?? "",
    research_awards: p.research_awards ?? "",
    campus_environment: p.campus_environment ?? "",
    campus_size: p.campus_size ?? "",
    school_type: p.school_type ?? "",
    distance_preference: p.distance_preference ?? "",
    social_culture: p.social_culture ?? "",
    academic_intensity: p.academic_intensity ?? "",
    climate_preference: p.climate_preference ?? "",
    financial_aid_need: p.financial_aid_need ?? "",
    is_international: p.is_international ?? "",
    english_test_type: p.english_test_type ?? "",
    english_test_score: p.english_test_score != null ? String(p.english_test_score) : "",
    private_passion: p.private_passion ?? "",
    unusual_trait: p.unusual_trait ?? "",
    changed_mind: p.changed_mind ?? "",
    meaningful_influence: p.meaningful_influence ?? "",
    world_problem: p.world_problem ?? "",
    us_citizenship: p.us_citizenship ?? "",
    us_resident_state: p.us_resident_state ?? "",
    friday_night: p.friday_night ?? "",
    obsession_topic: p.obsession_topic ?? "",
    self_taught: p.self_taught ?? "",
    common_misconception: p.common_misconception ?? "",
    embarrassing_pride: p.embarrassing_pride ?? "",
    guaranteed_success: p.guaranteed_success ?? "",
    second_citizenship_country: p.second_citizenship_country ?? "",
    unique_personal_trait: p.unique_personal_trait ?? "",
    anything_else: p.anything_else ?? "",
    sat_score: p.sat_score != null ? String(p.sat_score) : "",
    act_score: p.act_score != null ? String(p.act_score) : "",
    why_this_major: p.why_this_major ?? "",
    career_goals: p.career_goals ?? "",
    family_income_bracket: p.family_income_bracket ?? "",
    first_gen: p.first_gen ?? "",
    css_profile_aware: p.css_profile_aware ?? "",
    essay_topics: p.essay_topics ?? "",
  };
}

function profileToActivities(p: ProfileData): Activity[] {
  if (p.activities && p.activities.length > 0) {
    return p.activities.map(a => ({
      activity_type: a.activity_type || "",
      position: a.position || "",
      organization: a.organization || "",
      description: a.description || "",
      grade_9: !!a.grade_9,
      grade_10: !!a.grade_10,
      grade_11: !!a.grade_11,
      grade_12: !!a.grade_12,
      grade_pg: !!a.grade_pg,
      timing_school_year: !!a.timing_school_year,
      timing_school_break: !!a.timing_school_break,
      timing_all_year: !!a.timing_all_year,
      hours_per_week: a.hours_per_week != null ? String(a.hours_per_week) : "",
      weeks_per_year: a.weeks_per_year != null ? String(a.weeks_per_year) : "",
      continue_in_college: a.continue_in_college || "",
    }));
  }
  return [{ ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const { isDark } = useTheme();

  const bg         = isDark ? "#080810"                : "#FAFAF5";
  const text       = isDark ? "#FAFAF5"                : "#0a0a12";
  const gold       = isDark ? "#C9A96E"                : "#9a7040";
  const surface    = isDark ? "#0f0f1a"                : "#ffffff";
  const border     = isDark ? "rgba(255,255,255,0.1)"  : "rgba(0,0,0,0.1)";
  const muted      = isDark ? "rgba(250,250,245,0.55)" : "rgba(10,10,18,0.5)";
  const pillBorder = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)";
  const pillText   = isDark ? "#FAFAF5"                : "#0a0a12";

  // Core state
  const [userId,          setUserId]          = useState("");
  const [,                setUserEmail]       = useState("");
  const [profileData,     setProfileData]     = useState<ProfileData | null>(null);
  const [mode,            setMode]            = useState<"view" | "onboarding" | null>(null);
  const [onboardingPhase, setOnboardingPhase] = useState<"upload" | "questionnaire">("upload");
  const [showRedoConfirm, setShowRedoConfirm] = useState(false);

  // Questionnaire state
  const [currentGroup,  setCurrentGroup]  = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [answers,       setAnswers]       = useState<Answers>(EMPTY);

  // Activities state
  const [activities,         setActivities]         = useState<Activity[]>([{ ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }]);
  const [expandedActivities, setExpandedActivities] = useState<boolean[]>([true, false, false]);

  // Upload state
  const [uploadState,    setUploadState]    = useState<UploadState>("idle");
  const [uploadedFiles,  setUploadedFiles]  = useState<{name: string; base64: string}[]>([]);
  const [uploadedFields, setUploadedFields] = useState<string[]>([]);
  const [dragOver,       setDragOver]       = useState(false);

  // Secondary activity upload (activities step)
  const [showSecondaryUpload, setShowSecondaryUpload] = useState(false);
  const [secondaryFiles,      setSecondaryFiles]      = useState<{name: string; base64: string}[]>([]);
  const [secondaryUploading,  setSecondaryUploading]  = useState(false);
  const secondaryFileRef = useRef<HTMLInputElement>(null);

  // Test score skips
  const [satMathSkipped, setSatMathSkipped] = useState(false);
  const [satRWSkipped,   setSatRWSkipped]   = useState(false);
  const [actSkipped,     setActSkipped]     = useState(false);

  // Autocomplete open state
  const [hsOpen,      setHsOpen]      = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen,   setStateOpen]   = useState(false);

  // Inline error state
  const [saveError, setSaveError] = useState("");

  // View/edit state
  const [editingSection, setEditingSection] = useState<number | null>(null);
  const [draftAnswers,   setDraftAnswers]   = useState<Answers | null>(null);
  const [draftActivities,setDraftActivities]= useState<Activity[] | null>(null);
  const [analysis,       setAnalysis]       = useState<AnalysisResult | null>(null);
  const [analyzing,      setAnalyzing]      = useState(false);
  const [sectionSaving,  setSectionSaving]  = useState(false);

  // Refs
  const groupRef      = useRef<HTMLDivElement>(null);
  const isFirstMount  = useRef(true);
  const userIdRef     = useRef<string>("");
  const fileInputRef  = useRef<HTMLInputElement>(null);

  // ── Mount: fetch profile ────────────────────────────────────────────────────

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) { router.push("/"); return; }

        console.log("Session user id:", session?.user?.id);

        userIdRef.current = session.user.id;
        setUserId(session.user.id);
        setUserEmail(session.user.email ?? "");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();

        console.log("Profile data:", data, "Error:", error);

        if (data && data.onboarding_complete === true) {
          const p = data as ProfileData;
          setProfileData(p);
          setAnswers(profileToAnswers(p));
          const acts = profileToActivities(p);
          setActivities(acts);
          setExpandedActivities(acts.map((_, i) => i === 0));
          setMode("view");
        } else {
          setMode("onboarding");
        }
      } catch (err) {
        console.error("Mount error:", err);
        setMode("onboarding");
      }
    };
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fade-in animation on group change ──────────────────────────────────────

  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    if (isFirstMount.current) {
      isFirstMount.current = false;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      return;
    }
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity 200ms ease, transform 200ms ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, [currentGroup]);

  // ── Core helpers ───────────────────────────────────────────────────────────

  function setA(key: keyof Answers, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }));
  }

  function toggleMulti(field: "hobbies", val: string) {
    setAnswers(prev => {
      const arr = prev[field] as string[];
      return { ...prev, [field]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val] };
    });
  }

  function toggleSchoolType(opt: string) {
    setAnswers(prev => {
      const cur = prev.school_type ? prev.school_type.split(",").map(s => s.trim()).filter(Boolean) : [];
      if (opt === "All of the above") {
        return { ...prev, school_type: cur.includes("All of the above") ? "" : "All of the above" };
      }
      const withoutAll = cur.filter(s => s !== "All of the above");
      const next = withoutAll.includes(opt) ? withoutAll.filter(s => s !== opt) : [...withoutAll, opt];
      return { ...prev, school_type: next.join(", ") };
    });
  }

  function toggleCampusEnv(opt: string) {
    setAnswers(prev => {
      const cur = prev.campus_environment ? prev.campus_environment.split(",").map(s => s.trim()).filter(Boolean) : [];
      if (opt === "All of the above") {
        return { ...prev, campus_environment: cur.includes("All of the above") ? "" : "All of the above" };
      }
      const withoutAll = cur.filter(s => s !== "All of the above");
      const next = withoutAll.includes(opt) ? withoutAll.filter(s => s !== opt) : [...withoutAll, opt];
      return { ...prev, campus_environment: next.join(", ") };
    });
  }

  const SOCIAL_OPPOSITES: [string, string][] = [["Greek life active", "No Greek life"]];

  function toggleSocialCulture(opt: string) {
    setAnswers(prev => {
      const cur = prev.social_culture ? prev.social_culture.split(",").map(s => s.trim()).filter(Boolean) : [];
      if (opt === "No preference") {
        return { ...prev, social_culture: cur.includes("No preference") ? "" : "No preference" };
      }
      if (cur.includes("No preference")) return prev;
      const opposite = SOCIAL_OPPOSITES.find(([a, b]) => a === opt ? b : b === opt ? a : null);
      const opp = opposite ? (opposite[0] === opt ? opposite[1] : opposite[0]) : null;
      const withoutOpp = opp ? cur.filter(s => s !== opp) : cur;
      const next = withoutOpp.includes(opt) ? withoutOpp.filter(s => s !== opt) : [...withoutOpp, opt];
      return { ...prev, social_culture: next.join(", ") };
    });
  }

  function isMultiSelected(field: keyof Answers, opt: string): boolean {
    const val = answers[field] as string;
    if (!val) return false;
    return val.split(",").map(s => s.trim()).includes(opt);
  }

  function renderMultiSelectPills(
    options: string[],
    selected: string,
    toggle: (opt: string) => void,
  ) {
    const sel = selected ? selected.split(",").map(s => s.trim()).filter(Boolean) : [];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(opt => {
          const isSelected = sel.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              style={{
                display: "inline-flex", alignItems: "center", borderRadius: 999,
                padding: "7px 16px", fontSize: 13,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 400, lineHeight: "1.4",
                borderStyle: "solid", borderWidth: "0.5px",
                borderColor: isSelected ? gold : pillBorder,
                backgroundColor: isSelected ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                color: isSelected ? gold : pillText,
                cursor: "pointer", transition: "border-color 0.15s, background-color 0.15s, color 0.15s",
                outline: "none", whiteSpace: "nowrap",
                WebkitAppearance: "none", appearance: "none",
              }}
            >{opt}</button>
          );
        })}
      </div>
    );
  }

  function updateActivity(index: number, key: keyof Activity, value: string | boolean) {
    setActivities(prev => prev.map((a, i) => i === index ? { ...a, [key]: value } : a));
  }

  function toggleActivityExpand(index: number) {
    setExpandedActivities(prev => prev.map((e, i) => i === index ? !e : e));
  }

  function isGroupValid(g: number): boolean {
    switch (g) {
      case 0: return !!(answers.full_name.trim() && answers.high_school_name.trim() && answers.gpa);
      case 1: return true;
      case 2: return activities.some(a => !!a.activity_type);
      case 3: return true;
      case 4: return !!(answers.us_citizenship);
      case 5: return true;
      case 6: return true;
      case 7: return true;
      case 8: return true;
      default: return false;
    }
  }

  function goNext() {
    if (transitioning) return;
    if (currentGroup === TOTAL_GROUPS - 1) { handleComplete(); return; }
    setTransitioning(true);
    const el = groupRef.current;
    if (el) {
      el.style.transition = "opacity 200ms ease, transform 200ms ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(-16px)";
    }
    setTimeout(() => { setCurrentGroup(g => g + 1); setTransitioning(false); }, 200);
  }

  async function handleComplete() {
    console.log("Completing profile...");
    const cleanActivities = activities.filter(a => !!a.activity_type);
    const formData = {
      full_name: answers.full_name || null,
      birthday: answers.birthday || null,
      gender: answers.gender || null,
      ethnicity: answers.ethnicity || null,
      ethnicity_other: answers.ethnicity_other || null,
      religion: answers.religion || null,
      religion_other: answers.religion_other || null,
      ability_to_pay: answers.ability_to_pay || null,
      education_status: answers.education_status || null,
      graduation_year: answers.graduation_year || null,
      start_semester: answers.start_semester || null,
      high_school_name: answers.high_school_name || null,
      gpa: answers.gpa ? parseFloat(answers.gpa) : null,
      class_rank: answers.class_rank || null,
      sat_math: answers.sat_math ? parseInt(answers.sat_math) : null,
      sat_english: answers.sat_english ? parseInt(answers.sat_english) : null,
      act: answers.act ? parseInt(answers.act) : null,
      country: answers.country || null,
      state: answers.state || null,
      phone: answers.phone || null,
      hobbies: answers.hobbies.length > 0 ? answers.hobbies : null,
      passion_description: answers.passion_description || null,
      has_research: answers.has_research || null,
      research_subject: answers.research_subject || null,
      research_description: answers.research_description || null,
      research_awards: answers.research_awards || null,
      activities: cleanActivities.length > 0 ? cleanActivities : null,
      campus_environment: answers.campus_environment || null,
      campus_size: answers.campus_size || null,
      school_type: answers.school_type || null,
      distance_preference: answers.distance_preference || null,
      social_culture: answers.social_culture || null,
      academic_intensity: answers.academic_intensity || null,
      climate_preference: answers.climate_preference || null,
      financial_aid_need: answers.financial_aid_need || null,
      is_international: answers.is_international || null,
      english_test_type: answers.english_test_type || null,
      english_test_score: answers.english_test_score ? parseFloat(answers.english_test_score) : null,
      private_passion: answers.private_passion || null,
      unusual_trait: answers.unusual_trait || null,
      changed_mind: answers.changed_mind || null,
      meaningful_influence: answers.meaningful_influence || null,
      world_problem: answers.world_problem || null,
      us_citizenship: answers.us_citizenship || null,
      us_resident_state: answers.us_resident_state || null,
      friday_night: answers.friday_night || null,
      obsession_topic: answers.obsession_topic || null,
      self_taught: answers.self_taught || null,
      common_misconception: answers.common_misconception || null,
      embarrassing_pride: answers.embarrassing_pride || null,
      guaranteed_success: answers.guaranteed_success || null,
      second_citizenship_country: answers.second_citizenship_country || null,
      unique_personal_trait: answers.unique_personal_trait || null,
      anything_else: answers.anything_else || null,
      sat_score: answers.sat_score ? parseInt(answers.sat_score) : null,
      act_score: answers.act_score ? parseInt(answers.act_score) : null,
      why_this_major: answers.why_this_major || null,
      career_goals: answers.career_goals || null,
      family_income_bracket: answers.family_income_bracket || null,
      first_gen: answers.first_gen || null,
      css_profile_aware: answers.css_profile_aware || null,
      essay_topics: answers.essay_topics || null,
    };

    const sessionResult = await supabase.auth.getSession();
    const uid = sessionResult.data.session?.user?.id;
    if (!uid) { console.error("No user id for upsert"); return; }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        { user_id: uid, ...formData, onboarding_complete: true, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    console.log("Upsert result:", upsertError);

    if (!upsertError) {
      setSaveError("");
      router.push("/dashboard");
    } else {
      console.error("Save error:", upsertError);
      setSaveError("Profile saved partially — some fields may not have saved. You can continue.");
    }
  }

  // ── Section save ───────────────────────────────────────────────────────────

  function getSectionFields(sectionIndex: number): Partial<ProfileData> {
    switch (sectionIndex) {
      case 0: return {
        full_name: answers.full_name || null,
        graduation_year: answers.graduation_year || null,
        education_status: answers.education_status || null,
        high_school_name: answers.high_school_name || null,
        gpa: answers.gpa ? parseFloat(answers.gpa) : null,
        class_rank: answers.class_rank || null,
      };
      case 1: return {
        passion_description: answers.passion_description || null,
        hobbies: answers.hobbies.length > 0 ? answers.hobbies : null,
        why_this_major: answers.why_this_major || null,
        career_goals: answers.career_goals || null,
      };
      case 2: {
        const clean = activities.filter(a => !!a.activity_type);
        return { activities: clean.length > 0 ? clean : null };
      }
      case 3: return {
        school_type: answers.school_type || null,
        campus_environment: answers.campus_environment || null,
        campus_size: answers.campus_size || null,
        social_culture: answers.social_culture || null,
        financial_aid_need: answers.financial_aid_need || null,
        distance_preference: answers.distance_preference || null,
        climate_preference: answers.climate_preference || null,
      };
      case 4: return {
        us_citizenship: answers.us_citizenship || null,
        second_citizenship_country: answers.second_citizenship_country || null,
        us_resident_state: answers.us_resident_state || null,
        country: answers.country || null,
        phone: answers.phone || null,
        first_gen: answers.first_gen || null,
      };
      case 5: return {
        sat_score: answers.sat_score ? parseInt(answers.sat_score) : null,
        act_score: answers.act_score ? parseInt(answers.act_score) : null,
        english_test_type: answers.english_test_type || null,
        english_test_score: answers.english_test_score ? parseFloat(answers.english_test_score) : null,
        is_international: answers.us_citizenship === "Not a US citizen" ? "Yes" : "No",
      };
      case 6: return {
        why_this_major: answers.why_this_major || null,
        career_goals: answers.career_goals || null,
        essay_topics: answers.essay_topics || null,
      };
      case 7: return {
        family_income_bracket: answers.family_income_bracket || null,
        css_profile_aware: answers.css_profile_aware || null,
        ability_to_pay: answers.ability_to_pay || null,
      };
      case 8: return {
        private_passion: answers.private_passion || null,
        unusual_trait: answers.unusual_trait || null,
        changed_mind: answers.changed_mind || null,
        meaningful_influence: answers.meaningful_influence || null,
        embarrassing_pride: answers.embarrassing_pride || null,
        guaranteed_success: answers.guaranteed_success || null,
        unique_personal_trait: answers.unique_personal_trait || null,
        anything_else: answers.anything_else || null,
        friday_night: answers.friday_night || null,
        obsession_topic: answers.obsession_topic || null,
        self_taught: answers.self_taught || null,
        common_misconception: answers.common_misconception || null,
      };
      default: return {};
    }
  }

  async function saveSection(sectionIndex: number) {
    setSectionSaving(true);
    const fields = getSectionFields(sectionIndex);
    await supabase.from("profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("user_id", userIdRef.current);
    setProfileData(prev => prev ? { ...prev, ...fields } : prev);
    setEditingSection(null);
    setDraftAnswers(null);
    setDraftActivities(null);
    setSectionSaving(false);
  }

  async function handleRedo() {
    await supabase.from("profiles").update({
      onboarding_complete: false,
      full_name: null, birthday: null, gender: null,
      ethnicity: null, ethnicity_other: null, religion: null, religion_other: null,
      ability_to_pay: null, education_status: null, graduation_year: null, start_semester: null,
      high_school_name: null, gpa: null, class_rank: null,
      hobbies: null, passion_description: null,
      has_research: null, research_subject: null, research_description: null, research_awards: null,
      sat_math: null, sat_english: null, act: null,
      country: null, state: null, phone: null,
      activities: null,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userIdRef.current);
    setAnswers(EMPTY);
    setActivities([{ ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }]);
    setExpandedActivities([true, false, false]);
    setProfileData(null);
    setCurrentGroup(0);
    setEditingSection(null);
    setDraftAnswers(null);
    setDraftActivities(null);
    setAnalysis(null);
    setShowRedoConfirm(false);
    setUploadState("idle");
    setUploadedFiles([]);
    setUploadedFields([]);
    setOnboardingPhase("upload");
    setMode("onboarding");
  }

  async function analyzeProfile() {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/profile-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: answers.full_name, birthday: answers.birthday, gender: answers.gender,
          ethnicity: answers.ethnicity_other || answers.ethnicity, religion: answers.religion_other || answers.religion,
          ability_to_pay: answers.ability_to_pay, education_status: answers.education_status,
          graduation_year: answers.graduation_year, start_semester: answers.start_semester,
          high_school_name: answers.high_school_name, gpa: answers.gpa || null, class_rank: answers.class_rank,
          sat_math: answers.sat_math || null, sat_english: answers.sat_english || null, act: answers.act || null,
          country: answers.country, state: answers.state,
          activities: activities.filter(a => !!a.activity_type),
          hobbies: answers.hobbies, passion_description: answers.passion_description,
          has_research: answers.has_research, research_subject: answers.research_subject,
          research_description: answers.research_description, research_awards: answers.research_awards,
        }),
      });
      if (res.ok) setAnalysis(await res.json());
    } catch { /* silently fail */ }
    setAnalyzing(false);
  }

  function mapParsedActivities(parsed: Array<Record<string, unknown>>): Activity[] {
    return parsed.slice(0, 10).map(a => ({
      activity_type: String(a.activity_type || ""),
      position: String(a.position || ""),
      organization: String(a.organization || ""),
      description: String(a.description || ""),
      grade_9:  Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("9"),
      grade_10: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("10"),
      grade_11: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("11"),
      grade_12: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("12"),
      grade_pg: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("Post-graduate"),
      timing_school_year:  Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("school year")),
      timing_school_break: Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("break")),
      timing_all_year:     Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("all year")),
      hours_per_week:  a.hours_per_week  != null ? String(a.hours_per_week)  : "",
      weeks_per_year:  a.weeks_per_year  != null ? String(a.weeks_per_year)  : "",
      continue_in_college: a.continue_in_college === true ? "Yes" : a.continue_in_college === false ? "No" : "",
    }));
  }

  // ── Style helpers ──────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", fontSize: 15,
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderStyle: "solid", borderWidth: "0.5px", borderColor: border,
    borderRadius: 10, backgroundColor: surface, color: text,
    outline: "none", boxSizing: "border-box",
    WebkitAppearance: "none", appearance: "none",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle, resize: "vertical" as const, lineHeight: "1.5", minHeight: 96,
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23888' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
    paddingRight: 36,
  };

  function renderLabel(labelText: string) {
    return (
      <div style={{
        fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif",
        fontWeight: 500, textTransform: "uppercase" as const,
        letterSpacing: "0.08em", color: muted, marginBottom: 8,
      }}>
        {labelText}
      </div>
    );
  }

  function renderPills(field: keyof Answers, options: string[]) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(opt => {
          const selected = answers[field] === opt;
          return (
            <button key={opt} type="button" onClick={() => setA(field, selected ? "" : opt)}
              style={{
                display: "inline-flex", alignItems: "center", borderRadius: 999,
                padding: "7px 16px", fontSize: 13,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 400, lineHeight: "1.4",
                borderStyle: "solid", borderWidth: "0.5px",
                borderColor: selected ? gold : pillBorder,
                backgroundColor: selected ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                color: selected ? gold : pillText,
                cursor: "pointer", transition: "border-color 0.15s, background-color 0.15s, color 0.15s",
                outline: "none", whiteSpace: "nowrap",
                WebkitAppearance: "none", appearance: "none",
              }}
            >{opt}</button>
          );
        })}
      </div>
    );
  }

  function renderMultiPills(field: "hobbies", options: string[]) {
    const selected = answers[field] as string[];
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map(opt => {
          const isSelected = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggleMulti(field, opt)}
              style={{
                display: "inline-flex", alignItems: "center", borderRadius: 999,
                padding: "7px 16px", fontSize: 13,
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontWeight: 400, lineHeight: "1.4",
                borderStyle: "solid", borderWidth: "0.5px",
                borderColor: isSelected ? gold : pillBorder,
                backgroundColor: isSelected ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                color: isSelected ? gold : pillText,
                cursor: "pointer", transition: "border-color 0.15s, background-color 0.15s, color 0.15s",
                outline: "none", whiteSpace: "nowrap",
                WebkitAppearance: "none", appearance: "none",
              }}
            >{opt}</button>
          );
        })}
      </div>
    );
  }

  // ── Computed ───────────────────────────────────────────────────────────────

  const hsSuggestions = answers.high_school_name.length > 0
    ? HIGH_SCHOOLS.filter(s => s.toLowerCase().includes(answers.high_school_name.toLowerCase())).slice(0, 6)
    : [];

  const countrySuggestions = answers.country.length > 0
    ? COUNTRIES.filter(c => c.toLowerCase().includes(answers.country.toLowerCase())).slice(0, 8)
    : [];

  const isUSA = answers.country === "United States";
  const stateSuggestions = isUSA && answers.state.length > 0
    ? US_STATES.filter(s => s.toLowerCase().includes(answers.state.toLowerCase())).slice(0, 8)
    : [];

  const hasResearchActive =
    answers.has_research === "Yes \— I have" || answers.has_research === "In progress";

  // ── Activity card (onboarding + edit view) ─────────────────────────────────

  function renderActivityCard(act: Activity, index: number) {
    const isExpanded = expandedActivities[index] ?? true;
    const checkboxStyle: React.CSSProperties = { accentColor: gold, width: 14, height: 14, cursor: "pointer" };

    return (
      <div key={index} style={{ border: `0.5px solid ${border}`, borderRadius: 12, overflow: "visible", marginBottom: 10 }}>
        {/* Card header */}
        <div
          onClick={() => toggleActivityExpand(index)}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px", cursor: "pointer",
            backgroundColor: surface, borderRadius: isExpanded ? "12px 12px 0 0" : 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, color: act.activity_type ? text : muted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {act.activity_type
              ? `${act.activity_type}${act.organization ? ` — ${act.organization}` : ""}`
              : `Activity ${index + 1}`}
          </div>
          <div style={{ color: muted, fontSize: 11, fontFamily: "system-ui, -apple-system, sans-serif", userSelect: "none" }}>
            {isExpanded ? "▲" : "▼"}
          </div>
        </div>

        {isExpanded && (
          <div style={{
            padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 16,
            backgroundColor: surface, borderRadius: "0 0 12px 12px",
            borderTop: `0.5px solid ${border}`,
          }}>
            <div style={{ paddingTop: 16 }}>
              {renderLabel("Activity type")}
              <select style={selectStyle} value={act.activity_type}
                onChange={e => updateActivity(index, "activity_type", e.target.value)}>
                <option value="">Select type…</option>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              {renderLabel("Position / Leadership description")}
              <input style={inputStyle} type="text" maxLength={50}
                placeholder="e.g. Team Captain, Club President"
                value={act.position}
                onChange={e => updateActivity(index, "position", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.position.length}/50</div>
            </div>

            <div>
              {renderLabel("Organization Name")}
              <input style={inputStyle} type="text" maxLength={100}
                placeholder="e.g. Lincoln High School Debate Team"
                value={act.organization}
                onChange={e => updateActivity(index, "organization", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.organization.length}/100</div>
            </div>

            <div>
              {renderLabel("Description")}
              <textarea style={{ ...textareaStyle, minHeight: 72 }} maxLength={150}
                placeholder="Describe this activity, including what you accomplished and any recognition you received…"
                value={act.description}
                onChange={e => updateActivity(index, "description", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.description.length}/150</div>
            </div>

            <div>
              {renderLabel("Grade levels")}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {(["grade_9","grade_10","grade_11","grade_12","grade_pg"] as (keyof Activity)[]).map((key, i) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    <input type="checkbox" style={checkboxStyle} checked={act[key] as boolean}
                      onChange={e => updateActivity(index, key, e.target.checked)} />
                    {["9","10","11","12","PG"][i]}
                  </label>
                ))}
              </div>
            </div>

            <div>
              {renderLabel("Timing")}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {([
                  ["timing_school_year",  "During school year"],
                  ["timing_school_break", "During school break"],
                  ["timing_all_year",     "All year"],
                ] as [keyof Activity, string][]).map(([key, label]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    <input type="checkbox" style={checkboxStyle} checked={act[key] as boolean}
                      onChange={e => updateActivity(index, key, e.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                {renderLabel("Hours / week")}
                <input style={inputStyle} type="number" min={0} max={168} placeholder="e.g. 5"
                  value={act.hours_per_week}
                  onChange={e => updateActivity(index, "hours_per_week", e.target.value)} />
              </div>
              <div>
                {renderLabel("Weeks / year")}
                <input style={inputStyle} type="number" min={0} max={52} placeholder="e.g. 36"
                  value={act.weeks_per_year}
                  onChange={e => updateActivity(index, "weeks_per_year", e.target.value)} />
              </div>
            </div>

            <div>
              {renderLabel("Continue similar activity in college?")}
              <div style={{ display: "flex", gap: 8 }}>
                {["Yes", "No"].map(opt => (
                  <button key={opt} type="button"
                    onClick={() => updateActivity(index, "continue_in_college", act.continue_in_college === opt ? "" : opt)}
                    style={{
                      padding: "7px 20px", fontSize: 13, borderRadius: 999,
                      borderStyle: "solid", borderWidth: "0.5px",
                      borderColor: act.continue_in_college === opt ? gold : pillBorder,
                      backgroundColor: act.continue_in_college === opt ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
                      color: act.continue_in_college === opt ? gold : pillText,
                      cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif",
                      WebkitAppearance: "none", appearance: "none",
                    }}
                  >{opt}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Questionnaire group content (9 steps) ────────────────────────────────────

  function renderGroupContent() {
    switch (currentGroup) {

      // ── STEP 1: Basic Info ──────────────────────────────────────────────────
      case 0:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("Full name")}
              <input style={inputStyle} type="text" placeholder="Your full name" autoFocus
                value={answers.full_name} onChange={e => setA("full_name", e.target.value)} />
            </div>
            <div>
              {renderLabel("What year are you in school?")}
              {renderPills("education_status", ["Sophomore", "Junior", "Senior", "Gap Year", "Other"])}
            </div>
            <div>
              {renderLabel("When do you graduate high school?")}
              {renderPills("graduation_year", ["2025", "2026", "2027", "2028", "Other"])}
            </div>
            <div style={{ position: "relative" }}>
              {renderLabel("Which high school do you attend?")}
              <input style={inputStyle} type="text" placeholder="Start typing your school…"
                value={answers.high_school_name}
                onChange={e => { setA("high_school_name", e.target.value); setHsOpen(true); }}
                onFocus={() => { if (answers.high_school_name) setHsOpen(true); }}
                onBlur={() => setTimeout(() => setHsOpen(false), 150)} />
              {hsOpen && hsSuggestions.length > 0 && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: surface, border: `0.5px solid ${border}`, borderRadius: 8, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)", maxHeight: 220, overflowY: "auto" }}>
                  {hsSuggestions.map(s => (
                    <button key={s} type="button" onMouseDown={e => e.preventDefault()}
                      onClick={() => { setA("high_school_name", s); setHsOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, color: text, background: "transparent", border: "none", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>
            <div>
              {renderLabel("GPA (out of 4.0)")}
              <input style={inputStyle} type="number" min={0} max={4} step={0.01} placeholder="e.g. 3.85"
                value={answers.gpa} onChange={e => setA("gpa", e.target.value)} />
            </div>
            <div>
              {renderLabel("Class rank")}
              {renderPills("class_rank", ["Top 1%", "Top 5%", "Top 10%", "Top 25%", "Top 50%", "Not ranked", "Prefer not to say"])}
            </div>
          </div>
        );

      // ── STEP 2: Academics ──────────────────────────────────────────────────
      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("What are your main academic interests?")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Subjects, disciplines, or areas you genuinely care about — not just what looks good.
              </div>
              <textarea style={{ ...textareaStyle, height: 96 }} maxLength={400}
                placeholder="e.g. I'm obsessed with the intersection of neuroscience and education — why some people learn faster and what that means for how we teach..."
                value={answers.passion_description}
                onChange={e => setA("passion_description", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.passion_description.length}/400</div>
            </div>
            <div>
              {renderLabel("What are you planning to study? (intended major)")}
              <textarea style={{ ...textareaStyle, height: 72 }} maxLength={200}
                placeholder="e.g. Computer Science, or somewhere between economics and public policy — I'm not sure yet..."
                value={answers.why_this_major}
                onChange={e => setA("why_this_major", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.why_this_major.length}/200</div>
            </div>
            <div>
              {renderLabel("Interests & hobbies outside school")}
              {renderMultiPills("hobbies", HOBBIES)}
            </div>
          </div>
        );

      // ── STEP 3: Activities ─────────────────────────────────────────────────
      case 2:
        return (
          <div style={{ color: text }}>
            {/* PDF Import Banner */}
            <div style={{ background: "rgba(154,112,64,0.08)", border: "1px solid rgba(154,112,64,0.35)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9a7040" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: text, marginBottom: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>Import from Common App</div>
                <div style={{ fontSize: 12, color: muted, fontFamily: "system-ui, -apple-system, sans-serif" }}>Upload your CommonApp PDF to auto-fill your activities instantly</div>
              </div>
              <div>
                <input ref={secondaryFileRef} type="file" accept="application/pdf" multiple style={{ display: "none" }}
                  onChange={async e => {
                    if (!e.target.files) return;
                    const pdfs = Array.from(e.target.files).filter(f => f.type === "application/pdf");
                    const converted = await Promise.all(pdfs.map(async f => {
                      const base64 = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = ev => resolve((ev.target?.result as string).split(",")[1]);
                        reader.onerror = reject;
                        reader.readAsDataURL(f);
                      });
                      return { name: f.name, base64 };
                    }));
                    setSecondaryFiles(converted);
                    e.target.value = "";
                  }} />
                {secondaryFiles.length === 0 ? (
                  <button type="button" onClick={() => secondaryFileRef.current?.click()}
                    style={{ fontSize: 13, color: "#9a7040", background: "transparent", border: "1px solid #9a7040", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, WebkitAppearance: "none", appearance: "none", whiteSpace: "nowrap" }}>
                    Browse PDF
                  </button>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, alignItems: "flex-end" }}>
                    <div style={{ fontSize: 12, color: text, fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{secondaryFiles[0].name}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button type="button" disabled={secondaryUploading} onClick={async () => {
                        setSecondaryUploading(true);
                        try {
                          const res = await fetch("/api/parse-common-app", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ files: secondaryFiles }) });
                          if (res.ok) {
                            const data = await res.json();
                            if (Array.isArray(data.activities) && data.activities.length > 0) {
                              const mapped = mapParsedActivities(data.activities);
                              setActivities(mapped);
                              setExpandedActivities(mapped.map((_, i) => i === 0));
                            }
                          }
                        } catch { /* silently fail */ }
                        setSecondaryUploading(false);
                        setSecondaryFiles([]);
                      }} style={{ fontSize: 12, color: isDark ? "#080810" : "#FAFAF5", background: "#9a7040", border: "none", borderRadius: 7, padding: "6px 14px", cursor: secondaryUploading ? "not-allowed" : "pointer", opacity: secondaryUploading ? 0.7 : 1, fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
                        {secondaryUploading ? "Importing…" : "Import →"}
                      </button>
                      <button type="button" onClick={() => setSecondaryFiles([])}
                        style={{ fontSize: 12, color: muted, background: "transparent", border: `0.5px solid ${border}`, borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {activities.map((act, i) => renderActivityCard(act, i))}
            {activities.length < 10 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                <button type="button"
                  onClick={() => { setActivities(prev => [...prev, { ...EMPTY_ACTIVITY }]); setExpandedActivities(prev => [...prev, true]); }}
                  style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${gold}`, backgroundColor: "transparent", color: gold, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitAppearance: "none", appearance: "none" }}>+</button>
              </div>
            )}
          </div>
        );

      // ── STEP 4: College Preferences ────────────────────────────────────────
      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("Type of school (select all that apply)")}
              {renderMultiSelectPills(["Public", "Private", "Liberal Arts", "Research University", "Technical / STEM", "All of the above"], answers.school_type, toggleSchoolType)}
            </div>
            <div>
              {renderLabel("Campus environment (select all that apply)")}
              {renderMultiSelectPills(["Urban city", "College town", "Suburban", "Rural", "All of the above"], answers.campus_environment, toggleCampusEnv)}
            </div>
            <div>
              {renderLabel("Campus size")}
              {renderPills("campus_size", ["Small (under 3,000)", "Medium (3,000–10,000)", "Large (10,000–20,000)", "Very large (20,000+)", "No preference"])}
            </div>
            <div>
              {renderLabel("Social culture (select all that apply)")}
              {renderMultiSelectPills(["Greek life", "No Greek life", "Division I sports", "Quiet/studious", "Artsy and creative", "Very competitive", "Collaborative", "Party scene", "No preference"], answers.social_culture, toggleSocialCulture)}
            </div>
            <div>
              {renderLabel("Distance from home")}
              {renderPills("distance_preference", ["Close (under 2 hrs)", "Moderate (2–5 hrs)", "Far (5+ hrs)", "No preference"])}
            </div>
            <div>
              {renderLabel("Climate")}
              {renderPills("climate_preference", ["Warm and sunny", "Cold winters", "Mild year-round", "No preference"])}
            </div>
            <div>
              {renderLabel("Financial aid need")}
              {renderPills("financial_aid_need", ["Need full aid", "Need partial aid", "Full pay", "Unsure"])}
            </div>
          </div>
        );

      // ── STEP 5: Background ─────────────────────────────────────────────────
      case 4:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("US citizenship or residency status")}
              {renderPills("us_citizenship", ["US citizen", "Dual citizen", "Permanent resident", "Not a US citizen"])}
            </div>
            {answers.us_citizenship === "Dual citizen" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  {renderLabel("Primary citizenship country")}
                  <select value={answers.country} onChange={e => setA("country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  {renderLabel("Second citizenship country")}
                  <select value={answers.second_citizenship_country} onChange={e => setA("second_citizenship_country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">Select country…</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
            {(answers.us_citizenship === "US citizen" || answers.us_citizenship === "Permanent resident") && (
              <div>
                {renderLabel("US state of residence")}
                <select value={answers.us_resident_state} onChange={e => setA("us_resident_state", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select a state…</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {answers.us_citizenship === "Not a US citizen" && (
              <div>
                {renderLabel("Country of origin")}
                <select value={answers.country} onChange={e => setA("country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div>
              {renderLabel("Phone number")}
              <input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000"
                value={answers.phone}
                onChange={e => { const c = e.target.value.replace(/[^\d+\(\)\-\s]/g, ""); setA("phone", c); }} />
            </div>
            <div>
              {renderLabel("Are you a first-generation college student?")}
              {renderPills("first_gen", ["Yes", "No", "Prefer not to say"])}
            </div>
          </div>
        );

      // ── STEP 6: Standardized Testing ───────────────────────────────────────
      case 5:
        return (
          <div style={{ color: text }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 28px" }}>
              {/* Left: US Tests */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>U.S. Tests</div>
                <div>
                  {renderLabel("SAT Total Score")}
                  <input style={inputStyle} type="number" min={400} max={1600} placeholder="e.g. 1480"
                    value={answers.sat_score} onChange={e => setA("sat_score", e.target.value)} />
                </div>
                <div>
                  {renderLabel("ACT Composite Score")}
                  <input style={inputStyle} type="number" min={1} max={36} placeholder="e.g. 32"
                    value={answers.act_score} onChange={e => setA("act_score", e.target.value)} />
                </div>
                <div style={{ fontSize: 12, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", fontStyle: "italic" }}>
                  Leave blank if not taken or not submitting
                </div>
              </div>
              {/* Vertical divider */}
              <div style={{ background: border, width: 1 }} />
              {/* Right: English Proficiency */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>English Proficiency</div>
                <div>
                  {renderLabel("Test type")}
                  {renderPills("english_test_type", ["TOEFL", "IELTS", "Duolingo", "Not yet", "Not required"])}
                </div>
                {(answers.english_test_type === "TOEFL" || answers.english_test_type === "IELTS" || answers.english_test_type === "Duolingo") && (
                  <div>
                    {renderLabel("Score")}
                    <input style={inputStyle} type="number" placeholder="Enter your score"
                      value={answers.english_test_score} onChange={e => setA("english_test_score", e.target.value)} />
                  </div>
                )}
                <div style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: muted, lineHeight: 1.6, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  Complete only if English is not your first language or your school requires it.
                </div>
              </div>
            </div>
          </div>
        );

      // ── STEP 7: Essays & Goals ─────────────────────────────────────────────
      case 6:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("Why this major or field?")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Not the polished version — the real reason. What pulled you toward this?
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} maxLength={500}
                placeholder="e.g. I took one statistics class and realized I'd been thinking about data completely wrong my whole life. Now I can't stop..."
                value={answers.why_this_major}
                onChange={e => setA("why_this_major", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.why_this_major.length}/500</div>
            </div>
            <div>
              {renderLabel("Career goals")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Where do you see yourself in 10 years? What problem do you want to work on?
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} maxLength={500}
                placeholder="e.g. I want to work on the healthcare access problem — specifically figuring out why rural hospitals keep closing and what policy could actually fix it..."
                value={answers.career_goals}
                onChange={e => setA("career_goals", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.career_goals.length}/500</div>
            </div>
            <div>
              {renderLabel("Essay topic ideas (optional)")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Any experiences, moments, or stories you&apos;re considering writing about? Even vague ideas help.
              </div>
              <textarea style={{ ...textareaStyle, height: 88 }} maxLength={400}
                placeholder="e.g. The summer I spent learning glassblowing with my grandfather. The time I crashed a moot court competition I wasn't registered for..."
                value={answers.essay_topics}
                onChange={e => setA("essay_topics", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.essay_topics.length}/400</div>
            </div>
          </div>
        );

      // ── STEP 8: Financial Aid ──────────────────────────────────────────────
      case 7:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("Estimated family income bracket")}
              {renderPills("family_income_bracket", [
                "Under $40K", "$40K–$80K", "$80K–$130K", "$130K–$200K", "Over $200K", "Prefer not to say"
              ])}
            </div>
            <div>
              {renderLabel("Are you planning to file a CSS Profile?")}
              {renderPills("css_profile_aware", ["Yes, already filed", "Yes, planning to", "Not sure", "No — schools don't require it"])}
            </div>
            <div style={{ background: isDark ? "rgba(201,169,110,0.07)" : "rgba(154,112,64,0.05)", border: `0.5px solid ${gold}55`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ fontSize: 13, color: muted, lineHeight: 1.7, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                The CSS Profile is required by ~400 colleges (mostly private) for institutional aid. It&apos;s different from FAFSA and often unlocks significantly more aid. If you haven&apos;t looked into it, check the College Board website.
              </div>
            </div>
          </div>
        );

      // ── STEP 9: About You ──────────────────────────────────────────────────
      case 8:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            {/* Section A */}
            {[
              { label: "What do you do when nobody is watching?", field: "private_passion" as keyof Answers, placeholder: "e.g. I rewrite Wikipedia articles I think are wrong. I make elaborate playlists for moods that don't have names...", max: 300 },
              { label: "Is there anything about you that would surprise people who know you well?", field: "unusual_trait" as keyof Answers, placeholder: "e.g. I have a second life as a competitive crossword puzzle writer...", max: 300 },
              { label: "What's something you completely changed your mind about?", field: "changed_mind" as keyof Answers, placeholder: "e.g. I used to think discipline was everything. Then I read about luck in outcomes research and it broke my model...", max: 300 },
              { label: "Who or what has most influenced how you think?", field: "meaningful_influence" as keyof Answers, placeholder: "e.g. My grandfather's stories about working as a translator during the Cold War changed how I see language...", max: 300 },
            ].map(({ label, field, placeholder, max }) => (
              <div key={field}>
                {renderLabel(label)}
                <textarea style={{ ...textareaStyle, height: 96 }} maxLength={max}
                  placeholder={placeholder}
                  value={answers[field] as string}
                  onChange={e => setA(field, e.target.value)} />
                <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{(answers[field] as string).length}/{max}</div>
              </div>
            ))}

            {/* Section B — Optional */}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: 32, marginTop: 8 }}>
              <div style={{ border: "1px solid rgba(154,112,64,0.3)", background: "rgba(154,112,64,0.04)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <span style={{ color: gold, fontSize: 20, lineHeight: 1.2, marginTop: 2, flexShrink: 0 }}>✦</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: gold, marginBottom: 8, fontFamily: "system-ui, -apple-system, sans-serif" }}>Optional — but worth it</div>
                    <div style={{ fontSize: 13, color: muted, lineHeight: 1.7, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Everything below is completely optional. These questions help SheldonAI understand the real you — not just your grades and clubs. Your answers are used to generate essay angles, make your application feel human, and surface the kind of details admissions officers actually remember. Answer none, one, or all. Even one honest answer makes a difference. There are no wrong answers here.
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  {renderLabel("What's the most embarrassing thing you're genuinely proud of?")}
                  <textarea style={{ ...textareaStyle, height: 96 }} maxLength={400}
                    placeholder="e.g. I've memorized the capital cities of every sovereign nation on Earth. I can name every Pope in order..."
                    value={answers.embarrassing_pride}
                    onChange={e => setA("embarrassing_pride", e.target.value)} />
                  <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.embarrassing_pride.length}/400</div>
                </div>
                <div>
                  {renderLabel("What problem would you work on if success was guaranteed?")}
                  <textarea style={{ ...textareaStyle, height: 96 }} maxLength={400}
                    placeholder="e.g. I would figure out why teenagers stop reading for pleasure and fix it..."
                    value={answers.guaranteed_success}
                    onChange={e => setA("guaranteed_success", e.target.value)} />
                  <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.guaranteed_success.length}/400</div>
                </div>
                <div>
                  {renderLabel("What's something about you that would never appear on your activities list?")}
                  <textarea style={{ ...textareaStyle, height: 96 }} maxLength={400}
                    placeholder="e.g. I've been doing my family's taxes since I was 14. I can identify any bird by its call. I collect ceramic frogs from every country I visit..."
                    value={answers.unique_personal_trait}
                    onChange={e => setA("unique_personal_trait", e.target.value)} />
                  <div style={{ fontSize: 12, color: muted, marginTop: 6, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                    Too weird, too personal, too niche, too non-academic — but genuinely you. These are often the most memorable details in any application.
                  </div>
                  <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.unique_personal_trait.length}/400</div>
                </div>
                <div>
                  {renderLabel("Anything else?")}
                  <textarea style={{ ...textareaStyle, height: 120 }} maxLength={600}
                    placeholder="This is a free space. Write whatever you want. Something that doesn't fit anywhere else. Something strange, personal, or important that you haven't had a chance to say."
                    value={answers.anything_else}
                    onChange={e => setA("anything_else", e.target.value)} />
                  <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{answers.anything_else.length}/600</div>
                </div>
              </div>
            </div>
          </div>
        );

      // ── OLD PLACEHOLDER (should not render) ────────────────────────────────
      case 9:
        return null;
      case 10:
        return null;

      case 99999: // dead code — kept only so old references below compile
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("Full name")}
              <input style={inputStyle} type="text" placeholder="Your full name" autoFocus
                value={answers.full_name} onChange={e => setA("full_name", e.target.value)} />
            </div>
            <div>
              {renderLabel("Date of birth")}
              <input style={inputStyle} type="date"
                value={answers.birthday} onChange={e => setA("birthday", e.target.value)} />
            </div>
            <div>
              {renderLabel("Gender")}
              {renderPills("gender", ["Male", "Female", "Non-binary", "Prefer not to say"])}
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("Ethnicity")}
              {renderPills("ethnicity", [
                "American Indian/Alaska Native", "Asian", "Black/African American",
                "Hispanic/Latino", "Native Hawaiian/Pacific Islander", "White/Caucasian",
                "Two or more races", "Prefer not to say", "Other",
              ])}
              {answers.ethnicity === "Other" && (
                <input style={{ ...inputStyle, marginTop: 12 }} type="text" placeholder="Please describe"
                  value={answers.ethnicity_other} onChange={e => setA("ethnicity_other", e.target.value)} />
              )}
            </div>
            <div>
              {renderLabel("Religion")}
              {renderPills("religion", [
                "Agnostic", "Atheist", "Buddhist", "Catholic", "Christian",
                "Eastern Orthodox", "Hindu", "Jewish", "Muslim", "Sikh",
                "Prefer not to say", "Other",
              ])}
              {answers.religion === "Other" && (
                <input style={{ ...inputStyle, marginTop: 12 }} type="text" placeholder="Please describe"
                  value={answers.religion_other} onChange={e => setA("religion_other", e.target.value)} />
              )}
            </div>
            <div>
              {renderLabel("Ability to pay for college")}
              {renderPills("ability_to_pay", ["Full Pay", "Need Financial Aid", "Partial Aid", "Not Sure", "Prefer not to say"])}
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("What year are you in school?")}
              {renderPills("education_status", ["Sophomore", "Junior", "Senior", "Gap Year", "Other"])}
            </div>
            <div>
              {renderLabel("When do you graduate high school?")}
              {renderPills("graduation_year", ["2025", "2026", "2027", "2028", "Other"])}
            </div>
            <div>
              {renderLabel("When do you hope to start college?")}
              {renderPills("start_semester", ["Fall 2025", "Spring 2026", "Fall 2026", "Spring 2027", "Fall 2027", "Not sure"])}
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div style={{ position: "relative" }}>
              {renderLabel("Which high school do you attend?")}
              <input style={inputStyle} type="text" placeholder="Start typing your school\…"
                value={answers.high_school_name}
                onChange={e => { setA("high_school_name", e.target.value); setHsOpen(true); }}
                onFocus={() => { if (answers.high_school_name) setHsOpen(true); }}
                onBlur={() => setTimeout(() => setHsOpen(false), 150)} />
              {hsOpen && hsSuggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50,
                  background: surface, border: `0.5px solid ${border}`, borderRadius: 8,
                  boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
                  maxHeight: 220, overflowY: "auto",
                }}>
                  {hsSuggestions.map(s => (
                    <button key={s} type="button" onMouseDown={e => e.preventDefault()}
                      onClick={() => { setA("high_school_name", s); setHsOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, color: text, background: "transparent", border: "none", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >{s}</button>
                  ))}
                </div>
              )}
            </div>
            <div>
              {renderLabel("GPA (out of 4.0)")}
              <input style={inputStyle} type="number" min={0} max={4} step={0.01} placeholder="e.g. 3.85"
                value={answers.gpa} onChange={e => setA("gpa", e.target.value)} />
            </div>
            <div>
              {renderLabel("Class rank")}
              {renderPills("class_rank", ["Top 1%", "Top 5%", "Top 10%", "Top 25%", "Top 50%", "Not ranked", "Prefer not to say"])}
            </div>
          </div>
        );

      // GROUP 4 — Activities (Common App style)
      case 4:
        return (
          <div style={{ color: text }}>
            {activities.map((act, i) => renderActivityCard(act, i))}
            {activities.length < 10 && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setActivities(prev => [...prev, { ...EMPTY_ACTIVITY }]);
                    setExpandedActivities(prev => [...prev, true]);
                  }}
                  style={{
                    width: 40, height: 40, borderRadius: "50%",
                    border: `1.5px solid ${gold}`, backgroundColor: "transparent",
                    color: gold, fontSize: 22, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    WebkitAppearance: "none", appearance: "none",
                  }}
                >+</button>
              </div>
            )}
            {/* PDF Import Banner — Change 1 */}
            <div style={{ marginTop: 24, borderTop: `0.5px solid ${border}`, paddingTop: 20 }}>
              <div style={{ background: "rgba(154,112,64,0.08)", border: "1px solid rgba(154,112,64,0.35)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9a7040" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0a0a12", marginBottom: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>Import from Common App</div>
                  <div style={{ fontSize: 12, color: "rgba(10,10,18,0.5)", fontFamily: "system-ui, -apple-system, sans-serif" }}>Upload your CommonApp PDF to auto-fill your activities instantly</div>
                </div>
                <div>
                  <input ref={secondaryFileRef} type="file" accept="application/pdf" multiple style={{ display: "none" }}
                    onChange={async e => {
                      if (!e.target.files) return;
                      const pdfs = Array.from(e.target.files).filter(f => f.type === "application/pdf");
                      const converted = await Promise.all(pdfs.map(async f => {
                        const base64 = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = ev => resolve((ev.target?.result as string).split(",")[1]);
                          reader.onerror = reject;
                          reader.readAsDataURL(f);
                        });
                        return { name: f.name, base64 };
                      }));
                      setSecondaryFiles(converted);
                      e.target.value = "";
                    }} />
                  {secondaryFiles.length === 0 ? (
                    <button type="button" onClick={() => secondaryFileRef.current?.click()}
                      style={{ fontSize: 13, color: "#9a7040", background: "transparent", border: "1px solid #9a7040", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, WebkitAppearance: "none", appearance: "none", whiteSpace: "nowrap" }}>
                      Browse PDF
                    </button>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, alignItems: "flex-end" }}>
                      <div style={{ fontSize: 12, color: text, fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{secondaryFiles[0].name}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" disabled={secondaryUploading} onClick={async () => {
                          setSecondaryUploading(true);
                          try {
                            const res = await fetch("/api/parse-common-app", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ files: secondaryFiles }),
                            });
                            if (res.ok) {
                              const data = await res.json();
                              if (Array.isArray(data.activities) && data.activities.length > 0) {
                                const mapped = mapParsedActivities(data.activities);
                                setActivities(mapped);
                                setExpandedActivities(mapped.map((_, i) => i === 0));
                              }
                            }
                          } catch { /* silently fail */ }
                          setSecondaryUploading(false);
                          setSecondaryFiles([]);
                        }}
                          style={{ fontSize: 12, color: isDark ? "#080810" : "#FAFAF5", background: "#9a7040", border: "none", borderRadius: 7, padding: "6px 14px", cursor: secondaryUploading ? "not-allowed" : "pointer", opacity: secondaryUploading ? 0.7 : 1, fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
                          {secondaryUploading ? "Importing…" : "Import →"}
                        </button>
                        <button type="button" onClick={() => setSecondaryFiles([])}
                          style={{ fontSize: 12, color: muted, background: "transparent", border: `0.5px solid ${border}`, borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            {/* Optional personality banner */}
            <div style={{ border: "1px solid rgba(154,112,64,0.25)", background: "rgba(154,112,64,0.04)", borderRadius: 12, padding: "16px 20px", marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 18, color: "#9a7040", lineHeight: 1.3 }}>★</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#9a7040", marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>This section is optional</div>
                  <div style={{ fontSize: 12, color: muted, lineHeight: 1.65, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    These questions help SheldonAI understand you as a person — not just a student. Your answers are used to generate essay angles, make your application feel distinctly human, and surface moments from your life that admissions officers actually remember. You don&apos;t need to answer all of them. Even one honest answer helps. The stranger and more specific, the better.
                  </div>
                </div>
              </div>
            </div>
            <div>
              {renderLabel("Tell us about a time you completely changed your mind about something important.")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                What did you used to believe? What changed? This reveals intellectual honesty.
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={500}
                placeholder="e.g. I used to believe that discipline alone determined success until I learned about..."
                value={answers.changed_mind}
                onChange={e => setA("changed_mind", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                {answers.changed_mind.length}/500
              </div>
            </div>
            <div>
              {renderLabel("What's the most meaningful thing you've ever made, built, or created?")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Could be a project, a piece of writing, a relationship, a system, or something no one else saw.
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={500}
                placeholder="e.g. I spent a year building a free tutoring service for undocumented students in my city..."
                value={answers.meaningful_influence}
                onChange={e => setA("meaningful_influence", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                {answers.meaningful_influence.length}/500
              </div>
            </div>
            <div>
              {renderLabel("If you could dedicate your life to solving one problem in the world, what would it be?")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                Be specific. "World peace" is not an answer. Admissions officers want to see how you think.
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={500}
                placeholder="e.g. The lack of early literacy intervention for children in rural areas who are two grade levels behind..."
                value={answers.world_problem}
                onChange={e => setA("world_problem", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                {answers.world_problem.length}/500
              </div>
            </div>
            <div>
              {renderLabel("What's something about you that would never appear on your activities list?")}
              <div style={{ fontSize: 13, color: muted, marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>
                This is for things that are too weird, too personal, too niche, or too non-academic to go anywhere else — but that make you genuinely you. These are often the most memorable details in an application.
              </div>
              <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={400}
                placeholder="e.g. I've been doing my family's taxes since I was 14. I collect ceramic frogs from every country I visit. I can identify any bird by its call..."
                value={answers.unique_personal_trait}
                onChange={e => setA("unique_personal_trait", e.target.value)} />
              <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                {answers.unique_personal_trait.length}/400
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div style={{ color: text }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: "0 24px" }}>
              {/* Left: US tests */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>U.S. Tests</div>
                {[
                  { label: "SAT Math", field: "sat_math" as keyof Answers, skipped: satMathSkipped, setSkipped: setSatMathSkipped, min: 200, max: 800, placeholder: "e.g. 750" },
                  { label: "SAT Reading/Writing", field: "sat_english" as keyof Answers, skipped: satRWSkipped, setSkipped: setSatRWSkipped, min: 200, max: 800, placeholder: "e.g. 750" },
                  { label: "ACT Composite", field: "act" as keyof Answers, skipped: actSkipped, setSkipped: setActSkipped, min: 1, max: 36, placeholder: "e.g. 33" },
                ].map(({ label, field, skipped, setSkipped, min, max, placeholder }) => (
                  <div key={field}>
                    {renderLabel(label)}
                    <input style={{ ...inputStyle, opacity: skipped ? 0.4 : 1 }}
                      type="number" min={min} max={max} placeholder={placeholder}
                      value={answers[field] as string} disabled={skipped}
                      onChange={e => setA(field, e.target.value)} />
                    <button type="button"
                      onClick={() => { if (skipped) setSkipped(false); else { setSkipped(true); setA(field, ""); } }}
                      style={{ backgroundColor: "transparent", borderWidth: 0, cursor: "pointer", fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif", color: muted, marginTop: 6, padding: 0, display: "block" }}>
                      {skipped ? "Undo skip" : "Skip if not taken"}
                    </button>
                  </div>
                ))}
              </div>
              {/* Divider */}
              <div style={{ background: border, width: 1 }} />
              {/* Right: English proficiency */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>English Proficiency (International)</div>
                <div>
                  {renderLabel("Test type")}
                  {renderPills("english_test_type", ["TOEFL iBT", "IELTS Academic", "Duolingo English Test", "Not yet", "Not required"])}
                </div>
                {(answers.english_test_type === "TOEFL iBT" || answers.english_test_type === "IELTS Academic" || answers.english_test_type === "Duolingo English Test") && (
                  <div>
                    {renderLabel("Score")}
                    <input style={inputStyle} type="number" placeholder="Enter score"
                      value={answers.english_test_score}
                      onChange={e => setA("english_test_score", e.target.value)} />
                  </div>
                )}
                <div style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: muted, lineHeight: 1.6, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  Only complete this section if English is not your first language or your school requires it.
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, color: text }}>
            <div>
              {renderLabel("US citizenship or residency status")}
              {renderPills("us_citizenship", ["US Citizen only", "Dual citizen", "Permanent Resident (Green Card)", "Visa Holder", "None of the above"])}
            </div>
            {(answers.us_citizenship === "US Citizen only" || answers.us_citizenship === "Dual citizen" || answers.us_citizenship === "Permanent Resident (Green Card)") && (
              <div>
                {renderLabel("Which US state are you a resident of?")}
                <select
                  value={answers.us_resident_state}
                  onChange={e => setA("us_resident_state", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select a state…</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            {answers.us_citizenship === "Dual citizen" && (
              <div>
                {renderLabel("Second citizenship country")}
                <select
                  value={answers.second_citizenship_country}
                  onChange={e => setA("second_citizenship_country", e.target.value)}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">Select country…</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <div style={{ position: "relative" }}>
              {renderLabel("Country of residence")}
              <input style={inputStyle} type="text" placeholder="e.g. United States"
                value={answers.country}
                onChange={e => { setA("country", e.target.value); setA("state", ""); setCountryOpen(true); }}
                onFocus={() => { if (answers.country) setCountryOpen(true); }}
                onBlur={() => setTimeout(() => setCountryOpen(false), 150)} />
              {countryOpen && countrySuggestions.length > 0 && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, backgroundColor: surface, borderStyle: "solid", borderWidth: "0.5px", borderColor: border, borderRadius: 8, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)", maxHeight: 220, overflowY: "auto" }}>
                  {countrySuggestions.map(c => (
                    <button key={c} type="button" onMouseDown={e => e.preventDefault()}
                      onClick={() => { setA("country", c); setA("state", ""); setCountryOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, color: text, backgroundColor: "transparent", borderWidth: 0, fontFamily: "system-ui, -apple-system, sans-serif", cursor: "pointer" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                    >{c}</button>
                  ))}
                </div>
              )}
            </div>
            <div>
              {renderLabel("Phone number")}
              <input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000"
                value={answers.phone}
                onChange={e => { const c = e.target.value.replace(/[^\d+\(\)\-\s]/g, ""); setA("phone", c); }} />
            </div>
          </div>
        );

      case 8:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("Campus environment (select all that apply)")}
              {renderMultiSelectPills(
                ["Urban city", "College town", "Suburban", "Rural", "All of the above"],
                answers.campus_environment,
                toggleCampusEnv,
              )}
            </div>
            <div>
              {renderLabel("Campus size")}
              {renderPills("campus_size", ["Small (under 3,000)", "Medium (3,000–10,000)", "Large (10,000–20,000)", "Very large (20,000+)", "No preference"])}
            </div>
            <div>
              {renderLabel("Type of school (select all that apply)")}
              {renderMultiSelectPills(
                ["Public", "Private", "Liberal Arts", "Research University", "Technical / STEM", "All of the above"],
                answers.school_type,
                toggleSchoolType,
              )}
            </div>
            <div>
              {renderLabel("Distance from home")}
              {renderPills("distance_preference", ["Close (under 2 hrs)", "Moderate (2–5 hrs)", "Far (5+ hrs)", "No preference"])}
            </div>
            <div>
              {renderLabel("Social culture (select all that apply)")}
              {renderMultiSelectPills(
                ["Greek life active", "No Greek life", "Division I sports", "Quiet academic", "Artsy and creative", "No preference"],
                answers.social_culture,
                toggleSocialCulture,
              )}
            </div>
            <div>
              {renderLabel("Academic intensity")}
              {renderPills("academic_intensity", ["Extremely rigorous", "Rigorous", "Balanced", "No preference"])}
            </div>
            <div>
              {renderLabel("Climate")}
              {renderPills("climate_preference", ["Warm and sunny", "Cold winters", "Mild year-round", "No preference"])}
            </div>
            <div>
              {renderLabel("Financial aid need")}
              {renderPills("financial_aid_need", ["Need full aid", "Need partial aid", "Full pay", "Unsure"])}
            </div>
          </div>
        );

      case 9: {
        const intlCountries = ENGLISH_SPEAKING_COUNTRIES;
        if (!answers.is_international && answers.country) {
          const autoVal = intlCountries.has(answers.country) ? "No" : "Yes";
          setTimeout(() => setA("is_international", autoVal), 0);
        }
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            <div>
              {renderLabel("Are you an international student?")}
              {renderPills("is_international", ["Yes", "No"])}
            </div>
            {answers.is_international === "No" && (
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.6 }}>
                Your SAT/ACT and English test info was collected in the previous step.
              </div>
            )}
            {answers.is_international === "Yes" && (
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.6 }}>
                Your English proficiency test details were collected in the Standardized Testing step. Proceed to continue.
              </div>
            )}
          </div>
        );
      }

      case 10:
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, color: text }}>
            {[
              { label: "What do you do at 11pm on a free Friday?", field: "friday_night" as keyof Answers, placeholder: "e.g. I rewatch the same three documentary series and reorganize my bookshelf...", max: 300 },
              { label: "What could you talk about for three hours without preparing?", field: "obsession_topic" as keyof Answers, placeholder: "e.g. The geopolitics of water rights in Central Asia...", max: 300 },
              { label: "What have you taught yourself that nobody asked you to learn?", field: "self_taught" as keyof Answers, placeholder: "e.g. I taught myself to read Ottoman Turkish to understand my great-grandmother's letters...", max: 300 },
              { label: "What do most people get completely wrong about something you know well?", field: "common_misconception" as keyof Answers, placeholder: "e.g. People think being good at math means being fast. It means being comfortable being stuck...", max: 300 },
              { label: "What is the most embarrassing thing you are genuinely proud of?", field: "embarrassing_pride" as keyof Answers, placeholder: "e.g. I have memorized the capital cities of every sovereign nation on Earth...", max: 300 },
              { label: "What problem would you work on if success was guaranteed?", field: "guaranteed_success" as keyof Answers, placeholder: "e.g. I would figure out why teenagers stop reading for pleasure and fix it...", max: 300 },
            ].map(({ label, field, placeholder, max }) => (
              <div key={field}>
                {renderLabel(label)}
                <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={max}
                  placeholder={placeholder}
                  value={answers[field] as string}
                  onChange={e => setA(field, e.target.value)} />
                <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  {(answers[field] as string).length}/{max}
                </div>
              </div>
            ))}

            {/* Optional section divider */}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: 28, marginTop: 8 }}>
              <div style={{ border: "1px solid rgba(154,112,64,0.25)", background: "rgba(154,112,64,0.04)", borderRadius: 12, padding: "16px 20px", marginBottom: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: gold, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>One Last Thing (Optional)</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.65, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  Everything below is completely optional. These questions exist for one reason: the more SheldonAI knows about the real you — not just your grades and clubs — the better it can package your application, generate essay angles, and make your story feel human and memorable. Answer none, one, or all. There are no wrong answers.
                </div>
              </div>
              {[
                { label: "What do you do when nobody is watching?", field: "private_passion" as keyof Answers, placeholder: "e.g. I rewrite Wikipedia articles I think are wrong. I make elaborate playlists for moods that don't have names..." },
                { label: "Is there anything about you that would surprise people who know you well?", field: "unusual_trait" as keyof Answers, placeholder: "e.g. I have a second life as a competitive crossword puzzle writer..." },
                { label: "Who or what has influenced the way you think most?", field: "meaningful_influence" as keyof Answers, placeholder: "e.g. My grandfather's stories about working as a translator during the Cold War..." },
                { label: "What's the most embarrassing thing you're genuinely proud of?", field: "embarrassing_pride" as keyof Answers, placeholder: "e.g. I have memorized the capital cities of every sovereign nation on Earth...", skipIfAlready: true },
                { label: "What problem would you work on if success was guaranteed?", field: "guaranteed_success" as keyof Answers, placeholder: "e.g. I would figure out why teenagers stop reading for pleasure...", skipIfAlready: true },
                { label: "Anything else? What's something about you that doesn't fit anywhere else — too strange, too personal, too niche — but feels important?", field: "anything_else" as keyof Answers, placeholder: "This is a free space. Write whatever you want." },
              ].filter(q => !("skipIfAlready" in q && q.skipIfAlready)).map(({ label, field, placeholder }) => (
                <div key={field} style={{ marginBottom: 24 }}>
                  {renderLabel(label)}
                  <textarea style={{ ...textareaStyle, height: 100 }} rows={4} maxLength={400}
                    placeholder={placeholder}
                    value={answers[field] as string}
                    onChange={e => setA(field, e.target.value)} />
                  <div style={{ fontSize: 12, color: muted, textAlign: "right", marginTop: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {(answers[field] as string).length}/400
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderLeft: `3px solid ${gold}`, paddingLeft: 14 }}>
              <p style={{ fontSize: 12, color: muted, lineHeight: 1.65, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                SheldonAI uses these answers to find essay angles that are genuinely surprising — the kind admissions officers remember. You are not being judged on how impressive these sound. The stranger and more honest, the more useful.
              </p>
            </div>
          </div>
        );

      default: return null;
    }
  }

  // ── Edit view helpers ──────────────────────────────────────────────────────

  function fieldVal(val: string | null | undefined) {
    if (val) return <span style={{ fontSize: 14, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>{val}</span>;
    return <span style={{ fontSize: 14, color: muted, fontStyle: "italic", fontFamily: "system-ui, -apple-system, sans-serif" }}>Not provided</span>;
  }

  function tagsList(tags: string[] | null | undefined) {
    if (!tags || tags.length === 0) return <span style={{ fontSize: 14, color: muted, fontStyle: "italic", fontFamily: "system-ui, -apple-system, sans-serif" }}>Not provided</span>;
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif", padding: "3px 10px", borderRadius: 999, border: `0.5px solid ${isDark ? "rgba(201,169,110,0.4)" : "rgba(154,112,64,0.4)"}`, color: gold, backgroundColor: isDark ? "rgba(201,169,110,0.08)" : "rgba(154,112,64,0.06)" }}>
            {t}
          </span>
        ))}
      </div>
    );
  }

  function fieldRow(label: string, content: React.ReactNode) {
    return (
      <div key={label}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: muted, marginBottom: 5, fontFamily: "system-ui, -apple-system, sans-serif" }}>
          {label}
        </div>
        {content}
      </div>
    );
  }

  function getSchoolColor(school: string): string {
    const s = school.toLowerCase();
    if (s.includes("harvard")) return "#A51C30";
    if (s.includes("yale")) return "#00356B";
    if (s.includes("princeton")) return "#FF8F00";
    if (s.includes("mit") || s.includes("massachusetts institute")) return "#A31F34";
    if (s.includes("stanford")) return "#8C1515";
    if (s.includes("columbia")) return "#003087";
    if (s.includes("upenn") || s.includes("university of pennsylvania")) return "#011F5B";
    if (s.includes("brown")) return "#4E3629";
    if (s.includes("dartmouth")) return "#00693E";
    if (s.includes("cornell")) return "#B31B1B";
    if (s.includes("duke")) return "#012169";
    if (s.includes("johns hopkins")) return "#002D72";
    if (s.includes("northwestern")) return "#4E2A84";
    if (s.includes("vanderbilt")) return "#866D4B";
    if (s.includes("georgetown")) return "#063463";
    if (s.includes("notre dame")) return "#0C2340";
    if (s.includes("rice")) return "#00205B";
    if (s.includes("chicago")) return "#800000";
    if (s.includes("caltech")) return "#FF6C0C";
    if (s.includes("tufts")) return "#3E8EDE";
    if (s.includes("emory")) return "#012169";
    if (s.includes("nyu")) return "#57068C";
    return gold;
  }

  function sectionCard(
    index: number,
    title: string,
    viewContent: React.ReactNode,
    editContent: React.ReactNode,
  ) {
    const editing = editingSection === index;
    return (
      <div key={index} style={{ backgroundColor: surface, border: `0.5px solid ${border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", paddingTop: 2 }}>
            {title}
          </div>
          {!editing && (
            <button
              onClick={() => { setDraftAnswers({ ...answers }); setDraftActivities([...activities]); setEditingSection(index); }}
              style={{ fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: gold, backgroundColor: "transparent", border: `0.5px solid ${gold}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer", WebkitAppearance: "none", appearance: "none", flexShrink: 0 }}
            >Edit section</button>
          )}
        </div>

        {editing ? (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>{editContent}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => saveSection(index)} disabled={sectionSaving}
                style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 8, padding: "9px 22px", cursor: sectionSaving ? "not-allowed" : "pointer", opacity: sectionSaving ? 0.7 : 1, WebkitAppearance: "none", appearance: "none" }}>
                {sectionSaving ? "Saving\…" : "Save changes"}
              </button>
              <button
                onClick={() => {
                  if (draftAnswers) setAnswers(draftAnswers);
                  if (draftActivities) setActivities(draftActivities);
                  setEditingSection(null);
                  setDraftAnswers(null);
                  setDraftActivities(null);
                }}
                style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: muted, backgroundColor: "transparent", border: `0.5px solid ${border}`, borderRadius: 8, padding: "9px 18px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>{viewContent}</div>
        )}
      </div>
    );
  }

  // ── Summary / Edit view ────────────────────────────────────────────────────

  function renderEditView() {
    const goldBorder = isDark ? "rgba(201,169,110,0.35)" : "rgba(154,112,64,0.35)";
    const goldBg     = isDark ? "rgba(201,169,110,0.04)" : "rgba(154,112,64,0.03)";
    const amberBg    = isDark ? "rgba(251,191,36,0.08)"  : "rgba(251,191,36,0.12)";
    const amberBorder= isDark ? "rgba(251,191,36,0.3)"   : "rgba(217,119,6,0.4)";
    const amberLabel = isDark ? "#fbbf24" : "#92400e";
    const amberText  = isDark ? "#fde68a" : "#78350f";

    const visibleActivities = activities.filter(a => !!a.activity_type);

    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px 80px" }}>

          {/* Back link */}
          <a href="/dashboard" style={{ fontSize: 13, color: muted, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>← Dashboard</a>

          {/* Header */}
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, color: text, marginBottom: 4, marginTop: 0, letterSpacing: "-0.3px" }}>
            {answers.full_name || "Your Profile"}
          </h1>
          <p style={{ fontSize: 14, color: muted, marginBottom: 28, marginTop: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Your Sheldon AI Profile
          </p>

          {/* Redo button */}
          {!showRedoConfirm ? (
            <div style={{ marginBottom: 28 }}>
              <button onClick={() => setShowRedoConfirm(true)}
                style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: isDark ? "#f87171" : "#b91c1c", backgroundColor: "transparent", border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`, borderRadius: 7, padding: "6px 14px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                Redo Profile Questionnaire
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 28, border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`, borderRadius: 10, padding: "16px 20px", backgroundColor: isDark ? "rgba(248,113,113,0.06)" : "rgba(185,28,28,0.05)" }}>
              <div style={{ fontSize: 14, color: isDark ? "#f87171" : "#b91c1c", marginBottom: 14, lineHeight: "1.5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                This will delete all your profile answers and restart from scratch. Are you sure?
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={handleRedo} style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#fff", backgroundColor: isDark ? "#f87171" : "#b91c1c", border: "none", borderRadius: 7, padding: "7px 16px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Yes, start over
                </button>
                <button onClick={() => setShowRedoConfirm(false)} style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: muted, backgroundColor: "transparent", border: `0.5px solid ${border}`, borderRadius: 7, padding: "7px 14px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis Card */}
          <div style={{ border: `1px solid ${goldBorder}`, borderRadius: 16, padding: "28px 32px", marginBottom: 24, backgroundColor: goldBg }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 500, color: text, marginBottom: 18 }}>Your Application Profile</div>
            {!analysis ? (
              <button onClick={analyzeProfile} disabled={analyzing}
                style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 8, padding: "10px 24px", cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.7 : 1, WebkitAppearance: "none", appearance: "none" }}>
                {analyzing ? "Analyzing\…" : "Analyze My Profile"}
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16, color: text, lineHeight: "1.65", margin: 0 }}>{analysis.summary}</p>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 14, fontFamily: "system-ui, -apple-system, sans-serif" }}>Essay Topic Directions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {analysis.essayTopics.map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: gold, fontFamily: "system-ui, -apple-system, sans-serif", minWidth: 18, lineHeight: "1.55", flexShrink: 0 }}>{i + 1}.</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: text, fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 3 }}>{t.topic}</div>
                          <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.55" }}>{t.why}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 14, fontFamily: "system-ui, -apple-system, sans-serif" }}>University Matches</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {analysis.universityMatches.map((m, i) => (
                      <div key={i}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: getSchoolColor(m.school), fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 3 }}>{m.school}</div>
                        <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>{m.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ backgroundColor: amberBg, border: `0.5px solid ${amberBorder}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: amberLabel, marginBottom: 8, fontFamily: "system-ui, -apple-system, sans-serif" }}>Strengthen This</div>
                  <div style={{ fontSize: 14, color: amberText, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.55" }}>{analysis.strengthenThis}</div>
                </div>
                <button onClick={analyzeProfile} disabled={analyzing}
                  style={{ fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif", color: gold, backgroundColor: "transparent", border: `0.5px solid ${gold}`, borderRadius: 6, padding: "6px 16px", cursor: analyzing ? "not-allowed" : "pointer", opacity: analyzing ? 0.7 : 1, alignSelf: "flex-start", WebkitAppearance: "none", appearance: "none" }}>
                  {analyzing ? "Analyzing\…" : "Re-analyze"}
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Basic Info */}
          {sectionCard(0, "Basic Info",
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
              {fieldRow("Full Name", fieldVal(answers.full_name))}
              {fieldRow("Year in School", fieldVal(answers.education_status))}
              {fieldRow("Graduation Year", fieldVal(answers.graduation_year))}
              {fieldRow("High School", fieldVal(answers.high_school_name))}
              {fieldRow("GPA", fieldVal(answers.gpa))}
              {fieldRow("Class Rank", fieldVal(answers.class_rank))}
            </div>,
            <>
              <div>{renderLabel("Full name")}<input style={inputStyle} type="text" placeholder="Your full name" value={answers.full_name} onChange={e => setA("full_name", e.target.value)} /></div>
              <div>{renderLabel("Year in school")}{renderPills("education_status", ["Sophomore", "Junior", "Senior", "Gap Year", "Other"])}</div>
              <div>{renderLabel("Graduation year")}{renderPills("graduation_year", ["2025", "2026", "2027", "2028", "Other"])}</div>
              <div style={{ position: "relative" }}>
                {renderLabel("High school")}
                <input style={inputStyle} type="text" placeholder="Start typing your school…" value={answers.high_school_name}
                  onChange={e => { setA("high_school_name", e.target.value); setHsOpen(true); }}
                  onFocus={() => { if (answers.high_school_name) setHsOpen(true); }}
                  onBlur={() => setTimeout(() => setHsOpen(false), 150)} />
                {hsOpen && hsSuggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 50, background: surface, border: `0.5px solid ${border}`, borderRadius: 8, maxHeight: 220, overflowY: "auto" }}>
                    {hsSuggestions.map(s => (
                      <button key={s} type="button" onMouseDown={e => e.preventDefault()} onClick={() => { setA("high_school_name", s); setHsOpen(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 14, color: text, background: "transparent", border: "none", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif" }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
              <div>{renderLabel("GPA (out of 4.0)")}<input style={inputStyle} type="number" min={0} max={4} step={0.01} placeholder="e.g. 3.85" value={answers.gpa} onChange={e => setA("gpa", e.target.value)} /></div>
              <div>{renderLabel("Class rank")}{renderPills("class_rank", ["Top 1%", "Top 5%", "Top 10%", "Top 25%", "Top 50%", "Not ranked", "Prefer not to say"])}</div>
            </>
          )}

          {/* Section 2: Academics */}
          {sectionCard(1, "Academics",
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fieldRow("Academic Interests", fieldVal(answers.passion_description))}
              {fieldRow("Intended Major", fieldVal(answers.why_this_major))}
              {fieldRow("Hobbies", tagsList(answers.hobbies))}
            </div>,
            <>
              <div>
                {renderLabel("Academic interests")}
                <textarea style={{ ...textareaStyle, height: 88 }} maxLength={400} placeholder="Subjects you genuinely care about…" value={answers.passion_description} onChange={e => setA("passion_description", e.target.value)} />
              </div>
              <div>
                {renderLabel("Intended major")}
                <textarea style={{ ...textareaStyle, height: 72 }} maxLength={200} placeholder="e.g. Computer Science, or undecided…" value={answers.why_this_major} onChange={e => setA("why_this_major", e.target.value)} />
              </div>
              <div>{renderLabel("Hobbies")}{renderMultiPills("hobbies", HOBBIES)}</div>
            </>
          )}

          {/* Section 3: Activities */}
          {sectionCard(2, "Activities",
            visibleActivities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {visibleActivities.map((a, i) => (
                  <div key={i} style={{ border: `0.5px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 4 }}>
                      {a.activity_type}{a.position ? ` — ${a.position}` : ""}
                    </div>
                    {a.organization && <div style={{ fontSize: 12, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 4 }}>{a.organization}</div>}
                    {a.description && <div style={{ fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>{a.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 14, color: muted, fontStyle: "italic", fontFamily: "system-ui, -apple-system, sans-serif" }}>Not provided</span>
            ),
            <div style={{ color: text }}>
              {activities.map((act, i) => renderActivityCard(act, i))}
              {activities.length < 10 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <button type="button"
                    onClick={() => { setActivities(prev => [...prev, { ...EMPTY_ACTIVITY }]); setExpandedActivities(prev => [...prev, true]); }}
                    style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${gold}`, backgroundColor: "transparent", color: gold, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitAppearance: "none", appearance: "none" }}>+</button>
                </div>
              )}
            </div>
          )}

          {/* Section 4: College Preferences */}
          {sectionCard(3, "College Preferences",
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fieldRow("Type of School", fieldVal(answers.school_type))}
              {fieldRow("Campus Environment", fieldVal(answers.campus_environment))}
              {fieldRow("Campus Size", fieldVal(answers.campus_size))}
              {fieldRow("Social Culture", fieldVal(answers.social_culture))}
              {fieldRow("Distance", fieldVal(answers.distance_preference))}
              {fieldRow("Climate", fieldVal(answers.climate_preference))}
              {fieldRow("Financial Aid Need", fieldVal(answers.financial_aid_need))}
            </div>,
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>{renderLabel("Type of school")}{renderMultiSelectPills(["Public", "Private", "Liberal Arts", "Research University", "Technical / STEM", "All of the above"], answers.school_type, toggleSchoolType)}</div>
              <div>{renderLabel("Campus environment")}{renderMultiSelectPills(["Urban city", "College town", "Suburban", "Rural", "All of the above"], answers.campus_environment, toggleCampusEnv)}</div>
              <div>{renderLabel("Campus size")}{renderPills("campus_size", ["Small (under 3,000)", "Medium (3,000–10,000)", "Large (10,000–20,000)", "Very large (20,000+)", "No preference"])}</div>
              <div>{renderLabel("Social culture")}{renderMultiSelectPills(["Greek life", "No Greek life", "Division I sports", "Quiet/studious", "Artsy and creative", "Very competitive", "Collaborative", "Party scene", "No preference"], answers.social_culture, toggleSocialCulture)}</div>
              <div>{renderLabel("Distance from home")}{renderPills("distance_preference", ["Close (under 2 hrs)", "Moderate (2–5 hrs)", "Far (5+ hrs)", "No preference"])}</div>
              <div>{renderLabel("Climate")}{renderPills("climate_preference", ["Warm and sunny", "Cold winters", "Mild year-round", "No preference"])}</div>
              <div>{renderLabel("Financial aid need")}{renderPills("financial_aid_need", ["Need full aid", "Need partial aid", "Full pay", "Unsure"])}</div>
            </div>
          )}

          {/* Section 5: Background */}
          {sectionCard(4, "Background",
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
              {fieldRow("US Citizenship", fieldVal(answers.us_citizenship))}
              {answers.us_resident_state && fieldRow("US State", fieldVal(answers.us_resident_state))}
              {answers.country && fieldRow("Country", fieldVal(answers.country))}
              {answers.second_citizenship_country && fieldRow("Second Citizenship", fieldVal(answers.second_citizenship_country))}
              {fieldRow("Phone", fieldVal(answers.phone))}
              {fieldRow("First Generation", fieldVal(answers.first_gen))}
            </div>,
            <>
              <div>{renderLabel("US citizenship or residency status")}{renderPills("us_citizenship", ["US citizen", "Dual citizen", "Permanent resident", "Not a US citizen"])}</div>
              {answers.us_citizenship === "Dual citizen" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>{renderLabel("Primary citizenship country")}<select value={answers.country} onChange={e => setA("country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="">Select country…</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                  <div>{renderLabel("Second citizenship country")}<select value={answers.second_citizenship_country} onChange={e => setA("second_citizenship_country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="">Select country…</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
              )}
              {(answers.us_citizenship === "US citizen" || answers.us_citizenship === "Permanent resident") && (
                <div>{renderLabel("US state of residence")}<select value={answers.us_resident_state} onChange={e => setA("us_resident_state", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="">Select a state…</option>{US_STATES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              )}
              {answers.us_citizenship === "Not a US citizen" && (
                <div>{renderLabel("Country of origin")}<select value={answers.country} onChange={e => setA("country", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}><option value="">Select country…</option>{COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              )}
              <div>{renderLabel("Phone number")}<input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000" value={answers.phone} onChange={e => { const c = e.target.value.replace(/[^\d+\(\)\-\s]/g, ""); setA("phone", c); }} /></div>
              <div>{renderLabel("First-generation college student?")}{renderPills("first_gen", ["Yes", "No", "Prefer not to say"])}</div>
            </>
          )}

          {/* Section 6: Standardized Testing */}
          {sectionCard(5, "Standardized Testing",
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
              {fieldRow("SAT Total", fieldVal(answers.sat_score))}
              {fieldRow("ACT Composite", fieldVal(answers.act_score))}
              {fieldRow("English Test", fieldVal(answers.english_test_type))}
              {answers.english_test_score && fieldRow("English Score", fieldVal(answers.english_test_score))}
            </div>,
            <>
              <div>{renderLabel("SAT Total Score")}<input style={inputStyle} type="number" min={400} max={1600} placeholder="e.g. 1480" value={answers.sat_score} onChange={e => setA("sat_score", e.target.value)} /></div>
              <div>{renderLabel("ACT Composite Score")}<input style={inputStyle} type="number" min={1} max={36} placeholder="e.g. 32" value={answers.act_score} onChange={e => setA("act_score", e.target.value)} /></div>
              <div>{renderLabel("English proficiency test")}{renderPills("english_test_type", ["TOEFL", "IELTS", "Duolingo", "Not yet", "Not required"])}</div>
              {(answers.english_test_type === "TOEFL" || answers.english_test_type === "IELTS" || answers.english_test_type === "Duolingo") && (
                <div>{renderLabel("Score")}<input style={inputStyle} type="number" placeholder="Enter your score" value={answers.english_test_score} onChange={e => setA("english_test_score", e.target.value)} /></div>
              )}
            </>
          )}

          {/* Section 7: Essays & Goals */}
          {sectionCard(6, "Essays & Goals",
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fieldRow("Why This Major", fieldVal(answers.why_this_major))}
              {fieldRow("Career Goals", fieldVal(answers.career_goals))}
              {fieldRow("Essay Topic Ideas", fieldVal(answers.essay_topics))}
            </div>,
            <>
              <div>
                {renderLabel("Why this major or field?")}
                <textarea style={{ ...textareaStyle, height: 88 }} maxLength={500} placeholder="The real reason…" value={answers.why_this_major} onChange={e => setA("why_this_major", e.target.value)} />
              </div>
              <div>
                {renderLabel("Career goals")}
                <textarea style={{ ...textareaStyle, height: 88 }} maxLength={500} placeholder="Where do you see yourself in 10 years?" value={answers.career_goals} onChange={e => setA("career_goals", e.target.value)} />
              </div>
              <div>
                {renderLabel("Essay topic ideas (optional)")}
                <textarea style={{ ...textareaStyle, height: 72 }} maxLength={400} placeholder="Any experiences or moments you're considering…" value={answers.essay_topics} onChange={e => setA("essay_topics", e.target.value)} />
              </div>
            </>
          )}

          {/* Section 8: Financial Aid */}
          {sectionCard(7, "Financial Aid",
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
              {fieldRow("Family Income Bracket", fieldVal(answers.family_income_bracket))}
              {fieldRow("CSS Profile", fieldVal(answers.css_profile_aware))}
            </div>,
            <>
              <div>{renderLabel("Estimated family income bracket")}{renderPills("family_income_bracket", ["Under $40K", "$40K–$80K", "$80K–$130K", "$130K–$200K", "Over $200K", "Prefer not to say"])}</div>
              <div>{renderLabel("CSS Profile plans")}{renderPills("css_profile_aware", ["Yes, already filed", "Yes, planning to", "Not sure", "No — schools don't require it"])}</div>
            </>
          )}

          {/* Section 9: About You */}
          {sectionCard(8, "About You",
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fieldRow("What you do when nobody's watching", fieldVal(answers.private_passion))}
              {fieldRow("Would surprise people who know you", fieldVal(answers.unusual_trait))}
              {fieldRow("Something you changed your mind about", fieldVal(answers.changed_mind))}
              {fieldRow("Who/what influenced how you think", fieldVal(answers.meaningful_influence))}
            </div>,
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { label: "What do you do when nobody is watching?", field: "private_passion" as keyof Answers },
                { label: "Anything that would surprise people who know you well?", field: "unusual_trait" as keyof Answers },
                { label: "Something you completely changed your mind about", field: "changed_mind" as keyof Answers },
                { label: "Who or what has most influenced how you think?", field: "meaningful_influence" as keyof Answers },
                { label: "Most embarrassing thing you're genuinely proud of (optional)", field: "embarrassing_pride" as keyof Answers },
                { label: "Problem you'd work on if success was guaranteed (optional)", field: "guaranteed_success" as keyof Answers },
                { label: "Something that would never appear on your activities list (optional)", field: "unique_personal_trait" as keyof Answers },
                { label: "Anything else? (optional)", field: "anything_else" as keyof Answers },
              ].map(({ label, field }) => (
                <div key={field}>
                  {renderLabel(label)}
                  <textarea style={{ ...textareaStyle, height: 72 }} maxLength={400} placeholder="" value={answers[field] as string} onChange={e => setA(field, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* [old sections removed] */}
          {false && sectionCard(4, "Activities & Leadership",
            visibleActivities.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {visibleActivities.map((a, i) => (
                  <div key={i} style={{ border: `0.5px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 4 }}>
                      {a.activity_type}{a.position ? ` — ${a.position}` : ""}
                    </div>
                    {a.organization && <div style={{ fontSize: 12, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 4 }}>{a.organization}</div>}
                    {a.description && <div style={{ fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>{a.description}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 14, color: muted, fontStyle: "italic", fontFamily: "system-ui, -apple-system, sans-serif" }}>Not provided</span>
            ),
            <div style={{ color: text }}>
              {activities.map((act, i) => renderActivityCard(act, i))}
              {activities.length < 10 && (
                <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
                  <button type="button"
                    onClick={() => { setActivities(prev => [...prev, { ...EMPTY_ACTIVITY }]); setExpandedActivities(prev => [...prev, true]); }}
                    style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${gold}`, backgroundColor: "transparent", color: gold, fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitAppearance: "none", appearance: "none" }}>+</button>
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    );
  }

  // ── Upload screen ──────────────────────────────────────────────────────────

  function renderUploadScreen() {
    async function toBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve((e.target?.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function addFiles(fileList: FileList | File[]) {
      const pdfs = Array.from(fileList).filter(f => f.type === "application/pdf");
      if (pdfs.length === 0) return;
      const converted = await Promise.all(pdfs.map(async f => ({ name: f.name, base64: await toBase64(f) })));
      setUploadedFiles(prev => [...prev, ...converted]);
    }

    async function analyzeFiles() {
      if (uploadedFiles.length === 0) return;
      setUploadState("uploading");
      try {
        const res = await fetch("/api/parse-common-app", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: uploadedFiles }),
        });
        if (!res.ok) { setUploadState("error"); return; }

        const data = await res.json();
        const detected: string[] = [];
        const updates: Partial<Answers> = {};

        if (data.full_name)       { updates.full_name       = data.full_name;               detected.push("Full name"); }
        if (data.birthday)        { updates.birthday        = data.birthday;                detected.push("Birthday"); }
        if (data.gender)          { updates.gender          = data.gender;                  detected.push("Gender"); }
        if (data.ethnicity)       { updates.ethnicity       = data.ethnicity;               detected.push("Ethnicity"); }
        if (data.religion)        { updates.religion        = data.religion;                detected.push("Religion"); }
        if (data.high_school_name){ updates.high_school_name= data.high_school_name;        detected.push("High school"); }
        if (data.gpa)             { updates.gpa             = String(data.gpa);             detected.push("GPA"); }
        if (data.graduation_year) { updates.graduation_year = String(data.graduation_year); detected.push("Graduation year"); }
        if (data.class_rank)      { updates.class_rank      = data.class_rank;              detected.push("Class rank"); }
        if (data.sat_math)        { updates.sat_math        = String(data.sat_math);        detected.push("SAT Math"); }
        if (data.sat_english)     { updates.sat_english     = String(data.sat_english);     detected.push("SAT Reading/Writing"); }
        if (data.act)             { updates.act             = String(data.act);             detected.push("ACT"); }
        if (data.country)         { updates.country         = data.country;                 detected.push("Country"); }
        if (data.state)           { updates.state           = data.state;                   detected.push("State"); }
        if (data.phone)           { updates.phone           = data.phone;                   detected.push("Phone"); }

        if (Object.keys(updates).length > 0) setAnswers(prev => ({ ...prev, ...updates }));

        if (Array.isArray(data.activities) && data.activities.length > 0) {
          const mapped = mapParsedActivities(data.activities);
          setActivities(mapped);
          setExpandedActivities(mapped.map((_, i) => i === 0));
          detected.push(`${mapped.length} activit${mapped.length === 1 ? "y" : "ies"}`);
        }

        setUploadedFields(detected);
        setUploadState("success");
      } catch {
        setUploadState("error");
      }
    }

    return (
      <div style={{ minHeight: "100vh", backgroundColor: bg, color: text, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 520, width: "100%" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, color: text, marginBottom: 8, marginTop: 0, textAlign: "center", letterSpacing: "-0.3px" }}>
            Import your Common App
          </h1>
          <p style={{ fontSize: 15, color: muted, textAlign: "center", marginBottom: 24, lineHeight: "1.6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Upload your Common App PDF and we&apos;ll pre-fill your profile automatically
          </p>
          <div style={{ border: `1px solid ${gold}55`, borderRadius: 12, padding: "16px 20px", background: isDark ? "rgba(201,169,110,0.05)" : "rgba(154,112,64,0.04)", marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 12, fontFamily: "system-ui, -apple-system, sans-serif" }}>How to get your Common App PDF</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              {[
                "Log in at commonapp.org",
                "Go to My Colleges → any college you added → Application",
                "Click \"Preview\" to open the PDF view",
                "Download or print to PDF from your browser",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: gold, color: isDark ? "#080810" : "#FAFAF5", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "system-ui, -apple-system, sans-serif", marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.55 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          {uploadState === "idle" && (
            <>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                style={{
                  border: `2px dashed ${dragOver ? gold : border}`, borderRadius: 16,
                  padding: "40px 32px", textAlign: "center", marginBottom: 16,
                  backgroundColor: dragOver ? (isDark ? "rgba(201,169,110,0.06)" : "rgba(154,112,64,0.04)") : "transparent",
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12, lineHeight: 1 }}>📄</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: text, marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  Drop your Common App PDFs here
                </div>
                <div style={{ fontSize: 13, color: muted, marginBottom: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                  You can drop multiple files at once
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: gold, backgroundColor: "transparent", border: `1px solid ${gold}`, borderRadius: 8, padding: "9px 22px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Browse files
                </button>
                <input ref={fileInputRef} type="file" accept="application/pdf" multiple style={{ display: "none" }}
                  onChange={e => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }} />
              </div>

              {/* File pills */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 6px 4px 12px", border: `0.5px solid ${border}`, borderRadius: 999, fontSize: 12, fontFamily: "system-ui, -apple-system, sans-serif", color: text, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                      <span style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                      <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 16, lineHeight: 1, padding: "0 2px", display: "flex", alignItems: "center", WebkitAppearance: "none", appearance: "none" }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Analyze button */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <button type="button" onClick={analyzeFiles}
                    style={{ width: "100%", fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 10, padding: "13px 0", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                    Analyze &amp; Fill My Profile →
                  </button>
                </div>
              )}

              {/* Skip link */}
              <div style={{ textAlign: "center" }}>
                <button type="button" onClick={() => setOnboardingPhase("questionnaire")}
                  style={{ fontSize: 14, color: muted, backgroundColor: "transparent", border: "none", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400 }}>
                  Skip — I&apos;ll fill it manually →
                </button>
              </div>
            </>
          )}

          {uploadState === "uploading" && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div style={{ fontSize: 14, color: muted, fontFamily: "system-ui, -apple-system, sans-serif" }}>Analyzing your Common App…</div>
            </div>
          )}

          {uploadState === "success" && (
            <div>
              <div style={{ fontSize: 18, color: gold, fontFamily: "Georgia, serif", marginBottom: 20, textAlign: "center" }}>
                ✓ Profile filled from your Common App
              </div>
              <div style={{ backgroundColor: surface, borderRadius: 12, padding: "16px 20px", border: `0.5px solid ${border}`, marginBottom: 24 }}>
                <div style={{ fontSize: 10, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 600 }}>
                  Detected fields
                </div>
                {uploadedFields.map(f => (
                  <div key={f} style={{ fontSize: 13, color: text, padding: "3px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>✓ {f}</div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button type="button" onClick={() => setOnboardingPhase("questionnaire")}
                  style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 8, padding: "11px 28px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Review &amp; continue →
                </button>
              </div>
            </div>
          )}

          {uploadState === "error" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, color: isDark ? "#f87171" : "#b91c1c", marginBottom: 20, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>
                Couldn&apos;t read the PDFs. Try again or continue manually.
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button type="button" onClick={() => setUploadState("idle")}
                  style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: isDark ? "#f87171" : "#b91c1c", backgroundColor: "transparent", border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`, borderRadius: 8, padding: "9px 20px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Try again
                </button>
                <button type="button" onClick={() => setOnboardingPhase("questionnaire")}
                  style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, color: gold, backgroundColor: "transparent", border: `0.5px solid ${gold}`, borderRadius: 8, padding: "9px 20px", cursor: "pointer", WebkitAppearance: "none", appearance: "none" }}>
                  Continue manually →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (mode === null) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: isDark ? "#080810" : "#FAFAF5" }}>
      <div style={{ color: isDark ? "#C9A96E" : "#9a7040", fontSize: 14 }}>Loading your profile...</div>
    </div>
  );

  // ── View / Onboarding dispatch ─────────────────────────────────────────────

  if (mode === "view") return renderEditView();

  if (onboardingPhase === "upload") return renderUploadScreen();

  // ── Onboarding questionnaire ───────────────────────────────────────────────

  const progressPct = (currentGroup + 1) / TOTAL_GROUPS * 100;
  const isValid     = isGroupValid(currentGroup);
  const isDisabled  = !isValid || transitioning;
  const buttonText  = currentGroup === TOTAL_GROUPS - 1 ? "Complete my profile →" : "Continue →";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 3, backgroundColor: border, zIndex: 100 }}>
        <div style={{ height: "100%", width: `${progressPct}%`, backgroundColor: gold, transition: "width 400ms ease" }} />
      </div>

      {/* Sticky step indicator pill */}
      <div style={{
        position: "fixed", top: 68, left: "50%", transform: "translateX(-50%)", zIndex: 50,
        background: isDark ? "#1a1a2e" : "#fff",
        border: "1px solid rgba(154,112,64,0.3)", borderRadius: 999,
        padding: "7px 22px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        minWidth: 140,
      }}>
        <div style={{ fontSize: 14, fontFamily: "system-ui, -apple-system, sans-serif", color: text, whiteSpace: "nowrap" }}>
          Step <span style={{ fontWeight: 700, color: gold }}>{currentGroup + 1}</span> of {TOTAL_GROUPS}
        </div>
        <div style={{ width: "100%", height: 2, background: border, borderRadius: 1, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((currentGroup + 1) / TOTAL_GROUPS) * 100}%`, background: gold, borderRadius: 1, transition: "width 400ms ease" }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", alignItems: (currentGroup === 2 || currentGroup === 8) ? "flex-start" : "center", justifyContent: "center", padding: (currentGroup === 2 || currentGroup === 8) ? "132px 24px 40px" : "132px 24px 60px", width: "100%" }}>
        <div ref={groupRef} style={{ maxWidth: currentGroup === 2 ? 640 : 560, width: "100%", color: text }}>

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: text, textAlign: "center", marginBottom: 8, letterSpacing: "-0.2px", marginTop: 0 }}>
            {GROUP_TITLES[currentGroup]}
          </h2>

          {currentGroup === 2 && (
            <p style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", color: muted, textAlign: "center", marginBottom: 24, marginTop: 0 }}>
              List your activities in order of importance to you
            </p>
          )}

          {renderGroupContent()}

          {saveError && (
            <div style={{ marginTop: 24, border: "1px solid rgba(220,38,38,0.4)", borderRadius: 10, padding: "12px 16px", background: "rgba(220,38,38,0.05)", fontSize: 13, color: isDark ? "#f87171" : "#b91c1c", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.5 }}>
              {saveError}
            </div>
          )}
          <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
            <button type="button" onClick={goNext} disabled={isDisabled}
              onMouseEnter={e => { if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? "rgba(201,169,110,0.08)" : "rgba(154,112,64,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
              style={{ width: "100%", maxWidth: 400, padding: "13px 0", fontSize: 15, fontWeight: 500, borderRadius: 10, fontFamily: "system-ui, -apple-system, sans-serif", borderStyle: "solid", borderWidth: "1px", borderColor: gold, color: gold, backgroundColor: "transparent", WebkitAppearance: "none", appearance: "none", cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.35 : 1, transition: "opacity 0.15s, background 0.15s" }}>
              {buttonText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
