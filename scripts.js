// === DYNAMIC AGE CALCULATOR ===
function updateAge() {
  const birthDate = new Date("2005-02-19T00:00:00");
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // Adjust for negative days (meaning the current day of the month is before the birth day)
  if (days < 0) {
    months--;
    // Get the total number of days in the previous month
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // Adjust for negative months (meaning the current month is before the birth month)
  if (months < 0) {
    years--;
    months += 12;
  }

  const birthdayElement = document.querySelector('.birthday');
  if (birthdayElement) {
    // Updates the HTML before GSAP touches it
    birthdayElement.textContent = `${years}years ${months}months ${days}days`;
  }
}

// Execute immediately 
updateAge();
// Wait for FULL window load (fonts, images) to prevent SplitText math errors.
window.addEventListener("load", (event) => {
  gsap.registerPlugin(
    Draggable, DrawSVGPlugin, EaselPlugin, Flip, GSDevTools, InertiaPlugin,
    MotionPathHelper, MotionPathPlugin, MorphSVGPlugin, Observer, Physics2DPlugin,
    PhysicsPropsPlugin, PixiPlugin, ScrambleTextPlugin, ScrollTrigger, ScrollSmoother,
    ScrollToPlugin, SplitText, TextPlugin, RoughEase, ExpoScaleEase, SlowMo,
    CustomEase, CustomBounce, CustomWiggle
  );

 // 1. Tell GSAP to ignore the mobile address bar hiding/showing
  ScrollTrigger.config({ ignoreMobileResize: true });

  // 2. Updated ScrollSmoother Initialization
  let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
    smoothTouch: false, // Disables JS scroll hijacking on mobile, allowing native touch
    normalizeScroll: true // Forces the browser to handle scroll rendering on the main thread
  });

  // === REFINED AUDIO TOGGLE WITH EQUALIZER ===
  const bgAudio = document.getElementById('background-audio');
  const soundBtn = document.getElementById('sound-toggle-btn');
  const soundText = document.getElementById('sound-text');
  const eqBars = gsap.utils.toArray('.eq-bar');
  let isPlaying = false;
  let eqAnimation;

  bgAudio.volume = 0.4;

  // GSAP animation to make the bars bounce
  const startEQ = () => {
    eqAnimation = gsap.to(eqBars, {
      height: () => gsap.utils.random(4, 12) + "px",
      duration: 0.3,
      stagger: 0.05,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  };

  // GSAP animation to return bars to a flat line
  const stopEQ = () => {
    if (eqAnimation) eqAnimation.kill();
    gsap.to(eqBars, { height: "2px", duration: 0.3, ease: "power2.out" });
  };

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      bgAudio.play();
      isPlaying = true;
      soundText.innerText = "SOUND ON";
      startEQ();
    } else {
      bgAudio.pause();
      isPlaying = false;
      soundText.innerText = "SOUND OFF";
      stopEQ();
    }
  });
  // Prepare text splits
  let split = SplitText.create("span.creative", { type: "lines, words, chars" });
  let split01 = SplitText.create(".birthday", { type: "words" });
  let split02 = SplitText.create(".aboutme-topic", { type: "chars" });

  // === MASTER INTRO TIMELINE ===
  const introTl = gsap.timeline();

  // 1. Loading Screen Sequence
  introTl.set(".loadname01, .loadname02, .loadname03", { opacity: 0, color: "white" })
    .to(".loadname01", { opacity: 1, duration: 0.5 })
    .to(".loadname01", { opacity: 0, duration: 0.5 }, "+=0.8")
    .to(".loadname02", { opacity: 1, duration: 0.5 })
    .to(".loadname02", { opacity: 0, duration: 0.5 }, "+=1")
    .to(".loadname03", { opacity: 1, duration: 0.5 })
    .to(".loader", { width: "100%", duration: 3, ease: "power4.inOut" }, 0)
    .to(".loader", { height: "100%", duration: 2.5, ease: "power4.in" }, "-=2")
    .to(".loadname03", { y: -200, duration: 2, ease: "power4.inOut" }, "-=1.5")
    .to("#loading-screen", { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById("loading-screen").style.display = "none";
    }}, "-=0.5")

  // 2. Hero Elements animate in immediately after loader disappears
    .from(".nav-links, .contactme, .location", { opacity: 0, duration: 1, stagger: 0.2 }, "-=0.2")
    .from(split.chars, { y: -100, opacity: 0, stagger: { amount: 0.6, from: "center" }, duration: 1 }, "-=1")
    .from(split01.words, { y: -100, opacity: 0, stagger: { amount: 0.5, from: "left" }, duration: 1.5 }, "-=1")
    .from(".myphoto", { clipPath: "inset(0% 0% 100% 0%)", duration: 2, ease: "power2.inOut" }, "-=1.5")
    
  // 3. Scramble texts kick off smoothly
    .to(".first", { scrambleText: { text: "/web developer", chars: "@#$%#$" }, duration: 2 }, "-=1")
    .to(".second", { scrambleText: { text: "/PROGRAMMING", chars: "@#$%#$" }, duration: 2 }, "-=1.5")
    .to(".third", { scrambleText: { text: "/engineering student", chars: "@#$%#$" }, duration: 2 }, "-=1.5")
    .from(".barcode", { y: 150, opacity: 0, duration: 2, ease: "power4.out" }, "-=1");


  // === SCROLL TRIGGERS ===
  gsap.to(".introname", {
    scrollTrigger: {
      trigger: ".aboutmeintro",
      scrub: true,
      start: "top center",
      end: "+=800px",
    },
    scrambleText: {
      text: "Kavindu Thisal Weerakkody",
      chars: "@#$%#$*&",
      delimiter: ""
    }
  });

  gsap.fromTo(".text", { opacity: 0 }, {
    scrollTrigger: {
      trigger: ".aboutmeintro",
      scrub: true,
      start: "top center",
      end: "+=2000px",
    },
    opacity: 1,
    scrambleText: {
      speed: 10,
      text: "I am a student at the Univerity of Moratuwa studying Engineering with a lifelong passion for technology. I strive to infuse my technical proficiency with creative designs to produce innovative and striking solutions ",
      chars: "@#$%#$*&",
      delimiter: " "
    }
  });

  // ABOUT ME Title Scroll Triggers
  const titleLetters = [".A", ".B", ".O", ".U", ".T", ".M", ".E"];
  titleLetters.forEach((letter, index) => {
    gsap.from(letter, {
      scrollTrigger: {
        trigger: letter,
        start: "top 50%",
        end: "top 5%",
        scrub: index % 2 === 0 ? 4 : 2, 
      },
      y: -500,
      duration: 3
    });
  });

  // SKILLS! Title Scroll Triggers
  const skillLetters = [".S1", ".K", ".I", ".L1", ".L2", ".S2", ".EX"];
  skillLetters.forEach((letter) => {
    gsap.from(letter, {
      scrollTrigger: {
        trigger: letter,
        start: "top 55%",
        end: "top 5%",
        scrub: true,
      },
      y: -250,
      duration: 3
    });
  });

  // "LET'S TALK" Scroll Triggers
  const talkLetters = [".F1", ".F2", ".F3", ".F4", ".F5", ".F6", ".F7", ".F8", ".F9"];
  talkLetters.forEach((letter, index) => {
    gsap.from(letter, {
      scrollTrigger: {
        trigger: letter,
        start: "top top",
        end: "top 5%",
        scrub: (index % 5) + 1,
      },
      y: -500,
      duration: 3
    });
  });

  gsap.from(".short", {
    scrollTrigger: { trigger: ".aboutme", start: "50px 00%", end: "+=300%", scrub: true, pin: ".aboutme" },
    duration: 3
  });

  gsap.to(".filler", {
    scrollTrigger: { trigger: ".filler", scrub: 2, start: "top 50%", end: "top -400%" },
    ease: "power3.inOut", y: "50vh", height: "60vh", top: "50vw", duration: 5,
  });

  gsap.fromTo(".myphoto01", { scale: 1.2 }, {
    scrollTrigger: { trigger: ".filler", scrub: true, start: "top 50%", end: "top -400%" },
    scale: 1, duration: 5
  });

  gsap.from(".chronicle", {
    scrollTrigger: { trigger: ".chronicle", toggleActions: "play none none none", start: "top center", end: "top top" },
    opacity: 0, duration: 3, ease: "power1.out",
  });

  gsap.from(".gallery", {
    scrollTrigger: { trigger: ".gallery", start: "0 20%", end: "+=100%", scrub: true, pin: ".skills" },
    duration: 3
  });

// === NEW: REVEAL OVERLAYS FOR SKILL COLUMNS ===
 // === NEW: REVEAL OVERLAYS FOR SKILL COLUMNS ===
  let skillsRevealed = false; // Flag to prevent hover overlap

  gsap.to(".reveal-overlay", {
    scrollTrigger: {
      trigger: ".gallery",
      start: "top 20%",
      
      // CHANGE: "reverse" tells it to smoothly play backward when scrolling out!
      toggleActions: "play none none reverse", 
      
      // Instantly lock the mouse hover effects the moment the reverse animation starts
      onLeaveBack: () => { 
        skillsRevealed = false; 
      }
    },
    height: "0%",
    duration: 1.2,
    ease: "power3.inOut",
    stagger: 0.15,
    onComplete: () => {
      skillsRevealed = true; // Unlock hover effects once fully loaded
    }
  });


  // === CURSOR LOGIC ===
  let cursor = document.querySelector('.cursor');
  let cursorScale = document.querySelectorAll('.cursor-scale');
  let mouseX = 0;
  let mouseY = 0;

  if (cursor) {
    gsap.to({}, 0.016, {
      repeat: -1,
      onRepeat: function () {
        gsap.set(cursor, { css: { left: mouseX, top: mouseY } });
      }
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    cursorScale.forEach(link => {
      link.addEventListener('mousemove', () => {
        cursor.classList.add('grow');
        if (link.classList.contains('small')) {
          cursor.classList.remove('grow');
          cursor.classList.add('grow-small');
        }
      });

      link.addEventListener('mouseleave', () => {
        cursor.classList.remove('grow');
        cursor.classList.remove('grow-small');
      });
    });
  }

  const customCursor = document.getElementById('custom-cursor');
  const cursorPos = { x: 0, y: 0 };
  const mousePos = { x: 0, y: 0 };

  if (customCursor) {
    document.addEventListener('mousemove', (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    gsap.ticker.add(() => {
      cursorPos.x += (mousePos.x - cursorPos.x) * 0.09;
      cursorPos.y += (mousePos.y - cursorPos.y) * 0.09;
      gsap.set(customCursor, { x: cursorPos.x - 20, y: cursorPos.y - 20 });
    });

    document.addEventListener('mouseleave', () => gsap.to(customCursor, { opacity: 0, duration: 0.2 }));
    document.addEventListener('mouseenter', () => gsap.to(customCursor, { opacity: 1, duration: 0.2 }));
  }


  // === HOVER EFFECTS FOR SKILLS ===
  const skillsData = [
    { parent: '.skill01_parent', text: '.skill01', filler: '.slidingfiller', listItems: [".skillfourthfirst", ".skillfourthsecond", ".skillfourththird"] },
    { parent: '.skill02_parent', text: '.skill02', filler: '.slidingfiller01', listItems: [".skillsecondfirst", ".skillsecondsecond", ".skillsecondthird"] },
    { parent: '.skill03_parent', text: '.skill03', filler: '.slidingfiller02', listItems: [".skillfifthfirst", ".skillfifthsecond", ".skillfifththird"] },
    { parent: '.skill04_parent', text: '.skill04', filler: '.slidingfiller04', listItems: [".skillfirst", ".skillsecond", ".skillthird", ".skillfourth"] },
    { parent: '.skill05_parent', text: '.skill05', filler: '.slidingfiller05', listItems: [".skillthirdfirst", ".skillthirdsecond", ".skillthirdthird"] }
  ];

  skillsData.forEach(skill => {
    const parent = document.querySelector(skill.parent);
    const textNode = document.querySelector(skill.text);
    const fillerNode = document.querySelector(skill.filler);

    if (parent) {
      skill.listItems.forEach(item => gsap.set(item, { y: 50 }));

      parent.addEventListener('mouseenter', () => {
        if (!skillsRevealed) return; // Prevent hover during initial reveal

        if (textNode) gsap.to(textNode, { color: '#F7F7F7', duration: 0.3, ease: 'power2.out' });
        if (fillerNode) gsap.to(fillerNode, { height: "100%", duration: 0.5, ease: 'power2.out' });
        skill.listItems.forEach((item, index) => {
          gsap.to(item, { delay: 0.5 + (index * 0.1), y: 0, duration: 0.5, ease: 'power2.out', overwrite: true });
        });
      });

      parent.addEventListener('mouseleave', () => {
        if (!skillsRevealed) return; // Prevent hover during initial reveal
        
        if (textNode) gsap.to(textNode, { color: '#101010', duration: 0.3, ease: 'power2.out' });
        if (fillerNode) gsap.to(fillerNode, { height: "0%", duration: 0.5, ease: 'power2.out' });
        skill.listItems.forEach(item => {
          gsap.to(item, { delay: 0.5, y: -50, duration: 0.5, ease: 'power2.out', overwrite: true });
        });
      });
    }
  });

  // === NAV COLOR CHANGES ON SCROLL ===
const navElements = gsap.utils.toArray('.nav-link, .logo, .contact-button, .sound-toggle-floating');
ScrollTrigger.create({
    trigger: '.aboutme',
    start: 'top top',
    end: 'bottom bottom',
    onEnter: () => gsap.to(navElements, { color: '#F7F7F7', duration: 0.3, ease: 'power2.out' }),
    onLeaveBack: () => gsap.to(navElements, { color: '#101010', duration: 0.3, ease: 'power2.out' })
  });

  ScrollTrigger.create({
    trigger: '.title',
    start: 'top top',
    end: 'bottom top',
    onEnter: () => gsap.to(navElements, { color: '#101010', duration: 0.3, ease: 'power2.out' }),
    onLeaveBack: () => gsap.to(navElements, { color: '#F7F7F7', duration: 0.3, ease: 'power2.out' })
  });

  // === HOVER IMAGES LOGIC ===
  const hoverImages = [
    { trigger: '.louvre', target: '.custom-cursor01' },
    { trigger: '.al', target: '.custom-cursor02' },
    { trigger: '.web', target: '.custom-cursor03' },
    { trigger: '.prends', target: '.custom-cursor04' },
    { trigger: '.alprends', target: '.custom-cursorx' },
    { trigger: '.tbbt', target: '.custom-cursorxx' },
    { trigger: '.ol', target: '.custom-cursor05' },
    { trigger: '.po', target: '.custom-cursor06' },
    { trigger: '.her', target: '.custom-cursor07' }
  ];

  const imgFiller = document.querySelector('.fillerimg');

  hoverImages.forEach(item => {
    const triggerEl = document.querySelector(item.trigger);
    const targetEl = document.querySelector(item.target);

    if (triggerEl && targetEl) {
      triggerEl.addEventListener('mouseenter', () => {
        gsap.to(imgFiller, { height: "0%", duration: 0.8, ease: 'power2.out' });
        gsap.to(targetEl, { opacity: 1, duration: 0, ease: 'power2.out', overwrite: true });
      });

      triggerEl.addEventListener('mouseleave', () => {
        gsap.to(imgFiller, { height: "100%", duration: 1, ease: 'power2.out' });
        gsap.to(targetEl, { opacity: 0, delay: 0.3, duration: 0, ease: 'power2.out', overwrite: true });
      });
    }
  });
});