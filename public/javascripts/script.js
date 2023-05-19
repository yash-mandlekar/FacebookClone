var menuItem = document.querySelectorAll(".menu-item");
var btnoverlay = document.querySelector(".createpost");
var home_btn = document.querySelector(".home-btn");
var message = document.querySelector("#message");
var messageBox = document.querySelector("#message-box");
var themeMenu = document.querySelector("#themeMenu");
var themBOx = document.querySelector(".theme");
var addBtn = document.querySelectorAll("#add");
var delbtn = document.querySelectorAll("#del");
var searchinp = document.querySelector(".searchinp");
var searchbox = document.querySelector(".searchbox");
var overlay = document.querySelector(".overlay");
var overlay2 = document.querySelector(".overlay2");
var overlay3 = document.querySelector(".overlay3");
var overlay4 = document.querySelector(".overlay4");
var storys = document.querySelector(".storys");
var feeds = document.querySelector(".feeds");
var loadbtn = document.querySelector(".load-more");
var bookmark_btn = document.querySelector(".bookmark-btn");
var story_inp = document.querySelector(".story-inp");
var story_cnt = document.querySelector(".story-img");
var story_img = document.querySelector(".story-img img");
var temp = "";
var count = 0;
var posts = [];
var user = {};
var storyUser = {};
var story = [];
var friends = [];
var friendIndex = 0;
let interval;
var time = 0;
var flag = 0;
// -------------------------------- All About Story --------------------------------
storys.addEventListener("click", async (e) => {
  if (e.target.classList.contains("my-story")) {
    overlay4.style.display = "flex";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
  } else {
    friendIndex = e.target.getAttribute("key");
    if (!e.target.id) return;
    console.log(e.target.id);
    const { data } = await axios.get(`/story/${e.target.id}`);
    story = data.user.stories;
    storyUser = data.user;
    if (story.length == 0) return;
    showStory(0);
    document.body.style.overflow = "hidden";
  }
});
const startTimer = (index) => {
  if(index === null){
    overlay3.style.display = "none";
    document.body.style.overflow = "auto";
    return;
  }
  clearInterval(interval);
  time = 0;
  interval = setInterval(() => {
    if (time == 450) {
      clearInterval(interval);
      showStory(index + 1);
    }
    time++;
    document.querySelector(".bar").style.width = `${(time / 450) * 100}%`;
  }, 10);
};

const pauseTimer = (index) => {
  if (flag == 0) {
    clearInterval(interval);
    flag = 1;
    document.querySelector(".play img").src = "../images/icon/play.svg";
  } else {
    flag = 0;
    interval = setInterval(() => {
      if (time == 450) {
        clearInterval(interval);
        showStory(index + 1);
      }
      time++;
      document.querySelector(".bar").style.width = `${(time / 450) * 100}%`;
    }, 10);
    document.querySelector(".play img").src = "../images/icon/pause.svg";
  }
};

const showStory = async (index) => {
  flag = 0;
  if (index === null) {
    overlay3.style.display = "none";
    document.body.style.overflow = "auto";
    clearInterval(interval);
    return;
  }
  if (story[index]) {
    var close = `<div class="close">X</div>`;
    var viewers = story[index].views.map((view) => {
      return `<a class="profile-cnt" href="/profile/${view._id}">
      <div class="profile-phots">
        <img src="${view.profile_picture}" alt="" />
      </div>
      <p>${view.first_name} ${view.last_name}</p>
    </a>`;
    });
    var nav = `<div class="stry-nav">
    <a class="profile-cnt" href="/profile/${storyUser._id}">
      <div class="profile-phots">
        <img src="${storyUser.profile_picture}" alt="" />
      </div>
      <p>${storyUser.first_name} ${storyUser.last_name}</p>
    </a>
    <div class="play" onclick="pauseTimer(${index})">
      <img src="../images/icon/pause.svg" />
    </div>
    <div class="time">
    ${
      storyUser._id === user._id
        ? `
          <div class="views">
            <img src="../images/icon/eye.svg" />
            <p>${story[index].views.length}</p>
            <div class="views-dropdown" style="${
              viewers.length == 0 ? "display:none" : ""
            }">
              ${viewers.join("")}
            </div>
          </div>
          <a href="/deletestory/${
            story[index]._id
          }"><img src="../images/icon/bin.svg"></a>
          `
        : "<img src='../images/icon/white-dots.svg' />"
    }
        </div>
  </div>`;
    var bar = `<div class="bar" style="width: 0%;"></div>`;
    await axios.get(`/storyviews/${story[index]._id}`);
    var img = `<img class="close-img" src="${story[index].file}" alt="" />`;
    var next = `<button class="next-btn" onclick="showStory(${
      index + 1
    })"> > </button>`;
    var prev = `<button class="prev-btn" onclick="showStory(${
      index - 1
    })"> < </button>`;
    overlay3.style.display = "flex";
    if (index == story.length - 1)
      next = `<button class="next-btn" onclick="showStory(${
        index + 1
      })"> </button>`;
    if (index == 0)
      prev = `<button class="prev-btn" onclick="showStory(${
        index - 1
      })"> </button>`;
    if (index == story.length - 1)
      img = `<img class="close-img" src="${story[index].file}" alt="" />`;
    overlay3.innerHTML = close + nav + bar + img + next + prev;
    startTimer(index);
  } else {
    if (index === -1) friendIndex--;
    else friendIndex++;
    if (friends[friendIndex]?._id) {
      const { data } = await axios.get(`/story/${friends[friendIndex]._id}`);
      story = data.user.stories;
      storyUser = data.user;
      if (story.length == 0) return;
      showStory(0);
    } else {
      overlay3.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
};

story_inp.onchange = (e) => {
  const [file] = e.target.files;
  if (file) {
    story_cnt.style.display = "flex";
    story_img.src = URL.createObjectURL(file);
  }
};

overlay4.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("cross") ||
    e.target.classList.contains("overlay4")
  ) {
    overlay4.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

overlay3.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("close") ||
    e.target.classList.contains("overlay3")
    ) {
      overlay3.style.display = "none";
      document.body.style.overflow = "hidden";
      showStory(null);
      startTimer(null);
      clearInterval(interval);
  }
});
const fetchStories = async () => {
  const { data } = await axios.get("/story");
  var temp = `<div class="story" id="${
    data?.user?._id
  }" key=${-1} style="background-image: url(${data?.user?.stories[0]?.file});">
  <div class="profile-phots" id="${data?.user?._id}">
    <img id="${data?.user?._id}" src="${data.user.profile_picture}" alt="" />
  </div>
  <div class="botm my-story">
      <button><img class="my-story" src="../images/icon/plus.svg" alt=""></button>
      Create Story
  </div>
</div>`;
  data.friends.forEach((friend, i) => {
    if (friend?.stories[0]) {
      temp += `<div id="${friend?._id}" key="${i}" class="story" style="background-image: url(${friend?.stories[0].file});">
      <div id="${friend?.stories[0].file}" class="profile-phots">
      <img id="${friend?.stories[0].file}" src="${friend.profile_picture}" alt="" />
      </div>
      <p id="${friend?.stories[0].file}">${friend.first_name} ${friend.last_name}</p>
      </div>`;
      friends.push(friend);
    }
  });
  storys.innerHTML = temp;
};
fetchStories();
// -------------------------------- All about post --------------------------------
home_btn.addEventListener("click", () => {
  fetchPost(count);
});

btnoverlay.addEventListener("click", () => {
  overlay.style.display = "block";
});

overlay.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("overlay") ||
    e.target.classList.contains("cross")
  ) {
    overlay.style.display = "none";
  }
});
// remove active classlist.....
const removeActive = () => {
  menuItem.forEach((item) => {
    item.classList.remove("active");
  });
};

// add active classlist.....
menuItem.forEach((item) => {
  item.addEventListener("click", () => {
    removeActive();
    item.classList.add("active");

    if (item.id != "notifice") {
      document.querySelector(".notification").style.display = "none";
    } else {
      document.querySelector(".notification").style.display = "block";
      document.querySelector("#notifice .count").style.display = "none";
    }
  });
});

message.addEventListener("click", () => {
  messageBox.classList.add("box-sh");
  message.querySelector(".count").style.display = "none";

  setTimeout(() => {
    messageBox.classList.remove("box-sh");
  }, 2000);
});

// WINDOW EVENT.....
window.addEventListener("scroll", () => {
  themBOx.style.display = "none";
  document.querySelector(".notification").style.display = "none";
});

//  Search bar

searchinp.addEventListener("keydown", (e) => {
  if (e.target.value.length > 0) {
    axios.get(`/username/${e.target.value}`).then((res) => {
      searchbox.innerHTML = "";
      console.log(res.data);
      res.data.founduser.forEach((user) => {
        searchbox.innerHTML += `<a href="/profile/${user._id}" class="user">
        <div class="img-cnt">
          <img src="${user.profile_picture}" alt="" />
        </div>
        <p>${user.first_name} ${user.last_name}</p>
      </a>`;
      });
    });
  }
});
searchinp.addEventListener("focusout", () => {
  setTimeout(() => {
    searchbox.innerHTML = "";
  }, 500);
});

// Single post with comment and like

feeds.addEventListener("click", async (e) => {
  if (e.target.classList.contains("comment")) {
    const { data } = await axios.get(`/post/${e.target.id}`);
    overlay2.style.display = "block";
    document.body.style.overflow = "hidden";
    overlay2.innerHTML = `<div class="comment-popup-container">
    <ul class="comments-list">
    ${
      data.post.comments.length === 0
        ? `<li class="comment">
      <div class="comment-details">
        <h4 class="comment-username">No Comments</h4>
      </div>
    </li>`
        : ""
    }
      ${data.post.comments.map(
        (comment) =>
          `<li class="comment">
        <img class="comment-avatar" src="${
          comment.author.profile_picture
        }" alt="" />
        <a class="comment-details" href="/profile/${comment.author._id}">
          <h4 class="comment-username">${comment.author.first_name} ${
            comment.author.last_name
          }</h4>
          <p class="comment-text">${comment.comment}</p>
        </a>
        ${
          comment.author._id === data.user._id
            ? `<a href="/deletecomment/${data.post._id}/${comment._id}">
        <button class="delete-comment">Delete</button>
      </a>`
            : ""
        } 
      </li>`
      )}
    </ul>
    <form class="comment-form" action="/comment/${data.post._id}" method="POST">
      <textarea name="comment" class="comment-textarea" placeholder="Write a comment..."></textarea>
      <button class="comment-button">Post</button>
    </form>
  </div>`;
  } else if (e.target.classList.contains("like")) {
    handleLike(e.target.id);
  } else if (e.target.classList.contains("book-mark")) {
    handleBookmark(e.target.id);
  }
});
overlay2.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("overlay2") ||
    e.target.classList.contains("cross")
  ) {
    overlay2.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

const fetchPost = async (page) => {
  var limit = 5;
  const { data } = await axios.get(`/feeds/${page}/${limit}`);
  if (data.posts.length === 0) {
    loadbtn.style.display = "none";
  }
  posts.push(...data.posts);
  user = data.user;
  feeds.innerHTML = handleloop(data);
  count += 1;
};

const handleLike = async (e) => {
  await axios.get(`/like/${e}`);
  posts.forEach((post) => {
    if (post._id == e) {
      if (post.likes.includes(user._id)) {
        post.likes = post.likes.filter((id) => id != user._id);
      } else {
        post.likes.push(user._id);
      }
    }
  });
  temp = "";
  feeds.innerHTML = handleloop({ posts, user });
  // window.location.reload();
};

const handleBookmark = async (e) => {
  console.log(posts);
  await axios.get(`/saved_posts/${e}`);
  if (user.bookmarks.includes(e)) {
    user.bookmarks = user.bookmarks.filter((id) => id != e);
  } else {
    user.bookmarks.push(e);
  }
  temp = "";
  feeds.innerHTML = handleloop({ posts, user });
  // window.location.reload();
};

const handleloop = (data) => {
  data.posts.forEach((post) => {
    temp += `<div class="feed">
        <div class="head">
          <a class="user" href="/profile/${post.author._id}">
            <div class="profile-phots">
              <img src="${post.author.profile_picture}" alt="" />
            </div>
            <div class="info">
              <h3>
                 ${post.author.first_name} ${post.author.last_name} 
              </h3>
              <small>${new Date(post.date).toTimeString()}</small>
            </div>
          </a>
          ${
            post.author._id.toString() == data.user._id.toString()
              ? `<a class="edit" href="/deletepost/${post._id}">
            <img
              src="../images/../images/icon/three-dots.svg"
              class="icon1"
            />
          </a>`
              : ""
          }
        </div>
        ${
          post.filetype == "image"
            ? `<a href="/singlepost/${post._id}" class="feed-phots">
        <img src="${post.file}" alt="" />
      </a>`
            : ""
        }
        ${
          post.filetype == "video"
            ? `<a href="/singlepost/${post._id}" class="feed-phots">
          <video controls>
            <source src="${post.file}" type="video/mp4" />
          </video>
        </a>`
            : ""
        }
        ${
          post.filetype == undefined
            ? `<a href="/singlepost/${post._id}" class="feed-phots">
          <h1>${post.title}</h1>
        </a>`
            : ""
        }
        <div class="action-buttons">
          <div class="inter-action-button">
            <div id="${post._id}" class="like">
              ${
                post.likes.includes(data.user._id)
                  ? `<img
                src="../images/../images/icon/heart-fill.svg"
                class="icon2 like"
                id="${post._id}"
              />`
                  : `<img
                src="../images/../images/icon/heart.svg"
                class="icon2 like"
                id="${post._id}"
              />`
              }
            </div>
            <span>
              <img
                src="../images/icon/chat-dots.svg"
                class="icon2 comment"
                id="${post._id}"
                style="margin-bottom: 0;"
              />
            </span>
            <a href="http://web.whatsapp.com/send?text=http://localhost:3000/singlepost/${
              post._id
            }" target="_blank">
            <img
                src="../images/icon/share.svg"
                class="icon2"
            />
            </a>
          </div>
          <div class="book-mark" id="${post._id}">
            <span>
            ${
              data.user.bookmarks.includes(post._id)
                ? ` <img
              src="../images/icon/bookmark-fill.svg"
              class="icon2 book-mark filled-bookmark"
              id="${post._id}"
              />`
                : `<img
                src="../images/icon/bookmark.svg"
                class="icon2 book-mark"
                id="${post._id}"
                />`
            }
            </span>
          </div>
        </div>
        <div class="liked-by">
          <span><img src="../images/img/p2.jpg" alt="" /></span>
          <span><img src="../images/img/p4.png" alt="" /></span>
          <span><img src="../images/img/p5.png" alt="" /></span>
          <b>&nbsp;${post.likes.length} Likes</b>
        </div>
          ${
            post.filetype
              ? `
        <div class="caption">
          <p>
            <b>${post.title ? post.author.first_name : ""} </b>
                ${post.title}
          </p>
        </div>`
              : ""
          }
        <div class="text-gry comment" id="${post._id}">
          view all comments
        </div>
      </div>`;
  });
  return temp;
};

fetchPost(count);
loadbtn.addEventListener("click", () => {
  fetchPost(count);
});

const sharePost = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "Social Media",
        text: "Check out this post on Social Media",
        url: `https://social-media-website.herokuapp.com/singlepost/`,
      })
      .then(() => {
        alert("Link Copied");
      })
      .catch(console.error);
  } else {
    alert("Your browser does not support this feature");
  }
};

bookmark_btn.addEventListener("click", async () => {
  const { data } = await axios.get(`/bookmarks`);
  posts = data.posts;
  temp = "";
  feeds.innerHTML = handleloop(data);
});

