package org.troot.bondmoviesapispringpostgresql.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.troot.bondmoviesapispringpostgresql.domain.BondMovie;

@Repository
public interface BondMovieRepository extends JpaRepository<BondMovie, Long> {
    List<BondMovie> findAll();
}

