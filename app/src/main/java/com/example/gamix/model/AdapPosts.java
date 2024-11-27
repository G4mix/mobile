package com.example.gamix.model;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.gamix.R;

public class AdapPosts extends BaseAdapter {
    Context context;

    String listuser[];
    String listtitle[];
    String listdescription[];

    LayoutInflater inflater;

    public AdapPosts(Context ctx, String[] user, String[] title, String[] description){
        this.context = ctx;

        this.listuser=user;
        this.listtitle=title;
        this.listdescription=description;

        inflater = LayoutInflater.from(ctx);
    }
    @Override
    public int getCount() {
        return listtitle.length;
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        view = inflater.inflate(R.layout.posts_list, null);
        TextView userNameText=(TextView) view.findViewById(R.id.userName);
        TextView titleText=(TextView) view.findViewById(R.id.postTitle);
        TextView descriptionText=(TextView) view.findViewById(R.id.postDescription);
;
        userNameText.setText(listuser[i]);
        titleText.setText(listtitle[i]);
        descriptionText.setText(listdescription[i]);

        return view;
    }
}


