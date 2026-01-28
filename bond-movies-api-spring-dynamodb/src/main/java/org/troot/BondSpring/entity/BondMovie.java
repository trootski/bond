package org.troot.BondSpring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

@DynamoDbBean
public class BondMovie {

  private String title;
  private String runtime;
  private String review;
  private String imdbid;
  private String synopsis;
  private String movieType;
  private Integer year;
  private String poster;
  private Integer catalogOrder;
  private String actor;
  private String director;

  @DynamoDbPartitionKey
  @DynamoDbAttribute("title")
  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  @DynamoDbAttribute("runtime")
  public String getRuntime() {
    return runtime;
  }

  public void setRuntime(String runtime) {
    this.runtime = runtime;
  }

  @DynamoDbAttribute("review")
  public String getReview() {
    return review;
  }

  public void setReview(String review) {
    this.review = review;
  }

  @DynamoDbAttribute("imdbid")
  public String getImdbid() {
    return imdbid;
  }

  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  @DynamoDbAttribute("synopsis")
  public String getSynopsis() {
    return synopsis;
  }

  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  @DynamoDbAttribute("movie_type")
  @DynamoDbSecondaryPartitionKey(indexNames = "SortByOrder")
  public String getMovieType() {
    return movieType;
  }

  public void setMovieType(String movieType) {
    this.movieType = movieType;
  }

  @DynamoDbAttribute("year")
  public Integer getYear() {
    return year;
  }

  public void setYear(Integer year) {
    this.year = year;
  }

  @DynamoDbAttribute("poster")
  public String getPoster() {
    return poster;
  }

  public void setPoster(String poster) {
    this.poster = poster;
  }

  @DynamoDbAttribute("catalog_order")
  @DynamoDbSecondarySortKey(indexNames = "SortByOrder")
  @JsonProperty("catalog_order")
  public Integer getCatalogOrder() {
    return catalogOrder;
  }

  public void setCatalogOrder(Integer catalogOrder) {
    this.catalogOrder = catalogOrder;
  }

  @DynamoDbAttribute("actor")
  public String getActor() {
    return actor;
  }

  public void setActor(String actor) {
    this.actor = actor;
  }

  @DynamoDbAttribute("director")
  public String getDirector() {
    return director;
  }

  public void setDirector(String director) {
    this.director = director;
  }

  public BondMovie() {
  }
}
