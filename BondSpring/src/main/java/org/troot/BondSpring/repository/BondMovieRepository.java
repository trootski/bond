package org.troot.BondSpring.repository;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.springframework.data.repository.CrudRepository;
import org.troot.BondSpring.domain.BondMovie;

import java.util.List;

@EnableScan
public interface BondMovieRepository extends CrudRepository<BondMovie, String> {
  List<BondMovie> findAll();

  List<BondMovie> findByTitle(String title);
}

