package org.troot.bondmovieapi.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.troot.bondmovieapi.controller.BondMovieController;
import org.troot.bondmovieapi.domain.BondMovie;
import org.troot.bondmovieapi.repository.BondMovieRepository;

import java.util.List;

@Service
public class BondMovieService {

  private static final Logger logger = LoggerFactory.getLogger(BondMovieController.class);

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
      List<BondMovie> currentRecord = bondMovieRepository.findBondMovieByTitle(bondMovie.getTitle());
      if (!currentRecord.isEmpty()) {
          BondMovie currentMovie = currentRecord.get(0);
          bondMovie.setId(currentMovie.getId());
      }
      return bondMovieRepository.save(bondMovie);
  }

}
