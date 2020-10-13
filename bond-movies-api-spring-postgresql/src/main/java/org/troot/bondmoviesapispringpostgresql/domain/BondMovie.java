package org.troot.bondmoviesapispringpostgresql.domain;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.Date;

@Entity
@Table(name = "bond_movies", schema = "public")
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

  private String runtime;
  @Column
  public String getRuntime() {
    return runtime;
  }
  public void setRuntime(String runtime) {
    this.runtime = runtime;
  }

  private String review;
  @Column
  public String getReview() {
    return review;
  }
  public void setReview(String review) {
    this.review = review;
  }

  private String imdbid;
  @Column
  public String getImdbid() {
    return imdbid;
  }
  public void setImdbid(String imdbid) {
    this.imdbid = imdbid;
  }

  private String synopsis;
  @Column
  public String getSynopsis() {
    return synopsis;
  }
  public void setSynopsis(String synopsis) {
    this.synopsis = synopsis;
  }

  private String type;
  @Column
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }

  private String year;
  @Column
  public String getYear() {
    return year;
  }
  public void setYear(String year) {
    this.year = year;
  }

  private String poster;
  @Column
  public String getPoster() {
    return poster;
  }
  public void setPoster(String poster) {
    this.poster = poster;
  }

  private Integer order;
  @Column
  public Integer getOrder() {
    return order;
  }
  public void setOrder(Integer order) {
    this.order = order;
  }

  public BondMovie() { }

}
