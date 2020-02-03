package org.troot.BondSpring.domain;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

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

  private String Actors;
  @DynamoDBAttribute(attributeName = "actors")
  public String getActors() {
    return Actors;
  }
  public void setActors(String Actors) {
    this.Actors = Actors;
  }

  private String Metascore;
  @DynamoDBAttribute(attributeName = "metascore")
  public String getMetascore() {
    return Metascore;
  }
  public void setMetascore(String Metascore) {
    this.Metascore = Metascore;
  }

  private String BoxOffice;
  @DynamoDBAttribute(attributeName = "boxoffice")
  public String getBoxOffice() {
    return BoxOffice;
  }
  public void setBoxOffice(String BoxOffice) {
    this.BoxOffice = BoxOffice;
  }

  private String Website;
  @DynamoDBAttribute(attributeName = "website")
  public String getWebsite() {
    return Website;
  }
  public void setWebsite(String Website) {
    this.Website = Website;
  }

  private String imdbRating;
  @DynamoDBAttribute(attributeName = "imdbrating")
  public String getimdbRating() {
    return imdbRating;
  }
  public void setimdbRating(String imdbRating) {
    this.imdbRating = imdbRating;
  }

  private String imdbVotes;
  @DynamoDBAttribute(attributeName = "imdbvotes")
  public String getimdbVotes() {
    return imdbVotes;
  }
  public void setimdbVotes(String imdbVotes) {
    this.imdbVotes = imdbVotes;
  }

  private String Runtime;
  @DynamoDBAttribute(attributeName = "runtime")
  public String getRuntime() {
    return Runtime;
  }
  public void setRuntime(String Runtime) {
    this.Runtime = Runtime;
  }

  private String Language;
  @DynamoDBAttribute(attributeName = "language")
  public String getLanguage() {
    return Language;
  }
  public void setLanguage(String Language) {
    this.Language = Language;
  }

  private String Rated;
  @DynamoDBAttribute(attributeName = "rated")
  public String getRated() {
    return Rated;
  }
  public void setRated(String Rated) {
    this.Rated = Rated;
  }

  private String review;
  @DynamoDBAttribute(attributeName = "review")
  public String getreview() {
    return review;
  }
  public void setreview(String review) {
    this.review = review;
  }

  private String Production;
  @DynamoDBAttribute(attributeName = "production")
  public String getProduction() {
    return Production;
  }
  public void setProduction(String Production) {
    this.Production = Production;
  }

  private String Released;
  @DynamoDBAttribute(attributeName = "released")
  public String getReleased() {
    return Released;
  }
  public void setReleased(String Released) {
    this.Released = Released;
  }

  private String imdbID;
  @DynamoDBAttribute(attributeName = "imdbid")
  public String getimdbID() {
    return imdbID;
  }
  public void setimdbID(String imdbID) {
    this.imdbID = imdbID;
  }

  private String Plot;
  @DynamoDBAttribute(attributeName = "plot")
  public String getPlot() {
    return Plot;
  }
  public void setPlot(String Plot) {
    this.Plot = Plot;
  }

  private String Director;
  @DynamoDBAttribute(attributeName = "director")
  public String getDirector() {
    return Director;
  }
  public void setDirector(String Director) {
    this.Director = Director;
  }

  private String Response;
  @DynamoDBAttribute(attributeName = "response")
  public String getResponse() {
    return Response;
  }
  public void setResponse(String Response) {
    this.Response = Response;
  }

  private String Type;
  @DynamoDBAttribute(attributeName = "type")
  public String getType() {
    return Type;
  }
  public void setType(String Type) {
    this.Type = Type;
  }

  private String Awards;
  @DynamoDBAttribute(attributeName = "awards")
  public String getAwards() {
    return Awards;
  }
  public void setAwards(String Awards) {
    this.Awards = Awards;
  }

  private String DVD;
  @DynamoDBAttribute(attributeName = "dvd")
  public String getDVD() {
    return DVD;
  }
  public void setDVD(String DVD) {
    this.DVD = DVD;
  }

  private String Year;
  @DynamoDBAttribute(attributeName = "year")
  public String getYear() {
    return Year;
  }
  public void setYear(String Year) {
    this.Year = Year;
  }

  private String Poster;
  @DynamoDBAttribute(attributeName = "poster")
  public String getPoster() {
    return Poster;
  }
  public void setPoster(String Poster) {
    this.Poster = Poster;
  }

  private String Country;
  @DynamoDBAttribute(attributeName = "country")
  public String getCountry() {
    return Country;
  }
  public void setCountry(String Country) {
    this.Country = Country;
  }

  private String Genre;
  @DynamoDBAttribute(attributeName = "genre")
  public String getGenre() {
    return Genre;
  }
  public void setGenre(String Genre) {
    this.Genre = Genre;
  }

  private String Writer;
  @DynamoDBAttribute(attributeName = "writer")
  public String getWriter() {
    return Writer;
  }
  public void setWriter(String Writer) {
    this.Writer = Writer;
  }

  private Integer order;
  @DynamoDBAttribute(attributeName = "order")
  public Integer getOrder() {
    return order;
  }
  public void setOrder(Integer order) {
    this.order = order;
  }

  @CreatedDate
  @JsonIgnore
  @DynamoDBAttribute
  private Date dateCreated;
  public Date getDateCreated() {
    return dateCreated;
  }
  public void setDateCreated(Date dateCreated) {
    this.dateCreated = dateCreated;
  }

  @LastModifiedDate
  @JsonIgnore
  @DynamoDBAttribute
  private Date dateModified = new Date();
  public Date getDateModified() {
    return dateModified;
  }
  public void setDateModified(Date dateModified) {
    this.dateModified = dateModified;
  }

  public BondMovie() {

  }
}
