import "./style.css";
let currentPage = 1;
type ApiStory = {
  id: number;
  title: string;
  points: number;
  user: string;
  time_ago: string;
  url: string;
  comments_count: number;
};
type Story = {
  id: number;
  title: string;
  points: number;
  user: string;
  timeAgo: string;
  url: string;
  commentsCount: number;
};

const getStories = async (): Promise<Story[]> => {
  const response = await fetch(
    `https://api.hnpwa.com/v0/news/${currentPage}.json`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }

  const apiStories: ApiStory[] = await response.json();
  return apiStories.map(mapApiStoryToStory);
};

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

// const pageTitle = document.createElement("h1");
// // console.log(pageTitle.outerHTML);
// pageTitle.textContent = "Hacker News Clone";
const topBar = document.createElement("div");
topBar.style.backgroundColor = "#ff6600";
topBar.style.padding = "4px 8px";
topBar.style.display = "flex";
topBar.style.justifyContent = "space-between";
topBar.style.alignItems = "center";

const topBarLeft = document.createElement("div");
topBarLeft.style.display = "flex";
topBarLeft.style.alignItems = "center";
topBarLeft.style.gap = "6px";

const logo = document.createElement("span");
logo.textContent = "Y";
logo.style.fontWeight = "bold";
logo.style.border = "1px solid white";
logo.style.padding = "0 4px";
logo.style.color = "white";

const brand = document.createElement("span");
brand.textContent = "Hacker News";
brand.style.fontWeight = "bold";

const nav = document.createElement("span");
nav.textContent = "new | past | comments | ask | show | jobs | submit";

const login = document.createElement("span");
login.textContent = "login";

topBarLeft.append(logo, brand, nav);
topBar.append(topBarLeft, login);

const storyListContainer = document.createElement("div");
storyListContainer.id = "story-list";
app.append(topBar, storyListContainer);

const mapApiStoryToStory = (apiStory: ApiStory): Story => {
  // convert Api data to UI data
  return {
    id: apiStory.id,
    title: apiStory.title,
    points: apiStory.points,
    user: apiStory.user,
    timeAgo: apiStory.time_ago,
    url: apiStory.url,
    commentsCount: apiStory.comments_count,
  };
};

const renderStory = (story: Story, index: number) => {
  // single story control
  const rank = document.createElement("span");
  rank.textContent = `${(currentPage - 1) * 30 + index + 1}. `;

  const storyItem = document.createElement("div");
  const storyTitle = document.createElement("h3");

  const storyLink = document.createElement("a");
  storyLink.textContent = story.title;
  storyLink.href = story.url;
  storyLink.target = "_blank";
  storyLink.rel = "noopener noreferrer";

  const source = document.createElement("span");
  const hostname = getHostname(story.url);

  if (hostname) {
    source.textContent = ` (${hostname})`;
    source.style.fontSize = "0.8em";
    source.style.color = "gray";
  }
  storyTitle.append(rank, storyLink, source);

  const commentsLink = document.createElement("a");
  commentsLink.textContent = `${story.commentsCount} comments`;
  commentsLink.href = "#";

  commentsLink.addEventListener("click", (event) => {
    event.preventDefault();
    showStoryDetail(story);
  });

  const storyMeta = document.createElement("p");
  storyMeta.append(
    `${story.points} points by ${story.user} ${story.timeAgo} | `,
    commentsLink,
  );
  storyItem.append(storyTitle, storyMeta);
  storyListContainer.append(storyItem);
};

const renderLoading = () => {
  // render e somoi nile dekano
  storyListContainer.innerHTML = "";

  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading stories...";

  storyListContainer.append(loadingText);
};

const showStoryDetail = (story: Story): void => {
  storyListContainer.innerHTML = "";

  const backButton = document.createElement("button");
  backButton.textContent = "Back to stories";

  backButton.addEventListener("click", () => {
    showStories();
  });

  const detailTitle = document.createElement("h2");
  detailTitle.textContent = story.title;

  const detailId = document.createElement("p");
  detailId.textContent = `Story ID: ${story.id}`;

  const detailMeta = document.createElement("p");
  detailMeta.textContent = `${story.points} points by ${story.user} ${story.timeAgo} | ${story.commentsCount} comments`;

  const detailLink = document.createElement("a");
  detailLink.textContent = "Read original article";
  detailLink.href = story.url;
  detailLink.target = "_blank";
  detailLink.rel = "noopener noreferrer";

  storyListContainer.append(
    backButton,
    detailTitle,
    detailId,
    detailMeta,
    detailLink,
  );
};

const renderError = (message: string) => {
  storyListContainer.innerHTML = "";

  const errorText = document.createElement("p");
  errorText.textContent = message;

  storyListContainer.append(errorText);
};

const getHostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "";
  }
};

const renderStories = (stories: Story[]) => {
  // Shb story k handle kra
  storyListContainer.innerHTML = "";
  stories.forEach((story, index) => {
    renderStory(story, index);
  });
};

const renderMoreLink = () => {
  const moreLink = document.createElement("a");
  moreLink.textContent = "More";
  moreLink.href = "#";

  moreLink.addEventListener("click", async (event) => {
    event.preventDefault();
    currentPage++;
    await showStories();
  });
  storyListContainer.append(moreLink);
};
const renderFooter = () => {
  const footer = document.createElement("div");

  footer.style.marginTop = "20px";
  footer.style.paddingTop = "10px";
  footer.style.borderTop = "1px solid #ff6600";
  footer.style.textAlign = "center";

  const footerLinks = document.createElement("p");

  const links = [
    "Guidelines",
    "FAQ",
    "Lists",
    "API",
    "Security",
    "Legal",
    "Apply to YC",
    "Contact",
  ];

  links.forEach((label, index) => {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = "#";

    footerLinks.append(link);

    if (index < links.length - 1) {
      footerLinks.append(" | ");
    }
  });

  footer.append(footerLinks);
  storyListContainer.append(footer);
};
const showStories = async (): Promise<void> => {
  try {
    renderLoading();
    // await wait(1000);
    const stories = await getStories();
    renderStories(stories);
    renderMoreLink();
    renderFooter();
  } catch (error) {
    renderError("Failed to load stories");
  }
};
showStories();
