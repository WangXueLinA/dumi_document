!(function(){var J=Object.defineProperty;var R=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,X=Object.prototype.propertyIsEnumerable;var U=(n,o,s)=>o in n?J(n,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[o]=s,g=(n,o)=>{for(var s in o||(o={}))W.call(o,s)&&U(n,s,o[s]);if(R)for(var s of R(o))X.call(o,s)&&U(n,s,o[s]);return n};(self.webpackChunkxuelin_dumi=self.webpackChunkxuelin_dumi||[]).push([[4439],{60356:function(n,o,s){var I=Object.create,u=Object.defineProperty,L=Object.getOwnPropertyDescriptor,k=Object.getOwnPropertyNames,M=Object.getPrototypeOf,N=Object.prototype.hasOwnProperty,V=(a,e,t)=>e in a?u(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,Y=(a,e)=>{for(var t in e)u(a,t,{get:e[t],enumerable:!0})},S=(a,e,t,c)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of k(e))!N.call(a,r)&&r!==t&&u(a,r,{get:()=>e[r],enumerable:!(c=L(e,r))||c.enumerable});return a},x=(a,e,t)=>(t=a!=null?I(M(a)):{},S(e||!a||!a.__esModule?u(t,"default",{value:a,enumerable:!0}):t,a)),B=a=>S(u({},"__esModule",{value:!0}),a),i=(a,e,t)=>(V(a,typeof e!="symbol"?e+"":e,t),t),D={};Y(D,{default:()=>O}),n.exports=B(D);var m=x(s(67294)),p=s(38045),E=s(71776);const j="https://www.youtube.com/iframe_api",A="YT",K="onYouTubeIframeAPIReady",d=/[?&](?:list|channel)=([a-zA-Z0-9_-]+)/,b=/user\/([a-zA-Z0-9_-]+)\/?/,H=/youtube-nocookie\.com/,F="https://www.youtube-nocookie.com";class O extends m.Component{constructor(){super(...arguments),i(this,"callPlayer",p.callPlayer),i(this,"parsePlaylist",e=>{if(e instanceof Array)return{listType:"playlist",playlist:e.map(this.getID).join(",")};if(d.test(e)){const[,t]=e.match(d);return{listType:"playlist",list:t.replace(/^UC/,"UU")}}if(b.test(e)){const[,t]=e.match(b);return{listType:"user_uploads",list:t}}return{}}),i(this,"onStateChange",e=>{const{data:t}=e,{onPlay:c,onPause:r,onBuffer:T,onBufferEnd:v,onEnded:w,onReady:C,loop:P,config:{playerVars:y,onUnstarted:f}}=this.props,{UNSTARTED:_,PLAYING:h,PAUSED:l,BUFFERING:G,ENDED:z,CUED:Q}=window[A].PlayerState;if(t===_&&f(),t===h&&(c(),v()),t===l&&r(),t===G&&T(),t===z){const Z=!!this.callPlayer("getPlaylist");P&&!Z&&(y.start?this.seekTo(y.start):this.play()),w()}t===Q&&C()}),i(this,"mute",()=>{this.callPlayer("mute")}),i(this,"unmute",()=>{this.callPlayer("unMute")}),i(this,"ref",e=>{this.container=e})}componentDidMount(){this.props.onMount&&this.props.onMount(this)}getID(e){return!e||e instanceof Array||d.test(e)?null:e.match(E.MATCH_URL_YOUTUBE)[1]}load(e,t){const{playing:c,muted:r,playsinline:T,controls:v,loop:w,config:C,onError:P}=this.props,{playerVars:y,embedOptions:f}=C,_=this.getID(e);if(t){if(d.test(e)||b.test(e)||e instanceof Array){this.player.loadPlaylist(this.parsePlaylist(e));return}this.player.cueVideoById({videoId:_,startSeconds:(0,p.parseStartTime)(e)||y.start,endSeconds:(0,p.parseEndTime)(e)||y.end});return}(0,p.getSDK)(j,A,K,h=>h.loaded).then(h=>{this.container&&(this.player=new h.Player(this.container,g({width:"100%",height:"100%",videoId:_,playerVars:g(g({autoplay:c?1:0,mute:r?1:0,controls:v?1:0,start:(0,p.parseStartTime)(e),end:(0,p.parseEndTime)(e),origin:window.location.origin,playsinline:T?1:0},this.parsePlaylist(e)),y),events:{onReady:()=>{w&&this.player.setLoop(!0),this.props.onReady()},onPlaybackRateChange:l=>this.props.onPlaybackRateChange(l.data),onPlaybackQualityChange:l=>this.props.onPlaybackQualityChange(l),onStateChange:this.onStateChange,onError:l=>P(l.data)},host:H.test(e)?F:void 0},f)))},P),f.events&&console.warn("Using `embedOptions.events` will likely break things. Use ReactPlayer\u2019s callback props instead, eg onReady, onPlay, onPause")}play(){this.callPlayer("playVideo")}pause(){this.callPlayer("pauseVideo")}stop(){document.body.contains(this.callPlayer("getIframe"))&&this.callPlayer("stopVideo")}seekTo(e,t=!1){this.callPlayer("seekTo",e),!t&&!this.props.playing&&this.pause()}setVolume(e){this.callPlayer("setVolume",e*100)}setPlaybackRate(e){this.callPlayer("setPlaybackRate",e)}setLoop(e){this.callPlayer("setLoop",e)}getDuration(){return this.callPlayer("getDuration")}getCurrentTime(){return this.callPlayer("getCurrentTime")}getSecondsLoaded(){return this.callPlayer("getVideoLoadedFraction")*this.getDuration()}render(){const{display:e}=this.props,t={width:"100%",height:"100%",display:e};return m.default.createElement("div",{style:t},m.default.createElement("div",{ref:this.ref}))}}i(O,"displayName","YouTube"),i(O,"canPlay",E.canPlay.youtube)}}]);
}());