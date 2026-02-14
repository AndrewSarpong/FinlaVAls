const config = {
    // Sender and Recipient names
    senderName: "Anthony",
    recipientName: "My Valentine",

    // Date relationship started (YYYY-MM-DD) - used for the timer
    startDate: "2023-02-14",

    // Content for the "Digital Gift" menu
    giftContent: {
        letter: {
            roses: "My Dearest,\n\nEvery moment with you has been a gift. I created this little digital corner of the internet just for us, to celebrate our love and the memories we've made.\n\nYou are my favorite person, my best friend, and my Valentine forever.",
            stars: "To my shining star,\n\nIn the vast universe, I was lucky enough to find you. You light up my darkest nights and guide me home.\n\nOur love is written in the stars, eternal and bright.",
            hearts: "My Sweetheart,\n\nYou make my heart skip a beat every single day. Life is so much sweeter with you by my side.\n\nSending you all my love and a million hugs!",
            retro: "Player 1 to Player 2,\n\nPress Start to continue our adventure together. You are my high score, my best teammate, and my favorite glitch in the matrix.\n\nLet's level up together!",
            anime: "Senpai,\n\nJust like in my favorite anime, meeting you was destiny. You are the main character of my life's story.\n\nI promise to always be by your side, through every arc!"
        },
        
        gallery: [
            {
                img: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/PhotofromImageResizer(1).jpg",
                date: "The Beginning",
                caption: "Where it all started.",
                emotion: "I knew then that you were special."
            },
            {
                img: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/PhotofromImageResizer.jpg",
                date: "Personal Favorite",
                caption: "I'll explore the world with you.",
                emotion: "Every step is better by your side."
            },
            {
                img: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/PhotoImageResizer1.jpg",
                date: "Date",
                caption: "One of my favorite.",
                emotion: "Our first official date date 😂"
            },
            {
                img: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/ImageResizer4062.jpg",
                date: "Your favorite picture",
                caption: "I know you",
                emotion: "😂"
            },
            {
                img: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/ImageResizerSept162025.jpg",
                date: "Just Us",
                caption: "Quiet moments are my favorite.",
                emotion: "In your silence, I found my home."
            }
        ],
        
        vouchers: {
            romantic: [
                { title: "Movie Night 🎬", desc: "Valid for one cozy movie night with snacks of your choice." },
                { title: "Dinner Date 🍝", desc: "I'm cooking (or buying) your favorite meal!" },
                { title: "Back Massage 💆‍♀️", desc: "Redeemable anytime for a 15-minute massage." },
                { title: "Yes Day ✅", desc: "I have to say YES to everything for one whole day." }
            ],
            retro: [
                { title: "Arcade Date 🕹️", desc: "Unlimited tokens on me! Let's beat some high scores." },
                { title: "Mixtape 📼", desc: "I'll make a custom playlist of songs that remind me of you." },
                { title: "Drive-in Movie 🚗", desc: "Old school movie date with popcorn." },
                { title: "Milkshake for Two 🥤", desc: "Sharing a milkshake at a diner." }
            ],
            anime: [
                { title: "Anime Marathon 📺", desc: "We binge-watch an entire season together." },
                { title: "Ramen Date 🍜", desc: "My treat at the best noodle spot in town." },
                { title: "Manga Shopping 📚", desc: "I'll buy you that volume you've been wanting." },
                { title: "Convention Trip 🎫", desc: "Let's go to a con (or just dress up at home)!" }
            ]
        }
    },

    // The sequence of the story. You can add or remove objects from this array.
    // Types: 'landing', 'story', 'timer', 'proposal'
    pages: [
        {
            type: "landing",
            text: "Hey Cilla ❤️🫶🏾∞",
            subtext: "I have something special to tell you."
        },
        {
            type: "story",
            // Replace with your own image URLs or local file paths (e.g., 'images/us.jpg')
            // image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1000&auto=format&fit=crop",
            text: "Do you remember how long we've been together?",
            subtext: "It feels like just yesterday, yet I've known you forever."
        },
        {
            type: "timer",
            text: "We've been together for...",
            subtext: "And every second has been magical."
        },
        {
            type: "story",
            image: "https://github.com/AndrewSarpong/FinlaVAls/blob/6348647fc9efaf4e48c180a33d6774c66d576d52/PhotoJan172026fromImageResizer.jpg",
            text: "You make my world brighter.",
            subtext: "I can't imagine my life without you."
        },
        {
            type: "heart-meter",
            text: "How much do I love you?",
            subtext: "Tap the heart to find out! ❤️",
            requiredClicks: 10,
            messages: ["More...", "Keep going!", "Almost there!", "To the moon...", "And back! 🚀"]
        },
        {
            type: "quiz",
            question: "Where was our first photo taken?",
            choices: [
                { text: "At the park 🌳", response: "Close, but no!" },
                { text: "In the car 🚗", isCorrect: true, response: "Yes! You remember! 🥰" },
                { text: "At a cafe ☕", response: "I wish, but nope!" },
                { text: "On the moon 🌑", response: "Maybe one day..." }
            ]
        },
        {
            type: "scratch",
            text: "I have a secret note for you...",
            subtext: "Scratch the card below to reveal it! ✨",
            secretMessage: "You are my favorite person."
        },
        {
            type: "proposal",
            text: "So I have one important question...",
            question: "Will you be my Valentine? 💖"
        }
    ]

};
