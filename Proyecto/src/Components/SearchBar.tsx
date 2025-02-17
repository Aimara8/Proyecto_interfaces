import React, { useState, useEffect, useContext } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, connectStateResults } from 'react-instantsearch-dom';
import { Hit as AlgoliaHit } from 'react-instantsearch-core';
import '../CSS/SearchBar.css';
import { ThemeContext } from '../Contexts/ThemeContext';

// Define the type for your hit objects
interface MyHit {
    poster_path: string;
    release_date: string;
    title: string;
    overview: string;
}

// Algolia client setup
const searchClient = algoliasearch(
    'VD6Y46V2FT',
    'f08114b6cef4ae9129b64dd4cb35817f'
);

// Component to render each hit
const HitComponent: React.FC<{ hit: AlgoliaHit<MyHit> }> = ({ hit }) => (
    <div className="hit-container">
        <img className="hit-image" src={hit.poster_path} alt="Imagen" />
        <div className="hit-info">
            <h2>{hit.title}</h2>
            <p>{hit.overview}</p>
            <h6>{hit.release_date}</h6>
        </div>
    </div>
);

// Pop-up component for displaying search results
const ResultsPopup = connectStateResults(({ searchState, searchResults }: any) => {
    const hasResults = searchResults && searchResults.nbHits !== 0;

    return (
        <div id="popup" style={{ display: hasResults ? 'block' : 'none' }} className="results-popup">
            {hasResults ? <Hits hitComponent={HitComponent} /> : <div>No results found.</div>}
        </div>
    );
});

const SearchBar: React.FC = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // Accedemos al contexto usando useContext
    const themeContext = useContext(ThemeContext); // Accede al contexto
    const { theme } = themeContext!;

    const handleSearchStateChange = (state: any) => {
        setIsPopupVisible(!!state.query); // Aparece sólo cuando se introduce algo en el input
    };

    const handleClickOutside = (event: MouseEvent) => {
        const popup = document.getElementById('popup');
        if (popup && !popup.contains(event.target as Node)) {
            setIsPopupVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={`search-container ${theme}`}>
            <InstantSearch indexName="movie" searchClient={searchClient} onSearchStateChange={handleSearchStateChange}>
                <SearchBox className="search-input" />
                {isPopupVisible && <ResultsPopup />}
            </InstantSearch>
        </div>
    );
};

export default SearchBar;
