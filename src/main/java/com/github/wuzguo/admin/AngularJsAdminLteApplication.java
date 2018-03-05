package com.github.wuzguo.admin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class AngularJsAdminLteApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(AngularJsAdminLteApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(AngularJsAdminLteApplication.class, args);
    }
}
