package org.troot.moviemetadataapispring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.troot.moviemetadataapispring.boundary.MovieMetadataResponse;
import org.troot.moviemetadataapispring.boundary.TMDBMovieMetadataResponse;
import org.troot.moviemetadataapispring.boundary.TMDBSearchResultsResponse;

import java.util.Optional;

@Service
public class MetadataService {

    @Autowired
    private TMDBService tmdbService;

    @Value("${app.tmdb.poster_base_url}")
    private String posterBaseURL;

    public Optional<MovieMetadataResponse> getMovieMetadata(String title) {
        TMDBSearchResultsResponse tmdbSearchResultsResponse = tmdbService.search(title)
                .orElseThrow(() -> new RuntimeException("Couldn't find the movie"));

        if (tmdbSearchResultsResponse.getResults().isEmpty()) {
            return Optional.empty();
        }

        TMDBMovieMetadataResponse tmdbMovieMetadataResponse = tmdbSearchResultsResponse.getResults().get(0);
        TMDBMovieMetadataResponse fullMovieMetadata = tmdbService.findByTMDBId(tmdbMovieMetadataResponse.getId())
                .orElseThrow(() -> new RuntimeException("Full movie details could not be found"));

        MovieMetadataResponse movieMetadataResponse = new MovieMetadataResponse();
        movieMetadataResponse.setImdb_id(fullMovieMetadata.getImdb_id());
        movieMetadataResponse.setPoster(posterBaseURL + fullMovieMetadata.getPoster_path());
        movieMetadataResponse.setRuntime(fullMovieMetadata.getRuntime() + " mins");
        movieMetadataResponse.setSynopsis(fullMovieMetadata.getOverview());
        movieMetadataResponse.setTitle(title);
        String year = fullMovieMetadata.getRelease_date();
        String[] splitOut = year.split("-");
        movieMetadataResponse.setYear(splitOut[0]);

        return Optional.ofNullable(movieMetadataResponse);
    }
}
