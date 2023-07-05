const api_key = "8fa581bdabf59210c9da9ae353ec38ee";
const api_end_point = "https://api.themoviedb.org/3";
const img_Path = "https://image.tmdb.org/t/p/original";

const api_paths = {
  fetchAllCategories: `${api_end_point}/genre/movie/list?api_key=${api_key}`,
  fetchMoviesList: (id) =>
    `${api_end_point}/discover/movie/?api_key=${api_key}&with_genres=${id}`,
  fetchTrending: `${api_end_point}/trending/movie/week?api_key=${api_key}&language=en-US`,
};

//BOOT UP THE APP
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndBuildMovieSections(api_paths.fetchTrending, "Trending Now")
    .then((list) => {
      const randomIndex = Math.floor(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => console.log(err));
}

function buildBannerSection(movie) {
  const bannerCon = document.getElementById("banner_section");
  bannerCon.style.backgroundImage = `url('${img_Path}${movie.backdrop_path}')`;

  const div = document.createElement("div");
  div.innerHTML = `
        <h2 class="banner_title">
          ${movie.title}
        </h2>
        <p class="banner_info">Trending in Movies | Rating: ${
          movie.vote_average
        }</p>
        <p class="banner_overview">
          ${
            movie.overview && movie.overview.length > 200
              ? movie.overview.slice(0, 200).trim() + "..."
              : movie.overview
          }
        </p>
        <div class="action_btn_sec">
          <button class="action_btn">
            <i class="fa-solid fa-play" style="color: #000000"></i> &nbsp;
            &nbsp; Play
          </button>
          <button class="action_btn">
            <i class="fa-regular fa-circle-info"></i> &nbsp; &nbsp; More Info
          </button>
        </div>
  `;
  div.className = "banner_content container";
  bannerCon.append(div);
}

function fetchAndBuildAllSections() {
  fetch(api_paths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSections(
            api_paths.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      // console.table(categories);
    })
    .catch((err) => console.log(err));
}

// fetchAndBuildMovieSections : This function is fetching the api and building other function
//this function calling all the categories and giving response in array

function fetchAndBuildMovieSections(fetchUrl, categoryName) {
  // console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length > 0) {
        buildMovieSections(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.log(err));
}

// Fetching Movie List by Category *********************************************************

function buildMovieSections(list, categoryName) {
  console.log(list, categoryName);

  const moviesCon = document.getElementById("movie_cont");

  const moviesListHTML = list
    .map((item) => {
      return `
      <div class="movie_item">
          <img class="movie_item_img" src="${img_Path}${item.backdrop_path}" alt="${item.title}" />
      </div>
          `;
    })
    .join("");

  const movieSectionHTML = `
  <h2 class="movie_section_heading">
  ${categoryName} <span class="explore_nudge">Explore All</span>
  </h2>
  <div class="movies_row">
    ${moviesListHTML}
  </div>`;
  console.log(movieSectionHTML);
  const div = document.createElement("div");
  div.className = "movies_section";
  div.innerHTML = movieSectionHTML;

  //Append HTML into movies Container

  moviesCon.append(div);
}

// function serachMovieTrailer(movieName, iframId) {
//   if (!movieName) return;

//   fetch(api_paths.searchOnYoutube(movieName))
//     .then((res) => res.json())
//     .then((res) => {
//       // console.log(res.items[0]);
//       const bestResult = res.items[0];

//       const elements = document.getElementById(iframId);
//       console.log(elements, iframId);

//       const div = document.createElement("div");
//       div.innerHTML = `<iframe
//           width="245px"
//           height="150px"
//           src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0">
//         </iframe>`;

//       elements.append(div);
//     })
//     .catch((err) => console.log(err));
// }

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    //header ui update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("black_bg");
    else header.classList.remove("black_bg");
  });
});

// const toggle_btn = document.querySelector(".togglebtn");
// const main_nav = document.querySelector(".main_nav");

// toggle_btn.addEventListener("click", function () {
//   toggle_btn.classList.toggle("active");
//   main_nav.classList.toggle("active");
// });

// Registration JS
const user_con = document.querySelector(".user_container");

const regis_btn = document.querySelector(".registration-btn");

const login_btn = document.querySelector(".login-btn");

regis_btn.addEventListener("click", () => {
  user_con.classList.add("login-section--display");
});

login_btn.addEventListener("click", () => {
  user_con.classList.remove("login-section--display");
});
