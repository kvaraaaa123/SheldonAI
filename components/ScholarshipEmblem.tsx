"use client";

type ScholarshipEmblemProps = {
  name: string;
  size?: number;
};

const SCHOLARSHIP_EMBLEMS: Record<string, { initials: string; bg: string; text: string }> = {
  "Gates Scholarship": { initials: "GS", bg: "#0078D4", text: "#FFFFFF" },
  "QuestBridge National College Match": { initials: "QB", bg: "#D4380D", text: "#FFFFFF" },
  "Coca-Cola Scholars Program": { initials: "CC", bg: "#F40009", text: "#FFFFFF" },
  "Regeneron Science Talent Search": { initials: "RE", bg: "#0057A8", text: "#FFFFFF" },
  "Davidson Fellows Scholarship": { initials: "DF", bg: "#004B87", text: "#FFFFFF" },
  "Jack Kent Cooke Foundation College Scholarship": { initials: "JKC", bg: "#8B0000", text: "#FFFFFF" },
  "National Merit Scholarship": { initials: "NM", bg: "#003087", text: "#FFFFFF" },
  "Dell Scholars Program": { initials: "DS", bg: "#007DB8", text: "#FFFFFF" },
  "Posse Scholarship": { initials: "PS", bg: "#2C3E50", text: "#FFFFFF" },
  "Hispanic Scholarship Fund": { initials: "HSF", bg: "#C41230", text: "#FFFFFF" },
  "Truman Scholarship": { initials: "TS", bg: "#003087", text: "#FFFFFF" },
  "Rhodes Scholarship": { initials: "RH", bg: "#003580", text: "#FFD700" },
  "Marshall Scholarship": { initials: "MS", bg: "#012169", text: "#FFFFFF" },
  "Fulbright US Student Program": { initials: "FB", bg: "#002868", text: "#FFFFFF" },
  "Barry Goldwater Scholarship": { initials: "BG", bg: "#8B0000", text: "#FFFFFF" },
};

export default function ScholarshipEmblem({ name, size = 48 }: ScholarshipEmblemProps) {
  const emblem = SCHOLARSHIP_EMBLEMS[name] || {
    initials: name.split(" ").filter(w => w.length > 2).map(w => w[0]).join("").slice(0, 2).toUpperCase(),
    bg: "#2C3E50",
    text: "#FFFFFF",
  };
  const fontSize = emblem.initials.length > 2 ? size * 0.24 : size * 0.32;

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Octagon shape for scholarships */}
      <path
        d="M14 4H34L44 14V34L34 44H14L4 34V14L14 4Z"
        fill={emblem.bg}
      />
      <path
        d="M15.5 7H32.5L41 15.5V32.5L32.5 41H15.5L7 32.5V15.5L15.5 7Z"
        fill="none"
        stroke={emblem.text}
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={emblem.text}
        fontSize={fontSize}
        fontFamily="Georgia, serif"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        {emblem.initials}
      </text>
    </svg>
  );
}
