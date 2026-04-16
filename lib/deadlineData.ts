export type DeadlineItem = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  category: "application" | "financial_aid" | "sat" | "act" | "toefl" | "ielts" | "essay_milestone" | "custom";
  universityName?: string;
  description?: string;
  link?: string;
  color: string;
};

export const SAT_DATES_2025_2026: DeadlineItem[] = [
  { id: "sat-aug-2025", title: "SAT Test Date", date: "2025-08-23", category: "sat", description: "Registration deadline: July 25, 2025", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-oct-2025", title: "SAT Test Date", date: "2025-10-04", category: "sat", description: "Registration deadline: September 5, 2025", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-nov-2025", title: "SAT Test Date", date: "2025-11-01", category: "sat", description: "Registration deadline: October 3, 2025", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-dec-2025", title: "SAT Test Date", date: "2025-12-06", category: "sat", description: "Registration deadline: November 7, 2025", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-mar-2026", title: "SAT Test Date", date: "2026-03-14", category: "sat", description: "Registration deadline: February 13, 2026", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-may-2026", title: "SAT Test Date", date: "2026-05-02", category: "sat", description: "Registration deadline: April 3, 2026", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
  { id: "sat-jun-2026", title: "SAT Test Date", date: "2026-06-06", category: "sat", description: "Registration deadline: May 8, 2026", link: "https://satsuite.collegeboard.org/sat/registration", color: "#2563eb" },
];

export const ACT_DATES_2025_2026: DeadlineItem[] = [
  { id: "act-sep-2025", title: "ACT Test Date", date: "2025-09-13", category: "act", description: "Registration deadline: August 8, 2025", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-oct-2025", title: "ACT Test Date", date: "2025-10-25", category: "act", description: "Registration deadline: September 19, 2025", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-dec-2025", title: "ACT Test Date", date: "2025-12-13", category: "act", description: "Registration deadline: November 7, 2025", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-feb-2026", title: "ACT Test Date", date: "2026-02-07", category: "act", description: "Registration deadline: January 9, 2026", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-apr-2026", title: "ACT Test Date", date: "2026-04-04", category: "act", description: "Registration deadline: February 27, 2026", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-jun-2026", title: "ACT Test Date", date: "2026-06-13", category: "act", description: "Registration deadline: May 8, 2026", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
  { id: "act-jul-2026", title: "ACT Test Date", date: "2026-07-18", category: "act", description: "Registration deadline: June 12, 2026", link: "https://www.act.org/content/act/en/products-and-services/the-act/registration.html", color: "#16a34a" },
];

export const TOEFL_INFO: DeadlineItem[] = [
  { id: "toefl-info", title: "TOEFL iBT — Register at ets.org", date: "2025-09-01", category: "toefl", description: "TOEFL is offered year-round at test centers worldwide and online. Register at least 7 days before your test date. Scores are delivered 6-10 days after testing. Allow extra time for scores to be sent to universities (3-5 business days).", link: "https://www.ets.org/toefl/test-takers/ibt/register.html", color: "#7c3aed" },
];

export const IELTS_INFO: DeadlineItem[] = [
  { id: "ielts-info", title: "IELTS Academic — Register at ielts.org", date: "2025-09-15", category: "ielts", description: "IELTS is offered multiple times per month at approved test centers. Find test dates near you at ielts.org. Scores are available 13 days after testing. Allow extra time for score reports to reach universities.", link: "https://www.ielts.org/en-us/registration", color: "#7c3aed" },
];

export const UNIVERSITY_DEADLINES: Record<string, {
  ed?: string; ea?: string; rd: string;
  financialAid?: string; cssProfile?: string; requiresCss: boolean;
}> = {
  "Harvard University": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2025-11-01", cssProfile: "2025-11-01", requiresCss: true },
  "Yale University": { ea: "2025-11-01", rd: "2026-01-02", financialAid: "2025-11-01", cssProfile: "2025-11-15", requiresCss: true },
  "Princeton University": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2025-11-01", cssProfile: "2025-11-01", requiresCss: true },
  "Columbia University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "University of Pennsylvania": { ed: "2025-11-01", rd: "2026-01-05", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Brown University": { ed: "2025-11-01", rd: "2026-01-05", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Dartmouth College": { ed: "2025-11-01", rd: "2026-01-02", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Cornell University": { ed: "2025-11-01", rd: "2026-01-02", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Stanford University": { ea: "2025-11-01", rd: "2026-01-02", financialAid: "2025-11-15", cssProfile: "2025-11-15", requiresCss: true },
  "MIT": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2025-11-15", cssProfile: "2025-11-15", requiresCss: true },
  "Duke University": { ed: "2025-11-01", rd: "2026-01-02", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Johns Hopkins University": { ed: "2025-11-01", rd: "2026-01-05", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Northwestern University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "University of Chicago": { ea: "2025-11-01", rd: "2026-01-06", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Vanderbilt University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Rice University": { ed: "2025-11-01", rd: "2026-01-04", financialAid: "2026-03-01", cssProfile: "2026-03-01", requiresCss: true },
  "Washington University in St. Louis": { ed: "2025-11-01", rd: "2026-01-02", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Georgetown University": { rd: "2026-01-10", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Emory University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Carnegie Mellon University": { ed: "2025-11-01", rd: "2026-01-03", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "UC Berkeley": { rd: "2025-11-30", financialAid: "2026-03-02", requiresCss: false },
  "UCLA": { rd: "2025-11-30", financialAid: "2026-03-02", requiresCss: false },
  "University of Michigan": { ea: "2025-11-01", rd: "2026-02-01", financialAid: "2026-04-30", requiresCss: false },
  "University of Virginia": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2026-03-01", cssProfile: "2026-03-01", requiresCss: true },
  "University of Notre Dame": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Boston College": { ea: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Tufts University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Bowdoin College": { ed: "2025-11-15", rd: "2026-01-05", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Amherst College": { ed: "2025-11-01", rd: "2026-01-03", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Williams College": { ed: "2025-11-15", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Middlebury College": { ed: "2025-11-15", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Swarthmore College": { ed: "2025-11-15", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Pomona College": { ed: "2025-11-15", rd: "2026-01-08", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Carleton College": { ed: "2025-11-15", rd: "2026-01-15", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Wellesley College": { ed: "2025-11-01", rd: "2026-01-15", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Grinnell College": { ed: "2025-11-01", rd: "2026-01-15", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Oberlin College": { ed: "2025-11-15", rd: "2026-01-15", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Vassar College": { ed: "2025-11-15", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "Colgate University": { ed: "2025-11-15", rd: "2026-01-15", financialAid: "2026-02-01", requiresCss: false },
  "Davidson College": { ed: "2025-11-15", rd: "2026-01-15", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Wake Forest University": { ed: "2025-11-01", rd: "2026-01-15", financialAid: "2026-03-01", requiresCss: false },
  "NYU": { ed: "2025-11-01", rd: "2026-01-05", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "University of Southern California": { ed: "2025-11-01", rd: "2026-01-15", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Boston University": { ea: "2025-11-01", rd: "2026-01-03", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Tulane University": { ed: "2025-11-01", rd: "2026-01-15", financialAid: "2026-02-15", requiresCss: false },
  "Brandeis University": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-15", cssProfile: "2026-02-15", requiresCss: true },
  "Colby College": { ed: "2025-11-01", rd: "2026-01-01", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
  "University of Rochester": { ed: "2025-11-01", rd: "2026-01-05", financialAid: "2026-02-01", cssProfile: "2026-02-01", requiresCss: true },
};

export function generateEssayMilestones(earliestDeadline: string): DeadlineItem[] {
  const deadline = new Date(earliestDeadline);
  const milestones: DeadlineItem[] = [];

  const addMilestone = (weeksBeforeDeadline: number, title: string, description: string) => {
    const date = new Date(deadline);
    date.setDate(date.getDate() - (weeksBeforeDeadline * 7));
    milestones.push({
      id: `milestone-${weeksBeforeDeadline}-${title.replace(/\s+/g, "-").toLowerCase()}`,
      title,
      date: date.toISOString().split("T")[0],
      category: "essay_milestone",
      description,
      color: "#b8860b",
    });
  };

  addMilestone(12, "Start brainstorming personal statement topics", "Give yourself 2 weeks to brainstorm before committing to a topic. Explore 5-10 possible angles.");
  addMilestone(10, "Personal statement first draft due", "Write your entire first draft without editing. Get the story down. You will revise extensively.");
  addMilestone(8, "Personal statement — revised draft", "After feedback from trusted readers, revise thoroughly. Focus on showing not telling.");
  addMilestone(6, "Personal statement — final polish", "Line-edit every sentence. Read it aloud. Cut any sentence that does not add new information.");
  addMilestone(8, "Start supplemental essays", "Begin researching each school deeply before writing. Use the Why Us Research Arsenal in SheldonAI.");
  addMilestone(5, "First supplemental essays complete", "Complete your highest-priority supplemental essays — Why Us essays for your top schools.");
  addMilestone(3, "All supplemental essays complete", "All supplemental essays drafted and revised. No essays should be written in the final 2 weeks.");
  addMilestone(2, "Activities list finalized", "Finalize and review your activities list. Every 150-character description should be at its best.");
  addMilestone(1, "Final review week", "Read your complete application as a package. Does everything tell a coherent story?");
  addMilestone(0, "APPLICATION DEADLINE", "Submit at least 24 hours early to avoid technical issues.");

  return milestones.sort((a, b) => a.date.localeCompare(b.date));
}
