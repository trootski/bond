package org.troot.bondmovieapi.service;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import org.troot.bondmovieapi.container.BondMoviePostgreSQLContainer;
import org.troot.bondmovieapi.domain.BondMovie;

import java.util.List;

@Testcontainers
@SpringBootTest
public class BondMovieServiceTest {

    private static final Logger logger = LoggerFactory.getLogger(BondMovieServiceTest.class);

    @Container
    private static final BondMoviePostgreSQLContainer postgres = BondMoviePostgreSQLContainer.getInstance();
//    public GenericContainer postgres = new GenericContainer(DockerImageName.parse("postgres:11.1"));


    @Autowired
    private BondMovieService bondMovieService;

    @Test
    public void testGetAllMoviesWithEmptyList() {
        logger.info("Starting...");
        Slf4jLogConsumer logConsumer = new Slf4jLogConsumer(logger);
        postgres.followOutput(logConsumer);
        postgres.start();
        List<BondMovie> bondMovieList = bondMovieService.getAllMovies();
//        assertEquals(bondMovieList, null);
//        assertEquals(true, false);
    }
}

