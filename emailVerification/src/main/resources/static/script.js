document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.otp-card-inputs input');
    const button = document.querySelector('.otp-card button');
    let timeLeft = 120; // 2 phút = 120 giây
    let timerInterval;

    // Hiển thị email
    const emailDisplay = document.getElementById('emailDisplay');
    const email = localStorage.getItem('userEmail');
    if (email) {
        emailDisplay.textContent = email;
    }

    inputs.forEach(input => {
        let lastInputStatus = 0;
        input.onkeyup = (e) => {
            const currentElement = e.target;
            const nextElement = input.nextElementSibling;
            const prevElement = input.previousElementSibling;

            if (prevElement && e.keyCode === 8) {
                if (lastInputStatus === 1) {
                    prevElement.value = '';
                    prevElement.focus();
                }
                button.setAttribute('disabled', true);
                lastInputStatus = 1;
            } else {
                const reg = /^[0-9]+$/;
                if (!reg.test(currentElement.value)) {
                    currentElement.value = currentElement.value.replace(/\D/g, '');
                } else if (currentElement.value) {
                    if (nextElement) {
                        nextElement.focus();
                    } else {
                        button.removeAttribute('disabled');
                    }
                    lastInputStatus = 0;
                }
            }
        }
    });

    // Hàm để định dạng thời gian thành phút và giây (MM:SS)
    function formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    // Hàm để cập nhật bộ đếm thời gian
    function startTimer() {
        const timerElement = document.getElementById('timer');
        clearInterval(timerInterval); // Xóa interval cũ nếu có
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Thời gian còn lại: ${formatTime(timeLeft)}`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                window.location.href = '/timeout';
            }
        }, 1000); // Cập nhật mỗi giây
    }

    // Bắt đầu đếm ngược
    startTimer();
});

function sendOTP() {
    const email = document.getElementById('email').value;
    const messageElement = document.getElementById('message');

    fetch('/api/auth/send-otp?email=' + encodeURIComponent(email), {
        method: 'POST'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        messageElement.textContent = 'Mã OTP đã được gửi thành công! Vui lòng kiểm tra hộp thư của bạn và nhập mã xác thực trong vòng 2 phút.';
        messageElement.style.color = 'green';
        // Lưu email vào localStorage để sử dụng sau này
        localStorage.setItem('userEmail', email);
        
        // Đợi 2 giây trước khi chuyển trang
        setTimeout(() => {
            window.location.href = '/enter-otp';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        messageElement.textContent = 'Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử lại sau.';
        messageElement.style.color = 'red';
    });
}

function verifyOTP() {
    const email = localStorage.getItem('userEmail');
    const otp = Array.from(document.querySelectorAll('.otp-card-inputs input'))
        .map(input => input.value)
        .join('');
    const messageElement = document.getElementById('message') || document.createElement('div');
    messageElement.id = 'message';
    document.querySelector('.otp-card').appendChild(messageElement);

    fetch(`/api/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`, { method: 'POST' })
        .then(response => response.text())
        .then(data => {
            if (data === 'Login successful') {
                messageElement.innerText = 'Xác thực OTP thành công. Đang chuyển hướng...';
                messageElement.style.color = 'green';
                setTimeout(() => {
                    window.location.href = '/success';
                }, 2000);
            } else {
                messageElement.innerText = 'Xác thực OTP thất bại. Vui lòng thử lại.';
                messageElement.style.color = 'red';
            }
        })
        .catch(error => {
            messageElement.innerText = 'Có lỗi xảy ra: ' + error;
            messageElement.style.color = 'red';
        });
}

function resendOTP() {
    const email = localStorage.getItem('userEmail');
    const messageElement = document.getElementById('message') || document.createElement('div');
    messageElement.id = 'message';
    document.querySelector('.otp-card').appendChild(messageElement);

    fetch(`/api/auth/send-otp?email=${encodeURIComponent(email)}`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            messageElement.innerText = 'OTP đã được gửi lại. Vui lòng kiểm tra email của bạn.';
            messageElement.style.color = 'green';
            timeLeft = 120; // Reset thời gian
            startTimer(); // Bắt đầu đếm ngược lại
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.innerText = 'Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.';
            messageElement.style.color = 'red';
        });
}

function goToHomePage() {
    window.location.href = '/';
}

function goToEnterEmail() {
    window.location.href = '/enter-email';
}