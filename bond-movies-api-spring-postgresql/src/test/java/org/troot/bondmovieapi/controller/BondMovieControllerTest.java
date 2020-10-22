package org.troot.bondmovieapi.controller;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.troot.bondmovieapi.service.BondMovieService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BondMovieControllerTest {

    @Mock
    BondMovieService bondMovieService;

    @InjectMocks
    BondMovieController bondMovieController;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllMovies_0_Movies() throws Exception{
          this.mockMvc.perform(get("/v1/bond-movies"))
            .andDo(print())
            .andExpect(status().isOk());
    }

}
