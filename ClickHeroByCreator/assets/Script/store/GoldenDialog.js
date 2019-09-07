/*
 * @Author: xj 
 * @Date: 2019-09-03 22:20:57 
 * @Last Modified by: xj
 * @Last Modified time: 2019-09-03 22:29:19
 */


cc.Class({
    extends: cc.Component,

    properties: {
        spHead : cc.Sprite,
        lbName : cc.Label,
    },

    setHero(hero,heroListCtrl){
        this.lbName.string = hero.heroName
        this.spHead.getComponent("HeroIcon").setIcon(heroListCtrl, hero.id)
    },

    onClick () {
        this.node.destroy()
    },

})