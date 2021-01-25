package org.troot.BondSpring.boundary;

public class BondMovieRequest {

  private String title;
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  private String runtime;
  public String getRuntime() {
    return runtime;
  }
  public void setRuntime(String runtime) {
    this.runtime = runtime;
  }

  private String review;
  public String getReview() {
    return review;
  }
  public void setReview(String review) {
    this.review = review;
  }

  private String imdbid;
  public String getImdbid() {
    return imdbid;
  }
  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  private String synopsis;
  public String getSynopsis() {
    return synopsis;
  }
  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  private String movie_type;
  public String getMovie_type() {
    return movie_type;
  }
  public void setMovie_type(String movie_type) {
    this.movie_type = movie_type;
  }

  private String year;
  public String getYear() {
    return year;
  }
  public void setYear(String year) {
    this.year = year;
  }

  private String poster;
  public String getPoster() {
    return poster;
  }
  public void setPoster(String poster) {
    this.poster = poster;
  }

  private Integer catalog_order;
  public Integer getCatalog_order() {
    return catalog_order;
  }
  public void setCatalog_order(Integer catalog_order) {
    this.catalog_order = catalog_order;
  }

  public BondMovieRequest() {

  }
}
