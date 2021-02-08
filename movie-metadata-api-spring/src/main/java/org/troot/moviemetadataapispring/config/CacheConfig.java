package org.troot.moviemetadataapispring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Collections;
import java.util.Set;

public class CacheConfig {

    @Value("${spring.redis.host}")
    private String redisHost;

    @Value("${spring.redis.port}")
    private Integer redisPort;

    @Bean
    JedisConnectionFactory jedisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(redisHost, redisPort);
        JedisClientConfiguration.JedisClientConfigurationBuilder jedisClientConfiguration = JedisClientConfiguration.builder();
        JedisConnectionFactory factory = new JedisConnectionFactory(redisStandaloneConfiguration, jedisClientConfiguration.build());
        return factory;
    }

    @Bean
    RedisTemplate<Object, Object> redisTemplate() {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate<Object, Object>();
        redisTemplate.setConnectionFactory(jedisConnectionFactory());
        return redisTemplate;
    }

    @Bean
    RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig().disableCachingNullValues();
    }

    @Bean
    public RedisCacheManager cacheManager() {
        Set<String> cacheNames = Collections.singleton("MovieMetadataCache");
        RedisCacheManager cacheManager = RedisCacheManager.builder(jedisConnectionFactory())
                .cacheDefaults(cacheConfiguration())
                .transactionAware()
                .initialCacheNames(cacheNames)
                .build();
        return cacheManager;
    }

}
