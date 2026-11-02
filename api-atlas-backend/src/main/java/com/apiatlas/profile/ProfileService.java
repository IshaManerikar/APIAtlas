package com.apiatlas.profile;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private static final Long PROFILE_ID = 1L;

    private final UserProfileRepository repository;

    public ProfileService(UserProfileRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public UserProfile getProfile() {
        return repository.findById(PROFILE_ID)
                .orElseGet(() -> {
                    UserProfile profile = new UserProfile();
                    profile.setId(PROFILE_ID);
                    profile.setFullName("APIAtlas Developer");
                    profile.setEmail("developer@example.com");
                    profile.setJobTitle("Backend Developer");
                    profile.setDepartment("Engineering");
                    profile.setPhoneNumber("");
                    profile.setProfileImageUrl("");

                    return repository.save(profile);
                });
    }

    @Transactional
    public UserProfile updateProfile(ProfileRequest request) {
        UserProfile profile = getProfile();

        profile.setFullName(request.fullName().trim());
        profile.setEmail(request.email().trim());
        profile.setJobTitle(request.jobTitle());
        profile.setDepartment(request.department());
        profile.setPhoneNumber(request.phoneNumber());
        profile.setProfileImageUrl(request.profileImageUrl());

        return repository.save(profile);
    }
}
