package org.troot.BondSpring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.troot.BondSpring.domain.BondMovie;
import org.troot.BondSpring.repository.BondMovieRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BondMovieService {
  @Autowired
  BondMovieRepository bondMovieRepository;

  public List<BondMovie> getAllMovies() {
    return bondMovieRepository.findAll();
  }

  public List<BondMovie> getBondMovie(String title) {
    return bondMovieRepository.findByTitle(title);
  }

  public BondMovie createBondMovie(BondMovie bondMovie) { return bondMovieRepository.save(bondMovie); }
}
