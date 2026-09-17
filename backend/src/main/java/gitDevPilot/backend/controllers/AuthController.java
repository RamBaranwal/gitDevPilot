package gitDevPilot.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import gitDevPilot.backend.Security.CurrentUser;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final CurrentUser currentUser;

    @GetMapping("/login-url")
    public Map<String, String> loginUrl() {
        return Map.of("url", "/oauth2/authorized/github");
    }
 
    @GetMapping("/me")
    public String getMethodName(@RequestParam String param) {
        return ResponseEntity.ok(new UserResponse(
        user.getId(),
        user.getGithubId(),
        user.getGithubUsername(),
        user.getDisplayName(),
        user.getAvatarUrl()
));
    }
    
}
