package org.troot.BondSpring.repository;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.troot.BondSpring.entity.BondMovie;

import java.util.List;

public interface BondMovieRepository extends CrudRepository<BondMovie, String> {
  @EnableScan
  List<BondMovie> findByTitle(String movieTitle);
}
