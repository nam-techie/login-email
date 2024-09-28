package org.example.emailverification.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/enter-email")
    public String enterEmail() {
        return "enter-email";
    }

    @GetMapping("/enter-otp")
    public String enterOTP() {
        return "enter-otp";
    }

    @GetMapping("/success")
    public String success() {
        return "success";
    }

    @GetMapping("/timeout")
    public String timeout() {
        return "timeout";
    }

    // Các phương thức xử lý API khác có thể được thêm vào đây
}