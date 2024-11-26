package com.example.gamix;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;



public class Register extends AppCompatActivity {

    private EditText passwordInput;
    private ImageView checkUppercase, checkNumber, checkSpecial, checkLength;
    private Button btnLogin;
    private TextView txtLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

         btnLogin = findViewById(R.id.button);
         txtLogin = findViewById(R.id.textView8);
        passwordInput = findViewById(R.id.passwordInput);
        checkUppercase = findViewById(R.id.imageView10);
        checkNumber = findViewById(R.id.imageView11);
        checkSpecial = findViewById(R.id.imageView12);
        checkLength = findViewById(R.id.imageView13);

        passwordInput.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) { }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) { }

            @Override
            public void afterTextChanged(Editable s) {
                validatePassword(s.toString());
            }
        });

        btnLogin.setOnClickListener(v -> {
            Intent intent = new Intent(Register.this, Login.class);
            startActivity(intent);
        });

        txtLogin.setOnClickListener(v -> {
            Intent intent = new Intent(Register.this, Login.class);
            startActivity(intent);
        });
    }

    private void validatePassword(String password) {

        boolean hasUppercase = password.matches(".*[A-Z].*");
        updateIcon(checkUppercase, hasUppercase);


        boolean hasNumber = password.matches(".*[0-9].*");
        updateIcon(checkNumber, hasNumber);


        boolean hasSpecial = password.matches(".*[!@#$%^&*(),.?\":{}|<>].*");
        updateIcon(checkSpecial, hasSpecial);


        boolean hasMinLength = password.length() >= 8;
        updateIcon(checkLength, hasMinLength);
    }

    private void updateIcon(ImageView icon, boolean isValid) {
        if (isValid) {
            icon.setImageResource(R.drawable.check);
        } else {
            icon.setImageResource(R.drawable.x);
        }
    }
}