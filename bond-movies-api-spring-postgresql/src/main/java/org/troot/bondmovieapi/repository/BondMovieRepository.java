package org.troot.bondmovieapi.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.troot.bondmovieapi.domain.BondMovie;

import java.sql.SQLException;
import java.util.List;

@Repository
public interface BondMovieRepository extends CrudRepository<BondMovie, Long> {
    List<BondMovie> findAll();
    List<BondMovie> findBondMovieByTitle(String title);
    BondMovie save(BondMovie bondMovie);
}

