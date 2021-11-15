package org.troot.bondmovieapi.boundary;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BondMovieMetadataResponse {
    private String title;
    private String imdbid;
    private String poster;
    private String runtime;
    private String synopsis;
    private String type;
    private String year;

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    @JsonProperty("imdb_id")
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

    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    public String getYear() {
        return year;
    }
    public void setYear(String year) {
        this.year = year;
    }

}
