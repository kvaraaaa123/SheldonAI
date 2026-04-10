// Deep, niche university research data for Why Us essays
export type ResearchItem = {
  name: string;
  detail: string;
};

export type ResearchCategory = {
  label: string;
  emoji: string;
  items: ResearchItem[];
};

export type UniversityResearch = {
  id: string;
  name: string;
  essayWarning: string;
  categories: ResearchCategory[];
};

export const UNIVERSITY_RESEARCH: UniversityResearch[] = [
  {
    id: "harvard",
    name: "Harvard",
    essayWarning: "Harvard is the ONLY elite school that does NOT ask a traditional 'Why Harvard?' essay. Every prompt instead asks who you are. Never write a 'Why Harvard' essay for Harvard — write a 'Who am I and how will I enrich this community?' essay.",
    categories: [
      {
        label: "Signature Courses",
        emoji: "📚",
        items: [
          { name: "Science of Cooking (SPU27)", detail: "A wildly popular science course taught in partnership with professional chefs where students learn chemistry and physics through cooking — the course has a waiting list every semester. Michael Brenner (Applied Mathematics) is one of the key faculty behind it." },
          { name: "Justice (Gov 1390) — Michael Sandel", detail: "Michael Sandel's legendary moral philosophy course held in Sanders Theatre for 1,000 students. One of the most-watched lecture series in the world through Harvard's online platform. His book 'Justice: What's the Right Thing to Do?' grew directly from this course." },
          { name: "Sophomore Tutorial", detail: "A small-group research seminar in your concentration, taught by active faculty, that exists at no peer institution in the same form. Every sophomore takes a tutorial — for History and Literature students this means reading primary sources in a group of eight with a professor who is an active scholar." },
          { name: "Social Studies (Soc Stud 10ab)", detail: "An interdisciplinary concentration combining economics, political science, sociology, and history around a single thesis. Students write a substantial empirical paper in junior year and a 100-page thesis in senior year. Famous for producing public intellectuals and policy thinkers." },
          { name: "Folklore and Mythology", detail: "One of Harvard's most beloved and unusual concentrations — a genuine interdisciplinary program that studies the stories cultures tell themselves. Produces writers, anthropologists, and filmmakers who think about narrative differently from any other major." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Michael Sandel (Government)", detail: "Author of 'Justice' and 'The Case Against Perfection.' His work on the limits of markets and the moral philosophy of public life has defined American political philosophy for a generation. Teaching at Harvard since 1980." },
          { name: "Henry Louis Gates Jr. (African & African American Studies)", detail: "Director of the Hutchins Center for African and African American Research. Creator of the PBS 'Finding Your Roots.' One of the most publicly visible humanist scholars in America. His undergraduate seminars are heavily subscribed." },
          { name: "Danielle Allen (Government)", detail: "Political philosopher and constitutional scholar. Author of 'Our Declaration.' Her work connects ancient Athenian democracy to contemporary American civic life. Former candidate for Governor of Massachusetts." },
          { name: "David Malan (Computer Science)", detail: "Creator of CS50 — the most widely taken computer science course in the world, both on campus and through edX. His teaching philosophy makes computer science accessible without dumbing it down." },
          { name: "N. Gregory Mankiw (Economics)", detail: "Author of the most widely used economics textbook in the world. Former Chair of the Council of Economic Advisers. His Ec10 course is Harvard's largest lecture course." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Housing Day", detail: "In mid-March, at 6 AM, upperclassmen fan out across the Yard and storm freshman dorms to deliver house assignments. Each house has its own chant, mascot, and annual parody music video. River houses (along the Charles) are coveted; Quad houses (Cabot, Currier, Pforzheimer) require a 15-minute walk — some freshmen celebrate; some cry. Annenberg Hall becomes a festival of house swag distribution afterward." },
          { name: "Finals Scream", detail: "At midnight before finals begin, Harvard students open their windows and scream — a collective release of academic pressure that has been a tradition for decades. From dorm windows across the Yard, strangers share a single moment of absurd solidarity." },
          { name: "River Run", detail: "The night before Housing Day, freshmen run to the Charles River and back in a late-night tradition of communal anticipation. Food trucks appear near the Malkin Athletic Center. In 2024, the event moved to the MAC quad for a more organized celebration." },
          { name: "The Three Lies of John Harvard", detail: "The famous bronze statue in the Yard is not John Harvard (it's an 1884 student named Sherman Hoar), Harvard did not found the university (the Massachusetts Bay Colony did), and the date 1638 on the base is wrong (the university was founded in 1636)." },
          { name: "Annenberg Hall (Freshman-Only)", detail: "A grand Victorian Gothic dining hall reserved exclusively for first-year students — after freshman year, you lose access forever. Alumni consistently describe Annenberg as one of the most beautiful rooms they have ever eaten in." },
          { name: "Sanders Theatre", detail: "A 1,000-seat wood-paneled Victorian hall where Michael Sandel teaches Justice, the Boston Symphony performs, and world leaders speak. Sits inside Memorial Hall, a Gothic monument to Harvard's Civil War dead." },
          { name: "Hasty Pudding Theatricals", detail: "The oldest theatrical organization in America, founded 1844. Each year they award their Man and Woman of the Year to celebrities (Emma Watson, Meryl Streep, Lin-Manuel Miranda) who lead a parade through Harvard Square." },
          { name: "River vs. Quad (The House System)", detail: "Harvard's 12 upperclassman houses divide into River houses (Adams, Dunster, Eliot, Kirkland, Leverett, Lowell, Mather, Quincy, Winthrop — along the Charles) and the Quad (Cabot, Currier, Pforzheimer — 15 minutes' walk). Each house has a Head of House (faculty member who lives there with their family), its own dining hall, library, and distinct culture." },
        ],
      },
      {
        label: "Clubs & Organizations",
        emoji: "🏛️",
        items: [
          { name: "Institute of Politics (IOP)", detail: "Founded 1966 as a living memorial to JFK. Offers semester-long study groups on political topics, a fellows program bringing practitioners from government and media to campus, and the JFK Jr. Forum — a lecture series hosting sitting presidents, Supreme Court justices, and heads of state." },
          { name: "Harvard Undergraduate Capital Partners (HUCA)", detail: "A student-run investment club managing an actual portfolio. Trains students in financial modeling, due diligence, and investment thesis writing. One of the most selective business clubs at Harvard — a direct pipeline to investment banking and private equity." },
          { name: "Harvard Undergraduate Economics Association (HUEA)", detail: "Organizes speaker series, research workshops, and economics competitions. Publishes its own undergraduate research journal. Has hosted Nobel laureates and Federal Reserve governors." },
          { name: "Harvard College Consulting Group (HCCG)", detail: "A pro-bono management consulting organization serving nonprofits in Greater Boston. Students work in client-facing teams using McKinsey-style methodology. One of the most professionally credentialing clubs at Harvard for students interested in consulting." },
          { name: "Phillips Brooks House Association (PBHA)", detail: "Harvard's largest public service organization, directing over 120 service programs in Greater Boston — from youth tutoring to running a transitional homeless shelter. Considered by many the heart of Harvard's civic mission." },
          { name: "Harvard Political Review", detail: "One of the oldest undergraduate political journals in the country. Alumni have become senior journalists, foreign correspondents, and policy staffers." },
          { name: "Harvard Crimson", detail: "The oldest continuously published college newspaper in the United States. Financial Times, Washington Post, and New York Times journalists began here." },
          { name: "Harvard Islamic Society (HIS)", detail: "The university's Muslim student organization, offering Friday Jumu'ah prayers, Ramadan iftars, and Islamic Awareness Week programming." },
          { name: "Harvard Hillel & Chabad House", detail: "Harvard Hillel serves as the center of Jewish life. The Chabad House (founded 1997 by Rabbi Hirschy Zarchi) is a separate Orthodox community known for warm family-style Shabbat dinners for hundreds of students weekly." },
          { name: "Black Students Association (BSA)", detail: "Hosts Black Convocation (welcoming new Black first-years in Memorial Church), Apollo Night (competitive talent show), and the Black Legacy Ball each February." },
          { name: "Orthodox Christian Fellowship", detail: "A community for Eastern Orthodox Christian students connected to the Holy Trinity Greek Orthodox Church in Boston — particularly significant for Georgian, Russian, Romanian, and other Orthodox students." },
          { name: "Harvard Foundation for Intercultural and Race Relations", detail: "Founded 1981 by Derek Bok. Promotes intercultural understanding through the annual Cultural Rhythms Festival — a showcase of student performances from cultures across the world." },
        ],
      },
      {
        label: "Research Institutes & Buildings",
        emoji: "🔬",
        items: [
          { name: "Davis Center for Russian and Eurasian Studies", detail: "Harvard's premier center for Russian, Eastern European, and Central Asian studies — and the ONLY institution in the United States with a program in Georgian Studies. For students with connections to Georgia, Armenia, Azerbaijan, Ukraine, or any post-Soviet state, this is a uniquely relevant Harvard resource that no other American university can offer." },
          { name: "Berkman Klein Center for Internet & Society", detail: "Research center studying law, technology, and society. Student fellowships available. Covers platform governance, AI ethics, surveillance, and digital rights." },
          { name: "Weatherhead Center for International Affairs", detail: "Hosts visiting world leaders, diplomats, and scholars for seminars accessible to undergraduates." },
          { name: "Widener Library", detail: "The largest university library in the world by volume. Named for Harry Elkins Widener, who died on the Titanic. The requirement that all Harvard students pass a swimming test (only eliminated in 1975) existed because his mother required it as a condition of her donation." },
          { name: "Radcliffe Institute's Sunken Garden", detail: "A secret walled garden in Radcliffe Yard, almost unknown to students, where former Harvard admissions officers reportedly spent every lunch break. A peaceful, hidden space for students who discover it." },
        ],
      },
    ],
  },
  {
    id: "yale",
    name: "Yale",
    essayWarning: "Yale's Why Yale essay must contain enduring specifics — things that will still be true about Yale in ten years. The 'topic that excites you' essay is the most important Yale prompt. Yale reads it first.",
    categories: [
      {
        label: "Signature Courses",
        emoji: "📚",
        items: [
          { name: "Directed Studies (DS)", detail: "A year-long Great Books program for 120 select first-years. Students read primary texts in philosophy, literature, and political thought from Homer through the 20th century — three courses simultaneously covering the same texts from different angles. Alumni describe it as the most transformative academic experience of their lives." },
          { name: "Grand Strategy", detail: "A senior seminar co-taught by historians, political scientists, and former statespeople. Students analyze historical strategic decision-making then develop their own plans for contemporary geopolitical problems. John Lewis Gaddis and former NATO commanders have taught this course." },
          { name: "Ethics, Politics & Economics (EP&E)", detail: "Yale's flagship interdisciplinary major combining moral philosophy, political theory, and economic analysis. Alumni include an unusual concentration of senators, cabinet members, and Supreme Court justices." },
          { name: "Intensive Language Courses", detail: "Yale's intensive beginning language courses compress two semesters into one, meeting for two hours daily. Available in Arabic, Chinese, Japanese, Portuguese, Russian, Swahili, and others. Students come out near-conversational after one semester." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Bryan Garsten (Political Science)", detail: "Political theorist specializing in the history of rhetoric and democratic theory. Author of 'Saving Persuasion.' His courses on political argument are among Yale's most distinctive offerings." },
          { name: "Paul Bloom (Psychology)", detail: "Author of 'Just Babies: The Origins of Good and Evil' and 'Against Empathy.' His research on moral psychology and child development has made him one of the most publicly prominent psychologists in America." },
          { name: "Langdon Hammer (English)", detail: "Leading scholar of American poetry. His Open Yale Courses podcast on modern poetry has been downloaded millions of times, introducing poetry to students who never took a literature class." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Residential College System", detail: "Yale's 14 residential colleges each have a dean, a Head of College (faculty who lives there with their family), dining hall, library, courtyard, and distinct culture. Students belong to their college for all four years. Pauli Murray and Benjamin Franklin are the newest. Each college has its own flag, traditions, and sports competitions." },
          { name: "Mory's", detail: "A private club adjacent to campus. Famous for the 'Whiffenpoof Song' sung by Yale's Whiffenpoofs a cappella group — founded 1909, the oldest collegiate a cappella group in America." },
          { name: "Bladderball", detail: "An intermittently revived unofficial tradition where a giant inflatable ball is released on Cross Campus and students move it in every direction simultaneously. No rules, no objective, pure collective chaos — has been banned and revived multiple times by administration." },
          { name: "Beinecke Library", detail: "A building with translucent marble panels that protect rare books inside. Houses original Gutenberg Bibles and a copy of the Voynich Manuscript. Visiting it and knowing why the marble works is the kind of specific detail that works in a Yale essay." },
          { name: "Spring Fling", detail: "Annual end-of-year outdoor concert on Old Campus organized entirely by undergraduates. Past performers have included major artists. Free for Yale students." },
        ],
      },
      {
        label: "Clubs & Organizations",
        emoji: "🏛️",
        items: [
          { name: "Yale Political Union (YPU)", detail: "The largest student organization at Yale and one of the oldest student debate societies in America. Has invited Tony Blair, Malcolm X, and hundreds of public figures to debate students." },
          { name: "Yale Daily News", detail: "The oldest college daily newspaper in the United States (founded 1878). Alumni include Garry Trudeau and a remarkable concentration of senior American journalists." },
          { name: "Dwight Hall at Yale", detail: "Umbrella organization for over 60 service organizations, coordinating volunteer programs across New Haven." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "MacMillan Center for International and Area Studies", detail: "Coordinates 18 area studies programs. Undergraduate fellowships available for summer research abroad." },
          { name: "Wu Tsai Institute", detail: "A $500 million investment in neuroscience opened in 2022. Focuses on the neuroscience of human cognition — language, social understanding, creativity. A research frontier built specifically at Yale." },
          { name: "Yale Center for Environmental Law & Policy", detail: "Publishes the Environmental Performance Index ranking countries' environmental health globally. Undergraduates can work as research assistants on the annual index." },
        ],
      },
    ],
  },
  {
    id: "princeton",
    name: "Princeton",
    essayWarning: "Princeton's service essay ('In the Nation's Service') demands a moral framework for how you will contribute to society through your specific talent — not generic altruism. The Junior Paper and Senior Thesis are what most students know least about and most define Princeton's academic culture.",
    categories: [
      {
        label: "Signature Programs",
        emoji: "📚",
        items: [
          { name: "Freshman Seminars", detail: "Small seminars of 12-15 students taught by senior Princeton faculty on highly specific topics — 'The Ethics of Eating,' 'Terrorism and Counterterrorism,' 'The History of Race in America.' No graduate student instruction. First-years have direct access to Princeton's most distinguished scholars from day one." },
          { name: "Junior Papers (JPs)", detail: "Every Princeton student writes two substantial independent research papers in their junior year, each supervised by a faculty advisor. This requirement — with no equivalent at Harvard or Yale — forces every Princeton undergraduate to develop original research skills before their senior year." },
          { name: "Senior Thesis", detail: "Every Princeton undergraduate writes a senior thesis — a full independent research document submitted to Mudd Manuscript Library, part of Princeton's permanent collection. Michelle Obama's thesis ('Princeton-Educated Blacks and the Black Community') and Jeff Bezos's economics thesis are part of this collection." },
          { name: "ORFE (Operations Research and Financial Engineering)", detail: "A Princeton-specific department combining applied mathematics with economics and engineering. No peer institution has a department with exactly this disciplinary structure. Produces quantitative finance, operations research, and data science graduates." },
          { name: "Certificate in Finance", detail: "Available to students in any concentration. Covers financial economics, derivatives, portfolio theory, and econometrics. Taught by economics faculty and the Bendheim Center for Finance." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Paul Krugman (Economics)", detail: "Nobel Prize winner in Economics (2008) for work on trade theory and economic geography. New York Times columnist. His Princeton courses connect macroeconomic theory to contemporary policy debates." },
          { name: "Peter Singer (Bioethics)", detail: "The world's most influential living ethicist. Author of 'Animal Liberation.' His utilitarian framework defined the effective altruism movement. His undergraduate courses on practical ethics are simultaneously the most popular and controversial at Princeton." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Reunions & the P-rade", detail: "Princeton's alumni reunion culture is the most intense of any university. Alumni return every five years wearing class-specific orange and black P-rade jackets and march in procession. The P-rade is one of the most emotionally powerful events in American higher education." },
          { name: "Eating Clubs", detail: "Princeton's eleven eating clubs (Ivy, Cottage, Tiger Inn, Cap and Gown, Colonial, Charter, Cloyne, Cannon, Quadrangle, Terrace, Tower) on Prospect Avenue function as the social center of junior and senior life. Some require 'bicker' (an invitation process); others are open sign-in. No equivalent exists at any other university." },
          { name: "FitzRandolph Gate", detail: "Opened only during Reunions and Commencement. Undergraduate tradition holds that students who walk out before graduation will not graduate — keeping the gate essentially unused during the academic year." },
          { name: "Princeton in the Nation's Service Day", detail: "A campus-wide day of volunteer service directly enacting Woodrow Wilson's founding principle. The only Ivy League institution with a university-wide service day built into the academic calendar." },
          { name: "Lake Carnegie", detail: "A manmade lake created by Andrew Carnegie at Woodrow Wilson's request, used by Princeton's crew team. One of the most beautiful campus features unique to Princeton among all Ivies." },
        ],
      },
      {
        label: "Clubs & Organizations",
        emoji: "🏛️",
        items: [
          { name: "Whig-Clio (American Whig-Cliosophic Society)", detail: "Founded 1765 — the oldest collegiate political debating society in America, predating the United States itself. Aaron Burr and James Madison were members." },
          { name: "Triangle Club", detail: "The world's oldest touring collegiate musical comedy group, founded 1891. Produces an original musical comedy each year and tours US cities during winter break. F. Scott Fitzgerald was a rejected member." },
          { name: "Princeton Muslim Life Program", detail: "Has a full-time chaplain. Friday Jumu'ah prayers on campus. Ramadan iftars attended by hundreds of students from across the university." },
        ],
      },
    ],
  },
  {
    id: "columbia",
    name: "Columbia",
    essayWarning: "The list prompt must be an actual comma/semicolon-separated LIST — not prose. Including widely assigned high school texts signals you don't read for pleasure. The Core Curriculum must be referenced in any Why Columbia essay — it is the institution's entire identity.",
    categories: [
      {
        label: "Core Curriculum (Must Know Every Detail)",
        emoji: "📜",
        items: [
          { name: "Literature Humanities (Lit Hum)", detail: "Year-long Great Books seminar required of all Columbia College first-years. Homer's Iliad → Odyssey → Aeschylus → Sophocles → Plato → Virgil → Augustine → Dante → Montaigne → Shakespeare → Milton → Austen → Dostoevsky → Woolf → Toni Morrison. Taught in sections of 22 by a faculty member who leads every discussion." },
          { name: "Contemporary Civilization (CC)", detail: "Year-long political philosophy required of all sophomores. Plato's Republic → Machiavelli → Hobbes → Locke → Rousseau → Kant → Mill → Marx → Nietzsche → Freud → Rawls. The most intellectually demanding required course at any Ivy League institution." },
          { name: "Art Humanities", detail: "Required Core course studying Western art and architecture in person — students visit the Metropolitan Museum, the Cloisters, and other New York institutions as primary texts. The only required art history course at any Ivy built around direct engagement with original works." },
          { name: "Music Humanities", detail: "Required Core course from Gregorian chant through 20th century composition. Students attend live performances at Lincoln Center as part of the coursework." },
          { name: "University Writing", detail: "Required first-year writing course built around close reading and argument — more rigorous than comparable courses at peer institutions. Small sections with substantial individual feedback." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Joseph Stiglitz (Economics)", detail: "Nobel Prize winner in Economics (2001). Former Chief Economist of the World Bank. Author of 'Globalization and Its Discontents.' His research on information asymmetry fundamentally changed economic theory. Famously accessible to undergraduates." },
          { name: "Hamid Dabashi (Middle Eastern Studies)", detail: "Columbia's most prominent scholar of Islamic art and postcolonial theory. Author of over 25 books on Iranian cinema and Islamic philosophy. His lectures on the history of Islamic thought attract students from across the university." },
          { name: "Stuart Firestein (Biological Sciences)", detail: "Olfactory neuroscientist who uses the science of smell to teach how science actually works — through ignorance rather than knowledge. His book 'Ignorance: How It Drives Science' grew from an undergraduate course that invites prominent scientists to discuss what they do NOT know." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Butler Library Steps (Low Steps)", detail: "The steps of Low Memorial Library have been the site of political protests, rallies, and informal gatherings since the 19th century. In 2024, they were the site of major political encampments. Knowing this history is essential to understanding Columbia's campus culture." },
          { name: "New York City as Curriculum", detail: "Art Humanities students visit the Met as coursework. Political science students intern at think tanks blocks from campus. Music Humanities students attend Lincoln Center. The Metropolitan Museum, MoMA, Carnegie Hall, the Public Theater, and the UN are all accessible by subway. This is not background — it is Columbia's second campus." },
          { name: "Columbia Daily Spectator", detail: "Founded 1877. Has broken national news stories. Alumni include Eric Holder, Lou Gehrig, and dozens of senior editors at major American publications." },
          { name: "Bacchanal", detail: "Columbia's annual spring music festival on the South Lawn, entirely organized by undergraduates. The student committee negotiates directly with talent agents." },
        ],
      },
      {
        label: "Clubs & Organizations",
        emoji: "🏛️",
        items: [
          { name: "Columbia Hillel", detail: "One of the most prominent Hillels in American higher education, with a historic campus center. Has been at the center of national conversations about campus antisemitism. Shabbat dinners draw students from Columbia, Barnard, and surrounding institutions." },
          { name: "Muslim Students Association (MSA)", detail: "Active Friday prayers, Ramadan programming serving hundreds of students, and annual interfaith events with Hillel and the Catholic Community." },
          { name: "Columbia Entrepreneurship / Eugene Lang Center", detail: "Runs a startup accelerator, venture funding competitions, and a speaker series connecting students to Columbia's massive alumni network in finance, media, and technology." },
        ],
      },
    ],
  },
  {
    id: "stanford",
    name: "Stanford",
    essayWarning: "Stanford does NOT ask a traditional 'Why Stanford' essay. The short answers reveal who you are. The society challenge prompt rewards answers that teach the reader something genuinely new — climate change and income inequality are overused and should be avoided.",
    categories: [
      {
        label: "Signature Programs",
        emoji: "📚",
        items: [
          { name: "d.school (Hasso Plattner Institute of Design)", detail: "Stanford's design thinking school — open to all students, no application, no design background needed. Developed the human-centered design methodology now used by IDEO, McKinsey, and hundreds of organizations globally. Courses include 'Design Thinking Bootcamp' and 'Launchpad.' The space is famously reconfigurable with freely available prototyping tools." },
          { name: "Symbolic Systems (SymSys)", detail: "A combination of linguistics, philosophy, psychology, cognitive science, and computer science focused on how minds represent and use information. Alumni include Marissa Mayer and Reid Hoffman. Often called the major for people who want to understand intelligence itself." },
          { name: "Human Biology", detail: "Stanford's flagship interdisciplinary major combining biology, medicine, and social science. Required core sequence includes ecology, genetics, neuroscience, and public health. Students understand health's social and political dimensions, not just its biology." },
          { name: "Coterminal Master's (Coterm)", detail: "Undergraduates apply during junior year to receive both a bachelor's and a master's from Stanford, often in five years. Allows undergraduates to take graduate-level courses from freshman year." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Robert Sapolsky (Biology, Neurology)", detail: "Author of 'Behave: The Biology of Humans at Our Best and Worst.' His Human Behavioral Biology lectures (available on YouTube) have been watched tens of millions of times. Specializes in stress physiology in primates and its implications for human behavior." },
          { name: "Carol Dweck (Psychology)", detail: "Developer of growth mindset theory — one of the most widely applied psychological concepts of the last 30 years. Her book 'Mindset: The New Psychology of Success' is used in schools, corporations, and sports organizations globally." },
          { name: "Jennifer Eberhardt (Psychology)", detail: "MacArthur Genius Award winner. Author of 'Biased.' Her research on implicit bias has influenced police department training nationally." },
          { name: "Condoleezza Rice (Political Science)", detail: "Former US Secretary of State and National Security Advisor. Teaches international security at the Hoover Institution. Her courses on comparative politics are heavily subscribed." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Full Moon on the Quad", detail: "Each fall, on the night of the first full moon after classes begin, seniors and first-years exchange kisses on the main quad at midnight. One of the most distinctive social rituals in American higher education." },
          { name: "The Stanford Band (LSJUMB)", detail: "The most unconventional college band in America. Plays in an informal 'scatter' formation with no traditional marching. Uses satire in halftime shows. Has been banned from multiple away games. Entirely self-governed and famously irreverent." },
          { name: "Silicon Valley Access", detail: "Students can take the Marguerite shuttle to Sand Hill Road (venture capital's main street), intern at companies in Palo Alto while living on campus, and attend startup demo days at the Stanford Research Park. The ambient culture is radical optimism about technology solving problems." },
          { name: "Bing Concert Hall", detail: "World-class venue bringing major classical and contemporary musicians to campus. Students attend for free or at steep discount. Programming ranges from San Francisco Symphony to experimental composers." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "Stanford HAI (Human-Centered AI)", detail: "One of the most prominent AI ethics, safety, and governance research institutions in the world. Brings together computer scientists, ethicists, economists, and policy scholars. Undergraduate research affiliates program available." },
          { name: "Hoover Institution", detail: "Conservative policy research institution housing former Secretaries of State and National Security Advisors. Permanent archive collection on 20th century history. Open to undergraduates for lectures, research access, and fellowships." },
          { name: "SLAC National Accelerator Laboratory", detail: "Particle accelerator directly on Stanford's campus, funded by the Department of Energy. Undergraduate research positions available for physics and chemistry students." },
        ],
      },
    ],
  },
  {
    id: "mit",
    name: "MIT",
    essayWarning: "MIT is NOT a STEM-only school. The 'fun' essay exists specifically to find whole people. Writing about how hard you work to get good grades is the fastest way to fail MIT's essays. MIT wants collaborators, not lone geniuses.",
    categories: [
      {
        label: "Signature Programs",
        emoji: "📚",
        items: [
          { name: "UROP (Undergraduate Research Opportunities Program)", detail: "Over 90% of MIT undergraduates participate in research before graduating — this is the central academic experience at MIT. Students join labs as early as freshman fall, and UROP positions pay students. Students can co-author papers, present at conferences, and file patents as undergraduates. No other university has a research culture this deeply embedded in undergraduate life." },
          { name: "Experimental Study Group (ESG)", detail: "A first-year learning community of ~60 students replacing traditional lectures with collaborative, self-paced learning in small groups. ESG students complete the same general requirements as other MIT students but through a radically different pedagogy. Alumni describe it as the most intellectually formative experience of their MIT education." },
          { name: "Terrascope", detail: "A first-year learning community focused on a single complex global problem studied from every angle (scientific, economic, political, cultural) for the entire year. Students design solutions, present to practitioners, and travel for a field component. Past problems: food security, urbanization, pandemic preparedness." },
          { name: "HASS Requirement", detail: "MIT requires all students to complete eight Humanities, Arts, and Social Sciences subjects — explicitly distinguishing MIT from a technical institute. The Science, Technology, and Society (STS) program examines how scientific knowledge is produced and contested in social and political contexts." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Daron Acemoglu (Economics)", detail: "Nobel Prize winner in Economics (2024) for research on how institutions shape prosperity. Author of 'Why Nations Fail.' His research on the effects of colonialism, democracy, and technology on economic development defines contemporary political economy." },
          { name: "Sara Seager (Planetary Science)", detail: "A leading figure in the search for life on other planets. MacArthur Genius Award winner. Her research on exoplanet atmospheres has made her one of the most publicly prominent astronomers in the world." },
          { name: "David Autor (Economics)", detail: "Leading researcher on the future of work, automation, and labor markets. His research on how technology changes employment is cited by economists and policymakers globally." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Hacks", detail: "MIT's tradition of elaborate, technically sophisticated pranks called 'hacks.' A full-size replica police car was placed on the Great Dome (with working lights and donuts inside). A Wright Brothers airplane appeared on the Dome. Organizing a hack requires the same problem-solving skills as any MIT engineering project. The Hacks archive at the MIT Museum documents decades of them." },
          { name: "East Campus (EC)", detail: "MIT's most creatively unconventional dorm. Residents paint walls, remove walls, build elaborate room structures, and organize themed floor cultures. Produces a disproportionate number of MIT's most creative graduates — and its most elaborate hacks." },
          { name: "MIT OpenCourseWare (OCW)", detail: "MIT makes all course materials freely available online — a philosophical statement that knowledge belongs to everyone. Students who have learned from OCW before applying and mention specific courses demonstrate a level of engagement with MIT's mission that most applicants lack." },
          { name: "The Green Building (Building 54)", detail: "A 21-story tower frequently the target of hacks — decorated as a giant Tetris game, a large die, an Advent calendar. Houses Earth, Atmospheric, and Planetary Sciences." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "CSAIL", detail: "The largest AI research lab at any university. Over 900 researchers. The World Wide Web was invented here (Tim Berners-Lee's lab). RSA encryption was developed here. Undergraduate researchers work alongside PhD students and faculty." },
          { name: "Media Lab", detail: "The most famous interdisciplinary research lab in the world for creativity, technology, and design. Electronic ink (used in Kindle), the OLPC laptop, and wearable computing were developed here." },
          { name: "Broad Institute (MIT-Harvard)", detail: "CRISPR-Cas9 gene editing technology was developed here. Undergraduates contribute to work with direct medical applications." },
        ],
      },
    ],
  },
  {
    id: "brown",
    name: "Brown",
    essayWarning: "Brown's Open Curriculum is a philosophy, not a policy. The essay must explain why THIS student's intellectual self-direction requires exactly this structure. 'I love taking any class I want' fails the test. The question is: what do you already know about your own learning that makes the Open Curriculum essential?",
    categories: [
      {
        label: "Open Curriculum Specifics",
        emoji: "📜",
        items: [
          { name: "No Required Courses", detail: "Brown undergraduates have no distribution requirements and no core curriculum. Every course is chosen by the student. The only requirement is completing a concentration (major). Students take rigorous courses — but they choose them based on their own intellectual priorities." },
          { name: "Satisfactory/No Credit (S/NC)", detail: "Students can take any Brown course without a letter grade — chosen at the start of the semester. Incentivizes genuine intellectual risk-taking: a student can take organic chemistry or advanced number theory without threatening their GPA." },
          { name: "Independent Concentration", detail: "Students who cannot find an existing concentration that fits their interests can design their own with faculty approval. Past combinations: economics and theater, neuroscience and philosophy, computational linguistics with Arabic literature." },
          { name: "RISD-Brown Dual Degree", detail: "A five-year program earning a BA from Brown and a BFA from the Rhode Island School of Design simultaneously. The two campuses are adjacent and share a significant shared community. The most distinctive academic offering in Brown's portfolio." },
          { name: "Contemplative Studies", detail: "A concentration unique to Brown — examining the science, philosophy, and cultural history of meditation and contemplative practice. No equivalent exists at any peer institution." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Bonnie Honig (Political Theory)", detail: "Leading scholar of democratic theory and agonistic politics. Author of 'Democracy and the Foreigner.' Her work on the role of conflict in democratic life has made her one of the most prominent political theorists in America." },
          { name: "Wendy Chun (Modern Culture and Media)", detail: "Pioneer of software studies and digital culture. Author of 'Programmed Visions.' Her research on how software shapes social categories is foundational to digital humanities." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Van Wickle Gates", detail: "The ceremonial gate opened only twice a year: in fall to welcome new students, in spring to send graduates off. Alumni describe the gate opening as one of the most emotionally significant moments of their four years." },
          { name: "Spring Weekend", detail: "Annual spring music festival on the Main Green, organized by the Brown Concert Agency — a student organization that negotiates directly with music labels. Has featured Kendrick Lamar and Phoebe Bridgers." },
          { name: "Sex Power God (SPG)", detail: "Brown's annual LGBTQ+ dance party in Meehan Auditorium — one of the most visible expressions of Brown's commitment to sexual freedom. Intentionally not publicized to outside press. Its existence is a signal of Brown's campus culture." },
          { name: "New Curriculum Founding Myth", detail: "Brown students and alumni refer to the 1969 adoption of the Open Curriculum as the university's defining moment — the result of student activist pressure. It is treated not as an administrative policy but as a founding event." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "Watson Institute for International and Public Affairs", detail: "Home to the Costs of War Project — the most comprehensive ongoing assessment of the human and financial costs of post-9/11 US wars. Undergraduate fellowships available." },
          { name: "Carney Institute for Brain Science", detail: "Interdisciplinary neuroscience research across biology, cognitive science, and psychiatry. Undergraduate research positions available." },
          { name: "Brown Arts Initiative (BAI)", detail: "Brings artists-in-residence across visual art, theater, music, and film. Undergraduates participate in residency programming alongside visiting artists." },
        ],
      },
    ],
  },
  {
    id: "dartmouth",
    name: "Dartmouth",
    essayWarning: "The Why Dartmouth essay matters more here than at any other Ivy. The D-Plan, outdoor culture, and residential community are the entire point of Dartmouth. A generic Ivy League Why Us essay will fail.",
    categories: [
      {
        label: "The D-Plan (Critical)",
        emoji: "📅",
        items: [
          { name: "Quarter System", detail: "Dartmouth uses a quarter system (10-week terms) — students take 3-4 courses per term. Fall, Winter, Spring, and Summer are all active academic terms. The pace is faster and the depth per course is different from semester schools." },
          { name: "Required Terms", detail: "All students must be on campus in Fall of sophomore year and Summer of junior year. All other terms can be used for off-campus programs — language study abroad (LSA+), research, internships, or student-designed independent terms." },
          { name: "Off-Term Flexibility", detail: "The D-Plan allows up to four off-campus terms designed around specific goals. Unique among Ivies and attracts students who want to integrate academic and professional work in a structured way." },
          { name: "Mixed Class Years", detail: "Because students are on different D-Plan schedules, every term has a mix of class years in residential halls. There is no 'senior isolation' — seniors and freshmen share dining spaces, clubs, and social life throughout all four years." },
        ],
      },
      {
        label: "Outdoor Culture (Essential)",
        emoji: "🏔️",
        items: [
          { name: "Dartmouth Outing Club (DOC)", detail: "Founded 1909 — the oldest and largest collegiate outing club in the US. Maintains over 75 miles of trails and a network of backcountry huts. Dartmouth owns the Moosilauke Ravine Lodge — a fully operational mountain lodge in the White Mountains accessible only by hiking trail, used for student retreats and faculty seminars." },
          { name: "First-Year Trips (FYT)", detail: "All incoming students spend the week before orientation on a multi-day outdoor trip led by sophomore trip leaders. Hiking, canoe, service, farm, and cycling trips. Consistently rated by Dartmouth students as the most important community-building experience of their four years." },
          { name: "Dartmouth Skiway", detail: "Dartmouth owns and operates its own ski area 35 minutes from campus. Student skiing is subsidized. The ski patrol is entirely student-operated. No other Ivy League institution has anything comparable." },
          { name: "Moosilauke Ravine Lodge", detail: "A backcountry lodge in the White Mountains, accessible only by hiking trail or ski. Used for First-Year Trips, faculty seminars, and student retreats. Alumni describe their Moosilauke experiences as among the most memorable of their Dartmouth years." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Winter Carnival", detail: "Annual winter festival featuring an elaborate snow sculpture competition on the Green, ice skating, ski racing at the Skiway, and a major social weekend. Unique among American universities." },
          { name: "Homecoming Bonfire", detail: "A massive bonfire each fall, with the freshman class running around it for a number of laps equal to the current year (Class of 2028 runs 28 laps). A tradition since 1887." },
          { name: "Hanover, New Hampshire", detail: "Dartmouth is in a rural town of 11,000 people — the smallest setting of any Ivy. This creates an inescapable community where everyone knows everyone. The intensity is either Dartmouth's greatest asset or its greatest challenge." },
          { name: "Native American Program (NAAP)", detail: "Dartmouth was chartered partly to educate Native Americans (1769). Has the largest percentage of Native American students of any Ivy and the strongest Native American Studies program." },
        ],
      },
      {
        label: "Clubs & Organizations",
        emoji: "🏛️",
        items: [
          { name: "Dartmouth Debate", detail: "One of the strongest competitive debate programs in the Ivy League, consistently placing students at national championships." },
          { name: "Dartmouth Entrepreneurial Network (DEN)", detail: "Connects student entrepreneurs with Dartmouth alumni investors and mentors. Runs annual entrepreneurship awards with funding for student ventures." },
          { name: "Muslim Students Association", detail: "Organizes Friday prayers, Ramadan programming, and interfaith events. Smaller than counterparts at larger schools, noted for close community bonds." },
          { name: "Hillel at Dartmouth", detail: "Active Jewish community with Shabbat dinners, Birthright Israel trips, and political programming." },
        ],
      },
    ],
  },
  {
    id: "cornell",
    name: "Cornell",
    essayWarning: "Cornell is the most school-specific Ivy. An essay that doesn't convincingly match your hook to the specific Cornell college you're applying to will fail. 'I want to go to Cornell because of its academic excellence' is the worst possible opening.",
    categories: [
      {
        label: "The School System (Critical to Know)",
        emoji: "🏛️",
        items: [
          { name: "College of Arts & Sciences (CAS)", detail: "Cornell's liberal arts college — the most flexible of Cornell's colleges, housing over 40 majors. The 'curiosity' essay asks applicants to name a specific captivating topic — the answer must directly connect to CAS programs." },
          { name: "School of Industrial and Labor Relations (ILR)", detail: "The only Ivy League school with a dedicated labor relations and human resources college. Required for students interested in employment law, union organizing, HR management, or labor economics. Cornell ILR is the unambiguous best in the world for this field." },
          { name: "College of Agriculture and Life Sciences (CALS)", detail: "One of the most comprehensive agricultural and life science programs in the US. Includes environmental science, nutritional science, animal science, and plant biology. The Dilmun Hill student farm allows undergraduates to grow food on Cornell land." },
          { name: "School of Hotel Administration (SHA)", detail: "The most prestigious hospitality management school in the world. Produces a disproportionate share of hotel chain executives and restaurant entrepreneurs. Its global alumni network is unmatched in the industry." },
          { name: "College of Human Ecology (CHE)", detail: "A uniquely Cornell college combining nutrition science, design and environmental analysis, human development, fiber science, and policy analysis. The interdisciplinary structure is found nowhere else in the Ivy League." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "The Gorges", detail: "Cornell's campus is dramatically cut by the gorges of Fall Creek and Cascadilla Creek. The suspension bridges are the most photographed campus spots. Students swim in the gorges during warm months. No other Ivy campus has a comparable physical feature." },
          { name: "Slope Day", detail: "The last day of classes each spring, when students gather on Libe Slope for a major outdoor concert. Draws students from all of Cornell's colleges together on the same hill." },
          { name: "Dragon Day", detail: "Architecture school first-years build a massive dragon sculpture in secret and parade it through campus on a day kept secret until the last moment. The dragon is then burned. Unique to Cornell's AAP school." },
          { name: "Cornell Botanic Gardens", detail: "2,800 acres of natural area surrounding campus — one of the largest university botanic gardens in the US. Alumni consistently rate it as the campus resource they most underused." },
          { name: "Pumpkin Drop", detail: "Physics students drop a pumpkin from McGraw Tower on Halloween to calculate terminal velocity. Scientific rigor applied to complete absurdity — somehow perfectly Cornell." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "Cornell Lab of Ornithology", detail: "The world's leading bird research institution. eBird — the most widely used citizen science platform globally with over 100 million observations — was developed here. Undergraduates contribute to active research projects." },
          { name: "Cornell Center for Astrophysics and Planetary Science", detail: "Houses the legacy of Carl Sagan's research team (Sagan taught at Cornell for three decades) and ongoing planetary science research. The Carl Sagan Institute continues his work on the search for life in the universe." },
          { name: "Atkinson Center for Sustainability", detail: "Cross-disciplinary sustainability research connecting agriculture, energy, ecology, and policy. Undergraduate faculty partnerships available across all Cornell colleges." },
        ],
      },
    ],
  },
  {
    id: "berkeley",
    name: "UC Berkeley",
    essayWarning: "Berkeley's PIQs demand direct answers to specific questions. Literary openings waste word count. Berkeley values demonstrated community impact above intellectual abstraction. The question is never 'what are you interested in?' but 'what have you actually done?'",
    categories: [
      {
        label: "Schools & Programs",
        emoji: "📚",
        items: [
          { name: "Haas School of Business", detail: "One of only five AACSB-accredited undergraduate business programs in the UC system. Admission requires completing specific prerequisite courses and a separate application after your first year. Haas graduates enter finance, consulting, and tech with a network second only to Wharton among public universities." },
          { name: "College of Engineering (CoE) — EECS", detail: "One of the top three engineering schools in the world. EECS is the most competitive direct-admit track. Particularly strong in robotics, AI/machine learning, and clean energy." },
          { name: "Rausser College of Natural Resources", detail: "Focuses on food systems, environmental policy, agricultural economics, and conservation biology. Students interested in the intersection of ecology and policy find courses unavailable elsewhere." },
          { name: "CalTeach Program", detail: "A teacher preparation program embedded within science and math majors. Students earn a STEM BA while completing California teacher certification. One of the most effective teacher recruitment programs at any research university." },
        ],
      },
      {
        label: "Notable Professors",
        emoji: "🎓",
        items: [
          { name: "Jennifer Doudna (Chemistry, Molecular Biology)", detail: "Nobel Prize winner in Chemistry (2020) for developing CRISPR-Cas9 gene editing technology — one of the most transformative scientific achievements of the 21st century, developed at Berkeley." },
          { name: "Emmanuel Saez (Economics)", detail: "Leading researcher on economic inequality and wealth distribution. His database of US income inequality is the definitive empirical resource on the topic, cited in congressional testimony and presidential speeches." },
          { name: "Judith Butler (Comparative Literature)", detail: "Author of 'Gender Trouble' — the foundational text of contemporary gender theory. Their work on performativity has defined gender studies globally for 30 years." },
        ],
      },
      {
        label: "Traditions You Must Know",
        emoji: "🎭",
        items: [
          { name: "Sproul Plaza and the Free Speech Movement", detail: "The Free Speech Movement of 1964 is the defining event in American university student protest history. Sproul Plaza, where Mario Savio stood on a police car to address thousands, remains the most politically active public space of any American university. Tables for over 200 student organizations line the plaza daily." },
          { name: "The Big C", detail: "A giant 'C' painted in Berkeley's blue and gold on the hills above campus. Hiking up is a freshman rite of passage. The view encompasses the entire San Francisco Bay on clear days." },
          { name: "Campanile (Sather Tower)", detail: "A 307-foot bell tower modeled on St. Mark's Campanile in Venice. Students can ride the elevator to an observation deck — a fact most students don't discover until a professor mentions it. The carillon (61-bell instrument) plays concerts three times daily." },
          { name: "Big Game (Berkeley-Stanford)", detail: "The 1982 'The Play' — where Cal returned a kickoff through the Stanford band — is the most famous moment in college football history. The rivalry predates the Ivy League." },
        ],
      },
      {
        label: "Research Institutes",
        emoji: "🔬",
        items: [
          { name: "Lawrence Berkeley National Laboratory (LBNL)", detail: "Department of Energy national laboratory directly affiliated with Berkeley. Undergraduate research through the SULI program. Research spans advanced materials, climate modeling, biosciences, and particle physics." },
          { name: "Center for Effective Global Action (CEGA)", detail: "Development economics and global health research using randomized controlled trials. CEGA research directly influences World Bank and USAID programming. Undergraduate research involvement through the apprentice program." },
          { name: "Berkeley Institute of Data Science (BIDS)", detail: "Data science research across all disciplines. Berkeley's data science curriculum is one of the most developed at any public university. Undergraduate research affiliate positions available." },
        ],
      },
    ],
  },
];
