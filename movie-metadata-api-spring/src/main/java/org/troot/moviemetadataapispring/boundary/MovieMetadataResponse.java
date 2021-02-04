package org.troot.moviemetadataapispring.boundary;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieMetadataResponse {
    private String imdb_id;
    private String poster;
    private String runtime;
    private String synopsis;
    private String title;
    private String year;
}
