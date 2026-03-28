
import './App.css';
import { useState, useEffect, } from 'react';

export default function App() {
  const [searchValue, setSearchValue] = useState('');

  const [sortByValue, setSortByValue] = useState('revenue.desc');

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDExZDgyZDA2YzkyYjhkYWZjMjY0YmU3MTJiZTE0OCIsIm5iZiI6MTc3MjU3NzI4OC4wOTMsInN1YiI6IjY5YTc2MjA4NWE3Y2IxNzBhMmI2ZDEzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S_43l5HMQc131vaVFGu8LXFzflF199_EMP_Zj_YIJ_s'
    }
  };


  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };
  const handleSort = (e) => {
    setSortByValue(e.target.value);
    setCurrentPage(1);
  };
  const previousPage = (e) => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const nextPage = (e) => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage+1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);


  useEffect(() => {
    const isQuery = debouncedSearchValue.length > 0;
    const mode = isQuery ? 'search' : 'discover';
    const queryInsertion = isQuery ? `query=${debouncedSearchValue}&` : '';


    fetch(`https://api.themoviedb.org/3/${mode}/movie?${queryInsertion}include_adult=false&include_video=false&page=${currentPage}&primary_release_date.gte=2016-01-01&primary_release_date.lte=2026-03-01&sort_by=${sortByValue}`, options)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results);
        setTotalPages(data.total_pages);
      });
  }, [currentPage, sortByValue, debouncedSearchValue]);

  return (
          <div>
              <div id="topBar">
                  <div id="search-container">
                      <label for="searchField"></label>
                      <input
                          type="search"
                          id="searchField"
                          placeholder="Search for a movie..."
                          value={searchValue}
                          onChange={handleSearch}
                      />
                  </div>
                  <div>
                      <select onChange={handleSort} id="sortDropdown">
                          <option value="popularity.desc">Sort By</option>
                          <option value="primary_release_date.asc">Release Date (Asc)</option>
                          <option value="primary_release_date.desc">Release Date (Desc)</option>
                          <option value="vote_average.asc">Rating (Asc)</option>  
                          <option value="vote_average.desc">Rating (Desc)</option>
                      </select>
                  </div>
              </div>
              
              <script src="./script.js"></script>
              <div id="movie-list">
                {movies.map((movie) => (
                  <div className="movie-card" key={movie.id}>
                    <div className="poster-container">
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                      ) : (
                        <p></p>
                      )}
                    </div>
                    <p className="movie-title">{movie.title}</p>
                    <p className="movie-subtext">Release Date: {movie.release_date}</p>
                    <p className="movie-subtext">Rating: {movie.vote_average}</p>
                </div>))}
              </div>

              <div id="pageBlock">
                  <button onClick={previousPage}>Previous</button>
                  <div id="pageText">
                    {`Page ${currentPage} of ${totalPages}`}
                  </div>
                  <button onClick={nextPage}>Next</button>
              </div>
          </div>
  );
}