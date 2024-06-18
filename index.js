const apiKey = '836c16606c17c0ce2a8741c5b7c60486'; // Replace with your actual API key
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;

async function getMovies() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function renderMovies() {
  const moviesContainer = document.getElementById("movies-container");
  const movies = await getMovies();

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
}


async function getGenres(genreIds) {
    const genreResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
    const genreData = await genreResponse.json();
    const genres = genreData.genres.filter(genre => genreIds.includes(genre.id));
    return genres.map(genre => genre.name).join(', ');
}

async function getTrailerLink(movieId) {
    const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`);
    const trailerData = await trailerResponse.json();
    const trailers = trailerData.results.filter(trailer => trailer.type === 'Trailer');
    return trailers.length > 0 ? `https://www.youtube.com/watch?v=${trailers[0].key}` : '';
}

renderMovies();
