package org.troot.bondmoviesapispringpostgresql.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class BondMovieControllerTestIT {

    @Autowired
    BondMovieController bondMovieController;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllMovies() throws Exception{
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/bond-movies"))
                .andExpect(status().isOk())
                .andReturn();
        String resultDOW = result.getResponse().getContentAsString();
        assertEquals(resultDOW, "[]");
    }
}
