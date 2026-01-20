package org.troot.bondmovieapi.route;

import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.troot.bondmovieapi.aggregation_strategy.EnrichMovieDetailsAggregationStrategy;
import org.troot.bondmovieapi.boundary.BondMovieMetadataResponse;
import org.troot.bondmovieapi.boundary.BondMovieRequest;

import static org.apache.camel.Exchange.*;
import static org.apache.camel.LoggingLevel.INFO;
import static org.apache.camel.component.http.HttpMethods.GET;
import static org.apache.camel.component.http.HttpMethods.PUT;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@Component
public class BondMovieRouteBuilder extends RouteBuilder {

    Logger log = LoggerFactory.getLogger(BondMovieRouteBuilder.class);

    @Value("${kafka.topic}")
    private String topic;

    @Value("${kafka.brokers}")
    private String brokers;

    @Value("${kafka.groupId}")
    private String groupId;

    @Value("${kafka.partitionAssignor}")
    private String partitionAssignor;

    @Value("${app.bondMoviesApiUrl}")
    private String bondMoviesApiUrl;

    @Value("${app.movieMetadataApiUrl}")
    private String movieMetadataApiUrl;

    public static final String QUEUE_BOND_MOVIE_ROUTE = "direct://queueBondMovieRoute";
    public static final String QUEUE_BOND_MOVIE_LISTENER = "kafka://%s?brokers=%s&groupId=%s&partitionAssignor=%s";

    public static final String PERSIST_AGGREGATE_MOVIE_DETAIL_ROUTE = "direct://persistAggregatedMovieDetails";
    public static final String GET_MOVIE_DETAILS_ROUTE = "direct://getMovieDetails";

    private final EnrichMovieDetailsAggregationStrategy detailsAggregationStrategy = new EnrichMovieDetailsAggregationStrategy();

    @Override
    public void configure() {
        from(QUEUE_BOND_MOVIE_ROUTE)
                .log(INFO, "Adding a Bond Movie to the queue (${body})")
                .marshal()
                .json(JsonLibrary.Jackson)
                .to(String.format("kafka:%s?brokers=%s&groupId=%s", topic, brokers, groupId));

        from(String.format(QUEUE_BOND_MOVIE_LISTENER, topic, brokers, groupId, partitionAssignor))
                .log(INFO, "Message received from Kafka : ${body}")
                .log(INFO, "    on the topic ${headers[kafka.TOPIC]}")
                .log(INFO, "    on the partition ${headers[kafka.PARTITION]}")
                .log(INFO, "    with the offset ${headers[kafka.OFFSET]}")
                .log(INFO, "    with the key ${headers[kafka.KEY]}")
                .unmarshal()
                .json(JsonLibrary.Jackson, BondMovieRequest.class)
                .enrich(GET_MOVIE_DETAILS_ROUTE, detailsAggregationStrategy)
                .to(PERSIST_AGGREGATE_MOVIE_DETAIL_ROUTE)
                .setBody(constant(""));

        from(PERSIST_AGGREGATE_MOVIE_DETAIL_ROUTE)
                .setHeader(HTTP_METHOD, PUT)
                .setHeader(CONTENT_TYPE, constant(APPLICATION_JSON))
                .setHeader(HTTP_PATH, simple("${body.title}"))
                .marshal()
                .json(JsonLibrary.Jackson)
                .to(bondMoviesApiUrl + "/v1/bond-movies/");

        from(GET_MOVIE_DETAILS_ROUTE)
                .setHeader(HTTP_METHOD, GET)
                .setHeader(CONTENT_TYPE, constant(APPLICATION_JSON))
                .setHeader(HTTP_PATH, simple("${body.title}"))
                .to(movieMetadataApiUrl + "/api/v1/movies/")
                .unmarshal()
                .json(JsonLibrary.Jackson, BondMovieMetadataResponse.class);
    }

}
