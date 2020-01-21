package org.troot.BondSpring.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.troot.BondSpring.domain.BondMovie;

import java.util.List;

public interface BondMovieRepository extends CrudRepository<BondMovie, String> {
  List<BondMovie> findAll();
}

