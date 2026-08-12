package com.mis.mis_backend.auth.dto;

import com.mis.mis_backend.auth.Role;

public class AuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private String displayName;
    private Role role;
    private Long studentId;
    private Integer facultyId;

    public AuthResponse(String accessToken, Long userId, String email, String displayName, Role role,
                        Long studentId, Integer facultyId) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.email = email;
        this.displayName = displayName;
        this.role = role;
        this.studentId = studentId;
        this.facultyId = facultyId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Role getRole() {
        return role;
    }

    public Long getStudentId() {
        return studentId;
    }

    public Integer getFacultyId() {
        return facultyId;
    }
}
