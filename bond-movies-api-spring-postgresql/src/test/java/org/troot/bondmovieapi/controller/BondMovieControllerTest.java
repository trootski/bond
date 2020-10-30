package org.troot.bondmovieapi.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.troot.bondmovieapi.common.BondMovieBaseTest;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.isA;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Sql(scripts = "/clear-down.sql", executionPhase = Sql.ExecutionPhase.AFTER_TEST_METHOD)
public class BondMovieControllerTest extends BondMovieBaseTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllMovies() throws Exception{
          this.mockMvc.perform(get("/v1/bond-movies"))
            .andDo(print())
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(1)))
            .andExpect(jsonPath("$[0].id", isA(Integer.class)))
            .andExpect(jsonPath("$[0].title").value("My Test Title"))
            .andExpect(jsonPath("$[0].runtime").value("test_runtime"))
            .andExpect(jsonPath("$[0].review").value("test_review"))
            .andExpect(jsonPath("$[0].imdbid").value("test_imdbid"))
            .andExpect(jsonPath("$[0].synopsis").value("test_synopsis"))
            .andExpect(jsonPath("$[0].type").value("movie"))
            .andExpect(jsonPath("$[0].year").value("1963"))
            .andExpect(jsonPath("$[0].poster").value("test_poster"))
            .andExpect(jsonPath("$[0].catalog_order").value(1));
    }

    @Test
    public void testGetTestMovie() throws Exception{
        this.mockMvc.perform(get("/v1/bond-movies/My Test Title"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    public void testPutBondMovie() throws Exception{
        this.mockMvc.perform(put("/v1/bond-movies/test_123")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{\n" +
                            "  \"title\": \"test_123\",\n" +
                            "  \"runtime\": \"110 min\",\n" +
                            "  \"review\": null,\n" +
                            "  \"imdbid\": \"tt0055928\",\n" +
                            "  \"synopsis\": null,\n" +
                            "  \"type\": \"movie\",\n" +
                            "  \"year\": \"1962\",\n" +
                            "  \"poster\": \"https://m.media-amazon.com/images/M/MV5BMWRkZTI4NzktYjA4Yi00ZjE0LTgzOWQtYzJlMTkyOTU1ODRmXkEyXkFqcGdeQXVyNDY2MTk1ODk@._V1_SX300.jpg\",\n" +
                            "  \"catalog_order\": null\n" +
                            "}"))
                .andDo(print())
                .andExpect(status().isCreated());
    }

}
