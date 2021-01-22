package org.troot.bondmovieapi.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.troot.bondmovieapi.entity.BondMovie;

import java.util.List;

@Repository
public interface BondMovieRepository extends CrudRepository<BondMovie, Long> {
    List<BondMovie> findAll();
    List<BondMovie> findBondMovieByTitle(String title);
}

