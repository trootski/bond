package org.troot.BondSpring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.net.URI;

@Configuration
public class DynamoDBConfig {

  @Value("${amazon.dynamodb.endpoint}")
  private String amazonDynamoDBEndpoint;

  @Value("${amazon.aws.accessKey}")
  private String awsAccessKey;

  @Value("${amazon.aws.secretKey}")
  private String awsSecretKey;

  @Bean
  public DynamoDbClient dynamoDbClient() {
    return DynamoDbClient.builder()
        .endpointOverride(URI.create(amazonDynamoDBEndpoint))
        .region(Region.EU_WEST_1)
        .credentialsProvider(StaticCredentialsProvider.create(
            AwsBasicCredentials.create(awsAccessKey, awsSecretKey)))
        .build();
  }

  @Bean
  public DynamoDbEnhancedClient dynamoDbEnhancedClient(DynamoDbClient dynamoDbClient) {
    return DynamoDbEnhancedClient.builder()
        .dynamoDbClient(dynamoDbClient)
        .build();
  }
}
