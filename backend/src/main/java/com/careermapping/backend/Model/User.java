package com.careermapping.backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")  // MongoDB collection
public class User {
    @Id
    private String id;   // MongoDB ObjectId → String in Java
    private String username;
    private String password;
    private String email;
    private String phoneNumber;
    private String role;

    private List<String> skills; // store skills as list of string names or IDs
}
