package com.example.usermanagement.service;

import com.example.usermanagement.dto.UpdateUserDTO;
import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.dto.UserResponseDTO;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.exception.DuplicateResourceException;
import com.example.usermanagement.exception.ResourceNotFoundException;
import com.example.usermanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = findUserById(id);
        return new UserResponseDTO(user);
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO requestDTO) {
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new DuplicateResourceException("User with email " + requestDTO.getEmail() + " already exists");
        }

        User user = new User();
        user.setFirstName(requestDTO.getFirstName());
        user.setLastName(requestDTO.getLastName());
        user.setEmail(requestDTO.getEmail());
        user.setRole(requestDTO.getRole());
        user.setActive(true);

        User savedUser = userRepository.save(user);
        return new UserResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserDTO updateDTO) {
        User user = findUserById(id);

        if (updateDTO.getEmail() != null && !updateDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(updateDTO.getEmail(), id)) {
                throw new DuplicateResourceException("User with email " + updateDTO.getEmail() + " already exists");
            }
            user.setEmail(updateDTO.getEmail());
        }

        if (updateDTO.getFirstName() != null) {
            user.setFirstName(updateDTO.getFirstName());
        }
        if (updateDTO.getLastName() != null) {
            user.setLastName(updateDTO.getLastName());
        }
        if (updateDTO.getRole() != null) {
            user.setRole(updateDTO.getRole());
        }
        if (updateDTO.getActive() != null) {
            user.setActive(updateDTO.getActive());
        }

        User updatedUser = userRepository.save(user);
        return new UserResponseDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
