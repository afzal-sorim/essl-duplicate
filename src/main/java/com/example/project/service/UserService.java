package com.example.project.service;

import com.example.project.model.User;
import com.example.project.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public User getUser(String email, String password) {
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isPresent()) {
            if (!userOptional.get().getPassword().equals(password)) {
                throw new IllegalStateException("password is not correct for email: " + email);
            }
        } else {
            throw new IllegalStateException("email: " + email + " is not present");
        }
        return userOptional.get();
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isEmpty()) {
            throw new IllegalStateException("user with email: " + email + " doesn't exist");
        }
        return userOptional.get();
    }

    public void addNewUser(User user) {
        Optional<User> userOptional = userRepository.findUserByEmail(user.getEmail());
        if (userOptional.isPresent()) {
            throw new IllegalStateException("email already taken");
        }
        userRepository.save(user);
    }

    public void updateUser(String email, User updatedUser) {
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isEmpty()) {
            throw new IllegalStateException("user with email: " + email + " doesn't exist");
        }
        User existing = userOptional.get();
        if (updatedUser.getFirstname() != null) existing.setFirstname(updatedUser.getFirstname());
        if (updatedUser.getLastname() != null) existing.setLastname(updatedUser.getLastname());
        if (updatedUser.getDob() != null) existing.setDob(updatedUser.getDob());
        if (updatedUser.getPhone() != null) existing.setPhone(updatedUser.getPhone());
        if (updatedUser.getAddress() != null) existing.setAddress(updatedUser.getAddress());
        userRepository.save(existing);
    }

    public void deleteUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findUserByEmail(email);
        if (userOptional.isEmpty()) {
            throw new IllegalStateException("user with email: " + email + " doesn't exist");
        }
        userRepository.deleteById(userOptional.get().getId());
    }
}
