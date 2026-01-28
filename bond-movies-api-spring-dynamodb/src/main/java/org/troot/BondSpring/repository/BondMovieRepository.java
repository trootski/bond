package org.troot.BondSpring.repository;

import org.springframework.stereotype.Repository;
import org.troot.BondSpring.entity.BondMovie;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbIndex;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.List;
import java.util.Optional;

@Repository
public class BondMovieRepository {

  private final DynamoDbTable<BondMovie> table;
  private final DynamoDbIndex<BondMovie> movieTypeIndex;

  public BondMovieRepository(DynamoDbEnhancedClient enhancedClient) {
    this.table = enhancedClient.table("BondMovies", TableSchema.fromBean(BondMovie.class));
    this.movieTypeIndex = table.index("SortByOrder");
  }

  public List<BondMovie> findByMovieType(String movieType) {
    QueryConditional queryConditional = QueryConditional.keyEqualTo(
        Key.builder().partitionValue(movieType).build());

    return movieTypeIndex.query(queryConditional)
        .stream()
        .flatMap(page -> page.items().stream())
        .toList();
  }

  public Optional<BondMovie> findByTitle(String title) {
    Key key = Key.builder().partitionValue(title).build();
    return Optional.ofNullable(table.getItem(key));
  }

  public BondMovie save(BondMovie bondMovie) {
    table.putItem(bondMovie);
    return bondMovie;
  }
}
