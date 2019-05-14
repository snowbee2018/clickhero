// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    init() {
        this.openMusic(true);
        this.openEffect(true);
        // CloudRes.getMp3Url('login', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         cc.audioEngine.playMusic(clip, true);
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('bg', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.bgAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('hit', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.hitAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('bighit', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.bighitAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('getGoin', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.getGoinAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('btn', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.btnAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // CloudRes.getMp3Url('bg_boss', function (url) {
        //     cc.loader.load(url, function (err, clip) {
        //         this.bossAudioClip = clip;
        //     }.bind(this));
        // }.bind(this));
        // bg_boss
    },

    openMusic(bool) {
        cc.audioEngine.setVolume(bool ? 0.1 : 0);
    },

    openEffect(bool) {
        cc.audioEngine.setEffectsVolume(bool ? 0.4 : 0);
    },

    playBG() {
        if (this.bgAudioClip) {
            cc.audioEngine.playMusic(this.bgAudioClip, true);
        }
        else
        {
            CloudRes.getMp3Url('bg', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.bgAudioClip = clip;
                    cc.audioEngine.playMusic(this.bgAudioClip, true);
                }.bind(this));
            }.bind(this));
        }
    },

    playHit() {
        if (this.hitAudioClip) {
            cc.audioEngine.playEffect(this.hitAudioClip, false);
        }
        else
        {
            CloudRes.getMp3Url('hit', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.hitAudioClip = clip;
                    cc.audioEngine.playEffect(this.hitAudioClip, false);
                }.bind(this));
            }.bind(this));
        }
    },

    playBigHit() {
        if (this.bighitAudioClip) {
            cc.audioEngine.playEffect(this.bighitAudioClip, false);
        }
        else
        {
            CloudRes.getMp3Url('bighit', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.bighitAudioClip = clip;
                    cc.audioEngine.playEffect(this.bighitAudioClip, false);
                }.bind(this));
            }.bind(this));
        }
    },

    playGetGoin() {
        if (this.getGoinAudioClip) {
            cc.audioEngine.playEffect(this.getGoinAudioClip, false);
        }
        else
        {
            CloudRes.getMp3Url('getGoin', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.getGoinAudioClip = clip;
                    cc.audioEngine.playEffect(this.getGoinAudioClip, false);
                }.bind(this));
            }.bind(this));
        }
    },

    playBtn() {
        if (this.btnAudioClip) {
            cc.audioEngine.playEffect(this.btnAudioClip, false);
        }
        else{
            CloudRes.getMp3Url('btn', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.btnAudioClip = clip;
                }.bind(this));
            }.bind(this));
        }
    },

    playBoss() {
        if (this.bossAudioClip) {
            cc.audioEngine.playMusic(this.bossAudioClip, true);
        }
        else
        {
            CloudRes.getMp3Url('bg_boss', function (url) {
                cc.loader.load(url, function (err, clip) {
                    this.bossAudioClip = clip;
                    cc.audioEngine.playMusic(this.bossAudioClip, true);
                }.bind(this));
            }.bind(this));
        }
    },
});
