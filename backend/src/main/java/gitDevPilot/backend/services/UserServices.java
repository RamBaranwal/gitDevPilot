package gitDevPilot.backend.services;

import java.util.Map;
import java.util.UUID;

import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import gitDevPilot.backend.entity.User;
import gitDevPilot.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServices {

    private final UserRepository userRepository;
    private final TextEncryptor textEncryptor;

    @Transactional(readOnly = true)
    public User requiredId(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not Found"));
    }

    public String decryptAccessToken(User user) {
        return textEncryptor.decrypt(user.getAccessToken());
    }

    @Transactional
    public User upsertFromGitHub(
            Map<String, Object> attributes,
            String accessToken,
            String scopes) {

        Long githubId = toLong(attributes.get("id"));

        String githubUsername =
                String.valueOf(attributes.get("login"));

        String displayName =
                attributes.get("name") != null
                        ? String.valueOf(attributes.get("name"))
                        : githubUsername;

        String avatarUrl =
                attributes.get("avatar_url") != null
                        ? String.valueOf(attributes.get("avatar_url"))
                        : null;

        String encryptedToken =
                textEncryptor.encrypt(accessToken);

        User user = userRepository.findByGithubId(githubId)
                .orElseGet(User::new);

        user.setGithubId(githubId);
        user.setGithubUsername(githubUsername);
        user.setDisplayName(displayName);
        user.setAvatarUrl(avatarUrl);
        user.setAccessToken(encryptedToken);
        user.setTokenScopes(scopes);

        return userRepository.save(user);
    }

    private static Long toLong(Object value) {

        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.parseLong(String.valueOf(value));
    }
}