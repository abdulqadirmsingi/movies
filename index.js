const apiKey = "836c16606c17c0ce2a8741c5b7c60486"; // Replace with your actual API key
const apiUrlBase = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=`;
const moviesContainer = document.getElementById("movies-container");
const paginationContainer = document.querySelector(".pagination");

let currentPage = 1;
let totalPages = 1;
const maxPages = 15; 

async function getMovies(pageNumber) {
  try {
    const response = await fetch(apiUrlBase + pageNumber);
    const data = await response.json();
    totalPages = Math.min(data.total_pages, maxPages); // Limit total pages to maxPages
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

async function renderMovies() {
  moviesContainer.innerHTML = ""; // Clear previous movies
  const movies = await getMovies(currentPage);

  movies.forEach(async (movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("col");

    movieCard.innerHTML = `
            <div class="card h-100">
                
                <div class="card-body">
                    <h2 class="card-title" style="font-weight: bold;">${
                      movie.title
                    }</h2>
                    <p class="card-text">${movie.overview}</p>
                    <p class="card-text"><strong>Genres:</strong> ${await getGenres(
                      movie.genre_ids
                    )}</p>

                     <p class="card-text"><strong>Rating:</strong> ${
                       movie.vote_average
                     }/10</p>

                    

                    <p class="card-text"><strong>Release Year:</strong> ${
                      movie.release_date ? movie.release_date.split("-")[0] : ""
                    }</p>
                </div>
                <div class="card-footer d-flex justify-content-between">
                    <a href="${await getTrailerLink(
                      movie.id
                    )}" class="btn btn-primary" target="_blank">Watch Trailer</a>
                    <a href="https://www.themoviedb.org/movie/${
                      movie.id
                    }" class="btn btn-secondary" target="_blank">View Details</a>
                </div>
            </div>
        `;

    moviesContainer.appendChild(movieCard);
  });

  renderPaginationLinks(); // Render pagination links after fetching movies
}

async function renderPaginationLinks() {
  paginationContainer.innerHTML = ""; // Clear previous pagination links

  for (let i = 1; i <= totalPages; i++) {
    if (i > maxPages) break; // Stop rendering pagination links after maxPages
    const pageLink = document.createElement("li");
    pageLink.classList.add("page-item");
    if (i === currentPage) pageLink.classList.add("active");

    pageLink.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
    paginationContainer.appendChild(pageLink);
  }

  // Add event listener to pagination links
  paginationContainer.addEventListener("click", async (event) => {
    if (event.target.tagName === "A") {
      event.preventDefault(); // Prevent default link behavior
      const pageNumber = parseInt(event.target.dataset.page); // Get the page number from data attribute
      if (pageNumber !== currentPage && pageNumber <= totalPages) {
        currentPage = pageNumber;
        await renderMovies(); // Render movies for the selected page
        // Update active class for pagination links
        document
          .querySelectorAll(".page-item")
          .forEach((item) => item.classList.remove("active"));
        event.target.parentNode.classList.add("active");
      }
    }
  });
}

async function getGenres(genreIds) {
  const genreResponse = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
  );
  const genreData = await genreResponse.json();
  const genres = genreData.genres.filter((genre) =>
    genreIds.includes(genre.id)
  );
  return genres.map((genre) => genre.name).join(", ");
}

async function getTrailerLink(movieId) {
  const trailerResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
  );
  const trailerData = await trailerResponse.json();
  const trailers = trailerData.results.filter(
    (trailer) => trailer.type === "Trailer"
  );
  return trailers.length > 0
    ? `https://www.youtube.com/watch?v=${trailers[0].key}`
    : "";
}

// Initial render of movies and pagination links
renderMovies();
