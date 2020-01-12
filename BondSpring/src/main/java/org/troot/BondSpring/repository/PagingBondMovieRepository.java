package org.troot.BondSpring.repository;

import org.socialsignin.spring.data.dynamodb.repository.EnableScan;
import org.socialsignin.spring.data.dynamodb.repository.EnableScanCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.troot.BondSpring.domain.BondMovie;

import java.util.List;

public interface PagingBondMovieRepository extends PagingAndSortingRepository<BondMovie, String> {
  List<BondMovie> findByMovieTitle(Pageable pageable);

  @EnableScan
  @EnableScanCount
  Page<BondMovie> findAll(Pageable pageable);
}

