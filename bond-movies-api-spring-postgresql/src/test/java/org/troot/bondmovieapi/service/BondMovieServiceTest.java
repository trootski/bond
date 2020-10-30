package org.troot.bondmovieapi.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.troot.bondmovieapi.domain.BondMovie;
import org.troot.bondmovieapi.repository.BondMovieRepository;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
public class BondMovieServiceTest {

    @Mock
    BondMovieRepository bondMovieRepository;

    @InjectMocks
    BondMovieService bondMovieService;

    @Test
    public void testGetAllMoviesWithEmptyList() {
        List<BondMovie> mockBondMovies = new ArrayList<>();
        when(bondMovieRepository.findAll()).thenReturn(mockBondMovies);

        List<BondMovie> bondMovieList = bondMovieService.getAllMovies();

        assertEquals(bondMovieList, mockBondMovies);
    }
}
