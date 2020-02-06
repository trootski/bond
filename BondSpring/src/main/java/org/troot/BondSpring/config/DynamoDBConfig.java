package org.troot.BondSpring.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;
import com.amazonaws.services.kms.AWSKMSClientBuilder;
import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;

@Configuration
@EnableDynamoDBRepositories(basePackages = "org.troot.BondSpring")
public class DynamoDBConfig {

  @Value("${amazon.dynamodb.endpoint}")
  private String amazonDynamoDBEndpoint;

  @Value("${amazon.aws.accessKey}")
  public String awsAccessKey;

  @Value("${amazon.aws.secretKey}")
  public String awsSecretKey;

  @Bean
  public AWSCredentialsProvider awsCredentialsProvider() {
    return new AWSStaticCredentialsProvider(amazonAWSCredentials());
  }

  @Bean
  public AWSCredentials amazonAWSCredentials() {
    return new BasicAWSCredentials(awsAccessKey, awsSecretKey);
  }

  @Bean
  public EndpointConfiguration amazonEndpointConfiguration() {
    return new AWSKMSClientBuilder.EndpointConfiguration("http://localhost:9000", Region.getRegion(Regions.DEFAULT_REGION).getName());
  }

  @Bean
  @Primary
  public DynamoDBMapperConfig dynamoDBMapperConfig() {
    return DynamoDBMapperConfig.DEFAULT;
  }

  @Bean
  @Primary
  public DynamoDBMapper dynamoDBMapper (AmazonDynamoDB amazonDynamoDB, DynamoDBMapperConfig config) {
    return new DynamoDBMapper(amazonDynamoDB, config);
  }

  @Bean
  public AmazonDynamoDB amazonDynamoDB() {
    return AmazonDynamoDBClientBuilder
      .standard()
      .withCredentials(awsCredentialsProvider())
      .withEndpointConfiguration(
        new AwsClientBuilder
          .EndpointConfiguration(amazonDynamoDBEndpoint, Regions.EU_WEST_1.getName()))
      .build();
  }

}
