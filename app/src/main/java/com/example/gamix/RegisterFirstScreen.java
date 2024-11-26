package com.example.gamix;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class RegisterFirstScreen extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_first_screen);
        Button btnRegistro = findViewById(R.id.button2);
        TextView txtLogin = findViewById(R.id.textView12);

        btnRegistro.setOnClickListener(v  -> {
            Intent intent = new Intent(RegisterFirstScreen.this, Register.class);
            startActivity(intent);
        });

        txtLogin.setOnClickListener(v -> {
            Intent intent = new Intent(RegisterFirstScreen.this, Login.class);
            startActivity(intent);
        });

    }
}