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
  { id: "amherst", name: "Amherst College", essayWarning: "Amherst's Open Curriculum is the entire point — any Why Amherst essay that does not specifically explain why the absence of distribution requirements is right for THIS student will fail. Generic praise of their academics misses what makes Amherst genuinely distinctive.", categories: [
  { label: "The Open Curriculum", emoji: "📜", items: [
    { name: "No Distribution Requirements", detail: "Amherst is one of only a handful of colleges in the US with a completely open curriculum — no required courses outside your major. Every student designs their own academic path. This is a philosophical commitment to intellectual self-direction, not just an administrative policy." },
    { name: "The Senior Thesis", detail: "Every Amherst student completes a substantial independent research thesis in their major field. The thesis is the culmination of the Amherst education and is taken extremely seriously by faculty." },
    { name: "Small Seminars", detail: "Average class size of 15 students. Every course is discussion-based. Faculty teach all classes — no teaching assistants lead sections at Amherst." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Sabrina, The Amherst Mascot", detail: "Amherst's unofficial mascot is Lord Jeff — a figure now controversial due to his historical role in distributing smallpox blankets. Students have debated replacing him with Sabrina the mammoth. This debate reveals Amherst's culture of historical reckoning." },
    { name: "Five College Consortium", detail: "Amherst students can take courses at Smith, Mount Holyoke, Hampshire, and UMass Amherst for free — giving access to 6,500 additional courses and a community of 30,000 students while living on a campus of 1,800." },
    { name: "Val (Valentine Dining Hall)", detail: "Valentine Dining Hall is the social center of Amherst life. The food is exceptional by college standards — Amherst consistently ranks among the top college dining experiences in the US." }
  ]},
  { label: "Academic Culture", emoji: "📚", items: [
    { name: "Phi Beta Kappa", detail: "Amherst sends more students to Phi Beta Kappa per capita than almost any other institution. Academic seriousness is not performative here — it is the actual culture." },
    { name: "Hampshire College Proximity", detail: "Hampshire College — the most experimental college in America, with no grades and no majors — is a 10-minute drive away and part of the consortium. Some Amherst students take courses there for a deliberately unstructured intellectual experience." }
  ]}
]},

{ id: "williams", name: "Williams College", essayWarning: "Williams is the most rural top liberal arts college in the US — Williamstown is genuinely remote. Any essay that ignores this or treats it as a negative will fail. Williams students actively choose the rural intensity. The Tutorial System — modeled on Oxford — is their most distinctive academic feature and must be referenced.", categories: [
  { label: "The Tutorial System", emoji: "📚", items: [
    { name: "Oxford-Style Tutorials", detail: "Williams offers tutorials modeled directly on the Oxford system — two students meet weekly with a faculty member, one presents a paper, the other critiques it, then they switch. No other American liberal arts college has this system at scale." },
    { name: "Winter Study", detail: "Every January, Williams suspends regular academics for a month-long Winter Study period. Students pursue independent projects, short courses, or travel programs with minimal structure. Past Winter Study projects have included dog sledding in Alaska, studying jazz in New Orleans, and independent film production." },
    { name: "Cluster System", detail: "Williams organizes its curriculum into three clusters — social sciences, humanities, and sciences — with a writing-intensive course requirement in each. This is different from distribution requirements — it emphasizes writing across all fields." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Mountain Day", detail: "Once per fall semester, the president rings a chapel bell unannounced — classes are cancelled for the day and students hike to the top of Mount Greylock, the highest peak in Massachusetts. It is never announced in advance." },
    { name: "The Purple Valley", detail: "Williams is called the Purple Valley — sitting in the Berkshire Mountains, surrounded by farms and mountains. The isolation is intentional. Williams students are said to develop unusually intense bonds because there is nowhere else to go." },
    { name: "WCFM Radio", detail: "Williams College FM radio station, founded 1941 — one of the oldest college radio stations in the US. Student-run entirely." }
  ]},
  { label: "The Arts", emoji: "🎨", items: [
    { name: "Williams College Museum of Art (WCMA)", detail: "One of the finest college art museums in the world. WCMA's collection includes works by Winslow Homer, Edward Hopper, and Andy Warhol. Art history students work directly with the collection." },
    { name: "Williamstown Theatre Festival", detail: "A professional summer theater festival that takes place on Williams's campus — one of the most prestigious summer theaters in the US. Williams students can work alongside professional actors during the school year in affiliated productions." }
  ]}
]},

{ id: "bowdoin", name: "Bowdoin College", essayWarning: "Bowdoin's dining hall is not just a fact — it is the heart of their community philosophy. The Arctic Museum, the Coastal Studies Center, and their commitment to Maine are all genuinely distinctive. Any Why Bowdoin essay must show understanding of their community-first culture.", categories: [
  { label: "Distinctive Programs", emoji: "📚", items: [
    { name: "Peary-MacMillan Arctic Museum", detail: "Bowdoin is the only college in the US with a dedicated Arctic museum — honoring alumni Robert Peary and Donald MacMillan, polar explorers. The museum anchors Bowdoin's environmental research identity." },
    { name: "Coastal Studies Center", detail: "A 118-acre peninsula in Harpswell, ME — Bowdoin's field research station for environmental, marine, and ecological studies. Undergraduates conduct original research here as early as freshman year." },
    { name: "Digital and Computational Studies", detail: "Bowdoin's DCS program is one of the most innovative interdisciplinary technology programs at any liberal arts college — combining computer science with humanities, social science, and the arts." }
  ]},
  { label: "Traditions & Community", emoji: "🎭", items: [
    { name: "Dining Hall Culture", detail: "Bowdoin's dining is repeatedly ranked the best in the nation. More importantly, it is a central community institution — faculty eat with students regularly, and the dining hall is where much of Bowdoin's intellectual life happens informally." },
    { name: "The Common Good", detail: "Bowdoin's founding vision — expressed in their 'Offer of the College' — commits students to the common good of society. This is not a motto but an active expectation that shapes how students engage with their community." },
    { name: "Senior Week in Maine", detail: "Seniors spend their final week hiking, sailing, and celebrating in Maine — a tradition that reflects Bowdoin's relationship with the natural environment as an active part of education." }
  ]},
  { label: "Faculty & Research", emoji: "🔬", items: [
    { name: "Student-Faculty Research", detail: "Bowdoin has one of the highest rates of undergraduate student-faculty research collaboration of any liberal arts college. Students co-author papers with faculty as early as sophomore year." }
  ]}
]},

{ id: "middlebury", name: "Middlebury College", essayWarning: "Middlebury's Language Schools are world-famous — immersive summer programs where participants sign pledges not to speak English. Their environmental studies program is among the strongest in the US. Any Why Middlebury essay that ignores both of these is missing what makes Middlebury genuinely different.", categories: [
  { label: "Language & Global Programs", emoji: "🌍", items: [
    { name: "Language Schools (Summer)", detail: "Middlebury's Language Schools are arguably the most famous immersive language programs in the world — 9 languages, participants pledge to speak only the target language for the entire summer. Graduates of these programs achieve near-native fluency in weeks." },
    { name: "Middlebury Institute (MIIS)", detail: "Middlebury's graduate school in Monterey, CA focuses on international policy, translation, and nonproliferation studies. Undergraduates can take courses there during their studies." },
    { name: "Schools Abroad", detail: "Middlebury operates its own study abroad programs in 17 countries — students go as part of the Middlebury network, not through a third-party provider. The immersion is deeper and the academic rigor is maintained." }
  ]},
  { label: "Environment & Sustainability", emoji: "🌿", items: [
    { name: "Carbon-Neutral Campus", detail: "Middlebury was the first US college to achieve carbon neutrality. Their Environmental Studies program — one of the strongest in the country — is not just an academic department but a lived institutional commitment." },
    { name: "Bread Loaf School of English", detail: "Middlebury's summer writing school in the mountains of Vermont is one of the most prestigious creative writing and literary studies programs in America. Robert Frost taught here for decades." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Winter Carnival", detail: "Middlebury's Winter Carnival — one of the oldest in the US — celebrates Vermont's winter with snow sculpture, skiing, and community events. The surrounding mountains are treated as part of the campus." },
    { name: "Ski Team", detail: "Middlebury's ski team is among the best in the NCAA — partly because the mountains literally surround the campus. This is not a coincidence but a reflection of Vermont's outdoor culture being genuinely embedded in Middlebury's identity." }
  ]}
]},

{ id: "georgetown", name: "Georgetown University", essayWarning: "Georgetown requires EVERY applicant to engage with their Jesuit Catholic identity. The essay asking about the Jesuit tradition is not optional and cannot be answered generically. Students who ignore the Jesuit tradition or treat it as a religious technicality reveal they have not understood what Georgetown is.", categories: [
  { label: "Jesuit Identity", emoji: "✝️", items: [
    { name: "Cura Personalis", detail: "Care for the whole person — not just the intellect but the spiritual, physical, and social dimensions. Georgetown's advising system, their student services, and their campus culture are all shaped by this principle." },
    { name: "Arrupe Fellows Program", detail: "Named after Pedro Arrupe, former Superior General of the Jesuits. Fellows spend a year working full-time with nonprofit organizations while completing their degree — integrating service into academic formation." },
    { name: "Woodstock Theological Center", detail: "One of the oldest Jesuit intellectual institutions in the US, now housed at Georgetown. Hosts public lectures on ethics, politics, and global affairs accessible to all students." }
  ]},
  { label: "The Walsh School of Foreign Service (SFS)", emoji: "🌐", items: [
    { name: "School of Foreign Service", detail: "Founded 1919 — the oldest school of international affairs in the United States. SFS graduates include senior diplomats, secretaries of state, and heads of government. The core curriculum requires every SFS student to take the same sequence of international relations courses." },
    { name: "Georgetown's DC Location", detail: "Every major international institution — the World Bank, IMF, State Department, Pentagon, Congress — is within reach by Metro. Georgetown's DC location is not incidental but central to their educational model." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Healy Hall", detail: "Georgetown's iconic Romanesque building — built 1879 — houses the president's office and is the visual center of campus. The gargoyles on Healy Hall are a famous Georgetown landmark." },
    { name: "GU272", detail: "In 2019, Georgetown students voted to assess themselves a fee to benefit the descendants of the 272 enslaved people sold by Georgetown in 1838 to pay the university's debts. This is a landmark moment in American universities reckoning with their histories of slavery." }
  ]}
]},

{ id: "vanderbilt", name: "Vanderbilt University", essayWarning: "Vanderbilt's combination of a top research university with a genuinely warm Southern culture is their most distinctive feature. Any essay that only focuses on their academic rankings misses what actually makes Vanderbilt special — the immersive learning programs, the residential college system, and Nashville.", categories: [
  { label: "Immersive Learning", emoji: "📚", items: [
    { name: "Vanderbilt Immersion Vanderbilt (VIM)", detail: "Vanderbilt's flagship experiential learning program — students design their own immersive project (research, service, creative, or entrepreneurial) and carry it out over a semester with faculty mentorship." },
    { name: "Blair School of Music", detail: "One of the few top-tier music conservatories embedded within a research university. Blair students take a full liberal arts curriculum alongside conservatory training — a combination found at very few institutions." },
    { name: "Peabody College of Education", detail: "Consistently ranked the top education school in the US. Uniquely, Peabody is embedded within Vanderbilt rather than being a separate institution — education students have full access to Vanderbilt's research resources." }
  ]},
  { label: "Nashville & Culture", emoji: "🎸", items: [
    { name: "Nashville as Curriculum", detail: "Nashville is the fastest-growing major city in the US. Vanderbilt students intern at major music labels, healthcare companies (HCA Healthcare is headquartered here), and political organizations. The city is treated as an extension of the university." },
    { name: "Rand Dining (Commons)", detail: "The Vanderbilt Commons is the freshman residential community — all first-year students live and eat together in a dedicated section of campus. Upper-level students are assigned to one of four residential colleges, each with a faculty Head of House." }
  ]},
  { label: "Research", emoji: "🔬", items: [
    { name: "Vanderbilt University Medical Center", detail: "One of the top academic medical centers in the US — directly affiliated with Vanderbilt. Undergraduate research positions are available in medical research as early as freshman year." }
  ]}
]},

{ id: "rice", name: "Rice University", essayWarning: "Rice's residential college system is not like any other in the US — students belong to one of 11 colleges for ALL four years, including upperclassmen. Any Why Rice essay that does not address the residential college system and what the student will contribute to that community is missing Rice's most essential feature.", categories: [
  { label: "Residential College System", emoji: "🏛️", items: [
    { name: "11 Residential Colleges", detail: "Baker, Will Rice, Hanszen, Wiess, Jones, Brown, Sid Richardson, Lovett, Martel, Duncan, and McMurtry. Each has a distinct culture, traditions, intramural sports teams, and a Master (faculty member who lives in the college with their family). Students rank colleges before arrival and are assigned for all four years." },
    { name: "O-Week", detail: "Orientation Week is run entirely by upperclassmen volunteers from each residential college. New students bond intensely with their college community before classes begin. It is designed to simulate the feeling of being adopted into a family." },
    { name: "Beer Bike", detail: "The oldest continuous tradition at Rice — a relay race combining cycling and drinking (non-alcoholic options available). Each residential college fields a team. This is taken very seriously, combining athletic competition with elaborate creative costumes and college pride." }
  ]},
  { label: "Academic Distinctives", emoji: "📚", items: [
    { name: "The Shepherd School of Music", detail: "One of the top music conservatories in the US, housed within a research university. Like Blair at Vanderbilt, Shepherd students study full liberal arts alongside conservatory training." },
    { name: "Honor Code", detail: "Rice's Honor Code is among the most extensive in the US — professors regularly leave the room during exams. Students self-schedule final exams within a window. The honor system governs academic and social conduct alike." },
    { name: "OEDK (Oshman Engineering Design Kitchen)", detail: "A state-of-the-art fabrication facility open to all Rice students — any student can use 3D printers, laser cutters, and machine tools. Design thinking is embedded across Rice's curriculum." }
  ]}
]},

{ id: "northwestern", name: "Northwestern University", essayWarning: "Northwestern is NOT a traditional liberal arts university — it is a collection of highly specialized professional schools (Medill journalism, Kellogg business pipeline, McCormick engineering, Bienen music, Theatre department) alongside a liberal arts college. Any Why Northwestern essay must specify which school within Northwestern and why.", categories: [
  { label: "Professional Schools", emoji: "📚", items: [
    { name: "Medill School of Journalism", detail: "The most prestigious journalism school in the US. Medill's Integrated Marketing Communications program and their journalism program both consistently rank #1 or #2 nationally. Medill graduates include a remarkable concentration of major American journalists and media executives." },
    { name: "Theatre & Interpretation", detail: "Northwestern's theatre program is considered one of the best in the country — its alumni include Zach Braff, Julia Louis-Dreyfus, and Warren Beatty. It is housed within the School of Communication rather than a separate conservatory." },
    { name: "Kellogg Business School Pipeline", detail: "Northwestern undergraduates can take courses at Kellogg (the top-ranked business school) through the MEDS program. The proximity of Kellogg shapes Northwestern's strong pre-professional culture." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Dillo Day", detail: "Northwestern's annual spring music festival — one of the largest student-run music festivals in the US. Student government books major acts. The festival takes place on the lakefront." },
    { name: "Lake Michigan Lakefront", detail: "Northwestern's campus sits directly on Lake Michigan — one of the most beautiful campus settings in the US. The lakefill (a manmade peninsula) is used for recreation, study, and the annual Dillo Day festival." },
    { name: "Arch Sing", detail: "A cappella groups perform under the arch of University Hall on the last day of classes each quarter — a tradition that reflects Northwestern's strong vocal music culture." }
  ]},
  { label: "Research", emoji: "🔬", items: [
    { name: "MRSEC (Materials Research)", detail: "Northwestern's Materials Research Science and Engineering Center is one of the most funded in the US. Their nanotechnology and materials science research is consistently ranked among the top in the world." }
  ]}
]},

{ id: "uchicago", name: "University of Chicago", essayWarning: "UChicago's extended essay prompt is the most unusual in college admissions. Students who treat it like a personal statement have fundamentally misunderstood UChicago. The prompt rewards genuine intellectual playfulness, self-awareness, and comfort with ambiguity. The Core Curriculum — requiring every student to take the same sequence of challenging courses — is UChicago's most defining feature and must be engaged with.", categories: [
  { label: "The Core Curriculum", emoji: "📜", items: [
    { name: "Humanities Core", detail: "A three-year sequence covering the history of Western thought from ancient Greece through the 20th century. Every student, regardless of major, reads the same primary texts — Plato, Thucydides, Shakespeare, Kant, Marx, Woolf — in small discussion seminars of 17 students." },
    { name: "Social Sciences Core", detail: "A two-year sequence covering the major social science traditions — economics, sociology, political science, anthropology — through primary texts rather than textbooks. Students read Adam Smith, Max Weber, Emile Durkheim, and Clifford Geertz." },
    { name: "Biological Sciences Core", detail: "Every UChicago student takes a year of biological sciences — not watered-down survey courses but genuine engagement with evolutionary biology, genetics, and ecology. The Core is considered extremely demanding even by UChicago's own students." }
  ]},
  { label: "Intellectual Culture", emoji: "🧠", items: [
    { name: "The Gray City / The Life of the Mind", detail: "UChicago students famously describe their university as 'where fun comes to die' — a self-aware joke that reflects their genuine pride in intellectual intensity. The dominant culture is one of argument, rigor, and genuine engagement with ideas for their own sake." },
    { name: "The Scavenger Hunt", detail: "UChicago's annual Scavenger Hunt — run by students — is the longest and most elaborate college scavenger hunt in the US. Past items have included building a functional nuclear reactor (a real one was built in 1999 and disqualified)." },
    { name: "University Theater", detail: "UChicago's entirely student-run theater company — no faculty director — produces 40+ shows per year. Students direct, design, and produce every aspect of every production." }
  ]},
  { label: "Research", emoji: "🔬", items: [
    { name: "The Booth School of Business", detail: "UChicago's business school is the intellectual home of the Chicago School of Economics — Milton Friedman, Gary Becker, Eugene Fama all taught here. More economics Nobel laureates have been affiliated with UChicago than any other institution." }
  ]}
]},

{ id: "jhu", name: "Johns Hopkins University", essayWarning: "Hopkins is defined by research above all else — their motto is Veritas vos liberabit (The truth will set you free). Any student who does not reference their interest in conducting original research is missing Hopkins's core identity. The Applied Physics Laboratory and their relationship with the Bloomberg School of Public Health are genuinely unique.", categories: [
  { label: "Research Culture", emoji: "🔬", items: [
    { name: "KSAS Undergraduate Research", detail: "Hopkins has one of the highest rates of undergraduate research participation of any university — over 80% of undergraduates conduct independent research before graduating. The Provost's Undergraduate Research Award funds student projects across all disciplines." },
    { name: "Applied Physics Laboratory", detail: "Johns Hopkins APL is one of the largest university-affiliated research centers in the world — employing 8,000 people and doing work for NASA, DARPA, and the Department of Defense. Undergraduate internships are available." },
    { name: "Bloomberg School of Public Health", detail: "The #1 ranked public health school in the world — founded 1916, the first school of public health in the US. Their COVID-19 dashboard during the pandemic was the most-visited public health resource globally." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Spring Fair", detail: "The largest student-run outdoor festival on the East Coast — held every spring on the Homewood campus. Features music, food, and over 200 student organizations." },
    { name: "The Chocolate Moose", detail: "A beloved Baltimore ice cream institution — a Hopkins institution by proximity. Indicative of how Hopkins students integrate into Baltimore rather than existing separately from it." }
  ]},
  { label: "Professional Programs", emoji: "📚", items: [
    { name: "Pre-Medical Culture", detail: "Hopkins is the most famous pre-medical university in the US. Their relationship with Johns Hopkins Hospital — ranked #1 in the US for decades — means undergraduates can shadow physicians and conduct clinical research in a way unavailable at most universities." }
  ]}
]},

{ id: "wustl", name: "Washington University in St. Louis", essayWarning: "WashU's culture of combining fields is their defining feature — they actively recruit students with multiple serious interests. Any essay that presents a student as purely one-dimensional misses what WashU is looking for. The Sam Fox School of Design and the McDonnell Genome Institute are genuinely distinctive.", categories: [
  { label: "Interdisciplinary Culture", emoji: "📚", items: [
    { name: "Sam Fox School of Design", detail: "WashU's art and architecture school is consistently ranked among the top 5 in the US. Unlike most architecture programs, Sam Fox students have full access to WashU's research university resources — creating unusual combinations of design and engineering or design and business." },
    { name: "Olin Business School", detail: "WashU's business school — ranked consistently in the top 15 — is distinguished by its focus on leadership and experiential learning. Business students can dual-major with any program in the university." },
    { name: "McDonnell Genome Institute", detail: "One of the top genomics research centers in the world. WashU's genome institute sequenced the first human genome. Undergraduates can conduct research here." }
  ]},
  { label: "Campus Culture", emoji: "🎭", items: [
    { name: "Residential College Houses", detail: "WashU's residential houses have distinct identities — students can live in Residential College houses organized around shared interests (sustainability, global affairs, arts). Faculty fellows live in the houses and host academic events." },
    { name: "The Danforth Campus", detail: "One of the most beautiful campuses in the US — Collegiate Gothic architecture with extraordinary landscaping. The Bear (WashU's mascot) statues are scattered throughout campus as scavenger hunt landmarks." }
  ]}
]},

{ id: "cmu", name: "Carnegie Mellon University", essayWarning: "CMU has seven distinct colleges with completely different cultures. Any essay that does not specify the college being applied to and why that particular college — not CMU generally — is the right fit will fail. The School of Computer Science and the College of Fine Arts are the most globally famous but the Heinz College and Dietrich College are equally distinctive.", categories: [
  { label: "The Seven Colleges", emoji: "🏛️", items: [
    { name: "School of Computer Science (SCS)", detail: "Consistently ranked #1 or #2 in the world for computer science. SCS is where the field of AI, robotics, and human-computer interaction were largely invented. Alumni include Andy Hertzfeld (Macintosh UI designer) and Satya Nadella (Microsoft CEO)." },
    { name: "College of Fine Arts (CFA)", detail: "CFA houses architecture, art, design, drama, and music. CMU's drama department is one of the most famous in the US — alumni include Holly Hunter, Ted Danson, and Zachary Quinto. The combination of fine arts with one of the world's top tech universities is genuinely unique." },
    { name: "Heinz College of Information Systems", detail: "The top information systems and public policy school in the US. Heinz produces a disproportionate number of tech policy leaders and government officials working at the intersection of technology and society." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "The Fence", detail: "A concrete fence near the center of CMU's campus that student organizations paint — overnight, in secret — to announce events. The paint layers are over 60 layers thick. Painting the fence is a beloved CMU tradition and an act of community claim." },
    { name: "Buggy (Sweepstakes)", detail: "CMU's most distinctive tradition — student organizations design and race human-powered vehicles (buggies) across campus at 35mph. Buggy has been running since 1920 and reflects CMU's engineering culture applied to pure fun." }
  ]},
  { label: "Research", emoji: "🔬", items: [
    { name: "Robotics Institute", detail: "Founded 1979 — the world's first and largest robotics research institute. The self-driving car was largely invented here. Undergraduates can join robotics research teams as early as freshman year." }
  ]}
]},

{ id: "emory", name: "Emory University", essayWarning: "Emory's proximity to the CDC and their relationship with the Carter Center are genuinely unique in American higher education — no other university has these two partnerships simultaneously. Any Why Emory essay should reference at least one of these institutional relationships specifically.", categories: [
  { label: "Distinctive Partnerships", emoji: "🌍", items: [
    { name: "CDC Proximity", detail: "The Centers for Disease Control and Prevention is located 3 miles from Emory's campus. Emory runs the CDC's public health training programs and many CDC researchers hold Emory faculty appointments. Undergraduate research opportunities with CDC are available to Emory students." },
    { name: "Carter Center", detail: "The Carter Center — President Jimmy Carter's nonprofit working to eradicate disease and promote democracy globally — is on Emory's campus. Students can intern and conduct research with the Carter Center's global health and democracy programs." },
    { name: "Emory Healthcare", detail: "One of the largest academic medical systems in the Southeast — Emory University Hospital is where the first US Ebola patients were successfully treated in 2014. Pre-med students have exceptional clinical research access." }
  ]},
  { label: "Academic Culture", emoji: "📚", items: [
    { name: "Oxford College of Emory", detail: "Emory's two-year liberal arts college located on the original Emory campus 38 miles away. Oxford students transfer to the main campus for their junior and senior years. Oxford is a genuinely different — smaller, more intimate — educational experience within the Emory system." },
    { name: "Goizueta Business School", detail: "Emory's business school is one of the most respected in the Southeast — their BBA program is ranked consistently in the top 20. Atlanta's position as a major corporate hub (Coca-Cola, Delta, CNN) means exceptional internship access." }
  ]}
]},

{ id: "tufts", name: "Tufts University", essayWarning: "Tufts's 100-word Why Tufts essay is the shortest Why Us essay in elite admissions — and therefore the most demanding. Every word must earn its place. Generic praise is catastrophic at 100 words. The Jonathan M. Tisch College of Civic Life — the only college in the US fully dedicated to active citizenship — is Tufts's most distinctive institutional feature.", categories: [
  { label: "Civic & Global Identity", emoji: "🌍", items: [
    { name: "Jonathan M. Tisch College of Civic Life", detail: "The only college in the US entirely dedicated to civic engagement and active citizenship — not as a virtue signaling exercise but as an academic discipline. Tisch runs the National Study of Learning, Voting, and Engagement, which tracks college student civic participation nationwide." },
    { name: "Fletcher School of Law and Diplomacy", detail: "One of the most prestigious international affairs graduate schools in the world — located on Tufts's campus. Undergraduates can take Fletcher courses and the proximity shapes Tufts's strong international relations culture." },
    { name: "EPIIC (Education for Public Inquiry and International Citizenship)", detail: "A year-long undergraduate colloquium on a specific global policy issue — students research, host symposia, and produce policy recommendations. Alumni have testified before Congress." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Jumbo the Elephant", detail: "Tufts's mascot — named after P.T. Barnum's elephant Jumbo, whose stuffed hide (now destroyed) was housed at Tufts. Students still rub Jumbo's tusk for good luck before exams — the original tusk is long gone but a replica remains." },
    { name: "Midnight Breakfast", detail: "Before every finals period, Tufts's residential advisers serve breakfast at midnight — a tradition that reflects the supportive residential culture Tufts is known for." }
  ]}
]},

{ id: "swarthmore", name: "Swarthmore College", essayWarning: "Swarthmore's Honors Program — where senior students are evaluated entirely by external examiners from other universities in week-long seminars — exists nowhere else in American higher education. Any Why Swarthmore essay that ignores this feature has not done adequate research.", categories: [
  { label: "The Honors Program", emoji: "📜", items: [
    { name: "Honors Seminars", detail: "Starting junior year, Honors students replace regular courses with seminars of 6-8 students meeting weekly. There are no grades during the two years — evaluation happens in a final Honors examination week conducted entirely by external scholars from other universities who have never taught the students." },
    { name: "External Examiners", detail: "Swarthmore's external examiner system — modeled on Oxford — means students are evaluated by scholars who have no relationship with them. This prevents grade inflation and forces genuine intellectual mastery." }
  ]},
  { label: "Quaker Values", emoji: "☮️", items: [
    { name: "Quaker Meeting", detail: "Swarthmore was founded by Quakers in 1864. While no longer religiously affiliated, Quaker values of consensus decision-making, simplicity, and social justice continue to shape campus governance and culture." },
    { name: "Engineering at a Liberal Arts College", detail: "Swarthmore is one of only a handful of liberal arts colleges with a fully accredited engineering program. ABET-accredited Swarthmore engineers take the same humanities distribution requirements as all other students — producing unusually broadly educated engineers." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Pterodactyl Hunt", detail: "Swarthmore's annual scavenger hunt — run by students in costume. Reflects the college's culture of serious academics combined with deliberate playfulness." },
    { name: "Scott Arboretum", detail: "Swarthmore's 300-acre campus is itself an arboretum — one of the finest collections of trees and plants in the US. The campus as living laboratory reflects Swarthmore's commitment to beauty as part of education." }
  ]}
]},

{ id: "pomona", name: "Pomona College", essayWarning: "Pomona's 5-College Consortium — giving students access to Claremont McKenna, Harvey Mudd, Scripps, and Pitzer in addition to Pomona — is their most distinctive feature. Students get small college intimacy with large university course variety. Any Why Pomona essay must acknowledge this unique structure.", categories: [
  { label: "The Claremont Consortium", emoji: "🏛️", items: [
    { name: "5-College Access", detail: "Pomona students can take any course at Claremont McKenna, Harvey Mudd, Scripps, or Pitzer for free. The consortium shares a library system, health services, and cultural programming — creating a community of 3,500 students with the course offerings of a large university." },
    { name: "Cross-Registration Culture", detail: "Pomona students routinely take courses at Harvey Mudd for engineering or mathematics, at CMC for economics and government, or at Scripps for feminist theory. The cross-pollination of ideas is central to the Pomona intellectual experience." }
  ]},
  { label: "Campus Culture", emoji: "🎭", items: [
    { name: "The Sponsor System", detail: "Each first-year student is assigned a Sponsor — a returning student who organizes social events, academic support, and community building. Sponsors are unpaid volunteers whose role reflects Pomona's culture of peer mentorship." },
    { name: "SunFest", detail: "Pomona's spring festival — held outdoors in Southern California sunshine — features music, food, and the kind of casual celebration that reflects both the California setting and the close-knit community." }
  ]},
  { label: "Academic Strengths", emoji: "📚", items: [
    { name: "Sciences at a Liberal Arts College", detail: "Pomona sends a disproportionate number of students to science PhD programs. Their research equipment rivals many research universities — unusual for a college of 1,800 students." }
  ]}
]},

{ id: "nyu", name: "NYU", essayWarning: "NYU has three full campuses (New York, Abu Dhabi, Shanghai) and multiple schools within the New York campus (Stern, Tisch, CAS, Gallatin, Tandon, Steinhardt). Any essay that does not specify the exact school being applied to and the exact campus is automatically disqualifying. NYU's global network is genuinely unprecedented in American higher education.", categories: [
  { label: "NYU's Global Network", emoji: "🌐", items: [
    { name: "NYU Abu Dhabi", detail: "One of the most selective universities in the world — accepting less than 4% of applicants, fully funded for all students. A genuine research university in the UAE that shares faculty and resources with NYU New York." },
    { name: "NYU Shanghai", detail: "The first Sino-American research university in China — offering a full NYU degree while studying in Shanghai. Students can spend a semester in New York or Abu Dhabi as part of their degree." },
    { name: "15 Global Academic Centers", detail: "NYU operates academic centers in Paris, Florence, London, Berlin, Madrid, Accra, Buenos Aires, Sydney, and more. Undergraduates can study at these centers for a semester or year as part of their degree." }
  ]},
  { label: "School-Specific Identity", emoji: "🏛️", items: [
    { name: "Tisch School of the Arts", detail: "One of the most famous arts schools in the world — film, drama, photography, dance, and interactive media. Tisch alumni include Lady Gaga, Spike Lee, Martin Scorsese, and Ang Lee." },
    { name: "Stern School of Business", detail: "Consistently ranked top 10 in the US. Stern's location in lower Manhattan means Wall Street internships are a subway ride away. The Langone MBA for Working Professionals is housed here." },
    { name: "Gallatin School of Individualized Study", detail: "NYU's interdisciplinary school where students design their own degree with a faculty mentor. No prescribed majors — students write a concentration statement explaining their unique academic path." }
  ]}
]},

{ id: "tulane", name: "Tulane University", essayWarning: "Tulane without New Orleans is unimaginable — the city is their campus, their laboratory, and their identity. Any Why Tulane essay that ignores Hurricane Katrina, their service mission, or New Orleans's culture has fundamentally missed what makes Tulane distinctive.", categories: [
  { label: "New Orleans Identity", emoji: "🎺", items: [
    { name: "Post-Katrina Mission", detail: "Hurricane Katrina in 2005 devastated New Orleans and nearly destroyed Tulane. The university rebuilt with a renewed commitment to public service and community engagement. The Tulane Commitment — mandatory service-learning for all undergraduates — was born from Katrina." },
    { name: "Center for Public Service", detail: "Tulane's Center for Public Service coordinates over 200,000 hours of student community service annually in New Orleans. This is not optional — it is embedded in Tulane's curriculum and graduation requirements." },
    { name: "New Orleans as Laboratory", detail: "Tulane's architecture, public health, social work, and urban planning programs all treat New Orleans as their primary research site. No other major research university is so intimately embedded in a single city's recovery and reinvention." }
  ]},
  { label: "Academic Strengths", emoji: "📚", items: [
    { name: "Freeman School of Business", detail: "Tulane's business school is consistently ranked in the top 25 nationally — their finance and entrepreneurship programs are particularly strong. New Orleans's position as a major energy, healthcare, and logistics hub gives exceptional internship access." },
    { name: "School of Public Health", detail: "One of the few accredited schools of public health embedded within a traditional university. Tulane's public health school has deep ties to Louisiana's unique public health challenges — infectious disease, environmental health, and healthcare access." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Mardi Gras", detail: "Tulane's campus sits in the Uptown neighborhood — the parade routes run directly past the university. Mardi Gras is effectively a university-wide event. Students describe it as unlike anything available at any other university." }
  ]}
]},

{ id: "usc", name: "University of Southern California", essayWarning: "USC is defined by its professional schools — the film school, Viterbi Engineering, Marshall Business, Annenberg Communications. Any essay that addresses USC generally rather than the specific school being applied to will fail. The USC Trojan Network is the most powerful alumni network in Los Angeles.", categories: [
  { label: "Professional Schools", emoji: "🎬", items: [
    { name: "School of Cinematic Arts", detail: "The most famous film school in the world — founded 1929, older than Hollywood talkies. George Lucas, Ron Howard, and John Singleton all attended. The school has its own production facilities, including a fully equipped feature film studio on campus." },
    { name: "Viterbi School of Engineering", detail: "Consistently ranked top 10 in the US for engineering. The USC-Lockheed Martin Institute for Advanced Studies and the USC Institute for Creative Technologies are both housed here." },
    { name: "Marshall School of Business", detail: "USC Marshall is uniquely positioned to take advantage of Los Angeles — the world's largest entertainment, fashion, and sports business hub. Internships at major studios, labels, and agencies are standard for Marshall students." }
  ]},
  { label: "Trojan Network", emoji: "🔴", items: [
    { name: "The Trojan Network", detail: "USC's alumni network in Los Angeles is the most powerful in any major American city. In entertainment, law, medicine, and business, hiring decisions in LA are disproportionately influenced by USC connections. 'Trojan Family' is not a cliché — it is an active professional network." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Tommy Trojan", detail: "The bronze statue of a Trojan warrior at the center of USC's campus — the symbolic heart of the university. Rival teams have historically attempted to paint Tommy Cardinal and Gold before major games." },
    { name: "Heritage Hall", detail: "USC's trophy room — housing the Heisman Trophies won by USC players, the Olympic medals won by USC athletes, and the memorabilia of one of the most successful athletic programs in US history." }
  ]}
]},

{ id: "bc", name: "Boston College", essayWarning: "Boston College's Jesuit identity — like Georgetown's — cannot be ignored. Their motto is Ever to Excel. The essay about contributing to the BC community requires genuine engagement with their Jesuit mission of cura personalis and their emphasis on personal formation alongside academic excellence.", categories: [
  { label: "Jesuit Identity", emoji: "✝️", items: [
    { name: "Cura Personalis at BC", detail: "Care for the whole person at BC manifests in their core curriculum (requiring philosophy, theology, natural sciences, social sciences, arts, and writing), their PULSE Program (philosophy + service learning), and their extensive campus ministry." },
    { name: "PULSE Program", detail: "One of BC's most distinctive offerings — a two-semester philosophy and theology course paired with mandatory community service in Boston. Students work 10 hours per week in social service agencies while studying political philosophy and social ethics." },
    { name: "Connell School of Nursing", detail: "One of the top nursing schools in the US — unusual for a Jesuit liberal arts university. BC nurses combine clinical training with the philosophical education of the Jesuit tradition." }
  ]},
  { label: "Boston & Campus Life", emoji: "🍀", items: [
    { name: "Newton Campus", detail: "BC's freshman residential campus is separate from the main campus — all first-year students live on Newton Campus and take a bus to the main campus for classes. This creates an unusually tight-knit freshman community." },
    { name: "Brighton Location", detail: "BC sits on Beacon Street in Chestnut Hill — 6 miles from downtown Boston. Students have easy access to Boston via the Green Line T, while the campus itself feels like a genuine collegiate community separate from the city." }
  ]}
]},

{ id: "wake-forest", name: "Wake Forest University", essayWarning: "Wake Forest's Pro Humanitate motto — for humanity — is not a platitude but an active expectation. Their small class sizes and genuine professor accessibility are their most consistently cited distinguishing features. At 150 words, every sentence of the Why Wake Forest essay must carry maximum specificity.", categories: [
  { label: "Academic Culture", emoji: "📚", items: [
    { name: "Professor Accessibility", detail: "Wake Forest has an average class size of 18 students. Faculty teach all courses — no graduate teaching assistants. Wake Forest students consistently cite their relationships with professors as the most defining feature of their education." },
    { name: "Pro Humanitate", detail: "Wake Forest's motto — for humanity — shapes their Center for Public Service, their global health programs, and their civic engagement requirements. It is not a marketing phrase but an active institutional commitment." },
    { name: "Wake Forest Entrepreneurship", detail: "Wake Forest's Center for Entrepreneurship and the Farrel Fellows entrepreneurship program are among the most active at any liberal arts university. Their Charlotte research center connects students to major financial firms in Charlotte, NC." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Open Curriculum (No Core)", detail: "Unlike many peer institutions, Wake Forest does not have a required core curriculum — students choose their own distribution courses within broad categories. This is a more flexible approach than most comparable universities." },
    { name: "The Wait Chapel", detail: "Wake Forest's landmark chapel — named not for waiting but for the Wait family. The chapel hosts major lectures, concerts, and interfaith services. It is the visual and spiritual center of campus." }
  ]}
]},

{ id: "bu", name: "Boston University", essayWarning: "BU's urban Boston location is not just convenient — it is their curriculum. The city is their laboratory. Any Why BU essay that focuses only on their academic programs without engaging with Boston misses what makes BU distinctive versus other research universities.", categories: [
  { label: "Boston as Campus", emoji: "🏙️", items: [
    { name: "Commonwealth Avenue", detail: "BU's campus runs along Commonwealth Avenue — a 3-mile linear campus with no quad, but direct access to Boston's neighborhoods, the MBTA, and Fenway Park. Students live in the city, not adjacent to it." },
    { name: "BU Study Abroad", detail: "BU operates its own study abroad programs in 25+ countries — not through third-party providers. BU's program in London, Paris, Sydney, and Beijing maintain BU's academic standards and credit system." }
  ]},
  { label: "Professional Schools", emoji: "📚", items: [
    { name: "College of Communication (COM)", detail: "One of the top journalism and communication schools in the US. COM students work with major Boston media organizations — the Globe, local TV stations, and digital outlets — as part of their curriculum." },
    { name: "Questrom School of Business", detail: "BU's business school — ranked in the top 30 nationally. Their Center for Finance, Law, and Policy and their hub for entrepreneurship both take advantage of Boston's position as a major biotech, finance, and education hub." },
    { name: "School of Medicine", detail: "BU School of Medicine is directly affiliated with Boston Medical Center — the largest safety-net hospital in New England. Pre-med students at BU have exceptional research and clinical access." }
  ]}
]},

{ id: "rochester", name: "University of Rochester", essayWarning: "Rochester's Take Five Scholars program — a tuition-free fifth year to explore a completely new field — is genuinely unique in American higher education. Their Eastman School of Music is one of the three best music schools in the world. The Meliora motto (ever better) should inform any Why Rochester essay.", categories: [
  { label: "Distinctive Programs", emoji: "📚", items: [
    { name: "Take Five Scholars Program", detail: "Rochester's unique program allowing students to take a fifth year of undergraduate study — entirely tuition-free — to explore a field completely outside their major. No application required, no specific requirements. This reflects Rochester's genuine commitment to intellectual breadth." },
    { name: "Eastman School of Music", detail: "Consistently ranked one of the top three music schools in the world — alongside Juilliard and Curtis. Eastman students are part of the University of Rochester community, taking courses at both campuses." },
    { name: "The Hajim School of Engineering", detail: "Rochester's engineering school is particularly strong in optics — Rochester is the home of Kodak and Xerox, and the Institute of Optics is the oldest program of its kind in the US." }
  ]},
  { label: "Open Curriculum", emoji: "📜", items: [
    { name: "The Rochester Curriculum", detail: "Rochester has one of the most open curricula in the US among research universities. Students choose three clusters — their major plus two other areas — but have enormous freedom in how they satisfy each cluster." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Dandelion Day (D-Day)", detail: "Rochester's annual spring carnival — a full day of outdoor music, games, and celebration. Students describe it as one of the most important social events of the year in a city where winter can be long and harsh." }
  ]}
]},

{ id: "carleton", name: "Carleton College", essayWarning: "Carleton's intellectual culture is genuinely quirky — they celebrate eccentricity and genuine passion in a way that most colleges claim to but don't actually practice. Their trimester system and rural Minnesota setting are both actively chosen features, not accidents. Any essay must show you understand both.", categories: [
  { label: "Academic Culture", emoji: "📚", items: [
    { name: "The Trimester System", detail: "Carleton operates on trimesters rather than semesters — students take three courses per term with 10-week terms. This creates unusual academic intensity and depth. Carleton sends more students per capita to PhD programs than almost any other liberal arts college." },
    { name: "Carleton's Research", detail: "Carleton has a USDA-certified organic farm on campus — run by students and faculty. Their arboretum covers 880 acres of restored prairie and forest — the largest landholding of any liberal arts college in Minnesota." },
    { name: "The Carleton Bubble", detail: "Carleton students affectionately call their campus 'the bubble' — acknowledging the deliberate intensity of being in rural Minnesota with nothing to do but think, build friendships, and pursue ideas. Students choose this rather than tolerating it." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Rotblatt", detail: "A softball game played on the last day of classes each spring — the only rule is that each inning can be played by different teams, and every student can play. The game has been running continuously since the 1970s." },
    { name: "Schiller and Goodhue", detail: "Carleton's two rival dormitories — their rivalry is the organizing social structure of freshman life. Inter-dorm competitions, traditions, and identities reflect Carleton's culture of playful institutional loyalty." }
  ]}
]},

{ id: "wellesley", name: "Wellesley College", essayWarning: "Wellesley's status as a women's college is their most defining feature and cannot be ignored in any essay. The Wellesley-MIT exchange program, the stone buildings, and the lake are all iconic — but the central question is what it means to be educated in a community of women who are all presumed to be leaders.", categories: [
  { label: "Women's College Identity", emoji: "🌟", items: [
    { name: "MIT Cross-Registration", detail: "Wellesley students can take courses at MIT for free — and MIT students can take courses at Wellesley. This gives Wellesley students access to MIT's engineering, computer science, and science resources while maintaining Wellesley's community of women." },
    { name: "Davis Museum", detail: "Wellesley's art museum is one of the finest college art museums in the US — its collection includes works by El Greco, Picasso, and Kara Walker. Art history students work directly with the collection as part of their coursework." },
    { name: "Wellesley's Lake", detail: "Lake Waban — a glacial kettle lake on the edge of Wellesley's campus — is the most photographed feature of the campus. Students swim, kayak, and study by the lake. The natural setting is considered part of the Wellesley experience." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Flower Sunday", detail: "The annual alumnae celebration — held on the Sunday before Commencement — where graduating seniors present their class flower to alumnae who graduated the same number of years before them. Connects four generations of Wellesley women." },
    { name: "Hoop Rolling", detail: "The senior class rolls hoops on Severance Green the morning of Commencement. According to tradition, the winner will be the first to become a CEO, president, or prime minister." }
  ]}
]},

{ id: "oberlin", name: "Oberlin College", essayWarning: "Oberlin's Conservatory — one of the five best music schools in the world — is attached to a liberal arts college of only 2,900 students. This combination is found nowhere else. Any essay must also engage with Oberlin's history as a pioneer in racial and gender equality — the first US college to regularly admit Black students and one of the first to admit women.", categories: [
  { label: "The Conservatory", emoji: "🎵", items: [
    { name: "Oberlin Conservatory", detail: "Founded 1865 — the oldest continuously operating music conservatory in the US. Consistently ranked among the top five in the world. Unlike Juilliard or Curtis, Conservatory students take full liberal arts courses alongside their music training." },
    { name: "Double Degree Program", detail: "Oberlin's Double Degree program — completing both a BA and a music degree in five years — is the most common option for the most ambitious students. No other institution combines this level of conservatory training with full liberal arts." }
  ]},
  { label: "Social Justice History", emoji: "⚖️", items: [
    { name: "Oberlin as Pioneer", detail: "Oberlin admitted Black students in 1835 — 29 years before the Civil War. Oberlin admitted women in 1837 — before any other four-year college in the US. Their student body harbored fugitive slaves as part of the Underground Railroad. This history is not museum exhibit but living culture." },
    { name: "Progressive Culture", detail: "Oberlin's political culture is among the most progressive at any US institution. Student activism is not an extracurricular but an expectation. The tension between rigorous academic work and political engagement is a defining feature of the Oberlin experience." }
  ]}
]},

{ id: "ucberkeley", name: "UC Berkeley", essayWarning: "Berkeley's PIQs (Personal Insight Questions) demand direct, concrete answers. Literary openings and abstract language waste the limited word count. Berkeley values demonstrated impact and community contribution above intellectual abstraction. The Free Speech Movement defines Berkeley's political identity and cannot be ignored.", categories: [
  { label: "Research Culture", emoji: "🔬", items: [
    { name: "Lawrence Berkeley National Laboratory", detail: "Department of Energy national laboratory directly affiliated with Berkeley. Jennifer Doudna's Nobel Prize-winning CRISPR research was conducted here. Undergraduate research positions are available across the lab's 77 research programs." },
    { name: "UCSF Partnership", detail: "Berkeley and UCSF share faculty, research programs, and facilities — creating one of the world's great biomedical research communities. Pre-med and pre-health students have exceptional access." }
  ]},
  { label: "Political Identity", emoji: "✊", items: [
    { name: "Free Speech Movement (1964)", detail: "Berkeley students launched the Free Speech Movement in 1964 — the defining event in American university student activism. The movement established the right of students to engage in political activity on campus. The Free Speech Movement Café in Moffitt Library commemorates this history." },
    { name: "Sproul Plaza", detail: "The physical center of Berkeley student life — and the site of generations of political demonstrations, cultural festivals, and community events. Over 200 student organizations table on Sproul daily." }
  ]},
  { label: "Academic Strengths", emoji: "📚", items: [
    { name: "Haas School of Business", detail: "One of only five AACSB-accredited undergraduate business programs in the UC system — and one of the most selective undergraduate business schools in the US. Haas admits only 250 students per year from the Berkeley freshman class after a separate application process." }
  ]}
]},

{ id: "ucla", name: "UCLA", essayWarning: "UCLA's PIQs are identical to Berkeley's — direct, concrete, show demonstrated impact. UCLA's identity is inseparable from Los Angeles — the entertainment industry, healthcare, and technology. Any essay that could have been written about any other university is a fatal mistake.", categories: [
  { label: "Los Angeles Identity", emoji: "🎬", items: [
    { name: "Entertainment Industry Access", detail: "UCLA's Film, Television, and Digital Media program is the most connected film school to the actual Hollywood industry. Major studios, talent agencies, and production companies all recruit on campus. UCLA graduates hold more positions in the entertainment industry than any other university." },
    { name: "UCLA Medical Center", detail: "Ranked among the top 5 hospitals in the US — Ronald Reagan UCLA Medical Center is directly affiliated with the university. Pre-med students can shadow physicians, conduct clinical research, and access one of the most sophisticated medical research environments in the world." }
  ]},
  { label: "Campus Culture", emoji: "🌞", items: [
    { name: "The Inverted Fountain", detail: "UCLA's iconic fountain at the center of campus — students dip their feet in before finals and throw each other in after graduating. A genuine campus tradition rather than an administrative invention." },
    { name: "Bruin Walk", detail: "The central pedestrian corridor of UCLA's campus where hundreds of student organizations table daily. The energy of Bruin Walk reflects UCLA's enormous, active student community." }
  ]},
  { label: "Academic Strengths", emoji: "📚", items: [
    { name: "Anderson School of Management", detail: "UCLA Anderson is consistently ranked in the top 15 business schools in the US. Its location in Los Angeles gives unparalleled access to the entertainment, tech, and healthcare industries." }
  ]}
]},

{ id: "umich", name: "University of Michigan", essayWarning: "Michigan's Why Michigan essay must be specific to the school within Michigan being applied to — LSA, Engineering, Ross Business, Music, Kinesiology. A generic Michigan essay fails. Michigan's football culture is not just sports — it is one of the most powerful community-building forces in American higher education.", categories: [
  { label: "Academic Schools", emoji: "📚", items: [
    { name: "Ross School of Business", detail: "Michigan Ross is consistently ranked top 10 in the US — their BBA program is one of the most selective undergraduate business programs in the world, admitting students after a competitive internal application process in sophomore year." },
    { name: "College of Engineering", detail: "Michigan Engineering is ranked top 5 in the US — particularly strong in automotive engineering (reflecting Michigan's role as the center of the US auto industry), aerospace, and computer science. Ford, GM, and Chrysler all recruit heavily from Michigan Engineering." },
    { name: "School of Information", detail: "Michigan's School of Information — combining library science, data science, and human-computer interaction — is one of the most distinctive programs at any research university." }
  ]},
  { label: "Football & Community", emoji: "🏈", items: [
    { name: "The Big House", detail: "Michigan Stadium is the largest stadium in the US and the second largest in the world — seating 107,601. A Michigan football Saturday is one of the most powerful collective experiences in American collegiate life." },
    { name: "Michigan in Washington (MiW)", detail: "Michigan's semester program in Washington DC — students spend a semester working full-time in government, policy, or advocacy while taking courses with Michigan faculty. One of the best-organized university programs in DC." }
  ]}
]},

{ id: "notre-dame", name: "University of Notre Dame", essayWarning: "Notre Dame requires genuine engagement with their Catholic identity and mission — not as a religious test but as evidence that you understand what Notre Dame actually is. Their football culture and their single-sex dorms are both genuinely distinctive features that shape campus life in ways that have no parallel elsewhere.", categories: [
  { label: "Catholic Identity", emoji: "⛪", items: [
    { name: "The Basilica of the Sacred Heart", detail: "Notre Dame's gothic basilica is the geographic and spiritual center of campus. Mass is celebrated daily. The University of Notre Dame takes its Catholic identity seriously — not as a brand but as a lived institutional commitment." },
    { name: "Hesburgh Library", detail: "The 14-story library with a massive mosaic of Christ on its south face — visible from Notre Dame Stadium. Known as 'Touchdown Jesus' to football fans. The library holds over 3 million volumes and is a symbol of Notre Dame's integration of faith and intellect." },
    { name: "The Grotto", detail: "A replica of the Lourdes Grotto — students visit the Grotto before exams, during difficult times, and simply for reflection. The Grotto is the most visited site on campus and the most authentic expression of Notre Dame's spiritual culture." }
  ]},
  { label: "Distinctive Culture", emoji: "🏈", items: [
    { name: "Single-Sex Dorms", detail: "Notre Dame's residence halls are single-sex — one of the few major universities in the US to maintain this policy. Each dorm has its own intramural sports teams, social events, and identity that shapes student life as powerfully as any academic department." },
    { name: "Notre Dame Football", detail: "Notre Dame football is not just athletics — it is the organizing ritual of the university community. Home game weekends bring 80,000 people to campus and are among the most powerful collective experiences in American collegiate culture." }
  ]}
]},

{ id: "davidson", name: "Davidson College", essayWarning: "Davidson's honor code is not just a policy — it is a way of life that shapes every aspect of how students relate to each other and to their academic work. Their Division I athletics alongside genuine liberal arts rigor creates an unusual combination. Any essay must show genuine understanding of Davidson's tight-knit community.", categories: [
  { label: "Honor Code", emoji: "⚖️", items: [
    { name: "The Davidson Honor Code", detail: "Davidson's honor code covers both academic and social conduct. Professors leave rooms during exams. Students self-schedule finals within windows. The code is administered entirely by the Honor Council — students, not faculty. Violations result in expulsion. The culture of trust this creates is genuinely different from any other institution." },
    { name: "The Patterson Court Social System", detail: "Davidson's alternative to Greek life — eating houses and fraternities are replaced by a system of open houses on Patterson Court. Every student has equal access to every social event. This reflects Davidson's commitment to an inclusive community." }
  ]},
  { label: "Academic Culture", emoji: "📚", items: [
    { name: "Division I with Liberal Arts Rigor", detail: "Davidson competes at the Division I level in sports while maintaining a rigorous liberal arts curriculum. Stephen Curry graduated from Davidson — his decision to stay for four years rather than leave for the NBA after his freshman year says something about what Davidson means to its students." },
    { name: "The Dean Rusk International Studies Program", detail: "One of the most extensive international education programs at any liberal arts college — funding students to study, research, and work abroad. Named after Davidson alumnus Dean Rusk, Secretary of State under Kennedy and Johnson." }
  ]}
]},

{ id: "colgate", name: "Colgate University", essayWarning: "Colgate's Hamilton, NY setting — genuinely rural, genuinely isolated — is a feature their students actively love rather than tolerate. Their Greek life is more active than most comparable liberal arts colleges. Any essay must engage honestly with Colgate's particular social culture, not just their academics.", categories: [
  { label: "Campus Culture", emoji: "🏔️", items: [
    { name: "The Hill", detail: "Colgate's campus sits on a hill above Hamilton, NY — a town of 4,000 people 45 minutes from any major city. The isolation creates an unusually intense campus community where students rely on each other for social, intellectual, and emotional life." },
    { name: "Greek Life at Colgate", detail: "Greek life is more active at Colgate than at most comparable liberal arts colleges — approximately 35% of students join fraternities or sororities. The social culture is stronger and more traditional than at schools like Williams or Amherst." },
    { name: "The Colgate Jug", detail: "A trophy awarded annually to the winning team in the rivalry game between Colgate and Lehigh — one of the oldest college football rivalries in the US, dating to 1897." }
  ]},
  { label: "Academic Strengths", emoji: "📚", items: [
    { name: "Core Curriculum", detail: "Colgate requires every student to complete a two-semester core curriculum on challenges of modernity — combining Western intellectual history with contemporary global issues. This is different from UChicago's Core in that it is integrated rather than department-specific." }
  ]}
]},

{ id: "vassar", name: "Vassar College", essayWarning: "Vassar's open curriculum and their arts culture are their most distinctive features. Vassar was one of the original Seven Sisters women's colleges and went coed in 1969 — their culture of intellectual independence and progressive social thinking continues to define the college.", categories: [
  { label: "Open Curriculum", emoji: "📜", items: [
    { name: "No Required Courses Outside Major", detail: "Vassar has one of the most open curricula in the US — students have complete freedom to design their academic path with only their major requirements as constraints. The only general requirement is a freshman writing course." },
    { name: "Multidisciplinary Studies", detail: "Vassar's most popular independent major — students design their own interdisciplinary degree with faculty approval. Past combinations include cognitive science and dance, environmental policy and creative writing." }
  ]},
  { label: "Arts Culture", emoji: "🎨", items: [
    { name: "Frances Lehman Loeb Art Center", detail: "Vassar's art museum — one of the finest at any liberal arts college in the US. Houses Hudson River School paintings, photographs by Alfred Stieglitz, and works by Georgia O'Keeffe." },
    { name: "Drama Department", detail: "Vassar's theatre department is deeply integrated with New York City — Vassar's summer Shakespeare festival in Poughkeepsie draws professional directors and actors from NYC. Meryl Streep attended Vassar." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Founder's Day", detail: "Annual celebration of Matthew Vassar's birthday — featuring a parade in period costume, academic events, and an all-campus party. Reflects Vassar's playful relationship with their Victorian founding." }
  ]}
]},

{ id: "grinnell", name: "Grinnell College", essayWarning: "Grinnell's open curriculum, their need-blind admissions for all students regardless of nationality, and their outsized social conscience make them genuinely distinctive. Their Social Responsibility of Business course — required of all first-years entering the Mentored Advanced Project program — reflects their unusual institutional priorities.", categories: [
  { label: "Open Curriculum", emoji: "📜", items: [
    { name: "Self-Governed Curriculum", detail: "Grinnell is one of only a handful of colleges with a truly open curriculum — no required courses outside the first-year tutorial. Students work with their advisor to design their entire academic program." },
    { name: "Mentored Advanced Project (MAP)", detail: "Grinnell's research program — over half of all Grinnell students complete a substantial independent research project with a faculty mentor. MAP projects are funded by the college and result in conference presentations and publications." }
  ]},
  { label: "Social Mission", emoji: "⚖️", items: [
    { name: "Need-Blind for All", detail: "Grinnell is one of only a handful of colleges in the US that is need-blind for admission and meets 100% of demonstrated need for all admitted students — including international students. This policy reflects a genuine institutional commitment to access." },
    { name: "Grinnell's Endowment", detail: "Grinnell's endowment per student is the largest of any liberal arts college in the US outside of Amherst, Williams, and Pomona — despite being located in rural Iowa. This reflects their historical commitment to financial access." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Titular Head", detail: "Grinnell students elect a Titular Head of the College — a nonsensical ceremonial title elected annually. Past Titular Heads have included inanimate objects and fictional characters. This reflects Grinnell's culture of intelligent absurdism." }
  ]}
]},

{ id: "brandeis", name: "Brandeis University", essayWarning: "Brandeis was founded in 1948 as the first nonsectarian Jewish-sponsored research university in the US — in direct response to quotas at other universities. This founding story shapes their commitment to social justice and academic freedom. Any essay must engage with this history.", categories: [
  { label: "Founding Mission", emoji: "✡️", items: [
    { name: "Nonsectarian Jewish-Sponsored", detail: "Brandeis is the only nonsectarian Jewish-sponsored research university in the US. Founded 1948 — three years after the Holocaust — as a direct response to antisemitic quotas at Ivy League institutions. Jewish and non-Jewish students are equally welcome; the commitment is to social justice, not religious practice." },
    { name: "Justice Louis Brandeis", detail: "Named after Supreme Court Justice Louis D. Brandeis — the first Jewish justice on the Supreme Court and a champion of privacy rights and progressive legal reform. His commitment to academic freedom and individual rights shapes the university's culture." }
  ]},
  { label: "Research Strengths", emoji: "🔬", items: [
    { name: "Rosenstiel School of Marine and Atmospheric Science", detail: "One of the top marine science programs in the US — unusual for an institution located in suburban Boston. Brandeis conducts deep-sea research through partnerships with NOAA and other federal agencies." },
    { name: "Brandeis International Business School (IBS)", detail: "A graduate business school with an unusual focus — students must complete a module on business ethics and international economics. The school reflects Brandeis's founding values applied to business education." }
  ]},
  { label: "Traditions", emoji: "🎭", items: [
    { name: "Pachanga", detail: "Brandeis's annual spring festival — a celebration with music, food, and cultural performances that reflects the university's diverse international student community." }
  ]}
]},
];
