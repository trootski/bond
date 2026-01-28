package org.troot.bondmovieapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "bond_movies", schema = "public")
public class BondMovie {

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

  @Column(name = "title", unique = true)
  private String title;
  public String getTitle() {
    return title;
  }
  public void setTitle(String title) {
    this.title = title;
  }

  @Column
  private String runtime;
  public String getRuntime() {
    return runtime;
  }
  public void setRuntime(String runtime) {
    this.runtime = runtime;
  }

  @Column
  private String review;
  public String getReview() {
    return review;
  }
  public void setReview(String review) {
    this.review = review;
  }

  @Column
  private String imdbid;
  public String getImdbid() {
    return imdbid;
  }
  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  @Column(length = 10000)
  private String synopsis;
  public String getSynopsis() {
    return synopsis;
  }
  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  @Column(name = "movie_type")
  private String movieType;
  public String getMovieType() {
    return movieType;
  }
  public void setMovieType(String movieType) {
    this.movieType = movieType;
  }

  @Column
  private Integer year;
  public Integer getYear() {
    return year;
  }
  public void setYear(Integer year) {
    this.year = year;
  }

  @Column
  private String poster;
  public String getPoster() {
    return poster;
  }
  public void setPoster(String poster) {
    this.poster = poster;
  }

  @Column
  private Integer catalog_order;
  public Integer getCatalog_order() {
    return catalog_order;
  }
  public void setCatalog_order(Integer catalog_order) {
    this.catalog_order = catalog_order;
  }

  @Column
  private String actor;
  public String getActor() {
    return actor;
  }
  public void setActor(String actor) {
    this.actor = actor;
  }

  @Column
  private String director;
  public String getDirector() {
    return director;
  }
  public void setDirector(String director) {
    this.director = director;
  }

  public BondMovie() { }

}
