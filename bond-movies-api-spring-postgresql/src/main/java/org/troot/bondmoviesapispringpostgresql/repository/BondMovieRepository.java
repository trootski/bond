package org.troot.bondmoviesapispringpostgresql.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.troot.bondmoviesapispringpostgresql.domain.BondMovie;

import java.util.List;

@Repository
public interface BondMovieRepository extends CrudRepository<BondMovie, String> {
  // List<BondMovie> findByType(String type);

  // List<BondMovie> findByTitle(String title);
}

