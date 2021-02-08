package org.troot.moviemetadataapispring.service;

import feign.Feign;
import feign.Param;
import feign.QueryMap;
import feign.RequestLine;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import feign.okhttp.OkHttpClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.troot.moviemetadataapispring.boundary.TMDBMovieMetadataResponse;
import org.troot.moviemetadataapispring.boundary.TMDBSearchResultsResponse;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class TMDBService {

    private final TMDB tmdb;

    @Value("${app.tmdb.key}")
    private String api_key;

    private String baseURL = "http://api.themoviedb.org/3";

    public TMDBService() {
        tmdb = Feign.builder()
                .client(new OkHttpClient())
                .encoder(new GsonEncoder())
                .decoder(new GsonDecoder())
                .target(TMDB.class, baseURL);
    }
    public interface TMDB {
        @RequestLine("GET /search/movie/")
        TMDBSearchResultsResponse search(@QueryMap Map<String, String> queryMap);

        @RequestLine("GET /movie/{movieId}")
        TMDBMovieMetadataResponse findById(@Param("movieId") String movieId, @QueryMap Map<String, String> queryMap);
    }

    public Optional<TMDBSearchResultsResponse> search(String title) {
        log.info("Performing search: {}", title);
        Map<String, String> queryParams = new HashMap<>();
        queryParams.put("api_key", api_key);
        queryParams.put("query", title);
        return Optional.ofNullable(tmdb.search(queryParams));
    }

    @Cacheable(cacheNames = "MovieMetadataCache")
    public Optional<TMDBMovieMetadataResponse> findByTMDBId(String movieId) {
        log.info("Getting movie metadata with id: {}", movieId);
        Map<String, String> queryParams = new HashMap<>();
        queryParams.put("api_key", api_key);
        return Optional.ofNullable(tmdb.findById(movieId, queryParams));
    }
}
