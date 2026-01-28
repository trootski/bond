package org.troot.BondSpring.service;

import org.springframework.stereotype.Service;
import org.troot.BondSpring.entity.BondMovie;
import org.troot.BondSpring.repository.BondMovieRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BondMovieService {

  private final BondMovieRepository bondMovieRepository;

  public BondMovieService(BondMovieRepository bondMovieRepository) {
    this.bondMovieRepository = bondMovieRepository;
  }

  public List<BondMovie> getAllMovies() {
    return bondMovieRepository.findByMovieType("movie");
  }

  public Optional<BondMovie> getBondMovie(String title) {
    return bondMovieRepository.findByTitle(title);
  }

  public BondMovie createBondMovie(BondMovie bondMovie) {
    return bondMovieRepository.save(bondMovie);
  }
}
