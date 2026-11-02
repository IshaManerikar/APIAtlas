package com.apiatlas.profile;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public UserProfile getProfile() {
        return profileService.getProfile();
    }

    @PutMapping
    public UserProfile updateProfile(
            @Valid @RequestBody ProfileRequest request) {
        return profileService.updateProfile(request);
    }
}

