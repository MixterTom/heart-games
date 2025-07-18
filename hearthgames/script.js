const questions = [
  "Có ai đó trong lớp từng giúp đỡ bạn khiến bạn rất cảm kích không?",
  "Bạn có nhớ một khoảnh khắc ở trường khiến bạn mỉm cười khi nhớ lại không?",
  "Có ai trong lớp mà bạn thấy dễ thương vì một hành động nhỏ nào đó không?",
  "Có bài hát nào khiến bạn nhớ đến một thời điểm đẹp ở trường không?",
  "Bạn từng cảm thấy bối rối hoặc tim đập nhanh vì một điều gì đó chưa?",
  "Nếu được giữ mãi một khoảnh khắc ở trường, bạn sẽ chọn khoảnh khắc nào?",
  "Bạn có từng viết thư tay, tặng quà hay để lại lời nhắn bí mật cho ai đó trong lớp không?",
  "Nếu có thể gửi một lời nhắn đến bản thân thời học sinh, bạn muốn nói điều gì?"
];

let current = 0;
let answers = [];

const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit-btn');
const congrats = document.getElementById('congrats');

function showQuestion(idx) {
  questionNumber.textContent = `Câu ${idx+1}/8`;
  questionText.textContent = questions[idx];
  answerInput.value = '';
  answerInput.focus();
}

function revealHeartPart(idx) {
  const cover = document.getElementById(`cover-${idx+1}`);
  if (cover) {
    cover.style.display = 'none';
  }
}

function showSummaryModal() {
  const modal = document.getElementById('summary-modal');
  const list = document.getElementById('summary-list');
  let html = '';
  for (let i = 0; i < questions.length; i += 2) {
    html += '<div class="summary-row">';
    // Cột 1
    html += `<div class="summary-item"><div class="summary-question"><b>Câu ${i+1}:</b> ${questions[i]}</div><div class="summary-answer">${answers[i] || ''}</div></div>`;
    // Cột 2 (nếu có)
    if (i + 1 < questions.length) {
      html += `<div class="summary-item"><div class="summary-question"><b>Câu ${i+2}:</b> ${questions[i+1]}</div><div class="summary-answer">${answers[i+1] || ''}</div></div>`;
    }
    html += '</div>';
  }
  list.innerHTML = html;
  modal.classList.remove('hidden');
}

submitBtn.addEventListener('click', () => {
  if (answerInput.value.trim() === '') {
    answerInput.focus();
    answerInput.placeholder = 'Bạn cần nhập câu trả lời!';
    return;
  }
  answers[current] = answerInput.value.trim();
  revealHeartPart(current);
  current++;
  if (current < questions.length) {
    showQuestion(current);
  } else {
    document.querySelector('.question-box').style.display = 'none';
    document.getElementById('show-summary-btn').style.display = 'none'; // Ẩn nút khi hoàn thành
    showSummaryModal();
  }
});

// Hiệu ứng pháo giấy (confetti) đẹp hơn, to hơn, bắn cao hơn
function showFireworks() {
  const container = document.querySelector('.fireworks-container');
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  container.classList.remove('hidden');
  let confetti = [];
  let animationFrame;
  const colors = [
    '#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#b388ff', '#ff80ab', '#fff176',
    '#ffb300', '#00bcd4', '#8bc34a', '#f06292', '#ba68c8', '#ff7043'
  ];
  const confettiCount = 120;

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createConfetti() {
    confetti = [];
    for (let i = 0; i < confettiCount; i++) {
      const angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7; // tỏa rộng hơn
      const speed = 10 + Math.random() * 6; // mạnh hơn
      confetti.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 120,
        y: canvas.height - 10,
        vx: Math.cos(angle) * speed,
        vy: -Math.abs(Math.sin(angle) * speed) * (0.85 + Math.random() * 0.3),
        w: 14 + Math.random() * 12,
        h: 18 + Math.random() * 14,
        color: randomColor(),
        alpha: 1,
        rotate: Math.random() * Math.PI * 2,
        rotateSpeed: (Math.random() - 0.5) * 0.25,
        gravity: 0.13 + Math.random() * 0.07, // nhẹ hơn
        drag: 0.985 + Math.random() * 0.01,
        sway: (Math.random() - 0.5) * 1.2,
        swaySpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotate);
      ctx.fillStyle = c.color;
      ctx.fillRect(-c.w/2, -c.h/2, c.w, c.h);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
  }

  function update() {
    confetti.forEach((c) => {
      c.x += c.vx + Math.sin(Date.now() * c.swaySpeed) * c.sway;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= c.drag;
      c.vy *= c.drag;
      c.rotate += c.rotateSpeed;
      if (c.y > canvas.height) c.alpha -= 0.025;
    });
    confetti = confetti.filter((c) => c.alpha > 0);
    if (confetti.length === 0) {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      container.classList.add('hidden');
      return;
    }
  }

  function loop() {
    update();
    draw();
    animationFrame = requestAnimationFrame(loop);
  }

  createConfetti();
  loop();
}

// Phát âm thanh chúc mừng
function playCongratsAudio() {
  const audio = document.getElementById('congrats-audio');
  if (audio) {
    audio.currentTime = 0;
    audio.play();
  }
}

// Khởi động
showQuestion(0);

// Đóng modal, hiện pháo hoa và chúc mừng
// Khi đóng modal lần đầu (sau khi hoàn thành), hiện lại nút xem câu trả lời
let finished = false;
document.getElementById('close-summary').addEventListener('click', () => {
  document.getElementById('summary-modal').classList.add('hidden');
  if (!finished && current >= questions.length) {
    document.getElementById('show-summary-btn').style.display = 'inline-block';
    finished = true;
  }
  congrats.classList.remove('hidden');
  showFireworks();
  playCongratsAudio();
});

// Nút xem lại câu trả lời
// Khi đã hoàn thành, nút này luôn hiện
document.getElementById('show-summary-btn').addEventListener('click', () => {
  showSummaryModal();
});

// Nút xem lại câu trả lời sau khi hoàn thành
const showSummaryBtnFinal = document.getElementById('show-summary-btn-final');
if (showSummaryBtnFinal) {
  showSummaryBtnFinal.addEventListener('click', () => {
    showSummaryModal();
  });
} 