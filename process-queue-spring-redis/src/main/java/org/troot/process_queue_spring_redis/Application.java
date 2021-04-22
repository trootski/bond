package org.troot.process_queue_spring_redis;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

@SpringBootApplication
public class Application {

  private static final Logger logger = LoggerFactory.getLogger(Receiver.class);

  public static void main(String[] args) throws InterruptedException{
        ApplicationContext context =  SpringApplication.run(Application.class, args);
        StringRedisTemplate template = context.getBean(StringRedisTemplate.class);
        Receiver receiver = context.getBean(Receiver.class);

        int counter = 0;
        while (counter++ < 1) {
            logger.info("Sending message");
            template.convertAndSend("BondMovieReview", "THis is a message");
            Thread.sleep(500L);
        }
//        System.exit(0);
    }

    @Bean
    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory, MessageListenerAdapter listenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listenerAdapter, new PatternTopic("BondMovieReview"));
        return container;
    }

    @Bean
    MessageListenerAdapter listenerAdapter(Receiver receiver) {
        return new MessageListenerAdapter(receiver, "receiveMessage");
    }

    @Bean
    Receiver receiver() {
       return new Receiver();
    }

    @Bean
    StringRedisTemplate template(RedisConnectionFactory connectionFactory) {
        return new StringRedisTemplate(connectionFactory);
    }
}
