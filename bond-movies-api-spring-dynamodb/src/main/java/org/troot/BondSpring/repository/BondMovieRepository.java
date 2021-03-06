package org.troot.BondSpring.repository;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.troot.BondSpring.entity.BondMovie;

import java.util.List;

@EnableScan
public interface BondMovieRepository extends CrudRepository<BondMovie, String> {
  List<BondMovie> findByMovieType(String s);

  List<BondMovie> findByTitle(String title);
}

