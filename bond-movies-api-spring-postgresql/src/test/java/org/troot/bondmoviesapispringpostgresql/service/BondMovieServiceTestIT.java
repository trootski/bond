package org.troot.bondmoviesapispringpostgresql.service;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.troot.bondmoviesapispringpostgresql.domain.BondMovie;
import org.troot.bondmoviesapispringpostgresql.repository.BondMovieRepository;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BondMovieServiceTestIT {

    @Mock
    BondMovieRepository bondMovieRepository;

    @Autowired
    BondMovieService bondMovieService;

    @Test
    public void testGetAllMoviesWithEmptyList() {
        List<BondMovie> mockBondMovies = new ArrayList<>();
        when(bondMovieRepository.findAll()).thenReturn(mockBondMovies);

        List<BondMovie> bondMovieList = bondMovieService.getAllMovies();

        assertEquals(bondMovieList, mockBondMovies);
    }
}
