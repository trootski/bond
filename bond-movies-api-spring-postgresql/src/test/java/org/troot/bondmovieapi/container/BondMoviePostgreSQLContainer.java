package org.troot.bondmovieapi.container;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.PostgreSQLContainer;

public class BondMoviePostgreSQLContainer extends PostgreSQLContainer<BondMoviePostgreSQLContainer> {


    private static final Logger logger = LoggerFactory.getLogger(BondMoviePostgreSQLContainer.class);

    private static final String IMAGE_VERSION = "postgres:11.1";
    public static final Integer POSTGRESQL_PORT = 5433;

    private static BondMoviePostgreSQLContainer container;

    private BondMoviePostgreSQLContainer() {
        super(IMAGE_VERSION);
    }

    public static BondMoviePostgreSQLContainer getInstance() {
        if (container == null) {
            container = new BondMoviePostgreSQLContainer();
        }
        return container;
    }

    @Override
    public void start() {
        super.start();
        logger.info("----------------- " + container.getJdbcUrl());
        System.setProperty("DB_URL", container.getJdbcUrl());
        System.setProperty("DB_USERNAME", container.getUsername());
        System.setProperty("DB_PASSWORD", container.getPassword());
    }

    @Override
    public void stop() {
    }
}
