"use client";

type EmblemProps = {
  name: string;
  color: string;
  size?: number;
};

const EMBLEMS: Record<string, { initials: string; secondaryColor: string; style: "shield" | "crest" | "circle" }> = {
  "Harvard University": { initials: "H", secondaryColor: "#FFFFFF", style: "shield" },
  "Yale University": { initials: "Y", secondaryColor: "#FFFFFF", style: "shield" },
  "Princeton University": { initials: "P", secondaryColor: "#FFFFFF", style: "shield" },
  "Columbia University": { initials: "C", secondaryColor: "#FFFFFF", style: "shield" },
  "University of Pennsylvania": { initials: "UP", secondaryColor: "#FFFFFF", style: "shield" },
  "Brown University": { initials: "B", secondaryColor: "#FFFFFF", style: "shield" },
  "Dartmouth College": { initials: "D", secondaryColor: "#FFFFFF", style: "shield" },
  "Cornell University": { initials: "C", secondaryColor: "#FFFFFF", style: "shield" },
  "Stanford University": { initials: "S", secondaryColor: "#FFFFFF", style: "shield" },
  "MIT": { initials: "MIT", secondaryColor: "#FFFFFF", style: "shield" },
  "Duke University": { initials: "D", secondaryColor: "#FFFFFF", style: "shield" },
  "Johns Hopkins University": { initials: "JH", secondaryColor: "#FFFFFF", style: "shield" },
  "Northwestern University": { initials: "N", secondaryColor: "#FFFFFF", style: "shield" },
  "University of Chicago": { initials: "UC", secondaryColor: "#FFFFFF", style: "shield" },
  "Vanderbilt University": { initials: "V", secondaryColor: "#FFFFFF", style: "shield" },
  "Rice University": { initials: "R", secondaryColor: "#FFFFFF", style: "shield" },
  "Washington University in St. Louis": { initials: "WU", secondaryColor: "#FFFFFF", style: "shield" },
  "Georgetown University": { initials: "G", secondaryColor: "#FFFFFF", style: "shield" },
  "Emory University": { initials: "E", secondaryColor: "#FFFFFF", style: "shield" },
  "Carnegie Mellon University": { initials: "CM", secondaryColor: "#FFFFFF", style: "shield" },
  "UC Berkeley": { initials: "UCB", secondaryColor: "#FDB515", style: "shield" },
  "UCLA": { initials: "UCLA", secondaryColor: "#FFD100", style: "shield" },
  "University of Michigan": { initials: "M", secondaryColor: "#FFCB05", style: "shield" },
  "University of Virginia": { initials: "UVA", secondaryColor: "#F84C1E", style: "shield" },
  "University of Notre Dame": { initials: "ND", secondaryColor: "#C99700", style: "shield" },
  "Boston College": { initials: "BC", secondaryColor: "#FFFFFF", style: "shield" },
  "Tufts University": { initials: "T", secondaryColor: "#FFFFFF", style: "shield" },
  "Bowdoin College": { initials: "B", secondaryColor: "#FFFFFF", style: "shield" },
  "Amherst College": { initials: "A", secondaryColor: "#FFFFFF", style: "shield" },
  "Williams College": { initials: "W", secondaryColor: "#FFED00", style: "shield" },
  "Middlebury College": { initials: "M", secondaryColor: "#FFFFFF", style: "shield" },
  "Colby College": { initials: "C", secondaryColor: "#FFFFFF", style: "shield" },
  "Wellesley College": { initials: "W", secondaryColor: "#FFFFFF", style: "shield" },
  "Swarthmore College": { initials: "S", secondaryColor: "#FFFFFF", style: "shield" },
  "Pomona College": { initials: "P", secondaryColor: "#FFFFFF", style: "shield" },
  "Harvey Mudd College": { initials: "HM", secondaryColor: "#FFFFFF", style: "shield" },
  "Claremont McKenna College": { initials: "CMC", secondaryColor: "#FFFFFF", style: "shield" },
  "Carleton College": { initials: "C", secondaryColor: "#FFFFFF", style: "shield" },
  "Grinnell College": { initials: "G", secondaryColor: "#FFFFFF", style: "shield" },
  "Oberlin College": { initials: "O", secondaryColor: "#FFFFFF", style: "shield" },
  "Vassar College": { initials: "V", secondaryColor: "#FFFFFF", style: "shield" },
  "Colgate University": { initials: "C", secondaryColor: "#FFFFFF", style: "shield" },
  "Davidson College": { initials: "D", secondaryColor: "#FFFFFF", style: "shield" },
  "Wake Forest University": { initials: "WF", secondaryColor: "#FFFFFF", style: "shield" },
  "NYU": { initials: "NYU", secondaryColor: "#FFFFFF", style: "shield" },
  "University of Southern California": { initials: "USC", secondaryColor: "#FFC72C", style: "shield" },
  "Boston University": { initials: "BU", secondaryColor: "#FFFFFF", style: "shield" },
  "Tulane University": { initials: "T", secondaryColor: "#FFFFFF", style: "shield" },
  "University of Rochester": { initials: "UR", secondaryColor: "#FFFFFF", style: "shield" },
  "Brandeis University": { initials: "B", secondaryColor: "#FFFFFF", style: "shield" },
  "University of Texas at Austin": { initials: "UT", secondaryColor: "#FFFFFF", style: "shield" },
  "Georgia Institute of Technology": { initials: "GT", secondaryColor: "#B3A369", style: "shield" },
  "Purdue University": { initials: "P", secondaryColor: "#CEB888", style: "shield" },
};

export default function UniversityEmblem({ name, color, size = 48 }: EmblemProps) {
  const emblem = EMBLEMS[name] || {
    initials: name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    secondaryColor: "#FFFFFF",
    style: "shield" as const,
  };
  const initials = emblem.initials;
  const fontSize = initials.length > 2 ? size * 0.22 : initials.length === 2 ? size * 0.28 : size * 0.36;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path
        d="M24 2L4 10V26C4 36.5 13 44.5 24 47C35 44.5 44 36.5 44 26V10L24 2Z"
        fill={color}
      />
      {/* Inner shield border */}
      <path
        d="M24 5L7 12V26C7 34.5 14.5 41.5 24 44C33.5 41.5 41 34.5 41 26V12L24 5Z"
        fill="none"
        stroke={emblem.secondaryColor}
        strokeWidth="0.75"
        strokeOpacity="0.4"
      />
      {/* Horizontal divider line */}
      <line
        x1="10"
        y1="22"
        x2="38"
        y2="22"
        stroke={emblem.secondaryColor}
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Initials */}
      <text
        x="24"
        y="28"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={emblem.secondaryColor}
        fontSize={fontSize}
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </svg>
  );
}
