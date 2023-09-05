const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const playList = $('.playlist')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('.progress')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Mặt trời của em',
            singer: 'Phương Ly ft JustaTee',
            path: './assets/song/MTCE.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/covers/1/9/19c8d9340b18111044e084d806335fd9_1509176983.jpg',
        },
        {
            name: 'Đã lỡ yêu em nhiều',
            singer: 'JustaTee ft Phương Ly',
            path: './assets/song/DLYEN.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/covers/d/a/dae7488899bf6ee55f4127cb6a889391_1510557125.jpg',
        },
        {
            name: 'Thằng điên',
            singer: 'JustaTee ft Phương Ly',
            path: './assets/song/TD.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/vi/2/20/JustaTee_-_Thang_dien.jpg',
        },
        {
            name: 'Anh là ai',
            singer: 'Phương Ly',
            path: './assets/song/ALA.mp3',
            image: 'https://i.ytimg.com/vi/MRQMyHV8L0Q/sddefault.jpg',
        },
        {
            name: 'Thích thích',
            singer: 'Phương Ly',
            path: './assets/song/TT.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/e/b/5/6/eb5692233f5bc2a24d20257430179e3c.jpg',
        },
        {
            name: 'Mượn rượu tỏ tình',
            singer: 'BIGDADDY x EMILY',
            path: './assets/song/MRTT.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/9/0/e/8/90e8e45930e5284bcb9950e2da970c57.jpg',
        },
        {
            name: 'Crying Over You',
            singer: 'JustaTee ft. Binz',
            path: './assets/song/COY.mp3',
            image: 'https://avatar-ex-swe.nixcdn.com/song/2023/04/21/2/1/7/d/1682067888912_640.jpg',
        },
    ],

    // Hiển thị danh sách các bài hát
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    // Định nghĩa các thuộc tính cho object
    definePropeties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lý các sự kiện  
    handleEvents: function() {
        const cdWidth = cd.offsetWidth

        // Xử lý quay và dừng đĩa 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })   
        cdThumbAnimate.pause()     

        // Xử lý scroll top
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play 
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Xử lý khi play bài hát
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Xử lý khi pause bài hát
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Xử lý khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý khi next bài hát
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.nextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý khi prev bài hát
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong()
            } else {
                app.prevSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        // Xử lý nút random bài hát khi click vào randomBtn
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            randomBtn.classList.toggle('active', app.isRandom)
        }

        // Xử lý next song khi audio kết thúc 
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý nút repeat khi click vào repeatBtn
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat
            repeatBtn.classList.toggle('active', app.isRepeat)
        }

        // Xử lý hành vi lắng nghe click vào playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // Xử lý khi click vào bài hát (playlist)
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index)
                    app.loadCurrentSong()
                    app.render()
                    audio.play()
                }
            }
        }
        
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest' 
            })
        }, 500)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Chạy ứng dụng
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.definePropeties()

        // Xử lý các sự kiện 
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên, in ra giao diện khi chạy ứng dụng
        this.loadCurrentSong()

        // Hiển thị danh sách các bài hát
        this.render()
    }
}

app.start()

console.log(12345)