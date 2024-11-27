package com.example.gamix;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.gamix.model.User;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.entity.ContentType;
import cz.msebera.android.httpclient.entity.StringEntity;

public class Login extends AppCompatActivity {

        private EditText usernameInput, passwordInput;
        private Button btnLogin;
        private AsyncHttpClient client = new AsyncHttpClient();
        private TextView textRegister;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.login_screen);

            usernameInput = findViewById(R.id.editTextUsername);
            passwordInput = findViewById(R.id.editTextPassword);
            btnLogin = findViewById(R.id.button3);
            textRegister = findViewById(R.id.textView15);

            textRegister.setOnClickListener(v -> {
                Intent intent =  new Intent(Login.this, Register.class);
                startActivity(intent);
            });
            btnLogin.setOnClickListener(v -> {
                if (validateLoginForm()) {
                    String username = usernameInput.getText().toString();
                    String password = passwordInput.getText().toString();
                    User user = new User(username, password);

                    login(user);
                }
            });
        }

        private boolean validateLoginForm() {
            if (usernameInput.getText().toString().isEmpty()) {
                Toast.makeText(this, "Por favor, insira seu nome.", Toast.LENGTH_SHORT).show();
                return false;
            }
            if (passwordInput.getText().toString().isEmpty()) {
                Toast.makeText(this, "Por favor, insira sua senha.", Toast.LENGTH_SHORT).show();
                return false;
            }
            return true;
        }

        public void login(User obj) {
            String url = "https://preview-gamix-backend.vercel.app/api/v1/auth/signin";

            JSONObject parametros = new JSONObject();
            try {
                parametros.put("username", obj.getNome());
                parametros.put("password", obj.getPassword());
            } catch (JSONException e) {
                e.printStackTrace();
                Toast.makeText(this, "Erro ao criar JSON: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                return;
            }

            StringEntity entity = new StringEntity(parametros.toString(), ContentType.APPLICATION_JSON);

            client.post(this, url, entity, "application/json", new AsyncHttpResponseHandler() {
                @Override
                public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                    if (statusCode == 200) {

                        String token = null;
                        for (Header header : headers) {
                            if (header.getName().equalsIgnoreCase("Authorization")) {
                                token = header.getValue();
                                break;
                            }
                        }

                        if (token != null) {

                            getSharedPreferences("AppPrefs", MODE_PRIVATE)
                                    .edit()
                                    .putString("accessToken", token)
                                    .apply();


//                            Intent intent = new Intent(Login.this, FeedScreen.class);
//                            intent.putExtra("accessToken", token); // Passando o token
//                            startActivity(intent);
                            finish();
                        } else {
                            Toast.makeText(Login.this, "Token não recebido!", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(Login.this, "Erro no login: " + statusCode, Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                    Toast.makeText(Login.this, "Erro ao conectar: " + error.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

