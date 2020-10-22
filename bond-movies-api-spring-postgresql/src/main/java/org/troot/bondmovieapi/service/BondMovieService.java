package org.troot.bondmovieapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.troot.bondmovieapi.domain.BondMovie;
import org.troot.bondmovieapi.repository.BondMovieRepository;

import java.util.List;

@Service
public class BondMovieService {

  private BondMovieRepository bondMovieRepository;

  @Autowired
  void BondMovieService(BondMovieRepository bondMovieRepository) {
    this.bondMovieRepository = bondMovieRepository;
  }

  public List<BondMovie> getAllMovies() {
    return bondMovieRepository.findAll();
  }

  public List<BondMovie> getBondMovie(String title) {
    return bondMovieRepository.findBondMovieByTitle(title);
  }

  public BondMovie createBondMovie(BondMovie bondMovie) {
    return bondMovieRepository.save(bondMovie);
  }

}
