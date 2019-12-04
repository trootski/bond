package org.troot.BondSpring;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class BondMovie {

  @Id
  @GeneratedValue
  private Long id;
  private String bookingName;

  public BondMovie(String bookingName) {
    super();
    this.bookingName = bookingName;
  }

  public BondMovie() {
    super();
  }

  public String getName(){
    return "apples";
  }

}
