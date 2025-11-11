package com.careermapping.backend.Controller;

import com.careermapping.backend.DTO.UserDTO;
import com.careermapping.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "api/v1")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/getusers")
    public List<UserDTO> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/user/{userId}")
    public UserDTO getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @PostMapping("/adduser")
    public UserDTO addUser(@RequestBody UserDTO userDTO) {
        return userService.addUser(userDTO);
    }

    @PutMapping("/updateuser")
    public UserDTO updateUser(@RequestBody UserDTO userDTO) {
        return userService.updateUser(userDTO);
    }

    @DeleteMapping("/deleteuser")
    public String deleteUser(@RequestBody UserDTO userDTO) {
        return userService.deleteUser(userDTO);
    }

    @DeleteMapping("/deleteuser/{userId}")
    public String deleteUser(@PathVariable String userId) {
        return userService.deleteUser(userId);
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody UserDTO userDTO) {
        return userService.login(userDTO.getUsername(), userDTO.getPassword());
    }
}
