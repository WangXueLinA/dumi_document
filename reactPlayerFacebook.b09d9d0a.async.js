!(function(){var M=Object.defineProperty;var P=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var m=(i,a,s)=>a in i?M(i,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):i[a]=s,g=(i,a)=>{for(var s in a||(a={}))j.call(a,s)&&m(i,s,a[s]);if(P)for(var s of P(a))C.call(a,s)&&m(i,s,a[s]);return i};(self.webpackChunkxuelin_dumi=self.webpackChunkxuelin_dumi||[]).push([[2121],{31972:function(i,a,s){var v=Object.create,p=Object.defineProperty,O=Object.getOwnPropertyDescriptor,D=Object.getOwnPropertyNames,E=Object.getPrototypeOf,I=Object.prototype.hasOwnProperty,S=(t,e,r)=>e in t?p(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,w=(t,e)=>{for(var r in e)p(t,r,{get:e[r],enumerable:!0})},h=(t,e,r,l)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of D(e))!I.call(t,o)&&o!==r&&p(t,o,{get:()=>e[o],enumerable:!(l=O(e,o))||l.enumerable});return t},x=(t,e,r)=>(r=t!=null?v(E(t)):{},h(e||!t||!t.__esModule?p(r,"default",{value:t,enumerable:!0}):r,t)),k=t=>h(p({},"__esModule",{value:!0}),t),n=(t,e,r)=>(S(t,typeof e!="symbol"?e+"":e,r),r),y={};w(y,{default:()=>c}),i.exports=k(y);var d=x(s(67294)),u=s(38045),L=s(71776);const f="https://connect.facebook.net/en_US/sdk.js",b="FB",_="fbAsyncInit",B="facebook-player-";class c extends d.Component{constructor(){super(...arguments),n(this,"callPlayer",u.callPlayer),n(this,"playerID",this.props.config.playerId||`${B}${(0,u.randomString)()}`),n(this,"mute",()=>{this.callPlayer("mute")}),n(this,"unmute",()=>{this.callPlayer("unmute")})}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e,r){if(r){(0,u.getSDK)(f,b,_).then(l=>l.XFBML.parse());return}(0,u.getSDK)(f,b,_).then(l=>{l.init({appId:this.props.config.appId,xfbml:!0,version:this.props.config.version}),l.Event.subscribe("xfbml.render",o=>{this.props.onLoaded()}),l.Event.subscribe("xfbml.ready",o=>{o.type==="video"&&o.id===this.playerID&&(this.player=o.instance,this.player.subscribe("startedPlaying",this.props.onPlay),this.player.subscribe("paused",this.props.onPause),this.player.subscribe("finishedPlaying",this.props.onEnded),this.player.subscribe("startedBuffering",this.props.onBuffer),this.player.subscribe("finishedBuffering",this.props.onBufferEnd),this.player.subscribe("error",this.props.onError),this.props.muted?this.callPlayer("mute"):this.callPlayer("unmute"),this.props.onReady(),document.getElementById(this.playerID).querySelector("iframe").style.visibility="visible")})})}play(){this.callPlayer("play")}pause(){this.callPlayer("pause")}stop(){}seekTo(e,r=!0){this.callPlayer("seek",e),r||this.pause()}setVolume(e){this.callPlayer("setVolume",e)}getDuration(){return this.callPlayer("getDuration")}getCurrentTime(){return this.callPlayer("getCurrentPosition")}getSecondsLoaded(){return null}render(){const{attributes:e}=this.props.config,r={width:"100%",height:"100%"};return d.default.createElement("div",g({style:r,id:this.playerID,className:"fb-video","data-href":this.props.url,"data-autoplay":this.props.playing?"true":"false","data-allowfullscreen":"true","data-controls":this.props.controls?"true":"false"},e))}}n(c,"displayName","Facebook"),n(c,"canPlay",L.canPlay.facebook),n(c,"loopOnEnded",!0)}}]);
}());