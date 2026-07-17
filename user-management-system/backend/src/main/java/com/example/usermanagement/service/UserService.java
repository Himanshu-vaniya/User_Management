package com.example.usermanagement.service;

import com.example.usermanagement.dto.UpdateUserDTO;
import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.dto.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO createUser(UserRequestDTO requestDTO);
    UserResponseDTO updateUser(Long id, UpdateUserDTO updateDTO);
    void deleteUser(Long id);
}
