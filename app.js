const apiKeyTMDB = '624955a25e97ad8263efa29e8bed9ac3'; // TMDB API key
const apiKeyOMDB = '73ee7b4b'; // IMDb (OMDB) API key

// Fetch movies from TMDB based on a query
const fetchMovies = async (query) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching movies from TMDB:", error);
    }
};

// Fetch IMDb rating using OMDB API
const fetchIMDBRating = async (title) => {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKeyOMDB}&t=${encodeURIComponent(title)}`);
        const data = await response.json();
        return data.imdbRating || 'N/A';
    } catch (error) {
        console.error("Error fetching IMDb rating:", error);
        return 'N/A';
    }
};

// Display movies with TMDB and IMDb ratings
const displayMovies = async (movies) => {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = ''; // Clear previous results

    for (const movie of movies) {
        const imdbRating = await fetchIMDBRating(movie.title); // Fetch IMDb rating

        const movieElement = `
            <div class="movie">
                <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
                </a>
                <h3>${movie.title}</h3>
                <p>TMDB Rating: ${movie.vote_average} ⭐</p>
                <p>IMDb Rating: ${imdbRating} ⭐</p>
                <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="more-info-link">More Info</a>
            </div>
        `;
        movieList.innerHTML += movieElement;
    }
};

// Filter movies by language
const filterMoviesByLanguage = (movies, language) => {
    if (language === "Other") {
        return movies.filter(movie =>
            !["en", "ko", "zh", "ja"].includes(movie.original_language)
        );
    }
    return movies.filter(movie => movie.original_language === language);
};

// Create language filter buttons
const createFilterButtons = (movies) => {
    const filterContainer = document.getElementById('language-filters');
    const languages = ["English", "Korean", "Chinese", "Japanese", "Other"];
    const languageCodes = { "English": "en", "Korean": "ko", "Chinese": "zh", "Japanese": "ja", "Other": "Other" };

    filterContainer.innerHTML = languages.map(language => `
        <button class="filter-button" data-language="${languageCodes[language]}">${language}</button>
    `).join('');

    // Add event listeners to filter buttons
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedLanguage = event.target.getAttribute('data-language');
            const filteredMovies = filterMoviesByLanguage(movies, selectedLanguage);
            displayMovies(filteredMovies);
        });
    });
};

// Handle the search form submission
document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    fetchMovies(query).then(movies => {
        displayMovies(movies); // Show all movies initially
        createFilterButtons(movies); // Generate filter buttons
    });
});
