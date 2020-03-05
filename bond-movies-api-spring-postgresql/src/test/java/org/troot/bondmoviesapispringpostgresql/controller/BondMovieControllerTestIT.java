package org.troot.bondmoviesapispringpostgresql.controller;

import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.TransactionDbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import com.github.springtestdbunit.annotation.DatabaseTearDown;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestExecutionListeners({
  DependencyInjectionTestExecutionListener.class,
  DirtiesContextTestExecutionListener.class,
  TransactionalTestExecutionListener.class,
  DbUnitTestExecutionListener.class
})
@DatabaseTearDown(value = "classpath:database_tear_down.xml", type = DatabaseOperation.DELETE_ALL)
public class BondMovieControllerTestIT {

    @Autowired
    BondMovieController bondMovieController;

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllMovies_0_Movies() throws Exception{
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/bond-movies"))
          .andExpect(status().isOk())
          .andExpect(jsonPath("$", hasSize(0)))
          .andReturn();
    }

    @Test
    @DatabaseSetup("classpath:5-movies.xml")
    public void testGetMoviesByTitleFound() throws Exception{
      MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/bond-movies/The Mask"))
        .andExpect(status().isOk())
        .andReturn();
    }

    @Test
    public void testGetMoviesByTitleNotFound() throws Exception{
      MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/bond-movies/Dr. No"))
        .andExpect(status().isNotFound())
        .andReturn();
    }

    @Test
    @DatabaseSetup("classpath:5-movies.xml")
    public void testGetAllMovies_5_Movies() throws Exception{
      MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/v1/bond-movies"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(5)))
        .andReturn();
    }
}
