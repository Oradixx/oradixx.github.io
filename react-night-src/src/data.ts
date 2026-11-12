// All the copy of the page. The facts are the same as in the two other versions.

export type Fig = "waffle" | "fgf" | "lol" | "trip" | "arch";
export type Kind = "data" | "ml" | "small";

export interface Project {
  id: string;
  name: string;
  kinds: Kind[];
  meta: string;
  href?: string;
  code?: string;
  stat?: { value: string; label: string };
  summary: string;
  body: string[];
  stack: string[];
  fig?: Fig;
}

export const projects: Project[] = [
  {
    id: "chip", name: "Chip Advisor", kinds: ["ml"],
    meta: "NFL Big Data Bowl Paris Side Quest, a hackathon by AWS, the NFL and Epitech, October 2026. 2nd place, team of 3. The repository is hosted by a teammate.",
    href: "https://github.com/alvaro-serero/nfl-chip-advisor",
    stat: { value: "36 of 88", label: "sacks with a chip had the chipping player open" },
    summary: "Does chipping a pass rusher protect the quarterback? Measured on NFL tracking data, delivered as a coach tool.",
    body: [
      "We measured whether a tight end or a running back who \"chips\" a pass rusher before running his route protects the quarterback. On NFL Next Gen Stats tracking and PFF data for weeks 1–8 of 2021, a chip by an in-line tight end cut that rusher's pressure by 26 %. Sacks still happen, because the pressure then comes from another defender.",
      "On 36 of the 88 sacks with a chip, the player who chipped was open, so our advice to the QB coach is to look for him at about 3 seconds. We delivered it as a small web tool with a coach briefing written by Mistral, built with Kiro, AWS's agentic IDE.",
    ],
    stack: ["Python", "pandas", "Mistral API", "Kiro", "Vercel"], fig: "waffle",
  },
  {
    id: "fgf", name: "France Grid Forecast", kinds: ["data", "ml"],
    meta: "Personal project. Its first live forecast was for 27 September 2026.",
    href: "https://oradixx.github.io/france-grid-forecast/", code: "https://github.com/Oradixx/france-grid-forecast",
    stat: { value: "2.1 %", label: "mean hourly error, day-ahead, over 35 days" },
    summary: "A daily job forecasts France's electricity consumption for each hour of the next day, then scores itself.",
    body: [
      "Every day a GitHub Actions job forecasts France's electricity consumption for each hour of the next day, then scores the past forecasts against what was really consumed. RTE and weather data are stored as Parquet; dbt on DuckDB runs 19 data tests, and a failing test stops the run before anything is published. The gradient boosting model is retrained each week and replaces the current one only if it beats the naive baseline by at least 25 % on the last 8 weeks.",
      "Between 27 September and 1 November 2026 (35 days scored, one run missed), the mean hourly error was 2.1 %, against 1.5 % for RTE's own forecast and 4.2 % for the naive baseline.",
    ],
    stack: ["dbt", "DuckDB", "scikit-learn", "GitHub Actions", "Parquet"], fig: "fgf",
  },
  {
    id: "lol", name: "LoL Ratings 3.0", kinds: ["ml"],
    meta: "Personal project, 2026. The write-up is in French.",
    href: "https://oradixx.github.io/LoL-ratings/", code: "https://github.com/Oradixx/LoL-ratings",
    stat: { value: "65.4 %", label: "of 8,566 pro games called correctly in 2026" },
    summary: "A rating of professional League of Legends players that accounts for teammates and league strength.",
    body: [
      "A rating of professional League of Legends players that accounts for the strength of their teammates and of their league. It is a ridge regression on each game's final gold difference (RAPM), with league levels linked through international events and transfers, and a box-score prior learned per role.",
      "I built it on the 10,044 pro games of 2025, then tested it on the 2026 season, retrained each month. It called 65.4 % of the 8,566 games correctly; an Elo rating updated after every game called 63.8 %.",
    ],
    stack: ["pandas", "SciPy", "scikit-learn", "GitHub Actions", "GitHub Pages"], fig: "lol",
  },
  {
    id: "nlp", name: "NLP on 24,000 insurance reviews", kinds: ["ml"],
    meta: "School project (NLP course, ESILV), March 2026, team of 2. The serving part was added in September 2026.",
    href: "https://github.com/Oradixx/insurance-reviews-nlp",
    stat: { value: "54 %", label: "accuracy on star ratings, against 52 % for the baseline" },
    summary: "Star rating prediction, topic detection and RAG on French reviews, then served behind FastAPI.",
    body: [
      "We predicted the star rating of about 24,000 French insurance reviews. A TF-IDF and logistic regression baseline reached 52 % accuracy, and MiniLM embeddings with a small PyTorch classifier reached 54 %: better, but only slightly. The Streamlit app adds zero-shot topic detection and RAG answers; we replaced Flan-T5 with Llama 3 running locally because Flan-T5 hallucinated more in our tests.",
      "After the course, the baseline became a FastAPI service in Docker, tested in CI. Training runs are tracked in MLflow, and a model below 0.40 macro F1 is never saved.",
    ],
    stack: ["Hugging Face", "PyTorch", "Llama 3 (Ollama)", "MLflow", "FastAPI", "Docker"],
  },
  {
    id: "crypto", name: "CryptoIndexLab", kinds: ["data"],
    meta: "School project (containerisation course, ESILV), March 2026, team of 3.",
    href: "https://github.com/Oradixx/CryptoIndexLab",
    stat: { value: "8", label: "containers on three Docker networks" },
    summary: "Custom crypto indexes as containers: two replicated APIs behind an Nginx gateway, one database each.",
    body: [
      "A web app to build and track custom crypto indexes, run as containers. Two FastAPI services (accounts with JWT, index management) run 2 replicas each behind an Nginx gateway that balances the load, and each service has its own PostgreSQL on a separate Docker network.",
      "CI builds hardened images and fails on any Trivy finding of medium severity or above. We demoed it on AWS Lightsail, and it opens in one click in GitHub Codespaces. My part was the Nginx gateway and load balancer, and the networking between the APIs and their databases.",
    ],
    stack: ["FastAPI", "PostgreSQL", "Docker Compose", "Nginx", "Trivy"], fig: "arch",
  },
  {
    id: "trip", name: "TripAdvisor recommender", kinds: ["ml"],
    meta: "School project (information retrieval course, ESILV), March 2026, team of 2. Reworked in September 2026.",
    href: "https://github.com/Oradixx/tripadvisor-recommender",
    stat: { value: "0.6 s", label: "to score 900 × 900 places with BM25, down from 77 s" },
    summary: "Recommends a similar place from the reviews alone, with BM25 rewritten as one sparse matrix product.",
    body: [
      "Given a place on TripAdvisor, recommends a similar one using only the reviews. The metadata is hidden from the models and only used to judge the answer. BM25 is rewritten as one sparse matrix product (same scores as rank_bm25), which made it cheap to re-check every model on 20 random splits.",
      "The reliable gain came from better tokenization, not from a more complex model. Keeping letters only and removing stop words made the same BM25 better on 20 splits out of 20. Beyond that, the models are within noise of each other.",
    ],
    stack: ["scikit-learn", "SciPy", "pytest", "GitHub Actions"], fig: "trip",
  },
  {
    id: "movielens", name: "MovieLens in Cassandra and Neo4j", kinds: ["data"],
    meta: "School project (NoSQL course, ESILV), March–April 2026, team of 3.",
    href: "https://github.com/Oradixx/movielens-nosql",
    stat: { value: "2,847", label: "ratings silently merged, found and documented" },
    summary: "One dataset modelled twice: one table per query in Cassandra, a graph in Neo4j.",
    body: [
      "The 1,000,209 ratings of MovieLens 1M modelled twice. In Cassandra, one table per query, plus a Java aggregate because AVG on an integer column returns an integer. In Neo4j, a graph for collaborative filtering and for path queries with APOC and shortestPath().",
      "Users are identified by name, and some names are shared, so 2,847 ratings (0.28 % of the total) were silently merged; we found and documented the collision. CI rebuilds both databases from a synthetic sample and checks the query results.",
    ],
    stack: ["Cassandra", "Neo4j (Cypher)", "Docker Compose", "Python"],
  },
  { id: "dpt", name: "data-pipeline-template", kinds: ["small", "data"], meta: "Template repository.", href: "https://github.com/Oradixx/data-pipeline-template",
    summary: "Async Python ingestion into TimescaleDB with a Grafana dashboard.",
    body: ["Async Python ingestion into TimescaleDB with a Grafana dashboard, versioned SQL migrations, a continuous aggregate and integration tests in CI. One command (make up) starts the whole Docker Compose stack."], stack: ["Python", "TimescaleDB", "Grafana", "Docker Compose"] },
  { id: "dip", name: "Data Interview Prep", kinds: ["small"], meta: "Static site.", href: "https://oradixx.github.io/data-interview-prep/",
    summary: "118 practice questions for data, MLOps, DevOps and LLM interviews.",
    body: ["118 practice questions for data engineering, MLOps, DevOps and LLM interviews, each answer explained. A static site with unit tests."], stack: ["JavaScript"] },
  { id: "plumber", name: "Data Plumber", kinds: ["small"], meta: "Browser game.", href: "https://oradixx.github.io/data-plumber/",
    summary: "A browser game about data pipelines, with a solver that checks the final puzzle.",
    body: ["A browser game about data pipelines. The game logic is covered by 70 unit tests, and an exhaustive solver checks that the final boss puzzle has exactly one solution."], stack: ["JavaScript"] },
  { id: "car", name: "Used car prices", kinds: ["small", "ml"], meta: "School project, team of 3.", href: "https://github.com/Oradixx/Car_Price_Prediction_Project",
    summary: "LightGBM on Craigslist listings: R² ≈ 0.82, against 0.49 for a linear regression.",
    body: ["Craigslist listings from Kaggle; the best model is LightGBM, with R² ≈ 0.82, against 0.49 for a linear regression."], stack: ["Python", "LightGBM", "scikit-learn"] },
  { id: "sniffer", name: "Packet sniffer in Rust", kinds: ["small"], meta: "Team of 2.", href: "https://github.com/Oradixx/Packet_Sniffer_Rust",
    summary: "Live capture on libpcap with BPF filters and unit-tested decoding.",
    body: ["Live capture on libpcap with BPF filters, decoding of Ethernet, IPv4/IPv6, TCP, UDP, ICMP and ARP. Decoding is unit-tested on hand-built packets."], stack: ["Rust", "libpcap"] },
  { id: "mern", name: "Full-stack MERN app", kinds: ["small"], meta: "No public repository.",
    summary: "Built in a Scrum team of 3, with an 80 % test coverage gate in CI.",
    body: ["Built in a Scrum team of 3 on Jira, starting from specification documents and UML, with an 80 % test coverage gate in CI."], stack: ["MongoDB", "Express", "React", "Node.js"] },
  { id: "templates", name: "Project templates", kinds: ["small"], meta: "For Python services and for coursework.", href: "https://github.com/Oradixx/python-project-template", code: "https://github.com/Oradixx/course-project-template",
    summary: "uv, Ruff, strict mypy, pytest, pre-commit, a multi-stage Dockerfile and CI.",
    body: ["Two templates, one for Python services and one for coursework: uv, Ruff, strict mypy, pytest, pre-commit, a multi-stage Dockerfile and CI."], stack: ["uv", "Ruff", "mypy", "pytest", "Docker"] },
];

export const proofs = [
  { value: "30 s", text: "A dashboard that took 3 hours to load now loads in 30 seconds.", source: "CERTAM internship, 2026", href: "#experience" },
  { value: "2nd", text: "Second place at the NFL Big Data Bowl Paris Side Quest, in a team of 3.", source: "Hackathon by AWS, the NFL and Epitech, October 2026", href: "#projects" },
  { value: "65.4 %", text: "Of 8,566 pro League of Legends games called correctly. An Elo rating updated after every game called 63.8 %.", source: "LoL Ratings 3.0, 2026 season", href: "#projects" },
  { value: "2.1 %", text: "Mean hourly error forecasting France's electricity consumption a day ahead. RTE's own forecast: 1.5 %. Naive baseline: 4.2 %.", source: "France Grid Forecast, 35 days scored", href: "#projects" },
];

export const pipeline = [
  { name: "CAN bus on the vessel", tech: "J1939 frames, 1 Hz", detail: "The engine's J1939 CAN bus is sampled once per second on the vessel. That is where every reading starts." },
  { name: "AWS S3", tech: "Parquet files", detail: "The raw telemetry lands in S3 as Parquet files, so nothing is lost if a later stage fails." },
  { name: "Loader", tech: "async Python", detail: "Async Python code reads the Parquet files and loads them into the database." },
  { name: "PostgreSQL with TimescaleDB", tech: "materialised views", detail: "I moved the slow dashboard queries into SQL materialised views. The dashboard went from 3 hours to 30 seconds." },
  { name: "Grafana", tech: "real-time alerts", detail: "Real-time alerting on a hardened Linux VPS. The pressure-drop alert caught a clogging filter before the engine failed." },
];

export const skills: { group: string; items: [string, string][]; plain?: string }[] = [
  { group: "Languages", items: [["Python (pandas, NumPy)", "fgf lol chip nlp crypto trip movielens certam dpt car"], ["SQL", "fgf certam dpt"], ["JavaScript and Node.js", "dip mern"], ["Java", "movielens"], ["Rust", "sniffer"], ["CQL and Cypher", "movielens"]] },
  { group: "Data", items: [["PostgreSQL", "certam crypto dpt"], ["TimescaleDB", "certam dpt"], ["DuckDB", "fgf"], ["dbt", "fgf"], ["Parquet", "fgf certam"], ["Cassandra", "movielens"], ["Neo4j", "movielens"], ["MongoDB", "mern"]], plain: "Apache Spark (PySpark), Elasticsearch" },
  { group: "Machine learning and AI", items: [["scikit-learn", "fgf lol nlp trip car"], ["Hugging Face and BERT", "nlp"], ["LLMs and RAG", "nlp chip"], ["SHAP", "certam nlp"]], plain: "TensorFlow, LIME" },
  { group: "Cloud and MLOps", items: [["Docker", "crypto nlp movielens dpt templates"], ["GitHub Actions", "fgf lol trip nlp movielens crypto dpt mern"], ["AWS (S3, Lightsail)", "certam crypto"], ["FastAPI", "crypto nlp"], ["MLflow", "nlp"], ["Nginx", "crypto"], ["Grafana", "certam dpt"], ["Linux", "certam"]], plain: "Kubernetes (GKE), GCP, Git" },
];

export const ideas: { when: string; items: [string, string][] }[] = [
  { when: "Next", items: [
    ["localcascade", "Free local AI as a cascade: rules in code first, then a small calibrated decision model, then a local LLM, and a human only for what is left. Each stage is measured for quality, calibration, latency and memory, on my own labelled data. The first use case is watching VIE job offers. Published as a Python library."],
    ["Decision-model routing for LLMRouter", "A plugin for the open-source LLMRouter that routes each request with the same kind of small decision model, once localcascade has shown it works."],
    ["Sentiment analysis with an RNN and a small language model", "A recurrent network written in NumPy, compared on the same data with a 0.5B-parameter language model used as a few-shot classifier."],
    ["Car price model in production", "Serve the used car model with experiment tracking, a FastAPI endpoint, CI/CD and drift monitoring."],
  ] },
  { when: "Exploring", items: [
    ["Social benefits pre-check", "You describe your situation in your own words; a local model extracts the facts that matter and asks when it is unsure, and OpenFisca computes the entitlements with the official rules. Aimed at people who do not claim benefits they are owed. Runs on the device, tested on synthetic cases."],
    ["Public consultation triage", "Sort contributions to public consultations by position and theme and find near-duplicates, on open data such as the Grand débat national."],
    ["Alt text checker", "Check with a vision-language model whether an image's alternative text describes the image, to catch empty or misleading alt texts on a website."],
    ["A guide to the right tool for each need", "Decision trees rather than a directory: for each common need, 3 to 6 real options with their strengths, weaknesses, price, licence and the date they were checked. Data in YAML, a site generated from it, and CI that flags dead links and stale entries."],
  ] },
  { when: "Later", items: [
    ["Pharmacovigilance pre-triage", "Check whether adverse event reports are valid and serious before a person reads them, prototyped on the public FAERS database. A real use would need a partner."],
    ["Self-hosted agent", "A sandboxed agent on a home server, reachable from a messaging app, with read-only access to my job-offer watch. Waiting for the agents part of my LLM course."],
    ["Settings bench for Windows games on Mac", "Try combinations of compatibility-layer settings automatically, measure crashes and frame rate, and keep the best configuration."],
    ["AI-assisted reverse engineering", "An exercise with Claude Code and a Ghidra MCP server on a small old game I own."],
  ] },
];

export const education = [
  { name: "ESILV", meta: "Engineering degree, Data and AI major. Paris La Défense, 2022–2027.", text: "CTI-accredited (Master's level, 300 ECTS). Courses include deep learning, MLOps, NLP, LLMs and generative AI, Big Data with Spark, NoSQL databases and data mining." },
  { name: "Riga Technical University", meta: "Exchange semester. Latvia, January–June 2025.", text: "Data science and AI courses, taught in English." },
  { name: "Languages and certifications", meta: "French (native), English C1 (TOEFL ITP 633/677), German A2.", text: "Certified in Scrum and agile methods, and in IBM Data Fundamentals." },
];

export const links = {
  cv: "../Clement_Vurpillot_CV.pdf",
  linkedin: "https://www.linkedin.com/in/clement-vurpillot/",
  github: "https://github.com/Oradixx",
  simple: "../?v=simple",
  interactive: "../interactive.html",
};
