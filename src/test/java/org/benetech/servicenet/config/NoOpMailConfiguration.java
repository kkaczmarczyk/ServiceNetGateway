package org.benetech.servicenet.config;

import org.benetech.servicenet.service.MailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.mockito.Mockito.mock;

@Configuration
public class NoOpMailConfiguration {
    private final MailService mockMailService;

    public NoOpMailConfiguration() {
        mockMailService = mock(MailService.class);
    }

    @Bean
    public MailService mailService() {
        return mockMailService;
    }
}
