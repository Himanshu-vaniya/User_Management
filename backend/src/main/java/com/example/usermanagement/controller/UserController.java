package com.example.usermanagement.controller;

import com.example.usermanagement.dto.ApiResponse;
import com.example.usermanagement.dto.UpdateUserDTO;
import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.dto.UserResponseDTO;
import com.example.usermanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        ApiResponse response = new ApiResponse(true, "Users retrieved successfully", users);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Long id) {
        UserResponseDTO user = userService.getUserById(id);
        ApiResponse response = new ApiResponse(true, "User retrieved successfully", user);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createUser(@Valid @RequestBody UserRequestDTO requestDTO) {
        UserResponseDTO user = userService.createUser(requestDTO);
        ApiResponse response = new ApiResponse(true, "User created successfully", user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserDTO updateDTO) {
        UserResponseDTO user = userService.updateUser(id, updateDTO);
        ApiResponse response = new ApiResponse(true, "User updated successfully", user);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        ApiResponse response = new ApiResponse(true, "User deleted successfully");
        return ResponseEntity.ok(response);
    }
}
