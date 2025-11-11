package com.careermapping.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;          // MongoDB id is String (ObjectId)
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String role;
}
