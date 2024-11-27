package com.example.gamix;

import android.os.Bundle;
import android.widget.ListView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.gamix.model.AdapPosts;

public class Feed extends AppCompatActivity {
    String listuser[]={"ViniMS", "Abyss", "LordLuch", "Rafael", "Cabelo", "André" };
    String listtitle[]={"God Of War", "Olá Pessoal!!", "Zelda", "Livros de jogos", "Fala galera!", "Games" };
    String listdescription[]={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    };

    ListView listView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_feed);
        listView=(ListView) findViewById(R.id.postsView);
        AdapPosts adap= new AdapPosts(getApplicationContext(), listuser, listtitle, listdescription);
        listView.setAdapter(adap);
    }
}