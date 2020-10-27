package org.troot.bondmovieapi.controller;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = BondMovieController.class)
public class BondMovieControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllMovies_0_Movies() throws Exception{
          this.mockMvc.perform(get("/v1/bond-movies"))
            .andDo(print())
            .andExpect(status().isOk());
    }

}
