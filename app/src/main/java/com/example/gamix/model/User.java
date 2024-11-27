package com.example.gamix.model;


import java.io.Serializable;

public class User  implements Serializable {

    private String nome, password, email ;

    public User(String nome, String email, String password) {
        this.nome = nome;
        this.email = email;
        this.password = password;

    }

    public User(String nome, String password) {
        this.nome = nome;
        this.password = password;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
