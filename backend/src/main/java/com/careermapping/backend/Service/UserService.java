package com.careermapping.backend.Service;

import com.careermapping.backend.DTO.UserDTO;
import com.careermapping.backend.Model.User;
import com.careermapping.backend.Repo.UserRepo;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    public List<UserDTO> getAllUsers() {
        List<User> userList = userRepo.findAll();
        return modelMapper.map(userList, new TypeToken<List<UserDTO>>() {}.getType());
    }

    public UserDTO addUser(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        userRepo.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    public UserDTO updateUser(UserDTO userDTO) {
        User user = modelMapper.map(userDTO, User.class);
        userRepo.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    public String deleteUser(UserDTO userDTO) {
        userRepo.delete(modelMapper.map(userDTO, User.class));
        return "User deleted";
    }

    public String deleteUser(String userId) {
        userRepo.deleteById(userId);
        return "User deleted";
    }

    public UserDTO getUserById(String userId) {
        return userRepo.findById(userId)
                .map(user -> modelMapper.map(user, UserDTO.class))
                .orElse(null);
    }

    public UserDTO login(String username, String password) {
        User user = userRepo.findByUsernameAndPassword(username, password);
        if (user != null) {
            return modelMapper.map(user, UserDTO.class);
        }
        return null;
    }
}
