package com.example.gamix;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TableLayout;
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

public class Register extends AppCompatActivity {

    private EditText usernameInput, emailInput, passwordInput, confirmPasswordInput;
    private ImageView checkUppercase, checkNumber, checkSpecial, checkLength;
    private Button btnRegister;
    private TextView txtLogin;
    private CheckBox termsCheckbox;
    private TableLayout validationTable;
    private AsyncHttpClient client = new AsyncHttpClient();
    private ArrayList<User> usersList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

         txtLogin = findViewById(R.id.textView8);
        // Ligação dos componentes do layout
        usernameInput = findViewById(R.id.usernameInput);
        emailInput = findViewById(R.id.emailInput);
        passwordInput = findViewById(R.id.passwordInput);
        confirmPasswordInput = findViewById(R.id.confirmPasswordInput);
        checkUppercase = findViewById(R.id.imageView10);
        checkNumber = findViewById(R.id.imageView11);
        checkSpecial = findViewById(R.id.imageView12);
        checkLength = findViewById(R.id.imageView13);
        validationTable = findViewById(R.id.validationTable);
        btnRegister = findViewById(R.id.registerButton);
        txtLogin = findViewById(R.id.textView8);
        termsCheckbox = findViewById(R.id.checkBox);

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

        btnRegister.setOnClickListener(v -> {
            if (validateForm()) {
                User user = new User(
                        usernameInput.getText().toString(),
                        emailInput.getText().toString(),
                        passwordInput.getText().toString()
                );
                usersList.add(user);

                cadastrarUsuario(user);
                Intent intent = new Intent(Register.this, Login.class);
                intent.putExtra("usersList", usersList);
                startActivity(intent);
            }
        });

        txtLogin.setOnClickListener(v -> {
            Intent intent = new Intent(Register.this, Login.class);
            startActivity(intent);
        });
    }

    private void validatePassword(String password) {
        boolean hasUppercase = password.matches(".*[A-Z].*");
        boolean hasNumber = password.matches(".*[0-9].*");
        boolean hasSpecial = password.matches(".*[!@#$%^&*(),.?\":{}|<>].*");
        boolean hasMinLength = password.length() >= 8;

        updateIcon(checkUppercase, hasUppercase);
        updateIcon(checkNumber, hasNumber);
        updateIcon(checkSpecial, hasSpecial);
        updateIcon(checkLength, hasMinLength);
    }

    private void updateIcon(ImageView icon, boolean isValid) {
        if (isValid) {
            icon.setImageResource(R.drawable.check); // Ícone de validação
        } else {
            icon.setImageResource(R.drawable.x); // Ícone de erro
        }
    }

    private boolean validateForm() {
        if (usernameInput.getText().toString().isEmpty()) {
            Toast.makeText(this, "Por favor, insira seu nome de usuário.", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (emailInput.getText().toString().isEmpty()) {
            Toast.makeText(this, "Por favor, insira seu e-mail.", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (passwordInput.getText().toString().isEmpty()) {
            Toast.makeText(this, "Por favor, insira sua senha.", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!passwordInput.getText().toString().equals(confirmPasswordInput.getText().toString())) {
            Toast.makeText(this, "As senhas não coincidem.", Toast.LENGTH_SHORT).show();
            return false;
        }
        if (!termsCheckbox.isChecked()) {
            Toast.makeText(this, "Você precisa aceitar os termos e condições.", Toast.LENGTH_SHORT).show();
            return false;
        }
        return true;
    }

    public void cadastrarUsuario(User obj) {
        String url = "https://preview-gamix-backend.vercel.app/api/v1/auth/signup";

        JSONObject parametros = new JSONObject();
        try {
            parametros.put("username", obj.getNome());
            parametros.put("password", obj.getPassword());
            parametros.put("email", obj.getEmail());
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(this, "Erro ao criar JSON: " + e.getMessage(), Toast.LENGTH_SHORT).show();
            return;
        }

        StringEntity entity = new StringEntity(parametros.toString(), ContentType.APPLICATION_JSON);

        client.post(this, url, entity, "application/json", new AsyncHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, byte[] responseBody) {
                if (statusCode == 201) {
                    String token = null;
                    for (Header header : headers) {
                        if (header.getName().equalsIgnoreCase("Authorization")) {
                            token = header.getValue();
                            break;
                        }
                    }

                    Toast.makeText(Register.this, "Registro bem-sucedido!", Toast.LENGTH_SHORT).show();

                    if (token != null) {
                        Intent intent = new Intent(Register.this, Feed.class);
                        intent.putExtra("accessToken", token);

                        startActivity(intent);
                        finish();
                    } else {
                        Toast.makeText(Register.this, "Token não recebido!", Toast.LENGTH_SHORT).show();
                    }
                } else {
                    Toast.makeText(Register.this, "Erro no registro: " + statusCode, Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, byte[] responseBody, Throwable error) {
                Toast.makeText(Register.this, "Erro ao conectar: " + error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }


    private void clearForm() {
        usernameInput.setText(null);
        emailInput.setText(null);
        passwordInput.setText(null);
        confirmPasswordInput.setText(null);
        termsCheckbox.setChecked(false);
    }
}
