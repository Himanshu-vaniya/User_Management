package com.example.usermanagement;

import com.example.usermanagement.entity.User;
import com.example.usermanagement.enums.Role;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            userRepository.saveAll(List.of(
                    createUser("John",     "Smith",    "john.smith@example.com",     Role.ADMIN),
                    createUser("Alice",    "Johnson",  "alice.johnson@example.com",  Role.USER),
                    createUser("David",    "Williams", "david.williams@example.com", Role.USER),
                    createUser("Emma",     "Brown",    "emma.brown@example.com",     Role.USER),
                    createUser("Robert",   "Jones",    "robert.jones@example.com",   Role.USER),
                    createUser("Sophia",   "Garcia",   "sophia.garcia@example.com",  Role.USER),
                    createUser("James",    "Miller",   "james.miller@example.com",   Role.USER),
                    createUser("Olivia",   "Davis",    "olivia.davis@example.com",   Role.USER),
                    createUser("Michael",  "Wilson",   "michael.wilson@example.com", Role.ADMIN),
                    createUser("Isabella", "Moore",    "isabella.moore@example.com", Role.USER)
            ));
        };
    }

    private User createUser(String firstName, String lastName, String email, Role role) {
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setRole(role);
        user.setActive(true);
        return user;
    }
}
