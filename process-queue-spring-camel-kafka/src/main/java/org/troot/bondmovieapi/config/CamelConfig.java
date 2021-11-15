package org.troot.bondmovieapi.config;

import org.apache.camel.CamelContext;
import org.apache.camel.spring.boot.CamelContextConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.troot.bondmovieapi.route.BondMovieRouteBuilder;

@Configuration
public class CamelConfig {

    @Autowired
    private BondMovieRouteBuilder bondMovieRouteBuilder;

    @Bean
    CamelContextConfiguration contextConfiguration() {
        return new CamelContextConfiguration() {
            @Override
            public void beforeApplicationStart(CamelContext context) {
                try {
                    context.addRoutes(bondMovieRouteBuilder);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            @Override
            public void afterApplicationStart(CamelContext camelContext) {

            }
        };
    }
}
