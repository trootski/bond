package org.troot.bondmovieapi.boundary;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateBondMoviePayload {
    private Integer catalogOrder;
    private String review;
    private String title;
    private String imdbid;
    private String poster;
    private String runtime;
    private String synopsis;
    private String movieType;
    private String year;

    @JsonProperty("catalog_order")
    public Integer getCatalogOrder() {
        return catalogOrder;
    }
    public void setCatalogOrder(Integer catalogOrder) {
        this.catalogOrder = catalogOrder;
    }

    public String getReview() {
        return review;
    }
    public void setReview(String review) {
        this.review = review;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getImdbid() {
        return imdbid;
    }
    public void setImdbid(String imdbid) {
        this.imdbid = imdbid;
    }

    public String getPoster() {
        return poster;
    }
    public void setPoster(String poster) {
        this.poster = poster;
    }

    public String getRuntime() {
        return runtime;
    }
    public void setRuntime(String runtime) {
        this.runtime = runtime;
    }

    public String getSynopsis() {
        return synopsis;
    }
    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }

    @JsonProperty("movie_type")
    public String getMovieType() {
        return movieType;
    }
    public void setMovieType(String movieType) {
        this.movieType = movieType;
    }

    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }

    @Override
    public String toString() {
        return "(catalogOrder: " + this.catalogOrder +
                ", review: " + this.review +
                ", title: " + this.title +
                ", imdbid: " + this.imdbid +
                ", poster: " + this.poster +
                ", runtime: " + this.runtime +
                ", synopsis: " + this.synopsis +
                ", movieType: " + this.movieType +
                ", year: " + this.year + ")";
    }
}
