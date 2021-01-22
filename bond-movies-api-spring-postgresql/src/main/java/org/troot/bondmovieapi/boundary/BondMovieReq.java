package org.troot.bondmovieapi.boundary;

import javax.validation.constraints.*;

public class BondMovieReq {
    @NotNull
    @NotEmpty
    @Size(min = 3, max = 255)
    private String title;
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    @NotNull
    @NotEmpty
    @Size(min = 3, max = 60)
    private String runtime;
    public String getRuntime() {
        return runtime;
    }
    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    @NotNull
    @NotEmpty
    @Size(max = 60)
    private String imdbid;
    public String getImdbid() {
        return imdbid;
    }
    public void setImdbid(String imdbid) {
        this.imdbid = imdbid;
    }

    @NotNull
    @NotEmpty
    @Size(max = 255)
    private String synopsis;
    public String getSynopsis() {
        return synopsis;
    }
    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    @NotNull
    @NotEmpty
    @Size(max = 255)
    private String review;
    public String getReview() {
        return review;
    }
    public void setReview(String review) {
        this.review = review;
    }

    @Pattern(regexp = "^(movie)$")
    @Size(min = 5, max = 5)
    private String movie_type;
    public String getMovie_type() {
        return movie_type;
    }

    public void setMovie_type(String movie_type) {
        this.movie_type = movie_type;
    }

    @Pattern(regexp = "^[0-9]{4}$", message = "A valid year in the format YYYY is required")
    @Size(min = 4, max = 4)
    private String year;
    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }

    @NotNull
    @NotEmpty
    @Size(max = 255)
    private String poster;
    public String getPoster() {
        return poster;
    }
    public void setPoster(String poster) {
        this.poster = poster;
    }

    @Min(1)
    private Integer catalog_order;
    public Integer getCatalog_order() {
        return catalog_order;
    }
    public void setCatalog_order(Integer catalog_order) {
        this.catalog_order = catalog_order;
    }
}