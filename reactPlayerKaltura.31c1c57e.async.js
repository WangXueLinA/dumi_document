(self.webpackChunkxuelin_dumi=self.webpackChunkxuelin_dumi||[]).push([[261],{73911:function(d,x,l){var y=Object.create,n=Object.defineProperty,m=Object.getOwnPropertyDescriptor,f=Object.getOwnPropertyNames,_=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty,v=(r,e,t)=>e in r?n(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t,b=(r,e)=>{for(var t in e)n(r,t,{get:e[t],enumerable:!0})},u=(r,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of f(e))!P.call(r,s)&&s!==t&&n(r,s,{get:()=>e[s],enumerable:!(o=m(e,s))||o.enumerable});return r},g=(r,e,t)=>(t=r!=null?y(_(r)):{},u(e||!r||!r.__esModule?n(t,"default",{value:r,enumerable:!0}):t,r)),O=r=>u(n({},"__esModule",{value:!0}),r),a=(r,e,t)=>(v(r,typeof e!="symbol"?e+"":e,t),t),p={};b(p,{default:()=>i}),d.exports=O(p);var h=g(l(67294)),c=l(38045),w=l(71776);const L="https://cdn.embed.ly/player-0.1.0.min.js",j="playerjs";class i extends h.Component{constructor(){super(...arguments),a(this,"callPlayer",c.callPlayer),a(this,"duration",null),a(this,"currentTime",null),a(this,"secondsLoaded",null),a(this,"mute",()=>{this.callPlayer("mute")}),a(this,"unmute",()=>{this.callPlayer("unmute")}),a(this,"ref",e=>{this.iframe=e})}componentDidMount(){this.props.onMount&&this.props.onMount(this)}load(e){(0,c.getSDK)(L,j).then(t=>{this.iframe&&(this.player=new t.Player(this.iframe),this.player.on("ready",()=>{setTimeout(()=>{this.player.isReady=!0,this.player.setLoop(this.props.loop),this.props.muted&&this.player.mute(),this.addListeners(this.player,this.props),this.props.onReady()},500)}))},this.props.onError)}addListeners(e,t){e.on("play",t.onPlay),e.on("pause",t.onPause),e.on("ended",t.onEnded),e.on("error",t.onError),e.on("timeupdate",({duration:o,seconds:s})=>{this.duration=o,this.currentTime=s})}play(){this.callPlayer("play")}pause(){this.callPlayer("pause")}stop(){}seekTo(e,t=!0){this.callPlayer("setCurrentTime",e),t||this.pause()}setVolume(e){this.callPlayer("setVolume",e)}setLoop(e){this.callPlayer("setLoop",e)}getDuration(){return this.duration}getCurrentTime(){return this.currentTime}getSecondsLoaded(){return this.secondsLoaded}render(){const e={width:"100%",height:"100%"};return h.default.createElement("iframe",{ref:this.ref,src:this.props.url,frameBorder:"0",scrolling:"no",style:e,allow:"encrypted-media; autoplay; fullscreen;",referrerPolicy:"no-referrer-when-downgrade"})}}a(i,"displayName","Kaltura"),a(i,"canPlay",w.canPlay.kaltura)}}]);
