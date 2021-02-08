package org.troot.moviemetadataapispring.boundary;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class TMDBMovieMetadataResponse implements Serializable {
    private String id;
    private String imdb_id;
    private String overview;
    private String poster_path;
    private String release_date;
    private String runtime;
    private String title;
}

