package org.troot.BondSpring.entity;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@DynamoDBTable(tableName = "BondMovies")
public class BondMovie {

  private String title;
  @DynamoDBHashKey(attributeName = "title")
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  private String Runtime;
  @DynamoDBAttribute(attributeName = "runtime")
  public String getRuntime() {
    return Runtime;
  }
  public void setRuntime(String Runtime) {
    this.Runtime = Runtime;
  }

  private String review;
  @DynamoDBAttribute(attributeName = "review")
  public String getReview() {
    return review;
  }
  public void setReview(String review) {
    this.review = review;
  }

  private String imdbid;
  @DynamoDBAttribute(attributeName = "imdbid")
  public String getImdbid() {
    return imdbid;
  }
  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  private String synopsis;
  @DynamoDBAttribute(attributeName = "synopsis")
  public String getSynopsis() {
    return synopsis;
  }
  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  private String movieType;
  @DynamoDBAttribute(attributeName = "movie_type")
  @DynamoDBIndexHashKey(globalSecondaryIndexName = "SortByOrder")
  public String getMovieType() {
    return movieType;
  }
  public void setMovieType(String movieType) {
    this.movieType = movieType;
  }

  private Integer year;
  @DynamoDBAttribute(attributeName = "year")
  public Integer getYear() {
    return year;
  }
  public void setYear(Integer year) {
    this.year = year;
  }

  private String poster;
  @DynamoDBAttribute(attributeName = "poster")
  public String getPoster() {
    return poster;
  }
  public void setPoster(String poster) {
    this.poster = poster;
  }

  private Integer catalogOrder;
  @DynamoDBIndexRangeKey(globalSecondaryIndexName = "SortByOrder")
  @DynamoDBAttribute(attributeName = "catalog_order")
  @JsonProperty("catalog_order")
  public Integer getCatalogOrder() {
    return catalogOrder;
  }
  public void setCatalogOrder(Integer catalogOrder) {
    this.catalogOrder = catalogOrder;
  }

  private String actor;
  @DynamoDBAttribute(attributeName = "actor")
  public String getActor() {
    return actor;
  }
  public void setActor(String actor) {
    this.actor = actor;
  }

  private String director;
  @DynamoDBAttribute(attributeName = "director")
  public String getDirector() {
    return director;
  }
  public void setDirector(String director) {
    this.director = director;
  }

  public BondMovie() {

  }
}
