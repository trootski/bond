package org.troot.bondmovieapi.aggregation_strategy;

import org.apache.camel.Exchange;
import org.apache.camel.processor.aggregate.AggregationStrategy;
import org.troot.bondmovieapi.boundary.BondMovieMetadataResponse;
import org.troot.bondmovieapi.boundary.BondMovieRequest;
import org.troot.bondmovieapi.boundary.CreateBondMoviePayload;

public class EnrichMovieDetailsAggregationStrategy implements AggregationStrategy {

    @Override
    public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {
        CreateBondMoviePayload createBondMoviePayload = new CreateBondMoviePayload();

        BondMovieRequest in = oldExchange.getIn().getBody(BondMovieRequest.class);

        BondMovieMetadataResponse enrichBody = newExchange.getIn().getBody(BondMovieMetadataResponse.class);

        createBondMoviePayload.setMovieType("movie");
        createBondMoviePayload.setCatalogOrder(in.getOrder());
        createBondMoviePayload.setReview(in.getReview());
        createBondMoviePayload.setTitle(in.getTitle());
        createBondMoviePayload.setImdbid(enrichBody.getImdbid());
        createBondMoviePayload.setPoster(enrichBody.getPoster());
        createBondMoviePayload.setRuntime(enrichBody.getRuntime());
        createBondMoviePayload.setSynopsis(enrichBody.getSynopsis());
        createBondMoviePayload.setYear(enrichBody.getYear());

        oldExchange.getIn().setBody(createBondMoviePayload);

        if (oldExchange.getPattern().isOutCapable()) {
            oldExchange.getOut().setBody(createBondMoviePayload);
        } else {
            oldExchange.getIn().setBody(createBondMoviePayload);
        }

        return oldExchange;
    }
}
