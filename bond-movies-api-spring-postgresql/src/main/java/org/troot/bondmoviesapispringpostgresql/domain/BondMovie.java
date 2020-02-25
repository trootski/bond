package org.troot.bondmoviesapispringpostgresql.domain;

//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
public class BondMovie {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }

  private String title;
  @Column
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  @Column
  private String Actors;
  public String getActors() {
    return Actors;
  }
  public void setActors(String Actors) {
    this.Actors = Actors;
  }
//
//  // @Column
//  // private String Metascore;
//  // public String getMetascore() {
//  //   return Metascore;
//  // }
//  // public void setMetascore(String Metascore) {
//  //   this.Metascore = Metascore;
//  // }
//
//  // @Column
//  // private String BoxOffice;
//  // public String getBoxOffice() {
//  //   return BoxOffice;
//  // }
//  // public void setBoxOffice(String BoxOffice) {
//  //   this.BoxOffice = BoxOffice;
//  // }
//
//  // @Column
//  // private String Website;
//  // public String getWebsite() {
//  //   return Website;
//  // }
//  // public void setWebsite(String Website) {
//  //   this.Website = Website;
//  // }
//
//  // @Column
//  // private String imdbRating;
//  // public String getimdbRating() {
//  //   return imdbRating;
//  // }
//  // public void setimdbRating(String imdbRating) {
//  //   this.imdbRating = imdbRating;
//  // }
//
//  // @Column
//  // private String imdbVotes;
//  // public String getimdbVotes() {
//  //   return imdbVotes;
//  // }
//  // public void setimdbVotes(String imdbVotes) {
//  //   this.imdbVotes = imdbVotes;
//  // }
//
//  // @Column
//  // private String Runtime;
//  // public String getRuntime() {
//  //   return Runtime;
//  // }
//  // public void setRuntime(String Runtime) {
//  //   this.Runtime = Runtime;
//  // }
//
//  // @Column
//  // private String Language;
//  // public String getLanguage() {
//  //   return Language;
//  // }
//  // public void setLanguage(String Language) {
//  //   this.Language = Language;
//  // }
//
//  // @Column
//  // private String Rated;
//  // public String getRated() {
//  //   return Rated;
//  // }
//  // public void setRated(String Rated) {
//  //   this.Rated = Rated;
//  // }
//
//  // @Column
//  // private String review;
//  // public String getreview() {
//  //   return review;
//  // }
//  // public void setreview(String review) {
//  //   this.review = review;
//  // }
//
//  // @Column
//  // private String Production;
//  // public String getProduction() {
//  //   return Production;
//  // }
//  // public void setProduction(String Production) {
//  //   this.Production = Production;
//  // }
//
//  // @Column
//  // private String Released;
//  // public String getReleased() {
//  //   return Released;
//  // }
//  // public void setReleased(String Released) {
//  //   this.Released = Released;
//  // }
//
//  // @Column
//  // private String imdbID;
//  // public String getimdbID() {
//  //   return imdbID;
//  // }
//  // public void setimdbID(String imdbID) {
//  //   this.imdbID = imdbID;
//  // }
//
//  // @Column
//  // private String Plot;
//  // public String getPlot() {
//  //   return Plot;
//  // }
//  // public void setPlot(String Plot) {
//  //   this.Plot = Plot;
//  // }
//
//  // @Column
//  // private String Director;
//  // public String getDirector() {
//  //   return Director;
//  // }
//  // public void setDirector(String Director) {
//  //   this.Director = Director;
//  // }
//
//  // @Column
//  // private String Response;
//  // public String getResponse() {
//  //   return Response;
//  // }
//  // public void setResponse(String Response) {
//  //   this.Response = Response;
//  // }
//
//  // @Column
//  // private String Type;
//  // public String getType() {
//  //   return Type;
//  // }
//  // public void setType(String Type) {
//  //   this.Type = Type;
//  // }
//
//  // @Column
//  // private String Awards;
//  // public String getAwards() {
//  //   return Awards;
//  // }
//  // public void setAwards(String Awards) {
//  //   this.Awards = Awards;
//  // }
//
//  // @Column
//  // private String DVD;
//  // public String getDVD() {
//  //   return DVD;
//  // }
//  // public void setDVD(String DVD) {
//  //   this.DVD = DVD;
//  // }
//
//  // @Column
//  // private String Year;
//  // public String getYear() {
//  //   return Year;
//  // }
//  // public void setYear(String Year) {
//  //   this.Year = Year;
//  // }
//
//  // @Column
//  // private String Poster;
//  // public String getPoster() {
//  //   return Poster;
//  // }
//  // public void setPoster(String Poster) {
//  //   this.Poster = Poster;
//  // }
//
//  // @Column
//  // private String Country;
//  // public String getCountry() {
//  //   return Country;
//  // }
//  // public void setCountry(String Country) {
//  //   this.Country = Country;
//  // }
//
//  // @Column
//  // private String Genre;
//  // public String getGenre() {
//  //   return Genre;
//  // }
//  // public void setGenre(String Genre) {
//  //   this.Genre = Genre;
//  // }
//
//  // @Column
//  // private String Writer;
//  // public String getWriter() {
//  //   return Writer;
//  // }
//  // public void setWriter(String Writer) {
//  //   this.Writer = Writer;
//  // }
//
//  // // @Column
//  // // private Integer order;
//  // // public Integer getOrder() {
//  // //   return order;
//  // // }
//  // // public void setOrder(Integer order) {
//  // //   this.order = order;
//  // // }
//
//  // @CreationTimestamp
//  // private Date dateCreated;
//  // public Date getDateCreated() {
//  //   return dateCreated;
//  // }
//  // public void setDateCreated(Date dateCreated) {
//  //   this.dateCreated = dateCreated;
//  // }
//
//  // @UpdateTimestamp
//  // private Date dateModified = new Date();
//  // public Date getDateModified() {
//  //   return dateModified;
//  // }
//  // public void setDateModified(Date dateModified) {
//  //   this.dateModified = dateModified;
//  // }
//
//  public BondMovie() {
//
//  }
}
