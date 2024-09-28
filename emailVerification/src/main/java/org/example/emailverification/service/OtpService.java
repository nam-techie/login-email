package org.example.emailverification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> otpMap = new HashMap<>();

    public void generateAndSendOTP(String email) {
        String otp = generateOTP();
        otpMap.put(email, otp);
        sendOTPEmail(email, otp);
    }

    public boolean verifyOTP(String email, String otp) {
        String storedOtp = otpMap.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpMap.remove(email);
            return true;
        }
        return false;
    }

    private String generateOTP() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void sendOTPEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Mã xác minh của bạn");
            message.setText("Mã xác minh của bạn là:\n\n" + otp + "\n\n" +
                            "Vui lòng nhập mã này vào ứng dụng để xác minh địa chỉ email của bạn.\n\n" +
                            "Mã này sẽ hết hạn trong 2 phút.");
            mailSender.send(message);
        } catch (MailException e) {
            // Ghi log ngoại lệ
            e.printStackTrace();
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}