package com.smartpetcare.backend.controller;

import com.smartpetcare.backend.entity.User;
import com.smartpetcare.backend.entity.UserSettings;
import com.smartpetcare.backend.repository.UserRepository;
import com.smartpetcare.backend.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    @Autowired
    private UserSettingsRepository settingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get Settings
    @GetMapping("/{userId}")
    public ResponseEntity<UserSettings> getSettings(@PathVariable Long userId) {
        UserSettings settings = settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserSettings newSettings = new UserSettings();
                    newSettings.setUserId(userId);
                    newSettings.setIpWhitelist(Arrays.asList("192.168.1.1", "10.0.0.5")); // Defaults for admin
                    return settingsRepository.save(newSettings);
                });
        return ResponseEntity.ok(settings);
    }

    // Update Settings
    @PutMapping("/{userId}")
    public ResponseEntity<UserSettings> updateSettings(@PathVariable Long userId, @RequestBody UserSettings updatedSettings) {
        UserSettings settings = settingsRepository.findByUserId(userId).orElse(new UserSettings());
        updatedSettings.setId(settings.getId());
        updatedSettings.setUserId(userId);
        return ResponseEntity.ok(settingsRepository.save(updatedSettings));
    }

    // Update Password
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        User user = userOpt.get();
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // Delete Account
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        settingsRepository.findByUserId(userId).ifPresent(settingsRepository::delete);
        return ResponseEntity.ok().build();
    }
}