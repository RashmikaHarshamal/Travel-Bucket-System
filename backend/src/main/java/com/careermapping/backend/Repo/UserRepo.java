package com.careermapping.backend.Repo;

import com.careermapping.backend.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<User, String> {
    User findByUsernameAndPassword(String username, String password);
}
