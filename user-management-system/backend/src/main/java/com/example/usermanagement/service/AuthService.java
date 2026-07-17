package com.example.usermanagement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Value("${app.auth.username}")
    private String configuredUsername;

    @Value("${app.auth.password}")
    private String configuredPassword;

    public String login(String username, String password) {
        try {
            if (username != null && password != null 
                && username.trim().equals(configuredUsername) 
                && password.trim().equals(configuredPassword)) {
                return UUID.randomUUID().toString();
            }
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
        }
        return null;
    }
}
