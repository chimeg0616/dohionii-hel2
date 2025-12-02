// Default configuration
//анхдагч тохиргоо defaultConfig нь вэб сайтын гарчиг, тайлбар, танилцуулга зэрэг бэлэн текстүүдийг хадгалдаг тохиргооны объект юм.
//Энэ объектын:

//main_title — гол гарчиг

//subtitle — гарчгийн доорх тайлбар

//welcome_message — сайтын танилцуулга

//sign_language_title — дохионы хэлний хэсгийн гарчиг

//гэсэн үүрэгтэй.
const defaultConfig = {
    main_title: "🤟 Дохионы Хэлний Сургалт 🤟",
    subtitle: "Үг бичээд дохионы хэлээр харж, өөрөө сурцгаая! ✍️➡️👋",
    welcome_message: "Энэ бол дохионы хэл сурахыг хүссэн бүх хүмүүст зориулсан интерактив сайт юм! Та энд дохионы хэлний үндсийг сурч, өдөр тутмын харилцаанд ашиглах боломжтой. Үг бичээд дохионы хэлээр хэрхэн илэрхийлэхийг харж, дасгал хийж сурцгаая! 🌟",
    sign_language_title: "👋 Дохионы хэл сурцгаая! 👋"
};

// Game state - SIGN LANGUAGE total is updated from 32 to 34 (based on map content)
//gameStats — Тоглоомын ангилал бүрийн сурсан тоо болон нийт үг/дохионы тоог хадгалдаг объект.
//signLanguage.total = 34 — Дохионы хэлний нийт 34 дохио байна.
//learned: new Set() — Сурсан дохионуудыг давхцахгүй байдлаар Set-д хадгална.
//exerciseTimer — Дасгалын таймерийн хувьсагч (дараа нь start/stop хийхэд хэрэглэнэ).
//memoryGameState — Санах ойн тоглоомын одоо үеийн төлөв.
//sequence — Компьютерийн үзүүлэх дараалал
//playerSequence — Тоглогчийн оруулсан дараалал 
//isPlaying — Тоглоом идэвхтэй эсэх
//currentStep — Одоогийн шат / үзүүлж буй алхам
//Товчхондоо энэ код нь тоглоомын мэдээлэл, таймер, санах ойн тоглоомын төлөвийг удирдах тохиргооны хувьсагчнууд юм.
let gameStats = {
    signLanguage: { learned: new Set(), total: 34 }, // Changed from 32 to 34
    colors: { learned: new Set(), total: 6 },
    numbers: { learned: new Set(), total: 6 }
};

let exerciseTimer = null;

let memoryGameState = {
    sequence: [],
    playerSequence: [],
    isPlaying: false,
    currentStep: 0
};

// Sign Language Mapping - Removed duplicate 'Ы' entry if one existed in the original, ensuring consistency
const signLanguageMap = {
    'А': '✊', 'Б': '🤚', 'В': '✌️', 'Г': '👍', 'Д': '👆', 'Е': '🤏', 'Ё': '🤌', 'Ж': '🤞',
    'З': '🤟', 'И': '☝️', 'Й': '🖖', 'К': '🤘', 'Л': '👌', 'М': '✋', 'Н': '🖐️', 'О': '⭕',
    'Ө': '🔵', 'П': '🖕', 'Р': '👊', 'С': '🤙', 'Т': '👎', 'У': '🤜', 'Ү': '🤛', 'Ф': '🫰',
    'Х': '🫵', 'Ц': '🫴', 'Ч': '🫳', 'Ш': '🫲', 'Щ': '🫱', 'Ы': '🤚', 'Э': '👋', 'Ю': '🤗', 'Я': '🙌'
};

// Text to Sign Language Converter
function convertToSignLanguage(text) {
    const output = document.getElementById('sign-output');

    if (!text.trim()) {
        output.innerHTML = '<p class="text-xl">Үг бичээд дохионы хэлээр харж болно! 👆</p>';
        return;
    }

    const upperText = text.toUpperCase();
    let signHtml = '<div class="flex flex-wrap justify-center gap-4 items-center">';

    for (let char of upperText) {
        if (signLanguageMap[char]) {
            signHtml += `
                <div class="text-center bg-white bg-opacity-20 rounded-xl p-3 min-w-16">
                    <div class="text-4xl mb-1">${signLanguageMap[char]}</div>
                    <div class="text-sm font-bold">${char}</div>
                </div>
            `;
        } else if (char === ' ') {
            signHtml += `
                <div class="text-center bg-white bg-opacity-20 rounded-xl p-3 min-w-16">
                    <div class="text-4xl mb-1">👐</div>
                    <div class="text-sm font-bold">зай</div>
                </div>
            `;
        } else {
            signHtml += `
                <div class="text-center bg-gray-400 bg-opacity-30 rounded-xl p-3 min-w-16">
                    <div class="text-4xl mb-1">❓</div>
                    <div class="text-sm font-bold">${char}</div>
                </div>
            `;
        }
    }

    signHtml += '</div>';
    signHtml += `<p class="text-lg mt-4 font-bold">"${text}" - дохионы хэлээр</p>`;

    output.innerHTML = signHtml;
}

function clearText() {
    document.getElementById('text-input').value = '';
    document.getElementById('sign-output').innerHTML = '<p class="text-xl">Үг бичээд дохионы хэлээр харж болно! 👆</p>';
}

// Sign Language Functions - Added 'event' parameter
function showSign(letter, emoji, event) {
    const display = document.getElementById('sign-display');
    display.innerHTML = `
        <div class="text-center">
            <div class="text-8xl mb-4 bounce-in">${emoji}</div>
            <p class="text-3xl font-bold">"${letter}"</p>
        </div>
    `;

    // Add to learned signs
    gameStats.signLanguage.learned.add(letter);
    updateProgress();

    // Add wiggle animation to the clicked sign
    if (event && event.target) {
        event.target.classList.add('wiggle');
        setTimeout(() => event.target.classList.remove('wiggle'), 500);
    }

    showCelebration(`Сайхан! "${letter}" дохиог сурлаа! 🎉`);
}

// Show Sign Word Function - Added 'event' parameter
function showSignWord(word, description, event) {
    const display = document.getElementById('sign-display');
    display.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-4 bounce-in">👋</div>
            <p class="text-3xl font-bold mb-4">"${word}"</p>
            <div class="bg-white bg-opacity-40 rounded-xl p-4 max-w-2xl mx-auto">
                <p class="text-lg font-bold text-blue-900">Дохионы тайлбар:</p>
                <p class="text-lg mt-2">${description}</p>
            </div>
        </div>
    `;

    // Add wiggle animation to the clicked button
    if (event && event.target) {
        event.target.classList.add('wiggle');
        setTimeout(() => event.target.classList.remove('wiggle'), 500);
    }

    showCelebration(`"${word}" үгийн дохиог үзлээ! 👋`);
}

// Color Game Functions - Added 'event' parameter
function playColorGame(colorName, colorCode, event) {
    const result = document.getElementById('color-result');
    result.textContent = `Энэ бол ${colorName} өнгө! 🎨`;
    result.style.color = colorCode;

    // Add success animation
    if (event && event.target) {
        event.target.classList.add('success-animation');
        setTimeout(() => event.target.classList.remove('success-animation'), 600);
    }

    gameStats.colors.learned.add(colorName);
    updateProgress();
    showCelebration(`${colorName} өнгийг таньлаа! 🌈`);
}

// Music Game Functions - Added 'event' parameter
function playMusic(instrument, event) {
    const musicNames = {
        '🥁': 'бөмбөр',
        '🎹': 'төгөлдөр хуур',
        '🎸': 'гитар',
        '🎺': 'бүрээ'
    };

    // Add bounce animation
    if (event && event.target) {
        event.target.classList.add('bounce-in');
        setTimeout(() => event.target.classList.remove('bounce-in'), 1000);
    }

    showCelebration(`${musicNames[instrument]} хөгжмөр зэмсэг сонголоо! 🎵`);
}

// Number Game Functions
function countNumber(num) {
    const display = document.getElementById('number-display');
    const emojis = ['', '🐶', '🐶🐱', '🐶🐱🐭', '🐶🐱🐭🐹', '🐶🐱🐭🐹🐰', '🐶🐱🐭🐹🐰🦊'];

    display.innerHTML = `
        <div class="text-center">
            <div class="text-4xl mb-2">${emojis[num]}</div>
            <p class="text-2xl font-bold">${num} ширхэг амьтан!</p>
        </div>
    `;

    gameStats.numbers.learned.add(num);
    updateProgress();
    showCelebration(`${num} тоог тоолж чадлаа! 🔢`);
}

// Shape Recognition Functions
function identifyShape(shapeName, shapeEmoji) {
    const result = document.getElementById('shape-result');
    result.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-2 bounce-in">${shapeEmoji}</div>
            <p class="text-xl">Энэ бол ${shapeName}!</p>
        </div>
    `;

    showCelebration(`${shapeName} дүрсийг таньлаа! ⭐`);
}

// Animal Sound Functions
function animalSound(animalName, animalEmoji, sound) {
    const result = document.getElementById('animal-result');
    result.innerHTML = `
        <div class="text-center">
            <div class="text-6xl mb-2 bounce-in">${animalEmoji}</div>
            <p class="text-xl">${animalName}: "${sound}"</p>
        </div>
    `;

    showCelebration(`${animalName}-ы дууг сонслоо! 🐾`);
}

// Memory Game Functions
function startMemoryGame() {
    memoryGameState = {
        sequence: [],
        playerSequence: [],
        isPlaying: true,
        currentStep: 0
    };

    // Reset buttons
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`memory-${i}`).textContent = '❓';
    }

    // Generate sequence
    for (let i = 0; i < 3; i++) {
        memoryGameState.sequence.push(Math.floor(Math.random() * 4) + 1);
    }

    document.getElementById('memory-result').textContent = 'Дарааллыг санаарай!';

    // Show sequence
    setTimeout(() => showMemorySequence(), 1000);
}

function showMemorySequence() {
    const emojis = ['🌟', '🎈', '🦋', '🌈'];
    let step = 0;

    const showNext = () => {
        if (step < memoryGameState.sequence.length) {
            const buttonId = `memory-${memoryGameState.sequence[step]}`;
            const button = document.getElementById(buttonId);

            button.textContent = emojis[memoryGameState.sequence[step] - 1];
            button.classList.add('bounce-in');

            setTimeout(() => {
                button.textContent = '❓';
                button.classList.remove('bounce-in');
                step++;
                if (step < memoryGameState.sequence.length) {
                    setTimeout(showNext, 800);
                } else {
                    document.getElementById('memory-result').textContent = 'Одоо та дарааллыг давтаарай!';
                }
            }, 600);
        }
    };

    showNext();
}

function memoryGame(buttonNum) {
    if (!memoryGameState.isPlaying) return;

    memoryGameState.playerSequence.push(buttonNum);
    const emojis = ['🌟', '🎈', '🦋', '🌈'];

    // Show clicked button
    const button = document.getElementById(`memory-${buttonNum}`);
    button.textContent = emojis[buttonNum - 1];
    button.classList.add('bounce-in');

    // Check if correct
    const currentIndex = memoryGameState.playerSequence.length - 1;
    if (memoryGameState.playerSequence[currentIndex] !== memoryGameState.sequence[currentIndex]) {
        // Wrong!
        document.getElementById('memory-result').textContent = 'Буруу! Дахин оролдоорой!';
        setTimeout(() => {
            button.textContent = '❓';
            button.classList.remove('bounce-in');
        }, 1000);
        memoryGameState.isPlaying = false;
        return;
    }

    // Check if sequence complete
    if (memoryGameState.playerSequence.length === memoryGameState.sequence.length) {
        document.getElementById('memory-result').textContent = 'Амжилттай! Сайхан санасан! 🧠✨';
        showCelebration('Ой тогтоох тоглоомыг амжилттай дуусгалаа! 🎉');
        memoryGameState.isPlaying = false;
    }

    setTimeout(() => {
        button.textContent = '❓';
        button.classList.remove('bounce-in');
    }, 1000);
}

// Exercise Functions - Added 'event' parameter
function startExercise(instruction, emoji, event) {
    const display = document.getElementById('exercise-display');

    // Clear any existing timer
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
    }

    display.innerHTML = `
        <div class="text-center">
            <div class="text-8xl mb-4 bounce-in">${emoji}</div>
            <p class="text-2xl font-bold mb-4">${instruction}</p>
            <div class="text-6xl font-bold text-yellow-300" id="exercise-timer">10</div>
            <p class="text-lg mt-2">секунд хийгээрэй!</p>
        </div>
    `;

    let timeLeft = 10;
    const timerElement = document.getElementById('exercise-timer');

    exerciseTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(exerciseTimer);
            display.innerHTML = `
                <div class="text-center">
                    <div class="text-8xl mb-4 bounce-in">🎉</div>
                    <p class="text-2xl font-bold text-yellow-300">Сайхан хийлээ!</p>
                    <p class="text-lg mt-2">Дараагийн дасгал сонгоорой</p>
                </div>
            `;
            showCelebration(`${instruction} дасгалыг амжилттай хийлээ! 💪`);
        }
    }, 1000);

    // Add bounce animation to clicked button
    if (event && event.target) {
        event.target.classList.add('bounce-in');
        setTimeout(() => event.target.classList.remove('bounce-in'), 1000);
    }
}

// Progress Update Functions
function updateProgress() {
    // Sign language progress
    const signProgress = (gameStats.signLanguage.learned.size / gameStats.signLanguage.total) * 100;
    document.getElementById('sign-progress').style.width = `${signProgress}%`;
    document.getElementById('sign-score').textContent = `${gameStats.signLanguage.learned.size}/${gameStats.signLanguage.total} үсэг`;

    // Color progress
    const colorProgress = (gameStats.colors.learned.size / gameStats.colors.total) * 100;
    document.getElementById('color-progress').style.width = `${colorProgress}%`;
    document.getElementById('color-score').textContent = `${gameStats.colors.learned.size}/${gameStats.colors.total} өнгө`;

    // Number progress
    const numberProgress = (gameStats.numbers.learned.size / gameStats.numbers.total) * 100;
    document.getElementById('number-progress').style.width = `${numberProgress}%`;
    document.getElementById('number-score').textContent = `${gameStats.numbers.learned.size}/${gameStats.numbers.total} тоо`;
}

// Celebration Functions
function showCelebration(message) {
    const celebration = document.createElement('div');
    celebration.className = 'fixed top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 bounce-in';
    celebration.innerHTML = `
        <div class="flex items-center space-x-2">
            <span class="text-2xl">🎉</span>
            <span class="font-bold">${message}</span>
        </div>
    `;

    document.body.appendChild(celebration);

    setTimeout(() => {
        celebration.remove();
    }, 4000);
}

// Element SDK Configuration
async function onConfigChange(config) {
    const mainTitle = config.main_title || defaultConfig.main_title;
    const subtitle = config.subtitle || defaultConfig.subtitle;
    const welcomeMessage = config.welcome_message || defaultConfig.welcome_message;
    const signLanguageTitle = config.sign_language_title || defaultConfig.sign_language_title;

    document.getElementById('main-title').textContent = mainTitle;
    document.getElementById('subtitle').textContent = subtitle;
    document.getElementById('welcome-message').textContent = welcomeMessage;
    document.getElementById('sign-language-title').textContent = signLanguageTitle;
}

function mapToCapabilities(config) {
    return {
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
    };
}

function mapToEditPanelValues(config) {
    return new Map([
        ["main_title", config.main_title || defaultConfig.main_title],
        ["subtitle", config.subtitle || defaultConfig.subtitle],
        ["welcome_message", config.welcome_message || defaultConfig.welcome_message],
        ["sign_language_title", config.sign_language_title || defaultConfig.sign_language_title]
    ]);
}

// Initialize Element SDK
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    showCelebration('Хүүхдийн Хөгжлийн Төвд тавтай морилно уу! 🌈');
});
function convertToSignLanguage(text) {
    const output = document.getElementById('sign-output');

    if (!text.trim()) {
        output.innerHTML = '<p class="text-xl">Үг бичээд дохионы хэлээр харж болно! 👆</p>';
        return;
    }

    const upperText = text.toUpperCase();
    let signHtml = '<div class="flex flex-wrap justify-center gap-4 items-center">';

    for (let char of upperText) {
        if (signLanguageMap[char]) {
            signHtml += `<span class="sign-emoji">${signLanguageMap[char]}</span>`;
        } else {
            signHtml += `<span class="text-gray-400">${char}</span>`;
        }
    }

    signHtml += '</div>';
    output.innerHTML = signHtml;
}
