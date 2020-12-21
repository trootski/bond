package org.troot.bondmovieapi.domain;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "bond_movies", schema = "public", uniqueConstraints={
  @UniqueConstraint(columnNames = {"title", "movieType", "releaseYear"})
})
public class BondMovie {

  // https://ntsim.uk/posts/how-to-use-hibernate-identifier-sequence-generators-properly
  // using hibernate 'pooled hi/lo' sequence generation strategy for the Id
  // hibernate will grab the next 50 id numbers and use them for inserts
  // restarting the app will mean you will get gaps in id column values
  // as the ids the app is holding are discarded and the next 50 are taken on restart
  // Alternative is to use Sp to create new share - prob a lot simplier and less weirdness
  // requires sql to align seq interval on db -> ALTER SEQUENCE share_id_seq INCREMENT 50;
  @Id
  @SequenceGenerator(
          name = "bond_movie_seq",
          sequenceName = "bond_movie_seq",
          allocationSize = 50
  )
  @GeneratedValue(generator = "bond_movie_seq", strategy = GenerationType.SEQUENCE)
  @Column(name="id", updatable = false, nullable = false)
  private Long id;
  public Long getId() {
    return id;
  }
  public void setId(Long id) {
    this.id = id;
  }

  private String title;
  @Column(name = "title", unique = true)
  @NotBlank(message = "Title is mandatory")
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  private String runtime;
  @Column
  @NotBlank(message = "Runtime is mandatory")
  public String getRuntime() {
    return runtime;
  }
  public void setRuntime(String runtime) {
    this.runtime = runtime;
  }

  private String review;
  @Column
  @NotBlank(message = "Review is mandatory")
  public String getReview() {
    return review;
  }
  public void setReview(String review) {
    this.review = review;
  }

  private String imdbid;
  @Column
  @NotBlank(message = "IMDB ID is mandatory")
  public String getImdbid() {
    return imdbid;
  }
  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  private String synopsis;
  @Column(length = 10000)
  @NotBlank(message = "Synopsis is mandatory")
  public String getSynopsis() {
    return synopsis;
  }
  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  private String movieType;
  @Column
  @NotBlank(message = "Type is mandatory")
  public String getMovieType() {
    return movieType;
  }
  public void setMovieType(String movieType) {
    this.movieType = movieType;
  }

  private String year;
  @Column
  @NotBlank(message = "Year is mandatory")
  public String getYear() {
    return year;
  }
  public void setYear(String year) {
    this.year = year;
  }

  private String poster;
  @Column
  @NotBlank(message = "Poster is mandatory")
  public String getPoster() {
    return poster;
  }
  public void setPoster(String poster) {
    this.poster = poster;
  }

  private Integer catalog_order;
  @Column
  @NotNull(message = "Category Order is mandatory")
  public Integer getCatalog_order() {
    return catalog_order;
  }
  public void setCatalog_order(Integer catalog_order) {
    this.catalog_order = catalog_order;
  }

  public BondMovie() { }

}
