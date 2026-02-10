package org.troot.bondmovieapi.config;

import org.apache.camel.CamelContext;
import org.apache.camel.FluentProducerTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CamelConfig {

    @Bean
    public FluentProducerTemplate fluentProducerTemplate(CamelContext camelContext) {
        return camelContext.createFluentProducerTemplate();
    }
}
